import { useAdminStore } from '@/store/adminStore';

interface DocumentProps {
  handleDelete: (id: string, type: "event" | "sermon" | "document" | "article" | "quote") => void;
}
const DocumentTab = ({ handleDelete }: DocumentProps) => {
  const {documents, setShowDocumentUploadModal} = useAdminStore()
  return (
              <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowDocumentUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Upload Document
              </button>
            </div>
            <div className="bg-white rounded shadow-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thumbnail
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-4 sm:px-6 py-4">
                        {doc.imageUrl ? (
                          <img
                            src={doc.imageUrl}
                            alt={doc.title}
                            className="h-16 w-16 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-gray-900 truncate">
                            {doc.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {doc.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${doc.fileType.toLowerCase().includes('pdf')
                            ? 'bg-red-100 text-red-800'
                            : doc.fileType.toLowerCase().includes('doc')
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                          {doc.fileType}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.fileSize}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => window.open(doc.fileUrl, '_blank')}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, "document")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
  )
}

export default DocumentTab