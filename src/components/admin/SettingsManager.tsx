'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, ExternalLink, Save, Loader } from 'lucide-react';
import { getSections, updateSection } from '@/lib/database';
import { useToast } from '@/components/providers/ToastProvider';

interface SettingsData {
  otherPortfolio: {
    title: string;
    url: string;
  };
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<SettingsData>({
    otherPortfolio: {
      title: 'Main Portfolio',
      url: ''
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const sectionsData = await getSections();
      
      if (sectionsData?.otherPortfolio) {
        setSettings({
          otherPortfolio: sectionsData.otherPortfolio
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      showError('Load Failed', 'Could not load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Update the otherPortfolio section
      await updateSection('otherPortfolio', settings.otherPortfolio);
      
      showSuccess('Settings Saved', 'Portfolio URL updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showError('Save Failed', 'Could not save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof SettingsData['otherPortfolio'], value: string) => {
    setSettings(prev => ({
      ...prev,
      otherPortfolio: {
        ...prev.otherPortfolio,
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Portfolio Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your main portfolio link and other settings
            </p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div className="space-y-6">
          {/* Portfolio URL Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Main Portfolio Link
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio Title
                </label>
                <input
                  type="text"
                  value={settings.otherPortfolio.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Main Portfolio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={settings.otherPortfolio.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.example.com"
                  />
                  <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This URL will be used for the "Visit Main Portfolio" button on the home page
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          {settings.otherPortfolio.url && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Button will link to:
                </span>
                <a
                  href={settings.otherPortfolio.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  {settings.otherPortfolio.url}
                </a>
                <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isSaving ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}