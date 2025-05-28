import React, { useState, useEffect } from 'react';
import { productApi } from '../../utils/apiService';
import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';
import { Plus, Edit, Trash2, Save, X, Loader, ArrowUp, ArrowDown, Image, Music } from 'lucide-react';
import { toast } from 'sonner';
import ProductForm from '../../components/ProductForm';
import ProductCard from '../../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState({
    title: '',
    description: '',
    heroImage: { url: '', publicId: '' },
    audio: { url: '', publicId: '' },
    cta: { text: 'Get Started', secondaryText: 'View Demo' },
    previewItems: [],
    showcaseItems: [],
    active: true,
    order: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      toast.error('Error fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (product) => {
    setIsSaving(true);

    try {
      if (isEditing) {
        await productApi.update(product._id, product);
        toast.success('Product updated successfully');
      } else {
        await productApi.create(product);
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
      heroImage: { url: '', publicId: '' },
      audio: { url: '', publicId: '' },
      cta: { text: 'Get Started', secondaryText: 'View Demo' },
      previewItems: [],
      showcaseItems: [],
      active: true,
      order: 0
    });
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
        const productToDelete = products.find(product => product._id === id);
        
        // Delete hero image
        if (productToDelete?.heroImage?.publicId) {
          await deleteFromCloudinary(productToDelete.heroImage.publicId);
        }
        
        // Delete audio if exists
        if (productToDelete?.audio?.publicId) {
          await deleteFromCloudinary(productToDelete.audio.publicId);
        }
        
        // Delete preview images
        for (const item of productToDelete?.previewItems || []) {
          if (item.desktop?.publicId) {
            await deleteFromCloudinary(item.desktop.publicId);
          }
          if (item.mobile?.publicId) {
            await deleteFromCloudinary(item.mobile.publicId);
          }
        }
        
        // Delete showcase images
        for (const item of productToDelete?.showcaseItems || []) {
          if (item.desktop?.publicId) {
            await deleteFromCloudinary(item.desktop.publicId);
          }
          if (item.mobile?.publicId) {
            await deleteFromCloudinary(item.mobile.publicId);
          }
        }
        
        await productApi.delete(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  const handleReorder = async (productId, direction) => {
    const currentIndex = products.findIndex(product => product._id === productId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === products.length - 1)
    ) {
      return;
    }

    const newProducts = [...products];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap order values
    const temp = newProducts[currentIndex].order;
    newProducts[currentIndex].order = newProducts[targetIndex].order;
    newProducts[targetIndex].order = temp;

    // Swap positions in array
    [newProducts[currentIndex], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[currentIndex]];

    try {
      await productApi.reorder({ products: newProducts });
      setProducts(newProducts);
      toast.success('Products reordered successfully');
    } catch (error) {
      toast.error('Error reordering products');
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
          <h1 className="text-2xl font-bold tracking-tight">Product Showcase</h1>
          <p className="text-gray-500 mt-1">Manage your product showcase pages</p>
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
          <ProductForm 
            product={currentProduct}
            isEditing={isEditing}
            isSaving={isSaving}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </div>
      )}

      <div className="space-y-6">
        {products.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            index={index}
            totalProducts={products.length}
            onEdit={() => handleEdit(product)}
            onDelete={() => handleDelete(product._id)}
            onReorder={handleReorder}
          />
        ))}
      </div>

      {products.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No products found. Create your first product showcase!</p>
        </div>
      )}
    </div>
  );
};

export default Products;
