import React, { useState } from 'react';
import { 
  Bell, 
  Package, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Trash2,
  CheckCheck,
  Filter
} from 'lucide-react';
import { FadeIn, SlideUp } from './AnimatedComponents';
import { useNotifications } from '../../context/NotificationContext';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'quotation': return Package;
      case 'request': return FileText;
      case 'success': return CheckCircle;
      case 'pending': return Clock;
      case 'alert': return AlertCircle;
      default: return Bell;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'quotation': return 'bg-blue-100 text-blue-600';
      case 'request': return 'bg-primary-100 text-primary-600';
      case 'success': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'alert': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <FadeIn>
        {/* Header */}
        <div className="mb-8">
          <SlideUp>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
                <p className="text-gray-500">
                  You have <span className="font-semibold text-primary-600">{unreadCount}</span> unread notifications
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-xl font-semibold transition-all duration-300"
                >
                  <CheckCheck className="h-5 w-5" />
                  Mark all as read
                </button>
              )}
            </div>
          </SlideUp>
        </div>

        {/* Filters */}
        <SlideUp delay={100}>
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'unread', label: 'Unread' },
                { value: 'read', label: 'Read' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filter === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </SlideUp>

        {/* Notifications List */}
        <SlideUp delay={200}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification, index) => {
                  const Icon = getNotificationIcon(notification.type);
                  const iconColor = getIconColor(notification.type);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-5 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-primary-50/30' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-gray-900">{notification.title}</p>
                              <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                              <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-primary-600"
                                  title="Mark as read"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {!notification.read && (
                          <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-semibold text-gray-900 mb-2">No notifications</p>
                <p className="text-gray-500">
                  {filter === 'unread' 
                    ? "You've read all your notifications!" 
                    : "You don't have any notifications yet."}
                </p>
              </div>
            )}
          </div>
        </SlideUp>
      </FadeIn>
    </div>
  );
};

export default Notifications;

