import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Edit2, Save, X, Upload, AlertCircle, Camera, Mail, Phone, Building2, MapPin, Globe, Hash, User, DollarSign, CreditCard } from 'lucide-react';
import DashboardLayout from '../../layout/DashboardLayout';
import profileApi from '../../api/profileApi';
import { updateProfile as updateProfileAction } from '../../redux/slices/userSlice';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await profileApi.getProfileDetails();
        setProfileData(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          company_name: data.profile?.company_name || '',
          phone_number: data.profile?.phone_number || '',
          address: data.profile?.address || '',
          city: data.profile?.city || '',
          state: data.profile?.state || '',
          country: data.profile?.country || '',
          zip_code: data.profile?.zip_code || '',
          currency: data.profile?.currency || 'pkr',
          allow_platform_gateway: data.profile?.allow_platform_gateway || false,
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);


  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      // Automatically save the profile picture
      const saveProfilePicture = async () => {
        try {
          const pictureFormData = new FormData();
          pictureFormData.append('profile_picture', file);
          await profileApi.uploadProfilePicture(pictureFormData);
          
          // Update local state
          setProfileData(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              profile_picture: previewUrl
            }
          }));
          
          toast.success('Profile picture updated successfully');
        } catch (error) {
          console.error('Error updating profile picture:', error);
          toast.error('Failed to update profile picture');
          // Reset preview if upload fails
          setPreviewUrl(null);
          setProfilePicture(null);
        }
      };
      
      // No need to wait for this to complete
      saveProfilePicture();
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone number validation (optional)
    if (formData.phone_number && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }
    
    // Name validation
    if (formData.first_name && formData.first_name.length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }
    
    if (formData.last_name && formData.last_name.length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }
    
    // ZIP code validation (optional)
    if (formData.zip_code && !/^[0-9]{5}(-[0-9]{4})?$/.test(formData.zip_code)) {
      newErrors.zip_code = 'Please enter a valid ZIP code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    try {
      setSaving(true);
      
      // Update profile data
      const updatedProfile = await profileApi.updateProfile(formData);
      
      // Update local state
      const updatedProfileData = {
        ...profileData,
        ...formData,
        profile: {
          ...profileData.profile,
          company_name: formData.company_name,
          phone_number: formData.phone_number,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zip_code: formData.zip_code,
          currency: formData.currency,
          allow_platform_gateway: formData.allow_platform_gateway,
        },
      };
      
      setProfileData(updatedProfileData);
      
      // Update Redux store
      dispatch(updateProfileAction(updatedProfileData));
      
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // Cancel edit mode
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
        company_name: profileData.profile?.company_name || '',
        phone_number: profileData.profile?.phone_number || '',
        address: profileData.profile?.address || '',
        city: profileData.profile?.city || '',
        state: profileData.profile?.state || '',
        country: profileData.profile?.country || '',
        zip_code: profileData.profile?.zip_code || '',
        currency: profileData.profile?.currency || 'pkr',
        allow_platform_gateway: profileData.profile?.allow_platform_gateway || false,
      });
      setProfilePicture(null);
      setPreviewUrl(null);
    }
    setEditMode(!editMode);
  };

  // Render profile information field with icon
  const renderField = (label, value, fieldName, icon = null) => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        {editMode ? (
          <div className="relative">
            {icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {React.cloneElement(icon, { className: "h-5 w-5 text-gray-400" })}
              </div>
            )}
            <input
              type="text"
              name={fieldName}
              value={formData[fieldName] || ''}
              onChange={handleInputChange}
              placeholder={`Enter your ${label.toLowerCase()}`}
              className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] bg-white shadow-sm transition-colors`}
            />
            {errors[fieldName] && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors[fieldName]}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            {icon && React.cloneElement(icon, { className: "h-5 w-5 text-gray-400 mr-2" })}
            <p className="text-gray-800 py-2 text-lg">{value || 'Not provided'}</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={toggleEditMode}
              className={`inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                editMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-[#F97316] hover:bg-[#EA580C]'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] transition-colors`}
            >
              {editMode ? (
                <>
                  <X className="mr-2 h-5 w-5" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="mr-2 h-5 w-5" />
                  Edit Profile
                </>
              )}
            </button>
            {editMode && (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`ml-4 inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${saving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-[#F97316] h-32"></div>
              <div className="px-6 pb-6 -mt-16 flex flex-col items-center">
                <div className="relative inline-block">
                  {/* Show preview URL if available, otherwise show profile picture or default avatar */}
                  <div className="overflow-hidden w-32 h-32 rounded-full border-4 border-white shadow-lg">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : profileData?.profile?.profile_picture ? (
                      <img
                        src={profileData?.profile?.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#F97316] to-orange-600 flex items-center justify-center text-white text-4xl font-medium">
                        {profileData?.first_name?.[0] || profileData?.username?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  
                  {/* Always show the edit icon for profile picture, regardless of edit mode */}
                  <div className="absolute bottom-1 right-1">
                    <label htmlFor="profile-picture" className="flex items-center justify-center cursor-pointer bg-white rounded-full p-2 shadow-md border border-gray-100 hover:bg-gray-50 transition-colors">
                      <Edit2 className="h-4 w-4 text-[#F97316]" />
                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                      />
                    </label>
                  </div>
                </div>
                <h2 className="mt-5 text-2xl font-bold text-gray-800">
                  {profileData?.first_name} {profileData?.last_name}
                </h2>
                <p className="text-gray-500 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-1.5" />
                  {profileData?.email}
                </p>
                {profileData?.profile?.company_name && (
                  <p className="text-gray-500 flex items-center mt-1">
                    <Building2 className="h-4 w-4 mr-1.5" />
                    {profileData.profile.company_name}
                  </p>
                )}
                
                
                <div className="mt-6 w-full pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Profile Photo</h3>
                  <p className="text-xs text-gray-500 mb-2">Accepted file types: JPG, PNG, GIF</p>
                  <p className="text-xs text-gray-500">Maximum file size: 5MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-[#F97316] bg-opacity-10 p-2 rounded-lg mr-3">
                  <User className="h-5 w-5 text-neutral-100" />
                </span>
                General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {renderField('First Name', profileData?.first_name, 'first_name', <User />)}
                {renderField('Last Name', profileData?.last_name, 'last_name', <User />)}
                {renderField('Email', profileData?.email, 'email', <Mail />)}
                {renderField('Company Name', profileData?.profile?.company_name, 'company_name', <Building2 />)}
                {renderField('Phone Number', profileData?.profile?.phone_number, 'phone_number', <Phone />)}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mt-10 mb-6 flex items-center">
                <span className="bg-[#F97316] bg-opacity-10 p-2 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-neutral-100" />
                </span>
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="md:col-span-2">
                  {renderField('Address', profileData?.profile?.address, 'address', <MapPin />)}
                </div>
                {renderField('City', profileData?.profile?.city, 'city', <Building2 />)}
                {renderField('State/Province', profileData?.profile?.state, 'state', <MapPin />)}
                {renderField('Country', profileData?.profile?.country, 'country', <Globe />)}
                {renderField('ZIP/Postal Code', profileData?.profile?.zip_code, 'zip_code', <Hash />)}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mt-10 mb-6 flex items-center">
                <span className="bg-[#F97316] bg-opacity-10 p-2 rounded-lg mr-3">
                  <DollarSign className="h-5 w-5 text-neutral-100" />
                </span>
                Currency & Payment Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Currency</label>
                  {editMode ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="currency"
                        value={formData.currency || 'pkr'}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] bg-white shadow-sm transition-colors"
                      >
                        <option value="pkr">PKR - Pakistani Rupee</option>
                        <option value="usd">USD - US Dollar</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-gray-800 py-2 text-lg">
                        {profileData?.profile?.currency === 'usd' ? 'USD - US Dollar' : 'PKR - Pakistani Rupee'}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Payment Gateway Settings</label>
                  {editMode ? (
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        id="allow_platform_gateway"
                        name="allow_platform_gateway"
                        checked={formData.allow_platform_gateway || false}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#F97316] border-gray-300 rounded focus:ring-[#F97316]"
                      />
                      <label htmlFor="allow_platform_gateway" className="ml-2 text-gray-700">
                        Allow platform payment gateway
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-gray-800 py-2 text-lg">
                        {profileData?.profile?.allow_platform_gateway ? 'Platform gateway enabled' : 'Platform gateway disabled'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {editMode && (
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <div className="flex justify-end">
                    <button
                      onClick={toggleEditMode}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors mr-4"
                    >
                      <X className="inline mr-2 h-5 w-5" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className={`px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${saving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="inline mr-2 h-5 w-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
