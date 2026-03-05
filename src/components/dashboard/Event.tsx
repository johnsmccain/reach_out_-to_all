import { Plus } from "lucide-react";
import EventsTable from "../admin/EventsTable";
import { useAdminStore } from "@/store/adminStore";

interface EventModalProps {
  handleDelete: (id: string, type: "event" | "sermon" | "document" | "article" | "quote", itemName?: string) => void;
}
const Event = ({ handleDelete }: EventModalProps) => {
  const {setShowEventModal, setEditingEvent, events} = useAdminStore();
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowEventModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Event</span>
        </button>
      </div>

      <EventsTable
        events={events}
        onEdit={(event) => {
          setEditingEvent(event);
          setShowEventModal(true);
        }}
        onDelete={(id) => handleDelete(id, "event")}
      />
    </div>
  );
};

export default Event;
