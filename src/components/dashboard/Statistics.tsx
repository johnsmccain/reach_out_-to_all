import { useAdminStore } from '@/store/adminStore';

const Statistics = () => {
  const { statistics, setShowStatsModal } = useAdminStore();
  return (
             <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowStatsModal(true)}
                className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500   dark:from-red-700 dark:via-red-600 dark:to-red-500    text-white px-4 py-2 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
              >
                Update Statistics
              </button>
            </div>
            {statistics && (
              <div className="bg-white rounded shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Current Ministry Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-100">States Covered</p>
                    <p className="text-3xl font-bold text-blue-600">{statistics.states_covered}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-100">Outreaches Conducted</p>
                    <p className="text-3xl font-bold text-green-600">{statistics.outreaches_conducted}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-100">Locals Reached</p>
                    <p className="text-3xl font-bold text-purple-600">{statistics.locals_reached.toLocaleString()}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-100">Communities Reached</p>
                    <p className="text-3xl font-bold text-yellow-600">{statistics.communities_reached}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-100">Souls Won</p>
                    <p className="text-3xl font-bold text-red-600">{statistics.souls_won.toLocaleString()}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-100">Rededication Commitments</p>
                    <p className="text-3xl font-bold text-indigo-600">{statistics.rededication_commitments.toLocaleString()}</p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-100">Medical Beneficiaries</p>
                    <p className="text-3xl font-bold text-pink-600">{statistics.medical_beneficiaries.toLocaleString()}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-100">Welfare Beneficiaries</p>
                    <p className="text-3xl font-bold text-teal-600">{statistics.welfare_beneficiaries.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Last updated: {new Date(statistics.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
  )
}

export default Statistics