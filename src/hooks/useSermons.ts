import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Sermon } from '@/types';

interface UseSermonsOptions {
  searchTerm?: string;
  limit?: number;
}

export const useSermons = (options: UseSermonsOptions = {}) => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { searchTerm = '', limit } = options;

  const fetchSermons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('sermons')
        .select('*')
        .order('date', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Map database fields to UI fields
      const mappedSermons = (data || []).map((sermon) => ({
        ...sermon,
        videoUrl: sermon.video_url,
        audioUrl: sermon.audio_url,
        imageUrl: sermon.image_url,
        createdAt: sermon.created_at,
      }));

      setSermons(mappedSermons);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sermons');
      console.error('Error fetching sermons:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  // Memoized filtered sermons
  const filteredSermons = useMemo(() => {
    if (!searchTerm) return sermons;

    return sermons.filter((sermon) =>
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sermons, searchTerm]);

  return {
    sermons: filteredSermons,
    allSermons: sermons,
    loading,
    error,
    refetch: fetchSermons
  };
};