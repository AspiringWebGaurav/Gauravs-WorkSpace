'use client';

import * as React from "react";
import { useSettings } from "@/components/SettingsProvider";

export const usePrefetchResume = () => {
  const { settings, refresh } = useSettings();
  const [resumeUrl, setResumeUrl] = React.useState<string | null>(
    settings?.resumeUrl ?? null
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(!settings);

  React.useEffect(() => {
    if (settings?.resumeUrl) {
      setResumeUrl(settings.resumeUrl);
      setIsLoading(false);
    }
  }, [settings?.resumeUrl, settings]);

  React.useEffect(() => {
    if (!resumeUrl) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = resumeUrl;
    link.as = "document";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [resumeUrl]);

  const refreshResume = React.useCallback(async () => {
    if (isLoading) return;
    if (!settings?.resumeUrl) {
      setIsLoading(true);
      await refresh();
      setIsLoading(false);
    }
  }, [isLoading, refresh, settings?.resumeUrl]);

  return { resumeUrl, refreshResume, isLoading };
};
