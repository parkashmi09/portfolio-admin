import React, { useState, useEffect } from 'react';
import { heroApi } from '../../utils/apiService';
import { uploadToCloudinary, deleteFromCloudinary, getOptimizedImageUrl } from '../../utils/cloudinary';
import { Plus, Edit, Trash2, Save, X, Loader, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState({
    title: '',
    content: '',
    imageUrl: '',
    imagePublicId: '',
    logo: '',
    cta: '',
    location: '',
    date: '',
    hasLocation: false,
    order: 0,
    active: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      const data = await heroApi.getAll();
      setSlides(data);
    } catch (error) {
      toast.error('Error fetching hero slides');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentSlide(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    try {
      // Delete old image if exists
      if (currentSlide.imagePublicId) {
        await deleteFromCloudinary(currentSlide.imagePublicId);
      }

      const result = await uploadToCloudinary(file, {
        folder: 'hero',
        transformation: 'q_auto,f_auto' // Only optimize quality, preserve original dimensions
      });

      setCurrentSlide(prev => ({
        ...prev,
        imageUrl: result.url,
        imagePublicId: result.publicId
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const slideData = {
        ...currentSlide,
        imageUrl: currentSlide.imageUrl // Use original image URL without any transformations
      };

      if (isEditing) {
        await heroApi.update(currentSlide._id, slideData);
        toast.success('Hero slide updated successfully');
      } else {
        await heroApi.create(slideData);
        toast.success('Hero slide added successfully');
      }
      
      resetForm();
      fetchSlides();
    } catch (error) {
      toast.error(isEditing ? 'Error updating hero slide' : 'Error adding hero slide');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setCurrentSlide({
      title: '',
      content: '',
      imageUrl: '',
      imagePublicId: '',
      logo: '',
      cta: '',
      location: '',
      date: '',
      hasLocation: false,
      order: 0,
      active: true
    });
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const handleEdit = (slide) => {
    setCurrentSlide(slide);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        const slideToDelete = slides.find(slide => slide._id === id);
        if (slideToDelete?.imagePublicId) {
          await deleteFromCloudinary(slideToDelete.imagePublicId);
        }
        await heroApi.delete(id);
        toast.success('Hero slide deleted successfully');
        fetchSlides();
      } catch (error) {
        toast.error('Error deleting hero slide');
      }
    }
  };

  const handleReorder = async (slideId, direction) => {
    const currentIndex = slides.findIndex(slide => slide._id === slideId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === slides.length - 1)
    ) {
      return;
    }

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap order values
    const temp = newSlides[currentIndex].order;
    newSlides[currentIndex].order = newSlides[targetIndex].order;
    newSlides[targetIndex].order = temp;

    // Swap positions in array
    [newSlides[currentIndex], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[currentIndex]];

    try {
      await heroApi.reorder({ slides: newSlides });
      setSlides(newSlides);
      toast.success('Slides reordered successfully');
    } catch (error) {
      toast.error('Error reordering slides');
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
          <h1 className="text-2xl font-bold tracking-tight">Hero Carousel</h1>
          <p className="text-gray-500 mt-1">Manage your hero carousel slides</p>
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
              Add Slide
            </>
          )}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-smooth p-6 animate-scale-in">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Hero Slide' : 'Add New Hero Slide'}
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
                  value={currentSlide.title}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="cta" className="text-sm font-medium text-gray-700">
                  CTA Text
                </label>
                <input
                  id="cta"
                  name="cta"
                  type="text"
                  value={currentSlide.cta}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={currentSlide.content}
                onChange={handleInputChange}
                rows={4}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Background Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 transition-all-smooth"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Choose Image
                </label>
                {isUploading && <Loader className="h-5 w-5 animate-spin" />}
                {currentSlide.imageUrl && (
                  <img
                    src={currentSlide.imageUrl}
                    alt="Preview"
                    className="h-20 w-auto max-w-[200px] object-contain rounded"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="logo" className="text-sm font-medium text-gray-700">
                  Logo URL (Optional)
                </label>
                <input
                  id="logo"
                  name="logo"
                  type="text"
                  value={currentSlide.logo}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location (Optional)
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={currentSlide.location}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Date (Optional)
                </label>
                <input
                  id="date"
                  name="date"
                  type="text"
                  value={currentSlide.date}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasLocation"
                  checked={currentSlide.hasLocation}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Has Location</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={currentSlide.active}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
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

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <div 
            key={slide._id} 
            className="bg-white rounded-xl shadow-smooth overflow-hidden hover:shadow-soft transition-all-smooth"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <div className="aspect-video md:h-full relative">
                  <img 
                    src={slide.imageUrl}
                    alt={slide.title} 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{slide.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {slide.hasLocation && (
                        <>
                          {slide.location && <span className="mr-3">{slide.location}</span>}
                          {slide.date && <span>{slide.date}</span>}
                        </>
                      )}
                    </p>
                    <p className="text-gray-600 line-clamp-2">{slide.content}</p>
                    <div className="mt-3 flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-500">CTA: {slide.cta}</span>
                      {!slide.active && (
                        <span className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleReorder(slide._id, 'up')}
                      disabled={index === 0}
                      className={`p-2 rounded-lg transition-all-smooth ${
                        index === 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <ArrowUp className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleReorder(slide._id, 'down')}
                      disabled={index === slides.length - 1}
                      className={`p-2 rounded-lg transition-all-smooth ${
                        index === slides.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <ArrowDown className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-all-smooth"
                    >
                      <Edit className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide._id)}
                      className="p-2 rounded-lg hover:bg-red-100 transition-all-smooth"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No hero slides found. Create your first slide!</p>
        </div>
      )}
    </div>
  );
};

export default Hero; 