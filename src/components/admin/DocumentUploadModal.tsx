import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

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

    // Additional validation: check if file is actually an image
    if (!file.type.startsWith("image/")) {
      return VALIDATION_ERRORS.INVALID_IMAGE_TYPE;
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
          throw new Error(`Thumbnail upload failed: ${thumbnailResult.error?.message || 'Unknown error'}`);
        }

        // Get public URL for thumbnail
        const { data: thumbnailUrlData } = supabase.storage
          .from("documents")
          .getPublicUrl(uploadedThumbnailFilename);

        if (!thumbnailUrlData?.publicUrl) {
          throw new Error("Failed to get public URL for thumbnail");
        }

        thumbnailUrl = thumbnailUrlData.publicUrl;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Upload Document</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter document title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Enter document description"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          {/* Document File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: PDF, DOCX, DOC, TXT (Max: {MAX_DOCUMENT_SIZE / (1024 * 1024)}MB)
            </p>
            {fileError && (
              <p className="mt-1 text-sm text-red-600">{fileError}</p>
            )}
            {selectedFile && !fileError && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          {/* Thumbnail Image Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail Image (Optional)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleThumbnailChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: JPG, PNG (Max: {MAX_IMAGE_SIZE / (1024 * 1024)}MB)
            </p>
            {thumbnailError && (
              <p className="mt-1 text-sm text-red-600">{thumbnailError}</p>
            )}
          </div>

          {/* Thumbnail Preview */}
          {thumbnailPreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Preview
              </label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="max-w-full h-auto max-h-48 mx-auto rounded-md"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFile || !title.trim() || !description.trim() || !!fileError || !!thumbnailError}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
