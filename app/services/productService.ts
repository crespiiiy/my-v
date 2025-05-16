import { db } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, query, where, writeBatch } from 'firebase/firestore';
import type { Product } from '../models/product';

// اسم المجموعة في Firestore
const PRODUCTS_COLLECTION = 'products';

/**
 * يحفظ جميع المنتجات في Firestore
 */
export async function saveAllProducts(products: Product[]): Promise<boolean> {
  try {
    const batch = writeBatch(db);
    
    // حفظ كل منتج في الدفعة
    products.forEach(product => {
      const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
      batch.set(docRef, product);
    });
    
    // تنفيذ عملية الحفظ
    await batch.commit();
    
    console.log('تم حفظ جميع المنتجات بنجاح في Firestore');
    return true;
  } catch (error) {
    console.error('حدث خطأ أثناء حفظ المنتجات في Firestore:', error);
    return false;
  }
}

/**
 * يحصل على جميع المنتجات من Firestore
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    
    // تحويل البيانات إلى مصفوفة من المنتجات
    const products: Product[] = [];
    snapshot.forEach(doc => {
      products.push(doc.data() as Product);
    });
    
    return products;
  } catch (error) {
    console.error('حدث خطأ أثناء استرداد المنتجات من Firestore:', error);
    return [];
  }
}

/**
 * يحفظ أو يحدث منتج واحد في Firestore
 */
export async function saveProduct(product: Product): Promise<boolean> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, product);
    
    console.log(`تم حفظ المنتج بمعرف ${product.id} بنجاح`);
    return true;
  } catch (error) {
    console.error('حدث خطأ أثناء حفظ المنتج:', error);
    return false;
  }
}

/**
 * يحصل على منتج واحد من Firestore باستخدام المعرف
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as Product;
    } else {
      console.log(`لم يتم العثور على منتج بمعرف ${id}`);
      return null;
    }
  } catch (error) {
    console.error('حدث خطأ أثناء استرداد المنتج:', error);
    return null;
  }
}

/**
 * يتحقق مما إذا تم تهيئة Firestore بالفعل مع منتجات
 */
export async function isProductCollectionInitialized(): Promise<boolean> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    return !snapshot.empty;
  } catch (error) {
    console.error('حدث خطأ أثناء التحقق من تهيئة المنتجات:', error);
    return false;
  }
} 