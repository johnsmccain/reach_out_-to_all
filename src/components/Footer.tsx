import { Link } from "react-router-dom";
import { Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import image from "@/asset/reachout.jpeg";


const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      {item}
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
                <Mail className="h-5 w-5 text-blue-300" />
                <a
                  href="mailto:toallreachout@gmail.com"
                  className="hover:underline"
                >
                  toallreachout@gmail.com,
                  reachouttoall@yahoo.com
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
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>

              <a
                href="https://m.youtube.com/@reachout2all"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Reach Out To All. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
