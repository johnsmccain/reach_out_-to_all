import { supabase } from "@/lib/supabase";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";

interface QuoteModalProps {
  fetchQuotes: () => void;
}
const QuoteModal = ({ fetchQuotes }: QuoteModalProps) => {
  const { editingQuote, setShowQuoteModal, setEditingQuote } = useAdminStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const quoteData = {
      quote: formData.get("quote") as string,
      author: formData.get("author") as string,
      date: formData.get("date") as string,
      image_type: "text",
    };

    try {
      let error;
      if (editingQuote) {
        const { error: updateError } = await supabase
          .from("daily_quotes")
          .update(quoteData)
          .eq("id", editingQuote.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("daily_quotes")
          .insert([quoteData]);
        error = insertError;
      }

      if (error) throw error;
      toast.success(
        editingQuote
          ? "Quote updated successfully"
          : "Quote added successfully",
      );
      setShowQuoteModal(false);
      setEditingQuote(null);
      fetchQuotes();
    } catch (error: any) {
      toast.error(`Error saving quote: ${error.message || "Unknown error"}`);
      console.error("Error saving quote:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          {editingQuote ? "Edit Daily Quote" : "Add Daily Quote"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quote
            </label>
            <textarea
              name="quote"
              defaultValue={editingQuote?.quote || ""}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              name="author"
              defaultValue={editingQuote?.author || ""}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              defaultValue={
                editingQuote?.date || new Date().toISOString().split("T")[0]
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowQuoteModal(false);
                setEditingQuote(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingQuote ? "Update" : "Add"} Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteModal;
