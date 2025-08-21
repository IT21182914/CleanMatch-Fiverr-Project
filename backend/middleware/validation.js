const Joi = require("joi");

const validate = (schema) => {
  return (req, res, next) => {
    console.log("🔍 Validating request body:", req.body);
    console.log("🔍 Content-Type:", req.headers["content-type"]);

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
    .pattern(/^[\+]?[0-9][\d]{0,15}$/)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  role: Joi.string().valid("customer", "cleaner").required().messages({
    "any.only": "Role must be either customer or cleaner",
    "any.required": "Role is required",
  }),

  // Customer-specific fields
  userName: Joi.when("role", {
    is: "customer",
    then: Joi.string().min(3).max(30).required().messages({
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username cannot exceed 30 characters",
      "any.required": "Username is required",
    }),
    otherwise: Joi.forbidden(),
  }),

  // Address fields - required for cleaners, optional for customers
  address: Joi.when("role", {
    is: "cleaner",
    then: Joi.string().required().messages({
      "any.required": "Address is required",
    }),
    otherwise: Joi.string().optional(),
  }),
  city: Joi.when("role", {
    is: "cleaner",
    then: Joi.string().required().messages({
      "any.required": "City is required",
    }),
    otherwise: Joi.string().optional(),
  }),
  state: Joi.when("role", {
    is: "cleaner",
    then: Joi.string().required().messages({
      "any.required": "State is required",
    }),
    otherwise: Joi.string().optional(),
  }),
  zipCode: Joi.when("role", {
    is: "cleaner",
    then: Joi.string().required().messages({
      "any.required": "Postal code is required",
    }),
    otherwise: Joi.string().optional(),
  }),
  cleaningServices: Joi.when("role", {
    is: "cleaner",
    then: Joi.array().items(Joi.string()).min(1).required().messages({
      "array.min": "Please select at least one cleaning service",
      "any.required": "Cleaning services are required",
    }),
    otherwise: Joi.forbidden(),
  }),
  cleaningFrequency: Joi.when("role", {
    is: "cleaner",
    then: Joi.string()
      .valid("part-time", "full-time", "preferred-hours")
      .required()
      .messages({
        "any.only":
          "Cleaning frequency must be part-time, full-time, or preferred-hours",
        "any.required": "Cleaning frequency is required",
      }),
    otherwise: Joi.forbidden(),
  }),
  preferredHours: Joi.when("cleaningFrequency", {
    is: "preferred-hours",
    then: Joi.string().required().messages({
      "any.required":
        "Preferred hours are required when selecting preferred-hours frequency",
    }),
    otherwise: Joi.string().allow(""),
  }),
  message: Joi.string().max(1000).allow("").messages({
    "string.max": "Message cannot exceed 1000 characters",
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
  bookingDate: Joi.date().required(),
  bookingTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  durationHours: Joi.number().integer().min(1).max(12).required(),
  specialInstructions: Joi.string().max(500).allow("", null).optional(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  locationMethod: Joi.string().required(),
  zipCode: Joi.string().allow(null),
  latitude: Joi.number().allow(null),
  longitude: Joi.number().allow(null),
  homeSize: Joi.string().valid("small", "medium", "large", "xlarge"),
  bedrooms: Joi.string(),
  bathrooms: Joi.string(),
  pets: Joi.boolean(),
  frequency: Joi.string().valid("one-time", "weekly", "bi-weekly", "monthly"),
  addOns: Joi.array().items(
    Joi.object({
      id: Joi.number().integer().positive().required(),
      price: Joi.number().positive().required(),
    })
  ),
  autoAssign: Joi.boolean(),
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

// Admin review validation schemas
const adminReviewSchema = Joi.object({
  cleanerId: Joi.number().integer().positive().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000),
  customerName: Joi.string().max(100),
  serviceName: Joi.string().max(100),
  adminNotes: Joi.string().max(500),
});

const bulkAdminReviewSchema = Joi.object({
  cleanerId: Joi.number().integer().positive().required(),
  adminNotes: Joi.string().max(500),
  reviews: Joi.array()
    .items(
      Joi.object({
        rating: Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string().max(1000),
        customerName: Joi.string().max(100),
      })
    )
    .min(1)
    .max(20)
    .required(),
});

const updateAdminReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  comment: Joi.string().max(1000),
  adminNotes: Joi.string().max(500),
  isVisible: Joi.boolean(),
});

// Ticket validation schemas
const ticketCreateSchema = Joi.object({
  bookingId: Joi.number().integer().positive().optional().allow(null),
  freelancerId: Joi.number().integer().positive().optional().allow(null),
  category: Joi.string()
    .valid("service_quality", "lateness", "damage", "payment", "other")
    .required(),
  priority: Joi.string()
    .valid("low", "normal", "high", "urgent")
    .default("normal"),
  summary: Joi.string().min(5).max(255).required(),
  description: Joi.string().min(10).max(2000).required(),
  attachments: Joi.array().items(Joi.string()).default([]),
});

const ticketMessageSchema = Joi.object({
  message: Joi.string().min(1).max(1000).required(),
  isInternal: Joi.boolean().default(false),
  attachments: Joi.array().items(Joi.string()).default([]),
});

const ticketUpdateSchema = Joi.object({
  status: Joi.string()
    .valid("open", "in_progress", "waiting_customer", "resolved", "closed")
    .optional(),
  priority: Joi.string().valid("low", "normal", "high", "urgent").optional(),
  assignedAdminId: Joi.number().integer().positive().optional().allow(null),
  internalNotes: Joi.string().max(2000).optional().allow(""),
  resolution: Joi.string().max(1000).optional().allow(""),
});

const ticketBulkUpdateSchema = Joi.object({
  ticketIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required(),
  updates: Joi.object({
    status: Joi.string()
      .valid("open", "in_progress", "waiting_customer", "resolved", "closed")
      .optional(),
    priority: Joi.string().valid("low", "normal", "high", "urgent").optional(),
    assignedAdminId: Joi.number().integer().positive().optional().allow(null),
  })
    .min(1)
    .required(),
});

// Admin ticket management validation schemas
const adminTicketStatusSchema = Joi.object({
  status: Joi.string()
    .valid("open", "in_progress", "waiting_customer", "resolved", "closed")
    .required(),
  reason: Joi.string().max(500).optional(),
});

const adminTicketAssignSchema = Joi.object({
  adminId: Joi.alternatives()
    .try(
      Joi.number().integer().positive(),
      Joi.string().valid("unassign"),
      Joi.allow(null)
    )
    .required(),
});

const adminTicketReplySchema = Joi.object({
  message: Joi.string().min(1).max(2000).required(),
  isInternal: Joi.boolean().default(false),
  updateStatus: Joi.string()
    .valid("in_progress", "waiting_customer", "resolved")
    .optional(),
});

const adminTicketInvestigateSchema = Joi.object({
  findings: Joi.string().min(10).max(2000).required(),
  actionsTaken: Joi.string().min(5).max(1000).required(),
  internalNotes: Joi.string().max(1000).optional(),
});

const adminTicketResolveSchema = Joi.object({
  resolution: Joi.string().min(10).max(1000).required(),
  customerMessage: Joi.string().min(10).max(1000).optional(),
  actionsTaken: Joi.string().max(1000).optional(),
});

const adminTicketCloseSchema = Joi.object({
  reason: Joi.string().max(500).optional(),
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
  // Admin review schemas are disabled:
  // adminReviewSchema,
  // bulkAdminReviewSchema,
  // updateAdminReviewSchema,
  ticketCreateSchema,
  ticketMessageSchema,
  ticketUpdateSchema,
  ticketBulkUpdateSchema,
  // Admin ticket management schemas
  adminTicketStatusSchema,
  adminTicketAssignSchema,
  adminTicketReplySchema,
  adminTicketInvestigateSchema,
  adminTicketResolveSchema,
  adminTicketCloseSchema,
};
