'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, ExternalLink, Github, Calendar } from 'lucide-react';
import { getSections } from '@/lib/database';
import { Project, ProjectSection as ProjectSectionType } from '@/types';
import ProjectCard from '@/components/projects/ProjectCard';
import { useHydrationSafe } from '@/hooks/useHydrationSafe';

export default function ProjectsPage() {
  const [sections, setSections] = useState<Record<string, ProjectSectionType>>({});
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const mounted = useHydrationSafe();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const sectionsData = await getSections();
        if (sectionsData) {
          // Filter out otherPortfolio as it's not a project section
          const { otherPortfolio, ...projectSections } = sectionsData;
          setSections(projectSections);

          // Flatten all projects
          const projects: Project[] = [];
          Object.entries(projectSections).forEach(([sectionKey, section]) => {
            if (section && typeof section === 'object' && 'projects' in section) {
              Object.values(section.projects || {}).forEach(project => {
                if (project && typeof project === 'object') {
                  projects.push({ ...project as Project, section: sectionKey });
                }
              });
            }
          });

          setAllProjects(projects);
          setFilteredProjects(projects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get all unique tags
  const allTags = Array.from(
    new Set(allProjects.flatMap(project => project.tags || []))
  ).sort();

  // Filter projects based on search, section, and tags
  useEffect(() => {
    let filtered = allProjects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by section
    if (selectedSection !== 'all') {
      filtered = filtered.filter(project => (project as any).section === selectedSection);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
        selectedTags.every(tag => (project.tags || []).includes(tag))
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, selectedSection, selectedTags, allProjects]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedSection('all');
    setSelectedTags([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* Subtle background overlay for better readability */}
        <div className="fixed inset-0 bg-white/[0.08] dark:bg-black/[0.12] backdrop-blur-[0.5px] pointer-events-none"></div>
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      {/* Subtle background overlay for better readability */}
      <div className="fixed inset-0 bg-white/[0.08] dark:bg-black/[0.12] backdrop-blur-[0.5px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Projects</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore my portfolio of web applications, AI integrations, and experimental projects.
            Each project represents a unique challenge and learning experience.
          </p>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/[0.15] dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/[0.1] dark:border-white/[0.05] p-6 mb-8"
        >
          {/* Search and View Toggle */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100/80 dark:bg-gray-700/80 rounded-xl p-1 backdrop-blur-sm">
              <button
                onClick={() => setViewMode('grid')}
                title="Grid view"
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List view"
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Section Filter */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by Section</h3>
              {(searchTerm || selectedSection !== 'all' || selectedTags.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSection('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSection === 'all'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 backdrop-blur-sm'
                }`}
              >
                All ({allProjects.length})
              </button>
              {Object.entries(sections).map(([key, section]) => {
                const count = Object.keys(section.projects || {}).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedSection(key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedSection === key
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 backdrop-blur-sm'
                    }`}
                  >
                    {section.title} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Filter by Technology</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 backdrop-blur-sm'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Count and Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-6">
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Showing <span className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredProjects.length}</span> of <span className="text-gray-900 dark:text-white font-bold">{allProjects.length}</span> projects
              </p>
              {selectedTags.length > 0 && (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Filtered by:</span>
                  {selectedTags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {selectedTags.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">+{selectedTags.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ProjectCard project={project} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <div className="bg-white/[0.15] dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/[0.1] dark:border-white/[0.05] p-12 max-w-md mx-auto">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Filter size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search criteria or filters to find what you're looking for.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}