import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import type { Event, Statistics, Sermon, Document } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import EventsTable from "@/components/admin/EventsTable";
import EventModal from "@/components/admin/EventModal";

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSermonModal, setShowSermonModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
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
    type: "event" | "sermon" | "document"
  ) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;

    const { error } = await supabase
      .from(
        type === "event"
          ? "events"
          : type === "sermon"
          ? "sermons"
          : "documents"
      )
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(`Error deleting ${type}`);
      console.error(`Error deleting ${type}:`, error);
    } else {
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
      );
      if (type === "event") fetchEvents();
      else if (type === "sermon") fetchSermons();
      else fetchDocuments();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleEventSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents page refresh

    console.log("Submitting event...");

    const formData = new FormData(e.currentTarget);

    const eventData: Event = {
      id: crypto.randomUUID(), // Ensure 'id' is assigned
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

  const handleSermonSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const dateStr = formData.get("date") as string;
    const date = new Date(dateStr).toISOString();

    const sermonData = {
      title: formData.get("title") as string,
      speaker: formData.get("speaker") as string,
      date,
      duration: formData.get("duration") as string,
      description: formData.get("description") as string,
      video_url: formData.get("videoUrl") as string,
    };

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

  const handleDocumentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const documentData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      file_url: formData.get("fileUrl") as string,
      file_type: formData.get("fileType") as string,
      file_size: formData.get("fileSize") as string,
    };

    try {
      let error;

      if (editingDocument) {
        const { error: updateError } = await supabase
          .from("documents")
          .update(documentData)
          .eq("id", editingDocument.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("documents")
          .insert([documentData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(
        editingDocument
          ? "Document updated successfully"
          : "Document created successfully"
      );
      setShowDocumentModal(false);
      setEditingDocument(null);
      fetchDocuments();
    } catch (error: any) {
      console.error("Error saving document:", error);
      toast.error(error.message || "Error saving document");
    }
  };

  const handleStatsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const statsData = {
      states_covered: parseInt(formData.get("states_covered") as string),
      outreaches_conducted: parseInt(
        formData.get("outreaches_conducted") as string
      ),
      locals_reached: parseInt(formData.get("locals_reached") as string),
      communities_reached: parseInt(
        formData.get("communities_reached") as string
      ),
      souls_won: parseInt(formData.get("souls_won") as string),
      rededication_commitments: parseInt(
        formData.get("rededication_commitments") as string
      ),
      medical_beneficiaries: parseInt(
        formData.get("medical_beneficiaries") as string
      ),
      welfare_beneficiaries: parseInt(
        formData.get("welfare_beneficiaries") as string
      ),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from("statistics")
        .update(statsData)
        .eq("id", statistics?.id);

      if (error) throw error;

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
            <TabsTrigger value="sermons">Sermons</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowEventModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Event
              </button>
            </div>
            <div className="overflow-x-auto">
              <EventsTable
                events={events}
                onEdit={(event) => {
                  setEditingEvent(event);
                  setShowEventModal(true);
                }}
                onDelete={(id) => handleDelete(id, "event")}
              />
            </div>
          </TabsContent>

          <TabsContent value="sermons">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowSermonModal(true)}
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
                      Duration
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sermons.map((sermon) => (
                    <tr key={sermon.id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{sermon.title}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{sermon.speaker}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {new Date(sermon.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{sermon.duration}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
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

          <TabsContent value="documents">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowDocumentModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Document
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
                  {documents.map((document) => (
                    <tr key={document.id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{document.title}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{document.fileType}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{document.fileSize}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingDocument(document);
                            setShowDocumentModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(document.id, "document")}
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
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <h3 className="text-xl font-bold mb-4">Current Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-600">States Covered</p>
                    <p className="text-2xl mt-2">{statistics.states_covered}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-600">Outreaches Conducted</p>
                    <p className="text-2xl mt-2">{statistics.outreaches_conducted}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-600">Locals Reached</p>
                    <p className="text-2xl mt-2">{statistics.locals_reached}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-600">Communities Reached</p>
                    <p className="text-2xl mt-2">{statistics.communities_reached}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-600">Souls Won</p>
                    <p className="text-2xl mt-2">{statistics.souls_won}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-600">Rededication Commitments</p>
                    <p className="text-2xl mt-2">{statistics.rededication_commitments}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-600">Medical Beneficiaries</p>
                    <p className="text-2xl mt-2">{statistics.medical_beneficiaries}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-600">Welfare Beneficiaries</p>
                    <p className="text-2xl mt-2">{statistics.welfare_beneficiaries}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Last updated: {new Date(statistics.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
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

      {/* Sermon Modal */}
      {showSermonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingSermon ? "Edit Sermon" : "Add New Sermon"}
            </h2>
            <form onSubmit={handleSermonSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingSermon?.title}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Speaker
                </label>
                <input
                  type="text"
                  name="speaker"
                  defaultValue={editingSermon?.speaker}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  defaultValue={
                    editingSermon?.date
                      ? new Date(editingSermon.date).toISOString().slice(0, 16)
                      : ""
                  }
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  defaultValue={editingSermon?.duration}
                  placeholder="e.g., 45 minutes"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingSermon?.description}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Video URL
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  defaultValue={editingSermon?.videoUrl}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowSermonModal(false);
                    setEditingSermon(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingSermon ? "Update" : "Create"} Sermon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingDocument ? "Edit Document" : "Add New Document"}
            </h2>
            <form onSubmit={handleDocumentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingDocument?.title}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingDocument?.description}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  File URL
                </label>
                <input
                  type="url"
                  name="fileUrl"
                  defaultValue={editingDocument?.fileUrl}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  File Type
                </label>
                <input
                  type="text"
                  name="fileType"
                  defaultValue={editingDocument?.fileType}
                  placeholder="e.g., PDF, DOCX"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  File Size
                </label>
                <input
                  type="text"
                  name="fileSize"
                  defaultValue={editingDocument?.fileSize}
                  placeholder="e.g., 2.5 MB"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowDocumentModal(false);
                    setEditingDocument(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingDocument ? "Update" : "Create"} Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatsModal && statistics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <h2 className="text-2xl font-bold mb-6">Update Statistics</h2>
            <form onSubmit={handleStatsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    States Covered
                  </label>
                  <input
                    type="number"
                    name="states_covered"
                    defaultValue={statistics.states_covered}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Outreaches Conducted
                  </label>
                  <input
                    type="number"
                    name="outreaches_conducted"
                    defaultValue={statistics.outreaches_conducted}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Locals Reached
                  </label>
                  <input
                    type="number"
                    name="locals_reached"
                    defaultValue={statistics.locals_reached}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Communities Reached
                  </label>
                  <input
                    type="number"
                    name="communities_reached"
                    defaultValue={statistics.communities_reached}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Souls Won
                  </label>
                  <input
                    type="number"
                    name="souls_won"
                    defaultValue={statistics.souls_won}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rededication Commitments
                  </label>
                  <input
                    type="number"
                    name="rededication_commitments"
                    defaultValue={statistics.rededication_commitments}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Medical Beneficiaries
                  </label>
                  <input
                    type="number"
                    name="medical_beneficiaries"
                    defaultValue={statistics.medical_beneficiaries}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Welfare Beneficiaries
                  </label>
                  <input
                    type="number"
                    name="welfare_beneficiaries"
                    defaultValue={statistics.welfare_beneficiaries}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowStatsModal(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Statistics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
