import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import BuyerDashboard from './pages/BuyerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { isAuthenticated, getUserRole } from './utils/auth';
import { NotificationProvider } from './context/NotificationContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/buyer/*"
          element={
            <PrivateRoute allowedRoles={['buyer']}>
              <BuyerDashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/vendor/*"
          element={
            <PrivateRoute allowedRoles={['vendor']}>
              <VendorDashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;