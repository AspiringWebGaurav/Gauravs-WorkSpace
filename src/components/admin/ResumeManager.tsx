'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Calendar, FileText, Save, AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { Resume } from '@/types';
import { uploadResume, deleteResumeFile } from '@/lib/storage';
import { deleteResume } from '@/lib/database';
import { formatDate, generateId } from '@/lib/utils';
import { generateResumeTitle, validateFile, getFileInfo, getUploadProgressMessage } from '@/lib/fileUtils';
import { useToast } from '@/components/providers/ToastProvider';
import { useDownload } from '@/lib/downloadUtils';

interface ResumeManagerProps {
  resume: Resume | null;
  onResumeUpdate: (resume: Resume) => void;
  onResumeDelete: () => void;
}

export default function ResumeManager({ resume, onResumeUpdate, onResumeDelete }: ResumeManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<any>(null);
  const [progressMessage, setProgressMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const { downloadResume } = useDownload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file, 'resume');
    if (!validation.isValid) {
      setError(validation.errors.join('. '));
      showError('Invalid File', validation.errors.join('. '));
      return;
    }

    setError('');
    setSelectedFile(file);
    
    // Create file preview info
    const fileInfo = getFileInfo(file);
    setFilePreview(fileInfo);
    
    showInfo('File Selected', `${fileInfo.name} (${fileInfo.sizeFormatted}) is ready to upload`);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setError('');
    setSuccess('');
    setIsUploading(true);
    setUploadProgress(0);
    setProgressMessage('Preparing upload...');

    try {
      const filename = `resume-${generateId()}.pdf`;
      
      // Upload with progress tracking
      const downloadURL = await uploadResume(selectedFile, filename, (progress) => {
        setUploadProgress(progress);
        setProgressMessage(getUploadProgressMessage(progress, selectedFile.name));
      });

      // Generate dynamic title
      const dynamicTitle = generateResumeTitle(selectedFile.name);
      
      const newResume: Resume = {
        title: dynamicTitle,
        url: downloadURL,
        updated: new Date().toISOString(),
        originalFilename: selectedFile.name, // Store the original filename
      };

      await onResumeUpdate(newResume);
      
      // Show success notification
      showSuccess(
        'Resume Uploaded Successfully!',
        `${dynamicTitle} is now available for download`,
        {
          label: 'Download Now',
          onClick: () => {
            try {
              downloadResume(downloadURL, dynamicTitle, selectedFile.name);
            } catch (error) {
              console.error('Download from toast failed:', error);
            }
          }
        }
      );
      
      setSuccess(`Resume uploaded successfully as "${dynamicTitle}"`);
      setSelectedFile(null);
      setFilePreview(null);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      const errorMessage = error.message || 'Failed to upload resume. Please try again.';
      setError(errorMessage);
      showError('Upload Failed', errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setProgressMessage('');
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setError('');
  };

  const handleDeleteResume = async () => {
    if (!resume?.url || !resume?.title) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resume.title}"?\n\nThis action cannot be undone and will remove the resume from your workspace.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    
    try {
      // Delete file from storage first
      await deleteResumeFile(resume.url);
      
      // Then delete from database
      await deleteResume();
      
      // Update parent component
      onResumeDelete();
      
      showSuccess(
        'Resume Deleted Successfully',
        `${resume.title} has been permanently removed from your workspace`
      );
      
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      const errorMessage = error.message || 'Failed to delete resume. Please try again.';
      showError('Delete Failed', errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    if (resume?.url && resume?.title) {
      try {
        downloadResume(resume.url, resume.title, resume.originalFilename);
      } catch (error) {
        // Error is already handled by useDownload hook
        console.error('Download failed:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Resume */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Current Resume</h2>
              <p className="text-blue-100">Manage your resume file</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {resume ? (
            <div className="space-y-4">
              {/* Resume Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {resume.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar size={14} />
                      <span>Last updated: {formatDate(resume.updated)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleDeleteResume}
                    disabled={isDeleting}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ✓
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Resume Active
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    PDF
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    File Format
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    Public
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Visibility
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No resume uploaded
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your resume to make it available for download.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload New Resume */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Upload New Resume
        </h3>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <div className="flex items-center">
              <div className="h-5 w-5 text-green-400 mr-2">✓</div>
              <span className="text-sm text-green-800 dark:text-green-200">{success}</span>
            </div>
          </motion.div>
        )}

        {/* Upload Area */}
        <div className="space-y-4">
          {/* File Preview */}
          {filePreview && !isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">
                      {filePreview.name}
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      {filePreview.sizeFormatted} • PDF • Ready to upload
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleFileUpload}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Upload size={16} />
                    <span>Upload</span>
                  </button>
                  <button
                    onClick={handleCancelUpload}
                    className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Upload Dropzone */}
          {!filePreview && !isUploading && (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to select</span> your resume
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF files only (max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-blue-800 dark:text-blue-200 mb-1">
                    <span className="font-medium">{progressMessage}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {filePreview && (
                <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-300">
                  <FileText size={16} />
                  <span>{filePreview.name} ({filePreview.sizeFormatted})</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Upload Guidelines */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Upload Guidelines:
            </h4>
            <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
              <li>• File must be in PDF format</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Use a clear, professional filename</li>
              <li>• Ensure the resume is up-to-date</li>
              <li>• The new resume will replace the current one</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resume Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          💡 Resume Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <h4 className="font-semibold mb-2">Content:</h4>
            <ul className="space-y-1">
              <li>• Keep it concise (1-2 pages)</li>
              <li>• Use action verbs</li>
              <li>• Quantify achievements</li>
              <li>• Include relevant keywords</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Format:</h4>
            <ul className="space-y-1">
              <li>• Use a clean, professional layout</li>
              <li>• Consistent formatting</li>
              <li>• Easy-to-read fonts</li>
              <li>• Export as high-quality PDF</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}