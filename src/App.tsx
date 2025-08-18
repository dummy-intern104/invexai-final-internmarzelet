
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Router from "@/components/routing/Router";
import { AuthProvider } from "@/contexts/AuthContext";

// Create a QueryClient instance outside the component
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
