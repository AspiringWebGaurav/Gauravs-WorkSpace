'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Github, ExternalLink, Calendar } from 'lucide-react';
import { Project } from '@/types';
import { formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
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
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(project.tags || []).slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full"
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
          <Calendar size={14} className="mr-1" />
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
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
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
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all duration-200"
                aria-label="View Live Demo"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>

          {/* View Details Button */}
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200">
            View Details →
          </button>
        </div>
      </div>
    </motion.div>
  );
}