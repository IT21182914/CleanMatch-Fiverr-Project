const { query, getClient } = require("../config/database");
const {
  autoAssignCleaner,
  getCleanerRecommendations,
} = require("../utils/matchCleaner");
const {
  createPaymentIntent,
  createStripeCustomer,
} = require("../utils/stripe");

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
      autoAssign = true,
    } = req.body;

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

    const service = serviceResult.rows[0];
    const totalAmount = parseFloat(service.base_price) * durationHours;

    // Get user details
    const userResult = await client.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);

    const user = userResult.rows[0];

    // Create booking
    const bookingResult = await client.query(
      `INSERT INTO bookings (
        customer_id, service_id, booking_date, booking_time, duration_hours,
        total_amount, special_instructions, address, city, state, zip_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
        zipCode,
      ]
    );

    const booking = bookingResult.rows[0];
    let assignedCleaner = null;

    // Auto-assign cleaner if requested
    if (autoAssign) {
      try {
        const bookingDetails = {
          latitude: null, // You might want to geocode the address
          longitude: null,
          bookingDate,
          bookingTime,
          durationHours,
          serviceId,
          zipCode,
        };

        assignedCleaner = await autoAssignCleaner(bookingDetails);

        if (assignedCleaner) {
          await client.query(
            "UPDATE bookings SET cleaner_id = $1, status = $2 WHERE id = $3",
            [assignedCleaner.id, "confirmed", booking.id]
          );
          booking.cleaner_id = assignedCleaner.id;
          booking.status = "confirmed";
        }
      } catch (error) {
        console.error("Auto-assignment error:", error);
        // Continue without assignment - booking remains pending
      }
    }

    // Create Stripe customer if needed and payment intent
    try {
      const stripeCustomerId = await createStripeCustomer(user);

      const paymentIntent = await createPaymentIntent({
        amount: totalAmount,
        customerId: stripeCustomerId,
        bookingId: booking.id,
        description: `CleanMatch - ${service.name} booking`,
      });

      await client.query(
        "UPDATE bookings SET stripe_payment_intent_id = $1 WHERE id = $2",
        [paymentIntent.id, booking.id]
      );

      booking.stripe_payment_intent_id = paymentIntent.id;
      booking.client_secret = paymentIntent.client_secret;
    } catch (error) {
      console.error("Payment intent creation error:", error);
      // Continue without payment intent - can be created later
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...booking,
        service_name: service.name,
        assigned_cleaner: assignedCleaner
          ? {
              id: assignedCleaner.id,
              name: `${assignedCleaner.first_name} ${assignedCleaner.last_name}`,
              rating: assignedCleaner.rating,
              hourly_rate: assignedCleaner.hourly_rate,
            }
          : null,
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
        b.*, s.name as service_name, s.category as service_category,
        customer.first_name as customer_first_name, customer.last_name as customer_last_name,
        customer.email as customer_email, customer.phone as customer_phone,
        cleaner.first_name as cleaner_first_name, cleaner.last_name as cleaner_last_name,
        cleaner.email as cleaner_email, cleaner.phone as cleaner_phone,
        cp.rating as cleaner_rating, cp.hourly_rate as cleaner_hourly_rate
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN users customer ON b.customer_id = customer.id
       LEFT JOIN users cleaner ON b.cleaner_id = cleaner.id
       LEFT JOIN cleaner_profiles cp ON cleaner.id = cp.user_id
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
    const formattedBooking = {
      id: booking.id,
      customerId: booking.customer_id,
      cleanerId: booking.cleaner_id,
      serviceId: booking.service_id,
      bookingDate: booking.booking_date,
      bookingTime: booking.booking_time,
      durationHours: booking.duration_hours,
      totalAmount: booking.total_amount,
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
 * @desc    Manually assign cleaner to booking
 * @route   POST /api/bookings/:id/assign
 * @access  Private (Admin or Customer)
 */
const assignCleanerToBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cleanerId } = req.body;

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

    // Verify cleaner exists and is available
    const cleanerResult = await query(
      `SELECT u.*, cp.is_available FROM users u
       JOIN cleaner_profiles cp ON u.id = cp.user_id
       WHERE u.id = $1 AND u.role = 'cleaner' AND u.is_active = true`,
      [cleanerId]
    );

    if (cleanerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cleaner not found or not available",
      });
    }

    const cleaner = cleanerResult.rows[0];

    if (!cleaner.is_available) {
      return res.status(400).json({
        success: false,
        error: "Cleaner is currently not available",
      });
    }

    // Update booking with assigned cleaner
    await query(
      "UPDATE bookings SET cleaner_id = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
      [cleanerId, "confirmed", id]
    );

    res.json({
      success: true,
      message: "Cleaner assigned successfully",
      cleaner: {
        id: cleaner.id,
        name: `${cleaner.first_name} ${cleaner.last_name}`,
        email: cleaner.email,
      },
    });
  } catch (error) {
    console.error("Assign cleaner error:", error);
    res.status(500).json({
      success: false,
      error: "Server error assigning cleaner",
    });
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
    };

    const recommendations = await getCleanerRecommendations(bookingDetails, 10);

    res.json({
      success: true,
      recommendations: recommendations.map((cleaner) => ({
        id: cleaner.id,
        name: `${cleaner.first_name} ${cleaner.last_name}`,
        rating: cleaner.rating,
        totalJobs: cleaner.total_jobs,
        hourlyRate: cleaner.hourly_rate,
        distance: cleaner.distance,
        matchScore: cleaner.matchScore,
        experienceYears: cleaner.experience_years,
      })),
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({
      success: false,
      error: "Server error getting cleaner recommendations",
    });
  }
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

module.exports = {
  createBooking,
  getBookingById,
  updateBookingStatus,
  assignCleanerToBooking,
  getCleanerRecommendationsForBooking,
  createBookingReview,
};
