import { ref, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable } from 'firebase/storage';
import { storage, auth } from './firebase';
import { createUploadMetadata } from './fileUtils';

// Upload image file with progress tracking
export const uploadImage = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // Check authentication before attempting upload
  if (!auth.currentUser) {
    throw new Error('Upload failed: You must be logged in to upload files.');
  }

  // Verify user email matches admin email
  if (auth.currentUser.email !== 'gaurav@admin.kop') {
    throw new Error('Upload failed: You do not have permission to upload files.');
  }

  try {
    const storageRef = ref(storage, `images/${path}`);
    const metadata = createUploadMetadata(file, auth.currentUser.email);
    
    if (onProgress) {
      // Use resumable upload for progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file, { customMetadata: metadata });
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } else {
      // Simple upload without progress
      const snapshot = await uploadBytes(storageRef, file, { customMetadata: metadata });
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    // Provide more specific error messages
    if (error.code === 'storage/unauthorized') {
      throw new Error('Upload failed: Please ensure you are logged in and have permission to upload files.');
    } else if (error.code === 'storage/canceled') {
      throw new Error('Upload was canceled. Please try again.');
    } else if (error.code === 'storage/unknown') {
      throw new Error('Upload failed: Please check your internet connection and try again.');
    } else if (error.message?.includes('CORS')) {
      throw new Error('Upload failed: Firebase Storage is not properly configured. Please contact the administrator.');
    }
    
    throw new Error(`Upload failed: ${error.message || 'Unknown error occurred'}`);
  }
};

// Upload resume PDF with progress tracking
export const uploadResume = async (
  file: File,
  filename: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // Check authentication before attempting upload
  if (!auth.currentUser) {
    throw new Error('Upload failed: You must be logged in to upload files.');
  }

  // Verify user email matches admin email
  if (auth.currentUser.email !== 'gaurav@admin.kop') {
    throw new Error('Upload failed: You do not have permission to upload files.');
  }

  try {
    const storageRef = ref(storage, `resumes/${filename}`);
    const metadata = createUploadMetadata(file, auth.currentUser.email);
    
    if (onProgress) {
      // Use resumable upload for progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file, { customMetadata: metadata });
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } else {
      // Simple upload without progress
      const snapshot = await uploadBytes(storageRef, file, { customMetadata: metadata });
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }
  } catch (error: any) {
    console.error('Error uploading resume:', error);
    
    // Provide more specific error messages
    if (error.code === 'storage/unauthorized') {
      throw new Error('Upload failed: Please ensure you are logged in and have permission to upload files.');
    } else if (error.code === 'storage/canceled') {
      throw new Error('Upload was canceled. Please try again.');
    } else if (error.code === 'storage/unknown') {
      throw new Error('Upload failed: Please check your internet connection and try again.');
    } else if (error.message?.includes('CORS')) {
      throw new Error('Upload failed: Firebase Storage is not properly configured. Please contact the administrator.');
    }
    
    throw new Error(`Upload failed: ${error.message || 'Unknown error occurred'}`);
  }
};

// Delete file from storage
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Get file URL from path
export const getFileURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

// Helper function to extract storage path from URL
export const getStoragePathFromURL = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    // Handle different Firebase Storage URL formats
    // Format 1: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Ffile.ext?alt=media&token=...
    let pathMatch = urlObj.pathname.match(/\/o\/(.+)$/);
    if (pathMatch) {
      return decodeURIComponent(pathMatch[1]);
    }
    
    // Format 2: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Ffile.ext
    pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
    if (pathMatch) {
      // Remove query parameters if they're part of the path
      const path = pathMatch[1].split('?')[0];
      return decodeURIComponent(path);
    }
    
    // Format 3: Try to extract from search params
    const searchParams = new URLSearchParams(urlObj.search);
    const nameParam = searchParams.get('name');
    if (nameParam) {
      return nameParam;
    }
    
    console.warn('Could not extract storage path from URL:', url);
    return '';
  } catch (error) {
    console.error('Error extracting storage path:', error);
    return '';
  }
};

// Delete file from storage using URL
export const deleteFileByURL = async (url: string): Promise<void> => {
  try {
    const storagePath = getStoragePathFromURL(url);
    if (!storagePath) {
      console.warn('Could not extract storage path from URL, attempting alternative methods:', url);
      
      // Try alternative approach using Firebase Storage reference
      try {
        // Create a reference from the URL directly
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
        return;
      } catch (altError) {
        console.warn('Alternative deletion method also failed:', altError);
        throw new Error(`Could not delete file: Unable to extract storage path from URL: ${url}`);
      }
    }
    
    await deleteFile(storagePath);
  } catch (error) {
    console.error('Error deleting file by URL:', error);
    throw error;
  }
};

// Delete resume file and cleanup
export const deleteResumeFile = async (resumeUrl: string): Promise<void> => {
  // Check authentication before attempting delete
  if (!auth.currentUser) {
    throw new Error('Delete failed: You must be logged in to delete files.');
  }

  // Verify user email matches admin email
  if (auth.currentUser.email !== 'gaurav@admin.kop') {
    throw new Error('Delete failed: You do not have permission to delete files.');
  }

  try {
    await deleteFileByURL(resumeUrl);
  } catch (error: any) {
    console.error('Error deleting resume file:', error);
    
    // Provide more specific error messages
    if (error.code === 'storage/object-not-found') {
      // File doesn't exist, which is fine for deletion
      console.warn('Resume file not found in storage, may have been already deleted');
      return; // Don't throw error, deletion goal is achieved
    } else if (error.code === 'storage/unauthorized') {
      throw new Error('Delete failed: You do not have permission to delete this file.');
    } else if (error.message?.includes('Could not delete file')) {
      // Handle URL parsing issues more gracefully
      console.warn('Could not delete file from storage, but continuing with database cleanup');
      return; // Allow database cleanup to proceed
    }
    
    throw new Error(`Delete failed: ${error.message || 'Unknown error occurred'}`);
  }
};