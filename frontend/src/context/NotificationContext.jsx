import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

// Storage key for localStorage
const STORAGE_KEY = 'procurehub_notifications';

// Default notifications (only used if no data in localStorage)
const DEFAULT_NOTIFICATIONS = [
  { id: 1, type: 'quotation', title: 'New quotation received', message: 'Vendor ABC Corp submitted a quotation for your procurement request #1234. Review it now to compare with other vendors.', time: '5 minutes ago', date: '2024-01-15', read: false },
  { id: 2, type: 'request', title: 'Request approved', message: 'Your procurement request #1234 for office supplies has been approved by the admin. You can now receive quotations from vendors.', time: '1 hour ago', date: '2024-01-15', read: false },
  { id: 3, type: 'alert', title: 'Action required', message: 'You have 3 pending quotations that need to be reviewed before the deadline on January 20th.', time: '2 hours ago', date: '2024-01-15', read: true },
  { id: 4, type: 'success', title: 'Quotation accepted', message: 'Your quotation for request #1122 has been accepted by the buyer. Congratulations!', time: '1 day ago', date: '2024-01-14', read: true },
  { id: 5, type: 'request', title: 'New request available', message: 'A new procurement request matching your expertise has been posted. Check it out!', time: '2 days ago', date: '2024-01-13', read: true },
];

// Load notifications from localStorage
const loadNotifications = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading notifications from localStorage:', error);
  }
  return DEFAULT_NOTIFICATIONS;
};

// Save notifications to localStorage
const saveNotifications = (notifications) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications to localStorage:', error);
  }
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  // Initialize state from localStorage
  const [notifications, setNotifications] = useState(() => loadNotifications());

  // Save to localStorage whenever notifications change
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      return updated;
    });
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      return updated;
    });
  }, []);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      time: 'Just now',
      date: new Date().toISOString().split('T')[0],
      read: false,
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Reset to default notifications (useful for testing)
  const resetNotifications = useCallback(() => {
    setNotifications(DEFAULT_NOTIFICATIONS);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      addNotification,
      clearAllNotifications,
      resetNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;

