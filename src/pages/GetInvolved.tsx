import React, { useState, useEffect } from "react";
import { Heart, Send } from "lucide-react";
import toast from "react-hot-toast";
import Donate from "@/components/Donate";

import img from "../asset/r2a 1.jpg";
import imgs from "../asset/R2a 2.jpg";
import img1 from "../asset/R2A3.jpg";
import img2 from "../asset/R2A 4.jpg";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3",
      alt: "Mission work",
    },
    { url: img, alt: "Community outreach" },
    { url: imgs, alt: "Humanitarian aid" },
    { url: img1, alt: "Gospel sharing" },
    { url: img2, alt: "Community service" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] rounded-3xl overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>
          ))}
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-4">
              Get Involved
            </h1>
            <p className="text-md sm:text-xl">
              Join us in spreading the Gospel and making a difference in
              people's lives.
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? "bg-white w-4" : "bg-white/50"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Volunteer Form */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl sm:text-3xl font-bold">Volunteer</h2>
            </div>

            <form onSubmit={handleVolunteerSubmit} className="space-y-6">
              <input type="hidden" name="_subject" value="New Volunteer Application" />

              {[
                { label: "Name", name: "name", type: "text", placeholder: "Enter your full name" },
                { label: "Email", name: "email", type: "email", placeholder: "Enter your email address" },
                { label: "Phone", name: "phone", type: "tel", placeholder: "Enter your phone number" },
                { label: "Address", name: "address", type: "text", placeholder: "Enter your address" },
                { label: "State/Province", name: "state", type: "text", placeholder: "Enter your state/province" },
                { label: "Country", name: "country", type: "text", placeholder: "Enter your country" },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name as keyof typeof formData]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                    placeholder={placeholder}
                  />
                </div>
              ))}

              {/* Select Inputs */}
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
          <div>
            <Donate />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetInvolved;
