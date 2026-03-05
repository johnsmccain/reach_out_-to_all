import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  BookOpen,
  FileImage,
  MessageSquareQuote,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import image from "@/asset/reachout.jpeg";
import NotificationBell from "@/components/admin/NotificationBell";
import LogoutConfirmModal from "@/components/admin/LogoutConfirmModal";

interface DashboardLayoutProps {
  children: ReactNode;
  currentRoute?: string;
  onRouteChange?: (route: string) => void;
}

const DashboardLayout = ({
  children,
  currentRoute,
  onRouteChange,
}: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Notify parent of route changes
  useState(() => {
    if (onRouteChange) {
      onRouteChange(location.pathname);
    }
  });

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Articles", path: "/articles", icon: FileText },
    { name: "Sermons", path: "/sermons", icon: BookOpen },
    { name: "Documents", path: "/documents", icon: FileImage },
    { name: "Daily Quotes", path: "/quotes", icon: MessageSquareQuote },
    { name: "Statistics", path: "/statistics", icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    const activeRoute = currentRoute || location.pathname;
    return activeRoute === path;
  };

  const handleNavClick = (path: string) => {
    if (onRouteChange) {
      onRouteChange(path);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? "4rem" : "16rem" }}
        className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-white/95 backdrop-blur-xl border-r border-neutral-200/50 shadow-xl z-40"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200/50">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <img
                  src={image}
                  alt="Logo"
                  className="h-10 w-10 rounded-full ring-2 ring-primary-500/20"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sm bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    Reachout To All
                  </span>
                  <span className="text-xs text-neutral-500">Admin Portal</span>
                </div>
              </motion.div>
            )}
            {sidebarCollapsed && (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                src={image}
                alt="Logo"
                className="h-10 w-10 rounded-full ring-2 ring-primary-500/20 mx-auto"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`relative flex items-center gap-3 px-3 py-2.5 transition-all duration-300 group w-full text-left ${
                  active
                    ? "text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <Icon
                  className={`relative h-5 w-5 ${active ? "text-white" : "text-neutral-500 group-hover:text-primary-600"} transition-colors`}
                />
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="relative text-sm font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-neutral-200/50">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">Collapse</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-neutral-200/50 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt="Logo"
            className="h-10 w-10 rounded-full ring-2 ring-primary-500/20"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm bg-linear-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              Reachout To All
            </span>
            <span className="text-xs text-neutral-500">Admin Portal</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-white shadow-2xl z-40 overflow-y-auto"
            >
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        handleNavClick(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 transition-all w-full text-left ${
                        active
                          ? "text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-neutral-200">
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-error-600 hover:bg-error-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"} pt-16 lg:pt-0`}
      >
        {/* Top Bar */}
        <header className="hidden lg:flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-neutral-900">
              {navItems.find((item) => isActive(item.path))?.name ||
                "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="py-5 px-2">
            {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default DashboardLayout;
