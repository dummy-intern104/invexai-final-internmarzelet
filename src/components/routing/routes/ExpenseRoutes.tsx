
import { Route } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import ExpenseNew from "@/pages/expense/ExpenseNew";
import ExpenseList from "@/pages/expense/ExpenseList";
import ExpenseCategory from "@/pages/expense/ExpenseCategory";
import CategoryList from "@/pages/expense/CategoryList";
import { ProtectedRoute } from "../ProtectedRoute";

export const ExpenseRoutes = () => (
  <>
    <Route path="/expense/new" element={
      <ProtectedRoute>
        <MainLayout>
          <ExpenseNew />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/expense/list" element={
      <ProtectedRoute>
        <MainLayout>
          <ExpenseList />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/expense/category" element={
      <ProtectedRoute>
        <MainLayout>
          <ExpenseCategory />
        </MainLayout>
      </ProtectedRoute>
    } />

    <Route path="/expense/category-list" element={
      <ProtectedRoute>
        <MainLayout>
          <CategoryList />
        </MainLayout>
      </ProtectedRoute>
    } />
  </>
);
