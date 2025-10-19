'use client';

import * as React from "react";
import { SettingsProvider } from "./SettingsProvider";
import { ToastProvider } from "./Toast";
import { AuthProvider } from "./AuthProvider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <AuthProvider>
      <SettingsProvider>{children}</SettingsProvider>
    </AuthProvider>
  </ToastProvider>
);
