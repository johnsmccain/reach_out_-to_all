import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Article } from "../types";

const TopArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopArticles();
  }, []);

  const fetchTopArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("published", true)
      .eq("is_top", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching top articles:", error);
    } else if (data) {
      setArticles(data);
    }
    setLoading(false);
  };

  if (loading || articles.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Featured Articles</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our most impactful stories and insights from the mission field
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-blue-400/0 group-hover:from-blue-400/10 group-hover:via-purple-400/10 group-hover:to-blue-400/10 transition-all duration-500 rounded-2xl"></div>
            
            {article.cover_image && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Featured
                </div>
              </div>
            )}
            
            <div className="relative p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              
              <p className="text-gray-600 line-clamp-3">
                {article.content.substring(0, 120)}...
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <Link
                to={`/articles/${article.id}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold group-hover:gap-3 transition-all"
              >
                Read Article
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          View All Articles
          <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.div>
    </section>
  );
};

export default TopArticles;