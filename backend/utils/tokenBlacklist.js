const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");

/**
 * Generate a SHA256 hash of a token for secure storage
 * @param {string} token - The JWT token
 * @returns {string} - SHA256 hash of the token
 */
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Extract expiration date from JWT token
 * @param {string} token - The JWT token
 * @returns {Date} - Expiration date
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    throw new Error("Invalid token format");
  }
};

/**
 * Add a token to the blacklist
 * @param {string} token - The JWT token to blacklist
 * @param {number} userId - User ID who owns the token
 * @param {string} reason - Reason for blacklisting (logout, password_reset, account_suspended)
 * @returns {Promise<boolean>} - Success status
 */
const blacklistToken = async (token, userId, reason = "logout") => {
  try {
    const tokenHash = hashToken(token);
    const expiresAt = getTokenExpiration(token);

    await query(
      `INSERT INTO token_blacklist (token_hash, user_id, expires_at, reason) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (token_hash) DO NOTHING`,
      [tokenHash, userId, expiresAt, reason]
    );

    return true;
  } catch (error) {
    console.error("Error blacklisting token:", error);
    return false;
  }
};

/**
 * Check if a token is blacklisted
 * @param {string} token - The JWT token to check
 * @returns {Promise<boolean>} - True if blacklisted, false otherwise
 */
const isTokenBlacklisted = async (token) => {
  try {
    const tokenHash = hashToken(token);

    const result = await query(
      `SELECT id FROM token_blacklist 
       WHERE token_hash = $1 AND expires_at > NOW()`,
      [tokenHash]
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking token blacklist:", error);
    // In case of database error, assume token is valid to avoid blocking legitimate users
    return false;
  }
};

/**
 * Blacklist all tokens for a specific user
 * @param {number} userId - User ID
 * @param {string} reason - Reason for blacklisting
 * @returns {Promise<boolean>} - Success status
 */
const blacklistAllUserTokens = async (userId, reason = "account_suspended") => {
  try {
    // We can't blacklist all existing tokens without knowing them,
    // but we can set a timestamp for when all tokens before this time are invalid
    // For now, we'll implement this by updating the user's record with a token_invalidation_date

    // This would require adding a column to users table:
    // ALTER TABLE users ADD COLUMN IF NOT EXISTS token_invalidation_date TIMESTAMP;

    await query(
      `UPDATE users SET token_invalidation_date = NOW() WHERE id = $1`,
      [userId]
    );

    return true;
  } catch (error) {
    console.error("Error blacklisting all user tokens:", error);
    return false;
  }
};

/**
 * Clean up expired blacklisted tokens (should be run as a cron job)
 * @returns {Promise<number>} - Number of tokens removed
 */
const cleanupExpiredTokens = async () => {
  try {
    const result = await query(
      `DELETE FROM token_blacklist WHERE expires_at <= NOW()`
    );

    console.log(`🧹 Cleaned up ${result.rowCount} expired blacklisted tokens`);
    return result.rowCount;
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
    return 0;
  }
};

module.exports = {
  hashToken,
  getTokenExpiration,
  blacklistToken,
  isTokenBlacklisted,
  blacklistAllUserTokens,
  cleanupExpiredTokens,
};
