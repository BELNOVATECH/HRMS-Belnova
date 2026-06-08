import React, { useEffect, useState } from "react";
import { Modal, Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getTopPerformers, getEmployees } from "../../services/CandidateService";

const TopPerformersOverlay = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [data, setData] = useState<any[]>([]);

  // ✅ declare here (not inside load)
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (open) load();
  }, [open]);

  const load = async () => {
    const ratingRes = await getTopPerformers();
    const empRes = await getEmployees();

    const employees = empRes.data;

    const mapped = ratingRes.data.map((r: any) => {
      const emp = employees.find((e: any) => e.id === r.emp_id);
      return {
        emp_id: r.emp_id,
        name: emp ? `${emp.first_name} ${emp.last_name}` : "Unknown",
        rating: r.rating,
      };
    });

    setData(mapped);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={isMobile ? "100%" : "60%"}
      style={isMobile ? { top: 0 } : { top: 20 }}
      bodyStyle={{ padding: 16 }}
      closable={false}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600 }}>Top Performers</span>
          <Button type="text" onClick={onClose}>✕</Button>
        </div>
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {data.map((emp) => (
          <div key={emp.emp_id} className="top-performer-card">
            <Avatar size={64} icon={<UserOutlined />} />
            <p><b>{emp.name}</b></p>
            <p>EMP ID: {emp.emp_id}</p>
            <p> {emp.rating} ⭐ </p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default TopPerformersOverlay;
