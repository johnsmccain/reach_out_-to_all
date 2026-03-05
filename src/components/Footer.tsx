import { Link } from "react-router-dom";
import { Facebook, Youtube, Mail, Phone, MapPin, Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import image from "@/asset/reachout.jpeg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "Articles", path: "/articles" },
    { name: "Get Involved", path: "/get-involved" },
    { name: "Resources", path: "/resources" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/profile.php?id=100064950391474",
      color: "hover:text-blue-500",
      bgColor: "hover:bg-blue-500/10",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://m.youtube.com/@reachout2all",
      color: "hover:text-red-500",
      bgColor: "hover:bg-red-500/10",
    },
  ];

  return (
    <footer className="relative bg-linear-to-br mt-20 from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-900 via-purple-900 to-cyan-900"></div>

      <div className="container mx-auto px-2 sm:px-3 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-900 via-purple-900 to-cyan-900 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <img
                  src={image}
                  alt="Reachout To All"
                  className="relative h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">Reachout To All</span>
                <span className="text-xs text-gray-300">Every Soul Matters</span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              We are on a mission to reach out to all people with the gospel,
              accompanied by a humanitarian touch of love.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Heart className="h-4 w-4 text-red-400" />
              <span>Making a difference, one soul at a time</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-linear-to-r from-blue-900 to-purple-900"></div>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center text-gray-300 hover:text-white transition-all duration-300"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-linear-to-r from-blue-900 to-purple-900 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Contact Us
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-linear-to-r from-blue-900 to-purple-900"></div>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <Mail className="h-5 w-5 text-blue-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="text-sm">
                  <a
                    href="mailto:info@reachouttoall.org"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    info@reachouttoall.org
                  </a>
                  <a
                    href="mailto:toallreachout@gmail.com"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    toallreachout@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <Phone className="h-5 w-5 text-blue-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="text-sm">
                  <a
                    href="tel:+2347037043343"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    +234 703 704 3343
                  </a>
                  <a
                    href="tel:+2348123605848"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    +234 812 360 5848
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-gray-300 leading-relaxed">
                  Suite 5, Victory Plaza, Opposite Concord Garden, Adjacent
                  U/Boro New Market, Sabon Tasha, Kaduna State, Nigeria.
                </p>
              </li>
            </ul>
          </motion.div>

          {/* Social Media & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Connect With Us
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-linear-to-r from-blue-900 to-purple-900"></div>
            </h3>
            <div className="flex space-x-3 mb-8">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 ${social.color} ${social.bgColor} transition-all duration-300 group`}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-300">Stay updated with our mission</p>
              <Link
                to="/get-involved"
                className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-sm font-medium transition-all duration-300 group"
              >
                Get Involved
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 text-center md:text-left">
              &copy; {currentYear} Reach Out To All. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link to="/about" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/about" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;