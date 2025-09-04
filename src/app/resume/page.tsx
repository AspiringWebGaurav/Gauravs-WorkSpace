'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, FileText, ExternalLink, User, Mail, MapPin, Star, Award, Code, Briefcase } from 'lucide-react';
import { getResume } from '@/lib/database';
import { Resume } from '@/types';
import { formatDate } from '@/lib/utils';
import { useDownload } from '@/lib/downloadUtils';
import { useHydrationSafe } from '@/hooks/useHydrationSafe';
import Layout from '@/components/layout/Layout';

export default function ResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const { downloadResume } = useDownload();
  const mounted = useHydrationSafe();

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
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Resume</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Download my latest resume to learn more about my experience, skills, and achievements.
          </p>
        </motion.div>

        {/* Resume Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/[0.15] dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/[0.1] dark:border-white/[0.05] overflow-hidden mb-12"
        >
          {/* Resume Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <FileText size={40} />
                </div>
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold mb-2">
                    {resume?.title || 'Resume'}
                  </h2>
                  {mounted && (
                    <div className="flex items-center justify-center lg:justify-start space-x-2 text-indigo-100">
                      <Calendar size={18} />
                      <span className="text-lg">
                        Last updated: {resume ? formatDate(resume.updated) : 'N/A'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleDownloadResume}
                disabled={!resume}
                className="group flex items-center space-x-3 bg-white text-indigo-600 hover:bg-indigo-50 disabled:bg-gray-300 disabled:text-gray-500 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                <Download size={24} className="group-hover:animate-bounce" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Resume Content */}
          <div className="p-8">
            {resume ? (
              <div className="space-y-12">
                {/* Professional Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <User size={24} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Professional Summary
                    </h3>
                  </div>
                  <div className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-600/20">
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      Full Stack Developer with 3+ years of experience in building modern web applications. 
                      Specialized in React, Next.js, and Node.js with a passion for creating efficient, 
                      scalable solutions. Experienced in AI integration, cloud services, and modern development practices.
                    </p>
                  </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                  <div className="text-center p-6 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-600/20 hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl mx-auto mb-3">
                      <Award size={24} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                      3+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center p-6 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-600/20 hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl mx-auto mb-3">
                      <Briefcase size={24} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                      50+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                      Projects Completed
                    </div>
                  </div>
                  <div className="text-center p-6 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-600/20 hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mx-auto mb-3">
                      <Code size={24} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      15+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                      Technologies
                    </div>
                  </div>
                  <div className="text-center p-6 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-600/20 hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl mx-auto mb-3">
                      <Star size={24} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                      98%
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                      Client Satisfaction
                    </div>
                  </div>
                </motion.div>

                {/* Skills Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                      <Code size={24} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Core Skills & Technologies
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-600/20">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        Frontend Development
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'JavaScript', 'HTML5', 'CSS3', 'Sass'].map(skill => (
                          <span
                            key={skill}
                            className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm border border-indigo-200 dark:border-indigo-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-600/20">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Backend Development
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {['Node.js', 'Python', 'Firebase', 'MongoDB', 'PostgreSQL', 'Express.js', 'REST APIs', 'GraphQL'].map(skill => (
                          <span
                            key={skill}
                            className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm border border-emerald-200 dark:border-emerald-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="bg-gradient-to-r from-indigo-50/80 to-violet-50/80 dark:from-indigo-900/30 dark:to-violet-900/30 backdrop-blur-md p-8 rounded-2xl border border-white/20 dark:border-gray-600/20"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Mail size={24} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Let's Connect
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a
                      href="mailto:gaurav@example.com"
                      className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 rounded-xl transition-all duration-300 group backdrop-blur-sm border border-white/30 dark:border-gray-700/30"
                    >
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                        <Mail size={20} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Email</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">gaurav@example.com</div>
                      </div>
                    </a>
                    <a
                      href="https://linkedin.com/in/gauravpatil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 rounded-xl transition-all duration-300 group backdrop-blur-sm border border-white/30 dark:border-gray-700/30"
                    >
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                        <ExternalLink size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">LinkedIn</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Connect with me</div>
                      </div>
                    </a>
                    <a
                      href="https://github.com/gauravpatil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 rounded-xl transition-all duration-300 group backdrop-blur-sm border border-white/30 dark:border-gray-700/30"
                    >
                      <div className="p-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700/50 transition-colors">
                        <ExternalLink size={20} className="text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">GitHub</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">View my code</div>
                      </div>
                    </a>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 dark:text-gray-600 mb-6">
                  <FileText size={64} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Resume not available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  The resume is currently being updated. Please check back later.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-white/[0.15] dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/[0.1] dark:border-white/[0.05] p-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Want to know more?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
              Explore my projects to see my work in action, or get in touch to discuss opportunities and collaborations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/projects"
                className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>View Projects</span>
                <ExternalLink size={20} />
              </a>
              <a
                href="mailto:gaurav@example.com"
                className="inline-flex items-center justify-center space-x-2 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                <span>Contact Me</span>
                <Mail size={20} />
              </a>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </Layout>
  );
}