import React, { useEffect, useState } from "react";
import { Modal, Table, Button, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getPendingReviews } from "../../services/CandidateService";
import AddReviewModal from "./AddReviewModal";

const PendingReviewsOverlay = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (open) load();
  }, [open]);

  const load = async () => {
    const res = await getPendingReviews();
    setData(res.data.employees);
  };

  const columns = [
    { title: "EMP ID", dataIndex: "employee_id", width: 40 },
    { title: "Employee Name", dataIndex: "employee_name", width:100 },
    {
      title: "",
      key: "action",
      width: 40,
      render: (_: any, record: any) => (
        <Button type="primary" size="small" onClick={() => setSelectedEmployee(record)}>
          + Add Review
        </Button>
      ),
    },
  ];

  return (
<Modal
  open={open}
  onCancel={onClose}
  footer={null}
  width={isMobile ? "100%" : "900px"}
  style={isMobile ? { top: 0 } : { top: 20 }}
  closable={false}
  destroyOnClose
  bodyStyle={{
    padding: 0,
    overflow: "auto",
    maxHeight: isMobile ? "100vh" : "70vh",
  }}
>

      {
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "bottom", gap: 0}}>
            {selectedEmployee && (
              <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setSelectedEmployee(null)} />
            )}
            <span style={{ fontSize: 16, fontWeight: 600 }}>
              {selectedEmployee ? "Add Performance Review" : "Pending Reviews"}
            </span>
          </div>
          <Button type="text" onClick={onClose}>✕</Button>
        </div>
      }

      {!selectedEmployee && (
        <div>
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {data.map(emp => (
                <Card key={emp.employee_id}>
                  <div><b>EMP ID:</b> {emp.employee_id}</div>
                  <div><b>Name:</b> {emp.employee_name}</div>
                  <Button block type="primary" style={{ marginTop: 10 }} onClick={() => setSelectedEmployee(emp)}>
                    + Add Review
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Table
      dataSource={data}
      rowKey="employee_id"
      columns={columns}
     pagination={{ pageSize: 7 }}
     scroll={{ y: isMobile ? "calc(100vh - 220px)" : 420 }}
    style={{ width: "100%" }}
/>

          )}
        </div>
      )}

      {selectedEmployee && (
        <AddReviewModal
          employee={selectedEmployee}
          onClose={() => {
            setSelectedEmployee(null);
            load();
          }}
        />
      )}
    </Modal>
  );
};

export default PendingReviewsOverlay;
