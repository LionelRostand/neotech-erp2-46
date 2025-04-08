
import React from 'react';
import { Route, Navigate } from "react-router-dom";
import UserPermissions from "@/components/settings/UserPermissions";
import UserManagement from "@/components/settings/UserManagement";
import Translation from "@/components/settings/Translation";
import SmtpConfig from "@/components/settings/SmtpConfig";
import TwoFactorSettings from "@/components/settings/TwoFactorSettings";
import WebsiteSettings from "@/components/module/submodules/website/WebsiteSettings";
import FreightSettings from "@/components/module/submodules/freight/FreightSettings";

export const SettingsRoutes = [
  // Settings routes - redirect from /settings to the first settings page
  <Route key="settings-redirect" path="/settings" element={<Navigate to="/settings/user-management" replace />} />,
  <Route key="user-management" path="/settings/user-management" element={<UserManagement />} />,
  <Route key="user-permissions" path="/settings/user-permissions" element={<UserPermissions />} />,
  <Route key="translation" path="/settings/translation" element={<Translation />} />,
  <Route key="smtp" path="/settings/smtp" element={<SmtpConfig />} />,
  <Route key="2fa" path="/settings/2fa" element={<TwoFactorSettings />} />,
  <Route key="website" path="/settings/website" element={<WebsiteSettings />} />,
  <Route key="freight" path="/settings/freight" element={<FreightSettings />} />
];
