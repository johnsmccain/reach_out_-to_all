import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/types';
import { htmlToPlainText } from '@/lib/contentMigration';
import { cache, CACHE_KEYS } from '@/utils/cache';
import { useApiPerformance } from '@/hooks/usePerformanceMonitor';

interface UseArticlesOptions {
  searchTerm?: string;
  selectedTag?: string;
  limit?: number;
  published?: boolean;
}

export const useArticles = (options: UseArticlesOptions = {}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { measureApiCall } = useApiPerformance();

  const {
    searchTerm = '',
    selectedTag = '',
    limit,
    published = true
  } = options;

  const cacheKey = `${CACHE_KEYS.ARTICLES}_${published}_${limit || 'all'}`;

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = cache.get<Article[]>(cacheKey);
      if (cachedData) {
        setArticles(cachedData);
        setLoading(false);
        return;
      }

      // Fetch from API with performance monitoring
      const data = await measureApiCall(async () => {
        let query = supabase
          .from('articles')
          .select('*')
          .eq('published', published)
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;
        if (fetchError) throw fetchError;
        return data || [];
      }, 'fetchArticles');

      // Cache the results
      cache.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  }, [published, limit, cacheKey, measureApiCall]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Memoized filtered articles for performance
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const plainContent = htmlToPlainText(article.content);
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plainContent.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === '' || article.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [articles, searchTerm, selectedTag]);

  // Memoized unique tags
  const allTags = useMemo(() => {
    return [...new Set(articles.flatMap(article => article.tags))];
  }, [articles]);

  return {
    articles: filteredArticles,
    allArticles: articles,
    allTags,
    loading,
    error,
    refetch: fetchArticles
  };
};