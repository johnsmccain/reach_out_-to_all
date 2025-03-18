import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const DonateButton = () => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(""); // Store user input amount

  const handleDonate = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Number(amount) }), // Use user input amount
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { id } = await response.json();
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      toast.error("Payment failed. Try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3 w-full">
      {/* User inputs donation amount */}
      <input
        type="number"
        placeholder="Enter donation amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 text-black"
        min="1"
      />

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
