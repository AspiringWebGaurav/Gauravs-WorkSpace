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
      className="relative flex items-center justify-center h-full"
      style={{
        padding: 'clamp(0.125rem, 1vh, 2.5rem) 0',
        paddingBottom: 'clamp(0.0625rem, 0.25vh, 1.5rem)'
      }}
      data-page="home"
    >
      {/* Subtle background pattern that allows aurora to show through */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.01]"></div>

      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/10 dark:bg-black/10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center h-full"
          style={{ gap: 'clamp(0.25rem, 1vh, 2.5rem)' }}
        >
          {/* Main Heading */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.0625rem, 0.25vh, 1rem)' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase"
              style={{ fontSize: 'clamp(0.625rem, 1vh, 1rem)' }}
            >
              Welcome to
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex items-center justify-center"
              style={{ marginBottom: 'clamp(0.0625rem, 0.125vh, 1rem)' }}
            >
              <div className="relative" style={{
                width: 'clamp(1.75rem, 3vh, 5rem)',
                height: 'clamp(1.75rem, 3vh, 5rem)'
              }}>
                <Image
                  src="/icon-512x512.png"
                  alt="Gaurav Workspace logo"
                  fill
                  sizes="(max-width: 640px) 32px, (max-width: 768px) 48px, 80px"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-bold text-gray-900 dark:text-white leading-tight tracking-tight"
              style={{
                fontSize: 'clamp(1.25rem, 5vh, 5rem)',
                lineHeight: 'clamp(1.5rem, 5.5vh, 5.5rem)'
              }}
            >
              Gaurav Workspace
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2 sm:px-4"
              style={{
                fontSize: 'clamp(0.625rem, 1.25vh, 1.125rem)',
                lineHeight: 'clamp(0.875rem, 1.75vh, 1.75rem)'
              }}
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
            className="flex flex-col sm:flex-row justify-center items-center max-w-4xl mx-auto px-2 sm:px-4"
            style={{ gap: 'clamp(0.25rem, 0.5vh, 1.25rem)' }}
          >
            <button
              onClick={handleDownloadResume}
              disabled={!resume}
              className="group flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto min-w-[200px] sm:min-w-[220px] min-h-[44px] active:scale-95"
              style={{
                padding: 'clamp(0.5rem, 1vh, 1.25rem) clamp(1rem, 2vh, 2.5rem)',
                fontSize: 'clamp(0.75rem, 1vh, 1.125rem)'
              }}
            >
              <Download
                size={18}
                className="group-hover:animate-bounce"
              />
              <span>Download Resume</span>
            </button>

            <button
              onClick={handleVisitPortfolio}
              disabled={!otherPortfolioUrl}
              className="group flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto min-w-[200px] sm:min-w-[220px] min-h-[44px] active:scale-95"
              style={{
                padding: 'clamp(0.5rem, 1vh, 1.25rem) clamp(1rem, 2vh, 2.5rem)',
                fontSize: 'clamp(0.75rem, 1vh, 1.125rem)'
              }}
            >
              <ExternalLink
                size={18}
                className="group-hover:rotate-45 transition-transform duration-300"
              />
              <span>Visit Main Portfolio</span>
            </button>

            <button
              onClick={handleSeeProjects}
              className="group flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto min-w-[200px] sm:min-w-[220px] min-h-[44px] active:scale-95"
              style={{
                padding: 'clamp(0.5rem, 1vh, 1.25rem) clamp(1rem, 2vh, 2.5rem)',
                fontSize: 'clamp(0.75rem, 1vh, 1.125rem)'
              }}
            >
              <FolderOpen
                size={18}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <span>See Projects</span>
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 max-w-2xl mx-auto px-2 sm:px-4"
            style={{ gap: 'clamp(0.125rem, 0.5vh, 2rem)' }}
          >
            <div className="text-center active:scale-[0.98] active:opacity-80 rounded-xl hover:bg-white/5 dark:hover:bg-black/5 transition-colors duration-200" style={{
              padding: 'clamp(0.0625rem, 0.125vh, 1rem)'
            }}>
              <div className="font-bold text-blue-600 dark:text-blue-400" style={{
                fontSize: 'clamp(0.75rem, 1.75vh, 2.5rem)',
                marginBottom: 'clamp(0.03125rem, 0.0625vh, 0.5rem)'
              }}>
                50+
              </div>
              <div className="leading-relaxed text-gray-600 dark:text-gray-400 font-medium" style={{
                fontSize: 'clamp(0.4375rem, 0.75vh, 0.875rem)',
                lineHeight: 'clamp(0.625rem, 0.875vh, 1.25rem)'
              }}>
                Projects Completed
              </div>
            </div>
            <div className="text-center active:scale-[0.98] active:opacity-80 rounded-xl hover:bg-white/5 dark:hover:bg-black/5 transition-colors duration-200" style={{
              padding: 'clamp(0.0625rem, 0.125vh, 1rem)'
            }}>
              <div className="font-bold text-purple-600 dark:text-purple-400" style={{
                fontSize: 'clamp(0.75rem, 1.75vh, 2.5rem)',
                marginBottom: 'clamp(0.03125rem, 0.0625vh, 0.5rem)'
              }}>
                3+
              </div>
              <div className="leading-relaxed text-gray-600 dark:text-gray-400 font-medium" style={{
                fontSize: 'clamp(0.4375rem, 0.75vh, 0.875rem)',
                lineHeight: 'clamp(0.625rem, 0.875vh, 1.25rem)'
              }}>
                Years Experience
              </div>
            </div>
            <div className="text-center active:scale-[0.98] active:opacity-80 rounded-xl hover:bg-white/5 dark:hover:bg-black/5 transition-colors duration-200" style={{
              padding: 'clamp(0.0625rem, 0.125vh, 1rem)'
            }}>
              <div className="font-bold text-green-600 dark:text-green-400" style={{
                fontSize: 'clamp(0.75rem, 1.75vh, 2.5rem)',
                marginBottom: 'clamp(0.03125rem, 0.0625vh, 0.5rem)'
              }}>
                100%
              </div>
              <div className="leading-relaxed text-gray-600 dark:text-gray-400 font-medium" style={{
                fontSize: 'clamp(0.4375rem, 0.75vh, 0.875rem)',
                lineHeight: 'clamp(0.625rem, 0.875vh, 1.25rem)'
              }}>
                Client Satisfaction
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
