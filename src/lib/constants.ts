import { Home, FolderOpen, FileText, Settings } from "lucide-react";

// Shared navigation configuration to ensure consistency between Navbar and Footer
export const NAVIGATION_LINKS = [
  { 
    href: "/", 
    label: "Home",
    icon: Home
  },
  { 
    href: "/projects", 
    label: "Projects",
    icon: FolderOpen
  },
  { 
    href: "/resume", 
    label: "Resume",
    icon: FileText
  },
  { 
    href: "/admin", 
    label: "Admin",
    icon: Settings
  },
] as const;

// Tech stack for Footer
export const TECH_STACK = ["Next.js", "Firebase", "TailwindCSS"] as const;

// Social links for Footer
export const SOCIAL_LINKS = [
  {
    href: "https://github.com/gauravpatil",
    label: "GitHub",
    icon: "Github"
  },
  {
    href: "https://linkedin.com/in/gauravpatil", 
    label: "LinkedIn",
    icon: "Linkedin"
  },
  {
    href: "mailto:gaurav@example.com",
    label: "Email", 
    icon: "Mail"
  }
] as const;

// Utility function to check if a link is active
export const isActiveLink = (pathname: string, href: string): boolean => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname?.startsWith(href);
};