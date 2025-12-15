import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-2 sm:py-3'
          : 'bg-transparent py-3 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <ShoppingCart
                className={`h-6 w-6 sm:h-8 sm:w-8 transition-all duration-300 transform group-hover:rotate-12 group-hover:scale-110 ${
                  isScrolled ? 'text-primary-600' : 'text-white'
                }`}
              />
              <div className="absolute inset-0 bg-primary-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
            <span
              className={`text-lg sm:text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              ProcureHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            <a
              href="#features"
              className={`transition-all duration-300 hover:scale-105 relative group ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#how-it-works"
              className={`transition-all duration-300 hover:scale-105 relative group ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#benefits"
              className={`transition-all duration-300 hover:scale-105 relative group ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Benefits
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full" />
            </a>
            <Link
              to="/login"
              className={`px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-sm lg:text-base ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 lg:px-6 py-2 bg-primary-600 text-white rounded-lg transition-all duration-300 hover:bg-primary-700 hover:scale-105 hover:shadow-lg text-sm lg:text-base whitespace-nowrap"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 animate-fade-in border-t border-white/10 pt-4">
            <a
              href="#features"
              className={`transition-colors duration-300 py-2 text-base font-medium ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`transition-colors duration-300 py-2 text-base font-medium ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#benefits"
              className={`transition-colors duration-300 py-2 text-base font-medium ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Benefits
            </a>
            <Link
              to="/login"
              className={`transition-colors duration-300 py-2 text-base font-medium ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg text-center font-semibold hover:bg-primary-700 transition-colors mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

