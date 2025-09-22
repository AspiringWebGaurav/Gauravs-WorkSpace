"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Download, ExternalLink, FolderOpen, Contact, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getResume, getSections } from "@/lib/database";
import { Resume } from "@/types";
import { useDownload } from "@/lib/downloadUtils";
import ShimmerButton from "@/components/ui/ShimmerButton";

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

  const handleContactForm = () => {
    // TODO: Implement contact form functionality
    console.log("Contact form clicked - to be implemented");
  };

  const handleAskAnything = () => {
    // TODO: Implement ask anything functionality
    console.log("Ask anything clicked - to be implemented");
  };

  return (
    <section
      className="relative flex items-center justify-center h-full"
      data-page="home"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-desktop-hero flex flex-col justify-center h-full"
        >
          {/* Main Heading */}
          <div className="space-desktop-hero flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-desktop-welcome text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase"
            >
              Welcome to
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex items-center justify-center mb-2 sm:mb-4"
            >
              <div className="relative w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20">
                <Image
                  src="/icon-512x512.png"
                  alt="Gaurav Workspace logo"
                  fill
                  sizes="(max-width: 640px) 32px, (max-width: 768px) 48px, (max-width: 1024px) 64px, 80px"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-desktop-hero font-bold text-gray-900 dark:text-white leading-tight tracking-tight"
            >
              Gaurav Workspace
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-desktop-body leading-relaxed text-gray-600 dark:text-gray-300 max-w-4xl mx-auto px-2 sm:px-4"
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
            className="space-desktop-buttons flex flex-col sm:flex-row justify-center items-center max-w-5xl mx-auto px-2 sm:px-4"
          >
            <ShimmerButton
              onClick={handleDownloadResume}
              disabled={!resume}
              className="btn-desktop-size group flex items-center justify-center space-x-2 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50 w-full sm:w-auto active:scale-95"
            >
              <Download
                size={18}
                className="group-hover:animate-bounce"
              />
              <span>Download Resume</span>
            </ShimmerButton>

            <ShimmerButton
              onClick={handleVisitPortfolio}
              disabled={!otherPortfolioUrl}
              className="btn-desktop-size group flex items-center justify-center space-x-2 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50 w-full sm:w-auto active:scale-95"
            >
              <ExternalLink
                size={18}
                className="group-hover:rotate-45 transition-transform duration-300"
              />
              <span>Visit Main Portfolio</span>
            </ShimmerButton>

            <ShimmerButton
              onClick={handleSeeProjects}
              className="btn-desktop-size group flex items-center justify-center space-x-2 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto active:scale-95"
            >
              <FolderOpen
                size={18}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <span>See Projects</span>
            </ShimmerButton>

            <ShimmerButton
              onClick={handleContactForm}
              className="btn-desktop-size group flex items-center justify-center space-x-2 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto active:scale-95"
            >
              <Contact
                size={18}
                className="group-hover:rotate-12 transition-transform duration-300"
              />
              <span>Contact me via Form</span>
            </ShimmerButton>

            <ShimmerButton
              onClick={handleAskAnything}
              className="btn-desktop-size group flex items-center justify-center space-x-2 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto active:scale-95"
            >
              <MessageCircle
                size={18}
                className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
              />
              <span>Ask me Anything</span>
            </ShimmerButton>
          </motion.div>

      
        </motion.div>
      </div>
    </section>
  );
}
