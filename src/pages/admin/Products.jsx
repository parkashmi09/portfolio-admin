
import React, { useState, useEffect } from 'react';
import { getData, addItem, updateItem, deleteItem } from '../../utils/dataService';
import FileUploader from '../../components/FileUploader';
import { Plus, Edit, Trash2, Save, X, Loader, Image as ImageIcon, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState({
    title: '',
    description: '',
    price: '',
    heroes: [],
    images: {
      desktop: '',
      mobile: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getData('products');
      setProducts(data);
    } catch (error) {
      toast.error('Error fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleDesktopImageUpload = (url) => {
    setCurrentProduct(prev => ({
      ...prev,
      images: {
        ...prev.images,
        desktop: url
      }
    }));
  };

  const handleMobileImageUpload = (url) => {
    setCurrentProduct(prev => ({
      ...prev,
      images: {
        ...prev.images,
        mobile: url
      }
    }));
  };

  const handleHeroImageChange = (url) => {
    setCurrentHeroImage(url);
  };

  const addHeroImage = () => {
    if (currentHeroImage) {
      setCurrentProduct(prev => ({
        ...prev,
        heroes: [...prev.heroes, currentHeroImage]
      }));
      setCurrentHeroImage('');
      toast.success('Hero image added');
    }
  };

  const removeHeroImage = (index) => {
    setCurrentProduct(prev => ({
      ...prev,
      heroes: prev.heroes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditing) {
        await updateItem('products', currentProduct.id, currentProduct);
        toast.success('Product updated successfully');
      } else {
        await addItem('products', currentProduct);
        toast.success('Product added successfully');
      }
      
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(isEditing ? 'Error updating product' : 'Error adding product');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      title: '',
      description: '',
      price: '',
      heroes: [],
      images: {
        desktop: '',
        mobile: ''
      }
    });
    setCurrentHeroImage('');
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteItem('products', id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Error deleting product');
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
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-gray-500 mt-1">Manage your products</p>
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
              Add Product
            </>
          )}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-smooth p-6 animate-scale-in">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Product' : 'Add New Product'}
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
                  value={currentProduct.title}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentProduct.price}
                    onChange={handleInputChange}
                    className="block w-full pl-10 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                    required
                  />
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
                value={currentProduct.description}
                onChange={handleInputChange}
                rows={4}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hero Images</h3>
              <p className="text-sm text-gray-500">Add multiple hero images for your product carousel</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FileUploader 
                    onFileUploaded={handleHeroImageChange} 
                    label="Upload Hero Image"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addHeroImage}
                    disabled={!currentHeroImage}
                    className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add to Carousel
                  </button>
                </div>
              </div>
              
              {currentProduct.heroes.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {currentProduct.heroes.map((hero, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={hero} 
                        alt={`Hero ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeroImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Desktop Image
                </label>
                <FileUploader 
                  onFileUploaded={handleDesktopImageUpload} 
                  label="Upload Desktop Image"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mobile Image
                </label>
                <FileUploader 
                  onFileUploaded={handleMobileImageUpload} 
                  label="Upload Mobile Image"
                />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-xl shadow-smooth overflow-hidden hover-scale"
          >
            <div className="aspect-video relative overflow-hidden">
              {product.heroes.length > 0 ? (
                <img 
                  src={product.heroes[0]} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              {product.heroes.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                  {product.heroes.slice(0, 5).map((_, index) => (
                    <div 
                      key={index} 
                      className="w-2 h-2 rounded-full bg-white opacity-70"
                    />
                  ))}
                  {product.heroes.length > 5 && (
                    <div className="text-white text-xs">+{product.heroes.length - 5}</div>
                  )}
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">{product.title}</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-primary">${product.price}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-all-smooth"
                  >
                    <Edit className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg hover:bg-red-100 transition-all-smooth"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                  <div className="relative w-16 h-10 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={product.images.desktop} 
                      alt="Desktop" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs bg-black/20 text-white">
                      Desktop
                    </div>
                  </div>
                  <div className="relative w-8 h-10 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={product.images.mobile} 
                      alt="Mobile" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs bg-black/20 text-white">
                      Mobile
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No products found. Create your first product!</p>
        </div>
      )}
    </div>
  );
};

export default Products;
