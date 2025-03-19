import { useEffect } from "react";

// Replace with your actual Stripe Payment Link base URL
const STRIPE_PAYMENT_LINK_BASE =
  "https://buy.stripe.com/test_3cscPkd9o3Eu9VKaEE";

const CheckoutPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const amountParam = urlParams.get("amount");

  const amount = amountParam ? Number(amountParam) : null;
  console.log("Amount from URL:", amount);

  useEffect(() => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Invalid amount! Redirecting to home...");
      window.location.href = "/";
    }
  }, [amount]);

  const handlePayment = () => {
    if (!amount) {
      alert("Invalid amount. Please try again.");
      return;
    }

    console.log(`Redirecting to Stripe with amount: ${amount}`);

    // Construct Stripe URL (Dynamic amount may not work)
    const stripeUrl = `${STRIPE_PAYMENT_LINK_BASE}`;
    window.location.href = stripeUrl;
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <h2 className="text-xl font-bold">Checkout</h2>
      <p>
        You are about to donate: <strong>₦{amount}</strong>
      </p>

      <button
        onClick={handlePayment}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Pay with Stripe
      </button>
    </div>
  );
};

export default CheckoutPage;
