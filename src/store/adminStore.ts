import { create } from 'zustand';
import type { Event, Sermon, Document, Article, DailyQuote, Statistics } from '@/types';

interface AdminState {
  events: Event[];
  sermons: Sermon[];
  documents: Document[];
  articles: Article[];
  quotes: DailyQuote[];
  statistics: Statistics | null;
  loading: boolean;
  showEventModal: boolean;
  showSermonModal: boolean;
  showStatsModal: boolean;
  showArticleModal: boolean;
  showQuoteModal: boolean;
  showQuoteUploadModal: boolean;
  showDocumentUploadModal: boolean;
  editingEvent: Event | null;
  editingSermon: Sermon | null;
  editingArticle: Article | null;
  editingQuote: DailyQuote | null;
  setEvents: (events: Event[]) => void;
  setSermons: (sermons: Sermon[]) => void;
  setDocuments: (documents: Document[]) => void;
  setArticles: (articles: Article[]) => void;
  setQuotes: (quotes: DailyQuote[]) => void;
  setStatistics: (statistics: Statistics | null) => void;
  setLoading: (loading: boolean) => void;
  setShowEventModal: (show: boolean) => void;
  setShowSermonModal: (show: boolean) => void;
  setShowStatsModal: (show: boolean) => void;
  setShowArticleModal: (show: boolean) => void;
  setShowQuoteModal: (show: boolean) => void;
  setShowQuoteUploadModal: (show: boolean) => void;
  setShowDocumentUploadModal: (show: boolean) => void;
  setEditingEvent: (event: Event | null) => void;
  setEditingSermon: (sermon: Sermon | null) => void;
  setEditingArticle: (article: Article | null) => void;
  setEditingQuote: (quote: DailyQuote | null) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  events: [],
  sermons: [],
  documents: [],
  articles: [],
  quotes: [],
  statistics: null,
  loading: false,
  showEventModal: false,
  showSermonModal: false,
  showStatsModal: false,
  showArticleModal: false,
  showQuoteModal: false,
  showQuoteUploadModal: false,
  showDocumentUploadModal: false,
  editingEvent: null,
  editingSermon: null,
  editingArticle: null,
  editingQuote: null,
  setEvents: (events) => set({ events }),
  setSermons: (sermons) => set({ sermons }),
  setDocuments: (documents) => set({ documents }),
  setArticles: (articles) => set({ articles }),
  setQuotes: (quotes) => set({ quotes }),
  setStatistics: (statistics) => set({ statistics }),
  setLoading: (loading) => set({ loading }),
  setShowEventModal: (show) => set({ showEventModal: show }),
  setShowSermonModal: (show) => set({ showSermonModal: show }),
  setShowStatsModal: (show) => set({ showStatsModal: show }),
  setShowArticleModal: (show) => set({ showArticleModal: show }),
  setShowQuoteModal: (show) => set({ showQuoteModal: show }),
  setShowQuoteUploadModal: (show) => set({ showQuoteUploadModal: show }),
  setShowDocumentUploadModal: (show) => set({ showDocumentUploadModal: show }),
  setEditingEvent: (event) => set({ editingEvent: event }),
  setEditingSermon: (sermon) => set({ editingSermon: sermon }),
  setEditingArticle: (article) => set({ editingArticle: article }),
  setEditingQuote: (quote) => set({ editingQuote: quote }),
}));
