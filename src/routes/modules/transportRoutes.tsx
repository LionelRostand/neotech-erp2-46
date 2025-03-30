
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";
import TransportSettingsWrapper from '@/components/module/submodules/transport/settings/TransportSettingsWrapper';
import SelectPatch from '@/components/module/submodules/transport/patches/select-patch';

// Composant d'enveloppe pour appliquer SelectPatch à chaque sous-module
const WithSelectPatch: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <SelectPatch />
    {children}
  </>
);

export const TransportRoutes = (
  <Route key="transport" path="/modules/transport" element={<ModuleLayout moduleId={7} />}>
    <Route index element={<WithSelectPatch><SubmodulePage moduleId={7} submoduleId="transport-dashboard" /></WithSelectPatch>} />
    <Route path="dashboard" element={<WithSelectPatch><SubmodulePage moduleId={7} submoduleId="transport-dashboard" /></WithSelectPatch>} />
    <Route path="reservations" element={<WithSelectPatch><SubmodulePage moduleId={7} submoduleId="transport-reservations" /></WithSelectPatch>} />
    <Route path="planning" element={<WithSelectPatch><SubmodulePage moduleId={7} submoduleId="transport-planning" /></WithSelectPatch>} />
    <Route path="fleet" element={<WithSelectPatch><SubmodulePage moduleId={7} submoduleId="transport-fleet" /></WithSelectPatch>} />
    <Route path="drivers" element={<WithSelectPatch><SubmodulePage moduleId={7} submoduleId="transport-drivers" /></WithSelectPatch>} />
    <Route path="geolocation" element={<WithSelectPatch><SubmodulePage moduleId={7} submoduleId="transport-geolocation" /></WithSelectPatch>} />
    <Route path="payments" element={<WithSelectPatch><SubmodulePage moduleId={7} submoduleId="transport-payments" /></WithSelectPatch>} />
    <Route path="customer-service" element={<WithSelectPatch><SubmodulePage moduleId={7} submoduleId="transport-customer-service" /></WithSelectPatch>} />
    <Route path="loyalty" element={<WithSelectPatch><SubmodulePage moduleId={7} submoduleId="transport-loyalty" /></WithSelectPatch>} />
    <Route path="web-booking" element={<WithSelectPatch><SubmodulePage moduleId={7} submoduleId="transport-web-booking" /></WithSelectPatch>} />
    <Route path="settings" element={<TransportSettingsWrapper />} />
  </Route>
);
