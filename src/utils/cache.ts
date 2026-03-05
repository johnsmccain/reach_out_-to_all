interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class Cache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const item of this.cache.values()) {
      if (now > item.expiresAt) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired
    };
  }
}

// Create singleton instance
export const cache = new Cache();

// Auto cleanup every 10 minutes
setInterval(() => {
  cache.cleanup();
}, 10 * 60 * 1000);

// Cache keys constants
export const CACHE_KEYS = {
  ARTICLES: 'articles',
  SERMONS: 'sermons',
  EVENTS: 'events',
  STATISTICS: 'statistics',
  DOCUMENTS: 'documents',
  QUOTES: 'quotes'
} as const;