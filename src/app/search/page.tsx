import type { Metadata } from "next";
import Layout from '@/components/layout/Layout';
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Search - Gaurav Workspace",
  description: "Search through Gaurav's projects, notes, and files.",
  keywords: ["search", "find", "projects", "notes", "files", "Gaurav Workspace"],
};

export default function SearchPage() {
  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
              <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Search
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Search functionality is coming soon. You'll be able to search through projects, notes, and files across the workspace.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search workspace..."
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Feature under development
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}