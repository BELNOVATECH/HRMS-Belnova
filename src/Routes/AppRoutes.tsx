import { Routes, Route } from "react-router-dom";
import { NonSecureRoutes } from "./nonsecureroutes/NonSecueRoutes";
import ProtectedRoute from "./ProtectedRoute";
import { SecureRoutes } from "./secureroutes/SecureRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Login / Forgot Password routes */}
      <Route path="/*" element={<NonSecureRoutes />} />

      {/* Secure / Authenticated Dashboard routes */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <SecureRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
