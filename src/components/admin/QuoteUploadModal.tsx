import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { X, Save, Image as ImageIcon, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            <div className="sticky top-0 bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 text-white p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <ImageIcon className="h-6 w-6" />
                  Upload Quote Image
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
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Schedule Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {dateError && (
                  <p className="mt-2 text-sm text-red-600">{dateError}</p>
                )}
              </div>

              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  Quote Image (PNG/JPG/JPEG) *
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Maximum file size: {MAX_IMAGE_SIZE / (1024 * 1024)}MB
                </p>
                {fileError && (
                  <p className="mt-2 text-sm text-red-600">{fileError}</p>
                )}
              </div>

              {/* Image Preview */}
              {previewUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={previewUrl}
                      alt="Quote preview"
                      className="w-full h-auto max-h-96 object-contain"
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
                  disabled={isUploading || !!dateError || !!fileError || !selectedFile}
                  className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Upload Quote</span>
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

export default QuoteUploadModal;
