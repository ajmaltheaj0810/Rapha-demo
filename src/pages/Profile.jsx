import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Upload,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/dashboard/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Mock user data - in real app, this would come from API/context
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    role: user?.role || 'patient',
    joinDate: '2024-01-01',
    profileImage: null
  });

  const [editData, setEditData] = useState({ ...userData });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...userData });
    setProfileImage(null);
    setImagePreview(null);
  };

  const handleSave = () => {
    // In real app, this would make an API call
    setUserData({ 
      ...editData, 
      profileImage: imagePreview || userData.profileImage 
    });
    setIsEditing(false);
    setProfileImage(null);
    setImagePreview(null);
    console.log('Profile updated:', editData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ProfileImageSection = () => (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          {imagePreview || userData.profileImage ? (
            <img 
              src={imagePreview || userData.profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-16 w-16 text-white" />
          )}
        </div>
        
        {isEditing && (
          <div className="absolute bottom-0 right-0 flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Camera className="h-4 w-4" />
            </button>
            {(imagePreview || userData.profileImage) && (
              <button
                onClick={handleRemoveImage}
                className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      <h1 className="text-2xl font-bold text-gray-900 mt-4">
        {userData.firstName} {userData.lastName}
      </h1>
      <p className="text-gray-600 capitalize">{userData.role}</p>
      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
        <Calendar className="h-4 w-4" />
        <span>Joined {new Date(userData.joinDate).toLocaleDateString()}</span>
      </div>
    </div>
  );

  const InfoField = ({ icon: Icon, label, value, name, type = "text", options = null }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Icon className="h-4 w-4" />
        {label}
      </label>
      {isEditing ? (
        options ? (
          <select
            name={name}
            value={editData[name]}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={editData[name]}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )
      ) : (
        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
          {type === 'date' ? new Date(value).toLocaleDateString() : value}
        </p>
      )}
    </div>
  );

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const countryOptions = [
    { value: 'United States', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                <p className="text-blue-100">Manage your personal information</p>
              </div>
              
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <ProfileImageSection />

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <InfoField
                icon={User}
                label="First Name"
                value={userData.firstName}
                name="firstName"
              />
              
              <InfoField
                icon={User}
                label="Last Name"
                value={userData.lastName}
                name="lastName"
              />
              
              <InfoField
                icon={Mail}
                label="Email Address"
                value={userData.email}
                name="email"
                type="email"
              />
              
              <InfoField
                icon={Phone}
                label="Phone Number"
                value={userData.phone}
                name="phone"
                type="tel"
              />
              
              <InfoField
                icon={Calendar}
                label="Date of Birth"
                value={userData.dateOfBirth}
                name="dateOfBirth"
                type="date"
              />
              
              <InfoField
                icon={Shield}
                label="Gender"
                value={userData.gender}
                name="gender"
                options={genderOptions}
              />
            </div>

            {/* Address Information */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InfoField
                    icon={MapPin}
                    label="Street Address"
                    value={userData.address}
                    name="address"
                  />
                </div>
                
                <InfoField
                  icon={MapPin}
                  label="City"
                  value={userData.city}
                  name="city"
                />
                
                <InfoField
                  icon={MapPin}
                  label="State"
                  value={userData.state}
                  name="state"
                />
                
                <InfoField
                  icon={MapPin}
                  label="ZIP Code"
                  value={userData.zip}
                  name="zip"
                />
                
                <InfoField
                  icon={MapPin}
                  label="Country"
                  value={userData.country}
                  name="country"
                  options={countryOptions}
                />
              </div>
            </div>

            {/* Account Information */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Shield className="h-4 w-4" />
                    Role
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg capitalize">
                    {userData.role}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {new Date(userData.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;