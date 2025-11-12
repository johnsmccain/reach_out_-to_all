import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Update Ministry Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                States Covered
              </label>
              <input
                type="number"
                name="states_covered"
                value={formData.states_covered}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outreaches Conducted
              </label>
              <input
                type="number"
                name="outreaches_conducted"
                value={formData.outreaches_conducted}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Locals Reached
              </label>
              <input
                type="number"
                name="locals_reached"
                value={formData.locals_reached}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Communities Reached
              </label>
              <input
                type="number"
                name="communities_reached"
                value={formData.communities_reached}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Souls Won
              </label>
              <input
                type="number"
                name="souls_won"
                value={formData.souls_won}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rededication Commitments
              </label>
              <input
                type="number"
                name="rededication_commitments"
                value={formData.rededication_commitments}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Beneficiaries
              </label>
              <input
                type="number"
                name="medical_beneficiaries"
                value={formData.medical_beneficiaries}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Welfare Beneficiaries
              </label>
              <input
                type="number"
                name="welfare_beneficiaries"
                value={formData.welfare_beneficiaries}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> These statistics will be displayed on the home page
              and reflect the overall impact of your ministry work.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Statistics
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatisticsModal;
