import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Ensure essential environment variables exist
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("ERROR: Missing STRIPE_SECRET_KEY in .env file.");
}

// Updated to your domain
const CLIENT_URL = "https://r2a.netlify.app";

// Middleware
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL, // Updated frontend domain
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
  })
);

//  Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Stripe Payment API ",
    status: "running",
  });
});

//  Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

//  Create Stripe Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid donation amount" });
    }

    console.log(`🔹 Creating Stripe session for NGN ${amount}`);

    // Create Stripe checkout session
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
            unit_amount: Math.round(amount * 100), // Convert to kobo
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${CLIENT_URL}/get-involved?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/get-involved?payment=cancelled`,
    });

    console.log(" Stripe Checkout Session Created:", session.id);
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error(" Stripe error:", error);
    res.status(500).json({
      error: "An error occurred while processing payment",
      details: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
