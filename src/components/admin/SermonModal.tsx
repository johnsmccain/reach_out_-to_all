import { useState } from "react";
import { X, Save, Video, User, Calendar, Clock, Music } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import type { Sermon } from "../../types";
import toast from "react-hot-toast";

interface SermonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sermon: {
    title: string;
    speaker: string;
    date: string;
    duration: string;
    description: string;
    video_url: string;
    audio_url: string;
  }) => void;
  editingSermon?: Sermon | null;
}

const SermonModal = ({ isOpen, onClose, onSubmit, editingSermon }: SermonModalProps) => {
  const [formData, setFormData] = useState({
    title: editingSermon?.title || "",
    speaker: editingSermon?.speaker || "",
    date: editingSermon?.date ? new Date(editingSermon.date).toISOString().split('T')[0] : "",
    duration: editingSermon?.duration || "",
    description: editingSermon?.description || "",
    videoUrl: editingSermon?.videoUrl || editingSermon?.video_url || "",
    audioUrl: editingSermon?.audioUrl || editingSermon?.audio_url || "",
    imageUrl: editingSermon?.imageUrl || "",
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error('Please select a valid audio file (MP3, WAV, etc.)');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Audio file size must be less than 50MB');
      return;
    }
    
    // Upload to Cloudinary
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'emmyflex');
      formData.append('resource_type', 'auto');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dp2vt4lox/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, audioUrl: data.secure_url }));
        toast.success('Audio uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Audio upload error:', error);
      toast.error('Failed to upload audio. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      speaker: formData.speaker,
      date: new Date(formData.date).toISOString(),
      duration: formData.duration,
      description: formData.description,
      video_url: formData.videoUrl,
      audio_url: formData.audioUrl
    });
    onClose();
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
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Video className="h-6 w-6" />
                  {editingSermon ? 'Edit Sermon' : 'Create New Sermon'}
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
              {/* Title & Speaker Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Video className="h-4 w-4 text-blue-600" />
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter sermon title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Speaker *
                  </label>
                  <input
                    type="text"
                    name="speaker"
                    value={formData.speaker}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter speaker name"
                  />
                </div>
              </div>

              {/* Date & Duration Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., 45 min"
                  />
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
                  placeholder="Enter sermon description"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Video className="h-4 w-4 text-blue-600" />
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Audio Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Music className="h-4 w-4 text-blue-600" />
                  Audio File (MP3, WAV, etc.) - Optional
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    disabled={uploading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Uploading audio...</span>
                    </div>
                  )}
                  {formData.audioUrl && !uploading && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <Music className="h-4 w-4" />
                        <span className="text-sm font-medium">Audio uploaded successfully</span>
                      </div>
                      <audio controls className="w-full mt-2">
                        <source src={formData.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Maximum file size: 50MB. Supported formats: MP3, WAV, OGG, M4A
                  </p>
                </div>
              </div>

              {/* Or Audio URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Music className="h-4 w-4 text-blue-600" />
                  Or Audio URL (Optional)
                </label>
                <input
                  type="url"
                  name="audioUrl"
                  value={formData.audioUrl}
                  onChange={handleChange}
                  disabled={uploading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://example.com/sermon.mp3"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingSermon ? 'Update' : 'Create'} Sermon</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SermonModal;
