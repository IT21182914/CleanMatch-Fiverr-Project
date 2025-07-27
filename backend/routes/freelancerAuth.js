const express = require("express");
const {
  uploadDocuments,
  processUploadedFiles,
  deleteUploadedFiles,
} = require("../utils/fileUpload");
const { query } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createStripeCustomer } = require("../utils/stripe");
const { asyncHandler } = require("../middleware/errorHandler");
const {
  dbOperation,
  validateRequired,
  isValidEmail,
  validatePasswordStrength,
  ValidationError,
  ConflictError,
} = require("../utils/errorUtils");

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

// @route   POST /api/auth/register-freelancer
// @desc    Register a new freelancer with document uploads
// @access  Public
router.post(
  "/register-freelancer",
  uploadDocuments,
  asyncHandler(async (req, res) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        postalCode,
        cleaningServices,
        cleaningFrequency,
        preferredHours,
        message,
      } = req.body;

      // Parse cleaning services if it's a string
      let parsedCleaningServices = cleaningServices;
      if (typeof cleaningServices === "string") {
        try {
          parsedCleaningServices = JSON.parse(cleaningServices);
        } catch (e) {
          parsedCleaningServices = [cleaningServices];
        }
      }

      // Validate required fields
      validateRequired(
        [
          "email",
          "password",
          "firstName",
          "lastName",
          "phone",
          "address",
          "city",
          "state",
          "postalCode",
        ],
        req.body
      );

      // Validate email format
      if (!isValidEmail(email)) {
        throw new ValidationError("Please provide a valid email address");
      }

      // Validate password strength
      validatePasswordStrength(password);

      // Validate cleaning services
      if (!parsedCleaningServices || parsedCleaningServices.length === 0) {
        throw new ValidationError(
          "Please select at least one cleaning service"
        );
      }

      // Validate file uploads - all four documents are required
      const requiredFiles = ["idFront", "idBack", "ssnFront", "ssnBack"];
      const missingFiles = requiredFiles.filter(
        (field) => !req.files[field] || req.files[field].length === 0
      );

      if (missingFiles.length > 0) {
        throw new ValidationError(
          `Missing required documents: ${missingFiles.join(", ")}`
        );
      }

      // Check if user already exists
      const existingUser = await dbOperation(
        () =>
          query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]),
        "Failed to check existing user"
      );

      if (existingUser.rows.length > 0) {
        // Clean up uploaded files
        const uploadedFilePaths = Object.values(req.files)
          .flat()
          .map((file) => file.filename);
        deleteUploadedFiles(uploadedFilePaths);
        throw new ConflictError("User with this email already exists");
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Process uploaded files
      const fileUrls = processUploadedFiles(req.files);

      // Create user
      const userResult = await dbOperation(
        () =>
          query(
            `INSERT INTO users (email, password, first_name, last_name, phone, role, address, city, state, zip_code) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
           RETURNING id, email, first_name, last_name, role, created_at`,
            [
              email.toLowerCase(),
              hashedPassword,
              firstName,
              lastName,
              phone,
              "cleaner",
              address,
              city,
              state,
              postalCode,
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
      }

      // Create cleaner profile with all freelancer data
      await dbOperation(
        () =>
          query(
            `INSERT INTO cleaner_profiles (
            user_id, cleaning_services, cleaning_frequency, preferred_hours, message,
            id_front_url, id_back_url, ssn_front_url, ssn_back_url,
            agreement_accepted, terms_1099_accepted, brings_supplies, has_experience
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [
              user.id,
              parsedCleaningServices,
              cleaningFrequency || "part-time",
              preferredHours || null,
              message || null,
              fileUrls.id_front_url,
              fileUrls.id_back_url,
              fileUrls.ssn_front_url,
              fileUrls.ssn_back_url,
              true, // agreement_accepted (required checkbox)
              true, // terms_1099_accepted (required checkbox)
              true, // brings_supplies (required checkbox)
              true, // has_experience (required checkbox)
            ]
          ),
        "Failed to create cleaner profile"
      );

      // Generate tokens
      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      res.status(201).json({
        success: true,
        message: "Freelancer registered successfully",
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
      // Clean up uploaded files on error
      if (req.files) {
        const uploadedFilePaths = Object.values(req.files)
          .flat()
          .map((file) => file.filename);
        deleteUploadedFiles(uploadedFilePaths);
      }
      throw error;
    }
  })
);

module.exports = router;
