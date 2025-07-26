const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
const documentsDir = path.join(uploadsDir, "documents");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and user ID
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const userId = req.user?.id || "temp";
    const extension = path.extname(file.originalname);
    cb(null, `${userId}-${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, GIF, WEBP) are allowed"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 4, // Maximum 4 files (id front, id back, ssn front, ssn back)
  },
});

// Middleware for handling document uploads
const uploadDocuments = upload.fields([
  { name: "idFront", maxCount: 1 },
  { name: "idBack", maxCount: 1 },
  { name: "ssnFront", maxCount: 1 },
  { name: "ssnBack", maxCount: 1 },
]);

// Helper function to process uploaded files
const processUploadedFiles = (files) => {
  const processedFiles = {};

  if (files.idFront && files.idFront[0]) {
    processedFiles.id_front_url = `/uploads/documents/${files.idFront[0].filename}`;
  }

  if (files.idBack && files.idBack[0]) {
    processedFiles.id_back_url = `/uploads/documents/${files.idBack[0].filename}`;
  }

  if (files.ssnFront && files.ssnFront[0]) {
    processedFiles.ssn_front_url = `/uploads/documents/${files.ssnFront[0].filename}`;
  }

  if (files.ssnBack && files.ssnBack[0]) {
    processedFiles.ssn_back_url = `/uploads/documents/${files.ssnBack[0].filename}`;
  }

  return processedFiles;
};

// Helper function to delete uploaded files (for cleanup on error)
const deleteUploadedFiles = (filePaths) => {
  filePaths.forEach((filePath) => {
    const fullPath = path.join(documentsDir, path.basename(filePath));
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  });
};

module.exports = {
  uploadDocuments,
  processUploadedFiles,
  deleteUploadedFiles,
};
