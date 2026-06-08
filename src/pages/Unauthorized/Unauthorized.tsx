import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h2>No Access</h2>
      <p>You don’t have permission to access any module. Please contact Admin.</p>

      <Button
        type="primary"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Unauthorized;
