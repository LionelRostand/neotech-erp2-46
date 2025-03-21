
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const MessagesRoutes = (
  <Route key="messages" path="/modules/messages" element={<ModuleLayout moduleId={13} />}>
    <Route index element={<SubmodulePage moduleId={13} submoduleId="messages-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={13} submoduleId="messages-dashboard" />} />
    <Route path="contacts" element={<SubmodulePage moduleId={13} submoduleId="messages-contacts" />} />
    <Route path="compose" element={<SubmodulePage moduleId={13} submoduleId="messages-compose" />} />
    <Route path="inbox" element={<SubmodulePage moduleId={13} submoduleId="messages-inbox" />} />
    <Route path="archive" element={<SubmodulePage moduleId={13} submoduleId="messages-archive" />} />
    <Route path="scheduled" element={<SubmodulePage moduleId={13} submoduleId="messages-scheduled" />} />
    <Route path="settings" element={<SubmodulePage moduleId={13} submoduleId="messages-settings" />} />
  </Route>
);
