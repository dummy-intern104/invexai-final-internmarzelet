import { Route } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import Estimates from "@/pages/Estimates";
import CreateEstimate from "@/pages/CreateEstimate";
import { ProtectedRoute } from "../ProtectedRoute";

export const EstimateRoutes = () => (
  <>
    <Route path="/estimates" element={
      <ProtectedRoute>
        <MainLayout>
          <Estimates />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/estimates/create" element={
      <ProtectedRoute>
        <MainLayout>
          <CreateEstimate />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/estimates/view" element={
      <ProtectedRoute>
        <MainLayout>
          <Estimates />
        </MainLayout>
      </ProtectedRoute>
    } />
  </>
);