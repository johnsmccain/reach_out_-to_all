import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";

// Manually load .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Debugging: Check if environment variables are loaded
console.log("Loaded ENV Variables:", {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "Loaded " : " Not Found",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
});

// Verify essential environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ ERROR: Missing STRIPE_SECRET_KEY in .env file.");
}

// Initialize Express and Stripe
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(helmet());

// Route to create Stripe checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid donation amount" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ngn",
            product_data: {
              name: "Donation",
              description: "Support our mission",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/get-involved`,
      cancel_url: `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/get-involved`,
    });

    console.log(" Stripe Checkout Session Created:", session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(500).json({
      error: "An error occurred while processing payment",
      details: error.message,
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
