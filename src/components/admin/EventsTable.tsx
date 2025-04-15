import { Calendar, Edit, Trash2 } from "lucide-react";
import type { Event } from "@/types";

interface EventsTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventsTable = ({ events, onEdit, onDelete }: EventsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event.id}>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.description}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    event.type === "future"
                      ? "bg-green-100 text-green-800"
                      : event.type === "current"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {event.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(event)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="sm:hidden p-4 space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="font-semibold text-lg">{event.title}</h2>
            </div>
            <p className="text-sm text-gray-500 mb-1">{event.description}</p>
            <p className="text-sm text-gray-500">
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="text-sm mt-1">
              <span
                className={`px-2 py-1 inline-block text-xs font-semibold rounded-full ${
                  event.type === "future"
                    ? "bg-green-100 text-green-800"
                    : event.type === "current"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {event.type}
              </span>
            </p>
            <div className="flex justify-end space-x-4 mt-3">
              <button
                onClick={() => onEdit(event)}
                className="text-blue-600 hover:text-blue-900"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsTable;
