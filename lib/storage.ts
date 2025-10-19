'use client';

import {
  getDownloadURL,
  ref,
  uploadBytes,
  type UploadMetadata,
} from "firebase/storage";
import { firebaseStorage } from "./firebase";

export const uploadFile = async (
  path: string,
  file: File | Blob,
  metadata?: UploadMetadata
) => {
  const storageRef = ref(firebaseStorage, path);
  const snapshot = await uploadBytes(storageRef, file, metadata);
  const url = await getDownloadURL(snapshot.ref);
  return { path, url };
};
