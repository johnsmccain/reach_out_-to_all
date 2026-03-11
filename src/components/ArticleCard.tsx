import { motion } from "framer-motion";
import { htmlToPlainText } from "@/lib/contentMigration";
import { Calendar, Tag, User } from "lucide-react";
import { Link } from "react-router-dom";

interface CardProps {
    article: {
        id: string,
        cover_image?: string | undefined,
        title: string,
        is_top: boolean,
        content: string,
        author: string,
        created_at: string
        tags: string[]
    }
    index: number;
}
const ArticleCard = ({article, index}: CardProps) => {
  const excerptLength = 150;
  
  return (
              <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/50 dark:bg-gray-800/90 backdrop-blur-md rounded-sm shadow-lg dark:shadow-gray-900/50 overflow-hidden hover:shadow-2xl dark:hover:shadow-gray-900/70 transition-all duration-500 group border border-white/20 dark:border-gray-700/30 hover:border-blue-400/30 dark:hover:border-blue-400/50 w-full"
          >
            {article.cover_image && (
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {article.is_top && (
                  <div className="absolute top-4 left-4 bg-linear-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Top Article
                  </div>
                )}
              </div>
            )}
            
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                {article.title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                {htmlToPlainText(article.content).substring(0, excerptLength)}...
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.created_at).toLocaleDateString()}
                </div>
              </div>
              
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-red-400  text-xs rounded-full"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <Link
                to={`/articles/${article.id}`}
                className="inline-block w-full text-center bg-linear-to-r f from-blue-600 via-blue-800 to-blue-500 dark:from-red-600 dark:via-red-800 dark:to-red-500 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] hover:scale-[1.02]"
              >
                Read More
              </Link>
            </div>
          </motion.article>
  )
}

export default ArticleCard