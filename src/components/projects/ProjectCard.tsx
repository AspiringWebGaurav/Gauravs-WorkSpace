'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Github, ExternalLink, Calendar, Star } from 'lucide-react';
import { Project } from '@/types';
import { formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  viewMode?: 'grid' | 'list';
}

export default function ProjectCard({ project, viewMode = 'grid' }: ProjectCardProps) {
  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className="transition-all duration-300 active:scale-[0.98] bg-white/[0.15] dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg active:shadow-md border border-white/[0.1] dark:border-white/[0.05] hover:shadow-2xl transition-all duration-300 overflow-hidden group p-4 sm:p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Project Image */}
          <div className="relative w-full lg:w-72 h-44 sm:h-48 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-200 active:scale-[0.98] active:opacity-80">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-3 right-3">
                <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} />
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Project Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Title and Date */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                <h3 className="text-xl xs:text-2xl sm:text-3xl leading-tight font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {project.title}
                </h3>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(project.tags || []).map((tag, index) => (
                  <span
                    key={index}
                    className="transition-all duration-200 active:scale-[0.98] active:opacity-80 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-xs sm:text-sm leading-relaxed font-medium px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-[0.98] active:opacity-80 flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-600/50 rounded-lg backdrop-blur-sm shadow-lg active:shadow-md"
                    aria-label="View on GitHub"
                  >
                    <Github size={18} />
                    <span className="text-xs sm:text-sm leading-relaxed font-medium">Code</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-[0.98] active:opacity-80 flex items-center gap-2 px-4 py-2.5 text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg backdrop-blur-sm shadow-lg active:shadow-md"
                    aria-label="View Live Demo"
                  >
                    <ExternalLink size={18} />
                    <span className="text-xs sm:text-sm leading-relaxed font-medium">Live Demo</span>
                  </a>
                )}
              </div>

              {/* View Details Button */}
              <button className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-[0.98] active:opacity-80 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs sm:text-sm leading-relaxed font-semibold group self-start sm:self-center p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                View Details
                <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="transition-all duration-300 active:scale-[0.98] bg-white/[0.15] dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg active:shadow-md border border-white/[0.1] dark:border-white/[0.05] hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Project Image */}
      <div className="relative h-44 sm:h-48 overflow-hidden transition-all duration-200 active:scale-[0.98] active:opacity-80">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <Star size={12} />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-4 sm:p-6">
        {/* Title */}
        <h3 className="text-lg xs:text-xl sm:text-2xl leading-tight font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
          {(project.tags || []).slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="transition-all duration-200 active:scale-[0.98] active:opacity-80 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full backdrop-blur-sm hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
          {(project.tags || []).length > 3 && (
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium px-2.5 py-1">
              +{(project.tags || []).length - 3} more
            </span>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
          <Calendar size={14} className="mr-2" />
          <span>{formatDate(project.createdAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 sm:space-x-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-[0.98] active:opacity-80 p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-full backdrop-blur-sm shadow-lg active:shadow-md"
                aria-label="View on GitHub"
              >
                <Github size={18} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-[0.98] active:opacity-80 p-2.5 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full backdrop-blur-sm shadow-lg active:shadow-md"
                aria-label="View Live Demo"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>

          {/* View Details Button */}
          <button className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-[0.98] active:opacity-80 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs sm:text-sm leading-relaxed font-medium group p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
            View Details
            <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}