
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";
import WebsiteTemplatePreview from "@/components/module/submodules/website/WebsiteTemplatePreview";

export const WebsiteRoutes = (
  <Route key="website" path="/modules/website" element={<ModuleLayout moduleId={11} />}>
    <Route index element={<SubmodulePage moduleId={11} submoduleId="website-editor" />} />
    <Route path="editor" element={<SubmodulePage moduleId={11} submoduleId="website-editor" />} />
    <Route path="templates" element={<SubmodulePage moduleId={11} submoduleId="website-templates" />} />
    <Route path="pages" element={<SubmodulePage moduleId={11} submoduleId="website-pages" />} />
    <Route path="design" element={<SubmodulePage moduleId={11} submoduleId="website-design" />} />
    <Route path="theme" element={<SubmodulePage moduleId={11} submoduleId="website-theme" />} />
    <Route path="media" element={<SubmodulePage moduleId={11} submoduleId="website-media" />} />
    <Route path="modules" element={<SubmodulePage moduleId={11} submoduleId="website-modules" />} />
    <Route path="ecommerce" element={<SubmodulePage moduleId={11} submoduleId="website-ecommerce" />} />
    <Route path="seo" element={<SubmodulePage moduleId={11} submoduleId="website-seo" />} />
    <Route path="public" element={<SubmodulePage moduleId={11} submoduleId="website-public" />} />
    <Route path="domains" element={<SubmodulePage moduleId={11} submoduleId="website-domains" />} />
    <Route path="settings" element={<SubmodulePage moduleId={11} submoduleId="website-settings" />} />
    <Route path="preview/templates/:templateId" element={<WebsiteTemplatePreview />} />
  </Route>
);
