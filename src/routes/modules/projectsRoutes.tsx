
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const ProjectsRoutes = (
  <Route key="projects" path="/modules/projects" element={<ModuleLayout moduleId={3} />}>
    <Route index element={<SubmodulePage moduleId={3} submoduleId="projects-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={3} submoduleId="projects-dashboard" />} />
    <Route path="list" element={<SubmodulePage moduleId={3} submoduleId="projects-list" />} />
    <Route path="tasks" element={<SubmodulePage moduleId={3} submoduleId="projects-tasks" />} />
    <Route path="teams" element={<SubmodulePage moduleId={3} submoduleId="projects-teams" />} />
    <Route path="reports" element={<SubmodulePage moduleId={3} submoduleId="projects-reports" />} />
    <Route path="settings" element={<SubmodulePage moduleId={3} submoduleId="projects-settings" />} />
  </Route>
);
