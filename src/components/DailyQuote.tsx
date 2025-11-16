import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { DailyQuote as DailyQuoteType } from "../types";

const DailyQuote = () => {
  const [quote, setQuote] = useState<DailyQuoteType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysQuote();
  }, []);

  const fetchTodaysQuote = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from("daily_quotes")
      .select("id, quote, author, image_url, image_type, date, created_at")
      .eq("date", today)
      .single();

    if (error) {
      // If no quote for today, get the latest quote
      const { data: latestData } = await supabase
        .from("daily_quotes")
        .select("id, quote, author, image_url, image_type, date, created_at")
        .order("date", { ascending: false })
        .limit(1)
        .single();
      
      if (latestData) {
        setQuote(latestData);
      }
    } else if (data) {
      setQuote(data);
    }
    
    setLoading(false);
  };

  if (loading || !quote) {
    return null;
  }

  // Render image quote
  if (quote.image_type === 'image' && quote.image_url) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-fit relative  rounded-2xl overflow-hidden shadow-lg border border-white/20"
      >
     

        <div className="relative z-10 p-4">
          <div className="flex items-center gap-3 mb-4 text-white">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Quote className="h-6 w-6 text-yellow-300" />
            </motion.div>
            <h3 className="text-lg font-bold text-black">Daily Inspiration</h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full"
          >
            <img
              src={quote.image_url}
              alt="Daily inspirational quote"
              className="w-full h-auto object-contain max-h-[500px] rounded-2xl shadow-lg border border-white/20"
            />
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
      </motion.div>
    );
  }

  // Render text quote (default)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Quote className="h-8 w-8 text-yellow-300" />
          </motion.div>
          <h3 className="text-xl font-bold">Daily Inspiration</h3>
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl font-medium leading-relaxed italic"
        >
          "{quote.quote}"
        </motion.blockquote>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-right"
        >
          <cite className="text-yellow-200 font-semibold">— {quote.author}</cite>
        </motion.footer>

        {/* Enhanced Decorative Elements */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping shadow-[0_0_8px_rgba(253,224,71,0.8)]"></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-cyan-300 rounded-full animate-pulse shadow-[0_0_4px_rgba(103,232,249,0.8)]"></div>
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
      </div>
    </motion.div>
  );
};

export default DailyQuote;