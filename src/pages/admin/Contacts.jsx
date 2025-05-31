import React, { useState, useEffect } from 'react';
import { Search, Trash2, Loader, Phone, Mail, ExternalLink, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { getContacts, deleteContact } from '../../services/contactService';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const itemsPerPage = 10;

  const sources = ['Google', 'Social Media', 'Referral', 'Direct', 'Other'];

  useEffect(() => {
    fetchContacts();
  }, [currentPage]);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, selectedSource, sortBy]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const data = await getContacts(currentPage, itemsPerPage);
      setContacts(data.contacts);
      setFilteredContacts(data.contacts);
      setTotalPages(data.totalPages);
      setTotalContacts(data.totalContacts);
    } catch (error) {
      toast.error('Error fetching contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const filterContacts = () => {
    let results = [...contacts];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        contact => 
          contact.name.toLowerCase().includes(term) || 
          contact.email.toLowerCase().includes(term) ||
          contact.message.toLowerCase().includes(term)
      );
    }
    
    if (selectedSource) {
      results = results.filter(contact => contact.source === selectedSource);
    }
    
    switch (sortBy) {
      case 'date-asc':
        results.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'date-desc':
        results.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'name-asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredContacts(results);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        toast.success('Contact deleted successfully');
        fetchContacts();
      } catch (error) {
        toast.error('Error deleting contact');
      }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSource('');
    setSortBy('date-desc');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact Submissions</h1>
        <p className="text-gray-500 mt-1">Manage contact form submissions</p>
      </div>

      <div className="bg-white rounded-xl shadow-smooth p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="block w-full pl-10 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
            >
              <option value="">All sources</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-between space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
            
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-all-smooth"
            >
              Clear
            </button>
          </div>
        </div>

        {filteredContacts.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">Name</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">Contact Info</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">Source</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">Date</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 border-b">Message</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50 transition-all-smooth">
                      <td className="py-4 px-4 border-b">
                        <div className="font-medium text-gray-900">{contact.name}</div>
                      </td>
                      <td className="py-4 px-4 border-b">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center text-gray-500">
                            <Mail className="h-4 w-4 mr-2" />
                            <a 
                              href={`mailto:${contact.email}`} 
                              className="hover:text-primary"
                            >
                              {contact.email}
                            </a>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center text-gray-500">
                              <Phone className="h-4 w-4 mr-2" />
                              <a 
                                href={`tel:${contact.phone}`} 
                                className="hover:text-primary"
                              >
                                {contact.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 border-b">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {contact.source}
                        </span>
                      </td>
                      <td className="py-4 px-4 border-b text-gray-500">
                        {formatDate(contact.date)}
                      </td>
                      <td className="py-4 px-4 border-b">
                        <div className="max-w-xs truncate text-gray-500" title={contact.message}>
                          {contact.message}
                        </div>
                      </td>
                      <td className="py-4 px-4 border-b text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              const mailtoBody = encodeURIComponent(
                                `Hello ${contact.name},\n\nThank you for your message. I'm writing in response to your inquiry.\n\nBest regards,\n${process.env.COMPANY_NAME}`
                              );
                              window.open(`mailto:${contact.email}?subject=Re: Your Inquiry&body=${mailtoBody}`);
                            }}
                            className="p-2 rounded-lg hover:bg-blue-100 transition-all-smooth text-blue-600"
                            title="Reply by email"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(contact._id)}
                            className="p-2 rounded-lg hover:bg-red-100 transition-all-smooth text-red-500"
                            title="Delete contact"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalContacts)} of {totalContacts} contacts
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all-smooth"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all-smooth"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {contacts.length === 0 ? (
              <p>No contact submissions yet.</p>
            ) : (
              <p>No contacts match your filters. <button onClick={handleClearFilters} className="text-primary underline">Clear filters</button></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
