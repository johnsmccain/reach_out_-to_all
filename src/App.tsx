import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const GetInvolved = lazy(() => import("./pages/GetInvolved"));
const Contact = lazy(() => import("./pages/Contact"));
const Events = lazy(() => import("./pages/Events"));
const Sermons = lazy(() => import("./pages/Sermons"));
const Resources = lazy(() => import("./pages/Resources"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Login = lazy(() => import("./pages/Login"));
const AuthGuard = lazy(() => import("./components/AuthGuard"));
const Registration = lazy(() => import("./pages/Registration"));
const Articles = lazy(() => import("./pages/Articles"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <AnimatePresence mode="wait">
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home />
                  </PageTransition>
                }
              />
              <Route
                path="/about"
                element={
                  <PageTransition>
                    <About />
                  </PageTransition>
                }
              />
              <Route
                path="/get-involved"
                element={
                  <PageTransition>
                    <GetInvolved />
                  </PageTransition>
                }
              />
              <Route
                path="/contact"
                element={
                  <PageTransition>
                    <Contact />
                  </PageTransition>
                }
              />
              <Route
                path="/events"
                element={
                  <PageTransition>
                    <Events />
                  </PageTransition>
                }
              />
              <Route
                path="/sermons"
                element={
                  <PageTransition>
                    <Sermons />
                  </PageTransition>
                }
              />
              <Route
                path="/registration"
                element={
                  <PageTransition>
                    <Registration />
                  </PageTransition>
                }
              />
              <Route
                path="/articles"
                element={
                  <PageTransition>
                    <Articles />
                  </PageTransition>
                }
              />
              <Route
                path="/articles/:id"
                element={
                  <PageTransition>
                    <ArticleDetail />
                  </PageTransition>
                }
              />
              <Route
                path="/resources"
                element={
                  <PageTransition>
                    <Resources />
                  </PageTransition>
                }
              />
              <Route
                path="/login"
                element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                }
              />
              <Route
                path="/admin"
                element={
                  <AuthGuard>
                    <PageTransition>
                      <AdminDashboard />
                    </PageTransition>
                  </AuthGuard>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </AnimatePresence>
      {!isAdminRoute && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#1f2937",
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            padding: "1rem",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
