import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * دالة لإنشاء معرف فريد بدون استخدام مكتبة uuid
 * @returns معرف فريد مبني على الوقت والأرقام العشوائية
 */
const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
};

/**
 * تحميل ملف إلى Firebase Storage
 * @param file الملف المراد تحميله
 * @param path المسار داخل Firebase Storage (مثل 'products', 'banners', إلخ)
 * @param customFileName اسم ملف مخصص (اختياري)
 * @returns وعد بعنوان URL للتنزيل
 */
export const uploadFile = async (
  file: File,
  path: string,
  customFileName?: string
): Promise<string> => {
  try {
    // إنشاء اسم فريد للملف باستخدام توليد معرف فريد إذا لم يتم تقديم اسم مخصص
    const fileName = customFileName || `${generateUniqueId()}-${file.name}`;
    // إنشاء المرجع الكامل للملف
    const fullPath = `${path}/${fileName}`;
    const fileRef = ref(storage, fullPath);
    
    // تحميل الملف
    const snapshot = await uploadBytes(fileRef, file);
    console.log('تم تحميل الملف بنجاح:', snapshot);
    
    // الحصول على عنوان URL للتنزيل
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('خطأ في تحميل الملف:', error);
    throw new Error(`فشل تحميل الملف: ${error}`);
  }
};

/**
 * تحميل صورة إلى Firebase Storage مع التحقق من نوع الملف
 * @param file ملف الصورة
 * @param path المسار داخل Firebase Storage
 * @param customFileName اسم ملف مخصص (اختياري)
 * @returns وعد بعنوان URL للتنزيل
 */
export const uploadImage = async (
  file: File,
  path: string,
  customFileName?: string
): Promise<string> => {
  // التحقق من نوع الملف
  if (!file.type.startsWith('image/')) {
    throw new Error('يجب أن يكون الملف صورة');
  }
  
  // استخدام وظيفة تحميل الملف العامة
  return uploadFile(file, path, customFileName);
};

/**
 * حذف ملف من Firebase Storage
 * @param url عنوان URL الكامل للملف
 * @returns وعد بنجاح العملية
 */
export const deleteFileByUrl = async (url: string): Promise<void> => {
  try {
    // استخراج المسار من URL
    const decodedUrl = decodeURIComponent(url);
    // استخراج المسار بعد storageBucket
    const urlObj = new URL(decodedUrl);
    const pathRegex = /\/o\/(.+?)(?=\?|$)/;
    const matches = urlObj.pathname.match(pathRegex);
    
    if (!matches || !matches[1]) {
      throw new Error('تعذر استخراج مسار الملف من URL');
    }
    
    const path = matches[1].replace(/\//g, '%2F');
    const fileRef = ref(storage, path);
    
    // حذف الملف
    await deleteObject(fileRef);
    console.log('تم حذف الملف بنجاح');
  } catch (error) {
    console.error('خطأ في حذف الملف:', error);
    throw new Error(`فشل حذف الملف: ${error}`);
  }
};

/**
 * حذف ملف من Firebase Storage باستخدام المسار المباشر
 * @param path المسار المباشر للملف في Firebase Storage
 * @returns وعد بنجاح العملية
 */
export const deleteFileByPath = async (path: string): Promise<void> => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    console.log('تم حذف الملف بنجاح');
  } catch (error) {
    console.error('خطأ في حذف الملف:', error);
    throw new Error(`فشل حذف الملف: ${error}`);
  }
};

export default {
  uploadFile,
  uploadImage,
  deleteFileByUrl,
  deleteFileByPath
}; 