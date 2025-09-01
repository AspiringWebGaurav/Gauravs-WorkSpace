'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Calendar, FileText, Save, AlertCircle } from 'lucide-react';
import { Resume } from '@/types';
import { uploadResume } from '@/lib/storage';
import { formatDate, generateId } from '@/lib/utils';

interface ResumeManagerProps {
  resume: Resume | null;
  onResumeUpdate: (resume: Resume) => void;
}

export default function ResumeManager({ resume, onResumeUpdate }: ResumeManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setSuccess('');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const filename = `resume-${generateId()}.pdf`;
      const downloadURL = await uploadResume(file, filename);

      clearInterval(progressInterval);
      setUploadProgress(100);

      const newResume: Resume = {
        title: `Resume v${Date.now()}`,
        url: downloadURL,
        updated: new Date().toISOString(),
      };

      await onResumeUpdate(newResume);
      setSuccess('Resume uploaded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error uploading resume:', error);
      setError('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = () => {
    if (resume?.url) {
      window.open(resume.url, '_blank');
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
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Download size={16} />
                  <span>Download</span>
                </button>
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
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> your resume
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF files only (max 10MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Uploading resume...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
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