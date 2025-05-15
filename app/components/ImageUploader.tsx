import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';

interface ImageUploaderProps {
  initialImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
}

// Helper function to convert file to base64 for more persistent storage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const ImageUploader = ({ initialImageUrl = '', onImageChange }: ImageUploaderProps) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isUrlInput, setIsUrlInput] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onImageChange(url);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadedImage(file);
        
        // Convert to base64 for more persistent storage
        const base64Image = await fileToBase64(file);
        setImageUrl(base64Image);
        onImageChange(base64Image);
        
        console.log('File selected and converted to base64:', file.name);
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
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