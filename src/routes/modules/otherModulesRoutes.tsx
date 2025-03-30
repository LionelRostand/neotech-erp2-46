import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const OtherModulesRoutes = [
  <Route key="academy" path="/modules/academy/*" element={<ModuleLayout moduleId={4} />} />,
  
  // Restaurant module routes
  <Route key="restaurant" path="/modules/restaurant" element={<ModuleLayout moduleId={5} />}>
    <Route 
      path="pos" 
      element={<SubmodulePage moduleId={5} submoduleId="restaurant-pos" />} 
    />
    <Route 
      path="list" 
      element={<SubmodulePage moduleId={5} submoduleId="restaurant-list" />} 
    />
    <Route 
      path="layout" 
      element={<SubmodulePage moduleId={5} submoduleId="restaurant-layout" />} 
    />
    <Route 
      path="orders" 
      element={<SubmodulePage moduleId={5} submoduleId="restaurant-orders" />} 
    />
    <Route 
      path="payments" 
      element={<SubmodulePage moduleId={5} submoduleId="restaurant-payments" />} 
    />
    <Route 
      path="kitchen" 
      element={<SubmodulePage moduleId={5} submoduleId="restaurant-kitchen" />} 
    />
    <Route 
      path="clients" 
      element={<SubmodulePage moduleId={5} submoduleId="restaurant-clients" />} 
    />
    <Route 
      path="reservations" 
      element={<SubmodulePage moduleId={5} submoduleId="restaurant-reservations" />} 
    />
    <Route 
      path="tickets" 
      element={<SubmodulePage moduleId={5} submoduleId="restaurant-tickets" />} 
    />
    <Route 
      path="web-reservations" 
      element={<SubmodulePage moduleId={5} submoduleId="restaurant-web-reservations" />} 
    />
    <Route 
      path="settings" 
      element={<SubmodulePage moduleId={5} submoduleId="restaurant-settings" />} 
    />
  </Route>,
  
  // Garage module routes
  <Route key="garage" path="/modules/garage" element={<ModuleLayout moduleId={6} />}>
    <Route 
      path="dashboard" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-dashboard" />} 
    />
    <Route 
      path="clients" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-clients" />} 
    />
    <Route 
      path="vehicles" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-vehicles" />} 
    />
    <Route 
      path="appointments" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-appointments" />} 
    />
    <Route 
      path="repairs" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-repairs" />} 
    />
    <Route 
      path="invoices" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-invoices" />} 
    />
    <Route 
      path="suppliers" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-suppliers" />} 
    />
    <Route 
      path="inventory" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-inventory" />} 
    />
    <Route 
      path="loyalty" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-loyalty" />} 
    />
    <Route 
      path="settings" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-settings" />} 
    />
  </Route>,
  
  <Route key="ecommerce" path="/modules/ecommerce/*" element={<ModuleLayout moduleId={10} />} />,
  
  // Website module routes
  <Route key="website" path="/modules/website" element={<ModuleLayout moduleId={11} />}>
    <Route 
      path="dashboard" 
      element={<SubmodulePage moduleId={11} submoduleId="website-dashboard" />} 
    />
    <Route 
      path="editor" 
      element={<SubmodulePage moduleId={11} submoduleId="website-editor" />} 
    />
    <Route 
      path="templates" 
      element={<SubmodulePage moduleId={11} submoduleId="website-templates" />} 
    />
    <Route 
      path="pages" 
      element={<SubmodulePage moduleId={11} submoduleId="website-pages" />} 
    />
    <Route 
      path="design" 
      element={<SubmodulePage moduleId={11} submoduleId="website-design" />} 
    />
    <Route 
      path="media" 
      element={<SubmodulePage moduleId={11} submoduleId="website-media" />} 
    />
    <Route 
      path="modules" 
      element={<SubmodulePage moduleId={11} submoduleId="website-modules" />} 
    />
    <Route 
      path="settings" 
      element={<SubmodulePage moduleId={11} submoduleId="website-settings" />} 
    />
  </Route>,
  
  // Salon module routes
  <Route key="salon" path="/modules/salon" element={<ModuleLayout moduleId={19} />}>
    <Route 
      path="dashboard" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-dashboard" />} 
    />
    <Route 
      path="clients" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-clients" />} 
    />
    <Route 
      path="appointments" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-appointments" />} 
    />
    <Route 
      path="stylists" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-stylists" />} 
    />
    <Route 
      path="services" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-services" />} 
    />
    <Route 
      path="products" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-products" />} 
    />
    <Route 
      path="billing" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-billing" />} 
    />
    <Route 
      path="loyalty" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-loyalty" />} 
    />
    <Route 
      path="inventory" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-inventory" />} 
    />
    <Route 
      path="reports" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-reports" />} 
    />
    <Route 
      path="booking" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-booking" />} 
    />
    <Route 
      path="settings" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-settings" />} 
    />
  </Route>
];
