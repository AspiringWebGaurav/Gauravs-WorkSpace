'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Github, 
  Star, 
  Calendar,
  Eye,
  MoreVertical,
  Move
} from 'lucide-react';
import { Project } from '@/types';
import { formatDate } from '@/lib/utils';

interface EnhancedProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (projectId: string, selected: boolean) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onDuplicate: (project: Project) => void;
  onToggleFeatured: (projectId: string, featured: boolean) => void;
  viewMode: 'grid' | 'list';
}

export default function EnhancedProjectCard({
  project,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFeatured,
  viewMode
}: EnhancedProjectCardProps) {
  const [showActions, setShowActions] = useState(false);

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(project.id, e.target.checked);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
          isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="p-4 flex items-center space-x-4">
          {/* Selection Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelectChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            aria-label={`Select project ${project.title}`}
          />

          {/* Project Image */}
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                {project.title.charAt(0)}
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {project.title}
              </h3>
              {project.featured && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 mb-2">
              {project.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{(project.tags || []).length} tags</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="hidden md:flex flex-wrap gap-1 max-w-xs">
            {(project.tags || []).slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {(project.tags || []).length > 3 && (
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                +{(project.tags || []).length - 3}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="View Live"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="View Code"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            <button
              onClick={() => onEdit(project)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl group ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Selection Overlay */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelectChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded shadow-sm"
          aria-label={`Select project ${project.title}`}
        />
      </div>

      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Star className="h-3 w-3 fill-current" />
            <span>Featured</span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showActions ? 1 : 0 }}
        className="absolute top-3 right-3 z-20 flex space-x-1"
        style={{ display: project.featured ? 'none' : 'flex' }}
      >
        <button
          onClick={() => onToggleFeatured(project.id, !project.featured)}
          className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          title="Toggle Featured"
        >
          <Star className="h-3 w-3 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={() => onDuplicate(project)}
          className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          title="Duplicate"
        >
          <Copy className="h-3 w-3 text-gray-600 dark:text-gray-300" />
        </button>
      </motion.div>

      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showActions ? 1 : 0 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-3"
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="View Live"
            >
              <ExternalLink className="h-4 w-4 text-gray-700" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="View Code"
            >
              <Github className="h-4 w-4 text-gray-700" />
            </a>
          )}
          <button
            onClick={() => onEdit(project)}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="Edit Project"
          >
            <Edit className="h-4 w-4 text-gray-700" />
          </button>
        </motion.div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
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

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
          <button
            onClick={() => onDelete(project.id)}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}