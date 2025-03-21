
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";

export const OtherModulesRoutes = [
  <Route key="academy" path="/modules/academy/*" element={<ModuleLayout moduleId={4} />} />,
  <Route key="restaurant" path="/modules/restaurant/*" element={<ModuleLayout moduleId={5} />} />,
  <Route key="garage" path="/modules/garage/*" element={<ModuleLayout moduleId={6} />} />,
  <Route key="ecommerce" path="/modules/ecommerce/*" element={<ModuleLayout moduleId={10} />} />
];
