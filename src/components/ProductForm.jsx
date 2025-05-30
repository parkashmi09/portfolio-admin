import React, { useState } from 'react';
import { Plus, Save, Loader, Music, X, Edit, Trash2 } from 'lucide-react';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { toast } from 'sonner';

const ProductForm = ({ product: initialProduct, isEditing, isSaving, onSubmit, onCancel }) => {
  const [product, setProduct] = useState(initialProduct);
  const [isUploading, setIsUploading] = useState({
    hero: false,
    audio: false,
    preview: false,
    showcase: false,
    feature: false
  });
  const [currentFeature, setCurrentFeature] = useState({
    title: '',
    description: '',
    iconUrl: '',
    iconPublicId: ''
  });
  const [currentPreviewItem, setCurrentPreviewItem] = useState({
    title: '',
    desktop: { url: '', publicId: '' },
    mobile: { url: '', publicId: '' }
  });
  const [currentShowcaseItem, setCurrentShowcaseItem] = useState({
    title: '',
    description: '',
    desktop: { url: '', publicId: '' },
    mobile: { url: '', publicId: '' }
  });
  const [editingFeatureIndex, setEditingFeatureIndex] = useState(-1);
  const [editingPreviewIndex, setEditingPreviewIndex] = useState(-1);
  const [editingShowcaseIndex, setEditingShowcaseIndex] = useState(-1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCtaChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      cta: {
        ...prev.cta,
        [name]: value
      }
    }));
  };

  const handlePreviewItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentPreviewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowcaseItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentShowcaseItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setCurrentFeature(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHeroImageUpload = async (file) => {
    if (!file) return;

    setIsUploading(prev => ({ ...prev, hero: true }));
    try {
      // Delete old image if exists
      if (product.heroImage?.publicId) {
        await deleteFromCloudinary(product.heroImage.publicId);
      }

      const result = await uploadToCloudinary(file, {
        folder: 'products/hero',
        transformation: 'q_auto,f_auto' // Preserve original dimensions
      });

      setProduct(prev => ({
        ...prev,
        heroImage: {
          url: result.url,
          publicId: result.publicId
        }
      }));
      toast.success('Hero image uploaded successfully');
    } catch (error) {
      toast.error('Error uploading hero image');
    } finally {
      setIsUploading(prev => ({ ...prev, hero: false }));
    }
  };

  const handleAudioUpload = async (file) => {
    if (!file) return;

    setIsUploading(prev => ({ ...prev, audio: true }));
    try {
      // Delete old audio if exists
      if (product.audio?.publicId) {
        await deleteFromCloudinary(product.audio.publicId);
      }

      const result = await uploadToCloudinary(file, {
        folder: 'products/audio',
        resource_type: 'auto' // Allow non-image uploads
      });

      setProduct(prev => ({
        ...prev,
        audio: {
          url: result.url,
          publicId: result.publicId
        }
      }));
      toast.success('Audio uploaded successfully');
    } catch (error) {
      toast.error('Error uploading audio');
    } finally {
      setIsUploading(prev => ({ ...prev, audio: false }));
    }
  };

  const handlePreviewImageUpload = async (file, type) => {
    if (!file) return;

    setIsUploading(prev => ({ ...prev, preview: true }));
    try {
      // Delete old image if exists
      if (currentPreviewItem[type]?.publicId) {
        await deleteFromCloudinary(currentPreviewItem[type].publicId);
      }

      const result = await uploadToCloudinary(file, {
        folder: `products/previews/${type}`,
        transformation: 'q_auto,f_auto' // Preserve original dimensions
      });

      setCurrentPreviewItem(prev => ({
        ...prev,
        [type]: {
          url: result.url,
          publicId: result.publicId
        }
      }));
      toast.success(`${type} preview image uploaded successfully`);
    } catch (error) {
      toast.error(`Error uploading ${type} preview image`);
    } finally {
      setIsUploading(prev => ({ ...prev, preview: false }));
    }
  };

  const handleShowcaseImageUpload = async (file, type) => {
    if (!file) return;

    setIsUploading(prev => ({ ...prev, showcase: true }));
    try {
      // Delete old image if exists
      if (currentShowcaseItem[type]?.publicId) {
        await deleteFromCloudinary(currentShowcaseItem[type].publicId);
      }

      const result = await uploadToCloudinary(file, {
        folder: `products/showcase/${type}`,
        transformation: 'q_auto,f_auto' // Preserve original dimensions
      });

      setCurrentShowcaseItem(prev => ({
        ...prev,
        [type]: {
          url: result.url,
          publicId: result.publicId
        }
      }));
      toast.success(`${type} showcase image uploaded successfully`);
    } catch (error) {
      toast.error(`Error uploading ${type} showcase image`);
    } finally {
      setIsUploading(prev => ({ ...prev, showcase: false }));
    }
  };

  const handleFeatureIconUpload = async (file) => {
    if (!file) return;

    setIsUploading(prev => ({ ...prev, feature: true }));
    try {
      // Delete old icon if exists
      if (currentFeature.iconPublicId) {
        await deleteFromCloudinary(currentFeature.iconPublicId);
      }

      const result = await uploadToCloudinary(file, {
        folder: 'products/features',
        transformation: 'q_auto,f_auto'
      });

      setCurrentFeature(prev => ({
        ...prev,
        iconUrl: result.url,
        iconPublicId: result.publicId
      }));
      toast.success('Feature icon uploaded successfully');
    } catch (error) {
      toast.error('Error uploading feature icon');
    } finally {
      setIsUploading(prev => ({ ...prev, feature: false }));
    }
  };

  const addPreviewItem = () => {
    if (!currentPreviewItem.title || !currentPreviewItem.desktop.url) {
      toast.error('Please provide a title and desktop image');
      return;
    }

    if (editingPreviewIndex >= 0) {
      // Update existing item
      const updatedItems = [...product.previewItems];
      updatedItems[editingPreviewIndex] = currentPreviewItem;
      setProduct(prev => ({ ...prev, previewItems: updatedItems }));
      setEditingPreviewIndex(-1);
    } else {
      // Add new item
      setProduct(prev => ({
        ...prev,
        previewItems: [...prev.previewItems, currentPreviewItem]
      }));
    }

    // Reset form
    setCurrentPreviewItem({
      title: '',
      desktop: { url: '', publicId: '' },
      mobile: { url: '', publicId: '' }
    });
  };

  const addShowcaseItem = () => {
    if (!currentShowcaseItem.title || !currentShowcaseItem.description || !currentShowcaseItem.desktop.url) {
      toast.error('Please provide a title, description, and desktop image');
      return;
    }

    if (editingShowcaseIndex >= 0) {
      // Update existing item
      const updatedItems = [...product.showcaseItems];
      updatedItems[editingShowcaseIndex] = currentShowcaseItem;
      setProduct(prev => ({ ...prev, showcaseItems: updatedItems }));
      setEditingShowcaseIndex(-1);
    } else {
      // Add new item
      setProduct(prev => ({
        ...prev,
        showcaseItems: [...prev.showcaseItems, currentShowcaseItem]
      }));
    }

    // Reset form
    setCurrentShowcaseItem({
      title: '',
      description: '',
      desktop: { url: '', publicId: '' },
      mobile: { url: '', publicId: '' }
    });
  };

  const addFeature = () => {
    if (!currentFeature.title || !currentFeature.description || !currentFeature.iconUrl) {
      toast.error('Please provide title, description, and icon for the feature');
      return;
    }

    if (editingFeatureIndex >= 0) {
      // Update existing feature
      const updatedFeatures = [...(product.features || [])];
      updatedFeatures[editingFeatureIndex] = currentFeature;
      setProduct(prev => ({
        ...prev,
        features: updatedFeatures
      }));
      setEditingFeatureIndex(-1);
    } else {
      // Add new feature
      setProduct(prev => ({
        ...prev,
        features: [...(prev.features || []), currentFeature]
      }));
    }

    // Reset form
    setCurrentFeature({
      title: '',
      description: '',
      iconUrl: '',
      iconPublicId: ''
    });
  };

  const editPreviewItem = (index) => {
    setCurrentPreviewItem(product.previewItems[index]);
    setEditingPreviewIndex(index);
  };

  const editShowcaseItem = (index) => {
    setCurrentShowcaseItem(product.showcaseItems[index]);
    setEditingShowcaseIndex(index);
  };

  const editFeature = (index) => {
    const feature = product.features?.[index];
    if (feature) {
      setCurrentFeature(feature);
      setEditingFeatureIndex(index);
    }
  };

  const removePreviewItem = async (index) => {
    const item = product.previewItems[index];
    
    // Delete images from Cloudinary
    try {
      if (item.desktop?.publicId) {
        await deleteFromCloudinary(item.desktop.publicId);
      }
      if (item.mobile?.publicId) {
        await deleteFromCloudinary(item.mobile.publicId);
      }
    } catch (error) {
      toast.error('Error deleting preview images');
    }
    
    // Remove item from array
    const updatedItems = [...product.previewItems];
    updatedItems.splice(index, 1);
    setProduct(prev => ({ ...prev, previewItems: updatedItems }));
    
    // Reset editing state if needed
    if (editingPreviewIndex === index) {
      setEditingPreviewIndex(-1);
      setCurrentPreviewItem({
        title: '',
        desktop: { url: '', publicId: '' },
        mobile: { url: '', publicId: '' }
      });
    }
  };

  const removeShowcaseItem = async (index) => {
    const item = product.showcaseItems[index];
    
    // Delete images from Cloudinary
    try {
      if (item.desktop?.publicId) {
        await deleteFromCloudinary(item.desktop.publicId);
      }
      if (item.mobile?.publicId) {
        await deleteFromCloudinary(item.mobile.publicId);
      }
    } catch (error) {
      toast.error('Error deleting showcase images');
    }
    
    // Remove item from array
    const updatedItems = [...product.showcaseItems];
    updatedItems.splice(index, 1);
    setProduct(prev => ({ ...prev, showcaseItems: updatedItems }));
    
    // Reset editing state if needed
    if (editingShowcaseIndex === index) {
      setEditingShowcaseIndex(-1);
      setCurrentShowcaseItem({
        title: '',
        description: '',
        desktop: { url: '', publicId: '' },
        mobile: { url: '', publicId: '' }
      });
    }
  };

  const removeFeature = async (index) => {
    const feature = product.features?.[index];
    
    // Delete icon from Cloudinary
    try {
      if (feature?.iconPublicId) {
        await deleteFromCloudinary(feature.iconPublicId);
      }
    } catch (error) {
      toast.error('Error deleting feature icon');
    }
    
    // Remove feature from array
    const updatedFeatures = [...(product.features || [])];
    updatedFeatures.splice(index, 1);
    setProduct(prev => ({
      ...prev,
      features: updatedFeatures
    }));
    
    // Reset editing state if needed
    if (editingFeatureIndex === index) {
      setEditingFeatureIndex(-1);
      setCurrentFeature({
        title: '',
        description: '',
        iconUrl: '',
        iconPublicId: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={product.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
            Subtitle
          </label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={product.subtitle}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="pagePath" className="block text-sm font-medium text-gray-700">
            Page Path
          </label>
          <input
            type="text"
            id="pagePath"
            name="pagePath"
            value={product.pagePath}
            onChange={handleInputChange}
            placeholder="/products/your-product-path"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            rows={4}
            className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={product.active}
            onChange={handleInputChange}
            className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
          />
          Active
        </label>
      </div>

      {/* Hero Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Hero Image
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleHeroImageUpload(e.target.files[0])}
            className="hidden"
            id="hero-image-upload"
          />
          <label
            htmlFor="hero-image-upload"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 transition-all-smooth"
          >
            <Plus className="h-5 w-5 mr-2" />
            Choose Image
          </label>
          {isUploading.hero && <Loader className="h-5 w-5 animate-spin" />}
          {product.heroImage?.url && (
            <div className="relative">
              <img
                src={product.heroImage.url}
                alt="Hero Preview"
                className="h-20 w-auto max-w-[200px] object-contain rounded"
              />
            </div>
          )}
        </div>
      </div>

      {/* Audio Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Audio (Optional)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => handleAudioUpload(e.target.files[0])}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 transition-all-smooth"
          >
            <Music className="h-5 w-5 mr-2" />
            Choose Audio
          </label>
          {isUploading.audio && <Loader className="h-5 w-5 animate-spin" />}
          {product.audio?.url && (
            <div className="flex items-center space-x-2">
              <audio controls className="h-8 w-40">
                <source src={product.audio.url} />
                Your browser does not support the audio element.
              </audio>
              <button
                type="button"
                onClick={async () => {
                  try {
                    if (product.audio?.publicId) {
                      await deleteFromCloudinary(product.audio.publicId);
                    }
                    setProduct(prev => ({
                      ...prev,
                      audio: { url: '', publicId: '' }
                    }));
                    toast.success('Audio removed');
                  } catch (error) {
                    toast.error('Error removing audio');
                  }
                }}
                className="p-1 bg-red-50 rounded-full text-red-500 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="text" className="text-sm font-medium text-gray-700">
            Primary CTA Text
          </label>
          <input
            id="text"
            name="text"
            type="text"
            value={product.cta.text}
            onChange={handleCtaChange}
            className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="secondaryText" className="text-sm font-medium text-gray-700">
            Secondary CTA Text
          </label>
          <input
            id="secondaryText"
            name="secondaryText"
            type="text"
            value={product.cta.secondaryText}
            onChange={handleCtaChange}
            className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Features</h3>
        
        {/* Add Feature Form */}
        <div className="space-y-4 mb-6">
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
              <label htmlFor="featureDescription" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                id="featureDescription"
                name="description"
                type="text"
                value={currentFeature.description}
                onChange={handleFeatureChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
              />
            </div>
          </div>
          
          {/* Icon Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Icon
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFeatureIconUpload(e.target.files[0])}
                className="hidden"
                id="feature-icon-upload"
              />
              <label
                htmlFor="feature-icon-upload"
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 text-sm transition-all-smooth"
              >
                <Plus className="h-4 w-4 mr-1" />
                Upload Icon
              </label>
              {isUploading.feature && <Loader className="h-4 w-4 animate-spin" />}
              {currentFeature.iconUrl && (
                <img
                  src={currentFeature.iconUrl}
                  alt="Feature Icon"
                  className="h-8 w-8 object-contain rounded"
                />
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center shadow-sm hover:bg-blue-700 transition-all-smooth"
            >
              <Plus className="h-5 w-5 mr-2" />
              {editingFeatureIndex >= 0 ? 'Update Feature' : 'Add Feature'}
            </button>
          </div>
        </div>
        
        {/* Features List */}
        { product.features && product.features.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Added Features:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.features.map((feature, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-start">
                  <div className="flex space-x-3">
                    {feature.iconUrl && (
                      <img 
                        src={feature.iconUrl} 
                        alt={feature.title} 
                        className="w-8 h-8 object-contain rounded flex-shrink-0"
                      />
                    )}
                    <div>
                      <h5 className="font-medium text-sm">{feature.title}</h5>
                      <p className="text-xs text-gray-500 line-clamp-2">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => editFeature(index)}
                      className="p-1.5 rounded-lg hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-1.5 rounded-lg hover:bg-red-50"
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

      {/* Preview Items Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Preview Items</h3>
        
        {/* Add Preview Item Form */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="previewTitle" className="text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="previewTitle"
                name="title"
                type="text"
                value={currentPreviewItem.title}
                onChange={handlePreviewItemChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Desktop Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Desktop Image
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePreviewImageUpload(e.target.files[0], 'desktop')}
                  className="hidden"
                  id="preview-desktop-upload"
                />
                <label
                  htmlFor="preview-desktop-upload"
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 text-sm transition-all-smooth"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Upload
                </label>
                {isUploading.preview && <Loader className="h-4 w-4 animate-spin" />}
                {currentPreviewItem.desktop?.url && (
                  <img
                    src={currentPreviewItem.desktop.url}
                    alt="Desktop Preview"
                    className="h-10 w-auto max-w-[100px] object-contain rounded"
                  />
                )}
              </div>
            </div>
            
            {/* Mobile Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mobile Image (Optional)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePreviewImageUpload(e.target.files[0], 'mobile')}
                  className="hidden"
                  id="preview-mobile-upload"
                />
                <label
                  htmlFor="preview-mobile-upload"
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 text-sm transition-all-smooth"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Upload
                </label>
                {isUploading.preview && <Loader className="h-4 w-4 animate-spin" />}
                {currentPreviewItem.mobile?.url && (
                  <img
                    src={currentPreviewItem.mobile.url}
                    alt="Mobile Preview"
                    className="h-10 w-auto max-w-[100px] object-contain rounded"
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addPreviewItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center shadow-sm hover:bg-blue-700 transition-all-smooth"
            >
              <Plus className="h-5 w-5 mr-2" />
              {editingPreviewIndex >= 0 ? 'Update Preview' : 'Add Preview'}
            </button>
          </div>
        </div>
        
        {/* Preview Items List */}
        {product.previewItems.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Added Previews:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.previewItems.map((item, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {item.desktop?.url && (
                      <img 
                        src={item.desktop.url} 
                        alt={item.title} 
                        className="w-12 h-12 object-contain rounded"
                      />
                    )}
                    <span className="font-medium text-sm">{item.title}</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => editPreviewItem(index)}
                      className="p-1.5 rounded-lg hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePreviewItem(index)}
                      className="p-1.5 rounded-lg hover:bg-red-50"
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

      {/* Showcase Items Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Showcase Items</h3>
        
        {/* Add Showcase Item Form */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="showcaseTitle" className="text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="showcaseTitle"
                name="title"
                type="text"
                value={currentShowcaseItem.title}
                onChange={handleShowcaseItemChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="showcaseDescription" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                id="showcaseDescription"
                name="description"
                type="text"
                value={currentShowcaseItem.description}
                onChange={handleShowcaseItemChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Desktop Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Desktop Image
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleShowcaseImageUpload(e.target.files[0], 'desktop')}
                  className="hidden"
                  id="showcase-desktop-upload"
                />
                <label
                  htmlFor="showcase-desktop-upload"
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 text-sm transition-all-smooth"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Upload
                </label>
                {isUploading.showcase && <Loader className="h-4 w-4 animate-spin" />}
                {currentShowcaseItem.desktop?.url && (
                  <img
                    src={currentShowcaseItem.desktop.url}
                    alt="Desktop Showcase"
                    className="h-10 w-auto max-w-[100px] object-contain rounded"
                  />
                )}
              </div>
            </div>
            
            {/* Mobile Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mobile Image (Optional)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleShowcaseImageUpload(e.target.files[0], 'mobile')}
                  className="hidden"
                  id="showcase-mobile-upload"
                />
                <label
                  htmlFor="showcase-mobile-upload"
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 text-sm transition-all-smooth"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Upload
                </label>
                {isUploading.showcase && <Loader className="h-4 w-4 animate-spin" />}
                {currentShowcaseItem.mobile?.url && (
                  <img
                    src={currentShowcaseItem.mobile.url}
                    alt="Mobile Showcase"
                    className="h-10 w-auto max-w-[100px] object-contain rounded"
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addShowcaseItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center shadow-sm hover:bg-blue-700 transition-all-smooth"
            >
              <Plus className="h-5 w-5 mr-2" />
              {editingShowcaseIndex >= 0 ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </div>
        
        {/* Showcase Items List */}
        {product.showcaseItems.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Added Showcase Items:</h4>
            <div className="space-y-3">
              {product.showcaseItems.map((item, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-start">
                  <div className="flex space-x-3">
                    {item.desktop?.url && (
                      <img 
                        src={item.desktop.url} 
                        alt={item.title} 
                        className="w-12 h-12 object-contain rounded flex-shrink-0"
                      />
                    )}
                    <div>
                      <h5 className="font-medium text-sm">{item.title}</h5>
                      <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => editShowcaseItem(index)}
                      className="p-1.5 rounded-lg hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeShowcaseItem(index)}
                      className="p-1.5 rounded-lg hover:bg-red-50"
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

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all-smooth"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || !product.title || !product.description || !product.heroImage?.url}
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};

export default ProductForm; 