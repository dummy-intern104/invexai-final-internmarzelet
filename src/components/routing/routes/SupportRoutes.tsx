
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import ComplaintRaise from "@/pages/support/ComplaintRaise";
import ComplaintStatus from "@/pages/support/ComplaintStatus";
import Feedback from "@/pages/support/Feedback";
import CustomerCare from "@/pages/support/CustomerCare";

export const SupportRoutes = () => {
  return (
    <>
      <Route path="/support/complaint-raise" element={
        <ProtectedRoute>
          <ComplaintRaise />
        </ProtectedRoute>
      } />
      <Route path="/support/complaint-status" element={
        <ProtectedRoute>
          <ComplaintStatus />
        </ProtectedRoute>
      } />
      <Route path="/support/feedback" element={
        <ProtectedRoute>
          <Feedback />
        </ProtectedRoute>
      } />
      <Route path="/support/customer-care" element={
        <ProtectedRoute>
          <CustomerCare />
        </ProtectedRoute>
      } />
    </>
  );
};
