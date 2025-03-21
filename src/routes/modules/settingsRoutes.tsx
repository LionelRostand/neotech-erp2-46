
import React from 'react';
import { Route, Navigate } from "react-router-dom";
import UserPermissions from "@/components/settings/UserPermissions";
import Translation from "@/components/settings/Translation";
import SmtpConfig from "@/components/settings/SmtpConfig";
import TwoFactorSettings from "@/components/settings/TwoFactorSettings";

export const SettingsRoutes = [
  // Settings routes - redirect from /settings to the first settings page
  <Route key="settings-redirect" path="/settings" element={<Navigate to="/settings/user-permissions" replace />} />,
  <Route key="user-permissions" path="/settings/user-permissions" element={<UserPermissions />} />,
  <Route key="translation" path="/settings/translation" element={<Translation />} />,
  <Route key="smtp" path="/settings/smtp" element={<SmtpConfig />} />,
  <Route key="2fa" path="/settings/2fa" element={<TwoFactorSettings />} />
];
