import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, Download, Heart, ThumbsUp, MessageCircle, ArrowLeft, Star } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Article, ArticleReaction, ArticleComment } from "../types";
import toast from "react-hot-toast";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [reactions, setReactions] = useState<ArticleReaction[]>([]);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  
  const MAX_COMMENT_LENGTH = 500;
  const MAX_NAME_LENGTH = 50;

  useEffect(() => {
    if (id) {
      fetchArticle();
      fetchReactions();
      fetchComments();
      subscribeToComments();
    }
  }, [id]);

  const fetchArticle = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .eq("published", true)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
    } else if (data) {
      setArticle(data);
      fetchRelatedArticles(data.tags);
    }
    setLoading(false);
  };

  const fetchRelatedArticles = async (_tags: string[]) => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("published", true)
      .neq("id", id)
      .limit(3);

    if (data) {
      setRelatedArticles(data);
    }
  };

  const fetchReactions = async () => {
    const { data } = await supabase
      .from("article_reactions")
      .select("*")
      .eq("article_id", id);

    if (data) {
      setReactions(data);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    const { data, error } = await supabase
      .from("article_comments")
      .select("*")
      .eq("article_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } else if (data) {
      setComments(data);
    }
    setLoadingComments(false);
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel(`article_comments_${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "article_comments",
          filter: `article_id=eq.${id}`,
        },
        (payload) => {
          const newComment = payload.new as ArticleComment;
          setComments((prev) => {
            // Avoid duplicates
            if (prev.some(c => c.id === newComment.id)) {
              return prev;
            }
            return [newComment, ...prev];
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to comments');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to comments');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleReaction = async (type: 'like' | 'love' | 'pray') => {
    const userId = crypto.randomUUID();
    
    const { error } = await supabase
      .from("article_reactions")
      .insert([{ article_id: id, user_id: userId, type }]);

    if (error) {
      toast.error("Error adding reaction");
    } else {
      fetchReactions();
      toast.success("Reaction added!");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!authorName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    if (authorName.trim().length > MAX_NAME_LENGTH) {
      toast.error(`Name must be ${MAX_NAME_LENGTH} characters or less`);
      return;
    }
    
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    
    if (newComment.trim().length > MAX_COMMENT_LENGTH) {
      toast.error(`Comment must be ${MAX_COMMENT_LENGTH} characters or less`);
      return;
    }

    setSubmittingComment(true);

    const { error } = await supabase
      .from("article_comments")
      .insert([{
        article_id: id,
        user_id: crypto.randomUUID(),
        comment: newComment.trim(),
        author_name: authorName.trim()
      }]);

    setSubmittingComment(false);

    if (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to post comment. Please try again.");
    } else {
      setNewComment("");
      setAuthorName("");
      toast.success("Comment posted successfully!");
    }
  };

  const downloadPDF = async () => {
    if (!article) {
      toast.error("Article data not available");
      return;
    }
    
    // Validate article data before attempting PDF generation
    if (!article.title || !article.content) {
      toast.error("Article is missing required information for PDF export");
      return;
    }
    
    setGeneratingPDF(true);
    
    try {
      const { generateArticlePDF } = await import("../lib/pdfExport");
      
      await generateArticlePDF({
        title: article.title,
        author: article.author || 'Unknown Author',
        date: new Date(article.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        content: article.content,
        coverImage: article.cover_image || undefined,
        tags: article.tags || []
      });
      
      toast.success("PDF downloaded successfully!");
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      
      // Provide specific error messages based on error type
      let errorMessage = "Failed to generate PDF. Please try again.";
      
      if (error.message) {
        // Use the specific error message from the PDF generation
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { duration: 5000 });
      
      // Log detailed error for debugging
      console.error("PDF generation failed with details:", {
        error,
        articleId: article.id,
        articleTitle: article.title,
        contentLength: article.content?.length,
        hasCoverImage: !!article.cover_image
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  const getReactionCount = (type: string) => {
    return reactions.filter(r => r.type === type).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Article not found</h1>
        <Link to="/articles" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8">
      {/* Back Button */}
      <Link
        to="/articles"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Articles
      </Link>

      {/* Article Header */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] transition-all duration-500"
      >
        {article.cover_image && (
          <div className="relative  aspect-[20/9] ">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            {article.is_top && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Top Article
              </div>
            )}
          </div>
        )}

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(article.created_at).toLocaleDateString()}</span>
              </div>
              <button
                onClick={downloadPDF}
                disabled={generatingPDF}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.article>

      {/* Reactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300"
      >
        <h3 className="text-xl font-bold mb-4">Show your support</h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleReaction('like')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(59,130,246,0.3)]"
          >
            <ThumbsUp className="h-5 w-5" />
            Like ({getReactionCount('like')})
          </button>
          <button
            onClick={() => handleReaction('love')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-lg hover:from-red-200 hover:to-red-300 transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(239,68,68,0.3)]"
          >
            <Heart className="h-5 w-5" />
            Love ({getReactionCount('love')})
          </button>
          <button
            onClick={() => handleReaction('pray')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-lg hover:from-purple-200 hover:to-purple-300 transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(147,51,234,0.3)]"
          >
            <Star className="h-5 w-5" />
            Pray ({getReactionCount('pray')})
          </button>
        </div>
      </motion.div>

      {/* Comments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
          </h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {comments.length}
          </span>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleComment} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={MAX_NAME_LENGTH}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={submittingComment}
            />
            <p className="text-xs text-gray-500 mt-1">
              {authorName.length}/{MAX_NAME_LENGTH} characters
            </p>
          </div>
          <div>
            <textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={MAX_COMMENT_LENGTH}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              required
              disabled={submittingComment}
            />
            <p className="text-xs text-gray-500 mt-1">
              {newComment.length}/{MAX_COMMENT_LENGTH} characters
            </p>
          </div>
          <button
            type="submit"
            disabled={submittingComment}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submittingComment ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Posting...
              </>
            ) : (
              'Post Comment'
            )}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4 pt-4 border-t">
          {loadingComments ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-900">{comment.author_name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-gray-900">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                to={`/articles/${relatedArticle.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {relatedArticle.cover_image && (
                  <img
                    src={relatedArticle.cover_image}
                    alt={relatedArticle.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {relatedArticle.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    By {relatedArticle.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ArticleDetail;