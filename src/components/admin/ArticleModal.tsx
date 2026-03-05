import { useState, useEffect } from 'react';
import type { Article } from '@/types';
import { X, Save, FileText, User, Image as ImageIcon, Tag, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { migrateContent } from '@/lib/contentMigration';
import { RichTextEditor } from '@/components/RichTextEditor';
import { motion, AnimatePresence } from 'framer-motion';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Article>) => Promise<void>;
  editingArticle?: Article | null;
  onImageUpload?: (file: File) => Promise<string>;
}

export const ArticleModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingArticle,
  onImageUpload 
}: ArticleModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [isTop, setIsTop] = useState(false);
  const [published, setPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title);
      setContent(migrateContent(editingArticle.content));
      setAuthor(editingArticle.author);
      setCoverImage(editingArticle.cover_image || '');
      setTags(editingArticle.tags.join(', '));
      setIsTop(editingArticle.is_top);
      setPublished(editingArticle.published);
    } else {
      resetForm();
    }
  }, [editingArticle, isOpen]);

  useEffect(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    if (content && title) {
      const timeout = setTimeout(() => {
        localStorage.setItem('article_draft', JSON.stringify({
          title, content, author, coverImage, tags, isTop, published
        }));
      }, 2000);
      setAutoSaveTimeout(timeout);
    }

    return () => {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    };
  }, [title, content, author, coverImage, tags, isTop, published]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setAuthor('');
    setCoverImage('');
    setTags('');
    setIsTop(false);
    setPublished(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }
    
    if (!author.trim()) {
      toast.error('Author is required');
      return;
    }

    setSubmitting(true);

    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        cover_image: coverImage.trim() || undefined,
        tags: tagArray,
        is_top: isTop,
        published,
      });

      localStorage.removeItem('article_draft');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error submitting article:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('article_draft');
    if (draft) {
      const parsed = JSON.parse(draft);
      setTitle(parsed.title || '');
      setContent(parsed.content || '');
      setAuthor(parsed.author || '');
      setCoverImage(parsed.coverImage || '');
      setTags(parsed.tags || '');
      setIsTop(parsed.isTop || false);
      setPublished(parsed.published ?? true);
      toast.success('Draft loaded');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 text-white p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  {editingArticle ? 'Edit Article' : 'Create New Article'}
                </h2>
                {!editingArticle && (
                  <button
                    type="button"
                    onClick={loadDraft}
                    className="text-sm text-blue-100 hover:text-white transition-colors mt-1 flex items-center gap-1"
                  >
                    <Save className="h-3 w-3" />
                    Load saved draft
                  </button>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-88px)]">
              {/* Title & Author Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter article title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Author *
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter author name"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://example.com/image.jpg"
                />
                {coverImage && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                    <img src={coverImage} alt="Cover preview" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-600" />
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="mission, evangelism, outreach"
                />
                {tags && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.split(',').map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <div className="border border-gray-300 rounded-xl overflow-hidden">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Start writing your article..."
                    onImageUpload={onImageUpload}
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-6 p-4 bg-gray-50 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isTop}
                      onChange={(e) => setIsTop(e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    ⭐ Featured Article
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {published ? 'Published' : 'Draft'}
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{editingArticle ? 'Update' : 'Publish'} Article</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
             