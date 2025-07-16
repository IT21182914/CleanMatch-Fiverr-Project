const { query } = require("../config/database");

/**
 * @desc    Get platform statistics for public display
 * @route   GET /api/stats/public
 * @access  Public
 */
const getPublicStats = async (req, res) => {
  try {
    // Calculate or get cached stats
    const stats = await calculatePublicStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get public stats error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving statistics",
    });
  }
};

/**
 * @desc    Get coverage areas
 * @route   GET /api/stats/coverage
 * @access  Public
 */
const getCoverageAreas = async (req, res) => {
  try {
    const coverageResult = await query(
      `SELECT city, state, zip_codes, 
              (SELECT COUNT(*) FROM users WHERE role = 'cleaner' AND zip_code = ANY(coverage_areas.zip_codes)) as cleaner_count
       FROM coverage_areas 
       WHERE is_active = true 
       ORDER BY city, state`
    );

    // Get unique cities from database if no manual coverage areas
    let cities = coverageResult.rows;

    if (cities.length === 0) {
      // Fallback to calculating from user zip codes
      const cityResult = await query(`
        SELECT DISTINCT city, state, COUNT(*) as user_count
        FROM users 
        WHERE city IS NOT NULL AND state IS NOT NULL AND role IN ('cleaner', 'customer')
        GROUP BY city, state
        ORDER BY user_count DESC, city
      `);

      cities = cityResult.rows.map((row) => ({
        city: row.city,
        state: row.state,
        cleaner_count: 0,
        zip_codes: [],
      }));
    }

    res.json({
      success: true,
      coverage: {
        cities: cities.map((city) => `${city.city}, ${city.state}`),
        totalCities: cities.length,
        totalStates: [...new Set(cities.map((city) => city.state))].length,
        details: cities,
      },
    });
  } catch (error) {
    console.error("Get coverage areas error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving coverage areas",
    });
  }
};

/**
 * Calculate public statistics
 */
const calculatePublicStats = async () => {
  try {
    // Check for manual overrides first
    const overrideResult = await query(
      "SELECT stat_name, stat_value, stat_text FROM platform_stats WHERE manual_override = true"
    );

    const overrides = {};
    overrideResult.rows.forEach((row) => {
      overrides[row.stat_name] = {
        value: row.stat_value,
        text: row.stat_text,
      };
    });

    // Calculate average rating
    let averageRating = 4.8; // Default
    if (!overrides.average_rating) {
      const ratingResult = await query(`
        SELECT AVG(rating)::DECIMAL(3,2) as avg_rating, COUNT(*) as review_count
        FROM reviews 
        WHERE is_visible = true
      `);

      if (ratingResult.rows[0].review_count > 0) {
        averageRating = parseFloat(ratingResult.rows[0].avg_rating);
      }
    } else {
      averageRating = parseFloat(overrides.average_rating.value);
    }

    // Calculate total customers served
    let customersServed = 0;
    if (!overrides.customers_served) {
      const customerResult = await query(`
        SELECT COUNT(DISTINCT customer_id) as unique_customers
        FROM bookings 
        WHERE status = 'completed'
      `);
      customersServed = parseInt(customerResult.rows[0].unique_customers);
    } else {
      customersServed = parseInt(overrides.customers_served.value);
    }

    // Calculate total cleanings completed
    let cleaningsCompleted = 0;
    if (!overrides.cleanings_completed) {
      const cleaningResult = await query(`
        SELECT COUNT(*) as completed_cleanings
        FROM bookings 
        WHERE status = 'completed'
      `);
      cleaningsCompleted = parseInt(cleaningResult.rows[0].completed_cleanings);
    } else {
      cleaningsCompleted = parseInt(overrides.cleanings_completed.value);
    }

    // Get active cleaners count
    let activeCleaner = 0;
    if (!overrides.active_cleaners) {
      const cleanerResult = await query(`
        SELECT COUNT(*) as active_cleaners
        FROM users 
        WHERE role = 'cleaner' AND is_active = true
      `);
      activeCleaner = parseInt(cleanerResult.rows[0].active_cleaners);
    } else {
      activeCleaner = parseInt(overrides.active_cleaners.value);
    }

    // Get cities covered
    let citiesCovered = 0;
    if (!overrides.cities_covered) {
      const cityResult = await query(`
        SELECT COUNT(DISTINCT CONCAT(city, ', ', state)) as unique_cities
        FROM users 
        WHERE city IS NOT NULL AND state IS NOT NULL AND role = 'cleaner'
      `);
      citiesCovered = parseInt(cityResult.rows[0].unique_cities);
    } else {
      citiesCovered = parseInt(overrides.cities_covered.value);
    }

    // Update calculated stats in database
    await updateCalculatedStats({
      average_rating: averageRating,
      customers_served: customersServed,
      cleanings_completed: cleaningsCompleted,
      active_cleaners: activeCleaner,
      cities_covered: citiesCovered,
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      customersServed,
      cleaningsCompleted,
      activeCleaners: activeCleaner,
      citiesCovered,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error calculating public stats:", error);
    // Return default stats if calculation fails
    return {
      averageRating: 4.8,
      customersServed: 150,
      cleaningsCompleted: 500,
      activeCleaners: 25,
      citiesCovered: 10,
      lastUpdated: new Date().toISOString(),
    };
  }
};

/**
 * Update calculated statistics in database
 */
const updateCalculatedStats = async (stats) => {
  try {
    for (const [statName, value] of Object.entries(stats)) {
      await query(
        `INSERT INTO platform_stats (stat_name, stat_value, last_calculated)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (stat_name) 
         DO UPDATE SET 
           stat_value = CASE WHEN platform_stats.manual_override = false THEN $2 ELSE platform_stats.stat_value END,
           last_calculated = CURRENT_TIMESTAMP`,
        [statName, value]
      );
    }
  } catch (error) {
    console.error("Error updating calculated stats:", error);
  }
};

// Admin functions

/**
 * @desc    Get all platform statistics (admin)
 * @route   GET /api/stats/admin/all
 * @access  Private (Admin only)
 */
const getAllStats = async (req, res) => {
  try {
    const statsResult = await query(
      "SELECT * FROM platform_stats ORDER BY stat_name"
    );

    const calculatedStats = await calculatePublicStats();

    res.json({
      success: true,
      stats: {
        stored: statsResult.rows,
        calculated: calculatedStats,
      },
    });
  } catch (error) {
    console.error("Get all stats error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving statistics",
    });
  }
};

/**
 * @desc    Update platform statistic (admin)
 * @route   PUT /api/stats/admin/:statName
 * @access  Private (Admin only)
 */
const updateStat = async (req, res) => {
  try {
    const { statName } = req.params;
    const { value, text, manualOverride } = req.body;

    const result = await query(
      `INSERT INTO platform_stats (stat_name, stat_value, stat_text, manual_override)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (stat_name)
       DO UPDATE SET 
         stat_value = $2,
         stat_text = $3,
         manual_override = $4,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [statName, value, text, manualOverride || false]
    );

    res.json({
      success: true,
      message: "Statistic updated successfully",
      stat: result.rows[0],
    });
  } catch (error) {
    console.error("Update stat error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating statistic",
    });
  }
};

/**
 * @desc    Reset statistic to calculated value (admin)
 * @route   DELETE /api/stats/admin/:statName/override
 * @access  Private (Admin only)
 */
const resetStatOverride = async (req, res) => {
  try {
    const { statName } = req.params;

    await query(
      "UPDATE platform_stats SET manual_override = false WHERE stat_name = $1",
      [statName]
    );

    // Recalculate stats
    await calculatePublicStats();

    res.json({
      success: true,
      message: "Statistic override reset successfully",
    });
  } catch (error) {
    console.error("Reset stat override error:", error);
    res.status(500).json({
      success: false,
      error: "Server error resetting statistic override",
    });
  }
};

/**
 * @desc    Add/Update coverage area (admin)
 * @route   POST /api/stats/admin/coverage
 * @access  Private (Admin only)
 */
const addCoverageArea = async (req, res) => {
  try {
    const { city, state, zipCodes } = req.body;

    if (!city || !state) {
      return res.status(400).json({
        success: false,
        error: "City and state are required",
      });
    }

    const result = await query(
      `INSERT INTO coverage_areas (city, state, zip_codes)
       VALUES ($1, $2, $3)
       ON CONFLICT (city, state)
       DO UPDATE SET 
         zip_codes = $3,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [city, state, zipCodes || []]
    );

    res.json({
      success: true,
      message: "Coverage area updated successfully",
      coverage: result.rows[0],
    });
  } catch (error) {
    console.error("Add coverage area error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating coverage area",
    });
  }
};

/**
 * @desc    Get analytics dashboard data (admin)
 * @route   GET /api/stats/admin/analytics
 * @access  Private (Admin only)
 */
const getAnalyticsDashboard = async (req, res) => {
  try {
    // Bookings over time
    const bookingTrendsResult = await query(`
      SELECT 
        DATE_TRUNC('month', booking_date) as month,
        COUNT(*) as bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        SUM(total_amount) as revenue
      FROM bookings 
      WHERE booking_date >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', booking_date)
      ORDER BY month
    `);

    // Reviews over time
    const reviewTrendsResult = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as reviews,
        AVG(rating)::DECIMAL(3,2) as avg_rating
      FROM reviews 
      WHERE created_at >= NOW() - INTERVAL '12 months' AND is_visible = true
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);

    // Service popularity
    const servicePopularityResult = await query(`
      SELECT 
        s.name,
        COUNT(b.id) as bookings,
        AVG(r.rating)::DECIMAL(3,2) as avg_rating
      FROM services s
      LEFT JOIN bookings b ON s.id = b.service_id
      LEFT JOIN reviews r ON b.id = r.booking_id
      GROUP BY s.id, s.name
      ORDER BY bookings DESC
      LIMIT 10
    `);

    // Top cleaners
    const topCleanersResult = await query(`
      SELECT 
        u.first_name || ' ' || u.last_name as name,
        u.rating,
        u.review_count,
        COUNT(b.id) as total_bookings,
        COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings
      FROM users u
      LEFT JOIN bookings b ON u.id = b.cleaner_id
      WHERE u.role = 'cleaner'
      GROUP BY u.id, u.first_name, u.last_name, u.rating, u.review_count
      ORDER BY u.rating DESC, u.review_count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      analytics: {
        bookingTrends: bookingTrendsResult.rows,
        reviewTrends: reviewTrendsResult.rows,
        servicePopularity: servicePopularityResult.rows,
        topCleaners: topCleanersResult.rows,
      },
    });
  } catch (error) {
    console.error("Get analytics dashboard error:", error);
    res.status(500).json({
      success: false,
      error: "Server error retrieving analytics",
    });
  }
};

module.exports = {
  getPublicStats,
  getCoverageAreas,
  calculatePublicStats,
  getAllStats,
  updateStat,
  resetStatOverride,
  addCoverageArea,
  getAnalyticsDashboard,
};
