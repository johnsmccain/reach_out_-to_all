import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { X, Save, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// File size limits
const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

// Accepted file types
const ACCEPTED_DOC_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Validation error messages
const VALIDATION_ERRORS = {
  DOC_TOO_LARGE: `Document file size must be less than ${MAX_DOCUMENT_SIZE / (1024 * 1024)}MB`,
  IMAGE_TOO_LARGE: `Thumbnail image size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
  INVALID_DOC_TYPE: "Please select a PDF, DOCX, DOC, or TXT file",
  INVALID_IMAGE_TYPE: "Please select a JPG or PNG image for thumbnail",
  NO_FILE_SELECTED: "Please select a document file",
  TITLE_REQUIRED: "Please enter a title",
  DESCRIPTION_REQUIRED: "Please enter a description",
  UPLOAD_FAILED: "Failed to upload document. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
};

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadAttempts, setUploadAttempts] = useState(0);
  const [fileError, setFileError] = useState<string>("");
  const [thumbnailError, setThumbnailError] = useState<string>("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setFileError("");
      setThumbnailError("");
      setUploadAttempts(0);
    }
  }, [isOpen]);

  // Comprehensive document file validation
  const validateDocumentFile = (file: File): string | null => {
    // Validate file type
    if (!ACCEPTED_DOC_TYPES.includes(file.type)) {
      return VALIDATION_ERRORS.INVALID_DOC_TYPE;
    }

    // Validate file size
    if (file.size > MAX_DOCUMENT_SIZE) {
      return VALIDATION_ERRORS.DOC_TOO_LARGE;
    }

    // Check if file has content
    if (file.size === 0) {
      return "File is empty. Please select a valid document.";
    }

    return null;
  };

  // Comprehensive image file validation
  const validateImageFile = (file: File): string | null => {
    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return VALIDATION_ERRORS.INVALID_IMAGE_TYPE;
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      return VALIDATION_ERRORS.IMAGE_TOO_LARGE;
    }

    return null;
  };

  // Handle document file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFileError("");
      return;
    }

    // Validate file
    const validationError = validateDocumentFile(file);
    if (validationError) {
      setFileError(validationError);
      toast.error(validationError);
      setSelectedFile(null);
      e.target.value = ""; // Clear the input
      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  // Handle thumbnail image selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setThumbnailError("");
      setThumbnailFile(null);
      setThumbnailPreview(null);
      return;
    }

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setThumbnailError(validationError);
      toast.error(validationError);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      e.target.value = ""; // Clear the input
      return;
    }

    setThumbnailError("");
    setThumbnailFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.onerror = () => {
      toast.error("Failed to read thumbnail file. Please try again.");
      setThumbnailFile(null);
      setThumbnailPreview(null);
    };
    reader.readAsDataURL(file);
  };

  // Get file type from MIME type
  const getFileType = (mimeType: string): string => {
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("word") || mimeType.includes("msword")) return "DOCX";
    if (mimeType.includes("text")) return "TXT";
    return "Document";
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Upload with retry mechanism
  const uploadFileWithRetry = async (
    bucket: string,
    filename: string,
    file: File,
    maxRetries: number = 2
  ): Promise<{ success: boolean; error?: any }> => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filename, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        return { success: true };
      } catch (error: any) {
        console.error(`Upload attempt ${attempt + 1} failed:`, error);
        
        if (attempt === maxRetries) {
          return { success: false, error };
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }

    return { success: false };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all inputs
    if (!selectedFile) {
      toast.error(VALIDATION_ERRORS.NO_FILE_SELECTED);
      return;
    }

    // Validate file again before upload
    const fileValidationError = validateDocumentFile(selectedFile);
    if (fileValidationError) {
      toast.error(fileValidationError);
      return;
    }

    if (!title.trim()) {
      toast.error(VALIDATION_ERRORS.TITLE_REQUIRED);
      return;
    }

    if (!description.trim()) {
      toast.error(VALIDATION_ERRORS.DESCRIPTION_REQUIRED);
      return;
    }

    // Validate thumbnail if provided
    if (thumbnailFile) {
      const thumbnailValidationError = validateImageFile(thumbnailFile);
      if (thumbnailValidationError) {
        toast.error(thumbnailValidationError);
        return;
      }
    }

    setIsUploading(true);
    setUploadAttempts(prev => prev + 1);

    let uploadedThumbnailFilename: string | null = null;
    let uploadedDocFilename: string | null = null;

    try {
      let thumbnailUrl: string | null = null;
      const timestamp = Date.now();

      // Upload thumbnail if provided
      if (thumbnailFile) {
        const sanitizedThumbnailName = thumbnailFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        uploadedThumbnailFilename = `thumbnail-${timestamp}-${sanitizedThumbnailName}`;

        const thumbnailResult = await uploadFileWithRetry(
          "documents",
          uploadedThumbnailFilename,
          thumbnailFile
        );

        if (!thumbnailResult.success) {
          console.warn('Thumbnail upload failed, continuing without thumbnail');
          thumbnailUrl = null;
        } else {
          const { data: thumbnailUrlData } = supabase.storage
            .from("documents")
            .getPublicUrl(uploadedThumbnailFilename);

          thumbnailUrl = thumbnailUrlData?.publicUrl || null;
        }
      }

      // Upload document file
      const sanitizedDocName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      uploadedDocFilename = `doc-${timestamp}-${sanitizedDocName}`;

      const docResult = await uploadFileWithRetry(
        "documents",
        uploadedDocFilename,
        selectedFile
      );

      if (!docResult.success) {
        throw new Error(docResult.error?.message || VALIDATION_ERRORS.UPLOAD_FAILED);
      }

      // Get public URL for document
      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(uploadedDocFilename);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL for document");
      }

      // Calculate file size and extract file type
      const fileSize = formatFileSize(selectedFile.size);
      const fileType = getFileType(selectedFile.type);

      // Store metadata in database
      const { error: dbError } = await supabase.from("documents").insert([
        {
          title: title.trim(),
          description: description.trim(),
          file_url: urlData.publicUrl,
          file_type: fileType,
          file_size: fileSize,
          image_url: thumbnailUrl,
        },
      ]);

      if (dbError) {
        // If database insert fails, try to delete the uploaded files
        console.error("Database insert failed, cleaning up uploaded files:", dbError);
        
        const filesToRemove = [uploadedDocFilename];
        if (uploadedThumbnailFilename) {
          filesToRemove.push(uploadedThumbnailFilename);
        }
        
        await supabase.storage.from("documents").remove(filesToRemove);
        throw new Error(`Database error: ${dbError.message}`);
      }

      toast.success("Document uploaded successfully!");
      setUploadAttempts(0);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error uploading document:", error);
      
      // Provide specific error messages
      let errorMessage = VALIDATION_ERRORS.UPLOAD_FAILED;
      
      if (error.message?.includes("Network")) {
        errorMessage = VALIDATION_ERRORS.NETWORK_ERROR;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      // Offer retry if this was the first attempt
      if (uploadAttempts < 2) {
        toast.error("You can try uploading again.", { duration: 4000 });
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-linear-to-r from-blue-700 via-blue-600 to-blue-500   dark:from-red-700 dark:via-red-600 dark:to-red-500    text-white p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Upload Document
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-88px)]">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter document title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder="Enter document description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Document File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Document File *
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Accepted formats: PDF, DOCX, DOC, TXT (Max: {MAX_DOCUMENT_SIZE / (1024 * 1024)}MB)
                </p>
                {fileError && (
                  <p className="mt-2 text-sm text-red-600">{fileError}</p>
                )}
                {selectedFile && !fileError && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              {/* Thumbnail Image Input (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  Thumbnail Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleThumbnailChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Accepted formats: JPG, PNG (Max: {MAX_IMAGE_SIZE / (1024 * 1024)}MB)
                </p>
                {thumbnailError && (
                  <p className="mt-2 text-sm text-red-600">{thumbnailError}</p>
                )}
              </div>

              {/* Thumbnail Preview */}
              {thumbnailPreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Preview
                  </label>
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-auto max-h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  disabled={isUploading}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isUploading || !selectedFile || !title.trim() || !description.trim() || !!fileError || !!thumbnailError}
                  className="px-6 py-3 bg-linear-to-r from-blue-700 via-blue-600 to-blue-500   dark:from-red-700 dark:via-red-600 dark:to-red-500   text-white font-medium rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Upload Document</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DocumentUploadModal;
