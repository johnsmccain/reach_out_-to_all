import React, { useState } from "react";
import { Heart, CreditCard, Send } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
      const response = await fetch("https://formspree.io/f/mdkekqwg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Thank you for volunteering! We will contact you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          unit: "",
          message: "",
        });
      } else {
        toast.error("Error submitting the form. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please check your internet connection.");
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
              <input
                type="hidden"
                name="_subject"
                value="New Volunteer Application"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Tell us about your interests and experience"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 disabled:opacity-50"
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
                <p>
                  <strong>Bank Name:</strong> First Gospel Bank
                </p>
                <p>
                  <strong>Account Name:</strong> Gospel Mission
                </p>
                <p>
                  <strong>Account Number:</strong> 1234567890
                </p>
                <p>
                  <strong>Sort Code:</strong> 12-34-56
                </p>
              </div>

              {/* Online Payment Button */}
              <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
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
