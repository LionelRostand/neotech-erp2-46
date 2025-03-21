
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const DocumentsRoutes = (
  <Route key="documents" path="/modules/documents" element={<ModuleLayout moduleId={16} />}>
    <Route index element={<SubmodulePage moduleId={16} submoduleId="documents-files" />} />
    <Route path="files" element={<SubmodulePage moduleId={16} submoduleId="documents-files" />} />
    <Route path="archive" element={<SubmodulePage moduleId={16} submoduleId="documents-archive" />} />
    <Route path="search" element={<SubmodulePage moduleId={16} submoduleId="documents-search" />} />
    <Route path="settings" element={<SubmodulePage moduleId={16} submoduleId="documents-settings" />} />
  </Route>
);
