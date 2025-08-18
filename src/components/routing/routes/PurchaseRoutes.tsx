
import { Route } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import Purchases from "@/pages/Purchases";
import PurchaseOrders from "@/pages/PurchaseOrders";
import PurchaseReturns from "@/pages/PurchaseReturns";
import SupplierManagement from "@/pages/SupplierManagement";
import PurchaseList from "@/pages/PurchaseList";
import CreatePurchaseOrder from "@/pages/CreatePurchaseOrder";
import CreatePurchaseReturn from "@/pages/CreatePurchaseReturn";
import CreateSupplier from "@/pages/CreateSupplier";
import { ProtectedRoute } from "../ProtectedRoute";

export const PurchaseRoutes = () => (
  <>
    <Route path="/purchases" element={
      <ProtectedRoute>
        <MainLayout>
          <Purchases />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/purchases/orders" element={
      <ProtectedRoute>
        <MainLayout>
          <PurchaseOrders />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/purchases/orders/create" element={
      <ProtectedRoute>
        <CreatePurchaseOrder />
      </ProtectedRoute>
    } />

    <Route path="/purchases/returns" element={
      <ProtectedRoute>
        <MainLayout>
          <PurchaseReturns />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/purchases/returns/create" element={
      <ProtectedRoute>
        <CreatePurchaseReturn />
      </ProtectedRoute>
    } />

    <Route path="/purchases/suppliers" element={
      <ProtectedRoute>
        <MainLayout>
          <SupplierManagement />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/purchases/suppliers/create" element={
      <ProtectedRoute>
        <CreateSupplier />
      </ProtectedRoute>
    } />

    <Route path="/purchases/list" element={
      <ProtectedRoute>
        <MainLayout>
          <PurchaseList />
        </MainLayout>
      </ProtectedRoute>
    } />
  </>
);
