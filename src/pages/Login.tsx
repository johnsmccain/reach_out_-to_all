import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const LoginNew = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) navigate("/admin");
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Welcome back!");
      navigate("/admin");
    } catch (error) {
      console.log(error)
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-linear-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-linear-to-tl from-accent-100/40 to-secondary-100/40 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl mb-6 shadow-lg"
            >
              <Shield className="h-8 w-8 " />
            </motion.div>
            <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent shadow-xs">
              Welcome Back
            </h1>
            <p className="text-neutral-600">
              Sign in to access your admin portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    focusedField === "email"
                      ? "text-primary-500"
                      : "text-neutral-400"
                  }`}
                >
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="block w-full pl-12 pr-4 py-3.5 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300"
                  placeholder="admin@reachouttoall.org"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-neutral-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    focusedField === "password"
                      ? "text-primary-500"
                      : "text-neutral-400"
                  }`}
                >
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="block w-full pl-12 pr-12 py-3.5 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full relative px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </motion.button>
          </form>

          {/* Back to Home Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-primary-600 via-secondary-600 to-accent-600 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
        

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden bg-linear-to-br from-gray-900 via-blue-900 to-purple-900">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-32 right-32 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-xl backdrop-blur-sm"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Manage Your Ministry
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-md">
              Access your admin dashboard to manage events, articles, sermons,
              and reach more souls for Christ.
            </p>

            {/* Feature List */}
            <div className="space-y-4 text-left max-w-md mx-auto">
              {[
                { icon: Shield, text: "Secure & Encrypted" },
                { icon: Sparkles, text: "Modern Interface" },
                { icon: Zap, text: "Fast & Reliable" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-white/90"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginNew;
