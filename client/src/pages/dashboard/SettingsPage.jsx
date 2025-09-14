import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Settings, CreditCard, Bell, Shield, Save, X, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../layout/DashboardLayout';
import paymentService from '../../api/paymentService';
import StripeGatewayForm from '../../components/Payment/gateways/StripeGatewayForm';
import PayPalGatewayForm from '../../components/Payment/gateways/PayPalGatewayForm';
import RazorpayGatewayForm from '../../components/Payment/gateways/RazorpayGatewayForm';

const SettingsPage = () => {
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('preferences');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gateways, setGateways] = useState([]);
  const [availableGateways, setAvailableGateways] = useState([]);
  const [usePlatformGateway, setUsePlatformGateway] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [userPreferences, setUserPreferences] = useState({
    emailNotifications: true,
    invoiceReminders: true,
    paymentNotifications: true,
    darkMode: false,
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    currencyFormat: 'USD',
  });

  // Fetch user's payment gateways and available gateways
  useEffect(() => {
    const fetchGatewayData = async () => {
      try {
        setLoading(true);
        const [gatewaysData, availableGatewaysData] = await Promise.all([
          paymentService.getPaymentGateways(),
          paymentService.getAvailableGateways()
        ]);
        
        setGateways(gatewaysData.results);

        setAvailableGateways(availableGatewaysData.results);

        
        // If user has no gateways, default to using platform gateway
        if (!gatewaysData || gatewaysData.length === 0) {
          setUsePlatformGateway(true);
        } else {
          // Check if user has a default gateway
          const defaultGateway = Array.isArray(gatewaysData) && gatewaysData.find(gateway => gateway.is_default);
          if (defaultGateway) {
            setUsePlatformGateway(false);
          }
        }
      } catch (error) {
        console.error('Error fetching gateway data:', error);
        toast.error('Failed to load payment gateway information');
      
      } finally {
        setLoading(false);
      }
    };

    fetchGatewayData();
  }, []);

  // Handle preference changes
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Save user preferences
  const savePreferences = () => {
    // This would be connected to an API in a real implementation
    toast.success('Preferences saved successfully');
  };

  // Handle platform gateway toggle
  const handlePlatformGatewayToggle = async (e) => {
    const usesPlatform = e.target.checked;
    setUsePlatformGateway(usesPlatform);
    
    if (usesPlatform) {
      setSelectedGateway(null);
      
      try {
        // Here we would typically make an API call to update user preferences
        // For now, we'll just show a success message
        toast.success('Now using platform payment gateway');
        
        // Deactivate all user gateways if using platform gateway
        if (gateways.length > 0) {
          // In a real implementation, we would call an API to update all gateways
          // For now, we'll just update the local state
          setGateways(gateways.map(gateway => ({
            ...gateway,
            is_active: false
          })));
        }
      } catch (error) {
        console.error('Error updating platform gateway preference:', error);
        toast.error('Failed to update gateway preference');
        setUsePlatformGateway(false); // Revert on error
      }
    }
  };

  // Handle gateway selection
  const handleGatewaySelect = (gatewayName) => {
    setSelectedGateway(gatewayName);
    setUsePlatformGateway(false);
  };
  
  // Set a gateway as default
  const handleSetDefaultGateway = async (gatewayId) => {
    try {
      setSaving(true);
      
      // Find the gateway to update
      const gatewayToUpdate = gateways.find(g => g.id === gatewayId);
      
      if (!gatewayToUpdate) {
        throw new Error('Gateway not found');
      }
      
      // Update the gateway to be default
      const updatedGateway = {
        ...gatewayToUpdate,
        is_default: true
      };
      
      await paymentService.updatePaymentGateway(gatewayId, updatedGateway);
      
      // Update local state - set this gateway as default and others as not default
      setGateways(prevGateways => prevGateways.map(g => ({
        ...g,
        is_default: g.id === gatewayId
      })));
      
      toast.success(`${gatewayToUpdate.gateway_name} set as default payment gateway`);
    } catch (error) {
      console.error('Error setting default gateway:', error);
      toast.error('Failed to set default gateway: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  // Delete a gateway configuration
  const handleDeleteGateway = async (gatewayId) => {
    if (window.confirm('Are you sure you want to delete this payment gateway configuration?')) {
      try {
        setSaving(true);
        await paymentService.deletePaymentGateway(gatewayId);
        
        // Update local state
        setGateways(prevGateways => {
          const updatedGateways = prevGateways.filter(gateway => gateway.id !== gatewayId);
          
          // If we just deleted the last gateway, enable platform gateway
          if (updatedGateways.length === 0) {
            setUsePlatformGateway(true);
          }
          
          // If we just deleted the default gateway, make another one default if available
          const wasDefault = prevGateways.find(g => g.id === gatewayId)?.is_default;
          if (wasDefault && updatedGateways.length > 0) {
            updatedGateways[0].is_default = true;
          }
          
          return updatedGateways;
        });
        
        toast.success('Payment gateway removed successfully');
      } catch (error) {
        console.error('Error deleting gateway:', error);
        toast.error('Failed to remove payment gateway: ' + (error.response?.data?.message || 'Unknown error'));
      } finally {
        setSaving(false);
      }
    }
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'preferences':
        return (
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-[#F97316] bg-opacity-10 p-2 rounded-lg mr-3">
                <Settings className="h-5 w-5 text-[#F97316]" />
              </span>
              User Preferences
            </h3>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="emailNotifications"
                        checked={userPreferences.emailNotifications} 
                        onChange={handlePreferenceChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F97316]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Invoice Reminders</p>
                      <p className="text-sm text-gray-500">Get reminders about upcoming and overdue invoices</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="invoiceReminders"
                        checked={userPreferences.invoiceReminders} 
                        onChange={handlePreferenceChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F97316]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Payment Notifications</p>
                      <p className="text-sm text-gray-500">Get notified when you receive payments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="paymentNotifications"
                        checked={userPreferences.paymentNotifications} 
                        onChange={handlePreferenceChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F97316]"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Display Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Dark Mode</p>
                      <p className="text-sm text-gray-500">Use dark theme for the application</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="darkMode"
                        checked={userPreferences.darkMode} 
                        onChange={handlePreferenceChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F97316]"></div>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Language</label>
                      <select 
                        name="language" 
                        value={userPreferences.language}
                        onChange={handlePreferenceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] bg-white shadow-sm"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Date Format</label>
                      <select 
                        name="dateFormat" 
                        value={userPreferences.dateFormat}
                        onChange={handlePreferenceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] bg-white shadow-sm"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Currency Format</label>
                      <select 
                        name="currencyFormat" 
                        value={userPreferences.currencyFormat}
                        onChange={handlePreferenceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] bg-white shadow-sm"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={savePreferences}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#F97316] hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] transition-colors"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-[#F97316] bg-opacity-10 p-2 rounded-lg mr-3">
                <CreditCard className="h-5 w-5 text-[#F97316]" />
              </span>
              Payment Gateway Settings
            </h3>

            <div className="space-y-6">
              {/* Platform Gateway Option */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">Use Platform Payment Gateway</h4>
                    <p className="text-sm text-gray-500">
                      If you don't have your own payment gateway, you can use our platform's gateway. 
                      Payments will be transferred to your account within 7 days.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={usePlatformGateway} 
                      onChange={handlePlatformGatewayToggle}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F97316]"></div>
                  </label>
                </div>
                {usePlatformGateway && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          You're using the platform's payment gateway. Payments will be processed through our Stripe account and transferred to your bank account within 7 days.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Connected Gateways */}
              {!usePlatformGateway && (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-800">Your Connected Gateways</h4>
                  
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F97316]"></div>
                    </div>
                  ) : gateways.length > 0 ? (
                    <div className="space-y-4">
                      {gateways.map(gateway => (
                        <div key={gateway.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h5 className="font-medium text-gray-800">{gateway.gateway_name.toUpperCase()}</h5>
                            <p className="text-sm text-gray-500">
                              {gateway.is_default && <span className="text-green-600 font-medium mr-2">Default</span>}
                              Connected on {new Date(gateway.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleDeleteGateway(gateway.id)}
                              className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm"
                            >
                              Remove
                            </button>
                            {!gateway.is_default && (
                              <button 
                                onClick={() => handleSetDefaultGateway(gateway.id)}
                                className="px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 text-sm"
                                disabled={saving}
                              >
                                {saving ? 'Setting...' : 'Set Default'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h5 className="text-lg font-medium text-gray-700 mb-1">No Payment Gateways Connected</h5>
                      <p className="text-gray-500 mb-4">Connect a payment gateway to start accepting payments directly to your account</p>
                    </div>
                  )}

                  {/* Add New Gateway */}

                  {gateways.length <= 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Connect a New Gateway</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {Array.isArray(availableGateways) && availableGateways.map(gateway => (
                        <button
                          key={gateway.name}
                          onClick={() => handleGatewaySelect(gateway.name)}
                          className={`border ${selectedGateway === gateway.name ? 'border-[#F97316] ring-2 ring-[#F97316] bg-orange-50' : 'border-gray-200 hover:border-gray-300'} rounded-lg p-4 flex flex-col items-center transition-all`}
                        >
                          <img 
                            src={gateway.logo_url} 
                            alt={gateway.name} 
                            className="h-10 object-contain mb-3" 
                          />
                          <span className="font-medium text-gray-800">{gateway.display_name}</span>
                        </button>
                      ))}
                    </div>
                    
                    {selectedGateway && (
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h5 className="font-medium text-gray-800 mb-4">
                          Connect {selectedGateway.charAt(0).toUpperCase() + selectedGateway.slice(1)}
                        </h5>
                        
                        {selectedGateway === 'stripe' && <StripeGatewayForm />}
                        {selectedGateway === 'paypal' && <PayPalGatewayForm />}
                        {selectedGateway === 'razorpay' && <RazorpayGatewayForm />}
                      </div>
                    )}
                  </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'preferences' ? 'bg-[#F97316] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Settings className={`h-5 w-5 ${activeTab === 'preferences' ? 'text-white' : 'text-gray-500'} mr-3`} />
                    User Preferences
                  </button>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'payment' ? 'bg-[#F97316] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <CreditCard className={`h-5 w-5 ${activeTab === 'payment' ? 'text-white' : 'text-gray-500'} mr-3`} />
                    Payment Gateways
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
