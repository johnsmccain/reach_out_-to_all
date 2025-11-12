import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import StatisticsCounter from "../components/StatisticsCounter";
import DailyQuote from "../components/DailyQuote";
import TopArticles from "../components/TopArticles";
import type { Statistics } from "../types";
import img from "../asset/image1.jpg";
import imgs from "../asset/image22.jpg";
import img1 from "../asset/image23.jpg";
import img2 from "../asset/image222.jpg";
import img3 from "../asset/img3.jpeg"
import img4 from "../asset/img4.jpeg"
import img5 from "../asset/img5.jpeg"
import img6 from "../asset/img6.jpeg"
import img7 from "../asset/img7.jpeg"
import img8 from "../asset/img8.jpeg"
import img9 from "../asset/img9.jpeg"
import img10 from "../asset/img10.jpeg"
import img11 from "../asset/img11.jpeg"
import img_1 from "../asset/img-1.jpg";
import img_2 from "../asset/img-2.jpg";
import img_3 from "../asset/img-3.jpg";
import img_4 from "../asset/img-4.jpg";
import img_5 from "../asset/img-5.jpg";
import img_6 from "../asset/img-6.jpg";
import img_7 from "../asset/img-7.jpg";
import img_8 from "../asset/img-8.jpg";
import img_9 from "../asset/img-9.jpg";
import img_10 from "../asset/img-10.jpg";
import img_11 from "../asset/img-11.jpg";
import img_12 from "../asset/img-12.jpg";
import img_13 from "../asset/img-13.jpg";
import img_14 from "../asset/img-14.jpg";
import img_15 from "../asset/img-15.jpg";
import img_16 from "../asset/img-16.jpg";
import img_17 from "../asset/img-17.jpg";
import img_18 from "../asset/img-18.jpg";
import img_19 from "../asset/img-19.jpg";
import img_20 from "../asset/img-20.jpg";
import img_21 from "../asset/img-21.jpg";
import img_22 from "../asset/img-22.jpg";
import img_23 from "../asset/img-23.jpg";
import img_24 from "../asset/img-24.jpg";
import img_25 from "../asset/img-25.jpg";
import img_26 from "../asset/img-26.jpg";
import img_27 from "../asset/img-27.jpg";
import img_28 from "../asset/img-28.jpg";
import img_29 from "../asset/img-29.jpg";
import img_30 from "../asset/img-30.jpg";
import img_31 from "../asset/img-31.jpg";
import img_32 from "../asset/img-32.jpg";
import img_33 from "../asset/img-33.jpg";
import img_34 from "../asset/img-34.jpg";
import img_35 from "../asset/img-35.jpg";
import img_36 from "../asset/img-36.jpg";
import img_37 from "../asset/img-37.jpg";
import img_38 from "../asset/img-38.jpg";
import img_39 from "../asset/img-39.jpg";
import img_40 from "../asset/img-40.jpg";
import img_41 from "../asset/img-41.jpg";
import img_42 from "../asset/img-42.jpg";
import img_43 from "../asset/img-43.jpg";
import img_44 from "../asset/img-44.jpg";
import img_45 from "../asset/img-45.jpg";
import img_46 from "../asset/img-46.jpg";
import img_47 from "../asset/img-47.jpg";
import img_48 from "../asset/img-48.jpg";
import img_49 from "../asset/img-49.jpg";
import img_50 from "../asset/img-50.jpg";
import img_51 from "../asset/img-51.jpg";
import img_52 from "../asset/img-52.jpg";
import img_53 from "../asset/img-53.jpg";
import img_54 from "../asset/img-54.jpg";
import img_55 from "../asset/img-55.jpg";
import img_56 from "../asset/img-56.jpg";
import img_57 from "../asset/img-57.jpg";
import img_58 from "../asset/img-58.jpg";
import img_59 from "../asset/img-59.jpg";
import img_60 from "../asset/img-60.jpg";
import img_61 from "../asset/img-61.jpg";
import img_62 from "../asset/img-62.jpg";
import img_63 from "../asset/img-63.jpg";
import img_64 from "../asset/img-64.jpg";
import img_65 from "../asset/img-65.jpg";

import bawa from "@/asset/pastorbawa.png"
import {motion} from "framer-motion" 




const Home = () => {
  const [statistics, setStatistics] = React.useState<Statistics | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);


  const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3",
    alt: "Mission work",
  },
  {
    url: img,
    alt: "Community outreach",
  },
  {
    url: imgs,
    alt: "Humanitarian aid",
  },
  {
    url: img1,
    alt: "Gospel sharing",
  },
  {
    url: img2,
    alt: "Gospel sharing",
  },
  {
    url: img3,
    alt: "Gospel sharing",
  },
  {
    url: img4,
    alt: "Gospel sharing",
  },
  {
    url: img5,
    alt: "Gospel sharing",
  },
  {
    url: img6,
    alt: "Gospel sharing",
  },
  {
    url: img7,
    alt: "Gospel sharing",
  },
  {
    url: img8,
    alt: "Gospel sharing",
  },
  {
    url: img9,
    alt: "Gospel sharing",
  },
  {
    url: img10,
    alt: "Gospel sharing",
  },
  {
    url: img11,
    alt: "Gospel sharing",
  },

  // Imported local images
  { url: img_1, alt: "Mission work" },
  { url: img_2, alt: "Mission work" },
  { url: img_3, alt: "Mission work" },
  { url: img_4, alt: "Mission work" },
  { url: img_5, alt: "Mission work" },
  { url: img_6, alt: "Mission work" },
  { url: img_7, alt: "Mission work" },
  { url: img_8, alt: "Mission work" },
  { url: img_9, alt: "Mission work" },
  { url: img_10, alt: "Mission work" },
  { url: img_11, alt: "Mission work" },
  { url: img_12, alt: "Mission work" },
  { url: img_13, alt: "Mission work" },
  { url: img_14, alt: "Mission work" },
  { url: img_15, alt: "Mission work" },
  { url: img_16, alt: "Mission work" },
  { url: img_17, alt: "Mission work" },
  { url: img_18, alt: "Mission work" },
  { url: img_19, alt: "Mission work" },
  { url: img_20, alt: "Mission work" },
  { url: img_21, alt: "Mission work" },
  { url: img_22, alt: "Mission work" },
  { url: img_23, alt: "Mission work" },
  { url: img_24, alt: "Mission work" },
  { url: img_25, alt: "Mission work" },
  { url: img_26, alt: "Mission work" },
  { url: img_27, alt: "Mission work" },
  { url: img_28, alt: "Mission work" },
  { url: img_29, alt: "Mission work" },
  { url: img_30, alt: "Mission work" },
  { url: img_31, alt: "Mission work" },
  { url: img_32, alt: "Mission work" },
  { url: img_33, alt: "Mission work" },
  { url: img_34, alt: "Mission work" },
  { url: img_35, alt: "Mission work" },
  { url: img_36, alt: "Mission work" },
  { url: img_37, alt: "Mission work" },
  { url: img_38, alt: "Mission work" },
  { url: img_39, alt: "Mission work" },
  { url: img_40, alt: "Mission work" },
  { url: img_41, alt: "Mission work" },
  { url: img_42, alt: "Mission work" },
  { url: img_43, alt: "Mission work" },
  { url: img_44, alt: "Mission work" },
  { url: img_45, alt: "Mission work" },
  { url: img_46, alt: "Mission work" },
  { url: img_47, alt: "Mission work" },
  { url: img_48, alt: "Mission work" },
  { url: img_49, alt: "Mission work" },
  { url: img_50, alt: "Mission work" },
  { url: img_51, alt: "Mission work" },
  { url: img_52, alt: "Mission work" },
  { url: img_53, alt: "Mission work" },
  { url: img_54, alt: "Mission work" },
  { url: img_55, alt: "Mission work" },
  { url: img_56, alt: "Mission work" },
  { url: img_57, alt: "Mission work" },
  { url: img_58, alt: "Mission work" },
  { url: img_59, alt: "Mission work" },
  { url: img_60, alt: "Mission work" },
  { url: img_61, alt: "Mission work" },
  { url: img_62, alt: "Mission work" },
  { url: img_63, alt: "Mission work" },
  { url: img_64, alt: "Mission work" },
  { url: img_65, alt: "Mission work" },
];


  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
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
      text: "We believe that God has ushered in a season of double harvest – a redoubling of efforts in soul-winning that has led to an increase in converts initially and, ultimately, disciples who populate God's kingdom.",
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
    { label: "Email:", value: "reachouttoall@yahoo.com,   toallreachout@gmail.com,   info@reachouttoall.org"},
    
    { label: "Blog:", value: "https://bawagemmanuel.blogspot.com" },
  ];

  return (
    <div className="space-y-8 sm:space-y-16">
      {/* Hero Section with Image Carousel */}
      <section className="relative h-[400px] sm:h-[600px] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 rounded-xl  ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-10" />
          </div>
        ))}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white max-sm:mt-[130px]">
            <motion.h4 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 max-sm:text-2xl bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
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
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 text-sm sm:text-base shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.6)] hover:scale-105"
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
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-900 mb-6 sm:mb-8">
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
        <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
<img src={bawa} alt="" className="sm:w-[300px] sm:h-[300]"/>
        {/* Introduction */}
        <p className="text-lg sm:text-xl">{introduction}</p>

        {/* Message */}
        <p className="text-lg sm:text-xl">{message}</p>

        {/* List of Items */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <p key={index} className="text-lg sm:text-xl rounded-xl">
              {item.text}
            </p>
          ))}
        </div>

        {/* Closing */}
        <p className="text-lg sm:text-xl">{closing}</p>

        {/* Signature */}
        <div className="mt-6 text-lg sm:text-xl">
          <p>On behalf of the Brethren,</p>
          <p className="font-bold">Bawa G. Emmanuel</p>
          <p>Coordinator, Reachout To All</p>
        </div>

        {/* Contact Info */}
        <div className="text-lg sm:text-xl space-y-2">
          {contact.map((item, index) => (
            <p key={index} className="break-words max-sm;gap-2">
              <strong>{item.label}</strong>{" "}
              {item.label === "Blog:" ? (
                <a
                  href={item.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
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
      <section className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Upcoming Events
            </h3>
            <p className="mb-4 text-sm sm:text-base">
              Join us in our upcoming mission activities and events.
            </p>
            <Link
              to="/events"
              className="text-blue-600 hover:underline text-sm sm:text-base"
            >
              View Events →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Get Involved
            </h3>
            <p className="mb-4 text-sm sm:text-base">
              Discover ways to contribute to our mission work.
            </p>
            <Link
              to="/get-involved"
              className="text-blue-600 hover:underline text-sm sm:text-base"
            >
              Learn More →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Resources
            </h3>
            <p className="mb-4 text-sm sm:text-base">
              Access sermons, podcasts, and other spiritual materials.
            </p>
            <Link
              to="/resources"
              className="text-blue-600 hover:underline text-sm sm:text-base"
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
