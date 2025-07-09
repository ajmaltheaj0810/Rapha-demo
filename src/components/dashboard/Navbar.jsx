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
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
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
    },
    {
      name: 'Notifications',
      icon: Bell,
      path: '/notifications',
      isNotifications: true
    }
  ];

  // Enhanced notifications data matching the screenshot design
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      icon: Clock,
      title: 'Upcoming Appointment',
      message: 'You have an appointment with Dr. Afnan tomorrow at 10:00 AM',
      time: '2 hours ago',
      unread: true,
      color: 'blue'
    },
    {
      id: 2,
      type: 'success',
      icon: CheckCircle,
      title: 'Exercise Completed',
      message: 'Great job! You completed all exercises for today',
      time: '4 hours ago',
      unread: true,
      color: 'green'
    },
    {
      id: 3,
      type: 'reminder',
      icon: Bell,
      title: 'Medication Reminder',
      message: 'Time to take your prescribed medication',
      time: '6 hours ago',
      unread: false,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'info',
      icon: Info,
      title: 'Treatment Plan Updated',
      message: 'Your physiotherapist has updated your treatment plan',
      time: '1 day ago',
      unread: false,
      color: 'blue'
    },
    {
      id: 5,
      type: 'alert',
      icon: AlertCircle,
      title: 'Missed Session',
      message: 'You missed your scheduled session yesterday',
      time: '2 days ago',
      unread: false,
      color: 'red'
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

  const getNotificationColors = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      case 'red': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

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

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                  notification.unread ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    getNotificationColors(notification.color)
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold text-sm ${
                        notification.unread ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                        {notification.unread && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                        )}
                      </h4>
                      <span className="text-xs text-gray-500 flex-shrink-0">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                  </div>
                </div>
              </div>
            );
          })
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
        <Link
          to="/profile"
          onClick={() => setIsProfileOpen(false)}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <UserCircle className="h-4 w-4" />
          View Profile
        </Link>
        
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
              
              // Handle notifications button differently
              if (item.isNotifications) {
                return (
                  <div key={item.name} className="relative" ref={notificationsRef}>
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(!isNotificationsOpen);
                        setIsProfileOpen(false);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {isNotificationsOpen && <NotificationsDropdown />}
                  </div>
                );
              }
              
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
            
            // Handle notifications button for mobile
            if (item.isNotifications) {
              return (
                <div key={item.name} className="relative">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsProfileOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors relative ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              );
            }
            
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