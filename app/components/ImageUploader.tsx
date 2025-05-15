import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';

interface ImageUploaderProps {
  initialImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
}

const ImageUploader = ({ initialImageUrl = '', onImageChange }: ImageUploaderProps) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isUrlInput, setIsUrlInput] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onImageChange(url);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);
      onImageChange(localUrl);
      
      // Here you would typically upload the file to your server or storage
      // and then use the returned URL
      // For now, we're just using a local object URL for preview
      console.log('File selected:', file.name);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleInputMethod = () => {
    setIsUrlInput(!isUrlInput);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-200">Image</label>
        <button
          type="button"
          onClick={toggleInputMethod}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          {isUrlInput ? 'Upload from device' : 'Enter URL instead'}
        </button>
      </div>

      {isUrlInput ? (
        <input
          type="text"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="Enter image URL"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
        />
      ) : (
        <div className="space-y-2">
          <div 
            onClick={triggerFileInput}
            className="cursor-pointer border-2 border-dashed border-gray-600 rounded-md p-4 text-center hover:border-blue-500 transition-colors"
          >
            <p className="text-gray-400">Click to select image</p>
            {uploadedImage && (
              <p className="text-sm text-gray-400 mt-2">
                Selected: {uploadedImage.name}
              </p>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Preview:</p>
          <div className="aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 