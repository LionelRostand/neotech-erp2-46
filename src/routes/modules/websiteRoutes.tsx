
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";
import WebsiteTemplatePreviewWrapper from "@/components/module/submodules/website/preview/WebsiteTemplatePreviewWrapper";

export const WebsiteRoutes = (
  <Route key="website" path="/modules/website" element={<ModuleLayout moduleId={16} />}>
    <Route index element={<SubmodulePage moduleId={16} submoduleId="website-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={16} submoduleId="website-dashboard" />} />
    <Route path="content" element={<SubmodulePage moduleId={16} submoduleId="website-content" />} />
    <Route path="blog" element={<SubmodulePage moduleId={16} submoduleId="website-blog" />} />
    <Route path="analytics" element={<SubmodulePage moduleId={16} submoduleId="website-analytics" />} />
    <Route path="design" element={<SubmodulePage moduleId={16} submoduleId="website-design" />} />
    <Route path="settings" element={<SubmodulePage moduleId={16} submoduleId="website-settings" />} />
    <Route path="seo" element={<SubmodulePage moduleId={16} submoduleId="website-seo" />} />
    <Route path="templates" element={<SubmodulePage moduleId={16} submoduleId="website-templates" />} />
    <Route path="preview/templates/:templateId" element={<WebsiteTemplatePreviewWrapper />} />
  </Route>
);
