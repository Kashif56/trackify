import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Plus, Search, Edit, Trash2, Eye, 
  ChevronLeft, ChevronRight, User, Building
} from 'lucide-react';
import { toast } from 'react-toastify';

// Import components and services
import DashboardLayout from '../../../layout/DashboardLayout';
import clientService from '../../../api/clientService';
import AddClientModal from '../../../components/Dashboard/Modals/AddClientModal';
import EditClientModal from '../../../components/Dashboard/Modals/EditClientModal';
import DeleteClientModal from '../../../components/Dashboard/Modals/DeleteClientModal';

/**
 * ClientsPage Component
 * 
 * A page for managing clients with functionality for adding, updating, and deleting clients.
 */
const ClientsPage = () => {
  const dispatch = useDispatch();
  
  // State for clients data
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Function to fetch clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data.results || data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch clients');
      toast.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.company_name && client.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);


  const handleAddClient = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDeleteClient = (client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleAddClientSubmit = async (clientData) => {
    try {
      setLoading(true);
      await clientService.createClient(clientData);
      toast.success('Client added successfully');
      setIsAddModalOpen(false);
      fetchClients();
    } catch (err) {
      toast.error(err.message || 'Failed to add client');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClientSubmit = async (clientData) => {
    try {
      setLoading(true);
      await clientService.updateClient(selectedClient.id, clientData);
      toast.success('Client updated successfully');
      setIsEditModalOpen(false);
      setSelectedClient(null);
      fetchClients();
    } catch (err) {
      toast.error(err.message || 'Failed to update client');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClientSubmit = async () => {
    try {
      setLoading(true);
      await clientService.deleteClient(selectedClient.id);
      toast.success('Client deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
      fetchClients();
    } catch (err) {
      toast.error(err.message || 'Failed to delete client');
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Clients</h1>
          <button
            onClick={handleAddClient}
            className="flex items-center px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-md transition-colors duration-200"
            aria-label="Add new client"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Client
          </button>
        </div>

        

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                placeholder="Search clients by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {loading && clients.length === 0 ? (
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th scope="col" className="px-6 py-4 font-medium text-gray-700">Name</th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-700">Email</th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-700">Company</th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-700">Phone</th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-700 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentClients.length > 0 ? (
                      currentClients.map((client) => (
                        <tr key={client.id} className="bg-white hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                            {client.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {client.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {client.company_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {client.phone_number || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex justify-end space-x-3">
                              
                              <button
                                onClick={() => handleEditClient(client)}
                                className="text-[#F97316] hover:text-[#EA580C] p-1 rounded-full hover:bg-orange-50 transition-colors duration-200"
                                title="Edit Client"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClient(client)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                                title="Delete Client"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-white">
                        <td colSpan="5" className="px-6 py-10 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="h-12 w-12 text-gray-300 mb-3">
                              <User className="h-12 w-12" />
                            </div>
                            <p className="text-gray-500 font-medium">No clients found</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {searchTerm ? 'Try adjusting your search' : 'Add your first client to get started'}
                            </p>
                            {searchTerm && (
                              <button
                                onClick={() => setSearchTerm('')}
                                className="mt-3 text-[#F97316] hover:text-[#EA580C] text-sm font-medium"
                              >
                                Clear search
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredClients.length > itemsPerPage && (
                <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredClients.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredClients.length}</span> clients
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      } border border-gray-200`}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      } border border-gray-200`}
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modals */}
        {isAddModalOpen && (
          <AddClientModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddClientSubmit}
          />
        )}

        {isEditModalOpen && selectedClient && (
          <EditClientModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedClient(null);
            }}
            onSubmit={handleEditClientSubmit}
            client={selectedClient}
          />
        )}

        {isDeleteModalOpen && selectedClient && (
          <DeleteClientModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedClient(null);
            }}
            onConfirm={handleDeleteClientSubmit}
            client={selectedClient}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage;
