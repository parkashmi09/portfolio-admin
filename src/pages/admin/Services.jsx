
import React, { useState, useEffect } from 'react';
import { getData, addItem, updateItem, deleteItem } from '../../utils/dataService';
import FileUploader from '../../components/FileUploader';
import { Plus, Edit, Trash2, Save, X, Loader } from 'lucide-react';
import { toast } from 'sonner';

const Services = () => {
  const [services, setServices] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentService, setCurrentService] = useState({
    title: '',
    description: '',
    image: '',
    icon: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getData('services');
      setServices(data);
    } catch (error) {
      toast.error('Error fetching services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentService(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url) => {
    setCurrentService(prev => ({ ...prev, image: url }));
  };

  const handleIconUpload = (url) => {
    setCurrentService(prev => ({ ...prev, icon: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditing) {
        await updateItem('services', currentService.id, currentService);
        toast.success('Service updated successfully');
      } else {
        await addItem('services', currentService);
        toast.success('Service added successfully');
      }
      
      resetForm();
      fetchServices();
    } catch (error) {
      toast.error(isEditing ? 'Error updating service' : 'Error adding service');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setCurrentService({
      title: '',
      description: '',
      image: '',
      icon: ''
    });
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteItem('services', id);
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error) {
        toast.error('Error deleting service');
      }
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-gray-500 mt-1">Manage your services</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth"
        >
          {isFormOpen ? (
            <>
              <X className="h-5 w-5 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Add Service
            </>
          )}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-smooth p-6 animate-scale-in">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Service' : 'Add New Service'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={currentService.title}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Service Image
                </label>
                <FileUploader 
                  onFileUploaded={handleImageUpload} 
                  label="Upload Service Image"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={currentService.description}
                onChange={handleInputChange}
                rows={4}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Service Icon (SVG)
              </label>
              <FileUploader 
                onFileUploaded={handleIconUpload} 
                acceptedTypes="image/svg+xml"
                label="Upload SVG Icon"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all-smooth"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth"
              >
                {isSaving ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    {isEditing ? 'Update' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div 
            key={service.id} 
            className="bg-white rounded-xl shadow-smooth overflow-hidden hover-scale"
          >
            <div className="aspect-video relative">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">{service.title}</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="bg-primary/10 p-2 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: service.icon }}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-all-smooth"
                  >
                    <Edit className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 rounded-lg hover:bg-red-100 transition-all-smooth"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No services found. Create your first service!</p>
        </div>
      )}
    </div>
  );
};

export default Services;
