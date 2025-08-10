const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const {
  validate,
  ticketCreateSchema,
  ticketMessageSchema,
  ticketUpdateSchema,
  ticketBulkUpdateSchema,
} = require("../middleware/validation");
const {
  createTicket,
  getTickets,
  getTicketById,
  addTicketMessage,
  updateTicket,
  bulkUpdateTickets,
  getTicketStats,
} = require("../controllers/ticketsController");

const router = express.Router();

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

// @route   PUT /api/tickets/bulk
// @desc    Bulk update tickets
// @access  Private (Admin only)
router.put(
  "/bulk",
  auth,
  authorize("admin"),
  validate(ticketBulkUpdateSchema),
  bulkUpdateTickets
);

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
router.post(
  "/:id/messages",
  auth,
  validate(ticketMessageSchema),
  addTicketMessage
);

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
