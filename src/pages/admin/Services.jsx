import React, { useState, useEffect } from 'react';
import { servicesApi } from '../../utils/apiService';
import { uploadToCloudinary, deleteFromCloudinary, getOptimizedImageUrl } from '../../utils/cloudinary';
import { Plus, Edit, Trash2, Save, X, Loader, Upload } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/AlertDialog';

const Services = () => {
  const [services, setServices] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentService, setCurrentService] = useState({
    title: '',
    description: '',
    image: '',
    imagePublicId: '',
    icon: '',
    iconPublicId: '',
    pagePath: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error) {
      toast.error(error.message || 'Error fetching services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentService(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Delete old image if exists
      if (currentService.imagePublicId) {
        await deleteFromCloudinary(currentService.imagePublicId);
      }

      const result = await uploadToCloudinary(file, {
        folder: 'services/images',
        transformation: 'w_1200,h_800,c_fill,q_auto,f_auto'
      });

      setCurrentService(prev => ({
        ...prev,
        image: result.url,
        imagePublicId: result.publicId
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'image/svg+xml') {
      toast.error('Please upload an SVG file for the icon');
      return;
    }

    setIsUploading(true);
    try {
      // Delete old icon if exists
      if (currentService.iconPublicId) {
        await deleteFromCloudinary(currentService.iconPublicId);
      }

      const result = await uploadToCloudinary(file, {
        folder: 'services/icons'
      });

      setCurrentService(prev => ({
        ...prev,
        icon: result.url,
        iconPublicId: result.publicId
      }));
      toast.success('Icon uploaded successfully');
    } catch (error) {
      toast.error('Error uploading icon');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const serviceData = {
        ...currentService,
        image: getOptimizedImageUrl(currentService.image, { width: 1200, height: 800 }),
        icon: currentService.icon
      };

      if (isEditing) {
        await servicesApi.update(currentService._id, serviceData);
        toast.success('Service updated successfully');
      } else {
        await servicesApi.create(serviceData);
        toast.success('Service added successfully');
      }
      
      resetForm();
      fetchServices();
    } catch (error) {
      toast.error(error.message || (isEditing ? 'Error updating service' : 'Error adding service'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    try {
      // Delete images from Cloudinary
      if (serviceToDelete.imagePublicId) {
        await deleteFromCloudinary(serviceToDelete.imagePublicId);
      }
      if (serviceToDelete.iconPublicId) {
        await deleteFromCloudinary(serviceToDelete.iconPublicId);
      }

      await servicesApi.delete(serviceToDelete._id);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      toast.error(error.message || 'Error deleting service');
    } finally {
      setServiceToDelete(null);
    }
  };

  const resetForm = () => {
    setCurrentService({
      title: '',
      description: '',
      image: '',
      imagePublicId: '',
      icon: '',
      iconPublicId: '',
      pagePath: ''
    });
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  console.log("currenlt services", services );

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
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 transition-all-smooth"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Choose Image
                  </label>
                  {isUploading && <Loader className="h-5 w-5 animate-spin" />}
                  {currentService.image && (
                    <img
                      src={currentService.image}
                      alt="Preview"
                      className="h-10 w-10 object-cover rounded"
                    />
                  )}
                </div>
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
              <label htmlFor="pagePath" className="text-sm font-medium text-gray-700">
                Page Path (Optional, e.g., pages/casino)
              </label>
              <input
                id="pagePath"
                name="pagePath"
                type="text"
                value={currentService.pagePath}
                onChange={handleInputChange}
                placeholder="pages/casino"
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Service Icon (SVG)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/svg+xml"
                  onChange={handleIconUpload}
                  className="hidden"
                  id="icon-upload"
                />
                <label
                  htmlFor="icon-upload"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 transition-all-smooth"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Choose Icon
                </label>
                {isUploading && <Loader className="h-5 w-5 animate-spin" />}
                {currentService.icon && (
                  <img
                    src={currentService.icon}
                    alt="Icon Preview"
                    className="h-10 w-10 object-contain"
                  />
                )}
              </div>
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
                disabled={isSaving || isUploading}
                className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth disabled:opacity-50"
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
            key={service._id} 
            className="bg-white rounded-xl shadow-smooth overflow-hidden hover-scale"
          >
            <div className="aspect-video relative">
              <img 
                src={getOptimizedImageUrl(service.image, { width: 600, height: 400 })}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">{service.title}</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                {service.icon && (
                  <img 
                    src={service.icon}
                    alt={`${service.title} icon`}
                    className="w-10 h-10 object-contain"
                  />
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-all-smooth"
                  >
                    <Edit className="h-5 w-5 text-gray-600" />
                  </button>
                  <AlertDialog 
                    open={serviceToDelete?._id === service._id} 
                    onOpenChange={(open) => !open && setServiceToDelete(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={() => handleDeleteClick(service)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-all-smooth"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the service
                          "{service.title}" and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteConfirm}
                          className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{service.description}</p>
              {service.pagePath && (
                <p className="text-blue-600 text-xs mt-2">
                  Path: {service.pagePath}
                </p>
              )}
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
