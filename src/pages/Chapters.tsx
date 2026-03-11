import { useState } from "react";
import { MapPin, Users, Mail, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CHAPTERS = [
  {
    id: "abuja",
    name: "Abuja",
    state: "Federal Capital Territory",
    description: "Our Abuja chapter is dedicated to spreading the Gospel and serving the community in the nation's capital.",
    members: 45,
    email: "abuja@reachouttoall.org",
    phone: "+234 803 123 4567",
    address: "Abuja, FCT",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=300&fit=crop",
  },
  {
    id: "lagos",
    name: "Lagos",
    state: "Lagos State",
    description: "The Lagos chapter is one of our most active chapters, serving thousands in Nigeria's largest city.",
    members: 120,
    email: "lagos@reachouttoall.org",
    phone: "+234 803 456 7890",
    address: "Lagos, Lagos State",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=300&fit=crop",
  },
  {
    id: "ondo",
    name: "Ondo",
    state: "Ondo State",
    description: "Ondo chapter focuses on rural outreach and community development programs.",
    members: 35,
    email: "ondo@reachouttoall.org",
    phone: "+234 803 789 0123",
    address: "Ondo, Ondo State",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=300&fit=crop",
  },
  {
    id: "kwara",
    name: "Kwara",
    state: "Kwara State",
    description: "Kwara chapter is committed to youth empowerment and spiritual development.",
    members: 28,
    email: "kwara@reachouttoall.org",
    phone: "+234 803 234 5678",
    address: "Kwara, Kwara State",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=300&fit=crop",
  },
];

const Chapters = () => {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const activeChapter = CHAPTERS.find(ch => ch.id === selectedChapter) || CHAPTERS[0];

  return (
    <div className="space-y-16 my-5">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden rounded">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-red-600 dark:from-red-700 dark:to-blue-700"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Chapters</h1>
            <p className="text-lg sm:text-xl opacity-90">
              Connect with our local chapters across Nigeria and be part of our mission.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chapters List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-sm shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Chapters</h2>
              <div className="space-y-3">
                {CHAPTERS.map((chapter) => (
                  <motion.button
                    key={chapter.id}
                    onClick={() => setSelectedChapter(chapter.id)}
                    whileHover={{ x: 4 }}
                    className={`w-full text-left px-4 py-3 rounded-sm transition-all ${
                      selectedChapter === chapter.id || (!selectedChapter && chapter.id === CHAPTERS[0].id)
                        ? "bg-linear-to-r from-blue-600 to-blue-500 dark:from-red-600 dark:to-red-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <div className="font-semibold">{chapter.name}</div>
                    <div className="text-xs opacity-75">{chapter.state}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Details */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-sm shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Chapter Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={activeChapter.image}
                  alt={activeChapter.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-4xl font-bold text-white mb-2">{activeChapter.name}</h1>
                  <p className="text-white/90 flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>{activeChapter.state}</span>
                  </p>
                </div>
              </div>

              {/* Chapter Content */}
              <div className="p-8">
                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                  {activeChapter.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-sm p-6 border border-blue-200 dark:border-blue-700"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Users className="h-6 w-6 text-blue-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Members</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeChapter.members}</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-sm p-6 border border-blue-200 dark:border-blue-700"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <MapPin className="h-6 w-6 text-blue-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{activeChapter.address}</p>
                  </motion.div>
                </div>

                {/* Contact Information */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h3>
                  <div className="space-y-4">
                    <motion.a
                      href={`mailto:${activeChapter.email}`}
                      whileHover={{ x: 4 }}
                      className="flex items-center space-x-4 p-4 rounded-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group"
                    >
                      <Mail className="h-6 w-6 text-blue-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{activeChapter.email}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                    </motion.a>

                    <motion.a
                      href={`tel:${activeChapter.phone}`}
                      whileHover={{ x: 4 }}
                      className="flex items-center space-x-4 p-4 rounded-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group"
                    >
                      <Phone className="h-6 w-6 text-blue-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{activeChapter.phone}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="mt-8"
                >
                  <Link
                    to="/get-involved"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 dark:from-red-600 dark:to-red-500 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-sm transition-all"
                  >
                    Join This Chapter
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapters;
