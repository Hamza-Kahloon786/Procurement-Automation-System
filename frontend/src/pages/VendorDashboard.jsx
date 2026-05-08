import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Dashboard from '../components/vendor/Dashboard';
import BrowseRequests from '../components/vendor/BrowseRequests';
import MyQuotations from '../components/vendor/MyQuotations';
import Statistics from '../components/vendor/Statistics';
import Profile from '../components/common/Profile';
import Settings from '../components/common/Settings';
import Notifications from '../components/common/Notifications';
import Documentation from '../components/common/Documentation';
import FAQs from '../components/common/FAQs';

const VendorDashboard = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMobileMenuToggle={() => setIsMobileSidebarOpen(true)} />
      <div className="flex">
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen} 
          onMobileClose={() => setIsMobileSidebarOpen(false)} 
        />
        <main className="flex-1 w-full lg:w-auto min-w-0">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/browse" element={<BrowseRequests />} />
              <Route path="/quotations" element={<MyQuotations />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/faqs" element={<FAQs />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;