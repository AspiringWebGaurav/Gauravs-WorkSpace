'use client';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  console.warn(
    "Firebase configuration is missing. Check your environment variables."
  );
}

const getFirebaseApp = () => {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
};

export const firebaseApp = getFirebaseApp();
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseFirestore = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

let analyticsInstance: Analytics | null = null;

export const getFirebaseAnalytics = () => {
  if (typeof window === "undefined") {
    return null;
  }
  if (!analyticsInstance) {
    try {
      analyticsInstance = getAnalytics(firebaseApp);
    } catch {
      analyticsInstance = null;
    }
  }
  return analyticsInstance;
};
