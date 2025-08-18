
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { authChecked } = useAuthContext();
  
  useEffect(() => {
    // Check if auth has been checked
    if (authChecked) {
      // Always direct to auth page first
      // The Auth page will redirect to dashboard if already authenticated
      navigate("/auth");
    }
  }, [navigate, authChecked]);
  
  return null;
};

export default Index;
