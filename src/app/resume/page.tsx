'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, FileText, ExternalLink } from 'lucide-react';
import { getResume } from '@/lib/database';
import { Resume } from '@/types';
import { formatDate } from '@/lib/utils';
import { useDownload } from '@/lib/downloadUtils';

export default function ResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const { downloadResume } = useDownload();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const resumeData = await getResume();
        if (resumeData) {
          setResume(resumeData);
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const handleDownloadResume = () => {
    if (resume?.url && resume?.title) {
      try {
        downloadResume(resume.url, resume.title, resume.originalFilename);
      } catch (error) {
        // Error is already handled by useDownload hook
        console.error('Download failed:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="gradient-text">Resume</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Download my latest resume to learn more about my experience, skills, and achievements.
          </p>
        </motion.div>

        {/* Resume Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Resume Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <FileText size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {resume?.title || 'Resume'}
                  </h2>
                  <div className="flex items-center space-x-2 mt-2 text-blue-100">
                    <Calendar size={16} />
                    <span>
                      Last updated: {resume ? formatDate(resume.updated) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDownloadResume}
                disabled={!resume}
                className="group flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-300 disabled:text-gray-500 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Download size={20} className="group-hover:animate-bounce" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Resume Content */}
          <div className="p-8">
            {resume ? (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      3+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      50+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Projects Completed
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      15+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Technologies
                    </div>
                  </div>
                </div>

                {/* Skills Overview */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Core Skills
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        Frontend Development
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'JavaScript'].map(skill => (
                          <span
                            key={skill}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        Backend Development
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {['Node.js', 'Python', 'Firebase', 'MongoDB', 'PostgreSQL'].map(skill => (
                          <span
                            key={skill}
                            className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Let's Connect
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="mailto:gaurav@example.com"
                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <span>📧</span>
                      <span>gaurav@example.com</span>
                    </a>
                    <a
                      href="https://linkedin.com/in/gauravpatil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <span>💼</span>
                      <span>LinkedIn Profile</span>
                      <ExternalLink size={16} />
                    </a>
                    <a
                      href="https://github.com/gauravpatil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <span>🐙</span>
                      <span>GitHub Profile</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <FileText size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Resume not available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  The resume is currently being updated. Please check back later.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Want to know more?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Explore my projects to see my work in action, or get in touch to discuss opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/projects"
                className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span>View Projects</span>
                <ExternalLink size={18} />
              </a>
              <a
                href="mailto:gaurav@example.com"
                className="inline-flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span>Contact Me</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}