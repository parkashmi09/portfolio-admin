import { cloudinaryConfig } from '../config/cloudinary';
import sha1 from 'crypto-js/sha1';

// Generate Cloudinary signature for secure uploads
const generateSignature = (paramsToSign) => {
  const params = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&');
  return sha1(params + cloudinaryConfig.apiSecret).toString();
};

export const uploadToCloudinary = async (file, options = {}) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = options.folder || cloudinaryConfig.folder;
    
    const paramsToSign = {
      timestamp,
      folder,
    };

    if (options.transformation) {
      paramsToSign.transformation = options.transformation;
    }

    const signature = generateSignature(paramsToSign);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', cloudinaryConfig.apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    if (options.transformation) {
      formData.append('transformation', options.transformation);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed: ' + error.message);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      public_id: publicId,
      timestamp,
    };
    
    const signature = generateSignature(paramsToSign);

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', cloudinaryConfig.apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Image deletion failed: ' + error.message);
  }
};

// Helper function to optimize images based on use case
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return '';
  
  // Check if URL already contains transformation parameters
  if (url.includes('/upload/w_') || url.includes('/upload/c_')) {
    return url;
  }

  const { width, height, crop = 'limit' } = options;
  const baseUrl = url.split('/upload/')[0] + '/upload/';
  const imagePath = url.split('/upload/')[1];
  
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`c_${crop}`);
  transformations.push('q_auto');
  transformations.push('f_auto');
  
  return `${baseUrl}${transformations.join(',')}/${imagePath}`;
}; 