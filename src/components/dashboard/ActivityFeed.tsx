import { motion } from 'framer-motion';
import { Calendar, FileText, Upload, Edit, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'event' | 'article' | 'upload' | 'edit';
  title: string;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
  maxItems?: number;
}

const activityIcons = {
  event: Calendar,
  article: FileText,
  upload: Upload,
  edit: Edit,
};

const activityColors = {
  event: 'bg-primary-100 text-primary-600',
  article: 'bg-secondary-100 text-secondary-600',
  upload: 'bg-accent-100 text-accent-600',
  edit: 'bg-success-100 text-success-600',
};

const ActivityFeed = ({ activities = [], maxItems = 5 }: ActivityFeedProps) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-neutral-900">Recent Activity</h3>
        <Clock className="h-5 w-5 text-neutral-400" />
      </div>

      {displayActivities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral-500 text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayActivities.map((activity, index) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 pb-4 border-b border-neutral-100 last:border-0 last:pb-0"
              >
                <div className={`shrink-0 p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{activity.title}</p>
                  <p className="text-xs text-neutral-600 mt-0.5">{activity.description}</p>
                  <p className="text-xs text-neutral-400 mt-1">{activity.timestamp}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
