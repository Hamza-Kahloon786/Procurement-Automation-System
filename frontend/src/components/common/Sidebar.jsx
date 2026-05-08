import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  BarChart3,
  ShoppingBag,
  PlusCircle,
  Search,
  Sparkles,
  ChevronRight,
  X,
  MessageCircle,
  Book,
  HelpCircle,
  Mail,
  Phone,
  FileSpreadsheet,
  Menu
} from 'lucide-react';
import { getUserRole } from '../../utils/auth';
import { Float } from './AnimatedComponents';

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = getUserRole();
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (onMobileClose) onMobileClose();
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const buyerLinks = [
    { to: '/buyer', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-primary-500 to-primary-700' },
    { to: '/buyer/requests', icon: FileText, label: 'My Requests', gradient: 'from-gray-600 to-gray-800' },
    { to: '/buyer/create-request', icon: PlusCircle, label: 'Create Request', gradient: 'from-primary-600 to-primary-800' },
    { to: '/buyer/stats', icon: BarChart3, label: 'Statistics', gradient: 'from-gray-700 to-gray-900' },
  ];

  const vendorLinks = [
    { to: '/vendor', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-primary-500 to-primary-700' },
    { to: '/vendor/browse', icon: Search, label: 'Browse Requests', gradient: 'from-gray-600 to-gray-800' },
    { to: '/vendor/quotations', icon: Package, label: 'My Quotations', gradient: 'from-primary-600 to-primary-800' },
    { to: '/vendor/stats', icon: BarChart3, label: 'Statistics', gradient: 'from-gray-700 to-gray-900' },
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-primary-500 to-primary-700' },
    { to: '/admin/users', icon: Users, label: 'User Management', gradient: 'from-gray-600 to-gray-800' },
    { to: '/admin/stats', icon: BarChart3, label: 'Statistics', gradient: 'from-primary-600 to-primary-800' },
  ];

  let links = [];
  if (role === 'buyer') links = buyerLinks;
  else if (role === 'vendor') links = vendorLinks;
  else if (role === 'admin') links = adminLinks;

  // Shared sidebar content
  const SidebarContent = () => (
    <>
      {/* Welcome Banner */}
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <Float>
          <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl p-4 lg:p-5 overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
                <p className="text-white font-bold text-base lg:text-lg">
                  {role === 'admin' ? 'Admin' : role === 'buyer' ? 'Buyer' : 'Vendor'} Portal
                </p>
              </div>
              <p className="text-white/80 text-sm">
                Welcome back! Manage with ease
              </p>
            </div>
          </div>
        </Float>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 lg:p-4 space-y-1.5 lg:space-y-2">
        {links.map((link, index) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`
                group relative flex items-center gap-3 lg:gap-4 px-4 lg:px-5 py-3 lg:py-4 rounded-xl 
                transition-all duration-300 transform
                ${isActive 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl shadow-primary-500/30 scale-[1.02] lg:scale-105' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:scale-[1.02] lg:hover:scale-105 hover:shadow-lg'
                }
              `}
              style={{ 
                animationDelay: `${index * 0.05}s`,
                animation: 'fadeInUp 0.5s ease-out both'
              }}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full animate-pulse"></div>
              )}

              <div className={`
                relative flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-xl
                transition-all duration-500
                ${isActive 
                  ? 'bg-white/20 shadow-lg' 
                  : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'
                }
              `}>
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  !isActive ? 'bg-gradient-to-br from-primary-100 to-primary-200' : ''
                }`}></div>
                <Icon className={`
                  h-5 w-5 lg:h-6 lg:w-6 relative z-10
                  transition-all duration-500 group-hover:scale-110
                  ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-primary-600'}
                `} />
              </div>

              <span className={`font-semibold text-sm lg:text-base transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-gray-900'
              }`}>
                {link.label}
              </span>

              {link.badge && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  isActive 
                    ? 'bg-white text-primary-600' 
                    : 'bg-green-500 text-white animate-pulse'
                }`}>
                  {link.badge}
                </span>
              )}

              <ChevronRight className={`
                ml-auto h-4 w-4 lg:h-5 lg:w-5 transition-all duration-300
                ${isActive 
                  ? 'text-white opacity-100' 
                  : 'text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                }
              `} />

              {!isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600/0 to-primary-600/0 group-hover:from-primary-600/5 group-hover:to-primary-600/10 transition-all duration-300"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Stats Widget */}
      <div className="p-3 lg:p-4 mt-2 lg:mt-4">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-4 lg:p-5 text-white shadow-xl border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4" />
            </div>
            <p className="font-bold text-sm lg:text-base">Quick Stats</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Active Today</span>
              <span className="text-xl lg:text-2xl font-black">
                <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">24</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">This Week</span>
              <span className="text-xl lg:text-2xl font-black">
                <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">156</span>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="p-3 lg:p-4 mt-auto">
        <button 
          onClick={() => setShowHelpModal(true)}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl p-3 lg:p-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group text-sm lg:text-base"
        >
          <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 group-hover:rotate-12 transition-transform duration-300" />
          Need Help?
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-gradient-to-b from-white via-gray-50 to-white shadow-2xl min-h-screen sticky top-20 border-r border-gray-100 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Full overlay drawer triggered from Navbar */}
      {isMobileOpen && createPortal(
        <div className="fixed inset-0 z-[9998] lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="absolute top-0 left-0 bottom-0 w-[280px] sm:w-[320px] bg-gradient-to-b from-white via-gray-50 to-white shadow-2xl overflow-y-auto animate-slideInLeft">
            {/* Close header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-600" />
                <span className="font-bold text-gray-900">Menu</span>
              </div>
              <button
                onClick={onMobileClose}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>,
        document.body
      )}

      {/* Help Modal */}
      {showHelpModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHelpModal(false)}
          ></div>
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn z-10">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-5 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">Help & Support</h2>
                    <p className="text-white/80 text-xs sm:text-sm">We're here to help you</p>
                  </div>
                </div>
                <button onClick={() => setShowHelpModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <button
                onClick={() => {
                  setShowHelpModal(false);
                  if (onMobileClose) onMobileClose();
                  const basePath = role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : '/buyer';
                  navigate(`${basePath}/documentation`);
                }}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 group cursor-pointer hover:scale-[1.02]"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Book className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5">Documentation</p>
                  <p className="text-xs sm:text-sm text-gray-500">Browse guides and tutorials</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setShowHelpModal(false);
                  if (onMobileClose) onMobileClose();
                  const basePath = role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : '/buyer';
                  navigate(`${basePath}/faqs`);
                }}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 group cursor-pointer hover:scale-[1.02]"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5">FAQs</p>
                  <p className="text-xs sm:text-sm text-gray-500">Find answers to common questions</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="border-t border-gray-100 pt-3 sm:pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 sm:mb-3">Contact Support</p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <a href="mailto:hamzaakahloon903@gmail.com" className="flex items-center gap-2 p-2.5 sm:p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Email Us</span>
                  </a>
                  <a href="tel:+923091453950" className="flex items-center gap-2 p-2.5 sm:p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Call Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out both;
        }
      `}</style>
    </>
  );
};

export default Sidebar;