import { ref, get, set, push, remove, onValue, off } from 'firebase/database';
import { database } from './firebase';
import { Project, ProjectSection, Resume } from '@/types';

// Get all sections data
export const getSections = async () => {
  try {
    const sectionsRef = ref(database, 'sections');
    const snapshot = await get(sectionsRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting sections:', error);
    throw error;
  }
};

// Update a section (like otherPortfolio)
export const updateSection = async (sectionName: string, data: any) => {
  try {
    const sectionRef = ref(database, `sections/${sectionName}`);
    await set(sectionRef, data);
  } catch (error) {
    console.error(`Error updating section ${sectionName}:`, error);
    throw error;
  }
};

// Get projects from a specific section
export const getProjectsBySection = async (sectionName: string) => {
  try {
    const projectsRef = ref(database, `sections/${sectionName}/projects`);
    const snapshot = await get(projectsRef);
    return snapshot.exists() ? snapshot.val() : {};
  } catch (error) {
    console.error(`Error getting projects from ${sectionName}:`, error);
    throw error;
  }
};

// Add a new project to a section
export const addProject = async (sectionName: string, project: Omit<Project, 'id'>) => {
  try {
    const projectsRef = ref(database, `sections/${sectionName}/projects`);
    const newProjectRef = push(projectsRef);
    const projectWithId = { ...project, id: newProjectRef.key };
    await set(newProjectRef, projectWithId);
    return projectWithId;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (sectionName: string, projectId: string, updates: Partial<Project>) => {
  try {
    const projectRef = ref(database, `sections/${sectionName}/projects/${projectId}`);
    
    // Get existing project data first
    const snapshot = await get(projectRef);
    const existingProject = snapshot.exists() ? snapshot.val() : {};
    
    // Merge existing data with updates, ensuring all properties are preserved
    const mergedProject = {
      ...existingProject,
      ...updates,
      id: projectId, // Ensure ID is always preserved
      // Ensure tags is always an array
      tags: updates.tags || existingProject.tags || []
    };
    
    await set(projectRef, mergedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (sectionName: string, projectId: string) => {
  try {
    const projectRef = ref(database, `sections/${sectionName}/projects/${projectId}`);
    await remove(projectRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Get resume data
export const getResume = async () => {
  try {
    const resumeRef = ref(database, 'resume/latest');
    const snapshot = await get(resumeRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting resume:', error);
    throw error;
  }
};

// Update resume data
export const updateResume = async (resume: Resume) => {
  try {
    const resumeRef = ref(database, 'resume/latest');
    await set(resumeRef, resume);
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};

// Delete resume data
export const deleteResume = async () => {
  try {
    const resumeRef = ref(database, 'resume/latest');
    await remove(resumeRef);
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

// Real-time listeners
export const listenToSections = (callback: (data: any) => void) => {
  const sectionsRef = ref(database, 'sections');
  onValue(sectionsRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  });
  return () => off(sectionsRef);
};

export const listenToResume = (callback: (data: Resume | null) => void) => {
  const resumeRef = ref(database, 'resume/latest');
  onValue(resumeRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  });
  return () => off(resumeRef);
};

// Bulk operations
export const bulkDeleteProjects = async (sectionName: string, projectIds: string[]) => {
  try {
    const deletePromises = projectIds.map(projectId =>
      deleteProject(sectionName, projectId)
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error bulk deleting projects:', error);
    throw error;
  }
};

export const moveProjects = async (projectIds: string[], fromSection: string, toSection: string) => {
  try {
    // Get all projects to move
    const projectsToMove: Project[] = [];
    for (const projectId of projectIds) {
      const projectRef = ref(database, `sections/${fromSection}/projects/${projectId}`);
      const snapshot = await get(projectRef);
      if (snapshot.exists()) {
        projectsToMove.push(snapshot.val());
      }
    }

    // Add projects to target section
    const addPromises = projectsToMove.map(project =>
      addProject(toSection, project)
    );
    await Promise.all(addPromises);

    // Remove projects from source section
    const deletePromises = projectIds.map(projectId =>
      deleteProject(fromSection, projectId)
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error moving projects:', error);
    throw error;
  }
};

export const duplicateProject = async (sectionName: string, project: Project) => {
  try {
    const duplicatedProject = {
      ...project,
      title: `${project.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    delete (duplicatedProject as any).id; // Remove the ID so a new one is generated
    return await addProject(sectionName, duplicatedProject);
  } catch (error) {
    console.error('Error duplicating project:', error);
    throw error;
  }
};

export const getProjectStats = async () => {
  try {
    const sectionsData = await getSections();
    if (!sectionsData) return null;

    const stats = {
      totalProjects: 0,
      featuredProjects: 0,
      projectsWithImages: 0,
      totalTags: new Set<string>(),
      sectionStats: {} as Record<string, { count: number; featured: number }>
    };

    Object.entries(sectionsData).forEach(([sectionKey, section]) => {
      if (section && typeof section === 'object' && 'projects' in section) {
        const projects = Object.values(section.projects || {});
        const sectionCount = projects.length;
        const sectionFeatured = projects.filter(p => p.featured).length;

        stats.sectionStats[sectionKey] = {
          count: sectionCount,
          featured: sectionFeatured
        };

        stats.totalProjects += sectionCount;
        stats.featuredProjects += sectionFeatured;
        stats.projectsWithImages += projects.filter(p => p.image).length;

        projects.forEach(project => {
          (project.tags || []).forEach((tag: string) => stats.totalTags.add(tag));
        });
      }
    });

    return {
      ...stats,
      uniqueTags: stats.totalTags.size
    };
  } catch (error) {
    console.error('Error getting project stats:', error);
    throw error;
  }
};