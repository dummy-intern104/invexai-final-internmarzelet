
import { Route } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import Payments from "@/pages/Payments";
import AddPayment from "@/pages/AddPayment";
import { ProtectedRoute } from "../ProtectedRoute";

export const PaymentRoutes = () => (
  <>
    <Route path="/payments" element={
      <ProtectedRoute>
        <MainLayout>
          <Payments />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/payments/add" element={
      <ProtectedRoute>
        <AddPayment />
      </ProtectedRoute>
    } />
  </>
);
