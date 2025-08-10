const { query, getClient } = require("../config/database");
const path = require("path");
const fs = require("fs").promises;

/**
 * @desc    Create a new ticket
 * @route   POST /api/tickets
 * @access  Private (Customer only)
 */
const createTicket = async (req, res) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const {
      bookingId,
      freelancerId,
      category,
      priority = "normal",
      summary,
      description,
      attachments = [],
    } = req.body;

    // Validate that customer owns the booking if booking_id is provided
    if (bookingId) {
      const bookingCheck = await client.query(
        "SELECT customer_id FROM bookings WHERE id = $1",
        [bookingId]
      );

      if (bookingCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Booking not found",
        });
      }

      if (bookingCheck.rows[0].customer_id !== req.user.id) {
        await client.query("ROLLBACK");
        return res.status(403).json({
          success: false,
          error: "You can only create tickets for your own bookings",
        });
      }
    }

    // Create the ticket
    const ticketResult = await client.query(
      `INSERT INTO tickets (customer_id, booking_id, freelancer_id, category, priority, summary, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.user.id,
        bookingId,
        freelancerId,
        category,
        priority,
        summary,
        description,
      ]
    );

    const ticket = ticketResult.rows[0];

    // Add initial message from customer
    const messageResult = await client.query(
      `INSERT INTO ticket_messages (ticket_id, user_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [ticket.id, req.user.id, description]
    );

    // Save attachments if provided
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        await client.query(
          `INSERT INTO ticket_attachments (ticket_id, message_id, filename, original_filename, file_size, mime_type, file_url, uploaded_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            ticket.id,
            messageResult.rows[0].id,
            attachment.filename,
            attachment.originalFilename,
            attachment.fileSize,
            attachment.mimeType,
            attachment.fileUrl,
            req.user.id,
          ]
        );
      }
    }

    // Add timeline entry
    await client.query(
      `INSERT INTO ticket_timeline (ticket_id, user_id, action_type, description)
       VALUES ($1, $2, 'created', 'Ticket created')`,
      [ticket.id, req.user.id]
    );

    // Notify all admins about new ticket
    const adminsResult = await client.query(
      "SELECT id FROM users WHERE role = 'admin' AND is_active = true"
    );

    for (const admin of adminsResult.rows) {
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          admin.id,
          `New Support Ticket #${ticket.id}`,
          `A new ${category.replace(
            "_",
            " "
          )} ticket has been created: ${summary}`,
          "ticket_created",
          JSON.stringify({
            ticketId: ticket.id,
            category,
            priority,
            customerId: req.user.id,
          }),
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      data: {
        ticket: {
          id: ticket.id,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          summary: ticket.summary,
          description: ticket.description,
          openedAt: ticket.opened_at,
          createdAt: ticket.created_at,
        },
      },
      message: "Ticket created successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create ticket error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating ticket",
    });
  } finally {
    client.release();
  }
};

/**
 * @desc    Get user's tickets
 * @route   GET /api/tickets
 * @access  Private
 */
const getTickets = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "";
    let queryParams = [];
    let paramCount = 0;

    // Build where clause based on user role
    if (req.user.role === "customer") {
      whereClause = "WHERE t.customer_id = $1";
      queryParams.push(req.user.id);
      paramCount = 1;
    } else if (req.user.role === "admin") {
      whereClause = "WHERE 1=1";
    } else {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Add filters
    if (status) {
      whereClause += ` AND t.status = $${++paramCount}`;
      queryParams.push(status);
    }

    if (category) {
      whereClause += ` AND t.category = $${++paramCount}`;
      queryParams.push(category);
    }

    const ticketsQuery = `
      SELECT 
        t.*,
        c.first_name as customer_first_name, c.last_name as customer_last_name, c.email as customer_email,
        f.first_name as freelancer_first_name, f.last_name as freelancer_last_name,
        a.first_name as admin_first_name, a.last_name as admin_last_name,
        b.booking_date, b.booking_time, s.name as service_name,
        COUNT(tm.id) as message_count
      FROM tickets t
      JOIN users c ON t.customer_id = c.id
      LEFT JOIN users f ON t.freelancer_id = f.id
      LEFT JOIN users a ON t.assigned_admin_id = a.id
      LEFT JOIN bookings b ON t.booking_id = b.id
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN ticket_messages tm ON t.id = tm.ticket_id
      ${whereClause}
      GROUP BY t.id, c.id, f.id, a.id, b.id, s.id
      ORDER BY t.priority DESC, t.opened_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    queryParams.push(limit, offset);

    const ticketsResult = await query(ticketsQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT t.id) as total
      FROM tickets t
      ${whereClause}
    `;

    const countResult = await query(
      countQuery,
      queryParams.slice(0, paramCount - 2)
    );
    const total = parseInt(countResult.rows[0].total);

    const tickets = ticketsResult.rows.map((ticket) => ({
      id: ticket.id,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      summary: ticket.summary,
      description: ticket.description,
      openedAt: ticket.opened_at,
      firstResponseAt: ticket.first_response_at,
      resolvedAt: ticket.resolved_at,
      closedAt: ticket.closed_at,
      messageCount: parseInt(ticket.message_count),
      customer: {
        firstName: ticket.customer_first_name,
        lastName: ticket.customer_last_name,
        email: ticket.customer_email,
      },
      freelancer: ticket.freelancer_id
        ? {
            firstName: ticket.freelancer_first_name,
            lastName: ticket.freelancer_last_name,
          }
        : null,
      assignedAdmin: ticket.assigned_admin_id
        ? {
            firstName: ticket.admin_first_name,
            lastName: ticket.admin_last_name,
          }
        : null,
      booking: ticket.booking_id
        ? {
            id: ticket.booking_id,
            date: ticket.booking_date,
            time: ticket.booking_time,
            serviceName: ticket.service_name,
          }
        : null,
    }));

    res.json({
      success: true,
      data: tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving tickets",
    });
  }
};

/**
 * @desc    Get ticket details with messages
 * @route   GET /api/tickets/:id
 * @access  Private
 */
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get ticket details
    const ticketResult = await query(
      `SELECT 
        t.*,
        c.first_name as customer_first_name, c.last_name as customer_last_name, 
        c.email as customer_email, c.phone as customer_phone,
        f.first_name as freelancer_first_name, f.last_name as freelancer_last_name,
        a.first_name as admin_first_name, a.last_name as admin_last_name,
        b.booking_date, b.booking_time, b.address, b.city, b.state, b.zip_code,
        s.name as service_name
      FROM tickets t
      JOIN users c ON t.customer_id = c.id
      LEFT JOIN users f ON t.freelancer_id = f.id
      LEFT JOIN users a ON t.assigned_admin_id = a.id
      LEFT JOIN bookings b ON t.booking_id = b.id
      LEFT JOIN services s ON b.service_id = s.id
      WHERE t.id = $1`,
      [id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Ticket not found",
      });
    }

    const ticket = ticketResult.rows[0];

    // Check permissions
    if (req.user.role === "customer" && ticket.customer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Get messages
    const messagesResult = await query(
      `SELECT 
        tm.*,
        u.first_name, u.last_name, u.role,
        json_agg(
          CASE WHEN ta.id IS NOT NULL THEN
            json_build_object(
              'id', ta.id,
              'filename', ta.original_filename,
              'fileSize', ta.file_size,
              'mimeType', ta.mime_type,
              'fileUrl', ta.file_url
            )
          END
        ) FILTER (WHERE ta.id IS NOT NULL) as attachments
      FROM ticket_messages tm
      JOIN users u ON tm.user_id = u.id
      LEFT JOIN ticket_attachments ta ON tm.id = ta.message_id
      WHERE tm.ticket_id = $1
      GROUP BY tm.id, u.id
      ORDER BY tm.created_at ASC`,
      [id]
    );

    // Get timeline
    const timelineResult = await query(
      `SELECT 
        tl.*,
        u.first_name, u.last_name, u.role
      FROM ticket_timeline tl
      LEFT JOIN users u ON tl.user_id = u.id
      WHERE tl.ticket_id = $1
      ORDER BY tl.created_at ASC`,
      [id]
    );

    const ticketData = {
      id: ticket.id,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      summary: ticket.summary,
      description: ticket.description,
      internalNotes: ticket.internal_notes,
      openedAt: ticket.opened_at,
      firstResponseAt: ticket.first_response_at,
      resolvedAt: ticket.resolved_at,
      closedAt: ticket.closed_at,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
      customer: {
        id: ticket.customer_id,
        firstName: ticket.customer_first_name,
        lastName: ticket.customer_last_name,
        email: ticket.customer_email,
        phone: ticket.customer_phone,
      },
      freelancer: ticket.freelancer_id
        ? {
            id: ticket.freelancer_id,
            firstName: ticket.freelancer_first_name,
            lastName: ticket.freelancer_last_name,
          }
        : null,
      assignedAdmin: ticket.assigned_admin_id
        ? {
            id: ticket.assigned_admin_id,
            firstName: ticket.admin_first_name,
            lastName: ticket.admin_last_name,
          }
        : null,
      booking: ticket.booking_id
        ? {
            id: ticket.booking_id,
            date: ticket.booking_date,
            time: ticket.booking_time,
            address: ticket.address,
            city: ticket.city,
            state: ticket.state,
            zipCode: ticket.zip_code,
            serviceName: ticket.service_name,
          }
        : null,
      messages: messagesResult.rows.map((msg) => ({
        id: msg.id,
        message: msg.message,
        isInternal: msg.is_internal,
        attachments: msg.attachments || [],
        createdAt: msg.created_at,
        user: {
          firstName: msg.first_name,
          lastName: msg.last_name,
          role: msg.role,
        },
      })),
      timeline: timelineResult.rows.map((tl) => ({
        id: tl.id,
        actionType: tl.action_type,
        oldValue: tl.old_value,
        newValue: tl.new_value,
        description: tl.description,
        createdAt: tl.created_at,
        user: tl.user_id
          ? {
              firstName: tl.first_name,
              lastName: tl.last_name,
              role: tl.role,
            }
          : null,
      })),
    };

    res.json({
      success: true,
      data: ticketData,
    });
  } catch (error) {
    console.error("Get ticket by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving ticket",
    });
  }
};

/**
 * @desc    Add message to ticket
 * @route   POST /api/tickets/:id/messages
 * @access  Private
 */
const addTicketMessage = async (req, res) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { message, isInternal = false, attachments = [] } = req.body;

    // Check ticket exists and permissions
    const ticketResult = await client.query(
      "SELECT customer_id, status FROM tickets WHERE id = $1",
      [id]
    );

    if (ticketResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Ticket not found",
      });
    }

    const ticket = ticketResult.rows[0];

    // Check permissions
    if (req.user.role === "customer" && ticket.customer_id !== req.user.id) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Only admins can add internal messages
    if (isInternal && req.user.role !== "admin") {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "Only admins can add internal notes",
      });
    }

    // Add message
    const messageResult = await client.query(
      `INSERT INTO ticket_messages (ticket_id, user_id, message, is_internal)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, req.user.id, message, isInternal]
    );

    const newMessage = messageResult.rows[0];

    // Save attachments if provided
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        await client.query(
          `INSERT INTO ticket_attachments (ticket_id, message_id, filename, original_filename, file_size, mime_type, file_url, uploaded_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            id,
            newMessage.id,
            attachment.filename,
            attachment.originalFilename,
            attachment.fileSize,
            attachment.mimeType,
            attachment.fileUrl,
            req.user.id,
          ]
        );
      }
    }

    // Update first response time if this is first admin response
    if (req.user.role === "admin" && !ticket.first_response_at) {
      await client.query(
        "UPDATE tickets SET first_response_at = CURRENT_TIMESTAMP WHERE id = $1",
        [id]
      );
    }

    // Add timeline entry
    await client.query(
      `INSERT INTO ticket_timeline (ticket_id, user_id, action_type, description)
       VALUES ($1, $2, 'message_added', $3)`,
      [id, req.user.id, isInternal ? "Internal note added" : "Message added"]
    );

    // Send notifications (skip if internal message)
    if (!isInternal) {
      if (req.user.role === "admin") {
        // Notify customer
        await client.query(
          `INSERT INTO notifications (user_id, title, message, type, metadata)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            ticket.customer_id,
            `Support Ticket #${id} - New Response`,
            "An admin has responded to your support ticket",
            "ticket_response",
            JSON.stringify({ ticketId: id }),
          ]
        );
      } else {
        // Notify assigned admin or all admins
        const adminQuery = ticket.assigned_admin_id
          ? "SELECT id FROM users WHERE id = $1"
          : "SELECT id FROM users WHERE role = 'admin' AND is_active = true";
        const adminParams = ticket.assigned_admin_id
          ? [ticket.assigned_admin_id]
          : [];

        const adminsResult = await client.query(adminQuery, adminParams);

        for (const admin of adminsResult.rows) {
          await client.query(
            `INSERT INTO notifications (user_id, title, message, type, metadata)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              admin.id,
              `Support Ticket #${id} - Customer Response`,
              "A customer has responded to a support ticket",
              "ticket_response",
              JSON.stringify({ ticketId: id, customerId: req.user.id }),
            ]
          );
        }
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      data: {
        message: {
          id: newMessage.id,
          message: newMessage.message,
          isInternal: newMessage.is_internal,
          createdAt: newMessage.created_at,
        },
      },
      message: "Message added successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Add ticket message error:", error);
    res.status(500).json({
      success: false,
      error: "Server error adding message",
    });
  } finally {
    client.release();
  }
};

/**
 * @desc    Update ticket status/priority (Admin only)
 * @route   PUT /api/tickets/:id
 * @access  Private (Admin only)
 */
const updateTicket = async (req, res) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { status, priority, assignedAdminId, internalNotes, resolution } =
      req.body;

    // Get current ticket
    const currentTicketResult = await client.query(
      "SELECT * FROM tickets WHERE id = $1",
      [id]
    );

    if (currentTicketResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Ticket not found",
      });
    }

    const currentTicket = currentTicketResult.rows[0];
    const updates = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    if (status && status !== currentTicket.status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);

      // Set resolved/closed timestamps
      if (status === "resolved" && !currentTicket.resolved_at) {
        updates.push(`resolved_at = CURRENT_TIMESTAMP`);
      }
      if (status === "closed" && !currentTicket.closed_at) {
        updates.push(`closed_at = CURRENT_TIMESTAMP`);
      }

      // Add timeline entry for status change
      await client.query(
        `INSERT INTO ticket_timeline (ticket_id, user_id, action_type, old_value, new_value, description)
         VALUES ($1, $2, 'status_changed', $3, $4, 'Status updated')`,
        [id, req.user.id, currentTicket.status, status]
      );
    }

    if (priority && priority !== currentTicket.priority) {
      updates.push(`priority = $${paramCount++}`);
      values.push(priority);

      // Add timeline entry for priority change
      await client.query(
        `INSERT INTO ticket_timeline (ticket_id, user_id, action_type, old_value, new_value, description)
         VALUES ($1, $2, 'priority_changed', $3, $4, 'Priority updated')`,
        [id, req.user.id, currentTicket.priority, priority]
      );
    }

    if (
      assignedAdminId !== undefined &&
      assignedAdminId !== currentTicket.assigned_admin_id
    ) {
      updates.push(`assigned_admin_id = $${paramCount++}`);
      values.push(assignedAdminId);

      // Add timeline entry for assignment change
      const oldAdminName = currentTicket.assigned_admin_id
        ? await getAdminName(currentTicket.assigned_admin_id)
        : "Unassigned";
      const newAdminName = assignedAdminId
        ? await getAdminName(assignedAdminId)
        : "Unassigned";

      await client.query(
        `INSERT INTO ticket_timeline (ticket_id, user_id, action_type, old_value, new_value, description)
         VALUES ($1, $2, 'assigned', $3, $4, 'Assignment updated')`,
        [id, req.user.id, oldAdminName, newAdminName]
      );
    }

    if (internalNotes !== undefined) {
      updates.push(`internal_notes = $${paramCount++}`);
      values.push(internalNotes);
    }

    if (updates.length > 0) {
      values.push(id);
      const updateQuery = `
        UPDATE tickets 
        SET ${updates.join(", ")} 
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const updatedTicketResult = await client.query(updateQuery, values);
      const updatedTicket = updatedTicketResult.rows[0];

      // If resolution provided and status is resolved/closed, add resolution message
      if (resolution && (status === "resolved" || status === "closed")) {
        await client.query(
          `INSERT INTO ticket_messages (ticket_id, user_id, message, is_internal)
           VALUES ($1, $2, $3, $4)`,
          [id, req.user.id, `Resolution: ${resolution}`, false]
        );
      }

      // Send notification to customer about status change
      if (status && status !== currentTicket.status) {
        await client.query(
          `INSERT INTO notifications (user_id, title, message, type, metadata)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            currentTicket.customer_id,
            `Support Ticket #${id} - Status Updated`,
            `Your ticket status has been updated to: ${status.replace(
              "_",
              " "
            )}`,
            "ticket_status_updated",
            JSON.stringify({ ticketId: id, newStatus: status }),
          ]
        );
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        data: {
          ticket: {
            id: updatedTicket.id,
            status: updatedTicket.status,
            priority: updatedTicket.priority,
            assignedAdminId: updatedTicket.assigned_admin_id,
            internalNotes: updatedTicket.internal_notes,
            resolvedAt: updatedTicket.resolved_at,
            closedAt: updatedTicket.closed_at,
            updatedAt: updatedTicket.updated_at,
          },
        },
        message: "Ticket updated successfully",
      });
    } else {
      await client.query("ROLLBACK");
      res.status(400).json({
        success: false,
        error: "No updates provided",
      });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update ticket error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating ticket",
    });
  } finally {
    client.release();
  }
};

/**
 * @desc    Get ticket statistics (Admin only)
 * @route   GET /api/tickets/stats
 * @access  Private (Admin only)
 */
const getTicketStats = async (req, res) => {
  try {
    // Overall stats
    const overallStats = await query(`
      SELECT 
        COUNT(*) as total_tickets,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tickets,
        COUNT(CASE WHEN status = 'waiting_customer' THEN 1 END) as waiting_customer_tickets,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets,
        COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_tickets,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_tickets,
        COUNT(CASE WHEN opened_at >= NOW() - INTERVAL '7 days' THEN 1 END) as tickets_this_week,
        COUNT(CASE WHEN opened_at >= NOW() - INTERVAL '30 days' THEN 1 END) as tickets_this_month
      FROM tickets
    `);

    // Category breakdown
    const categoryStats = await query(`
      SELECT 
        category,
        COUNT(*) as count,
        COUNT(CASE WHEN status IN ('resolved', 'closed') THEN 1 END) as resolved_count
      FROM tickets
      GROUP BY category
      ORDER BY count DESC
    `);

    // Average response and resolution times
    const timeStats = await query(`
      SELECT 
        AVG(EXTRACT(EPOCH FROM (first_response_at - opened_at))/3600) as avg_first_response_hours,
        AVG(EXTRACT(EPOCH FROM (resolved_at - opened_at))/3600) as avg_resolution_hours,
        AVG(EXTRACT(EPOCH FROM (closed_at - opened_at))/3600) as avg_closure_hours
      FROM tickets
      WHERE first_response_at IS NOT NULL OR resolved_at IS NOT NULL OR closed_at IS NOT NULL
    `);

    // Admin workload
    const adminStats = await query(`
      SELECT 
        u.id, u.first_name, u.last_name,
        COUNT(t.id) as assigned_tickets,
        COUNT(CASE WHEN t.status IN ('open', 'in_progress', 'waiting_customer') THEN 1 END) as open_assigned_tickets
      FROM users u
      LEFT JOIN tickets t ON u.id = t.assigned_admin_id
      WHERE u.role = 'admin' AND u.is_active = true
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY assigned_tickets DESC
    `);

    res.json({
      success: true,
      data: {
        overall: overallStats.rows[0],
        categories: categoryStats.rows,
        timings: timeStats.rows[0],
        adminWorkload: adminStats.rows,
      },
    });
  } catch (error) {
    console.error("Get ticket stats error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving ticket statistics",
    });
  }
};

// Helper function to get admin name
const getAdminName = async (adminId) => {
  const result = await query(
    "SELECT first_name, last_name FROM users WHERE id = $1",
    [adminId]
  );
  if (result.rows.length > 0) {
    const admin = result.rows[0];
    return `${admin.first_name} ${admin.last_name}`;
  }
  return "Unknown";
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  addTicketMessage,
  updateTicket,
  getTicketStats,
};
