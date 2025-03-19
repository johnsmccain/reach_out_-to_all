import { useState } from "react";
import image from "@/asset/pastorbawa.png";
import { ChevronDown } from "lucide-react";

const About = () => {
  const [activeTab, setActiveTab] = useState("story");

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3"
            alt="Mission team"
            className="w-full h-full object-cover transform scale-105 animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-7xl font-bold mb-8 text-white animate-fade-in">
              About Us
            </h1>
            <p className="text-xl leading-relaxed text-white/90 font-light animate-slide-up">
              We are a group of believers from diverse denominations, united by
              a passion for missions. We aim to reach out to people everywhere,
              enabling their salvation, rededication, commitment, and
              discipleship.
            </p>
            <div className="mt-8 animate-bounce-slow">
              <ChevronDown className="w-8 h-8 text-white/70" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4 mb-8 border-b border-gray-200 justify-center items-center">
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
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold mb-6 text-blue-900">
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
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold mb-6 text-blue-900">
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
                <div className="lg:w-1/3 relative">
                  <div className="sticky top-0 pt-[150%]">
                    <img
                      src={image}
                      alt="Pastor Bawa G. Emmanuel"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="lg:w-2/3 p-8 lg:p-12">
                  <h3 className="text-3xl font-bold text-blue-900 mb-2">
                    Bawa G. Emmanuel
                  </h3>
                  <p className="text-xl text-blue-600 mb-8">
                    Coordinator/President
                  </p>
                  <div className="prose prose-lg text-gray-700">
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
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-blue-900">
              What We Believe
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              We believe that all people deserve to be reached with the gospel
              alongside humanitarian services for their rounded development.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-blue-900">Call to Action</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              You can get involved in reaching out to lives using your skills,
              talents, and resources.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 max-w-4xl mb-16">
        <h2 className="text-4xl font-bold text-blue-900 mb-8 text-center">
          Our Team
        </h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  role: "Secretary-Administration",
                  name: "Japhet Chucks Jonathan",
                },
                { role: "Secretary-Operations", name: "Obed Marcus Minna" },
                { role: "Treasurer", name: "Alheri Ali" },
                { role: "Abuja Field Missionary", name: "Nathan S. Galadima" },
                { role: "Ondo Field Missionary", name: "Victor O. Enenche" },
              ].map((member, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  <td className="px-8 py-6 font-semibold text-blue-900 group-hover:text-blue-700">
                    {member.role}
                  </td>
                  <td className="px-8 py-6 text-gray-700 group-hover:text-gray-900">
                    {member.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default About;
