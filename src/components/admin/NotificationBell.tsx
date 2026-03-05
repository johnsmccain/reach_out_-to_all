import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/notificationStore';
import { formatDistanceToNow } from 'date-fns';

const ITEMS_PER_PAGE = 5;

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearAll 
  } = useNotificationStore();

  // Calculate pagination
  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  // Reset to page 1 when notifications change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [notifications.length, currentPage, totalPages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getTypeIcon = (_type: string) => {
    // You can customize icons based on notification type
    return '📢';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-neutral-100 transition-colors"
      >
        <Bell className="h-5 w-5 text-neutral-600" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold flex items-center justify-center shadow-lg"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white shadow-2xl z-[9999] max-h-[600px] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-1.5 hover:bg-white/20 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="h-4 w-4 text-white" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="p-1.5 hover:bg-white/20 transition-colors"
                      title="Clear all"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
              {unreadCount > 0 && (
                <p className="text-xs text-white/80 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications</p>
                  <p className="text-xs text-gray-400 mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {currentNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 text-2xl">
                            {getTypeIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {notification.title}
                              </h4>
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="flex-shrink-0 p-1 hover:bg-gray-200 transition-colors"
                              >
                                <X className="h-3 w-3 text-gray-400" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs px-2 py-0.5 border ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1"
                              >
                                <Check className="h-3 w-3" />
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="border-t border-gray-200 p-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                          </span>
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-500 text-center mt-2">
                        Showing {startIndex + 1}-{Math.min(endIndex, notifications.length)} of {notifications.length}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
