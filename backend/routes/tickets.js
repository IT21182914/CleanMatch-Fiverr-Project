const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const {
  createTicket,
  getTickets,
  getTicketById,
  addTicketMessage,
  updateTicket,
  getTicketStats,
} = require("../controllers/ticketsController");
const router = express.Router();

// Validation schemas
const ticketCreateSchema = {
  bookingId: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Booking ID must be a positive integer",
    },
  },
  freelancerId: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Freelancer ID must be a positive integer",
    },
  },
  category: {
    in: ["body"],
    isIn: {
      options: [["service_quality", "lateness", "damage", "payment", "other"]],
      errorMessage:
        "Category must be one of: service_quality, lateness, damage, payment, other",
    },
  },
  priority: {
    optional: true,
    isIn: {
      options: [["low", "normal", "high", "urgent"]],
      errorMessage: "Priority must be one of: low, normal, high, urgent",
    },
  },
  summary: {
    in: ["body"],
    isLength: {
      options: { min: 10, max: 255 },
      errorMessage: "Summary must be between 10 and 255 characters",
    },
    trim: true,
  },
  description: {
    in: ["body"],
    isLength: {
      options: { min: 20, max: 2000 },
      errorMessage: "Description must be between 20 and 2000 characters",
    },
    trim: true,
  },
  attachments: {
    optional: true,
    isArray: {
      errorMessage: "Attachments must be an array",
    },
  },
};

const messageSchema = {
  message: {
    in: ["body"],
    isLength: {
      options: { min: 1, max: 2000 },
      errorMessage: "Message must be between 1 and 2000 characters",
    },
    trim: true,
  },
  isInternal: {
    optional: true,
    isBoolean: {
      errorMessage: "isInternal must be a boolean",
    },
  },
  attachments: {
    optional: true,
    isArray: {
      errorMessage: "Attachments must be an array",
    },
  },
};

const ticketUpdateSchema = {
  status: {
    optional: true,
    isIn: {
      options: [
        ["open", "in_progress", "waiting_customer", "resolved", "closed"],
      ],
      errorMessage:
        "Status must be one of: open, in_progress, waiting_customer, resolved, closed",
    },
  },
  priority: {
    optional: true,
    isIn: {
      options: [["low", "normal", "high", "urgent"]],
      errorMessage: "Priority must be one of: low, normal, high, urgent",
    },
  },
  assignedAdminId: {
    optional: true,
    custom: {
      options: (value) =>
        value === null || (Number.isInteger(value) && value > 0),
      errorMessage: "Assigned admin ID must be null or a positive integer",
    },
  },
  internalNotes: {
    optional: true,
    isLength: {
      options: { max: 2000 },
      errorMessage: "Internal notes cannot exceed 2000 characters",
    },
    trim: true,
  },
  resolution: {
    optional: true,
    isLength: {
      options: { min: 10, max: 1000 },
      errorMessage: "Resolution must be between 10 and 1000 characters",
    },
    trim: true,
  },
};

// @route   POST /api/tickets
// @desc    Create new ticket
// @access  Private (Customer only)
router.post(
  "/",
  auth,
  authorize("customer"),
  validate(ticketCreateSchema),
  createTicket
);

// @route   GET /api/tickets/stats
// @desc    Get ticket statistics
// @access  Private (Admin only)
router.get("/stats", auth, authorize("admin"), getTicketStats);

// @route   GET /api/tickets
// @desc    Get tickets (customer sees their own, admin sees all)
// @access  Private
router.get("/", auth, getTickets);

// @route   GET /api/tickets/:id
// @desc    Get ticket details with messages
// @access  Private
router.get("/:id", auth, getTicketById);

// @route   POST /api/tickets/:id/messages
// @desc    Add message to ticket
// @access  Private
router.post("/:id/messages", auth, validate(messageSchema), addTicketMessage);

// @route   PUT /api/tickets/:id
// @desc    Update ticket status/priority/assignment (Admin only)
// @access  Private (Admin only)
router.put(
  "/:id",
  auth,
  authorize("admin"),
  validate(ticketUpdateSchema),
  updateTicket
);

module.exports = router;
