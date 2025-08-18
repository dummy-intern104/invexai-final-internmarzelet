
import { Route } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import Clients from "@/pages/Clients";
import AddClient from "@/pages/AddClient";
import ClientDetail from "@/pages/ClientDetail";
import { ProtectedRoute } from "../ProtectedRoute";

export const ClientRoutes = () => (
  <>
    <Route path="/clients" element={
      <ProtectedRoute>
        <MainLayout>
          <Clients />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/clients/add" element={
      <ProtectedRoute>
        <AddClient />
      </ProtectedRoute>
    } />

    <Route path="/clients/:clientId" element={
      <ProtectedRoute>
        <MainLayout>
          <ClientDetail />
        </MainLayout>
      </ProtectedRoute>
    } />
  </>
);
