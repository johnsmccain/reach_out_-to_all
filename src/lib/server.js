import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Debug: Check if environment variables are loaded
console.log("🔹 Loaded ENV Variables:");
console.log({
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? " Loaded" : " Not Found",
  CLIENT_URL: process.env.CLIENT_URL || "https://r2a.netlify.app",
});

// Ensure essential environment variables exist
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("ERROR: Missing STRIPE_SECRET_KEY in .env file.");
}

// Initialize Express and Stripe
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "https://r2a.netlify.app",
      "http://localhost:5000",
    ],
    methods: ["POST", "GET", "OPTIONS"], // Added OPTIONS
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Root Route (Fix for "Not Found" Issue)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the R2A Payment API 🚀",
    status: "running",
  });
});

// ✅ Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ Create Stripe Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, email } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      console.error("❌ Invalid donation amount:", amount);
      return res.status(400).json({ error: "Invalid donation amount" });
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error("❌ Invalid email:", email);
      return res.status(400).json({ error: "Invalid email address" });
    }

    console.log(`🔹 Received donation amount: NGN ${amount} from ${email}`);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "ngn",
            product_data: {
              name: "Donation",
              description: "Support our mission",
            },
            unit_amount: Math.round(amount * 100), // Convert to kobo
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${
        process.env.CLIENT_URL || "https://r2a.netlify.app"
      }/get-involved?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.CLIENT_URL || "https://r2a.netlify.app"
      }/get-involved?payment=cancelled`,
    });

    console.log("✅ Stripe Checkout Session Created:", session.id);
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(500).json({
      error: "An error occurred while processing payment",
      details: error.message,
    });
  }
});
