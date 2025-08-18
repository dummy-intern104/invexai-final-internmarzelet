
import { Route } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import Sales from "@/pages/Sales";
import RecordSale from "@/pages/RecordSale";
import SalesInvoices from "@/pages/SalesInvoices";
import SalesInvoiceNew from "@/pages/SalesInvoiceNew";
import SalesReturns from "@/pages/SalesReturns";
import SalesReturnNew from "@/pages/SalesReturnNew";
import { ProtectedRoute } from "../ProtectedRoute";

export const SalesRoutes = () => (
  <>
    <Route path="/sales" element={
      <ProtectedRoute>
        <MainLayout>
          <Sales />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/sales/record" element={
      <ProtectedRoute>
        <MainLayout>
          <RecordSale />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/sales/invoices" element={
      <ProtectedRoute>
        <MainLayout>
          <SalesInvoices />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/sales/invoices/new" element={
      <ProtectedRoute>
        <MainLayout>
          <SalesInvoiceNew />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/sales/returns" element={
      <ProtectedRoute>
        <MainLayout>
          <SalesReturns />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/sales/returns/new" element={
      <ProtectedRoute>
        <MainLayout>
          <SalesReturnNew />
        </MainLayout>
      </ProtectedRoute>
    } />
  </>
);
