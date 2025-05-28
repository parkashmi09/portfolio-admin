import React from 'react';
import { Edit, Trash2, ArrowUp, ArrowDown, Image, Music } from 'lucide-react';

const ProductCard = ({ product, index, totalProducts, onEdit, onDelete, onReorder }) => {
  return (
    <div className="bg-white rounded-xl shadow-smooth overflow-hidden hover:shadow-soft transition-all-smooth">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <div className="aspect-video md:h-full relative">
            {product.heroImage?.url ? (
              <img 
                src={product.heroImage.url}
                alt={product.title} 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Image className="h-12 w-12 text-gray-300" />
              </div>
            )}
          </div>
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
              <p className="text-gray-600 line-clamp-2 mb-3">{product.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {/* Audio Indicator */}
                {product.audio?.url && (
                  <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    <Music className="h-3.5 w-3.5 mr-1" />
                    <span>Has Audio</span>
                  </div>
                )}
                
                {/* Preview Items Count */}
                {product.previewItems?.length > 0 && (
                  <div className="text-sm text-gray-500">
                    {product.previewItems.length} Preview{product.previewItems.length !== 1 ? 's' : ''}
                  </div>
                )}
                
                {/* Showcase Items Count */}
                {product.showcaseItems?.length > 0 && (
                  <div className="text-sm text-gray-500">
                    {product.showcaseItems.length} Showcase Item{product.showcaseItems.length !== 1 ? 's' : ''}
                  </div>
                )}
                
                {/* Active Status */}
                {!product.active && (
                  <span className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-2 ml-4">
              <button
                onClick={() => onReorder(product._id, 'up')}
                disabled={index === 0}
                className={`p-2 rounded-lg transition-all-smooth ${
                  index === 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'
                }`}
                aria-label="Move up"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <button
                onClick={() => onReorder(product._id, 'down')}
                disabled={index === totalProducts - 1}
                className={`p-2 rounded-lg transition-all-smooth ${
                  index === totalProducts - 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'
                }`}
                aria-label="Move down"
              >
                <ArrowDown className="h-5 w-5" />
              </button>
              <button
                onClick={onEdit}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all-smooth"
                aria-label="Edit product"
              >
                <Edit className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-lg hover:bg-red-100 transition-all-smooth"
                aria-label="Delete product"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 