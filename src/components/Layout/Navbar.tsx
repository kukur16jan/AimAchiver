import { Link, useLocation} from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Target,
  Home,
  CheckSquare,
  BarChart3,
  Users,
  User,
  LogOut,
  Award
} from 'lucide-react';

export default function SidebarLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Peers', href: '/peers', icon: Users },
    // New peer-related pages
    // { name: 'Peer Dashboard', href: '/peer-dashboard', icon: BarChart3 },
    { name: 'My Peer Comments', href: '/my-peer-comments', icon: Users },
    { name: 'Peers Who Added Me', href: '/peers-who-added-me', icon: Users },
    // { name: 'Peer Details (Recipient)', href: '/peer-details-for-recipient', icon: User },
    { name: 'Profile', href: '/profile', icon: User },
  ];
  const isActive = (path: string) => location.pathname === path;

  return (
      <aside
        className={`sticky top-0 w-2/12 z-40 sm:flex sm:flex-col  px-3 py-6 hidden bg-white border-r border-gray-200`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center mb-8 space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <Target className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Aim Achiever
          </span>
        </Link>
        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        {/* User Info & Logout */}
        <div className="pt-8 mt-auto border-t border-gray-100">
          <div className="flex items-center mb-3 space-x-2">
            <div className="flex items-center px-2 py-1 space-x-1 text-yellow-700 rounded-full bg-yellow-50">
              <Award className="w-4 h-4" />
              <span className="flex font-medium">Level {user?.level}</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">{user?.xp}</span> XP
            </div>
            <div className="text-gray-600">
              <span className="font-medium ">{user?.streak}</span> day streak
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* <img src={user?.avatar} alt={user?.name} className="w-8 h-8 border-2 border-gray-200 rounded-full" /> */}
            <button
              onClick={logout}
              className="flex gap-2 p-2 text-gray-400 transition-colors hover:text-gray-600"
              title="Logout"
            >
              
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </aside>
  );
}