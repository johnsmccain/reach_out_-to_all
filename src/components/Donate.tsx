import DonateButton from "@/pages/DonateButton";
import { CreditCard, Banknote, Bitcoin } from "lucide-react";
import { useState } from "react";
import Depay from "./Depay";
const supportedCryptoDonations = [
  {
    label: "USDC (Base)",
    token: "USDC",
  },
  {
    label: "USDT (BNB Chain)",
    token: "USDT",
  },
  {
    label: "USDC (Avalanche)",
    token: "USDC",
  },
  {
    label: "USDT (Optimism)",
    token: "USDT",
  },
  {
    label: "USDT (Polygon)",
    token: "USDT",
  },
  {
    label: "USDT (Arbitrum)",
    token: "USDT",
  },
  {
    label: "USDT (Ethereum)",
    token: "USDT",
  },
];

const Donate = () => {
  const [paymentType, setPaymentType] = useState<"card" | "bank" | "crypto">(
    "bank"
  );
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<number | any>();

  const isFormValid = email && amount > 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="h-8 w-8 text-blue-600" />
        <h2 className="text-3xl font-bold">Donate</h2>
      </div>

      {/* Payment Type Switcher */}
      <div className="flex gap-3 justify-center mb-6">
        <button
          onClick={() => setPaymentType("bank")}
          className={`flex items-center gap-2 px-4 py-2 border rounded-full ${
            paymentType === "bank"
              ? "bg-blue-600 text-white"
              : "text-blue-600 border-blue-600 hover:bg-blue-50"
          }`}
        >
          <Banknote className="w-4 h-4" />
          Bank Transfer
        </button>
        <button
          onClick={() => setPaymentType("card")}
          className={`flex items-center gap-2 px-4 py-2 border rounded-full ${
            paymentType === "card"
              ? "bg-green-600 text-white"
              : "text-green-600 border-green-600 hover:bg-green-50"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Card
        </button>
        <button
          onClick={() => setPaymentType("crypto")}
          className={`flex items-center gap-2 px-4 py-2 border rounded-full ${
            paymentType === "crypto"
              ? "bg-yellow-600 text-white"
              : "text-yellow-600 border-yellow-600 hover:bg-yellow-50"
          }`}
        >
          <Bitcoin className="w-4 h-4" />
          Crypto
        </button>
      </div>

      {/* Render Sections */}
      {paymentType === "bank" ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-lg text-gray-600 mb-6">
            Support our mission work through your generous donations. Your
            contribution helps us reach more people with the Gospel message.
          </p>
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
      ) : paymentType === "card" ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-lg text-gray-600 mb-6">
            Use your card or digital wallet to make a secure donation.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isFormValid) return;
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

            <DonateButton
              email={email}
              amount={amount}
              disabled={!isFormValid}
            />
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-lg text-gray-600 mb-6">
            Send crypto donations securely using your wallet. We currently
            accept 
            {supportedCryptoDonations.map(({ label }: any, idx) => (
              <div key={idx} className="rounded-full inline-block m-1 p-1 bg-green-100 text-sm">
                <span >{label}</span>
              </div>
            ))}
          </div>
          <Depay />
        </div>
      )}
    </div>
  );
};

export default Donate;
