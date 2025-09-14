"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Download, ExternalLink, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { getResume, getSections } from "@/lib/database";
import { Resume } from "@/types";
import { useDownload } from "@/lib/downloadUtils";

export default function HeroSection() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [otherPortfolioUrl, setOtherPortfolioUrl] = useState<string>("");
  const { downloadResume } = useDownload();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeData, sectionsData] = await Promise.all([
          getResume(),
          getSections(),
        ]);

        if (resumeData) {
          setResume(resumeData);
        }

        if (sectionsData?.otherPortfolio?.url) {
          setOtherPortfolioUrl(sectionsData.otherPortfolio.url);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDownloadResume = () => {
    if (resume?.url && resume?.title) {
      try {
        downloadResume(resume.url, resume.title, resume.originalFilename);
      } catch (error) {
        console.error("Download failed:", error);
      }
    }
  };

  const handleVisitPortfolio = () => {
    if (otherPortfolioUrl) {
      window.open(otherPortfolioUrl, "_blank");
    }
  };

  const handleSeeProjects = () => {
    router.push("/projects");
  };

  return (
    <section
      className="relative flex items-center justify-center py-12 sm:py-16 md:py-20"
      style={{ minHeight: "calc(100vh - 64px)", paddingBottom: "2rem" }}
      data-page="home"
    >
      {/* Subtle background pattern that allows aurora to show through */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.01]"></div>

      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/10 dark:bg-black/10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 flex flex-col justify-center h-full py-4 sm:py-6"
        >
          {/* Main Heading */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase"
            >
              Welcome to
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex items-center justify-center gap-4 mb-2"
            >
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
                <Image
                  src="/icon-512x512.png"
                  alt="Gaurav Workspace logo"
                  fill
                  sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight"
            >
              Gaurav Workspace
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2 sm:px-4"
            >
              Full Stack Developer crafting innovative web solutions with modern
              technologies. Explore my projects, download my resume, and
              discover my journey in tech.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center items-center max-w-4xl mx-auto px-2 sm:px-4"
          >
            <button
              onClick={handleDownloadResume}
              disabled={!resume}
              className="group flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto min-w-[200px] sm:min-w-[220px] min-h-[44px] active:scale-95"
            >
              <Download
                size={18}
                className="sm:w-[20px] sm:h-[20px] group-hover:animate-bounce"
              />
              <span>Download Resume</span>
            </button>

            <button
              onClick={handleVisitPortfolio}
              disabled={!otherPortfolioUrl}
              className="group flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto min-w-[200px] sm:min-w-[220px] min-h-[44px] active:scale-95"
            >
              <ExternalLink
                size={18}
                className="sm:w-[20px] sm:h-[20px] group-hover:rotate-45 transition-transform duration-300"
              />
              <span>Visit Main Portfolio</span>
            </button>

            <button
              onClick={handleSeeProjects}
              className="group flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto min-w-[200px] sm:min-w-[220px] min-h-[44px] active:scale-95"
            >
              <FolderOpen
                size={18}
                className="sm:w-[20px] sm:h-[20px] group-hover:scale-110 transition-transform duration-300"
              />
              <span>See Projects</span>
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto px-2 sm:px-4"
          >
            <div className="text-center active:scale-[0.98] active:opacity-80 p-2 rounded-xl hover:bg-white/5 dark:hover:bg-black/5 transition-colors duration-200">
              <div className="text-xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                50+
              </div>
              <div className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                Projects Completed
              </div>
            </div>
            <div className="text-center active:scale-[0.98] active:opacity-80 p-2 rounded-xl hover:bg-white/5 dark:hover:bg-black/5 transition-colors duration-200">
              <div className="text-xl sm:text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                3+
              </div>
              <div className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                Years Experience
              </div>
            </div>
            <div className="text-center active:scale-[0.98] active:opacity-80 p-2 rounded-xl hover:bg-white/5 dark:hover:bg-black/5 duration-200">
              <div className="text-xl sm:text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-1">
                100%
              </div>
              <div className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                Client Satisfaction
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
