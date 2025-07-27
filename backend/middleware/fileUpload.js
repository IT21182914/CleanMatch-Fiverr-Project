const { ValidationError } = require("../utils/errorUtils");

/**
 * Middleware to handle file upload errors from multer
 */
const handleFileUploadError = (error, req, res, next) => {
  if (error) {
    console.error("File upload error:", error.message);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: "File size too large. Maximum file size is 10MB.",
      });
    }
    
    if (error.message === 'Only image files are allowed!') {
      return res.status(400).json({
        success: false,
        error: "Only image files are allowed. Please upload JPEG, PNG, or WebP files.",
      });
    }
    
    return res.status(400).json({
      success: false,
      error: `File upload failed: ${error.message}`,
    });
  }
  
  next();
};

/**
 * Middleware to validate uploaded documents
 */
const validateDocuments = (req, res, next) => {
  try {
    const files = req.files;
    
    if (!files || Object.keys(files).length === 0) {
      // Documents are optional, so continue without error
      return next();
    }
    
    const allowedFields = ['idFront', 'idBack', 'ssnFront', 'ssnBack'];
    const uploadedFields = Object.keys(files);
    
    // Check if all uploaded fields are allowed
    const invalidFields = uploadedFields.filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
      throw new ValidationError(`Invalid file fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}`);
    }
    
    // Validate file types and sizes
    for (const [fieldName, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0];
        
        // Check file type
        if (!file.mimetype.startsWith('image/')) {
          throw new ValidationError(`${fieldName}: Only image files are allowed`);
        }
        
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          throw new ValidationError(`${fieldName}: File size exceeds 10MB limit`);
        }
        
        // Check file extension
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const fileExtension = file.originalname.toLowerCase().substr(file.originalname.lastIndexOf('.'));
        if (!allowedExtensions.includes(fileExtension)) {
          throw new ValidationError(`${fieldName}: Invalid file type. Allowed extensions: ${allowedExtensions.join(', ')}`);
        }
      }
    }
    
    // Log successful validation
    console.log(`Document validation passed for ${uploadedFields.length} files`);
    
    next();
  } catch (error) {
    console.error("Document validation error:", error.message);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
    
    return res.status(500).json({
      success: false,
      error: "Document validation failed",
    });
  }
};

/**
 * Middleware to log file upload details
 */
const logFileUpload = (req, res, next) => {
  if (req.files && Object.keys(req.files).length > 0) {
    console.log("📁 File upload details:");
    Object.entries(req.files).forEach(([fieldName, fileArray]) => {
      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0];
        console.log(`  ${fieldName}: ${file.originalname} (${(file.size / 1024).toFixed(2)} KB, ${file.mimetype})`);
      }
    });
  } else {
    console.log("📁 No files uploaded");
  }
  next();
};

module.exports = {
  handleFileUploadError,
  validateDocuments,
  logFileUpload,
};
