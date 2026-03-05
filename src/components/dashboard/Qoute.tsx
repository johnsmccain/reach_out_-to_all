import { useAdminStore } from '@/store/adminStore';
import type { DailyQuote } from '@/types';

interface QuoteProps {
  quotes: DailyQuote[];
  handleDelete: (id: string, type: "event" | "sermon" | "document" | "article" | "quote", itemName?: string) => void;
}

const Quote = ({ quotes, handleDelete }: QuoteProps) => {
  const { setShowQuoteUploadModal, setEditingQuote, setShowQuoteModal } = useAdminStore();
  return (
              <div>
            <div className="flex justify-end mb-4 gap-2">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Add Text Quote
              </button>
              <button
                onClick={() => setShowQuoteUploadModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Upload Quote Image
              </button>
            </div>
            <div className="bg-white rounded shadow-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quote/Author
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotes.map((quote) => (
                    <tr key={quote.id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${quote.image_type === 'image'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                          }`}>
                          {quote.image_type === 'image' ? 'Image' : 'Text'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {quote.image_type === 'image' && quote.image_url ? (
                          <img
                            src={quote.image_url}
                            alt="Quote"
                            className="h-16 w-16 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {quote.image_type === 'text' ? (
                          <div>
                            <div className="max-w-xs truncate text-sm">{quote.quote}</div>
                            <div className="text-xs text-gray-500">{quote.author}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">Image Quote</div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {new Date(quote.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {quote.image_type === 'text' && (
                          <button
                            onClick={() => {
                              setEditingQuote({
                                ...quote,
                                created_at: quote.created_at || new Date().toISOString()
                              });
                              setShowQuoteModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const itemName = quote.image_type === 'text'
                              ? `"${quote.quote?.substring(0, 50)}${(quote.quote?.length || 0) > 50 ? '...' : ''}"`
                              : `quote for ${new Date(quote.date).toLocaleDateString()}`;
                            handleDelete(quote.id, "quote", itemName);
                          }}
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

export default Quote