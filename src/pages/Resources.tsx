import React from "react";
import { Video, FileText, Download, ExternalLink, Eye } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Sermon, Document } from "../types";
import { format } from "date-fns";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

const Resources = () => {
  const [sermons, setSermons] = React.useState<Sermon[]>([]);
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [previewDoc, setPreviewDoc] = React.useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const [sermonsRes, documentsRes] = await Promise.all([
          supabase
            .from("sermons")
            .select("*")
            .order("date", { ascending: false }),
          supabase
            .from("documents")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (sermonsRes.error) throw sermonsRes.error;
        if (documentsRes.error) throw documentsRes.error;

        setSermons(
          sermonsRes.data?.map((sermon) => ({
            ...sermon,
            videoUrl: sermon.video_url,
            imageUrl:
              sermon.image_url ||
              "https://images.unsplash.com/photo-1616627577385-5c0c4dab0257?ixlib=rb-4.0.3",
          })) || []
        );

        setDocuments(
          documentsRes.data?.map((doc) => ({
            ...doc,
            fileUrl: doc.file_url,
            fileType: doc.file_type,
            fileSize: doc.file_size,
            imageUrl:
              doc.image_url ||
              "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3",
          })) || []
        );
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleDownload = (doc: Document) => {
    window.open(doc.fileUrl, "_blank");
  };

  const handlePreview = (doc: Document) => {
    setPreviewDoc(doc);
    setPreviewOpen(true);
  };

  const formatFileSize = (sizeStr: string): string => {
    // If already formatted (contains KB, MB, etc.), return as is
    if (sizeStr.match(/[KMGT]B/i)) {
      return sizeStr;
    }
    
    // Otherwise, assume it's in bytes and format it
    const bytes = parseInt(sizeStr);
    if (isNaN(bytes)) return sizeStr;
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const getFileTypeBadgeColor = (fileType: string): string => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return 'bg-red-100 text-red-800 hover:bg-red-100';
    if (type.includes('doc')) return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    if (type.includes('txt')) return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
  };

  const canPreview = (fileType: string): boolean => {
    return fileType.toLowerCase().includes('pdf');
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[300px] rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3"
            alt="Resources"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">Resources</h1>
            <p className="text-xl">
              Access our collection of sermons, podcasts, and spiritual
              materials.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Sermons */}
            <section className="mb-16">
              <div className="flex items-center space-x-2 mb-8">
                <Video className="h-8 w-8 text-blue-600" />
                <h2 className="text-3xl font-bold">Sermons</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {sermons.length === 0 ? (
                  <p className="text-gray-500 col-span-2 text-center py-8">
                    No sermons available yet.
                  </p>
                ) : (
                  sermons.map((sermon) => (
                    <div
                      key={sermon.id}
                      className="bg-white rounded-3xl shadow-lg overflow-hidden"
                    >
                      <div className="relative h-48">
                        <img
                          src={sermon.imageUrl}
                          alt={sermon.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {sermon.title}
                          </h3>
                          <p className="text-white/80">By {sermon.speaker}</p>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-gray-600 space-y-1 mb-4">
                          <p>
                            Date:{" "}
                            {format(new Date(sermon.date), "MMMM d, yyyy")}
                          </p>
                          <p>Duration: {sermon.duration}</p>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {sermon.description}
                        </p>

                        {/* Watch/Listen Button */}
                        <a
                          href={sermon.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-colors"
                        >
                          <Video className="h-5 w-5 mr-2" />
                          Watch Sermon
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Documents */}
            <section>
              <div className="flex items-center space-x-2 mb-8">
                <FileText className="h-8 w-8 text-blue-600" />
                <h2 className="text-3xl font-bold">Documents</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.length === 0 ? (
                  <p className="text-gray-500 col-span-full text-center py-8">
                    No documents available yet.
                  </p>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    >
                      {/* Larger Thumbnail */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={doc.imageUrl}
                          alt={doc.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* File Type Badge */}
                        <div className="absolute top-3 right-3">
                          <Badge className={`${getFileTypeBadgeColor(doc.fileType)} font-semibold text-xs px-3 py-1`}>
                            {doc.fileType.toUpperCase()}
                          </Badge>
                        </div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-bold text-white line-clamp-2">
                            {doc.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                          {doc.description}
                        </p>
                        
                        {/* File Info */}
                        <div className="flex items-center justify-between mb-4 text-sm">
                          <span className="text-gray-500 font-medium">
                            Size: {formatFileSize(doc.fileSize)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex overflow-x-hidden rounded-3xl shadow-lg">
                          {canPreview(doc.fileType) && (
                            <Button
                              onClick={() => handlePreview(doc)}
                              variant="secondary"
                              className="flex-1 bg-blue-100 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDownload(doc)}
                            className={`${canPreview(doc.fileType) ? 'flex-1' : 'w-full'} bg-green-600 hover:bg-green-700 text-white font-semibold`}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Preview Modal */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogContent className="max-w-4xl h-[80vh]">
                <DialogHeader>
                  <DialogTitle>{previewDoc?.title}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                  {previewDoc && canPreview(previewDoc.fileType) ? (
                    <iframe
                      src={previewDoc.fileUrl}
                      className="w-full h-full border-0 rounded-3xl"
                      title={`Preview of ${previewDoc.title}`}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                          Preview not available for this file type.
                        </p>
                        <Button
                          onClick={() => previewDoc && handleDownload(previewDoc)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Instead
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default Resources;
