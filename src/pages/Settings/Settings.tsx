import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import {
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Card,
  message,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import api from "../../services/api";
import "./Settings.css";

const { Option } = Select;

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  const [pageLoading, setPageLoading] = useState(true); // full page loader
  const [saving, setSaving] = useState(false); // button loader

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        profileForm.setFieldsValue({
          firstName: res.data.first_name,
          lastName: res.data.last_name,
          email: res.data.email,
          phone: res.data.mobile,
        });
      })
      .catch(() => {
        message.error("Failed to load profile");
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, []);

  /* ================= THEME ================= */
  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  };

  /* ================= UPDATE PROFILE ================= */
  const handleUpdateProfile = async (values: any) => {
    try {
      setSaving(true);

      await api.put("/auth/me", {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        mobile: values.phone,
      });

      message.success("Profile updated successfully");

      // reload profile
      const res = await api.get("/auth/me");
      profileForm.setFieldsValue({
        firstName: res.data.first_name,
        lastName: res.data.last_name,
        email: res.data.email,
        phone: res.data.mobile,
      });
    } catch (err: any) {
      message.error(err.response?.data?.detail || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UPDATE PASSWORD ================= */
  const handlePasswordUpdate = async (values: any) => {
    try {
      setSaving(true);

      await api.put("/auth/change-password", {
        current_password: values.currentPassword,
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      });

      message.success("Password updated successfully");
      passwordForm.resetFields();
    } catch (err: any) {
      message.error(err.response?.data?.detail || "Password update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-layout">
      <Sidebar />

      <div className="settings-center-container">
        {pageLoading ? (
          <div style={{ textAlign: "center", marginTop: 120 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Card className="settings-card">
            <h2>Settings</h2>

            <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
              {/* ================= PROFILE ================= */}
              <Tabs.TabPane key="1" tab="Profile">
                <Form
                  layout="vertical"
                  form={profileForm}
                  onFinish={handleUpdateProfile}
                >
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email" }]}
                  >
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                      { required: true },
                      {
                        pattern: /^[6-9]\d{9}$/,
                        message: "Enter valid 10-digit mobile number",
                      },
                    ]}
                    getValueFromEvent={(e) =>
                      e.target.value.replace(/\D/g, "").replace(/^0+/, "")
                    }
                  >
                    <Input maxLength={10} inputMode="numeric" />
                  </Form.Item>

                  <Button
                    type="primary"
                    block
                    htmlType="submit"
                    loading={saving}
                    disabled={saving}
                  >
                    Update Profile
                  </Button>
                </Form>
              </Tabs.TabPane>

              {/* ================= PASSWORD ================= */}
              <Tabs.TabPane key="2" tab="Password">
                <Form
                  layout="vertical"
                  form={passwordForm}
                  onFinish={handlePasswordUpdate}
                >
                  <Form.Item
                    label="Current Password"
                    name="currentPassword"
                    rules={[{ required: true }]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true, min: 6 }]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    rules={[{ required: true }]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Form.Item>

                  <Button
                    type="primary"
                    block
                    htmlType="submit"
                    loading={saving}
                    disabled={saving}
                  >
                    Update Password
                  </Button>
                </Form>
              </Tabs.TabPane>

              {/* ================= THEME ================= */}
              <Tabs.TabPane key="3" tab="Theme">
                <Switch checked={darkMode} onChange={toggleDarkMode} /> Dark Mode
                <br />
                <br />
                <Select
                  value={language}
                  onChange={setLanguage}
                  style={{ width: 200 }}
                >
                  <Option value="English">English</Option>
                  <Option value="Telugu">Telugu</Option>
                  <Option value="Hindi">Hindi</Option>
                </Select>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Settings;

