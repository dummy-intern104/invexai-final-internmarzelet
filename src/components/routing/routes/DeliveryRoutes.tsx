
import { Route } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import Delivery from "@/pages/Delivery";
import CreateChallan from "@/pages/CreateChallan";
import Estimates from "@/pages/Estimates";
import CreateEstimate from "@/pages/CreateEstimate";
import Expiry from "@/pages/Expiry";
import AddExpiry from "@/pages/AddExpiry";
import { ProtectedRoute } from "../ProtectedRoute";

export const DeliveryRoutes = () => (
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
        <CreateEstimate />
      </ProtectedRoute>
    } />
    
    <Route path="/delivery" element={
      <ProtectedRoute>
        <MainLayout>
          <Delivery />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/delivery/create" element={
      <ProtectedRoute>
        <CreateChallan />
      </ProtectedRoute>
    } />
    
    <Route path="/expiry" element={
      <ProtectedRoute>
        <MainLayout>
          <Expiry />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/expiry/add" element={
      <ProtectedRoute>
        <AddExpiry />
      </ProtectedRoute>
    } />
  </>
);
