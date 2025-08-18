import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, authChecked } = useAuthContext();

  // Add check for authChecked to ensure we've at least attempted to check auth status
  if (isLoading || !authChecked) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // If not loading and no user, redirect to auth page
  if (!user) {
    console.log("No authenticated user, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
  
  // Otherwise render children
  return <>{children}</>;
};
