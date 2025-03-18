import React from "react";
import { Heart, CreditCard, Send } from "lucide-react";
import { supabase } from "../lib/supabase";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

import DonateButton from "./DonateButton";

const VOLUNTEER_UNITS = [
  "Prayer Unit",
  "Kitchen Unit",
  "Choir Unit",
  "Ushering Unit",
  "Children Unit",
  "Media Unit",
  "Welfare Unit",
  "Evangelism Unit",
  "Protocol Unit",
  "Technical Unit",
  "Medical Unit",
  "Transportation Unit",
  "Maintenance Unit",
];

const GetInvolved = () => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    unit: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVolunteerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, save to Supabase
      const { error: supabaseError } = await supabase
        .from("volunteers")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            unit: formData.unit,
            message: formData.message,
          },
        ]);

      if (supabaseError) throw supabaseError;

      // Then, send email notification
      await emailjs.send(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        {
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone,
          unit: formData.unit,
          message: formData.message,
        },
        import.meta.env.VITE_PUBLIC_KEY
      );

      toast.success("Thank you for volunteering! We will contact you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        unit: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error submitting volunteer form:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3"
            alt="Volunteering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">Get Involved</h1>
            <p className="text-xl">
              Join us in spreading the Gospel and making a difference in
              people's lives.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Volunteer Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Volunteer</h2>
            </div>
            <form onSubmit={handleVolunteerSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Unit
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a unit</option>
                  {VOLUNTEER_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about your interests and experience"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? "Submitting..." : "Submit Application"}</span>
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Donation Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Donate</h2>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-lg text-gray-600 mb-8">
                Support our mission work through your generous donations. Your
                contribution helps us reach more people with the Gospel message.
              </p>

              {/* Bank Account Details */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Bank Account Details</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Bank Name:</span> First Gospel
                    Bank
                  </p>
                  <p>
                    <span className="font-medium">Account Name:</span> Gospel
                    Mission
                  </p>
                  <p>
                    <span className="font-medium">Account Number:</span>{" "}
                    1234567890
                  </p>
                  <p>
                    <span className="font-medium">Sort Code:</span> 12-34-56
                  </p>
                </div>
              </div>

              {/* Online Payment Button */}
              <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                {/* <<span>Donate Online</span>> */}
                <DonateButton />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetInvolved;
