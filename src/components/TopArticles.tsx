import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight} from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Article } from "../types";
import ArticleCard from "./ArticleCard";

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
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-red-400 ">Featured Articles</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
          Discover our most impactful stories and insights from the mission field
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          
          <ArticleCard article={article} key={index} index={index}/>
      
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
          className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 via-blue-800 to-blue-500 dark:from-red-600 dark:via-red-500 dark:to-red-800 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          View All Articles
          <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.div>
    </section>
  );
};

export default TopArticles;