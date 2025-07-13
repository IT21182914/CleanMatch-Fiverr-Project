const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send welcome email to new user
 * @param {string} email - User email
 * @param {string} firstName - User first name
 * @param {string} role - User role
 */
const sendWelcomeEmail = async (email, firstName, role) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to CleanMatch!",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #2c5aa0;">Welcome to CleanMatch, ${firstName}!</h1>
          <p>Thank you for joining CleanMatch - the AI-powered cleaning services marketplace.</p>
          
          ${
            role === "customer"
              ? `
            <h2>As a customer, you can:</h2>
            <ul>
              <li>Book cleaning services instantly</li>
              <li>Get matched with top-rated cleaners in your area</li>
              <li>Track your booking status in real-time</li>
              <li>Rate and review your cleaning experience</li>
            </ul>
          `
              : `
            <h2>As a cleaner, you can:</h2>
            <ul>
              <li>Set your availability and service area</li>
              <li>Receive booking requests automatically</li>
              <li>Build your reputation with customer reviews</li>
              <li>Manage your earnings through our platform</li>
            </ul>
          `
          }
          
          <p>Get started by completing your profile and exploring our platform!</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
            <p><strong>Need help?</strong> Contact our support team at support@cleanmatch.com</p>
          </div>
          
          <p>Best regards,<br>The CleanMatch Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

/**
 * Send booking confirmation email
 * @param {Object} booking - Booking details
 * @param {Object} customer - Customer details
 * @param {Object} cleaner - Cleaner details (if assigned)
 */
const sendBookingConfirmationEmail = async (
  booking,
  customer,
  cleaner = null
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: "Booking Confirmation - CleanMatch",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #2c5aa0;">Booking Confirmed!</h1>
          <p>Hi ${customer.first_name},</p>
          <p>Your cleaning service booking has been confirmed.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Booking Details:</h3>
            <p><strong>Service:</strong> ${booking.service_name}</p>
            <p><strong>Date:</strong> ${new Date(
              booking.booking_date
            ).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.booking_time}</p>
            <p><strong>Duration:</strong> ${booking.duration_hours} hours</p>
            <p><strong>Address:</strong> ${booking.address}, ${booking.city}, ${
        booking.state
      } ${booking.zip_code}</p>
            <p><strong>Total Amount:</strong> $${parseFloat(
              booking.total_amount
            ).toFixed(2)}</p>
            
            ${
              cleaner
                ? `
              <h3>Your Cleaner:</h3>
              <p><strong>Name:</strong> ${cleaner.first_name} ${cleaner.last_name}</p>
              <p><strong>Phone:</strong> ${cleaner.phone}</p>
              <p><strong>Rating:</strong> ${cleaner.rating}/5.0</p>
            `
                : `
              <p><em>We're finding the perfect cleaner for you and will notify you once assigned.</em></p>
            `
            }
          </div>
          
          <p>You'll receive another email once your cleaner arrives and when the service is completed.</p>
          
          <p>Thank you for choosing CleanMatch!</p>
          <p>Best regards,<br>The CleanMatch Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
  }
};

/**
 * Send booking reminder email
 * @param {Object} booking - Booking details
 * @param {Object} customer - Customer details
 * @param {Object} cleaner - Cleaner details
 */
const sendBookingReminderEmail = async (booking, customer, cleaner) => {
  try {
    // Send to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: "Booking Reminder - CleanMatch",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #2c5aa0;">Booking Reminder</h1>
          <p>Hi ${customer.first_name},</p>
          <p>This is a reminder that your cleaning service is scheduled for tomorrow.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Booking Details:</h3>
            <p><strong>Date:</strong> ${new Date(
              booking.booking_date
            ).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.booking_time}</p>
            <p><strong>Cleaner:</strong> ${cleaner.first_name} ${
        cleaner.last_name
      }</p>
            <p><strong>Phone:</strong> ${cleaner.phone}</p>
          </div>
          
          <p>Please ensure someone is available to provide access to your property.</p>
          <p>Best regards,<br>The CleanMatch Team</p>
        </div>
      `,
    };

    // Send to cleaner
    const cleanerMailOptions = {
      from: process.env.EMAIL_USER,
      to: cleaner.email,
      subject: "Booking Reminder - CleanMatch",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #2c5aa0;">Booking Reminder</h1>
          <p>Hi ${cleaner.first_name},</p>
          <p>This is a reminder that you have a cleaning appointment tomorrow.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Booking Details:</h3>
            <p><strong>Date:</strong> ${new Date(
              booking.booking_date
            ).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.booking_time}</p>
            <p><strong>Customer:</strong> ${customer.first_name} ${
        customer.last_name
      }</p>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            <p><strong>Address:</strong> ${booking.address}, ${booking.city}, ${
        booking.state
      } ${booking.zip_code}</p>
          </div>
          
          <p>Please arrive on time and contact the customer if you need to make any changes.</p>
          <p>Best regards,<br>The CleanMatch Team</p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(cleanerMailOptions),
    ]);

    console.log("Booking reminder emails sent successfully");
  } catch (error) {
    console.error("Error sending booking reminder emails:", error);
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} firstName - User first name
 * @param {string} resetLink - Password reset link
 */
const sendPasswordResetEmail = async (email, firstName, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset - CleanMatch",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #2c5aa0;">Password Reset Request</h1>
          <p>Hi ${firstName},</p>
          <p>You requested a password reset for your CleanMatch account.</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #2c5aa0; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </div>
          
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          
          <p>Best regards,<br>The CleanMatch Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

/**
 * Send invoice email
 * @param {Object} booking - Booking details
 * @param {Object} customer - Customer details
 */
const sendInvoiceEmail = async (booking, customer) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: "Service Invoice - CleanMatch",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #2c5aa0;">Service Invoice</h1>
          <p>Hi ${customer.first_name},</p>
          <p>Thank you for using CleanMatch! Here's your service invoice.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Invoice #${booking.id}</h3>
            <p><strong>Service:</strong> ${booking.service_name}</p>
            <p><strong>Date:</strong> ${new Date(
              booking.booking_date
            ).toLocaleDateString()}</p>
            <p><strong>Duration:</strong> ${booking.duration_hours} hours</p>
            <p><strong>Rate:</strong> $${(
              parseFloat(booking.total_amount) / booking.duration_hours
            ).toFixed(2)}/hour</p>
            <p><strong>Total Amount:</strong> $${parseFloat(
              booking.total_amount
            ).toFixed(2)}</p>
            <p><strong>Payment Status:</strong> ${booking.payment_status}</p>
          </div>
          
          <p>We hope you were satisfied with our service. Please consider leaving a review!</p>
          
          <p>Best regards,<br>The CleanMatch Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Invoice email sent successfully");
  } catch (error) {
    console.error("Error sending invoice email:", error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
  sendBookingReminderEmail,
  sendPasswordResetEmail,
  sendInvoiceEmail,
};
