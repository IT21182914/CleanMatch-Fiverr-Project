const { query, getClient } = require("../config/database");
const {
  autoAssignCleaner,
  performAutoAssignment,
  getCleanerRecommendations,
} = require("../utils/matchCleaner");
const {
  createPaymentIntent,
  createStripeCustomer,
} = require("../utils/stripe");
const { recordMembershipUsage } = require("./membershipController");
const {
  checkFirstCleanEligibilityInternal,
  recordOfferUsage,
} = require("./offersController");

/**
 * Helper function to combine booking date and time into ISO datetime string
 */
const combineDateTime = (bookingDate, bookingTime) => {
  if (!bookingDate || !bookingTime) return null;

  // If bookingDate is a Date object, format it to YYYY-MM-DD
  let dateStr;
  if (bookingDate instanceof Date) {
    // Extract date in YYYY-MM-DD format
    const year = bookingDate.getFullYear();
    const month = (bookingDate.getMonth() + 1).toString().padStart(2, "0");
    const day = bookingDate.getDate().toString().padStart(2, "0");
    dateStr = `${year}-${month}-${day}`;
  } else {
    // Assume it's already a string in YYYY-MM-DD format
    dateStr = bookingDate;
  }

  return `${dateStr}T${bookingTime}`;
};

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private (Customers only)
 */
const createBooking = async (req, res) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const {
      serviceId,
      bookingDate,
      bookingTime,
      durationHours,
      specialInstructions,
      address,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      locationMethod,
      postalCode,
      autoAssign = false,
    } = req.body;

    // Handle location data based on location method
    let finalLatitude = null;
    let finalLongitude = null;
    let finalPostalCode = null;

    if (locationMethod === "gps") {
      // For GPS method
      finalLatitude = latitude;
      finalLongitude = longitude;
      finalPostalCode = null;
    } else if (locationMethod === "postal") {
      // For postal method
      finalPostalCode = postalCode;
      finalLatitude = null;
      finalLongitude = null;
    }

    // Get user details
    const userResult = await client.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Get service details
    const serviceResult = await client.query(
      "SELECT * FROM services WHERE id = $1 AND is_active = true",
      [serviceId]
    );

    if (serviceResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    // Check for active membership of user
    const membershipResult = await client.query(
      `SELECT * FROM memberships
      WHERE user_id = $1 AND status = 'active'
      AND current_period_end > NOW()`,
      [userResult.rows[0].id]
    );

    const service = serviceResult.rows[0];
    const user = userResult.rows[0];
    const membership = membershipResult.rows[0];

    let membershipId = null;
    let membershipDiscount = 0.0;
    let totalAmount = 0.0;
    let baseAmount = 0.0;

    try {
      baseAmount = parseFloat(service.base_price);
    } catch (error) {
      console.error("Error parsing base amount:", error);
      return res.status(400).json({
        success: false,
        error: "Error parsing base amount.",
      });
    }

    // Calculate base amount for membership
    if (membership) {
      try {
        membershipId = membership.id;
        membershipDiscount = baseAmount / 2.0;
        totalAmount = membershipDiscount * durationHours;
      } catch (error) {
        console.error("Error calculating base amount:", error);
        return res.status(400).json({
          success: false,
          error: "Error calculating base amount:",
        });
      }
    } else {
      totalAmount = baseAmount * durationHours;
    }

    // Create booking
    const bookingResult = await client.query(
      `INSERT INTO bookings (
        customer_id, service_id, booking_date, booking_time, duration_hours,
        total_amount, special_instructions, address, city, state, zip_code,
        latitude, longitude, location_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        req.user.id,
        serviceId,
        bookingDate,
        bookingTime,
        durationHours,
        totalAmount,
        specialInstructions,
        address,
        city,
        state,
        finalPostalCode,
        finalLatitude,
        finalLongitude,
        locationMethod,
      ]
    );

    const booking = bookingResult.rows[0];

    let assignedCleaner = null;
    let assignmentResult = null;

    // Auto-assign cleaner if requested
    if (autoAssign) {
      try {
        const bookingDetails = {
          latitude: finalLatitude,
          longitude: finalLongitude,
          bookingDate,
          bookingTime,
          durationHours,
          serviceId,
          zipCode,
          address,
          city,
          state,
        };

        const customerInfo = {
          id: req.user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
        };

        // Use enhanced auto-assignment with notifications
        assignmentResult = await performAutoAssignment(
          booking.id,
          bookingDetails,
          customerInfo
        );

        if (assignmentResult.success) {
          assignedCleaner = assignmentResult.cleaner;
          booking.cleaner_id = assignedCleaner.id;
          booking.status = "confirmed";
          booking.assignment_score = assignmentResult.assignmentScore;
        } else {
          booking.status = "pending_assignment";
        }
      } catch (error) {
        console.error("Auto-assignment error:", error);
        booking.status = "pending_assignment";
      }
    }

    // Create Stripe customer if needed (but don't create payment intent yet)
    try {
      const stripeCustomerId = await createStripeCustomer(user);

      // Update user with Stripe customer ID if needed
      if (!user.stripe_customer_id) {
        await client.query(
          "UPDATE users SET stripe_customer_id = $1 WHERE id = $2",
          [stripeCustomerId, req.user.id]
        );
      }

      console.log(
        `Created/retrieved Stripe customer ID for user ${req.user.id}: ${stripeCustomerId}`
      );
    } catch (error) {
      console.error("Stripe customer creation error:", error);
      // Continue without Stripe customer ID - it can be created later during payment
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...booking,
        service_name: service.name,
        pricing_breakdown: {
          base_amount: Math.round(baseAmount * 100) / 100,
          membership_discount: Math.round(membershipDiscount * 100) / 100,
        },
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating booking",
    });
  } finally {
    client.release();
  }
};

/**
 * @desc    Get booking details
 * @route   GET /api/bookings/:id
 * @access  Private
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const bookingResult = await query(
      `SELECT 
        b.*, s.name as service_name, s.category as service_category, s.base_price as service_base_price,
        customer.first_name as customer_first_name, customer.last_name as customer_last_name,
        customer.email as customer_email, customer.phone as customer_phone,
        cleaner.first_name as cleaner_first_name, cleaner.last_name as cleaner_last_name,
        cleaner.email as cleaner_email, cleaner.phone as cleaner_phone,
        cp.rating as cleaner_rating, cp.hourly_rate as cleaner_hourly_rate,
        m.id as membership_id, m.status as membership_status,
        r.id as review_id, r.rating as review_rating, r.comment as review_comment, r.created_at as review_created_at
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN users customer ON b.customer_id = customer.id
       LEFT JOIN users cleaner ON b.cleaner_id = cleaner.id
       LEFT JOIN cleaner_profiles cp ON cleaner.id = cp.user_id
       LEFT JOIN memberships m ON customer.id = m.user_id AND m.status = 'active' AND m.current_period_end > NOW()
       LEFT JOIN reviews r ON b.id = r.booking_id AND r.customer_id = b.customer_id
       WHERE b.id = $1`,
      [id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // Check if user has permission to view this booking
    if (req.user.role === "customer" && booking.customer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    if (req.user.role === "cleaner" && booking.cleaner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Format the response with better structure
    // Combine booking_date and booking_time into a single datetime
    const combinedDateTime = combineDateTime(
      booking.booking_date,
      booking.booking_time
    );

    // Calculate pricing breakdown
    let baseAmount = 0;
    let membershipDiscount = 0;
    let calculatedTotalAmount = 0;
    const hasMembership =
      booking.membership_id !== null && booking.membership_status === "active";

    try {
      baseAmount = parseFloat(booking.service_base_price);
      const durationHours = parseFloat(booking.duration_hours);

      // Calculate original full price (base_amount * duration)
      const originalFullPrice = baseAmount * durationHours;

      // If user has active membership, they get 50% discount
      if (hasMembership) {
        membershipDiscount = baseAmount / 2.0;
        // Calculate the discounted total - only pay half of base amount
        calculatedTotalAmount = membershipDiscount * durationHours;
      } else {
        // No membership, pay full amount
        calculatedTotalAmount = originalFullPrice;
      }
    } catch (error) {
      console.error("Error calculating pricing breakdown:", error);
      // Fallback to the stored amount in case of calculation error
      calculatedTotalAmount = parseFloat(booking.total_amount);
    }

    const formattedBooking = {
      id: booking.id,
      customerId: booking.customer_id,
      cleanerId: booking.cleaner_id,
      serviceId: booking.service_id,
      bookingDate: combinedDateTime,
      bookingTime: booking.booking_time,
      durationHours: booking.duration_hours,
      // If user has a membership now, use the calculated discounted amount
      // otherwise, use the stored amount from the database
      totalAmount: hasMembership ? calculatedTotalAmount : booking.total_amount,
      originalTotalAmount: booking.total_amount, // Keep the original for reference
      status: booking.status,
      paymentStatus: booking.payment_status,
      address: booking.address,
      city: booking.city,
      state: booking.state,
      zipCode: booking.zip_code,
      specialInstructions: booking.special_instructions,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
      service: {
        name: booking.service_name,
        category: booking.service_category,
        basePrice: booking.service_base_price,
      },
      customer: {
        firstName: booking.customer_first_name,
        lastName: booking.customer_last_name,
        email: booking.customer_email,
        phone: booking.customer_phone,
      },
      cleaner: booking.cleaner_id
        ? {
            firstName: booking.cleaner_first_name,
            lastName: booking.cleaner_last_name,
            email: booking.cleaner_email,
            phone: booking.cleaner_phone,
            rating: booking.cleaner_rating,
            hourlyRate: booking.cleaner_hourly_rate,
          }
        : null,
      pricing_breakdown: {
        base_amount: Math.round(baseAmount * 100) / 100,
        membership_discount: Math.round(membershipDiscount * 100) / 100,
        hours: booking.duration_hours,
        hourly_rate: baseAmount,
        discounted_hourly_rate: hasMembership
          ? baseAmount - membershipDiscount
          : baseAmount,
        original_total:
          Math.round(parseFloat(booking.total_amount) * 100) / 100,
        calculated_total: Math.round(calculatedTotalAmount * 100) / 100,
        discount_applied: hasMembership,
        discount_percentage: hasMembership ? 50 : 0,
      },
      hasMembership: hasMembership,
      membershipAppliedAfterBooking:
        hasMembership &&
        calculatedTotalAmount !== parseFloat(booking.total_amount),
      review: booking.review_id
        ? {
            id: booking.review_id,
            rating: booking.review_rating,
            comment: booking.review_comment,
            createdAt: booking.review_created_at,
          }
        : null,
    };

    res.json({
      success: true,
      data: formattedBooking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving booking",
    });
  }
};

/**
 * @desc    Update booking status
 * @route   PUT /api/bookings/:id/status
 * @access  Private
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    // Get booking details
    const bookingResult = await query("SELECT * FROM bookings WHERE id = $1", [
      id,
    ]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // Check permissions
    let hasPermission = false;

    if (req.user.role === "admin") {
      hasPermission = true;
    } else if (
      req.user.role === "customer" &&
      booking.customer_id === req.user.id
    ) {
      // Customers can only cancel their bookings
      hasPermission = status === "cancelled";
    } else if (
      req.user.role === "cleaner" &&
      booking.cleaner_id === req.user.id
    ) {
      // Cleaners can update to confirmed, in_progress, or completed
      hasPermission = ["confirmed", "in_progress", "completed"].includes(
        status
      );
    }

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: "Access denied for this status update",
      });
    }

    // Update booking status
    await query(
      "UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [status, id]
    );

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating booking status",
    });
  }
};

/**
 * @desc    Update booking payment status
 * @route   PUT /api/bookings/:id/payment-status
 * @access  Private
 */
const updateBookingPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    console.log("Payment status update request:", paymentStatus);

    const validStatuses = ["pending", "paid"];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    // Get booking details
    const bookingResult = await query("SELECT * FROM bookings WHERE id = $1", [
      id,
    ]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // Check permissions
    let hasPermission = false;

    if (req.user.role === "admin") {
      hasPermission = true;
    } else if (
      req.user.role === "customer" &&
      booking.customer_id === req.user.id
    ) {
      hasPermission = true;
    }

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: "Access denied for this status update",
      });
    }

    // Check for active membership if payment status is being set to paid
    if (paymentStatus === "paid") {
      // Get membership information
      const membershipResult = await query(
        `
        SELECT m.id, m.status
        FROM memberships m
        WHERE m.user_id = $1 
        AND m.status = 'active' 
        AND m.current_period_end > NOW()
      `,
        [booking.customer_id]
      );

      const hasMembership = membershipResult.rows.length > 0;

      if (hasMembership && !booking.membership_discount_applied) {
        try {
          // Get service details to calculate discount
          const serviceResult = await query(
            `
            SELECT base_price FROM services WHERE id = $1
          `,
            [booking.service_id]
          );

          if (serviceResult.rows.length > 0) {
            const basePrice = parseFloat(serviceResult.rows[0].base_price);
            const durationHours = parseFloat(booking.duration_hours);
            const originalAmount = parseFloat(booking.total_amount);

            // Calculate discounted amount (50% discount)
            const membershipDiscount = basePrice / 2.0;
            const discountedAmount = membershipDiscount * durationHours;

            // Update booking with discounted amount and mark membership as applied
            await query(
              `
              UPDATE bookings 
              SET payment_status = $1, 
                  total_amount = $2,
                  membership_discount_applied = true,
                  updated_at = CURRENT_TIMESTAMP 
              WHERE id = $3
            `,
              [paymentStatus, discountedAmount, id]
            );

            // Record membership usage
            const { recordMembershipUsage } = require("./membershipController");
            await recordMembershipUsage(
              membershipResult.rows[0].id,
              booking.id,
              originalAmount,
              discountedAmount
            );

            console.log(
              `Membership discount applied during payment status update. Original amount: ${originalAmount}, Discounted: ${discountedAmount}`
            );

            res.json({
              success: true,
              message: `Booking payment status updated to ${paymentStatus} with membership discount applied`,
              originalAmount,
              discountedAmount,
              membershipApplied: true,
            });
            return;
          }
        } catch (error) {
          console.error("Error applying membership discount:", error);
          // Fall through to standard update if discount calculation fails
        }
      }
    }

    // Standard update without membership discount
    await query(
      "UPDATE bookings SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [paymentStatus, id]
    );

    res.json({
      success: true,
      message: `Booking payment status updated to ${paymentStatus}`,
    });
  } catch (error) {
    console.error("Update booking payment status error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating booking payment status",
    });
  }
};

/**
 * @desc    Manually assign cleaner to booking (Admin override)
 * @route   POST /api/bookings/:id/assign
 * @access  Private (Admin or Customer)
 */
const assignCleanerToBooking = async (req, res) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    console.log("bodyyou", req.body);
    const { cleanerId, overrideReason } = req.body;

    // Get booking details
    const bookingResult = await client.query(
      "SELECT * FROM bookings WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // Check permissions
    if (req.user.role === "customer" && booking.customer_id !== req.user.id) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    if (req.user.role !== "admin" && req.user.role !== "customer") {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Verify cleaner exists and is available
    const cleanerResult = await client.query(
      `SELECT u.*, cp.is_available, cp.availability_schedule FROM users u
       JOIN cleaner_profiles cp ON u.id = cp.user_id
       WHERE u.id = $1 AND u.role = 'cleaner' AND u.is_active = true FOR UPDATE`,
      [cleanerId]
    );

    if (cleanerResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Cleaner not found or not available",
      });
    }

    const cleaner = cleanerResult.rows[0];

    // For admin overrides, allow assignment even if cleaner appears unavailable
    // but still check for hard conflicts
    if (!cleaner.is_available && req.user.role !== "admin") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Cleaner is currently not available",
      });
    }

    // Check for hard scheduling conflicts
    const conflictQuery = `
      SELECT id, customer_id FROM bookings 
      WHERE cleaner_id = $1 
        AND booking_date = $2 
        AND status NOT IN ('cancelled', 'completed', 'no_show')
        AND id != $3
        AND (
          ($4::time >= booking_time AND $4::time < (booking_time + INTERVAL '1 hour' * duration_hours))
          OR
          (($4::time + INTERVAL '1 hour' * $5) > booking_time AND ($4::time + INTERVAL '1 hour' * $5) <= (booking_time + INTERVAL '1 hour' * duration_hours))
          OR
          ($4::time <= booking_time AND ($4::time + INTERVAL '1 hour' * $5) >= (booking_time + INTERVAL '1 hour' * duration_hours))
        )
    `;

    const conflictResult = await client.query(conflictQuery, [
      cleanerId,
      booking.booking_date,
      id,
      booking.booking_time,
      booking.duration_hours,
    ]);

    if (conflictResult.rows.length > 0 && req.user.role !== "admin") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Cleaner has a conflicting booking at that time",
        conflictingBookings: conflictResult.rows.length,
      });
    }

    // Record the old cleaner for notification purposes
    const oldCleanerId = booking.cleaner_id;

    // Update booking with assigned cleaner
    const updateQuery =
      req.user.role === "admin"
        ? `UPDATE bookings SET 
         cleaner_id = $1, 
         status = $2, 
         assigned_at = CURRENT_TIMESTAMP,
         assigned_by_admin = true,
         admin_override_reason = $4,
         updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3`
        : `UPDATE bookings SET 
         cleaner_id = $1, 
         status = $2, 
         assigned_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3`;

    const updateParams =
      req.user.role === "admin"
        ? [
            cleanerId,
            "confirmed",
            id,
            overrideReason || "Manual admin assignment",
          ]
        : [cleanerId, "confirmed", id];

    await client.query(updateQuery, updateParams);

    // Send notifications
    const customerResult = await client.query(
      "SELECT first_name, last_name, email FROM users WHERE id = $1",
      [booking.customer_id]
    );
    const customer = customerResult.rows[0];

    // Notify new cleaner
    await client.query(
      `INSERT INTO notifications (user_id, title, message, type, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        cleanerId,
        "New Booking Assignment",
        `You have been ${
          req.user.role === "admin"
            ? "manually assigned by admin to"
            : "assigned to"
        } a cleaning job for ${booking.booking_date} at ${
          booking.booking_time
        }.`,
        "new_assignment",
        JSON.stringify({
          bookingId: id,
          customerName: `${customer.first_name} ${customer.last_name}`,
          isAdminOverride: req.user.role === "admin",
          assignedBy: `${req.user.first_name} ${req.user.last_name}`,
          overrideReason: overrideReason || null,
        }),
      ]
    );

    // Notify customer about assignment change
    if (oldCleanerId !== cleanerId) {
      const notificationMessage = oldCleanerId
        ? `Your cleaner has been updated to ${cleaner.first_name} ${cleaner.last_name} for your booking on ${booking.booking_date}.`
        : `Great news! ${cleaner.first_name} ${cleaner.last_name} has been assigned to your booking on ${booking.booking_date}.`;

      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          booking.customer_id,
          oldCleanerId ? "Cleaner Updated" : "Cleaner Assigned",
          notificationMessage,
          "booking_updated",
          JSON.stringify({
            bookingId: id,
            cleanerId,
            cleanerName: `${cleaner.first_name} ${cleaner.last_name}`,
            isAdminOverride: req.user.role === "admin",
            oldCleanerId,
          }),
        ]
      );

      // Notify old cleaner if reassignment
      if (oldCleanerId && oldCleanerId !== cleanerId) {
        await client.query(
          `INSERT INTO notifications (user_id, title, message, type, metadata)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            oldCleanerId,
            "Booking Reassignment",
            `Your booking for ${booking.booking_date} at ${booking.booking_time} has been reassigned to another cleaner.`,
            "booking_reassigned",
            JSON.stringify({
              bookingId: id,
              isAdminOverride: req.user.role === "admin",
              reassignedBy: `${req.user.first_name} ${req.user.last_name}`,
            }),
          ]
        );
      }
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Cleaner assigned successfully",
      cleaner: {
        id: cleaner.id,
        name: `${cleaner.first_name} ${cleaner.last_name}`,
        email: cleaner.email,
        phone: cleaner.phone,
        rating: cleaner.rating || 0,
      },
      assignmentType: req.user.role === "admin" ? "admin_override" : "manual",
      hadConflicts: conflictResult.rows.length > 0,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Assign cleaner error:", error);
    res.status(500).json({
      success: false,
      error: "Server error assigning cleaner",
    });
  } finally {
    client.release();
  }
};

/**
 * @desc    Get cleaner recommendations for booking
 * @route   GET /api/bookings/:id/recommendations
 * @access  Private (Admin or Customer)
 */
const getCleanerRecommendationsForBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    // Get booking details
    const bookingResult = await query("SELECT * FROM bookings WHERE id = $1", [
      id,
    ]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // Check permissions
    if (req.user.role === "customer" && booking.customer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    if (req.user.role !== "admin" && req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const bookingDetails = {
      latitude: booking.latitude,
      longitude: booking.longitude,
      bookingDate: booking.booking_date,
      bookingTime: booking.booking_time,
      durationHours: booking.duration_hours,
      serviceId: booking.service_id,
      zipCode: booking.zip_code,
      address: booking.address,
      city: booking.city,
      state: booking.state,
    };

    const recommendations = await getCleanerRecommendations(
      bookingDetails,
      parseInt(limit)
    );

    res.json({
      success: true,
      bookingId: id,
      bookingDetails: {
        date: booking.booking_date,
        time: booking.booking_time,
        duration: booking.duration_hours,
        zipCode: booking.zip_code,
        currentStatus: booking.status,
        currentCleaner: booking.cleaner_id,
      },
      recommendations: recommendations.map((cleaner) => ({
        id: cleaner.id,
        name: `${cleaner.first_name} ${cleaner.last_name}`,
        rating: cleaner.rating || 0,
        totalJobs: cleaner.total_jobs || 0,
        activeJobs: cleaner.current_active_jobs || 0,
        completedJobs: cleaner.completed_jobs || 0,
        experienceYears: cleaner.experience_years || 0,
        hourlyRate: cleaner.hourly_rate,
        distance: cleaner.distance,
        zipMatch:
          cleaner.zip_priority === 1
            ? "exact"
            : cleaner.zip_priority === 2
            ? "area"
            : cleaner.zip_priority === 3
            ? "region"
            : "distant",
        priorityScore: cleaner.priorityScore,
        availability: {
          isAvailable: cleaner.is_available,
          lastActive: cleaner.last_active,
          hasServiceAreaMatch: cleaner.has_service_area_match,
        },
        contact: {
          email: cleaner.email,
          phone: cleaner.phone,
        },
        workload: {
          current: cleaner.current_active_jobs || 0,
          completed: cleaner.completed_jobs || 0,
          completionRate: cleaner.completion_rate || 0,
          lastAssignment: cleaner.last_assignment,
        },
      })),
      totalFound: recommendations.length,
      assignmentTips: {
        topReason:
          recommendations.length > 0
            ? getTopRecommendationReason(recommendations[0])
            : null,
        zipCodeMatches: recommendations.filter((c) => c.zip_priority <= 2)
          .length,
        availableNow: recommendations.filter((c) => c.is_available).length,
      },
    });
  } catch (error) {
    console.error("Get cleaner recommendations error:", error);
    res.status(500).json({
      success: false,
      error: "Server error getting recommendations",
    });
  }
};

/**
 * Helper function to get the top recommendation reason
 */
const getTopRecommendationReason = (cleaner) => {
  if (cleaner.zip_priority === 1) return "Exact ZIP code match";
  if (cleaner.zip_priority === 2) return "Same area (ZIP prefix match)";
  if (cleaner.current_active_jobs === 0) return "No current bookings";
  if (cleaner.rating >= 4.5) return "Excellent rating";
  if (cleaner.experience_years >= 5) return "Very experienced";
  return "Good overall match";
};

/**
 * @desc    Add review for completed booking
 * @route   POST /api/bookings/:id/review
 * @access  Private
 */
const createBookingReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Get booking details
    const bookingResult = await query("SELECT * FROM bookings WHERE id = $1", [
      id,
    ]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // Check if booking is completed
    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        error: "Can only review completed bookings",
      });
    }

    // Determine reviewer and reviewee
    let reviewerId = req.user.id;
    let revieweeId;

    if (req.user.role === "customer" && booking.customer_id === req.user.id) {
      revieweeId = booking.cleaner_id;
    } else if (
      req.user.role === "cleaner" &&
      booking.cleaner_id === req.user.id
    ) {
      revieweeId = booking.customer_id;
    } else {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    if (!revieweeId) {
      return res.status(400).json({
        success: false,
        error: "Cannot create review - missing cleaner assignment",
      });
    }

    // Check if review already exists
    const existingReview = await query(
      "SELECT id FROM reviews WHERE booking_id = $1 AND reviewer_id = $2",
      [id, reviewerId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Review already exists for this booking",
      });
    }

    // Create review
    const reviewResult = await query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, reviewerId, revieweeId, rating, comment]
    );

    // Update cleaner's average rating if reviewing a cleaner
    if (req.user.role === "customer") {
      const avgRatingResult = await query(
        "SELECT AVG(rating) as avg_rating FROM reviews WHERE reviewee_id = $1",
        [revieweeId]
      );

      const avgRating = parseFloat(avgRatingResult.rows[0].avg_rating);

      await query(
        "UPDATE cleaner_profiles SET rating = $1 WHERE user_id = $2",
        [avgRating, revieweeId]
      );
    }

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: reviewResult.rows[0],
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating review",
    });
  }
};

/**
 * @desc    Get cleaner recommendations with ZIP code priority
 * @route   POST /api/bookings/recommendations-by-zip
 * @access  Private (Customers/Admins)
 */
const getZipBasedRecommendations = async (req, res) => {
  try {
    const {
      zipCode,
      latitude,
      longitude,
      bookingDate,
      bookingTime,
      durationHours,
      serviceId,
      limit = 10,
    } = req.body;

    // Validate required fields
    if (!zipCode || !bookingDate || !bookingTime || !durationHours) {
      return res.status(400).json({
        success: false,
        error: "ZIP code, booking date, time, and duration are required",
      });
    }

    const bookingDetails = {
      zipCode,
      latitude,
      longitude,
      bookingDate,
      bookingTime,
      durationHours,
      serviceId,
    };

    const recommendations = await getCleanerRecommendations(
      bookingDetails,
      limit
    );

    res.status(200).json({
      success: true,
      data: {
        totalFound: recommendations.length,
        zipCode,
        recommendations: recommendations.map((cleaner) => ({
          id: cleaner.id,
          name: `${cleaner.first_name} ${cleaner.last_name}`,
          rating: cleaner.rating,
          hourlyRate: cleaner.hourly_rate,
          experienceYears: cleaner.experience_years,
          totalJobs: cleaner.total_jobs,
          distance: cleaner.distance,
          zipProximityScore: cleaner.zipProximityScore || 0,
          matchScore: cleaner.matchScore,
          zipCode: cleaner.zip_code,
          isInSameZip: cleaner.zip_code === zipCode,
          isInSameArea:
            cleaner.zip_code &&
            zipCode &&
            cleaner.zip_code.substring(0, 3) === zipCode.substring(0, 3),
        })),
      },
    });
  } catch (error) {
    console.error("Get ZIP-based recommendations error:", error);
    res.status(500).json({
      success: false,
      error: "Server error getting recommendations",
    });
  }
};

/**
 * @desc    Retry auto-assignment for pending bookings
 * @route   POST /api/bookings/:id/retry-assignment
 * @access  Private (Admin)
 */
const retryAutoAssignment = async (req, res) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const { id } = req.params;

    // Only admins can retry assignment
    if (req.user.role !== "admin") {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }

    // Get booking details
    const bookingResult = await client.query(
      "SELECT * FROM bookings WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // Only retry for pending assignments
    if (booking.status !== "pending_assignment" && booking.cleaner_id) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Booking is not in pending assignment status",
        currentStatus: booking.status,
        hasAssignedCleaner: !!booking.cleaner_id,
      });
    }

    // Get customer info
    const customerResult = await client.query(
      "SELECT first_name, last_name, email FROM users WHERE id = $1",
      [booking.customer_id]
    );

    if (customerResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Customer not found",
      });
    }

    const customer = customerResult.rows[0];

    const bookingDetails = {
      latitude: booking.latitude,
      longitude: booking.longitude,
      bookingDate: booking.booking_date,
      bookingTime: booking.booking_time,
      durationHours: booking.duration_hours,
      serviceId: booking.service_id,
      zipCode: booking.zip_code,
      address: booking.address,
      city: booking.city,
      state: booking.state,
    };

    const customerInfo = {
      id: booking.customer_id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
    };

    // Attempt reassignment
    const assignmentResult = await performAutoAssignment(
      id,
      bookingDetails,
      customerInfo
    );

    await client.query("COMMIT");

    if (assignmentResult.success) {
      res.json({
        success: true,
        message: "Auto-assignment retry successful",
        cleaner: {
          id: assignmentResult.cleaner.id,
          name: `${assignmentResult.cleaner.first_name} ${assignmentResult.cleaner.last_name}`,
          rating: assignmentResult.cleaner.rating,
          phone: assignmentResult.cleaner.phone,
        },
        assignmentScore: assignmentResult.assignmentScore,
        retryAttempt: (booking.assignment_attempts || 0) + 1,
      });
    } else {
      res.json({
        success: false,
        message: "Auto-assignment retry failed - no available cleaners",
        reason: assignmentResult.reason,
        retryAttempt: (booking.assignment_attempts || 0) + 1,
        suggestions: [
          "Check if cleaners are available in this ZIP code",
          "Consider expanding service area",
          "Manually assign a cleaner",
          "Contact cleaners directly",
        ],
      });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Retry auto-assignment error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrying assignment",
    });
  } finally {
    client.release();
  }
};

/**
 * @desc    Get booking assignment status and metrics
 * @route   GET /api/bookings/:id/assignment-status
 * @access  Private (Admin or Customer)
 */
const getBookingAssignmentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const bookingResult = await query(
      `
      SELECT 
        b.*,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        c.first_name as cleaner_first_name,
        c.last_name as cleaner_last_name,
        c.phone as cleaner_phone,
        cp.rating as cleaner_rating,
        cp.total_jobs as cleaner_total_jobs
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      LEFT JOIN users c ON b.cleaner_id = c.id
      LEFT JOIN cleaner_profiles cp ON b.cleaner_id = cp.user_id
      WHERE b.id = $1
    `,
      [id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // Check permissions
    if (req.user.role === "customer" && booking.customer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    if (req.user.role !== "admin" && req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Get recommendations if no cleaner assigned
    let recommendations = [];
    if (!booking.cleaner_id && req.user.role === "admin") {
      const bookingDetails = {
        latitude: booking.latitude,
        longitude: booking.longitude,
        bookingDate: booking.booking_date,
        bookingTime: booking.booking_time,
        durationHours: booking.duration_hours,
        serviceId: booking.service_id,
        zipCode: booking.zip_code,
        address: booking.address,
        city: booking.city,
        state: booking.state,
      };

      try {
        const recs = await getCleanerRecommendations(bookingDetails, 5);
        recommendations = recs.map((cleaner) => ({
          id: cleaner.id,
          name: `${cleaner.first_name} ${cleaner.last_name}`,
          rating: cleaner.rating || 0,
          priorityScore: cleaner.priorityScore || 0,
          zipMatch:
            cleaner.zip_priority === 1
              ? "exact"
              : cleaner.zip_priority === 2
              ? "area"
              : "distant",
          currentJobs: cleaner.current_active_jobs || 0,
        }));
      } catch (error) {
        console.error("Error getting recommendations:", error);
        // Continue without recommendations
      }
    }

    res.json({
      success: true,
      booking: {
        id: booking.id,
        status: booking.status,
        assignmentAttempts: booking.assignment_attempts || 0,
        assignedAt: booking.assigned_at,
        assignedByAdmin: booking.assigned_by_admin || false,
        adminOverrideReason: booking.admin_override_reason,
        customer: {
          name: `${booking.customer_first_name} ${booking.customer_last_name}`,
        },
        cleaner: booking.cleaner_id
          ? {
              id: booking.cleaner_id,
              name: `${booking.cleaner_first_name} ${booking.cleaner_last_name}`,
              phone: booking.cleaner_phone,
              rating: booking.cleaner_rating || 0,
              totalJobs: booking.cleaner_total_jobs || 0,
            }
          : null,
        location: {
          address: booking.address,
          city: booking.city,
          state: booking.state,
          zipCode: booking.zip_code,
        },
        schedule: {
          date: booking.booking_date,
          time: booking.booking_time,
          duration: booking.duration_hours,
        },
      },
      availableActions: {
        canRetryAssignment:
          booking.status === "pending_assignment" && req.user.role === "admin",
        canManualAssign: !booking.cleaner_id && req.user.role === "admin",
        canReassign: booking.cleaner_id && req.user.role === "admin",
      },
      recommendations,
    });
  } catch (error) {
    console.error("Get assignment status error:", error);
    res.status(500).json({
      success: false,
      error: "Server error getting assignment status",
    });
  }
};

/**
 * @desc    Get nearby cleaners for a specific booking after payment
 * @route   GET /api/bookings/:id/nearby-cleaners
 * @access  Private
 */
const getNearbyCleanersForBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, radius = 20 } = req.query;

    // Get booking details and verify it belongs to the user or user is admin
    const bookingResult = await query(
      `SELECT 
        b.*,
        s.name as service_name, 
        s.category as service_category
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       WHERE b.id = $1`,
      [id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // Check if user has access to this booking
    if (req.user.role !== "admin" && booking.customer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Access denied to this booking",
      });
    }

    // Ensure payment is completed before showing cleaners
    if (booking.payment_status !== "completed") {
      return res.status(400).json({
        success: false,
        error: "Payment must be completed before viewing available cleaners",
        paymentStatus: booking.payment_status,
      });
    }

    // Use provided location or booking address for search
    let searchLat = parseFloat(latitude);
    let searchLng = parseFloat(longitude);

    if (!searchLat || !searchLng) {
      // If no coordinates provided, could add geocoding here
      // For now, return error
      return res.status(400).json({
        success: false,
        error:
          "Location coordinates are required. Please provide latitude and longitude.",
      });
    }

    const radiusKm = parseFloat(radius);

    // Get nearby available cleaners
    const cleanersQuery = `
      SELECT 
        cp.user_id,
        cp.bio,
        cp.experience_years,
        cp.hourly_rate,
        cp.rating,
        cp.total_jobs,
        cp.current_latitude,
        cp.current_longitude,
        cp.last_location_update,
        cp.service_radius,
        cp.certifications,
        cp.cleaning_services,
        u.first_name,
        u.last_name,
        u.phone,
        u.profile_image,
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - cp.last_location_update))/60 as minutes_since_last_update,
        (
          6371 * acos(
            cos(radians($1)) * cos(radians(cp.current_latitude)) *
            cos(radians(cp.current_longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(cp.current_latitude))
          )
        ) AS distance_km
      FROM cleaner_profiles cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.is_available = true 
        AND cp.current_latitude IS NOT NULL 
        AND cp.current_longitude IS NOT NULL
        AND cp.last_location_update > (CURRENT_TIMESTAMP - INTERVAL '3 minutes')
        AND (
          6371 * acos(
            cos(radians($1)) * cos(radians(cp.current_latitude)) *
            cos(radians(cp.current_longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(cp.current_latitude))
          )
        ) <= $3
      ORDER BY distance_km ASC, cp.rating DESC, cp.total_jobs DESC
      LIMIT 20
    `;

    const cleanersResult = await query(cleanersQuery, [
      searchLat,
      searchLng,
      radiusKm,
    ]);

    // Transform the data
    const availableCleaners = cleanersResult.rows.map((cleaner) => ({
      id: cleaner.user_id,
      firstName: cleaner.first_name,
      lastName: cleaner.last_name,
      phone: cleaner.phone,
      profileImage: cleaner.profile_image,
      bio: cleaner.bio,
      experienceYears: cleaner.experience_years,
      hourlyRate: cleaner.hourly_rate,
      rating: parseFloat(cleaner.rating) || 0,
      totalJobs: cleaner.total_jobs || 0,
      serviceRadius: cleaner.service_radius,
      certifications: cleaner.certifications,
      cleaningServices: cleaner.cleaning_services,
      distanceKm: parseFloat(cleaner.distance_km).toFixed(2),
      minutesSinceLastUpdate: Math.round(
        cleaner.minutes_since_last_update || 0
      ),
      isOnline: cleaner.minutes_since_last_update <= 3,
      location: {
        latitude: cleaner.current_latitude,
        longitude: cleaner.current_longitude,
        lastUpdate: cleaner.last_location_update,
      },
    }));

    res.json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          serviceName: booking.service_name,
          serviceCategory: booking.service_category,
          bookingDate: combineDateTime(
            booking.booking_date,
            booking.booking_time
          ),
          bookingTime: booking.booking_time,
          durationHours: booking.duration_hours,
          totalAmount: booking.total_amount,
          status: booking.status,
          address: booking.address,
          city: booking.city,
          state: booking.state,
          zipCode: booking.zip_code,
        },
        cleaners: availableCleaners,
      },
      searchCriteria: {
        latitude: searchLat,
        longitude: searchLng,
        radiusKm,
      },
      stats: {
        totalFound: availableCleaners.length,
        within5km: availableCleaners.filter(
          (c) => parseFloat(c.distanceKm) <= 5
        ).length,
        within10km: availableCleaners.filter(
          (c) => parseFloat(c.distanceKm) <= 10
        ).length,
        onlineNow: availableCleaners.filter((c) => c.isOnline).length,
      },
      message:
        availableCleaners.length > 0
          ? `Found ${availableCleaners.length} available cleaners for your booking`
          : "No cleaners currently available in this area",
    });
  } catch (error) {
    console.error("Get nearby cleaners for booking error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving nearby cleaners",
    });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  updateBookingStatus,
  updateBookingPaymentStatus,
  assignCleanerToBooking,
  getCleanerRecommendationsForBooking,
  getZipBasedRecommendations,
  createBookingReview,
  retryAutoAssignment,
  getBookingAssignmentStatus,
  getNearbyCleanersForBooking,
};
