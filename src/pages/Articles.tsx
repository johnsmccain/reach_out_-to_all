import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { useDebounce } from "@/hooks/useDebounce";
import ArticleCard from "@/components/ArticleCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const Articles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const masonryRef = useRef<HTMLDivElement>(null);

  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Use custom hook for articles data
  const { articles, allTags, loading, error } = useArticles({
    searchTerm: debouncedSearchTerm,
    selectedTag,
  });

  const initializeMasonry = () => {
    if (!masonryRef.current) return;

    const container = masonryRef.current;
    const items = container.children;
    
    if (items.length === 0) return;

    // Get container width and calculate columns
    const containerWidth = container.offsetWidth;
    const itemWidth = 320; // Base width for each column
    const gap = 32; // Gap between items
    const columns = Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)));
    
    // Set container styles
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    container.style.gap = `${gap}px`;
    container.style.alignItems = 'start';

    // Reset all items
    Array.from(items).forEach((item) => {
      const element = item as HTMLElement;
      element.style.gridRowEnd = 'auto';
      element.style.marginBottom = '0';
    });

    // Calculate and set grid row spans for masonry effect
    setTimeout(() => {
      Array.from(items).forEach((item) => {
        const element = item as HTMLElement;
        const itemHeight = element.offsetHeight;
        const rowHeight = parseInt(window.getComputedStyle(container).gridAutoRows) || 10;
        const rowSpan = Math.ceil((itemHeight + gap) / (rowHeight + gap));
        element.style.gridRowEnd = `span ${rowSpan}`;
      });
    }, 50);
  };
  useEffect(() => {
    // Initialize masonry layout after articles load or filter changes
    if (!loading && articles.length > 0) {
      const timeoutId = setTimeout(() => {
        initializeMasonry();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [loading, articles.length]);

  useEffect(() => {
    // Reinitialize masonry on window resize with throttling
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!loading && articles.length > 0) {
          initializeMasonry();
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [loading, articles.length]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
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
    <div className="container mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900">Articles</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover inspiring stories, insights, and teachings from our mission work
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-sm shadow-lg p-6 space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Articles Masonry Grid */}
      <motion.div
        ref={masonryRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="masonry-container"
        style={{
          display: 'grid',
          gridAutoRows: '10px',
          gap: '32px',
          alignItems: 'start'
        }}
      >
        {articles.map((article, index) => (
          <motion.div 
            key={article.id} 
            className="masonry-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.05,
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            <ArticleCard article={article} index={index} />
          </motion.div>
        ))}
      </motion.div>

      {articles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-xl text-gray-500">No articles found matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
};

export default Articles;