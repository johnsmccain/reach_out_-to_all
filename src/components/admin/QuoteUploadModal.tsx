import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface QuoteUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// File size limits
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

// Validation error messages
const VALIDATION_ERRORS = {
  FILE_TOO_LARGE: `File size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: "Please select a PNG, JPEG, or JPG image file",
  NO_FILE_SELECTED: "Please select an image file",
  DATE_ALREADY_EXISTS: "A quote already exists for this date",
  UPLOAD_FAILED: "Failed to upload quote image. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
};

const QuoteUploadModal: React.FC<QuoteUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isUploading, setIsUploading] = useState(false);
  const [dateError, setDateError] = useState<string>("");
  const [uploadAttempts, setUploadAttempts] = useState(0);
  const [fileError, setFileError] = useState<string>("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedDate(new Date().toISOString().split("T")[0]);
      setDateError("");
      setFileError("");
      setUploadAttempts(0);
    }
  }, [isOpen]);

  // Comprehensive file validation
  const validateFile = (file: File): string | null => {
    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return VALIDATION_ERRORS.INVALID_FILE_TYPE;
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      return VALIDATION_ERRORS.FILE_TOO_LARGE;
    }

    // Additional validation: check if file is actually an image
    if (!file.type.startsWith("image/")) {
      return VALIDATION_ERRORS.INVALID_FILE_TYPE;
    }

    return null;
  };

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setFileError("");
      return;
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      toast.error(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      e.target.value = ""; // Clear the input
      return;
    }

    setFileError("");
    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.onerror = () => {
      toast.error("Failed to read file. Please try again.");
      setSelectedFile(null);
      setPreviewUrl(null);
    };
    reader.readAsDataURL(file);
  };

  // Validate date uniqueness
  const validateDate = async (date: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("daily_quotes")
        .select("id")
        .eq("date", date)
        .maybeSingle();

      if (error) {
        console.error("Error checking date:", error);
        toast.error("Failed to validate date. Please try again.");
        return false;
      }

      if (data) {
        setDateError(VALIDATION_ERRORS.DATE_ALREADY_EXISTS);
        return false;
      }

      setDateError("");
      return true;
    } catch (error) {
      console.error("Network error checking date:", error);
      toast.error(VALIDATION_ERRORS.NETWORK_ERROR);
      return false;
    }
  };

  // Handle date change
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    await validateDate(date);
  };

  // Upload with retry mechanism
  const uploadWithRetry = async (
    filename: string,
    file: File,
    maxRetries: number = 2
  ): Promise<{ success: boolean; error?: any }> => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const { error: uploadError } = await supabase.storage
          .from("quote-images")
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

    // Validate file exists
    if (!selectedFile) {
      toast.error(VALIDATION_ERRORS.NO_FILE_SELECTED);
      return;
    }

    // Validate file again before upload
    const validationError = validateFile(selectedFile);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Check for date error
    if (dateError) {
      toast.error("Please select a different date");
      return;
    }

    // Validate date one more time before upload
    const isDateValid = await validateDate(selectedDate);
    if (!isDateValid) {
      return;
    }

    setIsUploading(true);
    setUploadAttempts(prev => prev + 1);

    try {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `quote-${timestamp}-${sanitizedName}`;

      // Upload to Supabase Storage with retry
      const uploadResult = await uploadWithRetry(filename, selectedFile);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error?.message || VALIDATION_ERRORS.UPLOAD_FAILED);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("quote-images")
        .getPublicUrl(filename);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL for uploaded file");
      }

      // Store metadata in database
      const { error: dbError } = await supabase.from("daily_quotes").insert([
        {
          image_url: urlData.publicUrl,
          image_type: "image",
          date: selectedDate,
        },
      ]);

      if (dbError) {
        // If database insert fails, try to delete the uploaded file
        console.error("Database insert failed, cleaning up uploaded file:", dbError);
        await supabase.storage.from("quote-images").remove([filename]);
        throw new Error(`Database error: ${dbError.message}`);
      }

      toast.success("Quote image uploaded successfully!");
      setUploadAttempts(0);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error uploading quote image:", error);
      
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
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Upload Quote Image</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
            {dateError && (
              <p className="mt-1 text-sm text-red-600">{dateError}</p>
            )}
          </div>

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quote Image (PNG/JPG/JPEG)
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
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
              Maximum file size: {MAX_IMAGE_SIZE / (1024 * 1024)}MB
            </p>
            {fileError && (
              <p className="mt-1 text-sm text-red-600">{fileError}</p>
            )}
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <img
                  src={previewUrl}
                  alt="Quote preview"
                  className="max-w-full h-auto max-h-96 mx-auto rounded-md"
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
              disabled={isUploading || !!dateError || !!fileError || !selectedFile}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload Quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteUploadModal;
