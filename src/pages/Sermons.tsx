import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Video, Download, Play, Pause, Calendar, Clock, User, Search } from 'lucide-react';
import { useSermons } from '@/hooks/useSermons';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const Sermons = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Use custom hook for sermons data
  const { sermons, loading, error } = useSermons({
    searchTerm: debouncedSearchTerm,
  });

  const handleDownload = async (audioUrl: string, title: string) => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download audio');
    }
  };

  const handlePlayPause = (audioId: string) => {
    const audioElement = document.getElementById(`audio-${audioId}`) as HTMLAudioElement;
    if (audioElement) {
      if (playingAudio === audioId) {
        audioElement.pause();
        setPlayingAudio(null);
      } else {
        // Pause any currently playing audio
        if (playingAudio) {
          const currentAudio = document.getElementById(`audio-${playingAudio}`) as HTMLAudioElement;
          if (currentAudio) currentAudio.pause();
        }
        audioElement.play();
        setPlayingAudio(audioId);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Sermons</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sermons & Messages
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Listen to inspiring messages and download them for offline listening
            </p>
            <div className="flex items-center justify-center gap-4 text-blue-100">
              <Music className="h-6 w-6" />
              <span>Audio Available</span>
              <Download className="h-6 w-6" />
              <span>Download for Offline</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sermons by title, speaker, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
              />
            </div>
          </div>

          {/* Sermons Grid */}
          {sermons.length === 0 ? (
            <div className="text-center py-16">
              <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                {searchTerm ? 'No sermons found' : 'No sermons available'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new messages'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sermons.map((sermon, index) => (
                <motion.div
                  key={sermon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Sermon Header */}
                  <div className="p-6 pb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {sermon.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {sermon.speaker}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(sermon.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {sermon.duration}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-6 line-clamp-3">
                      {sermon.description}
                    </p>
                  </div>

                  {/* Audio Player Section */}
                  {(sermon.audio_url || sermon.audioUrl) && (
                    <div className="px-6 pb-4">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Music className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-700">Audio Message</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePlayPause(sermon.id)}
                              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                              title={playingAudio === sermon.id ? 'Pause' : 'Play'}
                            >
                              {playingAudio === sermon.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDownload(sermon.audio_url || sermon.audioUrl!, sermon.title)}
                              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                              title="Download Audio"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <audio
                          id={`audio-${sermon.id}`}
                          controls
                          className="w-full"
                          onPlay={() => setPlayingAudio(sermon.id)}
                          onPause={() => setPlayingAudio(null)}
                          onEnded={() => setPlayingAudio(null)}
                        >
                          <source src={sermon.audio_url || sermon.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  )}

                  {/* Video Link */}
                  {(sermon.video_url || sermon.videoUrl) && (
                    <div className="px-6 pb-6">
                      <a
                        href={sermon.video_url || sermon.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Video className="h-5 w-5" />
                        <span className="font-medium">Watch Video</span>
                      </a>
                    </div>
                  )}

                  {/* No Media Available */}
                  {!(sermon.audio_url || sermon.audioUrl) && !(sermon.video_url || sermon.videoUrl) && (
                    <div className="px-6 pb-6">
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-sm">
                        <Music className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Media coming soon</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Never Miss a Message
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get notified when new sermons are available
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-sm hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Subscribe for Updates
          </motion.button>
        </div>
      </section> */}
    </div>
  );
};

export default Sermons;