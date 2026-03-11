import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import StatisticsCounter from "../components/StatisticsCounter";
import DailyQuote from "../components/DailyQuote";
import TopArticles from "../components/TopArticles";
import type { Statistics } from "../types";

import { motion } from "framer-motion";
import imageBank, { pastorbawa } from "@/asset/imageBank";

const Home = () => {
  const [statistics, setStatistics] = React.useState<Statistics | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const heroImages = imageBank.getAll();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const fetchStatistics = async () => {
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching statistics:", error);
      } else if (data) {
        setStatistics(data);
      }
    };

    fetchStatistics();
  }, []);

  const title = "From the Coordinator's Desk";
  const introduction = "Beloved,";
  const message = `
    Welcome on board, at Reachout To All, every soul matters to us because we know 
    each means a lot to God who made us all. Diverse people represent a variety of 
    needs ranging from salvation, medical care, welfare materials, and deliverance 
    among others. Love is a universal need for which humanity is a global language 
    used to meet these needs.
  `;
  const items = [
    {
      text: "We are a group of believers from diverse denominations, united by a passion for missions. Our aim is to reach out to people everywhere, enabling their salvation, rededication, commitment, rounded development, and discipleship, so that they may become effective tools in God's hands and have better lives. We achieve this by prayerfully seeking and visiting mission fields, partnering with organizations and agencies to make our deliverables possible.",
    },
    {
      text: "God continues to save souls in unprecedented ways, according to His divine agenda of ensuring that no life perishes and that all may be saved (2 Peter 3:9). We are both privileged witnesses and channels of this heaven-ordained move of God across various tribes and languages, rekindling the body of Christ with urgency towards fulfilling the Great Commission as a means to hasten His return (Matthew 24:14).",
    },
    {
      text: "We believe that God has ushered in a season of double harvest - a redoubling of efforts in soul-winning that has led to an increase in converts initially and, ultimately, disciples who populate God's kingdom.",
    },
    {
      text: "God's business remains mission work and so does ours, as we belong to Him. There can never be a second chance to harvest ripe souls. Among the things that will endure in heaven is the number of souls we have led to Jesus and touched positively.",
    },
  ];
  const closing = `
    You can join on board to touch lives in every means possible with your resources, talents,
    gifts, and other skill sets. We invite you to make a deliberate decision to Reach Out To All.
  `;
  const contact = [
    {
      label: "Email:",
      value:
        "reachouttoall@yahoo.com,   toallreachout@gmail.com,   info@reachouttoall.org",
    },

    { label: "Blog:", value: "https://bawagemmanuel.blogspot.com" },
  ];

  return (
    <div className="space-y-8 sm:space-y-16">
      {/* Hero Section with Image Carousel */}
      <section className="relative h-150 md:h-[79vh] overflow-hidden border border-white/20 shadow-2xl">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 rounded-xl  ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={"cover photo"}
              className="w-full h-full object-cover rounded"
            />
            <div className="absolute inset-0 bg-black opacity-30" />
          </div>
        ))}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white max-sm:mt-32.5">
            <motion.h4
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 max-sm:text-2xl bg-linear-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              Carrying the Gospel to the Ends of the Earth
            </motion.h4>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl mb-6 sm:mb-8 max-sm:hidden text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            >
              Welcome to Reachout To All. Here, every soul counts. We are on a
              mission to reach out to all people with the gospel, accompanied by
              a humanitarian touch of love.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/get-involved"
                className="inline-flex items-center bg-linear-to-r from-blue-600 via-blue-700 to-blue-400 dark:from-red-600 dark:via-red-700 dark:to-red-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 text-sm sm:text-base shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.6)] hover:scale-105"
              >
                Get Involved
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-white w-4 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Daily Quote Section */}
      <section className="container mx-auto px-4">
        <DailyQuote />
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 dark:text-red-400  mb-6 sm:mb-8">
          Our Impact
        </h2>
        <StatisticsCounter statistics={statistics || undefined} />
      </section>

      {/* Top Articles Section */}
      <section className="container mx-auto px-4">
        <TopArticles />
      </section>

      <div className="container mx-auto px-4 space-y-6">
        {/* Title */}
        <img src={pastorbawa} alt="" className="sm:w-75 sm:h-[300] mx-auto" />
        <h2 className="text-3xl sm:text-4xl font-bold dark:text-white text-center">{title}</h2>
        {/* Introduction */}
        <p className="text-lg sm:text-xl dark:text-gray-300">{introduction}</p>

        {/* Message */}
        <p className="text-lg sm:text-xl dark:text-gray-300">{message}</p>

        {/* List of Items */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <p key={index} className="text-lg sm:text-xl rounded-xl dark:text-gray-300">
              {item.text}
            </p>
          ))}
        </div>

        {/* Closing */}
        <p className="text-lg sm:text-xl dark:text-gray-300">{closing}</p>

        {/* Signature */}
        <div className="mt-6 text-lg sm:text-xl dark:text-gray-300">
          <p>On behalf of the Brethren,</p>
          <p className="font-bold">Bawa G. Emmanuel</p>
          <p>Coordinator, Reachout To All</p>
        </div>

        {/* Contact Info */}
        <div className="text-lg sm:text-xl space-y-2 dark:text-gray-300">
          {contact.map((item, index) => (
            <p key={index} className="wrap-break-word max-sm;gap-2">
              <strong>{item.label}</strong>{" "}
              {item.label === "Blog:" ? (
                <a
                  href={item.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-red-400 hover:underline break-all"
                >
                  {item.value}
                </a>
              ) : (
                <span className="">{item.value}</span>
              )}
            </p>
          ))}
        </div>
      </div>

      {/* Featured Sections */}
      <section className="container mx-auto px-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-shadow">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 dark:text-white">
              Upcoming Events
            </h3>
            <p className="mb-4 text-sm sm:text-base dark:text-gray-300">
              Join us in our upcoming mission activities and events.
            </p>
            <Link
              to="/events"
              className="text-blue-600 dark:text-red-400 hover:underline text-sm sm:text-base"
            >
              View Events →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-shadow">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 dark:text-white">
              Get Involved
            </h3>
            <p className="mb-4 text-sm sm:text-base dark:text-gray-300">
              Discover ways to contribute to our mission work.
            </p>
            <Link
              to="/get-involved"
              className="text-blue-600 dark:text-red-400 hover:underline text-sm sm:text-base"
            >
              Learn More →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-shadow">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 dark:text-white">
              Resources
            </h3>
            <p className="mb-4 text-sm sm:text-base dark:text-gray-300">
              Access sermons, podcasts, and other spiritual materials.
            </p>
            <Link
              to="/resources"
              className="text-blue-600 dark:text-red-400 hover:underline text-sm sm:text-base"
            >
              Browse Resources →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
