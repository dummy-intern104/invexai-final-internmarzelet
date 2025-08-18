import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import { useAuthContext } from "@/contexts/AuthContext";

// Route components
import { CoreRoutes } from "./routes/CoreRoutes";
import { SalesRoutes } from "./routes/SalesRoutes";
import { PurchaseRoutes } from "./routes/PurchaseRoutes";
import { ExpenseRoutes } from "./routes/ExpenseRoutes";
import { ReportRoutes } from "./routes/ReportRoutes";
import { StockRoutes } from "./routes/StockRoutes";
import { ClientRoutes } from "./routes/ClientRoutes";
import { PaymentRoutes } from "./routes/PaymentRoutes";
import { DeliveryRoutes } from "./routes/DeliveryRoutes";
import { EstimateRoutes } from "./routes/EstimateRoutes";
import { SupportRoutes } from "./routes/SupportRoutes";

export const Router = () => {
  let authContextValue;
  
  try {
    authContextValue = useAuthContext();
  } catch (error) {
    // If AuthContext is not available, show loading
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Initializing authentication...</div>
      </div>
    );
  }

  const { user, isLoading, authChecked } = authContextValue;

  // If still loading initial auth state, show loading
  if (isLoading && !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading application...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to either dashboard or auth depending on auth state */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />
        
        {/* Auth route - accessible only when not logged in */}
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
        
        {/* Protected routes - need authentication */}
        {CoreRoutes()}
        {SalesRoutes()}
        {PurchaseRoutes()}
        {ExpenseRoutes()}
        {ReportRoutes()}
        {StockRoutes()}
        {ClientRoutes()}
        {PaymentRoutes()}
        {DeliveryRoutes()}
        {EstimateRoutes()}
        
        {SupportRoutes()}
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
