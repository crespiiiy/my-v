import React, { useState, useRef, useCallback } from 'react';
import { uploadImage } from '../../services/StorageService';

interface ImageUploaderProps {
  /**
   * المسار في Firebase Storage (مثل 'products', 'banners', إلخ)
   */
  storagePath: string;
  
  /**
   * معالج ليتم استدعاؤه عند اكتمال التحميل بنجاح
   * @param url عنوان URL للصورة
   */
  onUploadSuccess: (url: string) => void;
  
  /**
   * معالج ليتم استدعاؤه عند حدوث خطأ
   * @param error رسالة الخطأ
   */
  onUploadError?: (error: string) => void;
  
  /**
   * عنوان URL للصورة الحالية (اختياري)
   */
  currentImageUrl?: string;
  
  /**
   * تسمية الزر
   */
  buttonLabel?: string;
  
  /**
   * أنواع الملفات المسموح بها (فلتر مرئي في مربع حوار اختيار الملف)
   */
  acceptedFileTypes?: string;
  
  /**
   * الحجم الأقصى للملف بالبايت (الافتراضي: 5MB)
   */
  maxFileSize?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  storagePath,
  onUploadSuccess,
  onUploadError,
  currentImageUrl,
  buttonLabel = 'تحميل صورة',
  acceptedFileTypes = 'image/*',
  maxFileSize = 5 * 1024 * 1024, // 5MB
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // وظيفة لمعالجة الملف
  const processFile = async (file: File) => {
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'يرجى تحميل ملف صورة صالح';
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      return;
    }
    
    // التحقق من حجم الملف
    if (file.size > maxFileSize) {
      const errorMsg = `الملف كبير جدًا. الحد الأقصى للحجم هو ${Math.round(maxFileSize / (1024 * 1024))}MB`;
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      return;
    }
    
    // إنشاء URL معاينة
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // تعيين حالة التحميل
    setIsUploading(true);
    setError(null);
    
    try {
      // تحميل الصورة إلى Firebase Storage
      const downloadUrl = await uploadImage(file, storagePath);
      
      // استدعاء معالج النجاح
      onUploadSuccess(downloadUrl);
      
      // إكمال التحميل
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      // معالجة الخطأ
      const errorMsg = `فشل تحميل الصورة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`;
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // معالج النقر على الزر
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // معالج تغيير الملف
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  // معالجات السحب والإفلات
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);
  
  return (
    <div className="w-full">
      {/* منطقة السحب والإفلات */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
        onClick={handleButtonClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* معاينة الصورة */}
        {previewUrl && (
          <div className="mb-4">
            <img
              src={previewUrl}
              alt="معاينة"
              className="max-h-40 mx-auto rounded"
            />
          </div>
        )}
        
        {/* النص الإرشادي */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="block">
            {buttonLabel} أو اسحب وأفلت الملف هنا
          </span>
          <span className="block mt-1 text-xs">
            الحد الأقصى للحجم: {Math.round(maxFileSize / (1024 * 1024))}MB
          </span>
        </div>
        
        {/* شريط التقدم */}
        {isUploading && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-1 transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        
        {/* رسالة الخطأ */}
        {error && (
          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
      
      {/* حقل إدخال الملف (مخفي) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader; 