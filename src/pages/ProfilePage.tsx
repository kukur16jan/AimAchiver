import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  Calendar, 
  Award, 
  Target, 
  Flame, 
  Edit3,
  Save,
  X,
  Shield,
  Bell,
  Trash2
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { tasks } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const activeTasks = tasks.filter(task => task.status === 'active');

  const handleSave = () => {
    if (user) {
      updateUser(editData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const badges = [
    { name: 'Welcome', icon: '👋', description: 'Joined Aim Achiever', earned: true },
    { name: 'First Goal', icon: '🎯', description: 'Created your first goal', earned: tasks.length > 0 },
    { name: 'Achiever', icon: '✅', description: 'Completed your first goal', earned: completedTasks.length > 0 },
    { name: 'Streak Master', icon: '🔥', description: '7-day streak', earned: (user?.streak || 0) >= 7 },
    { name: 'Level Up', icon: '⭐', description: 'Reached level 5', earned: (user?.level || 0) >= 5 },
    { name: 'Consistent', icon: '📅', description: 'Completed 10 goals', earned: completedTasks.length >= 10 }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);

  return (
      <div className="w-full from-slate-800 to-slate-700 rounded-2xl ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your account and track your achievements
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info Card */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-3 py-1 space-x-1 text-sm font-medium text-green-700 transition-colors rounded-lg bg-green-50 hover:bg-green-100"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-3 py-1 space-x-1 text-sm font-medium text-red-700 transition-colors rounded-lg bg-red-50 hover:bg-red-100"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-6">
                {/* <div className="relative">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-20 h-20 border-4 border-gray-200 rounded-full"
                  />
                  <button className="absolute bottom-0 right-0 p-2 text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700">
                    <Camera className="w-3 h-3" />
                  </button>
                </div> */}

                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{user?.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">Achievements & Badges</h2>
              
              {earnedBadges.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {earnedBadges.map((badge, index) => (
                    <div key={index} className="flex items-center p-4 space-x-3 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="text-2xl">{badge.icon}</div>
                      <div>
                        <h3 className="font-medium text-gray-900">{badge.name}</h3>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No badges earned yet</p>
                  <p className="text-sm text-gray-400">Complete goals to earn your first badge!</p>
                </div>
              )}

              {/* Locked Badges */}
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium text-gray-700">Upcoming Badges</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {badges.filter(badge => !badge.earned).slice(0, 2).map((badge, index) => (
                    <div key={index} className="flex items-center p-4 space-x-3 border border-gray-200 rounded-lg bg-gray-50 opacity-60">
                      <div className="text-2xl grayscale">{badge.icon}</div>
                      <div>
                        <h3 className="font-medium text-gray-700">{badge.name}</h3>
                        <p className="text-sm text-gray-500">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">Account Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-600">Manage your notification preferences</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Configure
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Privacy & Security</h3>
                      <p className="text-sm text-gray-600">Control your privacy settings</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Manage
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <div>
                      <h3 className="font-medium text-red-900">Delete Account</h3>
                      <p className="text-sm text-red-600">Permanently delete your account and data</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-red-600 hover:text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Level & XP */}
            <div className="p-6 text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-white/20">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="mb-1 text-2xl font-bold">Level {user?.level || 1}</h3>
                <p className="mb-4 text-blue-100">{user?.xp || 0} XP</p>
                
                <div className="h-2 mb-2 rounded-full bg-white/20">
                  <div 
                    className="h-2 transition-all duration-300 bg-white rounded-full"
                    style={{ width: `${((user?.xp || 0) % 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-100">
                  {100 - ((user?.xp || 0) % 100)} XP to next level
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Goals</span>
                  </div>
                  <span className="font-semibold text-gray-900">{tasks.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="font-semibold text-gray-900">{completedTasks.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-gray-600">Current Streak</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user?.streak || 0} days</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Active Goals</span>
                  </div>
                  <span className="font-semibold text-gray-900">{activeTasks.length}</span>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full px-4 py-3 font-medium text-red-700 transition-colors rounded-lg bg-red-50 hover:bg-red-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
  );
};