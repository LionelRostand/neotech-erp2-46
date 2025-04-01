
import React from 'react';
import { Route } from 'react-router-dom';
import ModuleLayout from '@/components/module/ModuleLayout';
import SubmodulePage from '@/components/module/SubmodulePage';
import WebsiteTemplatePreview from '@/components/module/submodules/website/WebsiteTemplatePreview';

export const WebsiteRoutes = (
  <Route path="/modules/website" element={<ModuleLayout moduleId={11} />}>
    <Route path="dashboard" element={<SubmodulePage moduleId={11} submoduleId="website-dashboard" />} />
    <Route path="editor" element={<SubmodulePage moduleId={11} submoduleId="website-editor" />} />
    <Route path="templates" element={<SubmodulePage moduleId={11} submoduleId="website-templates" />} />
    <Route path="templates/:templateId" element={<WebsiteTemplatePreview />} />
    <Route path="pages" element={<SubmodulePage moduleId={11} submoduleId="website-pages" />} />
    <Route path="design" element={<SubmodulePage moduleId={11} submoduleId="website-design" />} />
    <Route path="theme" element={<SubmodulePage moduleId={11} submoduleId="website-theme" />} />
    <Route path="media" element={<SubmodulePage moduleId={11} submoduleId="website-media" />} />
    <Route path="modules" element={<SubmodulePage moduleId={11} submoduleId="website-modules" />} />
    <Route path="public" element={<SubmodulePage moduleId={11} submoduleId="website-public" />} />
    <Route path="settings" element={<SubmodulePage moduleId={11} submoduleId="website-settings" />} />
  </Route>
);
