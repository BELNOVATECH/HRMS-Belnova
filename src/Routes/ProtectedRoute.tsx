// import React from "react";
// import { Navigate } from "react-router-dom";
// import { canAccessScreen } from "../utils/permission";

// type Props = {
//   children: React.ReactNode;
//   screen: string;
// };

// const ProtectedRoute: React.FC<Props> = ({ children, screen }) => {
//   const token = localStorage.getItem("hrms-token");

//   // ✅ Not logged in → login
//   if (!token) return <Navigate to="/login" replace />;

//   // ✅ No permission → dashboard
//   if (!canAccessScreen(screen)) return <Navigate to="/dashboard" replace />;

//   return <>{children}</>;
// };

// export default ProtectedRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import { canAccessScreen } from "../utils/permission";

type ProtectedRouteProps = {
  children: React.ReactNode;
  screen?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  screen,
}) => {
  const token = localStorage.getItem("hrms-token");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Permission check ONLY if screen is provided
  if (screen && !canAccessScreen(screen)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


