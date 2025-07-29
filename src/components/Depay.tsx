import DepayWidgets from "@depay/widgets";
import { TokensIcon } from "@radix-ui/react-icons";
const Depay = () => {
  const handleDepay = () => {
    DepayWidgets.Payment({
      integration: import.meta.env.VITE_DEPAY_INTEGRATION_ID,
    });
  };
  return     <div className="flex flex-col space-y-3 w-full">
      <button
        onClick={handleDepay}
        // disabled={loading||disabled}
        className="w-full bg-green-600 rounded-full text-white px-6 py-3  hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <span>{ "Donate With Cypto"}</span>
        <TokensIcon className="h-5 w-5" />
      </button>
    </div>;
};

export default Depay;
