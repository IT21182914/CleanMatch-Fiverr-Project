const Joi = require("joi");

const validate = (schema) => {
  return (req, res, next) => {
    console.log("🔍 Validating request body:", req.body);
    console.log("🔍 Content-Type:", req.headers['content-type']);
    
    const { error } = schema.validate(req.body);
    if (error) {
      console.log("❌ Validation error:", error.details[0].message);
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }
    console.log("✅ Validation passed");
    next();
  };
};

// User validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "First name must be at least 2 characters long",
    "string.max": "First name cannot exceed 50 characters",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Last name must be at least 2 characters long",
    "string.max": "Last name cannot exceed 50 characters",
    "any.required": "Last name is required",
  }),
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  role: Joi.string().valid("customer", "cleaner").required().messages({
    "any.only": "Role must be either customer or cleaner",
    "any.required": "Role is required",
  }),
  address: Joi.string().required().messages({
    "any.required": "Address is required",
  }),
  city: Joi.string().required().messages({
    "any.required": "City is required",
  }),
  state: Joi.string().required().messages({
    "any.required": "State is required",
  }),
  zipCode: Joi.string().required().messages({
    "any.required": "ZIP code is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/),
  address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  zipCode: Joi.string(),
});

// Cleaner profile validation
const cleanerProfileSchema = Joi.object({
  bio: Joi.string().max(1000),
  experienceYears: Joi.number().integer().min(0).max(50),
  hourlyRate: Joi.number().positive().precision(2),
  serviceRadius: Joi.number().integer().min(1).max(100),
  availabilitySchedule: Joi.object(),
  certifications: Joi.array().items(Joi.string()),
});

// Booking validation
const bookingSchema = Joi.object({
  serviceId: Joi.number().integer().positive().required(),
  bookingDate: Joi.date().greater("now").required(),
  bookingTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  durationHours: Joi.number().integer().min(1).max(12).required(),
  specialInstructions: Joi.string().max(500),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
});

// Service validation
const serviceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  basePrice: Joi.number().positive().precision(2).required(),
  durationHours: Joi.number().integer().min(1).max(12).required(),
  category: Joi.string().required(),
});

// Review validation
const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  cleanerProfileSchema,
  bookingSchema,
  serviceSchema,
  reviewSchema,
};
