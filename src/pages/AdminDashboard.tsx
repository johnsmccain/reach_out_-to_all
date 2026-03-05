import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Sermons from "@/components/dashboard/Sermons";
import StatisticsComponent from "@/components/dashboard/Statistics";
import OtherTab from "@/components/dashboard/OtherTab";
import DocumentTab from "@/components/dashboard/Document";
import Quote from "@/components/dashboard/Qoute";
import ArticleComponent from "@/components/dashboard/Article";
import { useAdminStore } from "@/store/adminStore";
import { useNotifications } from "@/hooks/useNotifications";
import StatisticsModal from "@/components/admin/StatisticsModal";
import SermonModal from "@/components/admin/SermonModal";
import DocumentUploadModal from "@/components/admin/DocumentUploadModal";
import QuoteUploadModal from "@/components/admin/QuoteUploadModal";
import EventModal from "@/components/admin/EventModal";
import type { Article, Statistics } from "@/types";
import { ArticleModal } from "@/components/admin/ArticleModal";
import EventComponent from "@/components/dashboard/Event";
import Overview from "@/components/dashboard/Overview";

const AdminDashboardNew = () => {
  const [currentRoute, setCurrentRoute] = useState("/admin");
  const notify = useNotifications();

  console.log(currentRoute)
  const {

    quotes,
    statistics,
    showQuoteUploadModal,
    showDocumentUploadModal,
    showArticleModal,
    showEventModal,
    showSermonModal,
    showStatsModal,
    editingArticle,
    editingEvent,
    editingSermon,
    setEvents,
    setSermons,
    setEditingArticle,
    setEditingSermon,
    setDocuments,
    setArticles,
    setQuotes,
    setStatistics,
    setShowDocumentUploadModal,
    setShowEventModal,
    setEditingEvent,
    setShowArticleModal,
    setShowSermonModal,
    setShowStatsModal,
    setShowQuoteUploadModal,
  } = useAdminStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([
      fetchEvents(),
      fetchSermons(),
      fetchDocuments(),
      fetchArticles(),
      fetchQuotes(),
      fetchStatistics(),
    ]);
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
        })),
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
          audioUrl: sermon.audio_url,
          imageUrl: sermon.image_url,
          createdAt: sermon.created_at,
        })),
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
        })),
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
    itemName?: string,
  ) => {
    const confirmMessage = itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : `Are you sure you want to delete this ${type}? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) return;

    const tableName =
      type === "event"
        ? "events"
        : type === "sermon"
          ? "sermons"
          : type === "document"
            ? "documents"
            : type === "article"
              ? "articles"
              : "daily_quotes";

    try {
      const { error } = await supabase.from(tableName).delete().eq("id", id);

      if (error) throw error;

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
      );

      if (type === "event") fetchEvents();
      else if (type === "sermon") fetchSermons();
      else if (type === "document") fetchDocuments();
      else if (type === "article") fetchArticles();
      else fetchQuotes();
    } catch (error: any) {
      toast.error(
        `Error deleting ${type}: ${error.message || "Unknown error"}`,
      );
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleEventSubmit = async (eventDetails: any) => {
    try {
      const isEditing = !!editingEvent;
      setShowEventModal(false);
      setEditingEvent(null);
      fetchEvents();
      
      // Send notification
      if (isEditing) {
        notify.eventUpdated(eventDetails.title);
      } else {
        notify.eventCreated(eventDetails.title);
      }
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast.error(error.message || "Error saving event");
    }
  };

  const handleSermonSubmit = async (
    sermonData: {
      title: string;
      speaker: string;
      date: string;
      duration: string;
      description: string;
      video_url: string;
      audio_url: string;
    },
  ) => {
    console.log(sermonData)
    try {
      let error;
      const isEditing = !!editingSermon;

      // Clean the data - remove UI-only fields and ensure proper field names
      const cleanData = {
        title: sermonData.title,
        speaker: sermonData.speaker,
        date: sermonData.date,
        duration: sermonData.duration,
        description: sermonData.description,
        video_url: sermonData.video_url,
        audio_url: sermonData.audio_url,
      };

      if (editingSermon) {
        const { error: updateError } = await supabase
          .from("sermons")
          .update(cleanData)
          .eq("id", editingSermon.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("sermons")
          .insert([cleanData]);
        error = insertError;
      }

      console.log("Update error:", error);
      if (error) throw error;

      toast.success(
        editingSermon
          ? "Sermon updated successfully"
          : "Sermon created successfully",
      );
      
      // Send notification
      if (isEditing) {
        notify.sermonUpdated(sermonData.title);
      } else {
        notify.sermonCreated(sermonData.title);
      }
      
      setShowSermonModal(false);
      setEditingSermon(null);
      fetchSermons();
    } catch (error: any) {
      console.error("Error saving sermon:", error);
      toast.error(error.message || "Error saving sermon");
    }
  };

  const handleStatisticsSubmit = async (
    statsData: Omit<Statistics, "id" | "updated_at">,
  ) => {
    try {
      if (statistics) {
        const { error } = await supabase
          .from("statistics")
          .update(statsData)
          .eq("id", statistics.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("statistics").insert([statsData]);

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

  const handleArticleSubmit = async (data: Partial<Article>) => {
    try {
      const tagsArray = Array.isArray(data.tags) 
        ? data.tags 
        : (data.tags || '').toString().split(',').map(t => t.trim()).filter(Boolean);

      const articleData = {
        ...data,
        tags: tagsArray,
        updated_at: new Date().toISOString(),
      };

      let error;
      const isEditing = !!editingArticle;
      
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
      
      // Send notification
      if (isEditing) {
        notify.articleUpdated(data.title || 'Article');
      } else {
        notify.articleCreated(data.title || 'Article');
      }
      
      setShowArticleModal(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (error: any) {
      toast.error(error.message || "Error saving article");
      throw error;
    }
  };



  return (
    <DashboardLayout
      currentRoute={currentRoute}
      onRouteChange={setCurrentRoute}
    >
      {currentRoute === "/admin" && <Overview />}
      {currentRoute === "/articles" && (
        <ArticleComponent handleDelete={handleDelete} />
      )}
      {currentRoute === "/quotes" && (
        <Quote quotes={quotes} handleDelete={handleDelete} />
      )}
      {currentRoute === "/documents" && (
        <DocumentTab
          handleDelete={handleDelete}
        />
      )}
      {currentRoute === "/events" && <EventComponent handleDelete={handleDelete} />
      }
      {currentRoute === "/sermons" && <Sermons handleDelete={handleDelete} />}
      {currentRoute === "/statistics" && <StatisticsComponent />}
      {currentRoute === "/other" && (
        <OtherTab
          handleDelete={handleDelete}
        />
      )}

      {/* Article Modal */}
      <ArticleModal
        isOpen={showArticleModal}
        onClose={() => {
          setShowArticleModal(false);
          setEditingArticle(null);
        }}
        onSubmit={handleArticleSubmit}
        editingArticle={editingArticle}
        // onImageUpload={handleImageUpload}
      />

      {/* Quote Modal */}
      {/* <QuoteModal fetchQuotes={fetchQuotes} /> */}

      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        onSubmit={handleEventSubmit}
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
    </DashboardLayout>
  );
};

export default AdminDashboardNew;
