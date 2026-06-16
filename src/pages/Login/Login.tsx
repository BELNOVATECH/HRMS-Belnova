// import React, { useState } from "react";
// import { Input, Button, Form, message } from "antd";
// import "./Login.css";
// import { loginUser } from "../../services/CandidateService";
// import { useNavigate } from "react-router-dom";
// import { canAccessScreen } from "../../utils/permission";


// import { getModules, getScreens } from "../../services/accessService";
// import { mapBackendPermissions } from "../../utils/accessMapper";


// const Login: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

// const onFinish = async (values: any) => {
//   setLoading(true);

//   try {
//     const res = await loginUser({
//       email: values.email.trim(),
//       password: values.password,
//     });

//     const token =
//       res?.data?.token ||
//       res?.data?.access_token ||
//       res?.data?.data?.token ||
//       res?.data?.data?.access_token;

//     const employeeId =
//       res?.data?.emp_id || res?.data?.data?.emp_id;

//     const roleName =
//       res?.data?.role_name || res?.data?.data?.role_name;

//     const permissions =
//       res?.data?.permissions || res?.data?.data?.permissions || [];

//     if (!token) {
//       message.error("Token not received ❌");
//       return;
//     }

//     localStorage.setItem("hrms-token", token);

//     if (employeeId) {
//       localStorage.setItem("hrms-employee-id", String(employeeId));
//     }

//     if (roleName) {
//       localStorage.setItem("hrms-user-role", String(roleName));
//     }

//     // ✅ Store permissions
//     localStorage.setItem(
//       "hrms-permissions",
//       JSON.stringify(permissions)
//     );

//     window.dispatchEvent(new Event("permissions-updated"));

//     message.success("Login successful ✅");

//     // 🔥 CHECK IF USER HAS ANY VALID PERMISSION
//     const hasAny = permissions.some(
//       (p: any) =>
//         p.can_access ||
//         p.can_view ||
//         p.can_edit ||
//         p.can_update ||
//         p.can_delete
//     );

//     if (!hasAny) {
//       navigate("/unauthorized", { replace: true });
//       return;
//     }

//     // 🔥 AUTO REDIRECT TO FIRST AVAILABLE SCREEN
//     const routes = [
//       { name: "Dashboard", path: "/dashboard" },
//       { name: "Employees", path: "/employees" },
//       { name: "Attendance", path: "/attendance-management/attendance" },
//       { name: "Mark Attendance", path: "/attendance-management/mark" },
//       { name: "Create Task", path: "/task-management/create" },
//       { name: "Assign Task", path: "/task-management/assign" },
//       { name: "Task Board", path: "/task-management/board" },
//       { name: "Task History", path: "/task-management/history" },
//       { name: "Leave Apply", path: "/leave-management/apply" },
//       { name: "Leave Balance", path: "/leave-management/balance" },
//       { name: "Leave Calendar", path: "/leave-management/calendar" },
//       { name: "My Approvals", path: "/leave-management/approvals" },
//       { name: "Holiday Calendar", path: "/leave-management/holidays" },
//       { name: "Payroll Management", path: "/payroll" },
//       { name: "Payslips", path: "/salary?tab=1" },
//       { name: "Salary Revision", path: "/salary?tab=2" },
//       { name: "IT Declaration", path: "/salary/it-declaration" },
//       { name: "Performance", path: "/performance" },
//       { name: "Recruitment", path: "/recruitment" },
//       { name: "Config", path: "/config" },
//       { name: "Reports", path: "/reports" },
//       { name: "Analytics", path: "/analytics" },
//       { name: "Access Management", path: "/access" },
//       { name: "Settings", path: "/settings" },
//     ];

//     const firstAllowed = routes.find((r) =>
//       canAccessScreen(r.name)
//     );

//     if (firstAllowed) {
//       navigate(firstAllowed.path, { replace: true });
//     } else {
//       navigate("/unauthorized", { replace: true });
//     }

//   } catch (err: any) {
//     const apiMsg =
//       err?.response?.data?.detail ||
//       err?.response?.data?.message ||
//       err?.response?.data?.error;

//     message.error(apiMsg || "Invalid email or password ❌");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2>RM1 HRMS LOGIN</h2>

//         <Form
//           name="login-form"
//           layout="vertical"
//           onFinish={onFinish}
//           requiredMark={false}
//         >
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               { required: true, message: "Please enter your email" },
//               { type: "email", message: "Enter a valid email" },
//             ]}
//           >
//             <Input placeholder="Email" />
//           </Form.Item>

//           <Form.Item
//             label="Password"
//             name="password"
//             rules={[{ required: true, message: "Please enter your password" }]}
//           >
//             <Input.Password placeholder="Password" />
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="login-btn"
//               loading={loading}
//               block
//             >
//               Login
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Login;


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

      localStorage.setItem(
        "hrms-permissions",
        JSON.stringify(permissions)
      );

      window.dispatchEvent(new Event("permissions-updated"));

      message.success("Login successful ✅");

      // Redirect directly to dashboard
      navigate("/dashboard", { replace: true });

    } catch (error) {
      message.error("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h3>BELNOVA TECH HRMS LOGIN</h3>

        <Form
          name="login-form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
            ]}
          >
            <Input placeholder="Enter Any Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password placeholder="Enter Any Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-btn"
              loading={loading}
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            color: "#666",
            fontSize: "12px",
          }}
        >
          Development Mode (Any Email & Password Works)
        </div>
      </div>
    </div>
  );
};

export default Login;