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
        transition={{ duration: 0.3 }}
        className="bg-white/[0.15] dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/[0.1] dark:border-white/[0.05] hover:shadow-2xl transition-all duration-300 overflow-hidden group p-6"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Project Image */}
          <div className="relative w-full lg:w-72 h-48 flex-shrink-0 overflow-hidden rounded-xl">
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
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {project.title}
                </h3>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm ml-4">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-base mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(project.tags || []).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex space-x-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-600/50 rounded-lg transition-all duration-200 backdrop-blur-sm"
                    aria-label="View on GitHub"
                  >
                    <Github size={18} />
                    <span className="text-sm font-medium">Code</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-all duration-200 backdrop-blur-sm"
                    aria-label="View Live Demo"
                  >
                    <ExternalLink size={18} />
                    <span className="text-sm font-medium">Live Demo</span>
                  </a>
                )}
              </div>

              {/* View Details Button */}
              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-semibold transition-colors duration-200 group">
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
      transition={{ duration: 0.3 }}
      className="bg-white/[0.15] dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/[0.1] dark:border-white/[0.05] hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
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
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(project.tags || []).slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
          {(project.tags || []).length > 3 && (
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium px-2 py-1">
              +{(project.tags || []).length - 3} more
            </span>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-4">
          <Calendar size={14} className="mr-2" />
          <span>{formatDate(project.createdAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-full transition-all duration-200 backdrop-blur-sm"
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
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-all duration-200 backdrop-blur-sm"
                aria-label="View Live Demo"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>

          {/* View Details Button */}
          <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium transition-colors duration-200 group">
            View Details 
            <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}