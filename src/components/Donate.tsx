import DonateButton from "@/pages/DonateButton";
import { CreditCard, Banknote } from "lucide-react";
import { useState } from "react";

const Donate = () => {
  const [paymentType, setPaymentType] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<number|any>();

  const isFormValid = email && amount > 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="h-8 w-8 text-blue-600" />
        <h2 className="text-3xl font-bold">Donate</h2>
      </div>

      {/* Toggle Payment Type */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setPaymentType(!paymentType)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          {paymentType ? (
            <>
              <CreditCard className="w-4 h-4" /> Use Card
            </>
          ) : (
            <>
              <Banknote className="w-4 h-4" /> Use Bank Transfer
            </>
          )}
        </button>
      </div>

      {paymentType ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-lg text-gray-600 mb-6">
            Support our mission work through your generous donations. Your
            contribution helps us reach more people with the Gospel message.
          </p>

          {/* Bank Account Details */}
          <div>
            <h3 className="text-xl font-bold mb-4">Bank Account Details</h3>
            <p className="mb-2">
              <strong>Bank Name:</strong> Zenith Bank
            </p>
            <p className="mb-2">
              <strong>Account Name:</strong> Reachout To All Ministry
              International
            </p>
            <p>
              <strong>Account Number:</strong> 1220446780
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-lg text-gray-600 mb-6">
            Use your card or digital wallet to make a secure donation.
          </p>

          {/* Donation Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isFormValid) return;
              // You may handle custom logic here
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₦)
              </label>
              <input
                type="number"
                required
                min={100}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
            </div>

            {/* DonateButton gets rendered only when form is valid */}
            <div>
              <DonateButton email={email} amount={amount} disabled={!isFormValid} />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Donate;
