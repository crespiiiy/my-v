import { products } from '../models/product';
import { saveAllProducts } from './productService';

/**
 * وظيفة لإعادة مزامنة جميع المنتجات مع Firebase
 * استخدم هذه الوظيفة عندما تريد التأكد من أن جميع التغييرات محفوظة في Firebase
 */
export async function forceResyncProductsToFirebase(): Promise<boolean> {
  try {
    console.log('بدء إعادة مزامنة المنتجات مع Firebase...');
    
    // حفظ جميع المنتجات الحالية في الذاكرة إلى Firebase
    const success = await saveAllProducts(products);
    
    if (success) {
      console.log('تمت إعادة مزامنة المنتجات بنجاح مع Firebase');
      
      // تحديث localStorage أيضًا للتأكد من توافق البيانات
      localStorage.setItem('creative_products', JSON.stringify(products));
      console.log('تم تحديث localStorage أيضًا');
      
      return true;
    } else {
      console.error('فشلت إعادة مزامنة المنتجات مع Firebase');
      return false;
    }
  } catch (error) {
    console.error('حدث خطأ أثناء إعادة مزامنة المنتجات:', error);
    return false;
  }
}

/**
 * وظيفة لمسح بيانات localStorage وإعادة تحميل البيانات من Firebase
 * استخدم هذه الوظيفة لإعادة ضبط البيانات المحلية وتحميلها مجددًا من Firebase
 */
export async function resetLocalStorage(): Promise<void> {
  try {
    // مسح بيانات localStorage
    localStorage.removeItem('creative_products');
    console.log('تم مسح بيانات localStorage');
    
    // إعادة تحميل الصفحة لتحميل البيانات من Firebase
    window.location.reload();
  } catch (error) {
    console.error('حدث خطأ أثناء إعادة ضبط بيانات localStorage:', error);
  }
} 