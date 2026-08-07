import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product } from '../types';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

const PRODUCTS_COLLECTION = 'products';

// Subscribe to real-time products updates from Cloud Firestore
export function subscribeToProducts(onUpdate: (products: Product[]) => void) {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ ...docSnap.data(), id: docSnap.id } as Product);
          });
          onUpdate(items);
        }
      },
      (err) => {
        console.warn('Firestore products subscription error:', err);
      }
    );
  } catch (e) {
    console.warn('Failed to attach Firestore listener:', e);
    return () => {};
  }
}

// Save or update all products in Firestore
export async function syncAllProductsToFirestore(products: Product[]) {
  try {
    for (const p of products) {
      const docRef = doc(db, PRODUCTS_COLLECTION, p.id);
      await setDoc(docRef, p, { merge: true });
    }
  } catch (err) {
    console.error('Error syncing products to Firestore:', err);
  }
}

// Save a single product
export async function saveProductToFirestore(product: Product) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, product, { merge: true });
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
  }
}

// Delete a product
export async function deleteProductFromFirestore(productId: string) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
  }
}

// Seed initial dataset if collection is currently empty
export async function seedProductsToFirestoreIfEmpty(initialProducts: Product[]) {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      for (const p of initialProducts) {
        const docRef = doc(db, PRODUCTS_COLLECTION, p.id);
        await setDoc(docRef, p);
      }
    }
  } catch (err) {
    console.warn('Error checking/seeding Firestore products:', err);
  }
}
