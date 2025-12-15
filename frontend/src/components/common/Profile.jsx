import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  Phone, 
  Shield, 
  ShoppingBag, 
  Briefcase,
  Calendar,
  CheckCircle,
  Edit3,
  Save,
  X,
  Sparkles
} from 'lucide-react';
import { getUser, setUser } from '../../utils/auth';
import { authAPI } from '../../services/api';
import { FadeIn, SlideUp, ScaleIn } from './AnimatedComponents';

const Profile = () => {
  const user = getUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return Shield;
      case 'buyer': return ShoppingBag;
      case 'vendor': return Briefcase;
      default: return User;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-purple-700';
      case 'buyer': return 'from-primary-500 to-primary-700';
      case 'vendor': return 'from-gray-700 to-gray-900';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const RoleIcon = user ? getRoleIcon(user.role) : User;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // In a real app, you'd call an API to update the profile
      // For now, we'll just update localStorage
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      company: user?.company || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
    setError('');
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <FadeIn>
        {/* Header */}
        <div className="mb-8">
          <SlideUp>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-500">Manage your account information and preferences</p>
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
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
              <span className="font-medium">{error}</span>
            </div>
          </ScaleIn>
        )}

        {/* Profile Card */}
        <SlideUp delay={100}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Profile Header Banner */}
            <div className={`bg-gradient-to-br ${getRoleBadgeColor(user.role)} p-8 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:30px_30px]"></div>
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                  <RoleIcon className="h-12 w-12 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                  <p className="text-white/80 mb-2">{user.email}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
                    <RoleIcon className="h-4 w-4" />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-300"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User className="h-4 w-4 text-gray-400" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">{user.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Mail className="h-4 w-4 text-gray-400" />
                    Email Address
                  </label>
                  <p className="px-4 py-3 bg-gray-100 rounded-xl text-gray-500 font-medium">{user.email}</p>
                  <p className="text-xs text-gray-400">Email cannot be changed</p>
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    Company
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">{user.company}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Phone className="h-4 w-4 text-gray-400" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <RoleIcon className="h-4 w-4 text-gray-400" />
                    Account Role
                  </label>
                  <p className="px-4 py-3 bg-gray-100 rounded-xl text-gray-500 font-medium capitalize">{user.role}</p>
                </div>

                {/* Verification Status */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                    Verification Status
                  </label>
                  <div className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${
                    user.verified 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {user.verified ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Verified
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Pending Verification
                      </>
                    )}
                  </div>
                </div>

                {/* Created At */}
                {user.created_at && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      Member Since
                    </label>
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SlideUp>
      </FadeIn>
    </div>
  );
};

export default Profile;

