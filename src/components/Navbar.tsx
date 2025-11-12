import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Cross, Menu } from "lucide-react";
import { motion } from "framer-motion";
import image from "@/asset/reachout.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Articles", path: "/articles" },
    { name: "Get Involved", path: "/get-involved" },
    { name: "Events", path: "/events" },
    { name: "Registration", path: "/registration" },
    { name: "Resources", path: "/resources" },
    { name: "Admin", path: "/login" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-blue-900/90 backdrop-blur-md text-white sticky top-0 z-50 shadow-lg border-b border-blue-800/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <img src={image} alt="" className="h-8 w-8 rounded-full" />
              {/* <Globe className="h-8 w-8" /> */}
            </motion.div>
            <span className="font-bold text-xl group-hover:text-blue-200 text-white transition-colors">
              Reachout To All
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="relative group">
                <span className="hover:text-blue-200 text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                  {item.name}
                </span>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 bottom-[-4px] shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-400/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10" />
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <Cross /> : <Menu />}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block py-2 hover:text-blue-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

