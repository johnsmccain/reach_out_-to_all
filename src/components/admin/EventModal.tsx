import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Event } from "@/types";
import { X, Save, Calendar, MapPin, Video, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey =  import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventDetails: any) => Promise<void>;
  editingEvent: Event | null;
}
 
const EventModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingEvent,
}: EventModalProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: editingEvent?.title || "",
    description: editingEvent?.description || "",
    date: editingEvent?.date
      ? new Date(editingEvent.date).toISOString().slice(0, 16)
      : "",
    location: editingEvent?.location || "",
    video_url: editingEvent?.video_url || "",
    type: editingEvent?.type || "future",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: editingEvent?.title || "",
        description: editingEvent?.description || "",
        date: editingEvent?.date
          ? new Date(editingEvent.date).toISOString().slice(0, 16)
          : "",
        location: editingEvent?.location || "",
        video_url: editingEvent?.video_url || "",
        type: editingEvent?.type || "future",
      });
      setImageUrl(editingEvent?.image_url || null);
    }
  }, [isOpen, editingEvent]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "emmyflex");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dp2vt4lox/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Image upload failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!imageUrl) {
      toast.error("Please upload an image", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    const eventDetails = {
      ...formData,
      image_url: imageUrl,
      date: new Date(formData.date).toISOString(),
    };

    try {
      const { data: existingEvent, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .eq("title", eventDetails.title)
        .eq("date", eventDetails.date)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking existing event:", fetchError.message);
        toast.error(`Error: ${fetchError.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
        setIsSubmitting(false);
        return;
      }

      if (existingEvent) {
        toast.error("An event with this title and date already exists!", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from("events")
        .upsert([eventDetails], { onConflict: "id" });

      if (error) {
        console.error(" Error saving to Supabase:", error.message);
        toast.error(`Error: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.success("Event saved successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        onSubmit(eventDetails);
        onClose();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
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
                  <Calendar className="h-6 w-6" />
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
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
              {/* Title & Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Location & Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter event location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="past">Past</option>
                    <option value="current">Current</option>
                    <option value="future">Future</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter event description"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  Event Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                    <img src={imageUrl} alt="Event preview" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Video className="h-4 w-4 text-blue-600" />
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{editingEvent ? 'Update' : 'Create'} Event</span>
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

export default EventModal;
