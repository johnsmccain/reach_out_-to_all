import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import image from "@/asset/reachout.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Articles", path: "/articles" },
    { name: "Sermons", path: "/sermons" },
    { name: "Events", path: "/events" },
    { name: "Get Involved", path: "/get-involved" },
    { name: "Resources", path: "/resources" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-2 lg:px-3">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group relative z-10">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src={image}
                  alt="Reachout To All"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-cyan-500 transition-all duration-300">
                  Reachout To All
                </span>
                <span className="text-xs text-gray-500 font-medium">Every Soul Matters</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 group"
                >
                  <span
                    className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
                      isActive(item.path)
                        ? "text-blue-600"
                        : "text-gray-700 group-hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isActive(item.path) && (
                    <div className="absolute inset-0 bg-linear-to-r from-blue-50/0 to-purple-50/0 group-hover:from-blue-50 group-hover:to-purple-50 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                to="/registration"
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="relative px-5 py-2.5 text-sm font-medium text-white rounded-full overflow-hidden group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-400 blur-xl"></div>
                </div>
                <span className="relative z-10">Admin</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-40 lg:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Navigation Links */}
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                          isActive(item.path)
                            ? "bg-linear-to-r from-blue-50 to-purple-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/registration"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center text-base font-medium text-gray-700 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                  >
                    Register for Event
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center text-base font-medium text-white bg-linear-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;