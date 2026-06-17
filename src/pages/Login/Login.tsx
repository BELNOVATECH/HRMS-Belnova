import React, { useState } from "react";
import { Input, Button, Form, message } from "antd";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store dummy data in localStorage
      localStorage.setItem("hrms-token", "dummy-token");
      localStorage.setItem("hrms-employee-id", "1");
      localStorage.setItem("hrms-user-role", "Admin");

      // Dummy permissions (full access)
      const permissions = [
        {
          module_name: "All",
          screen_name: "All",
          can_access: true,
          can_view: true,
          can_add: true,
          can_edit: true,
          can_delete: true,
        },
      ];

      localStorage.setItem("hrms-permissions", JSON.stringify(permissions));
      window.dispatchEvent(new Event("permissions-updated"));

      message.success("Login successful ✅");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      message.error("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* ── Left Brand Panel ── */}
      <div className="login-brand-panel">
        <div className="brand-bg-logo" aria-hidden="true">
          <span className="brand-bg-letter">B</span>
        </div>
        <div className="brand-glow-1" aria-hidden="true" />
        <div className="brand-glow-2" aria-hidden="true" />

        <div className="brand-content">
          <div className="brand-icon">B</div>
          <h1 className="brand-name">BELNOVA TECH</h1>
          <p className="brand-tagline">INNOVATING THE FUTURE</p>
          <div className="brand-divider" />
          <p className="brand-description">
            Your all-in-one Human Resource Management System. Manage people,
            payroll, attendance, and performance — all in one place.
          </p>
          <div className="brand-dots">
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="login-form-panel">
        <div className="form-bg-logo" aria-hidden="true">
          <span className="form-bg-letter">B</span>
        </div>

        <div className="login-box">
          <div className="login-box-header">
            <h2 className="login-title">Welcome back</h2>
            <p className="login-subtitle"> login to your HRMS portal</p>
          </div>

          <Form
            name="login-form"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label="Email address"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="Enter your email" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password placeholder="Enter your password" size="large" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-btn"
                loading={loading}
                block
                size="large"
              >
                {loading ? "Signing in..." : " login"}
              </Button>
            </Form.Item>
          </Form>

          <div className="dev-mode-badge">
            <span className="dev-dot" />
            Development mode — any credentials work
          </div>
        </div>

        <p className="login-footer">
          © {new Date().getFullYear()} Belnova Tech Private Limited
        </p>
      </div>
    </div>
  );
};

export default Login;