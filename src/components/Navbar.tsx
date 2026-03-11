import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import image from "@/asset/reachout.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false);
  const [mobileContentOpen, setMobileContentOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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
    { name: "Events", path: "/events" },
    { name: "Get Involved", path: "/get-involved" },
    { name: "Contact", path: "/contact" },
  ];

  const contentItems = [
    { name: "Sermons", path: "/sermons" },
    { name: "Articles", path: "/articles" },
    { name: "Resources", path: "/resources" },
  ];

  const chapterItems = [
    { name: "Abuja", path: "/chapters?chapter=abuja" },
    { name: "Lagos", path: "/chapters?chapter=lagos" },
    { name: "Ondo", path: "/chapters?chapter=ondo" },
    { name: "Kwara", path: "/chapters?chapter=kwara" },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const isContentActive = () => contentItems.some(item => isActive(item.path));
  const isChaptersActive = () => location.pathname === "/chapters";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? " backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "backdrop-blur-sm"
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
                <span className="font-bold text-xl bg-linear-to-r from-blue-700 via-blue-600 to-blue-500   dark:from-red-700 dark:via-red-600 dark:to-red-500    bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-cyan-500 transition-all duration-300">
                  Reachout To All
                </span>
                <span className="text-xs text-gray-500 font-medium">Every Soul Counts</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 group "
                >
                  <span
                    className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
                      isActive(item.path)
                        ? "text-blue-600 dark:text-red-600"
                        : "text-gray-700 group-hover:text-blue-600 dark:text-gray-300 dark:hover:text-gray-600 dark:text-gray-100"
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
              
              {/* Content Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setContentDropdownOpen(true)}
                onMouseLeave={() => setContentDropdownOpen(false)}
              >
                <button
                  className="relative px-4 py-2 group flex items-center space-x-1"
                >
                  <span
                    className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
                      isContentActive()
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }`}
                  >
                    Content
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-300 ${
                      contentDropdownOpen ? "rotate-180" : ""
                    } ${isContentActive() ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"}`}
                  />
                  {isContentActive() && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isContentActive() && (
                    <div className="absolute inset-0 bg-linear-to-r from-blue-50/0 to-purple-50/0 group-hover:from-blue-50 group-hover:to-purple-50 dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  )}
                </button>
                
                <AnimatePresence>
                  {contentDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      {contentItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                            isActive(item.path)
                              ? "bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chapters Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setMobileContentOpen(true)}
                onMouseLeave={() => setMobileContentOpen(false)}
              >
                <button
                  className="relative px-4 py-2 group flex items-center space-x-1"
                >
                  <span
                    className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
                      isChaptersActive()
                        ? "text-blue-600 dark:text-red-400"
                        : "text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-red-400"
                    }`}
                  >
                    Chapters
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-300 ${
                      mobileContentOpen ? "rotate-180" : ""
                    } ${isChaptersActive() ? "text-blue-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-red-400"}`}
                  />
                  {isChaptersActive() && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isChaptersActive() && (
                    <div className="absolute inset-0 bg-linear-to-r from-blue-50/0 to-purple-50/0 group-hover:from-blue-50 group-hover:to-purple-50 dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  )}
                </button>
                
                <AnimatePresence>
                  {mobileContentOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <Link
                        to="/chapters"
                        className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                          isChaptersActive()
                            ? "bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-red-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        View All Chapters
                      </Link>
                      {chapterItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                aria-label="Toggle dark mode"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <Link
                to="/registration"
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="relative px-5 py-2.5 text-sm font-medium text-white rounded-full overflow-hidden group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-700 via-blue-600 to-blue-500   dark:from-red-700 dark:via-red-600 dark:to-red-500   group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-400 blur-xl"></div>
                </div>
                <span className="relative z-10">Admin</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                aria-label="Toggle dark mode"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
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
                      <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
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
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-40 lg:hidden overflow-y-auto"
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
                            ? "bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-red-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Mobile Content Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                  >
                    <button
                      onClick={() => setMobileContentOpen(!mobileContentOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                        isContentActive()
                          ? "bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span>Content</span>
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-300 ${
                          mobileContentOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {mobileContentOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pt-1 space-y-1">
                            {contentItems.map((item) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                  isActive(item.path)
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Mobile Chapters Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.05 }}
                  >
                    <button
                      onClick={() => setMobileContentOpen(!mobileContentOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                        isChaptersActive()
                          ? "bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span>Chapters</span>
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-300 ${
                          mobileContentOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {mobileContentOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pt-1 space-y-1">
                            <Link
                              to="/chapters"
                              onClick={() => setIsOpen(false)}
                              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                isChaptersActive()
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              View All Chapters
                            </Link>
                            {chapterItems.map((item) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/registration"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center text-base font-medium text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    Register for Event
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center text-base font-medium text-white bg-linear-to-r from-blue-700 via-blue-600 to-blue-500   dark:from-red-700 dark:via-red-600 dark:to-red-500   rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
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