import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import "antd/dist/reset.css";
import "./styles/hrms-dashboard.css";

// ⭐ Import the provider
// import { useLeaveStore } from "./stores/leaveStore";

const App: React.FC = () => {
  return (
    <Router>
      {/* ⭐ Wrap entire app so all pages share the store */}
      {/* <useLeaveStore> */}
        <AppRoutes />
      {/* </useLeaveStore> */}
    </Router>
  );
};

export default App;
