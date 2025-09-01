'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';
import { getSections } from '@/lib/database';
import { Project, ProjectSection as ProjectSectionType } from '@/types';
import ProjectCard from '@/components/projects/ProjectCard';

export default function ProjectSection() {
  const [sections, setSections] = useState<Record<string, ProjectSectionType>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionsData = await getSections();
        if (sectionsData) {
          // Filter out otherPortfolio as it's not a project section
          const { otherPortfolio, ...projectSections } = sectionsData;
          setSections(projectSections);
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const getFeaturedProjects = (projects: Record<string, Project>): Project[] => {
    return Object.values(projects || {})
      .filter(project => project.featured)
      .slice(0, 3); // Show max 3 featured projects per section
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore my latest work across different categories - from portfolio pieces to experimental projects and AI integrations.
          </p>
        </motion.div>

        {/* Project Sections */}
        <div className="space-y-20">
          {Object.entries(sections).map(([sectionKey, section], sectionIndex) => {
            const featuredProjects = getFeaturedProjects(section.projects);
            
            if (featuredProjects.length === 0) return null;

            return (
              <motion.div
                key={sectionKey}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: sectionIndex * 0.2 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Section Title */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                  <Link
                    href="/projects"
                    className="group flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    <span>View All</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProjects.map((project, projectIndex) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: projectIndex * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to work together?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities and interesting projects. 
              Let's create something amazing together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span>View All Projects</span>
                <ArrowRight size={18} />
              </Link>
              <a
                href="mailto:gaurav@example.com"
                className="inline-flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span>Get In Touch</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}