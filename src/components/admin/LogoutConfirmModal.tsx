import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, AlertTriangle } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold">Confirm Logout</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-white/20 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 flex items-center justify-center">
                    <LogOut className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Are you sure you want to logout?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      You will be signed out of your admin account and redirected to the login page. 
                      Any unsaved changes will be lost.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmModal;
