import { useState } from "react";
import { CreditCard } from "lucide-react";
import toast from "react-hot-toast";

// Replace with your actual Stripe Payment Link (must allow custom amounts)
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_3cseXs1qGdf46Jy7st";

// Define success and cancel redirect URLs
const SUCCESS_URL = "https://r2a.netlify.app/"; // Updated success URL
const CANCEL_URL = "http://localhost:5174/";

const DonateButton = () => {
  const [loading, setLoading] = useState(false);

  const handleDonate = () => {
    setLoading(true);
    toast.loading("Redirecting to Stripe...");

    // Redirect to Stripe with success and cancel URLs
    const stripeUrl = `${STRIPE_PAYMENT_LINK}?success_url=${encodeURIComponent(
      SUCCESS_URL
    )}&cancel_url=${encodeURIComponent(CANCEL_URL)}`;

    window.location.href = stripeUrl;
    setLoading(false);
  };

  return (
    <div className="flex flex-col space-y-3 w-full">
      <button
        onClick={handleDonate}
        disabled={loading}
        className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <span>{loading ? "Processing..." : "Donate Online"}</span>
        <CreditCard className="h-5 w-5" />
      </button>
    </div>
  );
};

export default DonateButton;
