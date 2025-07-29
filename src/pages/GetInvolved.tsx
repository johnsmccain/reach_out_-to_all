import React, { useState } from "react";
import { Heart, Send } from "lucide-react";
import toast from "react-hot-toast";
import Donate from "@/components/Donate";

const VOLUNTEER_UNITS = ["Financial", "Prayer", "Others"];

const MEMBERSHIP_OPTIONS = ["Yes", "No"];

const SERVICE_UNITS = [
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
    address: "",
    state: "",
    country: "",
    volunteer: "",
    membership: "",
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
          address: "",
          state: "",
          country: "",
          volunteer: "",
          membership: "",
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
      <section className="relative h-[400px] rounded-xl">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3"
            alt="Volunteering"
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl"  />
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder="Enter your address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder="Enter your state/province"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder="Enter your country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volunteer Options
                </label>
                <select
                  name="volunteer"
                  value={formData.volunteer}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="">Select volunteer option</option>
                  {VOLUNTEER_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Membership
                </label>
                <select
                  name="membership"
                  value={formData.membership}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="">Are you a member?</option>
                  {MEMBERSHIP_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="">Select a unit</option>
                  {SERVICE_UNITS.map((unit) => (
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder="Tell us about your interests and experience"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? "Submitting..." : "Submit Application"}</span>
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Donation Section */}
          <Donate/>
        </div>
      </div>
    </div>
  );
};

export default GetInvolved;
