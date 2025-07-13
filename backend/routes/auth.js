const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");
const {
  validate,
  registerSchema,
  loginSchema,
} = require("../middleware/validation");
const { createStripeCustomer } = require("../utils/stripe");
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      address,
      city,
      state,
      zipCode,
    } = req.body;

    // Check if user already exists
    const existingUser = await query("SELECT id FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userResult = await query(
      `INSERT INTO users (
        email, password, first_name, last_name, phone, role, 
        address, city, state, zip_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING id, email, first_name, last_name, role, created_at`,
      [
        email.toLowerCase(),
        hashedPassword,
        firstName,
        lastName,
        phone,
        role,
        address,
        city,
        state,
        zipCode,
      ]
    );

    const user = userResult.rows[0];

    // Create Stripe customer
    try {
      await createStripeCustomer(user);
    } catch (stripeError) {
      console.error("Error creating Stripe customer:", stripeError);
      // Continue with registration even if Stripe customer creation fails
    }

    // If user is a cleaner, create cleaner profile
    if (role === "cleaner") {
      await query("INSERT INTO cleaner_profiles (user_id) VALUES ($1)", [
        user.id,
      ]);
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during registration",
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userResult = await query(
      `SELECT id, email, password, first_name, last_name, role, is_active 
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const user = userResult.rows[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: "Account is deactivated. Please contact support.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during login",
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if user still exists and is active
    const userResult = await query(
      "SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
    }

    const user = userResult.rows[0];

    // Generate new access token
    const newToken = generateToken(user.id);

    res.json({
      success: true,
      token: newToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error during token refresh",
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Check if user exists
    const userResult = await query(
      "SELECT id, email, first_name FROM users WHERE email = $1 AND is_active = true",
      [email.toLowerCase()]
    );

    // Always return success for security (don't reveal if email exists)
    if (userResult.rows.length === 0) {
      return res.json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const user = userResult.rows[0];

    // Generate password reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // In a real application, you would send an email here
    // For now, we'll just log the reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log(`Password reset link for ${email}: ${resetLink}`);

    // TODO: Implement email sending
    // await sendPasswordResetEmail(user.email, user.first_name, resetLink);

    res.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: "Server error processing password reset request",
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Token and new password are required",
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long",
      });
    }

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const updateResult = await query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND is_active = true",
      [hashedPassword, decoded.userId]
    );

    if (updateResult.rowCount === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token",
      });
    }

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error resetting password",
    });
  }
});

module.exports = router;
