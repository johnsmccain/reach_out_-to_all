import { Plus } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

interface ArticleProps {
  handleDelete: (id: string, type: "event" | "sermon" | "document" | "article" | "quote") => void;
}

const ArticleComponent = ({ handleDelete }: ArticleProps) => {
  const { articles, setEditingArticle, setShowArticleModal } = useAdminStore();
  return (
              <div >
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setShowArticleModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Article</span>
              </button>
            </div>
            <div className="bg-white rounded shadow-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{article.title}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{article.author}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${article.published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                        {article.is_top && (
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingArticle({
                              ...article,
                              content: '',
                              tags: [],
                              created_at: new Date().toISOString(),
                              updated_at: new Date().toISOString()
                            });
                            setShowArticleModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.id, "article")}
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

export default ArticleComponent