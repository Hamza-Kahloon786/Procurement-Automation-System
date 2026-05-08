import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff,
  Shield,
  Moon,
  Sun,
  Globe,
  Mail,
  Smartphone,
  Save,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { getUser } from '../../utils/auth';
import { FadeIn, SlideUp, ScaleIn } from './AnimatedComponents';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
  const user = getUser();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    quotationAlerts: true,
    requestUpdates: true,
    marketingEmails: false,
  });

  // Password Change
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Theme Settings
  const { theme, setTheme } = useTheme();

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Notification settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    if (passwords.newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <FadeIn>
        {/* Header */}
        <div className="mb-8">
          <SlideUp>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences</p>
          </SlideUp>
        </div>

        {/* Success Message */}
        {success && (
          <ScaleIn>
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">{success}</span>
            </div>
          </ScaleIn>
        )}

        {/* Error Message */}
        {error && (
          <ScaleIn>
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </ScaleIn>
        )}

        <div className="space-y-6">
          {/* Notification Settings */}
          <SlideUp delay={100}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <Bell className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notifications</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage how you receive updates</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {[
                  { key: 'emailNotifications', icon: Mail, label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'pushNotifications', icon: Smartphone, label: 'Push Notifications', desc: 'Get instant push notifications' },
                  { key: 'quotationAlerts', icon: Sparkles, label: 'Quotation Alerts', desc: 'Get notified when new quotations arrive' },
                  { key: 'requestUpdates', icon: Globe, label: 'Request Updates', desc: 'Updates on your procurement requests' },
                  { key: 'marketingEmails', icon: Mail, label: 'Marketing Emails', desc: 'Receive promotional content and news' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center shadow-sm">
                          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{item.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(item.key)}
                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                          notifications[item.key] ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                          notifications[item.key] ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  );
                })}

                <button
                  onClick={handleSaveNotifications}
                  disabled={loading}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  Save Notification Settings
                </button>
              </div>
            </div>
          </SlideUp>

          {/* Security Settings */}
          <SlideUp delay={200}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Security</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your password and security settings</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {!showPasswordSection ? (
                  <button
                    onClick={() => setShowPasswordSection(true)}
                    className="flex items-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors duration-300 w-full text-left"
                  >
                    <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Lock className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Change Password</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                    </div>
                  </button>
                ) : (
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwords.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="newPassword"
                          value={passwords.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwords.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          setShowPasswordSection(false);
                          setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setError('');
                        }}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleChangePassword}
                        disabled={loading || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        ) : (
                          <Lock className="h-5 w-5" />
                        )}
                        Update Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SlideUp>

          {/* Appearance Settings */}
          <SlideUp delay={300}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                    <Sun className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Appearance</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customize how the app looks</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex gap-4">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'system', icon: SettingsIcon, label: 'System' },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                          theme === option.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          theme === option.value ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-white dark:bg-gray-600'
                        }`}>
                          <Icon className={`h-6 w-6 ${theme === option.value ? 'text-primary-600' : 'text-gray-500 dark:text-gray-300'}`} />
                        </div>
                        <span className={`font-semibold ${theme === option.value ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'}`}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Choose your preferred appearance
                </p>
              </div>
            </div>
          </SlideUp>
        </div>
      </FadeIn>
    </div>
  );
};

export default Settings;

