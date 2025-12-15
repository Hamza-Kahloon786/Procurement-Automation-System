import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
              <span className="text-xl sm:text-2xl font-bold text-white">ProcureHub</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              Streamline your procurement process with our intelligent platform connecting buyers and vendors seamlessly.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="#"
                className="p-1.5 sm:p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="#"
                className="p-1.5 sm:p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="#"
                className="p-1.5 sm:p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="#"
                className="p-1.5 sm:p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a
                  href="#features"
                  className="hover:text-primary-500 transition-colors duration-300 hover:pl-2 inline-block text-xs sm:text-sm"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-primary-500 transition-colors duration-300 hover:pl-2 inline-block text-xs sm:text-sm"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  className="hover:text-primary-500 transition-colors duration-300 hover:pl-2 inline-block text-xs sm:text-sm"
                >
                  Benefits
                </a>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-primary-500 transition-colors duration-300 hover:pl-2 inline-block text-xs sm:text-sm"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">For Business</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 transition-colors duration-300 hover:pl-2 inline-block text-xs sm:text-sm"
                >
                  Buyer Solutions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 transition-colors duration-300 hover:pl-2 inline-block text-xs sm:text-sm"
                >
                  Vendor Portal
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 transition-colors duration-300 hover:pl-2 inline-block text-xs sm:text-sm"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 transition-colors duration-300 hover:pl-2 inline-block text-xs sm:text-sm"
                >
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-3 group">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 mt-0.5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  123 Business Street<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 group">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-xs sm:text-sm hover:text-primary-500 transition-colors duration-300"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 group">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <a
                  href="mailto:info@procurehub.com"
                  className="text-xs sm:text-sm hover:text-primary-500 transition-colors duration-300 break-all"
                >
                  info@procurehub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              © {currentYear} ProcureHub. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a
                href="#"
                className="hover:text-primary-500 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-primary-500 transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-primary-500 transition-colors duration-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

