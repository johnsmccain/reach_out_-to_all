import { useState, useEffect } from "react";
import { X, Save, BarChart3, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import type { Statistics } from "../../types";

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (stats: Omit<Statistics, "id" | "updated_at">) => void;
  currentStats?: Statistics | null;
}

const StatisticsModal = ({ isOpen, onClose, onSubmit, currentStats }: StatisticsModalProps) => {
  const [formData, setFormData] = useState({
    states_covered: currentStats?.states_covered || 0,
    outreaches_conducted: currentStats?.outreaches_conducted || 0,
    locals_reached: currentStats?.locals_reached || 0,
    communities_reached: currentStats?.communities_reached || 0,
    souls_won: currentStats?.souls_won || 0,
    rededication_commitments: currentStats?.rededication_commitments || 0,
    medical_beneficiaries: currentStats?.medical_beneficiaries || 0,
    welfare_beneficiaries: currentStats?.welfare_beneficiaries || 0,
  });

  useEffect(() => {
    if (currentStats) {
      setFormData({
        states_covered: currentStats.states_covered,
        outreaches_conducted: currentStats.outreaches_conducted,
        locals_reached: currentStats.locals_reached,
        communities_reached: currentStats.communities_reached,
        souls_won: currentStats.souls_won,
        rededication_commitments: currentStats.rededication_commitments,
        medical_beneficiaries: currentStats.medical_beneficiaries,
        welfare_beneficiaries: currentStats.welfare_beneficiaries,
      });
    }
  }, [currentStats]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseInt(e.target.value) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
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
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-linear-to-r from-blue-700 via-blue-600 to-blue-500   dark:from-red-700 dark:via-red-600 dark:to-red-500    text-white p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Update Ministry Statistics
                </h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    States Covered
                  </label>
                  <input
                    type="number"
                    name="states_covered"
                    value={formData.states_covered}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Outreaches Conducted
                  </label>
                  <input
                    type="number"
                    name="outreaches_conducted"
                    value={formData.outreaches_conducted}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Locals Reached
                  </label>
                  <input
                    type="number"
                    name="locals_reached"
                    value={formData.locals_reached}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Communities Reached
                  </label>
                  <input
                    type="number"
                    name="communities_reached"
                    value={formData.communities_reached}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Souls Won
                  </label>
                  <input
                    type="number"
                    name="souls_won"
                    value={formData.souls_won}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Rededication Commitments
                  </label>
                  <input
                    type="number"
                    name="rededication_commitments"
                    value={formData.rededication_commitments}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Medical Beneficiaries
                  </label>
                  <input
                    type="number"
                    name="medical_beneficiaries"
                    value={formData.medical_beneficiaries}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Welfare Beneficiaries
                  </label>
                  <input
                    type="number"
                    name="welfare_beneficiaries"
                    value={formData.welfare_beneficiaries}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> These statistics will be displayed on the home page
                  and reflect the overall impact of your ministry work.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 bg-linear-to-r from-blue-700 via-blue-600 to-blue-500   dark:from-red-700 dark:via-red-600 dark:to-red-500   text-white font-medium rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Save className="h-5 w-5" />
                  <span>Update Statistics</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StatisticsModal;
