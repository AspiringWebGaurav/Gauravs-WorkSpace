'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LogOut,
  Settings,
  FolderOpen,
  FileText
} from 'lucide-react';
import { useAuthState } from '@/hooks/useAuth';
import {
  getSections,
  addProject,
  updateProject,
  deleteProject,
  getResume,
  updateResume,
  deleteResume,
  listenToSections,
  listenToResume,
  moveProjects,
  duplicateProject
} from '@/lib/database';
import { deleteFileByURL } from '@/lib/storage';
import { Project, ProjectSection as ProjectSectionType, Resume } from '@/types';
import ProjectForm from '@/components/admin/ProjectForm';
import ResumeManager from '@/components/admin/ResumeManager';
import EnhancedAdminDashboard from '@/components/admin/EnhancedAdminDashboard';
import { useToast } from '@/components/providers/ToastProvider';
import ToastProvider from '@/components/providers/ToastProvider';

export default function AdminPanelPage() {
  const [sections, setSections] = useState<Record<string, ProjectSectionType>>({});
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'resume'>('projects');
  const [selectedSection, setSelectedSection] = useState<string>('portfolio');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, loading: authLoading, signOut } = useAuthState();
  const { showSuccess, showError, showInfo } = useToast();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  // Set up real-time listeners
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    // Listen to sections changes
    const unsubscribeSections = listenToSections((sectionsData) => {
      if (sectionsData) {
        const { otherPortfolio, ...projectSections } = sectionsData;
        setSections(projectSections);
      }
      setLoading(false);
    });

    // Listen to resume changes
    const unsubscribeResume = listenToResume((resumeData) => {
      setResume(resumeData);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeSections();
      unsubscribeResume();
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    const projectToDelete = sections[selectedSection]?.projects?.[projectId];
    const projectTitle = projectToDelete?.title || 'Unknown Project';
    
    if (!confirm(`Are you sure you want to delete "${projectTitle}"?\n\nThis will also remove any associated images and cannot be undone.`)) {
      return;
    }

    try {
      // Delete project image from storage if it exists
      if (projectToDelete?.image && projectToDelete.image.startsWith('https://')) {
        try {
          await deleteFileByURL(projectToDelete.image);
        } catch (error) {
          console.warn('Could not delete project image from storage:', error);
          // Continue with project deletion even if image deletion fails
        }
      }

      // Delete project from database
      await deleteProject(selectedSection, projectId);
      showSuccess('Project Deleted', `${projectTitle} and its associated files have been removed successfully`);
      // Real-time listener will automatically update the UI
    } catch (error: any) {
      console.error('Error deleting project:', error);
      const errorMessage = error.message || 'Failed to delete project. Please try again.';
      showError('Delete Failed', errorMessage);
    }
  };

  const handleProjectSubmit = async (projectData: Omit<Project, 'id'>) => {
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (editingProject) {
        // Update existing project
        await updateProject(selectedSection, editingProject.id, projectData);
        result = { ...projectData, id: editingProject.id };
        showSuccess('Project Updated', `${projectData.title} has been updated successfully`);
      } else {
        // Add new project
        result = await addProject(selectedSection, projectData);
        showSuccess('Project Created', `${projectData.title} has been added to ${sections[selectedSection]?.title || selectedSection}`);
      }

      // Real-time listeners will automatically update the UI
      setShowProjectForm(false);
      setEditingProject(null);
    } catch (error: any) {
      console.error('Error saving project:', error);
      const errorMessage = error.message || 'Failed to save project. Please try again.';
      showError('Save Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveProjects = async (projectIds: string[], targetSection: string) => {
    try {
      await moveProjects(projectIds, selectedSection, targetSection);
    } catch (error) {
      console.error('Error moving projects:', error);
      throw error;
    }
  };

  const handleDuplicateProject = async (project: Project) => {
    try {
      await duplicateProject(selectedSection, project);
    } catch (error) {
      console.error('Error duplicating project:', error);
      throw error;
    }
  };

  const handleResumeUpdate = async (newResume: Resume) => {
    try {
      await updateResume(newResume);
      // Real-time listener will automatically update the UI
      showInfo('Dashboard Updated', 'Resume information has been updated across the site');
    } catch (error: any) {
      console.error('Error updating resume:', error);
      const errorMessage = error.message || 'Failed to update resume. Please try again.';
      showError('Update Failed', errorMessage);
      throw error; // Re-throw to let ResumeManager handle it
    }
  };

  const handleResumeDelete = async () => {
    try {
      // Real-time listener will automatically update the UI to show no resume
      showInfo('Dashboard Updated', 'Resume has been removed from the workspace');
    } catch (error: any) {
      console.error('Error handling resume deletion:', error);
      const errorMessage = error.message || 'Failed to update dashboard after deletion.';
      showError('Update Failed', errorMessage);
    }
  };

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* Subtle background overlay for better readability */}
        <div className="fixed inset-0 bg-white/[0.08] dark:bg-black/[0.12] backdrop-blur-[0.5px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const sectionKeys = Object.keys(sections);
  const currentSectionProjects = Object.values(sections[selectedSection]?.projects || {});

  return (
    <ToastProvider>
      <div className="min-h-screen">
        {/* Subtle background overlay for better readability */}
        <div className="fixed inset-0 bg-white/[0.08] dark:bg-black/[0.12] backdrop-blur-[0.5px] pointer-events-none"></div>
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'projects'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <FolderOpen className="inline-block w-4 h-4 mr-2" />
                Manage Projects
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'resume'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <FileText className="inline-block w-4 h-4 mr-2" />
                Manage Resume
              </button>
            </nav>
          </div>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <EnhancedAdminDashboard
            sections={sections}
            selectedSection={selectedSection}
            onSectionChange={setSelectedSection}
            onAddProject={handleAddProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onUpdateProject={updateProject}
            onMoveProjects={handleMoveProjects}
            onDuplicateProject={handleDuplicateProject}
          />
        )}

        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <ResumeManager
            resume={resume}
            onResumeUpdate={handleResumeUpdate}
            onResumeDelete={handleResumeDelete}
          />
        )}
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm
          project={editingProject}
          isSubmitting={isSubmitting}
          onSubmit={handleProjectSubmit}
          onClose={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
        />
        )}
      </div>
    </ToastProvider>
  );
}