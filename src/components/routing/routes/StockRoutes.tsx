
import { Route, Navigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import InStock from "@/pages/stock/InStock";
import LowStock from "@/pages/stock/LowStock";
import StockOut from "@/pages/stock/StockOut";
import ShortExpiry from "@/pages/stock/ShortExpiry";
import ExpiryStock from "@/pages/stock/Expiry";
import { ProtectedRoute } from "../ProtectedRoute";

export const StockRoutes = () => (
  <>
    <Route path="/stock" element={<Navigate to="/stock/in-stock" replace />} />
    
    <Route path="/stock/in-stock" element={
      <ProtectedRoute>
        <MainLayout>
          <InStock />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/stock/low-stock" element={
      <ProtectedRoute>
        <MainLayout>
          <LowStock />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/stock/stock-out" element={
      <ProtectedRoute>
        <MainLayout>
          <StockOut />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/stock/short-expiry" element={
      <ProtectedRoute>
        <MainLayout>
          <ShortExpiry />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/stock/expiry" element={
      <ProtectedRoute>
        <MainLayout>
          <ExpiryStock />
        </MainLayout>
      </ProtectedRoute>
    } />
  </>
);
