import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Dashboard from '../components/buyer/Dashboard';
import RequestList from '../components/buyer/RequestList';
import CreateRequest from '../components/buyer/CreateRequest';
import QuotationComparison from '../components/buyer/QuotationComparison';
import QuickCompare from '../components/buyer/QuickCompare';
import Statistics from '../components/buyer/Statistics';
import Profile from '../components/common/Profile';
import Settings from '../components/common/Settings';
import Notifications from '../components/common/Notifications';
import Documentation from '../components/common/Documentation';
import FAQs from '../components/common/FAQs';

const BuyerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requests" element={<RequestList />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/quotations/:requestId" element={<QuotationComparison />} />
            <Route path="/quick-compare" element={<QuickCompare />} />
            <Route path="/stats" element={<Statistics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/faqs" element={<FAQs />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default BuyerDashboard;