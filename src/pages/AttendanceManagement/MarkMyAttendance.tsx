
import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  message,
  Typography,
} from "antd";
import dayjs from "dayjs";
import "./MarkMyAttendance.css";

const { Text } = Typography;

const MarkAttendance: React.FC = () => {
  const [date] = useState(dayjs().format("DD-MM-YYYY"));
  const [loginTime, setLoginTime] = useState<string | null>(null);
  const [logoutTime, setLogoutTime] = useState<string | null>(null);
const [loginLocation, setLoginLocation] = useState<string>("");
const [logoutLocation, setLogoutLocation] = useState<string>("");
const getLocation = (type: "login" | "logout") => {
  if (!navigator.geolocation) {
    message.error("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const accuracy = pos.coords.accuracy; // 🔥 meters

      console.log("Accuracy (meters):", accuracy);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();

        const city =
          data.address?.suburb ||
          data.address?.city ||
          data.address?.town ||
          data.address?.state ||
          "Unknown location";

type === "login"
  ? setLoginLocation(`${city}, ${data.address?.state || ""}`)
  : setLogoutLocation(`${city}, ${data.address?.state || ""}`);
      } catch {
type === "login"
  ? setLoginLocation(`${lat}, ${lon}`)
  : setLogoutLocation(`${lat}, ${lon}`);
      }
    },
    (err) => {
      message.error("Unable to fetch location");
      console.error(err);
    },
    {
      enableHighAccuracy: true, // ✅ IMPORTANT
      timeout: 10000,
      maximumAge: 0,
    }
  );
};



  const handleLogin = () => {
    setLoginTime(dayjs().format("HH:mm:ss"));
getLocation("login");
    message.success("Login marked successfully");
  };

  const handleLogout = () => {
    setLogoutTime(dayjs().format("HH:mm:ss"));
getLocation("logout");
    message.success("Logout marked successfully");
  };

return (
  <div className="mark-attendance-container">
    <Card
      title={<span className="mark-attendance-title">Mark My Attendance</span>}
      bordered={false}
      className="mark-attendance-card"
    >
  <Row gutter={[16, 16]}>

<Col span={24}>
  <Text className="mark-attendance-label">Date</Text>
  <Input
    className="mark-attendance-input"
    value={date}
    readOnly
    style={{ width: 220 }}
  />
</Col>


  {/* ROW 2 — LOGIN TIME + LOGIN LOCATION */}
  <Col span={12}>
    <Text className="mark-attendance-label">Login Time</Text>
    <Input
      className="mark-attendance-input"
      value={loginTime ?? "Not Marked"}
      readOnly
    />
  </Col>

  <Col span={12}>
    <Text className="mark-attendance-label">Login Location</Text>
    <Input
      className="mark-attendance-input"
      value={loginLocation || "Not Available"}
      readOnly
    />
  </Col>

  {/* ROW 3 — LOGOUT TIME + LOGOUT LOCATION */}
  <Col span={12}>
    <Text className="mark-attendance-label">Logout Time</Text>
    <Input
      className="mark-attendance-input"
      value={logoutTime ?? "Not Marked"}
      readOnly
    />
  </Col>

  <Col span={12}>
    <Text className="mark-attendance-label">Logout Location</Text>
    <Input
      className="mark-attendance-input"
      value={logoutLocation || "Not Available"}
      readOnly
    />
  </Col>

  {/* ACTION BUTTONS */}
  <Col span={24} className="mark-attendance-actions" style={{ textAlign: "center" }}>
    <Button
      type="primary"
      className="mark-login-btn"
      onClick={handleLogin}
      disabled={!!loginTime}
    >
      Mark Login
    </Button>

    <Button
      danger
      className="mark-logout-btn"
      onClick={handleLogout}
      disabled={!loginTime || !!logoutTime}
      style={{ marginLeft: 10 }}
    >
      Mark Logout
    </Button>
  </Col>

</Row>

    </Card>
  </div>
);

};

export default MarkAttendance;