
import { Route } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import AddProduct from "@/pages/AddProduct";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import Keywords from "@/pages/Keywords";
import { ProtectedRoute } from "../ProtectedRoute";
import { AuthGuard } from "../AuthGuard";

export const CoreRoutes = () => (
  <>
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    } />
    
    <Route path="/products" element={
      <ProtectedRoute>
        <MainLayout>
          <Products />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/products/add" element={
      <ProtectedRoute>
        <AddProduct />
      </ProtectedRoute>
    } />
    
    <Route path="/history" element={
      <ProtectedRoute>
        <MainLayout>
          <History />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/products/low-stock" element={
      <ProtectedRoute>
        <MainLayout>
          <Products filterType="low-stock" />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/keywords" element={
      <ProtectedRoute>
        <MainLayout>
          <Keywords />
        </MainLayout>
      </ProtectedRoute>
    } />
    
    <Route
      path="/settings"
      element={
        <AuthGuard>
          <MainLayout>
            <Settings />
          </MainLayout>
        </AuthGuard>
      }
    />
  </>
);
