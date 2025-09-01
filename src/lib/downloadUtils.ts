import { useToast } from '@/components/providers/ToastProvider';

// Direct download without fetch - enterprise style immediate download
export const downloadFile = (url: string, filename: string) => {
  try {
    // Create download link immediately
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank'; // Fallback for some browsers
    link.rel = 'noopener noreferrer';
    
    // Add to DOM temporarily
    document.body.appendChild(link);
    
    // Trigger immediate download
    link.click();
    
    // Clean up immediately
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

// Generate clean filename from resume title
export const generateDownloadFilename = (resumeTitle: string): string => {
  return resumeTitle
    .replace(/[^a-z0-9\s-]/gi, '') // Keep letters, numbers, spaces, and hyphens
    .replace(/\s+/g, '_')          // Replace spaces with underscores
    .replace(/-+/g, '_')           // Replace hyphens with underscores
    .replace(/_+/g, '_')           // Replace multiple underscores with single
    .toLowerCase()                 // Convert to lowercase
    .replace(/^_|_$/g, '')         // Remove leading/trailing underscores
    + '.pdf';
};

// Hook for download functionality with notifications
export const useDownload = () => {
  const { showSuccess, showError } = useToast();

  const downloadWithNotification = (url: string, filename: string, displayName?: string) => {
    try {
      // Immediate download
      downloadFile(url, filename);
      
      // Show success notification
      showSuccess(
        'Download Started',
        `${displayName || filename} download has been initiated`
      );
    } catch (error: any) {
      showError(
        'Download Failed',
        error.message || 'Failed to download file. Please try again.'
      );
      throw error;
    }
  };

  const downloadResume = (resumeUrl: string, resumeTitle: string, originalFilename?: string) => {
    // Use original filename if available, otherwise generate from title
    const filename = originalFilename || generateDownloadFilename(resumeTitle);
    downloadWithNotification(resumeUrl, filename, resumeTitle);
  };

  return {
    downloadFile: downloadWithNotification,
    downloadResume
  };
};

// Simple direct download function for immediate use
export const directDownload = (url: string, filename?: string) => {
  const link = document.createElement('a');
  link.href = url;
  if (filename) {
    link.download = filename;
  }
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};