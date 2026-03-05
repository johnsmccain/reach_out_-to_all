import { useAdminStore } from '@/store/adminStore';
import { Music, Video, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SermonsProps {
  handleDelete: (id: string, type: "event" | "sermon" | "document" | "article" | "quote") => void;
}

const Sermons = ({ handleDelete }: SermonsProps) => {
  const { sermons, setEditingSermon, setShowSermonModal } = useAdminStore();
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setEditingSermon(null);
            setShowSermonModal(true);
          }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white px-4 py-2 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
        >
          Add Sermon
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4  gap-4">
        {sermons.map((sermon, index) => (
          <motion.div
            key={sermon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{sermon.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Music className="h-4 w-4" />
                    {sermon.speaker}
                  </span>
                  <span>{new Date(sermon.date).toLocaleDateString()}</span>
                  <span>{sermon.duration}</span>
                </div>
                <p className="text-gray-700 mb-4">{sermon.description}</p>
                
                {/* Media Section */}
                <div className="space-y-3">
                  {/* Audio Player */}
                  {(sermon.audio_url || sermon.audioUrl) && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Music className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">Audio Sermon</span>
                      </div>
                      <audio controls className="w-full">
                        <source src={sermon.audio_url || sermon.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  
                  {/* Video Link */}
                  {(sermon.video_url || sermon.videoUrl) && (
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-purple-600" />
                      <a
                        href={sermon.video_url || sermon.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Watch Video Sermon
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <button
                  onClick={() => {
                    setEditingSermon(sermon);
                    setShowSermonModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(sermon.id, "sermon")}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {sermons.length === 0 && (
          <div className="text-center py-12 bg-white rounded shadow-lg">
            <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No sermons yet</p>
            <p className="text-gray-400 text-sm mt-2">Click "Add Sermon" to create your first sermon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sermons;