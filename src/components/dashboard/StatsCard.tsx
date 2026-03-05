import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  loading?: boolean;
}

const colorClasses = {
  primary: {
    bg: 'from-primary-50 to-primary-100',
    icon: 'text-primary-600',
    value: 'text-primary-700',
  },
  secondary: {
    bg: 'from-secondary-50 to-secondary-100',
    icon: 'text-secondary-600',
    value: 'text-secondary-700',
  },
  accent: {
    bg: 'from-accent-50 to-accent-100',
    icon: 'text-accent-600',
    value: 'text-accent-700',
  },
  success: {
    bg: 'from-success-50 to-success-50',
    icon: 'text-success-600',
    value: 'text-success-700',
  },
  warning: {
    bg: 'from-warning-50 to-warning-50',
    icon: 'text-warning-600',
    value: 'text-warning-700',
  },
  error: {
    bg: 'from-error-50 to-error-50',
    icon: 'text-error-600',
    value: 'text-error-700',
  },
};

const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary', loading }: StatsCardProps) => {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${colors.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-300 -mr-16 -mt-16`}></div>

      <div className="relative">
        {/* Icon */}
        <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${colors.bg} mb-4`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>

        {/* Value */}
        {loading ? (
          <div className="h-8 w-24 bg-neutral-200 rounded animate-pulse"></div>
        ) : (
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${colors.value}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {trend && (
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
