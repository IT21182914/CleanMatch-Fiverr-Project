const { createClient } = require("@supabase/supabase-js");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Initialize Supabase client with service role key for backend operations
const supabase = createClient(
  process.env.SUPABASE_URL || "https://vywkpkvvcqibfoskbnga.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5d2twa3Z2Y3FpYmZvc2tibmdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQxMDA3MiwiZXhwIjoyMDY3OTg2MDcyfQ.0TlrMCSfn0_jX3oz5bpjqowk7sdxOxapsyJfJ1R2NOg"
);

// Configure multer for in-memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Middleware for handling document uploads with in-memory storage
const uploadDocuments = upload.fields([
  { name: "idFront", maxCount: 1 },
  { name: "idBack", maxCount: 1 },
  { name: "ssnFront", maxCount: 1 },
  { name: "ssnBack", maxCount: 1 },
]);

/**
 * Upload file to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} fileName - Original filename
 * @param {string} bucketName - Supabase storage bucket name
 * @param {string} filePath - Path within the bucket
 * @returns {Promise<string>} - Public URL of uploaded file
 */
const uploadToSupabase = async (fileBuffer, fileName, bucketName, filePath) => {
  try {
    const fileExtension = fileName.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const fullPath = `${filePath}/${uniqueFileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fullPath, fileBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fullPath);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL for uploaded file");
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error("Upload to Supabase failed:", error);
    throw error;
  }
};

/**
 * Process uploaded files and upload them to Supabase Storage
 * @param {Object} files - Files object from multer
 * @param {string} userId - User ID for organizing files
 * @returns {Promise<Object>} - Object containing public URLs
 */
const processUploadedFiles = async (files, userId) => {
  const processedFiles = {};
  const bucketName = "id-proofs";
  const userFolder = `user-${userId}`;

  try {
    // Ensure bucket exists (this will be handled by Supabase admin)

    // Process ID Front
    if (files.idFront && files.idFront[0]) {
      const file = files.idFront[0];
      processedFiles.id_front_url = await uploadToSupabase(
        file.buffer,
        file.originalname,
        bucketName,
        `${userFolder}/id-front`
      );
    }

    // Process ID Back
    if (files.idBack && files.idBack[0]) {
      const file = files.idBack[0];
      processedFiles.id_back_url = await uploadToSupabase(
        file.buffer,
        file.originalname,
        bucketName,
        `${userFolder}/id-back`
      );
    }

    // Process SSN Front
    if (files.ssnFront && files.ssnFront[0]) {
      const file = files.ssnFront[0];
      processedFiles.ssn_front_url = await uploadToSupabase(
        file.buffer,
        file.originalname,
        bucketName,
        `${userFolder}/ssn-front`
      );
    }

    // Process SSN Back
    if (files.ssnBack && files.ssnBack[0]) {
      const file = files.ssnBack[0];
      processedFiles.ssn_back_url = await uploadToSupabase(
        file.buffer,
        file.originalname,
        bucketName,
        `${userFolder}/ssn-back`
      );
    }

    return processedFiles;
  } catch (error) {
    console.error("Error processing uploaded files:", error);
    throw error;
  }
};

/**
 * Delete files from Supabase Storage
 * @param {Array<string>} fileUrls - Array of public URLs to delete
 * @param {string} bucketName - Bucket name
 */
const deleteUploadedFiles = async (fileUrls, bucketName = "id-proofs") => {
  try {
    const filePaths = fileUrls
      .map((url) => {
        // Extract file path from public URL
        const urlParts = url.split(`/storage/v1/object/public/${bucketName}/`);
        return urlParts[1];
      })
      .filter(Boolean);

    if (filePaths.length > 0) {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove(filePaths);

      if (error) {
        console.error("Error deleting files from Supabase:", error);
      }
    }
  } catch (error) {
    console.error("Error in deleteUploadedFiles:", error);
  }
};

/**
 * Create bucket if it doesn't exist (admin operation)
 */
const createBucketIfNotExists = async (bucketName = "id-proofs") => {
  try {
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
      fileSizeLimit: 10485760, // 10MB
    });

    if (error && !error.message.includes("already exists")) {
      console.error("Error creating bucket:", error);
      throw error;
    }

    console.log(`Bucket '${bucketName}' is ready`);
    return true;
  } catch (error) {
    console.error("Error in createBucketIfNotExists:", error);
    return false;
  }
};

module.exports = {
  uploadDocuments,
  processUploadedFiles,
  deleteUploadedFiles,
  createBucketIfNotExists,
  supabase,
};
