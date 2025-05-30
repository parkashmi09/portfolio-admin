import React, { useState, useEffect } from 'react';
import { servicesApi } from '../../utils/apiService';
import { uploadToCloudinary, deleteFromCloudinary, getOptimizedImageUrl } from '../../utils/cloudinary';
import { Plus, Edit, Trash2, Save, X, Loader, Upload, ChevronUp, ChevronDown } from 'lucide-react';
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
    pagePath: '',
    slides: [],
    overview: {
      title: '',
      subtitle: '',
      items: []
    },
    overviewCards: [],
    keyFeatures: [],
    benefits: [],
    active: true,
    order: 0
  });
  
  const [currentSlide, setCurrentSlide] = useState({
    title: '',
    content: '',
    image: { url: '', publicId: '' },
    icon: { url: '', publicId: '' },
    cta: 'Get Started',
    hasLocation: false
  });
  
  const [currentOverviewItem, setCurrentOverviewItem] = useState({
    title: '',
    description: '',
    icon: ''
  });
  
  const [currentOverviewCard, setCurrentOverviewCard] = useState({
    title: '',
    description: '',
    image: { url: '', publicId: '' }
  });
  
  const [currentFeature, setCurrentFeature] = useState({
    title: '',
    description: '',
    icon: ''
  });
  
  const [currentBenefit, setCurrentBenefit] = useState('');
  
  const [editingSlideIndex, setEditingSlideIndex] = useState(-1);
  const [editingOverviewItemIndex, setEditingOverviewItemIndex] = useState(-1);
  const [editingOverviewCardIndex, setEditingOverviewCardIndex] = useState(-1);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState(-1);
  const [editingBenefitIndex, setEditingBenefitIndex] = useState(-1);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState({
    main: false,
    icon: false,
    slide: false,
    overviewCard: false
  });
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [activeSection, setActiveSection] = useState('basic');

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

    setIsUploading(prev => ({ ...prev, main: true }));
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
      setIsUploading(prev => ({ ...prev, main: false }));
    }
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'image/svg+xml') {
      toast.error('Please upload an SVG file for the icon');
      return;
    }

    setIsUploading(prev => ({ ...prev, icon: true }));
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
      setIsUploading(prev => ({ ...prev, icon: false }));
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
      pagePath: '',
      slides: [],
      overview: {
        title: '',
        subtitle: '',
        items: []
      },
      overviewCards: [],
      keyFeatures: [],
      benefits: [],
      active: true,
      order: 0
    });
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  // Slide Handlers
  const handleSlideChange = (e) => {
    const { name, value } = e.target;
    setCurrentSlide(prev => ({ ...prev, [name]: value }));
  };

  const handleSlideImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, slide: true }));
    try {
      // Delete old image if exists
      if (currentSlide[type]?.publicId) {
        await deleteFromCloudinary(currentSlide[type].publicId);
      }

      const result = await uploadToCloudinary(file, {
        folder: `services/slides/${type}`,
        transformation: type === 'image' ? 'w_1920,h_1080,c_fill,q_auto,f_auto' : ''
      });

      setCurrentSlide(prev => ({
        ...prev,
        [type]: {
          url: result.url,
          publicId: result.publicId
        }
      }));
      toast.success(`Slide ${type} uploaded successfully`);
    } catch (error) {
      toast.error(`Error uploading slide ${type}`);
    } finally {
      setIsUploading(prev => ({ ...prev, slide: false }));
    }
  };

  const addSlide = () => {
    if (!currentSlide.title || !currentSlide.content || !currentSlide.image.url) {
      toast.error('Please provide title, content, and image for the slide');
      return;
    }

    const slideToAdd = {
      ...currentSlide,
      icon: currentSlide.icon?.url ? currentSlide.icon : undefined
    };

    if (editingSlideIndex >= 0) {
      const updatedSlides = [...currentService.slides];
      updatedSlides[editingSlideIndex] = slideToAdd;
      setCurrentService(prev => ({ ...prev, slides: updatedSlides }));
      setEditingSlideIndex(-1);
    } else {
      setCurrentService(prev => ({
        ...prev,
        slides: [...prev.slides, slideToAdd]
      }));
    }

    setCurrentSlide({
      title: '',
      content: '',
      image: { url: '', publicId: '' },
      icon: { url: '', publicId: '' },
      cta: 'Get Started',
      hasLocation: false
    });
  };

  // Overview Handlers
  const handleOverviewChange = (e) => {
    const { name, value } = e.target;
    setCurrentService(prev => ({
      ...prev,
      overview: { ...prev.overview, [name]: value }
    }));
  };

  const handleOverviewItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentOverviewItem(prev => ({ ...prev, [name]: value }));
  };

  const addOverviewItem = () => {
    if (!currentOverviewItem.title || !currentOverviewItem.description || !currentOverviewItem.icon) {
      toast.error('Please provide title, description, and icon for the overview item');
      return;
    }

    if (editingOverviewItemIndex >= 0) {
      const updatedItems = [...currentService.overview.items];
      updatedItems[editingOverviewItemIndex] = currentOverviewItem;
      setCurrentService(prev => ({
        ...prev,
        overview: { ...prev.overview, items: updatedItems }
      }));
      setEditingOverviewItemIndex(-1);
    } else {
      setCurrentService(prev => ({
        ...prev,
        overview: {
          ...prev.overview,
          items: [...prev.overview.items, currentOverviewItem]
        }
      }));
    }

    setCurrentOverviewItem({
      title: '',
      description: '',
      icon: ''
    });
  };

  // Overview Cards Handlers
  const handleOverviewCardChange = (e) => {
    const { name, value } = e.target;
    setCurrentOverviewCard(prev => ({ ...prev, [name]: value }));
  };

  const handleOverviewCardImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, overviewCard: true }));
    try {
      // Delete old image if exists
      if (currentOverviewCard.image?.publicId) {
        await deleteFromCloudinary(currentOverviewCard.image.publicId);
      }

      const result = await uploadToCloudinary(file, {
        folder: 'services/overview-cards',
        transformation: 'w_800,h_600,c_fill,q_auto,f_auto'
      });

      setCurrentOverviewCard(prev => ({
        ...prev,
        image: {
          url: result.url,
          publicId: result.publicId
        }
      }));
      toast.success('Overview card image uploaded successfully');
    } catch (error) {
      toast.error('Error uploading overview card image');
    } finally {
      setIsUploading(prev => ({ ...prev, overviewCard: false }));
    }
  };

  const addOverviewCard = () => {
    if (!currentOverviewCard.title || !currentOverviewCard.description || !currentOverviewCard.image.url) {
      toast.error('Please provide title, description, and image for the overview card');
      return;
    }

    if (editingOverviewCardIndex >= 0) {
      const updatedCards = [...currentService.overviewCards];
      updatedCards[editingOverviewCardIndex] = currentOverviewCard;
      setCurrentService(prev => ({ ...prev, overviewCards: updatedCards }));
      setEditingOverviewCardIndex(-1);
    } else {
      setCurrentService(prev => ({
        ...prev,
        overviewCards: [...prev.overviewCards, currentOverviewCard]
      }));
    }

    setCurrentOverviewCard({
      title: '',
      description: '',
      image: { url: '', publicId: '' }
    });
  };

  // Key Features Handlers
  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setCurrentFeature(prev => ({ ...prev, [name]: value }));
  };

  const addFeature = () => {
    if (!currentFeature.title || !currentFeature.description || !currentFeature.icon) {
      toast.error('Please provide title, description, and icon for the feature');
      return;
    }

    if (editingFeatureIndex >= 0) {
      const updatedFeatures = [...currentService.keyFeatures];
      updatedFeatures[editingFeatureIndex] = currentFeature;
      setCurrentService(prev => ({ ...prev, keyFeatures: updatedFeatures }));
      setEditingFeatureIndex(-1);
    } else {
      setCurrentService(prev => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, currentFeature]
      }));
    }

    setCurrentFeature({
      title: '',
      description: '',
      icon: ''
    });
  };

  // Benefits Handlers
  const handleBenefitChange = (e) => {
    setCurrentBenefit(e.target.value);
  };

  const addBenefit = () => {
    if (!currentBenefit) {
      toast.error('Please provide a benefit');
      return;
    }

    if (editingBenefitIndex >= 0) {
      const updatedBenefits = [...currentService.benefits];
      updatedBenefits[editingBenefitIndex] = currentBenefit;
      setCurrentService(prev => ({ ...prev, benefits: updatedBenefits }));
      setEditingBenefitIndex(-1);
    } else {
      setCurrentService(prev => ({
        ...prev,
        benefits: [...prev.benefits, currentBenefit]
      }));
    }

    setCurrentBenefit('');
  };

  // Delete Handlers
  const deleteSlide = async (index) => {
    const slide = currentService.slides[index];
    try {
      if (slide.image?.publicId) {
        await deleteFromCloudinary(slide.image.publicId);
      }
      if (slide.icon?.publicId) {
        await deleteFromCloudinary(slide.icon.publicId);
      }
      const updatedSlides = [...currentService.slides];
      updatedSlides.splice(index, 1);
      setCurrentService(prev => ({ ...prev, slides: updatedSlides }));
      toast.success('Slide deleted successfully');
    } catch (error) {
      toast.error('Error deleting slide');
    }
  };

  const deleteOverviewItem = (index) => {
    const updatedItems = [...currentService.overview.items];
    updatedItems.splice(index, 1);
    setCurrentService(prev => ({
      ...prev,
      overview: { ...prev.overview, items: updatedItems }
    }));
  };

  const deleteOverviewCard = async (index) => {
    const card = currentService.overviewCards[index];
    try {
      if (card.image?.publicId) {
        await deleteFromCloudinary(card.image.publicId);
      }
      const updatedCards = [...currentService.overviewCards];
      updatedCards.splice(index, 1);
      setCurrentService(prev => ({ ...prev, overviewCards: updatedCards }));
      toast.success('Overview card deleted successfully');
    } catch (error) {
      toast.error('Error deleting overview card');
    }
  };

  const deleteFeature = (index) => {
    const updatedFeatures = [...currentService.keyFeatures];
    updatedFeatures.splice(index, 1);
    setCurrentService(prev => ({ ...prev, keyFeatures: updatedFeatures }));
  };

  const deleteBenefit = (index) => {
    const updatedBenefits = [...currentService.benefits];
    updatedBenefits.splice(index, 1);
    setCurrentService(prev => ({ ...prev, benefits: updatedBenefits }));
  };

  // Edit Handlers
  const editSlide = (index) => {
    setCurrentSlide(currentService.slides[index]);
    setEditingSlideIndex(index);
  };

  const editOverviewItem = (index) => {
    setCurrentOverviewItem(currentService.overview.items[index]);
    setEditingOverviewItemIndex(index);
  };

  const editOverviewCard = (index) => {
    setCurrentOverviewCard(currentService.overviewCards[index]);
    setEditingOverviewCardIndex(index);
  };

  const editFeature = (index) => {
    setCurrentFeature(currentService.keyFeatures[index]);
    setEditingFeatureIndex(index);
  };

  const editBenefit = (index) => {
    setCurrentBenefit(currentService.benefits[index]);
    setEditingBenefitIndex(index);
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
          
          {/* Section Navigation */}
          <div className="flex space-x-2 mb-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveSection('basic')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeSection === 'basic'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('slides')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeSection === 'slides'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Slides
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeSection === 'overview'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('cards')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeSection === 'cards'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('features')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeSection === 'features'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('benefits')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeSection === 'benefits'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Benefits
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <div className="space-y-6">
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
                      {isUploading.main && <Loader className="h-5 w-5 animate-spin" />}
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
                    {isUploading.icon && <Loader className="h-5 w-5 animate-spin" />}
                    {currentService.icon && (
                      <img
                        src={currentService.icon}
                        alt="Icon Preview"
                        className="h-10 w-10 object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Slides Section */}
            {activeSection === 'slides' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Add Slide</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="slideTitle" className="text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          id="slideTitle"
                          name="title"
                          type="text"
                          value={currentSlide.title}
                          onChange={handleSlideChange}
                          className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="slideCta" className="text-sm font-medium text-gray-700">
                          CTA Text
                        </label>
                        <input
                          id="slideCta"
                          name="cta"
                          type="text"
                          value={currentSlide.cta}
                          onChange={handleSlideChange}
                          className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="slideContent" className="text-sm font-medium text-gray-700">
                        Content
                      </label>
                      <textarea
                        id="slideContent"
                        name="content"
                        value={currentSlide.content}
                        onChange={handleSlideChange}
                        rows={3}
                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Slide Image Upload */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Slide Image
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSlideImageUpload(e, 'image')}
                            className="hidden"
                            id="slide-image-upload"
                          />
                          <label
                            htmlFor="slide-image-upload"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 transition-all-smooth"
                          >
                            <Upload className="h-5 w-5 mr-2" />
                            Choose Image
                          </label>
                          {isUploading.slide && <Loader className="h-5 w-5 animate-spin" />}
                          {currentSlide.image?.url && (
                            <img
                              src={currentSlide.image.url}
                              alt="Slide Preview"
                              className="h-10 w-10 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>

                      {/* Slide Icon Upload */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Slide Icon
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSlideImageUpload(e, 'icon')}
                            className="hidden"
                            id="slide-icon-upload"
                          />
                          <label
                            htmlFor="slide-icon-upload"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 transition-all-smooth"
                          >
                            <Upload className="h-5 w-5 mr-2" />
                            Choose Icon
                          </label>
                          {isUploading.slide && <Loader className="h-5 w-5 animate-spin" />}
                          {currentSlide.icon?.url && (
                            <img
                              src={currentSlide.icon.url}
                              alt="Icon Preview"
                              className="h-10 w-10 object-contain rounded"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hasLocation"
                        name="hasLocation"
                        checked={currentSlide.hasLocation}
                        onChange={(e) => handleSlideChange({
                          target: {
                            name: 'hasLocation',
                            value: e.target.checked
                          }
                        })}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="hasLocation" className="text-sm font-medium text-gray-700">
                        Has Location
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addSlide}
                        className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        {editingSlideIndex >= 0 ? 'Update Slide' : 'Add Slide'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slides List */}
                {currentService.slides.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Added Slides:</h4>
                    <div className="space-y-3">
                      {currentService.slides.map((slide, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-start"
                        >
                          <div className="flex space-x-4">
                            {slide.image?.url && (
                              <img
                                src={slide.image.url}
                                alt={slide.title}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )}
                            <div>
                              <h5 className="font-medium">{slide.title}</h5>
                              <p className="text-sm text-gray-500 line-clamp-2">{slide.content}</p>
                              <div className="flex items-center mt-2 space-x-2">
                                {slide.icon?.url && (
                                  <img
                                    src={slide.icon.url}
                                    alt="Icon"
                                    className="w-6 h-6 object-contain"
                                  />
                                )}
                                <span className="text-sm text-primary">{slide.cta}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => editSlide(index)}
                              className="p-2 rounded-lg hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSlide(index)}
                              className="p-2 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Overview Title and Subtitle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="overviewTitle" className="text-sm font-medium text-gray-700">
                      Overview Title
                    </label>
                    <input
                      id="overviewTitle"
                      name="title"
                      type="text"
                      value={currentService.overview.title}
                      onChange={handleOverviewChange}
                      className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="overviewSubtitle" className="text-sm font-medium text-gray-700">
                      Overview Subtitle
                    </label>
                    <input
                      id="overviewSubtitle"
                      name="subtitle"
                      type="text"
                      value={currentService.overview.subtitle}
                      onChange={handleOverviewChange}
                      className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                    />
                  </div>
                </div>

                {/* Overview Items */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Add Overview Item</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="itemTitle" className="text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          id="itemTitle"
                          name="title"
                          type="text"
                          value={currentOverviewItem.title}
                          onChange={handleOverviewItemChange}
                          className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="itemIcon" className="text-sm font-medium text-gray-700">
                          Icon Name (e.g., Bitcoin, ShieldCheck)
                        </label>
                        <input
                          id="itemIcon"
                          name="icon"
                          type="text"
                          value={currentOverviewItem.icon}
                          onChange={handleOverviewItemChange}
                          className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="itemDescription" className="text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="itemDescription"
                        name="description"
                        value={currentOverviewItem.description}
                        onChange={handleOverviewItemChange}
                        rows={3}
                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addOverviewItem}
                        className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        {editingOverviewItemIndex >= 0 ? 'Update Item' : 'Add Item'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Overview Items List */}
                {currentService.overview.items.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Added Overview Items:</h4>
                    <div className="space-y-3">
                      {currentService.overview.items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-start"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-primary">{item.icon}</span>
                              <h5 className="font-medium">{item.title}</h5>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => editOverviewItem(index)}
                              className="p-2 rounded-lg hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteOverviewItem(index)}
                              className="p-2 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Overview Cards Section */}
            {activeSection === 'cards' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Add Overview Card</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="cardTitle" className="text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        id="cardTitle"
                        name="title"
                        type="text"
                        value={currentOverviewCard.title}
                        onChange={handleOverviewCardChange}
                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="cardDescription" className="text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="cardDescription"
                        name="description"
                        value={currentOverviewCard.description}
                        onChange={handleOverviewCardChange}
                        rows={3}
                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Card Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleOverviewCardImageUpload}
                          className="hidden"
                          id="card-image-upload"
                        />
                        <label
                          htmlFor="card-image-upload"
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 transition-all-smooth"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Choose Image
                        </label>
                        {isUploading.overviewCard && <Loader className="h-5 w-5 animate-spin" />}
                        {currentOverviewCard.image?.url && (
                          <img
                            src={currentOverviewCard.image.url}
                            alt="Card Preview"
                            className="h-10 w-10 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addOverviewCard}
                        className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        {editingOverviewCardIndex >= 0 ? 'Update Card' : 'Add Card'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Overview Cards List */}
                {currentService.overviewCards.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Added Overview Cards:</h4>
                    <div className="space-y-3">
                      {currentService.overviewCards.map((card, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-start"
                        >
                          <div className="flex space-x-4">
                            {card.image?.url && (
                              <img
                                src={card.image.url}
                                alt={card.title}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )}
                            <div>
                              <h5 className="font-medium">{card.title}</h5>
                              <p className="text-sm text-gray-500 line-clamp-2">{card.description}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => editOverviewCard(index)}
                              className="p-2 rounded-lg hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteOverviewCard(index)}
                              className="p-2 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Key Features Section */}
            {activeSection === 'features' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Add Key Feature</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="featureTitle" className="text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          id="featureTitle"
                          name="title"
                          type="text"
                          value={currentFeature.title}
                          onChange={handleFeatureChange}
                          className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="featureIcon" className="text-sm font-medium text-gray-700">
                          Icon Name (e.g., Zap, Shield)
                        </label>
                        <input
                          id="featureIcon"
                          name="icon"
                          type="text"
                          value={currentFeature.icon}
                          onChange={handleFeatureChange}
                          className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="featureDescription" className="text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="featureDescription"
                        name="description"
                        value={currentFeature.description}
                        onChange={handleFeatureChange}
                        rows={3}
                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        {editingFeatureIndex >= 0 ? 'Update Feature' : 'Add Feature'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Key Features List */}
                {currentService.keyFeatures.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Added Key Features:</h4>
                    <div className="space-y-3">
                      {currentService.keyFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-start"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-primary">{feature.icon}</span>
                              <h5 className="font-medium">{feature.title}</h5>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => editFeature(index)}
                              className="p-2 rounded-lg hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteFeature(index)}
                              className="p-2 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Benefits Section */}
            {activeSection === 'benefits' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Add Benefit</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="benefit" className="text-sm font-medium text-gray-700">
                        Benefit Text
                      </label>
                      <input
                        id="benefit"
                        type="text"
                        value={currentBenefit}
                        onChange={handleBenefitChange}
                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addBenefit}
                        className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        {editingBenefitIndex >= 0 ? 'Update Benefit' : 'Add Benefit'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Benefits List */}
                {currentService.benefits.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Added Benefits:</h4>
                    <div className="space-y-3">
                      {currentService.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"
                        >
                          <p className="text-gray-700">{benefit}</p>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => editBenefit(index)}
                              className="p-2 rounded-lg hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteBenefit(index)}
                              className="p-2 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                disabled={isSaving || isUploading.main || isUploading.icon || isUploading.slide || isUploading.overviewCard}
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

              {/* Additional Sections Summary */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {service.slides.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Slides:</span>
                    {service.slides.length}
                  </div>
                )}
                
                {service.overview.items.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Overview Items:</span>
                    {service.overview.items.length}
                  </div>
                )}
                
                {service.overviewCards.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Overview Cards:</span>
                    {service.overviewCards.length}
                  </div>
                )}
                
                {service.keyFeatures.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Key Features:</span>
                    {service.keyFeatures.length}
                  </div>
                )}
                
                {service.benefits.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Benefits:</span>
                    {service.benefits.length}
                  </div>
                )}
              </div>
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
