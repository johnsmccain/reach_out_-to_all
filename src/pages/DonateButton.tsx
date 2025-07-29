import { useState } from "react";
import { CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import Paystack from "@paystack/inline-js";

// Optional: Remove unused Stripe URLs unless you plan to support Stripe too
// const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_3cseXs1qGdf46Jy7st";

const DonateButton = ({
  email,
  amount,
  disabled
}: {
  email: string;
  amount: number;
  disabled?: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDonate = () => {
    if (!email || amount <= 0) {
      toast.error("Please enter a valid email and amount.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing payment...");

    try {
      const popup = new Paystack();
      popup.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100, // Convert to kobo
        onSuccess: (transaction) => {
          console.log("Payment Success:", transaction);
          toast.success("Thank you for donating!", { id: toastId });
        },
        onCancel: () => {
          console.log("Payment cancelled.");
          toast.error("Donation was cancelled.", { id: toastId });
        },
        onLoad: () => {
          console.log("Paystack popup loaded.");
        },
        onError: (error) => {
          console.error("Payment Error:", error);
          toast.error("Something went wrong. Try again later.", {
            id: toastId,
          });
        },
      });
    } catch (err) {
      console.error("Unexpected Error:", err);
      toast.error("An unexpected error occurred.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3 w-full">
      <button
        onClick={handleDonate}
        disabled={loading||disabled}
        className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <span>{loading ? "Processing..." : "Donate Online"}</span>
        <CreditCard className="h-5 w-5" />
      </button>
    </div>
  );
};

export default DonateButton;
