'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getResume, getSections } from '@/lib/database';
import { Resume } from '@/types';
import { useDownload } from '@/lib/downloadUtils';

export default function HeroSection() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [otherPortfolioUrl, setOtherPortfolioUrl] = useState<string>('');
  const { downloadResume } = useDownload();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeData, sectionsData] = await Promise.all([
          getResume(),
          getSections()
        ]);
        
        if (resumeData) {
          setResume(resumeData);
        }
        
        if (sectionsData?.otherPortfolio?.url) {
          setOtherPortfolioUrl(sectionsData.otherPortfolio.url);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDownloadResume = () => {
    if (resume?.url && resume?.title) {
      try {
        downloadResume(resume.url, resume.title, resume.originalFilename);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };

  const handleVisitPortfolio = () => {
    if (otherPortfolioUrl) {
      window.open(otherPortfolioUrl, '_blank');
    }
  };

  const handleSeeProjects = () => {
    router.push('/projects');
  };

  return (
    <section
      className="relative flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      style={{ height: 'calc(100vh - 64px - 120px)' }}
      data-page="home"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 flex flex-col justify-center h-full py-2 sm:py-4"
        >
          {/* Main Heading */}
          <div className="space-y-1 sm:space-y-2 md:space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase"
            >
              Welcome to
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Gaurav's Workspace
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-1 sm:px-2"
            >
              Full Stack Developer crafting innovative web solutions with modern technologies.
              Explore my projects, download my resume, and discover my journey in tech.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center max-w-4xl mx-auto px-1 sm:px-2"
          >
            <button
              onClick={handleDownloadResume}
              disabled={!resume}
              className="group flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto min-w-[160px] sm:min-w-[200px]"
            >
              <Download size={16} className="sm:w-[18px] sm:h-[18px] group-hover:animate-bounce" />
              <span>Download Resume</span>
            </button>
            
            <button
              onClick={handleVisitPortfolio}
              disabled={!otherPortfolioUrl}
              className="group flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto min-w-[160px] sm:min-w-[200px]"
            >
              <ExternalLink size={16} className="sm:w-[18px] sm:h-[18px] group-hover:rotate-45 transition-transform duration-300" />
              <span>Visit Main Portfolio</span>
            </button>

            <button
              onClick={handleSeeProjects}
              className="group flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full sm:w-auto min-w-[160px] sm:min-w-[200px]"
            >
              <FolderOpen size={16} className="sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform duration-300" />
              <span>See Projects</span>
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 max-w-2xl mx-auto px-1 sm:px-2"
          >
            <div className="text-center">
              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">50+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">3+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">100%</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}