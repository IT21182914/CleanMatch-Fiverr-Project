require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const serviceRoutes = require("./routes/services");
const bookingRoutes = require("./routes/bookings");
const paymentRoutes = require("./routes/payments");
const membershipRoutes = require("./routes/memberships");
const adminRoutes = require("./routes/admin");
const notificationRoutes = require("./routes/notifications");
const offersRoutes = require("./routes/offers");
const reviewsRoutes = require("./routes/reviews");
const statsRoutes = require("./routes/stats");
const trustRoutes = require("./routes/trust");
const ticketRoutes = require("./routes/tickets");

// Import middleware
const {
  errorHandler,
  notFoundHandler,
  unhandledRejectionHandler,
  uncaughtExceptionHandler,
} = require("./middleware/errorHandler");
const {
  connectDB,
  gracefulShutdown: closeDatabase,
  healthCheck,
} = require("./config/database");
const { initializeCronJobs } = require("./utils/scheduler");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 auth requests per windowMs (increased for testing)
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: "15 minutes",
  },
});
app.use("/api/auth", authLimiter);

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Get allowed origins from environment variable or use defaults
      const envAllowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map((url) => url.trim())
        : [];

      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:5173",
        "http://localhost:5173/*",
        "http://localhost:5174", // Add port 5174 for frontend
        "http://localhost:5174/*", // Add port 5174 for frontend
        "http://localhost:5175/*", // Add port 5175 as backup
        "https://young-cliffs-57962-dbd5fa993e19.herokuapp.com", // Hosted backend URL
        "https://young-cliffs-57962-dbd5fa993e19.herokuapp.com/*", // Hosted backend URL
        ...envAllowedOrigins, // Add environment-specified origins
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(
  express.json({
    limit: "10mb",
    type: "application/json",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Raw body parsing for Stripe webhooks
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// Logging middleware
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/health", async (req, res) => {
  const dbHealth = await healthCheck();

  res.status(dbHealth.connected ? 200 : 503).json({
    status: dbHealth.connected ? "OK" : "Service Unavailable",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: dbHealth,
  });
});

// API Documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    name: "CleanMatch API",
    version: "1.0.0",
    description:
      "AI-powered cleaning services marketplace API with real-time location tracking",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      services: "/api/services",
      bookings: "/api/bookings",
      payments: "/api/payments",
      memberships: "/api/memberships",
      admin: "/api/admin",
      notifications: "/api/notifications",
      offers: "/api/offers",
      reviews: "/api/reviews",
      stats: "/api/stats",
      trust: "/api/trust",
      tickets: "/api/tickets",
    },
    newFeatures: {
      locationTracking: {
        cleanerAvailability: "PUT /api/users/availability",
        nearbyCleaners: "GET /api/users/nearby-cleaners",
        onlineStats: "GET /api/users/online-stats",
        bookingCleaners: "GET /api/bookings/:id/nearby-cleaners",
      },
    },
    documentation: "/api/docs",
    health: "/health",
  });
});

// Home route for Render root access
app.get("/", (req, res) => {
  res.status(200).json({
    name: "CleanMatch API",
    status: "Online",
    message: "Welcome to the CleanMatch API 🚀",
    docs: "/api",
    health: "/health",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", require("./routes/freelancerAuth"));
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/dynamic-pricing", require("./routes/dynamic-pricing"));
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/offers", offersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/trust", trustRoutes);
app.use("/api/tickets", ticketRoutes);

// 404 handler for unknown API routes
app.use("/api/*", notFoundHandler);

// General 404 handler for non-API routes
app.use("*", (req, res) => {
  if (req.originalUrl.startsWith("/api/")) {
    return notFoundHandler(req, res);
  }

  // For non-API routes, serve index.html in production or show a message in development
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.status(404).json({
      success: false,
      error: "Page not found",
      message: "The requested page does not exist",
    });
  }
});

// Serve static files
app.use(express.static("public"));
// Note: Upload files are now served from Supabase Storage
// app.use("/uploads", express.static("uploads"));

// Additional static file serving for development
if (process.env.NODE_ENV === "production") {
  // Catch all handler for SPA in production
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

// Global 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
    message: "The requested resource does not exist",
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown handlers
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async (err) => {
    if (err) {
      console.error("Error during server shutdown:", err);
      process.exit(1);
    }

    console.log("HTTP server closed.");

    // Close database connections
    try {
      await closeDatabase();
      console.log("Database connections closed.");
      process.exit(0);
    } catch (error) {
      console.error("Error closing database connections:", error);
      process.exit(1);
    }
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle unhandled promise rejections
process.on("unhandledRejection", unhandledRejectionHandler);

// Handle uncaught exceptions
process.on("uncaughtException", uncaughtExceptionHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log("🚀 CleanMatch Backend Server Started!");
  console.log("═".repeat(50));
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api`);
  console.log("═".repeat(50));

  // Initialize cron jobs only in production or when explicitly enabled
  if (
    process.env.NODE_ENV === "production" ||
    process.env.ENABLE_CRON_JOBS === "true"
  ) {
    console.log("⏰ Initializing scheduled jobs...");
    initializeCronJobs();
  } else {
    console.log("⏰ Cron jobs disabled (set ENABLE_CRON_JOBS=true to enable)");
  }

  console.log("✅ CleanMatch backend is ready to serve requests!");
});

// Export app for testing
module.exports = app;
