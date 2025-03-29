import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import type { Event } from "@/types";

// Supabase Configuration
const supabaseUrl = "https://viktpmvqtsmqfekqtdhs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpa3RwbXZxdHNtcWZla3F0ZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNDY5MTQsImV4cCI6MjA1MzcyMjkxNH0.kd-WYLwn6Of4d-4OPMr7eoybZykR3OKi0D8LHfTEbUU"; // Replace with a secure environment variable
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
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple form submissions

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

  // Reset form data when the modal opens
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

  // Upload image to Cloudinary
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

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submission
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
      // Check if an event with the same title and date already exists
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

      // Insert or update event using upsert
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold mb-6">
          {editingEvent ? "Edit Event" : "Add New Event"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="block w-full p-2 border rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="block w-full p-2 border rounded"
          />
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="block w-full p-2 border rounded"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="block w-full p-2 border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full p-2 border rounded"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded"
              className="mt-4 rounded-md w-40"
            />
          )}
          <input
            type="url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="Video URL"
            className="block w-full p-2 border rounded"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="block w-full p-2 border rounded"
          >
            <option value="past">Past</option>
            <option value="current">Current</option>
            <option value="future">Future</option>
          </select>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {isSubmitting ? "Saving..." : editingEvent ? "Update" : "Create"}{" "}
              Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
