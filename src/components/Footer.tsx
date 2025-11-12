import { Link } from "react-router-dom";
import { Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import image from "@/asset/reachout.jpeg";


const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-cyan-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"></div>
      
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={image} alt="logo" className="h-8 w-8 rounded-full" />
              <span className="font-bold text-lg">Reachout To All</span>
            </div>
            <p className="text-blue-200">
              Welcome to Reachout To All. Here, every soul counts. We are on a
              mission to reach out to all people with the gospel, accompanied by
              a humanitarian touch of love.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-blue-200">
              {["About", "Events", "Get Involved", "Resources", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase().replace(" ", "-")}`}
                      className="text-blue-200 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] relative group"
                    >
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-blue-200">
              <li className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 shrink-0 text-blue-300" />
                <a
                  href="mailto:toallreachout@gmail.com"
                  className="hover:underline"
                >
                  toallreachout@gmail.com,
                  info@reachouttoall.org
                  reachouttoall@yahoo.com,
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-300" />
                <a href="tel:+2347037043343" className="hover:underline">
                  +234 703 704 3343, +2348123605848
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-blue-300 mt-1" />
                <span className="text-blue-200 leading-tight">
                  Suite 5, Victory Plaza, Opposite Concord Garden, Adjacent
                  U/Boro New Market, Sabon Tasha, Kaduna State, Nigeria.
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100064950391474"
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] p-2 rounded-lg hover:bg-blue-600/20"
              >
                <Facebook className="h-6 w-6" />
              </a>

              <a
                href="https://m.youtube.com/@reachout2all"
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] p-2 rounded-lg hover:bg-red-600/20"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 text-center text-gray-400">
          <p className="hover:text-white transition-colors duration-300">
            &copy; {new Date().getFullYear()} Reach Out To All. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
