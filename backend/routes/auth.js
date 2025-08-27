const express = require("express");
const {
  validate,
  registerSchema,
  loginSchema,
} = require("../middleware/validation");
const { auth } = require("../middleware/auth");
const { uploadDocuments } = require("../utils/supabaseStorage");
const {
  handleFileUploadError,
  validateDocuments,
  logFileUpload,
} = require("../middleware/fileUpload");
const {
  register,
  registerWithDocuments,
  login,
  logout,
  logoutFromAllDevices,
  refreshToken,
  forgotPassword,
  resetPassword,
  checkEmailAvailability,
} = require("../controllers/authController");
const router = express.Router();

// @route   POST /api/auth/check-email
// @desc    Check if email is available
// @access  Public
router.post("/check-email", checkEmailAvailability);

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", validate(registerSchema), register);

// @route   POST /api/auth/register-with-documents
// @desc    Register a new user with document uploads
// @access  Public
router.post(
  "/register-with-documents",
  uploadDocuments,
  handleFileUploadError,
  logFileUpload,
  validateDocuments,
  registerWithDocuments
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validate(loginSchema), login);

// @route   POST /api/auth/logout
// @desc    Logout user and blacklist current token
// @access  Private
router.post("/logout", auth, logout);

// @route   POST /api/auth/logout-all
// @desc    Logout user from all devices
// @access  Private
router.post("/logout-all", auth, logoutFromAllDevices);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post("/refresh", refreshToken);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post("/reset-password", resetPassword);

module.exports = router;
