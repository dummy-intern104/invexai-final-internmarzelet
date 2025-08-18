
import { Route } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import DailySales from "@/pages/reports/DailySales";
import MonthlySales from "@/pages/reports/MonthlySales";
import YearlySales from "@/pages/reports/YearlySales";
import SalesReturns from "@/pages/reports/SalesReturns";
import PurchaseReturns from "@/pages/reports/PurchaseReturns";
import StockReports from "@/pages/reports/StockReports";
import ProfitLoss from "@/pages/reports/ProfitLoss";
import GSTReports from "@/pages/reports/GSTReports";
import SupplierReports from "@/pages/reports/SupplierReports";
import ExpenseReports from "@/pages/reports/ExpenseReports";
import { ProtectedRoute } from "../ProtectedRoute";

export const ReportRoutes = () => (
  <>
    <Route path="/reports/daily-sales" element={
      <ProtectedRoute>
        <MainLayout>
          <DailySales />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/reports/monthly-sales" element={
      <ProtectedRoute>
        <MainLayout>
          <MonthlySales />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/reports/yearly-sales" element={
      <ProtectedRoute>
        <MainLayout>
          <YearlySales />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/reports/sales-returns" element={
      <ProtectedRoute>
        <MainLayout>
          <SalesReturns />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/reports/purchase-returns" element={
      <ProtectedRoute>
        <MainLayout>
          <PurchaseReturns />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/reports/stock" element={
      <ProtectedRoute>
        <MainLayout>
          <StockReports />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/reports/profit-loss" element={
      <ProtectedRoute>
        <MainLayout>
          <ProfitLoss />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/reports/gst" element={
      <ProtectedRoute>
        <MainLayout>
          <GSTReports />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/reports/suppliers" element={
      <ProtectedRoute>
        <MainLayout>
          <SupplierReports />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/reports/expenses" element={
      <ProtectedRoute>
        <MainLayout>
          <ExpenseReports />
        </MainLayout>
      </ProtectedRoute>
    } />
  </>
);
