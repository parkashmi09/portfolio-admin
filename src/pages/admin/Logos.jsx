
import React, { useState, useEffect } from 'react';
import { getData, addItem, updateItem, deleteItem } from '../../utils/dataService';
import FileUploader from '../../components/FileUploader';
import { Plus, Edit, Trash2, Save, X, Loader, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const Logos = () => {
  const [logos, setLogos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLogo, setCurrentLogo] = useState({
    name: '',
    image: '',
    size: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const data = await getData('logos');
      setLogos(data);
    } catch (error) {
      toast.error('Error fetching logos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLogo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url) => {
    setCurrentLogo(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditing) {
        await updateItem('logos', currentLogo.id, currentLogo);
        toast.success('Logo updated successfully');
      } else {
        await addItem('logos', currentLogo);
        toast.success('Logo added successfully');
      }
      
      resetForm();
      fetchLogos();
    } catch (error) {
      toast.error(isEditing ? 'Error updating logo' : 'Error adding logo');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setCurrentLogo({
      name: '',
      image: '',
      size: ''
    });
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const handleEdit = (logo) => {
    setCurrentLogo(logo);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this logo?')) {
      try {
        await deleteItem('logos', id);
        toast.success('Logo deleted successfully');
        fetchLogos();
      } catch (error) {
        toast.error('Error deleting logo');
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

  const commonSizes = [
    '16x16px', '32x32px', '64x64px', '100x100px', 
    '200x100px', '300x150px', '400x200px', '500x250px'
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Logos</h1>
          <p className="text-gray-500 mt-1">Manage your logos and branding assets</p>
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
              Add Logo
            </>
          )}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-smooth p-6 animate-scale-in">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Logo' : 'Add New Logo'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Logo Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={currentLogo.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Main Logo, Footer Logo, Favicon"
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="size" className="text-sm font-medium text-gray-700">
                  Logo Size
                </label>
                <div className="relative">
                  <input
                    id="size"
                    name="size"
                    type="text"
                    value={currentLogo.size}
                    onChange={handleInputChange}
                    placeholder="e.g. 200x100px"
                    className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                    required
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {commonSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setCurrentLogo(prev => ({ ...prev, size }))}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-all-smooth"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Logo Image
              </label>
              <FileUploader 
                onFileUploaded={handleImageUpload} 
                label="Upload Logo Image"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended formats: SVG, PNG with transparent background
              </p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {logos.map((logo) => (
          <div 
            key={logo.id} 
            className="bg-white rounded-xl shadow-smooth overflow-hidden hover-scale"
          >
            <div className="aspect-video relative bg-gray-50 p-4 flex items-center justify-center">
              {logo.image ? (
                <img 
                  src={logo.image} 
                  alt={logo.name} 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <ImageIcon className="h-12 w-12 text-gray-300" />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{logo.name}</h3>
                  <p className="text-sm text-gray-500">{logo.size}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(logo)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-all-smooth"
                  >
                    <Edit className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(logo.id)}
                    className="p-2 rounded-lg hover:bg-red-100 transition-all-smooth"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {logos.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No logos found. Add your first logo!</p>
        </div>
      )}
    </div>
  );
};

export default Logos;
