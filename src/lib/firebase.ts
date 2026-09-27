import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, getDoc, query, where, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink,
  signOut as firebaseSignOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, UserProfile, PlacedOrder, OrderStatus } from '../types';

let appInstance: any = null;
let firestoreDb: any = null;
let firebaseStorageInstance: any = null;
let firebaseAuthInstance: any = null;

try {
  appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  if (appInstance) {
    firestoreDb = getFirestore(appInstance, firebaseConfig.firestoreDatabaseId || undefined);
    firebaseStorageInstance = getStorage(appInstance);
    firebaseAuthInstance = getAuth(appInstance);
  }
} catch (e) {
  console.warn('Firebase initialization notice:', e);
}

export const db = firestoreDb;
export const storage = firebaseStorageInstance;
export const auth = firebaseAuthInstance;

/**
 * 1-Click Google Sign-In via Firebase Auth
 */
export async function signInWithGoogle(): Promise<UserProfile | null> {
  try {
    if (!auth) throw new Error('Firebase Authentication is not initialized');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;
    if (!fbUser) return null;

    const email = (fbUser.email || '').toLowerCase().trim();
    const cleanId = `usr-${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const userProfile: UserProfile = {
      id: cleanId,
      name: fbUser.displayName || email.split('@')[0] || 'Student Buyer',
      email: email,
      phone: fbUser.phoneNumber || '',
      collegeName: 'IIT Bombay',
      department: 'Electronics & Electrical Engg',
      yearOrRollNo: 'Student',
      hostelAddress: '',
      isLoggedIn: true,
      emailVerified: fbUser.emailVerified,
      avatarUrl: fbUser.photoURL || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveUserToFirestore(userProfile);
    return userProfile;
  } catch (err) {
    console.error('Firebase Google Sign-In error:', err);
    throw err;
  }
}

/**
 * Send Sign-In Link / Verification Email directly via Firebase Auth
 */
export async function sendEmailSignInLink(email: string): Promise<boolean> {
  try {
    if (!auth || !email) return false;
    const actionCodeSettings = {
      url: window.location.origin,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email.trim().toLowerCase(), actionCodeSettings);
    try {
      localStorage.setItem('emailForSignIn', email.trim().toLowerCase());
    } catch (e) {}
    console.log('[Firebase Auth] Verification email dispatched to:', email);
    return true;
  } catch (err) {
    console.warn('[Firebase Auth] sendSignInLinkToEmail notice:', err);
    return false;
  }
}

/**
 * Complete sign in if returning from Firebase email link
 */
export async function checkAndCompleteEmailSignIn(): Promise<UserProfile | null> {
  try {
    if (!auth) return null;
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please confirm your email address to complete sign in:');
      }
      if (email) {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        const fbUser = result.user;
        const cleanId = `usr-${email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}`;
        const userProfile: UserProfile = {
          id: cleanId,
          name: fbUser.displayName || email.split('@')[0] || 'sai',
          email: email.toLowerCase().trim(),
          phone: fbUser.phoneNumber || '',
          collegeName: 'IIT Bombay',
          department: 'Electronics & Electrical Engg',
          yearOrRollNo: 'Student',
          hostelAddress: '',
          isLoggedIn: true,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await saveUserToFirestore(userProfile);
        try { localStorage.removeItem('emailForSignIn'); } catch (e) {}
        return userProfile;
      }
    }
  } catch (err) {
    console.warn('Error completing email link sign in:', err);
  }
  return null;
}

/**
 * Upload a file (e.g. project image, student showcase photo, invoice) to Firebase Storage
 */
export async function uploadFileToFirebaseStorage(
  path: string,
  file: Blob | Uint8Array | ArrayBuffer
): Promise<string | null> {
  try {
    if (!storage) {
      console.warn('Firebase Storage is not initialized');
      return null;
    }
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.error('Failed to upload file to Firebase Storage:', err);
    return null;
  }
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFileFromFirebaseStorage(path: string): Promise<boolean> {
  try {
    if (!storage) return false;
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (err) {
    console.error('Failed to delete file from Firebase Storage:', err);
    return false;
  }
}

const PRODUCTS_COLLECTION = 'products';
const USERS_COLLECTION = 'users';
const ORDERS_COLLECTION = 'orders';

// ================= USER PERSISTENCE ================= //

export async function saveUserToFirestore(user: UserProfile) {
  try {
    if (!db) return;
    const identifier = user.email || user.phone || user.id;
    if (!identifier && !user.name) return;
    const userDocId = user.id || `usr-${(identifier || user.name || 'user').toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}`;
    const docRef = doc(db, USERS_COLLECTION, userDocId);
    await setDoc(docRef, {
      ...user,
      id: userDocId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log('[Firestore] User profile persisted to users collection:', userDocId);
  } catch (err) {
    console.error('Error saving user profile to Firestore:', err);
  }
}

export async function getUserFromFirestore(emailOrId: string): Promise<UserProfile | null> {
  try {
    if (!db || !emailOrId) return null;
    const cleanId = `usr-${emailOrId.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const directDoc = await getDoc(doc(db, USERS_COLLECTION, cleanId));
    if (directDoc.exists()) {
      return directDoc.data() as UserProfile;
    }
    const q = query(collection(db, USERS_COLLECTION), where('email', '==', emailOrId.toLowerCase()));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as UserProfile;
    }
  } catch (err) {
    console.warn('Error fetching user from Firestore:', err);
  }
  return null;
}

export function subscribeToAllUsers(onUpdate: (users: UserProfile[]) => void) {
  try {
    if (!db) return () => {};
    const colRef = collection(db, USERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as UserProfile);
        });
        onUpdate(list);
      },
      (err) => {
        console.warn('Firestore all users subscription error:', err);
      }
    );
  } catch (e) {
    console.warn('Failed to attach all users listener:', e);
    return () => {};
  }
}

// ================= ORDERS PERSISTENCE ================= //

export async function saveOrderToFirestore(order: PlacedOrder) {
  try {
    if (!db || !order.orderId) return;
    const docRef = doc(db, ORDERS_COLLECTION, order.orderId);
    await setDoc(docRef, {
      ...order,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Error saving order to Firestore:', err);
  }
}

export function subscribeToUserOrders(email: string, onUpdate: (orders: PlacedOrder[]) => void) {
  try {
    if (!db || !email) return () => {};
    const colRef = collection(db, ORDERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: PlacedOrder[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as PlacedOrder;
          if (data.buyer?.email?.toLowerCase() === email.toLowerCase() || data.userEmail?.toLowerCase() === email.toLowerCase()) {
            list.push({ ...data, orderId: data.orderId || docSnap.id });
          }
        });
        onUpdate(list);
      },
      (err) => {
        console.warn('Firestore user orders subscription error:', err);
      }
    );
  } catch (e) {
    console.warn('Failed to attach user orders listener:', e);
    return () => {};
  }
}

export function subscribeToAllOrders(onUpdate: (orders: PlacedOrder[]) => void) {
  try {
    if (!db) return () => {};
    const colRef = collection(db, ORDERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: PlacedOrder[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data(), orderId: docSnap.id } as PlacedOrder);
        });
        onUpdate(list);
      },
      (err) => {
        console.warn('Firestore all orders subscription error:', err);
      }
    );
  } catch (e) {
    console.warn('Failed to attach all orders listener:', e);
    return () => {};
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: OrderStatus, ownerNotes?: string) {
  try {
    if (!db || !orderId) return;
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(docRef, {
      status,
      ...(ownerNotes !== undefined ? { ownerNotes } : {}),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Error updating order status in Firestore:', err);
  }
}

export async function cancelOrderInFirestore(orderId: string, cancellationReason: string, cancelledBy: 'student' | 'owner' | 'system' = 'student') {
  try {
    if (!db || !orderId) return;
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(docRef, {
      status: 'Cancelled' as OrderStatus,
      cancellationReason,
      cancelledBy,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Error cancelling order in Firestore:', err);
  }
}

// ================= PRODUCTS PERSISTENCE ================= //

// Subscribe to real-time products updates from Cloud Firestore
export function subscribeToProducts(onUpdate: (products: Product[]) => void) {
  try {
    if (!db) return () => {};
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
    if (!db) return;
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
    if (!db) return;
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, product, { merge: true });
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
  }
}

// Delete a product
export async function deleteProductFromFirestore(productId: string) {
  try {
    if (!db) return;
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
  }
}

// Seed initial dataset if collection is currently empty
export async function seedProductsToFirestoreIfEmpty(initialProducts: Product[]) {
  try {
    if (!db) return;
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
