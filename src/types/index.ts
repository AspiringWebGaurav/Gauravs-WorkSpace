export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  section?: string; // Added for filtering purposes
}

export interface ProjectSection {
  title: string;
  projects: Record<string, Project>;
}

export interface Resume {
  title: string;
  url: string;
  updated: string;
}

export interface DatabaseStructure {
  sections: {
    portfolio: ProjectSection;
    beta: ProjectSection;
    ai: ProjectSection;
    live: ProjectSection;
    otherPortfolio: {
      title: string;
      url: string;
    };
  };
  resume: {
    latest: Resume;
  };
}

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}