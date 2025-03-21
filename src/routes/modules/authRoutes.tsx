
import React from 'react';
import { Route } from "react-router-dom";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

export const AuthRoutes = [
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="not-found" path="*" element={<NotFound />} />
];
