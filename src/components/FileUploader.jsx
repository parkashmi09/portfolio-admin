
import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader } from 'lucide-react';
import { uploadFile } from '../utils/dataService';
import { toast } from 'sonner';

const FileUploader = ({ onFileUploaded, acceptedTypes = "image/*", label = "Upload a file" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Check if file matches accepted types
    if (!file.type.match(acceptedTypes.replace('*', ''))) {
      toast.error(`Please upload a ${acceptedTypes.replace('*', '')} file`);
      return;
    }

    // Preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      onFileUploaded(url);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Error uploading file');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const clearPreview = (e) => {
    e.stopPropagation();
    setPreview(null);
    onFileUploaded(null);
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg p-6 transition-all-smooth ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center text-center h-40">
        {isUploading ? (
          <div className="animate-pulse-soft">
            <Loader className="h-10 w-10 text-primary animate-spin" />
            <p className="mt-2 text-sm text-gray-500">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {preview.startsWith('data:image') ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="max-h-full max-w-full object-contain rounded"
              />
            ) : (
              <div className="flex items-center">
                <Check className="h-6 w-6 text-green-500 mr-2" />
                <span>File ready</span>
              </div>
            )}
            <button 
              className="absolute top-0 right-0 p-1 rounded-full bg-red-500 text-white"
              onClick={clearPreview}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900">{label}</p>
            <p className="mt-1 text-xs text-gray-500">
              Drag and drop or click to upload
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
