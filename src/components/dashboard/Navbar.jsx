import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Calendar, 
  Bell, 
  User, 
  LogOut,
  Activity,
  ChevronDown,
  Settings,
  UserCircle,
  Phone,
  Mail,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Refs for click outside detection
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  const isPatient = user?.role === 'patient';
  
  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: isPatient ? '/patient-dashboard' : '/physio-dashboard'
    },
    {
      name: 'Chat',
      icon: MessageCircle,
      path: isPatient ? '/patient-chat' : '/physio-chat'
    },
    {
      name: 'Booking',
      icon: Calendar,
      path: isPatient ? '/booking' : '/physio-bookings'
    }
  ];

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'Appointment Reminder',
      message: 'You have an appointment tomorrow at 10:00 AM',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      title: 'Exercise Completed',
      message: 'Great job! You completed all exercises for today',
      time: '4 hours ago',
      unread: true
    },
    {
      id: 3,
      title: 'Treatment Plan Updated',
      message: 'Your physiotherapist has updated your treatment plan',
      time: '1 day ago',
      unread: false
    }
  ];

  // Mock user data (in real app, this would come from user context/API)
  const userData = {
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || 'user@example.com',
    role: user?.role || 'patient',
    phone: '+1 (555) 123-4567'
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const NotificationsDropdown = () => (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-slideDown">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* User Info Section */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 capitalize">{userData.name}</h4>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Mail className="h-3 w-3" />
              <span>{userData.email}</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Shield className="h-3 w-3" />
                <span className="capitalize">{userData.role}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Phone className="h-3 w-3" />
                <span>{userData.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-64 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                notification.unread ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <div className="flex-1">
                  <h5 className={`font-medium text-sm ${
                    notification.unread ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {notification.title}
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No new notifications</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <Link
          to="/notifications"
          onClick={() => setIsNotificationsOpen(false)}
          className="block w-full text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          View All Notifications
        </Link>
      </div>
    </div>
  );

  const ProfileDropdown = () => (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-slideDown">
      {/* User Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 capitalize">{userData.name}</div>
            <div className="text-sm text-gray-600 capitalize">{userData.role}</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => {
            setIsProfileOpen(false);
            // Navigate to profile page (you can implement this)
            console.log('Navigate to profile');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <UserCircle className="h-4 w-4" />
          View Profile
        </button>
        
        <button
          onClick={() => {
            setIsProfileOpen(false);
            // Navigate to settings page (you can implement this)
            console.log('Navigate to settings');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
        
        <div className="border-t border-gray-100 mt-2 pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/Raphat.jpg" 
              alt="Raphat Healthcare" 
              className="w-10 h-10 rounded-lg object-cover"
              onError={(e) => {
                // Fallback to gradient background if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Raphat</span>
          </Link>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {isNotificationsOpen && <NotificationsDropdown />}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline capitalize">{userData.name}</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isProfileOpen && <ProfileDropdown />}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;