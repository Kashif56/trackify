import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { CreditCard, Shield, PlusCircle } from 'lucide-react';
import DashboardLayout from '../../layout/DashboardLayout';
import paymentService from '../../api/paymentService';
import profileApi from '../../api/profileApi';
import bankAccountApi from '../../api/bankAccountApi';
import { updateProfile as updateProfileAction, updateBankAccount } from '../../redux/slices/userSlice';
import BankAccountDisplay from '../../components/BankAccountDisplay';
import AddBankAccountModal from '../../components/modals/AddBankAccountModal';
import EditBankAccountModal from '../../components/modals/EditBankAccountModal';
import DeleteBankAccountModal from '../../components/modals/DeleteBankAccountModal';

const PaymentSettingsPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [bankAccountLoading, setBankAccountLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [gateways, setGateways] = useState([]);
  const [availableGateways, setAvailableGateways] = useState([]);
  const [usePlatformGateway, setUsePlatformGateway] = useState(
    user?.profile?.allow_platform_gateway || false
  );
  
  // Bank account modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch user's payment gateways and available gateways
  useEffect(() => {
    const fetchGatewayData = async () => {
      try {
        setLoading(true);
        const [gatewaysData, availableGatewaysData] = await Promise.all([
          paymentService.getPaymentGateways(),
          paymentService.getAvailableGateways()
        ]);
        
        setGateways(gatewaysData.results || []);
        setAvailableGateways(availableGatewaysData.results || []);
        
        // Initialize platform gateway toggle based on user profile
        setUsePlatformGateway(user?.profile?.allow_platform_gateway || false);
      } catch (error) {
        console.error('Error fetching gateway data:', error);
        toast.error('Failed to load payment gateway information');
      } finally {
        setLoading(false);
      }
    };

    fetchGatewayData();
  }, [user?.profile?.allow_platform_gateway]);
  
  // Fetch bank account if not in Redux store
  useEffect(() => {
    const fetchBankAccount = async () => {
      // Skip if bank account is already in Redux store
      if (user?.bank_account) return;
      
      try {
        setBankAccountLoading(true);
        const bankAccountData = await bankAccountApi.getBankAccount();
        dispatch(updateBankAccount(bankAccountData));
      } catch (error) {
        // Only log error, don't show toast as the user might not have a bank account yet
        console.error('Error fetching bank account:', error);
      } finally {
        setBankAccountLoading(false);
      }
    };
    
    fetchBankAccount();
  }, [dispatch, user?.bank_account]);

  // Handle platform gateway toggle
  const handlePlatformGatewayToggle = async (e) => {
    const usesPlatform = e.target.checked;
    setUsePlatformGateway(usesPlatform);
    setSaving(true);
    
    try {
      // Update user profile with new platform gateway preference
      const response = await profileApi.updateProfile({
        allow_platform_gateway: usesPlatform
      });
      
      // Update Redux state with the updated user data
      dispatch(updateProfileAction({
        ...user,
        profile: {
          ...user.profile,
          allow_platform_gateway: usesPlatform
        }
      }));
      
      toast.success(usesPlatform 
        ? 'Now using platform payment gateway' 
        : 'Platform payment gateway disabled');
      
      // If enabling platform gateway, deactivate all user gateways
      if (usesPlatform && gateways.length > 0) {
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
      setUsePlatformGateway(!usesPlatform); // Revert on error
    } finally {
      setSaving(false);
    }
  };

  // Bank account handlers
  const handleAddBankAccount = () => setIsAddModalOpen(true);
  const handleEditBankAccount = () => setIsEditModalOpen(true);
  const handleDeleteBankAccount = () => setIsDeleteModalOpen(true);
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
        </div>
        
        {/* Bank Account Section */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="bg-[#F97316] bg-opacity-10 p-2 rounded-lg mr-3">
                <CreditCard className="h-5 w-5 text-neutral-100" />
              </span>
              Bank Account Details
            </h3>
            {!user?.bank_account && (
              <button
                onClick={handleAddBankAccount}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Bank Account
              </button>
            )}
          </div>
          
          {bankAccountLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F97316]"></div>
            </div>
          ) : (
            <BankAccountDisplay 
              bankAccount={user?.bank_account} 
              onEdit={handleEditBankAccount} 
              onDelete={handleDeleteBankAccount} 
            />
          )}
        </div>

        {/* Payment Gateway Section */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-[#F97316] bg-opacity-10 p-2 rounded-lg mr-3">
              <CreditCard className="h-5 w-5 text-neutral-100" />
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
                    disabled={saving}
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
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bank Account Modals */}
      <AddBankAccountModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <EditBankAccountModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        bankAccount={user?.bank_account}
      />
      
      <DeleteBankAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
      />
    </DashboardLayout>
  );
};

export default PaymentSettingsPage;
