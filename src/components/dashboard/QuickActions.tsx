import { motion } from 'framer-motion';
import { type LucideIcon, Plus, Upload, Edit, FileText } from 'lucide-react';

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'accent' | 'success';
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  { label: 'New Event', icon: Plus, onClick: () => {}, color: 'primary' },
  { label: 'Upload Quote', icon: Upload, onClick: () => {}, color: 'secondary' },
  { label: 'Write Article', icon: Edit, onClick: () => {}, color: 'accent' },
  { label: 'Add Document', icon: FileText, onClick: () => {}, color: 'success' },
];

const colorClasses = {
  primary: 'from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400',
  secondary: 'from-secondary-600 to-secondary-500 hover:from-secondary-500 hover:to-secondary-400',
  accent: 'from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400',
  success: 'from-success-600 to-success-500 hover:from-success-500 hover:to-success-400',
};

const QuickActions = ({ actions = defaultActions }: QuickActionsProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const colorClass = colorClasses[action.color || 'primary'];
          
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
              className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-linear-to-br ${colorClass} text-white transition-all duration-300 overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
              <Icon className="h-6 w-6 relative z-10" />
              <span className="text-sm font-medium relative z-10">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
