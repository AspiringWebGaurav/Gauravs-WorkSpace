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
    await set(projectRef, updates);
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