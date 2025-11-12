import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import type { Event, Statistics, Sermon, Document, Article, DailyQuote } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import EventsTable from "@/components/admin/EventsTable";
import EventModal from "@/components/admin/EventModal";
import QuoteUploadModal from "@/components/admin/QuoteUploadModal";
import DocumentUploadModal from "@/components/admin/DocumentUploadModal";
import SermonModal from "@/components/admin/SermonModal";
import StatisticsModal from "@/components/admin/StatisticsModal";
import { Plus } from "lucide-react";

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [quotes, setQuotes] = useState<DailyQuote[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSermonModal, setShowSermonModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showQuoteUploadModal, setShowQuoteUploadModal] = useState(false);
  const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingQuote, setEditingQuote] = useState<DailyQuote | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchEvents(),
      fetchSermons(),
      fetchDocuments(),
      fetchArticles(),
      fetchQuotes(),
      fetchStatistics(),
    ]);
    setLoading(false);
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast.error("Error loading events");
      console.error("Error loading events:", error);
    } else if (data) {
      setEvents(
        data.map((event) => ({
          ...event,
          imageUrl: event.image_url,
          videoUrl: event.video_url,
        }))
      );
    }
  };

  const fetchSermons = async () => {
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast.error("Error loading sermons");
      console.error("Error loading sermons:", error);
    } else if (data) {
      setSermons(
        data.map((sermon) => ({
          ...sermon,
          videoUrl: sermon.video_url,
        }))
      );
    }
  };

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error loading documents");
      console.error("Error loading documents:", error);
    } else if (data) {
      setDocuments(
        data.map((doc) => ({
          ...doc,
          fileUrl: doc.file_url,
          fileType: doc.file_type,
          fileSize: doc.file_size,
        }))
      );
    }
  };

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error loading articles");
      console.error("Error loading articles:", error);
    } else if (data) {
      setArticles(data);
    }
  };

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from("daily_quotes")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast.error("Error loading quotes");
      console.error("Error loading quotes:", error);
    } else if (data) {
      setQuotes(data);
    }
  };

  const fetchStatistics = async () => {
    const { data, error } = await supabase
      .from("statistics")
      .select("*")
      .single();

    if (error) {
      toast.error("Error loading statistics");
      console.error("Error loading statistics:", error);
    } else if (data) {
      setStatistics(data);
    }
  };

  const handleDelete = async (
    id: string,
    type: "event" | "sermon" | "document" | "article" | "quote",
    itemName?: string
  ) => {
    const confirmMessage = itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : `Are you sure you want to delete this ${type}? This action cannot be undone.`;

    if (!window.confirm(confirmMessage))
      return;

    const tableName = type === "event" ? "events"
      : type === "sermon" ? "sermons"
        : type === "document" ? "documents"
          : type === "article" ? "articles"
            : "daily_quotes";

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
      );

      if (type === "event") fetchEvents();
      else if (type === "sermon") fetchSermons();
      else if (type === "document") fetchDocuments();
      else if (type === "article") fetchArticles();
      else fetchQuotes();
    } catch (error: any) {
      toast.error(`Error deleting ${type}: ${error.message || 'Unknown error'}`);
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleEventSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const eventData: Event = {
      id: crypto.randomUUID(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: new Date(formData.get("date") as string).toISOString(),
      location: formData.get("location") as string,
      image_url: formData.get("imageUrl")
        ? (formData.get("imageUrl") as string)
        : undefined,
      video_url: formData.get("videoUrl")
        ? (formData.get("videoUrl") as string)
        : undefined,
      type: formData.get("type") as "past" | "current" | "future",
    };

    try {
      let error;

      if (editingEvent) {
        const { error: updateError } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", editingEvent.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("events")
          .insert([eventData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(
        editingEvent
          ? "Event updated successfully"
          : "Event created successfully"
      );
      setShowEventModal(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast.error(error.message || "Error saving event");
    }
  };

  const handleSermonSubmit = async (sermonData: Omit<Sermon, "id" | "created_at">) => {
    try {
      let error;

      if (editingSermon) {
        const { error: updateError } = await supabase
          .from("sermons")
          .update(sermonData)
          .eq("id", editingSermon.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("sermons")
          .insert([sermonData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(
        editingSermon
          ? "Sermon updated successfully"
          : "Sermon created successfully"
      );
      setShowSermonModal(false);
      setEditingSermon(null);
      fetchSermons();
    } catch (error: any) {
      console.error("Error saving sermon:", error);
      toast.error(error.message || "Error saving sermon");
    }
  };

  const handleStatisticsSubmit = async (statsData: Omit<Statistics, "id" | "updated_at">) => {
    try {
      if (statistics) {
        const { error } = await supabase
          .from("statistics")
          .update(statsData)
          .eq("id", statistics.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("statistics")
          .insert([statsData]);

        if (error) throw error;
      }

      toast.success("Statistics updated successfully");
      setShowStatsModal(false);
      fetchStatistics();
    } catch (error: any) {
      console.error("Error saving statistics:", error);
      toast.error(error.message || "Error saving statistics");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader
        onLogout={handleLogout}
      />

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="sermons">Sermons</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="quotes">Daily Quotes</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowArticleModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Article
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{article.title}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{article.author}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${article.published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                        {article.is_top && (
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingArticle(article);
                            setShowArticleModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.id, "article")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="quotes">
            <div className="flex justify-end mb-4 gap-2">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Text Quote
              </button>
              <button
                onClick={() => setShowQuoteUploadModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Upload Quote Image
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quote/Author
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotes.map((quote) => (
                    <tr key={quote.id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${quote.image_type === 'image'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                          }`}>
                          {quote.image_type === 'image' ? 'Image' : 'Text'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {quote.image_type === 'image' && quote.image_url ? (
                          <img
                            src={quote.image_url}
                            alt="Quote"
                            className="h-16 w-16 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {quote.image_type === 'text' ? (
                          <div>
                            <div className="max-w-xs truncate text-sm">{quote.quote}</div>
                            <div className="text-xs text-gray-500">{quote.author}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">Image Quote</div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {new Date(quote.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {quote.image_type === 'text' && (
                          <button
                            onClick={() => {
                              setEditingQuote(quote);
                              setShowQuoteModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const itemName = quote.image_type === 'text'
                              ? `"${quote.quote?.substring(0, 50)}${(quote.quote?.length || 0) > 50 ? '...' : ''}"`
                              : `quote for ${new Date(quote.date).toLocaleDateString()}`;
                            handleDelete(quote.id, "quote", itemName);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowDocumentUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Document
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thumbnail
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-4 sm:px-6 py-4">
                        {doc.imageUrl ? (
                          <img
                            src={doc.imageUrl}
                            alt={doc.title}
                            className="h-16 w-16 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-gray-900 truncate">
                            {doc.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {doc.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${doc.fileType.toLowerCase().includes('pdf')
                            ? 'bg-red-100 text-red-800'
                            : doc.fileType.toLowerCase().includes('doc')
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                          {doc.fileType}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.fileSize}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => window.open(doc.fileUrl, '_blank')}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, "document")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Sermons Tab */}
          <TabsContent value="sermons">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  setEditingSermon(null);
                  setShowSermonModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Sermon
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Speaker
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sermons.map((sermon) => (
                    <tr key={sermon.id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {sermon.title}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {sermon.speaker}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {new Date(sermon.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingSermon(sermon);
                            setShowSermonModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sermon.id, "sermon")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowStatsModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Statistics
              </button>
            </div>
            {statistics && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Current Ministry Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">States Covered</p>
                    <p className="text-3xl font-bold text-blue-600">{statistics.states_covered}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Outreaches Conducted</p>
                    <p className="text-3xl font-bold text-green-600">{statistics.outreaches_conducted}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Locals Reached</p>
                    <p className="text-3xl font-bold text-purple-600">{statistics.locals_reached.toLocaleString()}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Communities Reached</p>
                    <p className="text-3xl font-bold text-yellow-600">{statistics.communities_reached}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Souls Won</p>
                    <p className="text-3xl font-bold text-red-600">{statistics.souls_won.toLocaleString()}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Rededication Commitments</p>
                    <p className="text-3xl font-bold text-indigo-600">{statistics.rededication_commitments.toLocaleString()}</p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Medical Beneficiaries</p>
                    <p className="text-3xl font-bold text-pink-600">{statistics.medical_beneficiaries.toLocaleString()}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Welfare Beneficiaries</p>
                    <p className="text-3xl font-bold text-teal-600">{statistics.welfare_beneficiaries.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Last updated: {new Date(statistics.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Other existing tabs... */}
          <TabsContent value="events">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowEventModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Event</span>
              </button>
            </div>

            <EventsTable
              events={events}
              onEdit={(event) => {
                setEditingEvent(event);
                setShowEventModal(true);
              }}
              onDelete={(id) => handleDelete(id, "event")}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Article Modal */}
      {showArticleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingArticle ? "Edit Article" : "Add New Article"}
            </h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const tags = (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean);

              const articleData = {
                title: formData.get("title") as string,
                content: formData.get("content") as string,
                author: formData.get("author") as string,
                cover_image: formData.get("cover_image") as string || null,
                tags,
                is_top: formData.get("is_top") === "on",
                published: formData.get("published") === "on",
                updated_at: new Date().toISOString()
              };

              try {
                let error;
                if (editingArticle) {
                  const { error: updateError } = await supabase
                    .from("articles")
                    .update(articleData)
                    .eq("id", editingArticle.id);
                  error = updateError;
                } else {
                  const { error: insertError } = await supabase
                    .from("articles")
                    .insert([articleData]);
                  error = insertError;
                }

                if (error) throw error;
                toast.success(editingArticle ? "Article updated" : "Article created");
                setShowArticleModal(false);
                setEditingArticle(null);
                fetchArticles();
              } catch (error: any) {
                toast.error(error.message);
              }
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingArticle?.title}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Author</label>
                  <input
                    type="text"
                    name="author"
                    defaultValue={editingArticle?.author}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
                <input
                  type="url"
                  name="cover_image"
                  defaultValue={editingArticle?.cover_image}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  defaultValue={editingArticle?.tags.join(", ")}
                  placeholder="mission, evangelism, outreach"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  name="content"
                  defaultValue={editingArticle?.content}
                  required
                  rows={10}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_top"
                    defaultChecked={editingArticle?.is_top}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Article</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={editingArticle?.published ?? true}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Published</span>
                </label>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowArticleModal(false);
                    setEditingArticle(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingArticle ? "Update" : "Create"} Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingQuote ? "Edit Daily Quote" : "Add Daily Quote"}
            </h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);

              const quoteData = {
                quote: formData.get("quote") as string,
                author: formData.get("author") as string,
                date: formData.get("date") as string,
                image_type: 'text'
              };

              try {
                let error;
                if (editingQuote) {
                  const { error: updateError } = await supabase
                    .from("daily_quotes")
                    .update(quoteData)
                    .eq("id", editingQuote.id);
                  error = updateError;
                } else {
                  const { error: insertError } = await supabase
                    .from("daily_quotes")
                    .insert([quoteData]);
                  error = insertError;
                }

                if (error) throw error;
                toast.success(editingQuote ? "Quote updated successfully" : "Quote added successfully");
                setShowQuoteModal(false);
                setEditingQuote(null);
                fetchQuotes();
              } catch (error: any) {
                toast.error(`Error saving quote: ${error.message || 'Unknown error'}`);
                console.error("Error saving quote:", error);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quote</label>
                <textarea
                  name="quote"
                  defaultValue={editingQuote?.quote || ''}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  defaultValue={editingQuote?.author || ''}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={editingQuote?.date || new Date().toISOString().split('T')[0]}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuoteModal(false);
                    setEditingQuote(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingQuote ? "Update" : "Add"} Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        onSubmit={(e) => handleEventSubmit(e)}
        editingEvent={editingEvent}
      />

      {/* Quote Upload Modal */}
      <QuoteUploadModal
        isOpen={showQuoteUploadModal}
        onClose={() => setShowQuoteUploadModal(false)}
        onSuccess={() => {
          fetchQuotes();
        }}
      />

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={showDocumentUploadModal}
        onClose={() => setShowDocumentUploadModal(false)}
        onSuccess={() => {
          fetchDocuments();
        }}
      />

      {/* Sermon Modal */}
      <SermonModal
        isOpen={showSermonModal}
        onClose={() => {
          setShowSermonModal(false);
          setEditingSermon(null);
        }}
        onSubmit={handleSermonSubmit}
        editingSermon={editingSermon}
      />

      {/* Statistics Modal */}
      <StatisticsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        onSubmit={handleStatisticsSubmit}
        currentStats={statistics}
      />
    </div>
  );
};

export default AdminDashboard;