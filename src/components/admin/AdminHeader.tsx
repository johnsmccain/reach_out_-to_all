import { Plus, LogOut } from "lucide-react";

interface AdminHeaderProps {
  onAddClick: () => void;
  onLogout: () => void;
}

const AdminHeader = ({ onAddClick, onLogout }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
        Admin Dashboard
      </h1>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={onAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Event</span>
        </button>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
