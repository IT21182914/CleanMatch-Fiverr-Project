const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");
const { createStripeCustomer } = require("../utils/stripe");
const { asyncHandler } = require("../middleware/errorHandler");
const {
  dbOperation,
  validateRequired,
  ensureResourceExists,
  isValidEmail,
  validatePasswordStrength,
  ValidationError,
  AuthenticationError,
  ConflictError,
} = require("../utils/errorUtils");

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

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
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

  // Validate required fields
  validateRequired(
    ["email", "password", "firstName", "lastName", "role"],
    req.body
  );

  // Validate email format
  if (!isValidEmail(email)) {
    throw new ValidationError("Please provide a valid email address");
  }

  // Validate password strength
  validatePasswordStrength(password);

  // Validate role
  if (!["customer", "cleaner"].includes(role)) {
    throw new ValidationError("Role must be either customer or cleaner");
  }

  // Check if user already exists
  const existingUser = await dbOperation(
    () => query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]),
    "Failed to check existing user"
  );

  if (existingUser.rows.length > 0) {
    throw new ConflictError("User with this email already exists");
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const userResult = await dbOperation(
    () =>
      query(
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
      ),
    "Failed to create user account"
  );

  const user = userResult.rows[0];

  // Create Stripe customer (non-blocking)
  try {
    await createStripeCustomer(user);
  } catch (stripeError) {
    console.error(
      "Warning: Failed to create Stripe customer:",
      stripeError.message
    );
    // Continue with registration even if Stripe customer creation fails
  }

  // If user is a cleaner, create cleaner profile
  if (role === "cleaner") {
    await dbOperation(
      () =>
        query("INSERT INTO cleaner_profiles (user_id) VALUES ($1)", [user.id]),
      "Failed to create cleaner profile"
    );
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
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  console.log("🔐 Login attempt received");
  console.log("Request body:", req.body);
  console.log("Content-Type:", req.headers['content-type']);
  console.log("Origin:", req.headers.origin);
  
  const { email, password } = req.body;

  // Validate required fields
  validateRequired(["email", "password"], req.body);

  // Validate email format
  if (!isValidEmail(email)) {
    console.log("❌ Invalid email format:", email);
    throw new ValidationError("Please provide a valid email address");
  }

  console.log("✅ Validation passed, attempting to find user:", email);

  // Find user
  const userResult = await dbOperation(
    () =>
      query(
        `SELECT id, email, password, first_name, last_name, role, is_active 
       FROM users WHERE email = $1`,
        [email.toLowerCase()]
      ),
    "Failed to authenticate user"
  );

  if (userResult.rows.length === 0) {
    throw new AuthenticationError("Invalid email or password");
  }

  const user = userResult.rows[0];

  // Check if account is active
  if (!user.is_active) {
    throw new AuthenticationError(
      "Account is deactivated. Please contact support."
    );
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError("Invalid email or password");
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
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AuthenticationError("Refresh token is required");
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw new AuthenticationError("Invalid or expired refresh token");
    }
    throw error;
  }

  // Check if user still exists and is active
  const userResult = await dbOperation(
    () =>
      query(
        "SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = $1",
        [decoded.userId]
      ),
    "Failed to verify user"
  );

  if (userResult.rows.length === 0) {
    throw new AuthenticationError("User not found");
  }

  const user = userResult.rows[0];

  if (!user.is_active) {
    throw new AuthenticationError("Account is deactivated");
  }

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
});

/**
 * @desc    Request password reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
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
};

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
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
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};
