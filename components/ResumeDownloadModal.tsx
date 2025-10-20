"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Button, { buttonClasses } from "./Button";

interface ResumeDownloadModalProps {
  open: boolean;
  onClose: () => void;
  resumeUrl: string;
}

const ResumeDownloadModal = ({
  open,
  onClose,
  resumeUrl,
}: ResumeDownloadModalProps) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  // Handle instant download
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = resumeUrl;
      link.download = "Gaurav_Resume.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success feedback briefly
      setTimeout(() => {
        setIsDownloading(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
    }
  };

  // Handle view in new tab - Uses server-side proxy to bypass CORS and IDM
  const handleViewInNewTab = () => {
    // Create proxy URL through our API route
    // This bypasses CORS completely since it's our own server
    const proxyUrl = `/api/resume?url=${encodeURIComponent(resumeUrl)}`;

    // Open directly in new tab
    // Browser's native PDF viewer will handle it
    // IDM cannot intercept because it's served from our domain
    window.open(proxyUrl, "_blank", "noopener,noreferrer");

    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-200">
        <div className="glass relative rounded-2xl border border-white/10 bg-surface/95 p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Resume Ready! 📄
                </h2>
                <p className="text-sm text-slate-400">
                  Choose how you'd like to access it
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {/* View in New Tab */}
            <Button
              onClick={handleViewInNewTab}
              variant="primary"
              className="w-full justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">View in New Tab</div>
                  <div className="text-xs text-slate-400">
                    Quick preview in browser
                  </div>
                </div>
              </div>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>

            {/* Download */}
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="w-full justify-between text-left"
              disabled={isDownloading}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                  <svg
                    className="h-5 w-5 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">
                    {isDownloading ? "Downloading..." : "Download PDF"}
                  </div>
                  <div className="text-xs text-slate-400">
                    Save to your device
                  </div>
                </div>
              </div>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>

          {/* Footer note */}
          <div className="mt-6 flex items-start gap-2 rounded-lg bg-blue-500/10 p-3">
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs text-slate-300">
              <strong className="font-semibold">For HR/Recruiters:</strong> Use
              "View in New Tab" for instant preview without downloading.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeDownloadModal;
