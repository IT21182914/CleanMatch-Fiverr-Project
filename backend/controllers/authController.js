const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");
const { createStripeCustomer } = require("../utils/stripe");
const { asyncHandler } = require("../middleware/errorHandler");
const {
  processUploadedFiles,
  deleteUploadedFiles,
  createBucketIfNotExists,
} = require("../utils/supabaseStorage");
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
    userName,
    phone,
    role,
    address,
    city,
    state,
    zipCode,
    cleaningServices,
    cleaningFrequency,
    preferredHours,
    message,
  } = req.body;

  // Validate required fields
  validateRequired(
    ["email", "password", "firstName", "lastName", "role"],
    req.body
  );

  // Validate role-specific required fields
  if (role === "customer") {
    validateRequired(["userName"], req.body);
  } else if (role === "cleaner") {
    validateRequired(
      ["address", "city", "state", "zipCode", "cleaningServices"],
      req.body
    );
  }

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

  // Check if username already exists (for customers)
  if (role === "customer" && userName) {
    const existingUserName = await dbOperation(
      () =>
        query("SELECT id FROM users WHERE user_name = $1", [
          userName.toLowerCase(),
        ]),
      "Failed to check existing username"
    );

    if (existingUserName.rows.length > 0) {
      throw new ConflictError("Username is already taken");
    }
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const userFields = [
    "email",
    "password",
    "first_name",
    "last_name",
    "phone",
    "role",
  ];
  const userValues = [
    email.toLowerCase(),
    hashedPassword,
    firstName,
    lastName,
    phone,
    role,
  ];

  // Add customer-specific fields
  if (role === "customer") {
    userFields.push("user_name");
    userValues.push(userName.toLowerCase());

    // Add optional address and zipCode for customers
    if (address && address.trim()) {
      userFields.push("address");
      userValues.push(address.trim());
    }

    if (zipCode && zipCode.trim()) {
      userFields.push("zip_code");
      userValues.push(zipCode.trim());
    }
  }

  // Add cleaner-specific fields
  if (role === "cleaner") {
    userFields.push("address", "city", "state", "zip_code");
    userValues.push(address, city, state, zipCode);
  }

  const placeholders = userValues.map((_, index) => `$${index + 1}`).join(", ");
  const userResult = await dbOperation(
    () =>
      query(
        `INSERT INTO users (${userFields.join(", ")}) 
         VALUES (${placeholders}) 
         RETURNING id, email, first_name, last_name, role, user_name, created_at`,
        userValues
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

  // If user is a cleaner, create cleaner profile with additional fields
  if (role === "cleaner") {
    const cleanerFields = ["user_id"];
    const cleanerValues = [user.id];

    // Add freelancer-specific fields if provided
    if (cleaningServices && cleaningServices.length > 0) {
      cleanerFields.push("cleaning_services");
      cleanerValues.push(cleaningServices);
    }

    if (cleaningFrequency) {
      cleanerFields.push("cleaning_frequency");
      cleanerValues.push(cleaningFrequency);
    }

    if (preferredHours) {
      cleanerFields.push("preferred_hours");
      cleanerValues.push(preferredHours);
    }

    if (message) {
      cleanerFields.push("message");
      cleanerValues.push(message);
    }

    const cleanerPlaceholders = cleanerValues
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    await dbOperation(
      () =>
        query(
          `INSERT INTO cleaner_profiles (${cleanerFields.join(
            ", "
          )}) VALUES (${cleanerPlaceholders})`,
          cleanerValues
        ),
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
      userName: user.user_name,
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
  console.log("Content-Type:", req.headers["content-type"]);
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

/**
 * @desc    Register a new user with document upload
 * @route   POST /api/auth/register-with-documents
 * @access  Public
 */
const registerWithDocuments = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    userName,
    phone,
    role,
    address,
    city,
    state,
    zipCode,
    cleaningServices,
    cleaningFrequency,
    preferredHours,
    message,
  } = req.body;

  // Validate required fields
  validateRequired(
    ["email", "password", "firstName", "lastName", "role"],
    req.body
  );

  // Validate role-specific required fields
  if (role === "customer") {
    validateRequired(["userName"], req.body);
  } else if (role === "cleaner") {
    validateRequired(
      ["address", "city", "state", "zipCode", "cleaningServices"],
      req.body
    );
  }

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

  // Check if username already exists (for customers)
  if (role === "customer" && userName) {
    const existingUserName = await dbOperation(
      () =>
        query("SELECT id FROM users WHERE user_name = $1", [
          userName.toLowerCase(),
        ]),
      "Failed to check existing username"
    );

    if (existingUserName.rows.length > 0) {
      throw new ConflictError("Username is already taken");
    }
  }

  // Process uploaded documents if files are present
  let documentUrls = {};
  if (req.files && Object.keys(req.files).length > 0) {
    try {
      // Ensure the bucket exists before uploading
      await createBucketIfNotExists("id-proofs");

      // Process the uploaded files temporarily with a temp user ID
      const tempUserId = `temp-${Date.now()}`;
      documentUrls = await processUploadedFiles(req.files, tempUserId);

      console.log(
        "Documents uploaded successfully:",
        Object.keys(documentUrls)
      );
    } catch (uploadError) {
      console.error("Document upload failed:", uploadError);
      throw new ValidationError(
        `Document upload failed: ${uploadError.message}`
      );
    }
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user with document URLs
  const userFields = [
    "email",
    "password",
    "first_name",
    "last_name",
    "phone",
    "role",
  ];
  const userValues = [
    email.toLowerCase(),
    hashedPassword,
    firstName,
    lastName,
    phone,
    role,
  ];

  // Add document URLs if they exist
  if (documentUrls.id_front_url) {
    userFields.push("id_front_url");
    userValues.push(documentUrls.id_front_url);
  }
  if (documentUrls.id_back_url) {
    userFields.push("id_back_url");
    userValues.push(documentUrls.id_back_url);
  }
  if (documentUrls.ssn_front_url) {
    userFields.push("ssn_front_url");
    userValues.push(documentUrls.ssn_front_url);
  }
  if (documentUrls.ssn_back_url) {
    userFields.push("ssn_back_url");
    userValues.push(documentUrls.ssn_back_url);
  }

  // Add customer-specific fields
  if (role === "customer") {
    userFields.push("user_name");
    userValues.push(userName.toLowerCase());

    // Add optional address and zipCode for customers
    if (address && address.trim()) {
      userFields.push("address");
      userValues.push(address.trim());
    }

    if (zipCode && zipCode.trim()) {
      userFields.push("zip_code");
      userValues.push(zipCode.trim());
    }
  }

  // Add cleaner-specific fields
  if (role === "cleaner") {
    userFields.push("address", "city", "state", "zip_code");
    userValues.push(address, city, state, zipCode);
  }

  let user;
  try {
    const placeholders = userValues
      .map((_, index) => `$${index + 1}`)
      .join(", ");
    const userResult = await dbOperation(
      () =>
        query(
          `INSERT INTO users (${userFields.join(", ")}) 
           VALUES (${placeholders}) 
           RETURNING id, email, first_name, last_name, role, user_name, created_at, id_front_url, id_back_url, ssn_front_url, ssn_back_url`,
          userValues
        ),
      "Failed to create user account"
    );

    user = userResult.rows[0];

    // Update document URLs with the actual user ID (re-upload with correct folder structure)
    if (Object.keys(documentUrls).length > 0) {
      try {
        const updatedDocumentUrls = await processUploadedFiles(
          req.files,
          user.id
        );

        // Update the user record with the new URLs
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;

        if (updatedDocumentUrls.id_front_url) {
          updateFields.push(`id_front_url = $${paramIndex++}`);
          updateValues.push(updatedDocumentUrls.id_front_url);
        }
        if (updatedDocumentUrls.id_back_url) {
          updateFields.push(`id_back_url = $${paramIndex++}`);
          updateValues.push(updatedDocumentUrls.id_back_url);
        }
        if (updatedDocumentUrls.ssn_front_url) {
          updateFields.push(`ssn_front_url = $${paramIndex++}`);
          updateValues.push(updatedDocumentUrls.ssn_front_url);
        }
        if (updatedDocumentUrls.ssn_back_url) {
          updateFields.push(`ssn_back_url = $${paramIndex++}`);
          updateValues.push(updatedDocumentUrls.ssn_back_url);
        }

        if (updateFields.length > 0) {
          updateValues.push(user.id);
          await query(
            `UPDATE users SET ${updateFields.join(
              ", "
            )} WHERE id = $${paramIndex}`,
            updateValues
          );

          // Update user object with new URLs
          user.id_front_url =
            updatedDocumentUrls.id_front_url || user.id_front_url;
          user.id_back_url =
            updatedDocumentUrls.id_back_url || user.id_back_url;
          user.ssn_front_url =
            updatedDocumentUrls.ssn_front_url || user.ssn_front_url;
          user.ssn_back_url =
            updatedDocumentUrls.ssn_back_url || user.ssn_back_url;
        }

        // Clean up temporary files if they exist
        const tempUrls = Object.values(documentUrls).filter(Boolean);
        if (tempUrls.length > 0) {
          await deleteUploadedFiles(tempUrls);
        }
      } catch (reuploadError) {
        console.error(
          "Failed to re-upload with correct user ID:",
          reuploadError
        );
        // Continue with registration, but log the issue
      }
    }
  } catch (error) {
    // If user creation fails, clean up uploaded documents
    if (Object.keys(documentUrls).length > 0) {
      try {
        const uploadedUrls = Object.values(documentUrls).filter(Boolean);
        await deleteUploadedFiles(uploadedUrls);
      } catch (cleanupError) {
        console.error("Failed to cleanup uploaded files:", cleanupError);
      }
    }
    throw error;
  }

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

  // If user is a cleaner, create cleaner profile with additional fields
  if (role === "cleaner") {
    const cleanerFields = ["user_id"];
    const cleanerValues = [user.id];

    // Add freelancer-specific fields if provided
    if (cleaningServices && cleaningServices.length > 0) {
      cleanerFields.push("cleaning_services");
      cleanerValues.push(cleaningServices);
    }

    if (cleaningFrequency) {
      cleanerFields.push("cleaning_frequency");
      cleanerValues.push(cleaningFrequency);
    }

    if (preferredHours) {
      cleanerFields.push("preferred_hours");
      cleanerValues.push(preferredHours);
    }

    if (message) {
      cleanerFields.push("message");
      cleanerValues.push(message);
    }

    const cleanerPlaceholders = cleanerValues
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    await dbOperation(
      () =>
        query(
          `INSERT INTO cleaner_profiles (${cleanerFields.join(
            ", "
          )}) VALUES (${cleanerPlaceholders})`,
          cleanerValues
        ),
      "Failed to create cleaner profile"
    );
  }

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.status(201).json({
    success: true,
    message: "User registered successfully with documents",
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      userName: user.user_name,
      role: user.role,
      createdAt: user.created_at,
      documents: {
        idFrontUrl: user.id_front_url,
        idBackUrl: user.id_back_url,
        ssnFrontUrl: user.ssn_front_url,
        ssnBackUrl: user.ssn_back_url,
      },
    },
    token,
    refreshToken,
  });
});

/**
 * @desc    Check if email is available for registration
 * @route   POST /api/auth/check-email
 * @access  Public
 */
const checkEmailAvailability = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate email format
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid email address",
    });
  }

  // Check if user already exists
  const existingUser = await dbOperation(
    () => query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]),
    "Failed to check email availability"
  );

  const isAvailable = existingUser.rows.length === 0;

  res.json({
    success: true,
    available: isAvailable,
    message: isAvailable ? "Email is available" : "Email is already registered",
  });
});

module.exports = {
  register,
  registerWithDocuments,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  checkEmailAvailability,
};
