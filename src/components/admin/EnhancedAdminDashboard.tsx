'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Trash2, 
  Copy, 
  Move, 
  Star, 
  Download, 
  Upload,
  MoreVertical,
  CheckSquare,
  Square,
  SortAsc,
  SortDesc,
  Calendar,
  Tag,
  Eye,
  BarChart3
} from 'lucide-react';
import { Project, ProjectSection as ProjectSectionType } from '@/types';
import EnhancedProjectCard from './EnhancedProjectCard';
import { useToast } from '@/components/providers/ToastProvider';

interface EnhancedAdminDashboardProps {
  sections: Record<string, ProjectSectionType>;
  selectedSection: string;
  onSectionChange: (section: string) => void;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onUpdateProject: (sectionName: string, projectId: string, updates: Partial<Project>) => Promise<void>;
  onMoveProjects: (projectIds: string[], targetSection: string) => Promise<void>;
  onDuplicateProject: (project: Project) => Promise<void>;
}

type SortOption = 'title' | 'date' | 'featured' | 'tags';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export default function EnhancedAdminDashboard({
  sections,
  selectedSection,
  onSectionChange,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onUpdateProject,
  onMoveProjects,
  onDuplicateProject
}: EnhancedAdminDashboardProps) {
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { showSuccess, showError, showInfo } = useToast();

  // Get current section projects
  const currentSectionProjects = useMemo(() => {
    return Object.values(sections[selectedSection]?.projects || {});
  }, [sections, selectedSection]);

  // Get all unique tags across all projects
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    Object.values(sections).forEach(section => {
      Object.values(section.projects || {}).forEach(project => {
        (project.tags || []).forEach(tag => tags.add(tag));
      });
    });
    return Array.from(tags).sort();
  }, [sections]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = currentSectionProjects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply tag filter
    if (filterTag) {
      filtered = filtered.filter(project =>
        (project.tags || []).includes(filterTag)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'featured':
          comparison = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          break;
        case 'tags':
          comparison = (a.tags || []).length - (b.tags || []).length;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [currentSectionProjects, searchTerm, filterTag, sortBy, sortDirection]);

  // Handle project selection
  const handleProjectSelect = (projectId: string, selected: boolean) => {
    const newSelected = new Set(selectedProjects);
    if (selected) {
      newSelected.add(projectId);
    } else {
      newSelected.delete(projectId);
    }
    setSelectedProjects(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  // Select all projects
  const handleSelectAll = () => {
    if (selectedProjects.size === filteredAndSortedProjects.length) {
      setSelectedProjects(new Set());
      setShowBulkActions(false);
    } else {
      const allIds = new Set(filteredAndSortedProjects.map(p => p.id));
      setSelectedProjects(allIds);
      setShowBulkActions(true);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedProjects(new Set());
    setShowBulkActions(false);
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedProjects.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedProjects.size} project(s)?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const deletePromises = Array.from(selectedProjects).map(projectId => 
        onDeleteProject(projectId)
      );
      
      await Promise.all(deletePromises);
      showSuccess('Bulk Delete', `Successfully deleted ${selectedProjects.size} project(s)`);
      clearSelection();
    } catch (error) {
      showError('Bulk Delete Failed', 'Some projects could not be deleted. Please try again.');
    }
  };

  // Bulk move
  const handleBulkMove = async (targetSection: string) => {
    if (selectedProjects.size === 0) return;

    try {
      await onMoveProjects(Array.from(selectedProjects), targetSection);
      showSuccess('Bulk Move', `Successfully moved ${selectedProjects.size} project(s) to ${sections[targetSection]?.title || targetSection}`);
      clearSelection();
    } catch (error) {
      showError('Bulk Move Failed', 'Some projects could not be moved. Please try again.');
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (projectId: string, featured: boolean) => {
    try {
      await onUpdateProject(selectedSection, projectId, { featured });
      showInfo('Project Updated', `Project ${featured ? 'marked as featured' : 'removed from featured'}`);
    } catch (error) {
      showError('Update Failed', 'Could not update project status');
    }
  };

  // Handle duplicate
  const handleDuplicate = async (project: Project) => {
    try {
      await onDuplicateProject(project);
      showSuccess('Project Duplicated', `Created a copy of "${project.title}"`);
    } catch (error) {
      showError('Duplicate Failed', 'Could not duplicate project');
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const total = currentSectionProjects.length;
    const featured = currentSectionProjects.filter(p => p.featured).length;
    const withImages = currentSectionProjects.filter(p => p.image).length;
    const avgTags = total > 0 ? Math.round(currentSectionProjects.reduce((sum, p) => sum + (p.tags || []).length, 0) / total) : 0;

    return { total, featured, withImages, avgTags };
  }, [currentSectionProjects]);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {sections[selectedSection]?.title || selectedSection} Projects
            </h2>
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>{stats.total} total</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>{stats.featured} featured</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{stats.withImages} with images</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4" />
                <span>{stats.avgTags} avg tags</span>
              </div>
            </div>
          </div>
          <button
            onClick={onAddProject}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Section Selector */}
          <select
            value={selectedSection}
            onChange={(e) => onSectionChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(sections).map(([key, section]) => (
              <option key={key} value={key}>
                {section.title} ({Object.keys(section.projects || {}).length})
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              title="Grid View"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              title="List View"
            >
              <List className="h-5 w-5" />
            </button>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tag Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by Tag
                  </label>
                  <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Tags</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Date Created</option>
                    <option value="title">Title</option>
                    <option value="featured">Featured Status</option>
                    <option value="tags">Number of Tags</option>
                  </select>
                </div>

                {/* Sort Direction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort Direction
                  </label>
                  <button
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center space-x-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {sortDirection === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                    <span>{sortDirection === 'asc' ? 'Ascending' : 'Descending'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  {selectedProjects.size} project(s) selected
                </span>
                <button
                  onClick={clearSelection}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
                <select
                  onChange={(e) => e.target.value && handleBulkMove(e.target.value)}
                  className="px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  defaultValue=""
                >
                  <option value="">Move to...</option>
                  {Object.entries(sections)
                    .filter(([key]) => key !== selectedSection)
                    .map(([key, section]) => (
                      <option key={key} value={key}>
                        {section.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Select All */}
      {filteredAndSortedProjects.length > 0 && (
        <div className="flex items-center justify-between">
          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {selectedProjects.size === filteredAndSortedProjects.length ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            <span>
              {selectedProjects.size === filteredAndSortedProjects.length ? 'Deselect All' : 'Select All'}
            </span>
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredAndSortedProjects.length} of {currentSectionProjects.length} projects
          </span>
        </div>
      )}

      {/* Projects Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {filteredAndSortedProjects.map((project) => (
          <EnhancedProjectCard
            key={project.id}
            project={project}
            isSelected={selectedProjects.has(project.id)}
            onSelect={handleProjectSelect}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
            onDuplicate={handleDuplicate}
            onToggleFeatured={handleToggleFeatured}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            {searchTerm || filterTag ? (
              <Filter className="h-12 w-12 mx-auto" />
            ) : (
              <Plus className="h-12 w-12 mx-auto" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || filterTag ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || filterTag 
              ? 'Try adjusting your search criteria or filters.'
              : 'Get started by adding your first project.'
            }
          </p>
          {!searchTerm && !filterTag && (
            <button
              onClick={onAddProject}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Your First Project</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}