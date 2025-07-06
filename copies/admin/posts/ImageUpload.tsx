// FILE: components/admin/ImageUpload.tsx
// Image upload component

'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage, deleteImage } from '@/lib/utils/storage';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  folder?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  folder = 'blog-images',
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload an image.');
      return false;
    }

    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB.`);
      return false;
    }

    return true;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [folder, onChange, maxSize, acceptedTypes]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemove = async () => {
    if (value) {
      try {
        // Extract file path from URL for deletion
        const urlParts = value.split('/');
        const filePath = urlParts.slice(-2).join('/'); // folder/filename
        await deleteImage(filePath);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    onRemove();
  };

  if (value) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
          Featured Image
        </label>
        
        <div className="relative group">
          <img
            src={value}
            alt="Featured image"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
            <button
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-[#4a90e2] transition-colors text-sm"
        >
          Replace Image
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
        Featured Image
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-[#4a90e2] bg-[#4a90e2]/5' 
            : 'border-gray-300 hover:border-[#4a90e2]'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-[#4a90e2] animate-spin" />
            <p className="text-sm text-gray-600">Uploading image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Drop an image here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#4a90e2] hover:text-[#ff6b35] underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WebP up to {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 