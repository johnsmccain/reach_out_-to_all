import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-linear-to-br from-primary-100 to-secondary-100 rounded-full blur-2xl opacity-50"></div>
        <div className="relative bg-linear-to-br from-primary-50 to-secondary-50 p-6 rounded-full">
          <Icon className="h-12 w-12 text-primary-600" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center max-w-md"
      >
        <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
        <p className="text-neutral-600 mb-6">{description}</p>

        {/* Action Button */}
        {action && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="px-6 py-3 bg-linear-to-r from-primary-600 via-secondary-600 to-accent-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {action.label}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;
