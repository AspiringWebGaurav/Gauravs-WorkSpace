// Generate dynamic resume title based on file name and date
export const generateResumeTitle = (fileName: string): string => {
  // Remove file extension and clean up the name
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  
  // Clean up common patterns in resume file names
  const cleanName = baseName
    .replace(/[-_]/g, ' ')
    .replace(/\b(resume|cv|curriculum|vitae)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // If we have a meaningful name, use it
  if (cleanName && cleanName.length > 2) {
    const formattedName = cleanName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
    
    return `${formattedName} - ${currentDate}`;
  }
  
  // Fallback to date-based naming
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `Resume - ${currentDate}`;
};

// Generate dynamic project title based on file name
export const generateProjectImageName = (fileName: string, projectTitle?: string): string => {
  const timestamp = Date.now();
  const extension = fileName.split('.').pop();
  
  if (projectTitle) {
    const cleanTitle = projectTitle
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${cleanTitle}-${timestamp}.${extension}`;
  }
  
  return `project-image-${timestamp}.${extension}`;
};

// Extract meaningful information from file
export const getFileInfo = (file: File) => {
  const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
  const lastModified = new Date(file.lastModified).toLocaleDateString();
  
  return {
    name: file.name,
    size: file.size,
    sizeFormatted: `${sizeInMB} MB`,
    type: file.type,
    lastModified,
    extension: file.name.split('.').pop()?.toLowerCase() || ''
  };
};

// Validate file before upload
export const validateFile = (file: File, type: 'resume' | 'image') => {
  const errors: string[] = [];
  
  if (type === 'resume') {
    // Resume validation
    if (file.type !== 'application/pdf') {
      errors.push('Resume must be a PDF file');
    }
    
    if (file.size > 10 * 1024 * 1024) {
      errors.push('Resume file size must be less than 10MB');
    }
    
    if (file.size < 1024) {
      errors.push('Resume file seems too small to be valid');
    }
  } else if (type === 'image') {
    // Image validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Image must be JPEG, PNG, or WebP format');
    }
    
    if (file.size > 5 * 1024 * 1024) {
      errors.push('Image file size must be less than 5MB');
    }
    
    if (file.size < 1024) {
      errors.push('Image file seems too small to be valid');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate upload progress messages
export const getUploadProgressMessage = (progress: number, fileName: string) => {
  if (progress < 25) {
    return `Starting upload of ${fileName}...`;
  } else if (progress < 50) {
    return `Uploading ${fileName}...`;
  } else if (progress < 75) {
    return `Processing ${fileName}...`;
  } else if (progress < 95) {
    return `Finalizing upload...`;
  } else {
    return `Upload complete!`;
  }
};

// Create upload metadata (Firebase requires string values)
export const createUploadMetadata = (file: File, uploadedBy: string) => {
  return {
    originalName: file.name,
    size: file.size.toString(),
    type: file.type,
    uploadedAt: new Date().toISOString(),
    uploadedBy,
    lastModified: new Date(file.lastModified).toISOString()
  };
};