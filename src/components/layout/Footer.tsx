'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} Gaurav Patil. All rights reserved.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
              Built with Next.js + Firebase
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="https://github.com/gauravpatil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={20} />
            </Link>
            <Link
              href="https://linkedin.com/in/gauravpatil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </Link>
            <Link
              href="mailto:gaurav@example.com"
              className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
              aria-label="Email"
            >
              <Mail size={20} />
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="text-center md:text-right">
            <p className="text-gray-500 dark:text-gray-500 text-xs">
              Powered by
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Next.js
              </span>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Firebase
              </span>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                TailwindCSS
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-500 text-xs">
              This portfolio is open source and available on{' '}
              <Link
                href="https://github.com/gauravpatil/workspace"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                GitHub
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}