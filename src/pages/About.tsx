import React, { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import image from "@/asset/pastorbawa.png";
import img from "../asset/r2a 1.jpg";
import imgs from "../asset/R2a 2.jpg";
import img1 from "../asset/R2A3.jpg";
import img2 from "../asset/R2A 4.jpg";

const About = () => {
  const [activeTab, setActiveTab] = useState("story");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  ];

  React.useEffect(() => {
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
      <section className="relative h-[400px] md:h-[500px] overflow-hidden rounded-3xl">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 rounded-xl ${
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
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-8 text-white animate-fade-in max-sm:hidden">
              About Us
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-white/90 font-light animate-slide-up max-sm:hidden">
              We are a group of believers from diverse denominations, united by
              a passion for missions. We aim to reach out to people everywhere,
              enabling their salvation, rededication, commitment, and
              discipleship.
            </p>
            <div className="mt-8 animate-bounce-slow hidden md:block">
              <ChevronDown className="w-8 h-8 text-white/70" />
            </div>
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

      {/* Mobile Tab Menu */}
      <div className="md:hidden px-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-md"
        >
          <span className="font-semibold">
            {
              [
                { id: "story", label: "Our Story" },
                { id: "mission", label: "Mission & Vision" },
                { id: "leadership", label: "Leadership" },
              ].find((tab) => tab.id === activeTab)?.label
            }
          </span>
          <Menu className="h-5 w-5" />
        </button>
        {isMenuOpen && (
          <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
            {[
              { id: "story", label: "Our Story" },
              { id: "mission", label: "Mission & Vision" },
              { id: "leadership", label: "Leadership" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full p-4 text-left rounded-xl ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Tabs */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Desktop Tab Navigation */}
          <div className="hidden md:flex space-x-4 mb-8 border-b border-gray-200 items-center justify-center">
            {[
              { id: "story", label: "Our Story" },
              { id: "mission", label: "Mission & Vision" },
              { id: "leadership", label: "Leadership" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 font-semibold text-lg transition-colors relative ${
                  activeTab === tab.id
                    ? "text-blue-900"
                    : "text-gray-500 hover:text-blue-900"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-900" />
                )}
              </button>
            ))}
          </div>

          {/* Story Section */}
          <div
            className={`space-y-8 transition-opacity duration-300 ${
              activeTab === "story" ? "block opacity-100" : "hidden opacity-0"
            }`}
          >
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-xl font-semibold text-blue-900 mb-6">
                All praise and glory be to God Almighty, to whom we belong, for
                granting us the privilege of working alongside Him in reaching
                out to souls.
              </p>
              <p>
                We are a group of believers from various denominations, united
                by a passion for missions. Our sole aim is to reach out to souls
                wherever they may be, enabling their salvation, rededication,
                commitment, and discipleship, transforming them into effective
                tools in God's hands.
              </p>
              <p>
                To achieve this, we prayerfully seek and visit a mission field
                each Christmas period. The local mission agency or umbrella
                organization serves as our host. Since 2012, we have been
                privileged to visit several mission fields across various states
                in Nigeria. However, our initial mission efforts, born out of a
                strong passion for soul-winning, began at Kagoro Mountains in
                2007.
              </p>
              <p>
                Ultimately, we rely on God's provision and leverage our
                individual commitments, as well as the support of like-minded
                individuals, groups, and organizations to fund our missions. We
                present the Gospel message in accordance with the Bible and
                entrust new converts to the care of local missionaries and
                pastors for follow-up and discipleship.
              </p>
            </div>
          </div>

          {/* Mission & Vision Section */}
          <div
            className={`space-y-8 transition-opacity duration-300 ${
              activeTab === "mission" ? "block opacity-100" : "hidden opacity-0"
            }`}
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-blue-900">
                  Our Foundation
                </h3>
                <ul className="space-y-6">
                  <li className="flex flex-col">
                    <span className="text-lg font-semibold text-blue-900">
                      Motto
                    </span>
                    <span className="text-gray-700 mt-2">
                      Every soul counts.
                    </span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-lg font-semibold text-blue-900">
                      Mandate
                    </span>
                    <span className="text-gray-700 mt-2">
                      To reawaken the body of Christ to the Great Commission.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-blue-900">
                  Our Purpose
                </h3>
                <ul className="space-y-6">
                  <li className="flex flex-col">
                    <span className="text-lg font-semibold text-blue-900">
                      Goal
                    </span>
                    <span className="text-gray-700 mt-2">
                      To preach the Gospel simply, presenting Christ crucified
                      for salvation.
                    </span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-lg font-semibold text-blue-900">
                      Mission
                    </span>
                    <span className="text-gray-700 mt-2">
                      To reach all people with the Gospel and empower their
                      holistic development.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Leadership Section */}
          <div
            className={`space-y-8 transition-opacity duration-300 ${
              activeTab === "leadership"
                ? "block opacity-100"
                : "hidden opacity-0"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3">
                  <div className="relative pt-[100%] lg:pt-[150%]">
                    <img
                      src={image}
                      alt="Pastor Bawa G. Emmanuel"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="lg:w-2/3 p-6 md:p-8 lg:p-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
                    Bawa G. Emmanuel
                  </h3>
                  <p className="text-lg md:text-xl text-blue-600 mb-6 md:mb-8">
                    Coordinator/President
                  </p>
                  <div className="prose prose-base md:prose-lg text-gray-700">
                    <p>
                      Bawa G. Emmanuel has an apostolic and evangelistic
                      mandate, serving as a spiritual midwife to bring about the
                      revival that is upon the church by upholding the truth of
                      God's Word and reawakening the body of Christ to the Great
                      Commission – missions.
                    </p>
                    <p>
                      As President of Reachout To All, a non-denominational
                      ministry, his aim is to reach souls across the nations
                      with the Gospel, accompanied by a humanitarian touch of
                      love.
                    </p>
                    <p>
                      Academically trained as a microbiologist and environmental
                      scientist, Bawa G. Emmanuel holds a Master's degree in
                      Environmental Management. He is also a radio evangelist
                      and preacher of God's Word, serving the body of Christ
                      across the board.
                    </p>
                    <p>
                      Bawa G. Emmanuel is married to Funmilola, his lovely wife,
                      and they have two children, Agmada and Shekwolo. The
                      family is based in Kaduna, Nigeria.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Chapters */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">
                Regional Chapters
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-blue-900">
                    Lagos Reachout to All
                  </h4>
                  <p className="text-gray-700">
                    Our vibrant Lagos chapter, reaching the bustling metropolis
                    with the Gospel.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-blue-900">
                    Kano Reachout to All
                  </h4>
                  <p className="text-gray-700">
                    Serving and ministering to communities in Northern Nigeria.
                  </p>
                </div>
              </div>
            </div>

            {/* Leadership Structure */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">
                Leadership Structure
              </h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-blue-900">
                    Coordinator
                  </h4>
                  <p className="text-gray-700">
                    Overseeing all ministry operations and providing strategic
                    direction.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-blue-900">
                    Central Planning Committee (CPC)
                  </h4>
                  <p className="text-gray-700">
                    A dedicated team responsible for planning and executing
                    ministry initiatives, events, and outreach programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              What We Believe
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              We believe that all people deserve to be reached with the gospel
              alongside humanitarian services for their rounded development.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              Call to Action
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              You can get involved in reaching out to lives using your skills,
              talents, and resources.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 max-w-4xl mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
          Our Team
        </h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    role: "Secretary-Administration",
                    name: "Japhet Chucks Jonathan",
                  },
                  { role: "Secretary-Operations", name: "Obed Marcus Minna" },
                  { role: "Treasurer", name: "Alheri Ali" },
                  {
                    role: "Abuja Field Missionary",
                    name: "Nathan S. Galadima",
                  },
                  { role: "Ondo Field Missionary", name: "Victor O. Enenche" },
                  {role: "Lagos Field Missionary ", name: "Olumide C. Jolaiya"},
                  {role: "Kano Field Missionary ", name: "Hamman Adamu"},
                  
                ].map((member, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="px-4 md:px-8 py-4 md:py-6 font-semibold text-blue-900 group-hover:text-blue-700">
                      {member.role}
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-gray-700 group-hover:text-gray-900">
                      {member.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
