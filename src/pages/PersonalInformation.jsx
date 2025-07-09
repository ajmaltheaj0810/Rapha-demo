import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  MapPin, 
  ChevronDown, 
  Upload,
  Mail,
  User,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PersonalInformation = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: '',
    password: '',
    agreeToTerms: false,
    certificate: null
  });

  // Add global styles for date input
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(0.5);
        cursor: pointer;
        width: 20px;
        height: 20px;
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        margin: 0;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Required field validation - base fields for all users
    const baseRequiredFields = [
      'firstName', 'lastName', 'phoneNumber', 'gender', 'dateOfBirth',
      'address', 'city', 'state', 'zip', 'country'
    ];

    // Add role-specific required fields
    let requiredFields = [...baseRequiredFields];
    
    if (user?.role === 'patient') {
      // Patients don't need email, password, or certificate
    } else if (user?.role === 'physiotherapist') {
      // Physiotherapists need certificate but not email/password
      requiredFields.push('certificate');
    }

    requiredFields.forEach(field => {
      if (!formData[field]) {
        const fieldName = field === 'dateOfBirth' ? 'Date of Birth' : 
                         field === 'phoneNumber' ? 'Phone Number' :
                         field.charAt(0).toUpperCase() + field.slice(1);
        newErrors[field] = `${fieldName} is required`;
      }
    });

    // Email validation (only if email field is present)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation (only if password field is present)
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
      }
    }

    // Phone number validation
    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Use';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing/selecting
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    
    // Complete the registration process
    console.log('Personal information submitted:', formData);
    
    // Update user context to mark registration as complete
    login({ 
      ...user, 
      isRegistrationComplete: true,
      personalInfo: formData 
    });
    
    // Redirect based on user role
    if (user?.role === 'patient') {
      navigate('/patient-dashboard');
    } else if (user?.role === 'physiotherapist') {
      navigate('/physio-dashboard');
    }
  };

  const isPhysiotherapist = user?.role === 'physiotherapist';
  const isPatient = user?.role === 'patient';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Personal Information</h2>
            <p className="text-white">
              Complete your {user?.role === 'patient' ? 'patient' : 'physiotherapist'} profile to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two-column grid for form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your first name"
                    required
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.firstName && <p className="mt-1 text-sm text-red-200">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your last name"
                    required
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.lastName && <p className="mt-1 text-sm text-red-200">{errors.lastName}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your phone number"
                    required
                  />
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-200">{errors.phoneNumber}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Gender
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      errors.gender ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.gender && <p className="mt-1 text-sm text-red-200">{errors.gender}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'
                    }`}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-200">{errors.dateOfBirth}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Street address"
                    required
                  />
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.address && <p className="mt-1 text-sm text-red-200">{errors.address}</p>}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter your city"
                  required
                />
                {errors.city && <p className="mt-1 text-sm text-red-200">{errors.city}</p>}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.state ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter your state"
                  required
                />
                {errors.state && <p className="mt-1 text-sm text-red-200">{errors.state}</p>}
              </div>

              {/* ZIP */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  ZIP
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.zip ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter ZIP code"
                  required
                />
                {errors.zip && <p className="mt-1 text-sm text-red-200">{errors.zip}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Country
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      errors.country ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  >
                    <option value="">Select country</option>
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                    <option value="fr">France</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.country && <p className="mt-1 text-sm text-red-200">{errors.country}</p>}
              </div>
            </div>

            {/* Full-width fields */}
            <div className="space-y-6">
              {/* Certificate Upload for Physiotherapists Only */}
              {isPhysiotherapist && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Upload Certificate or License
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="certificate"
                      onChange={handleChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                        errors.certificate ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.certificate && <p className="mt-1 text-sm text-red-200">{errors.certificate}</p>}
                  <p className="mt-2 text-sm text-white opacity-80">
                    Upload your professional certificate or license (PDF, JPG, PNG)
                  </p>
                </div>
              )}

              {/* Terms Agreement */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
                    errors.agreeToTerms ? 'border-red-500' : ''
                  }`}
                />
                <div>
                  <label className="text-sm text-white">
                    I have read and agree to the{' '}
                    <a href="#" className="text-blue-200 hover:text-blue-100 underline">
                      Terms of Use
                    </a>
                  </label>
                  {errors.agreeToTerms && <p className="mt-1 text-sm text-red-200">{errors.agreeToTerms}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200"
              >
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;