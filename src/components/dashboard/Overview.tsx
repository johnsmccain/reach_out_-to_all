import { useAdminStore } from "@/store/adminStore";
import { Calendar, FileText, BookOpen, Quote, Video, TrendingUp, Users, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";

const Overview = () => {
  const { events, articles, quotes, documents, sermons, statistics } = useAdminStore();

  const stats = [
    { 
      label: "Events", 
      value: events.length, 
      icon: Calendar, 
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-600"
    },
    { 
      label: "Articles", 
      value: articles.length, 
      icon: FileText, 
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      iconColor: "text-green-600"
    },
    { 
      label: "Sermons", 
      value: sermons.length, 
      icon: Video, 
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconColor: "text-purple-600"
    },
    { 
      label: "Documents", 
      value: documents.length, 
      icon: BookOpen, 
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      iconColor: "text-orange-600"
    },
    { 
      label: "Quotes", 
      value: quotes.length, 
      icon: Quote, 
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
      iconColor: "text-pink-600"
    },
  ];

  const ministryStats = [
    { label: "States Covered", value: statistics?.states_covered || 0, icon: MapPin, color: "text-blue-600" },
    { label: "Outreaches", value: statistics?.outreaches_conducted || 0, icon: TrendingUp, color: "text-green-600" },
    { label: "Souls Won", value: statistics?.souls_won || 0, icon: Heart, color: "text-red-600" },
    { label: "Communities", value: statistics?.communities_reached || 0, icon: Users, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-linear-to-r from-blue-700 via-blue-600 to-blue-500   dark:from-red-700 dark:via-red-600 dark:to-red-500    rounded p-8 text-white shadow-2xl z-0"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
          <p className="text-blue-100">Manage your ministry content and track your impact</p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Content Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Content Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-800 rounded p-6 shadow-lg dark:shadow-gray-900/50 hover:shadow-2xl dark:hover:shadow-gray-900/70 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-linear-to-br ${stat.bgGradient} dark:from-gray-700 dark:to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-linear-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ministry Impact Stats */}
      {statistics && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ministry Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ministryStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded p-6 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}


      {/* Recent Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded p-6 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Events</h2>
            <Calendar className="w-5 h-5 text-blue-600 dark:text-red-400" />
          </div>
          <div className="space-y-3">
            {events.slice(0, 5).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {new Date(event.date).getDate()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{event.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                </div>
              </motion.div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No events yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Sermons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded p-6 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Sermons</h2>
            <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="space-y-3">
            {sermons.slice(0, 5).map((sermon, index) => (
              <motion.div
                key={sermon.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{sermon.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{sermon.speaker}</p>
                </div>
              </motion.div>
            ))}
            {sermons.length === 0 && (
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No sermons yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Articles */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded p-6 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Articles</h2>
            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            {articles.slice(0, 5).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{article.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{article.author}</p>
                </div>
              </motion.div>
            ))}
            {articles.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No articles yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded p-6 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Documents</h2>
            <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="space-y-3">
            {documents.slice(0, 5).map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{doc.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{doc.file_type}</p>
                </div>
              </motion.div>
            ))}
            {documents.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No documents yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
