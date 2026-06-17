import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  message,
  Button,
  Popconfirm,
  Tooltip,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { getLeavesApi } from "../../services/leaveListService";
import {cancelLeaveApi} from "../../services/CancelLeaveService";
const FILE_BASE_URL = "https://hrms-be-ppze.onrender.com/";

const LeavePending: React.FC = () => {
  // const empId = Number(localStorage.getItem("hrms-employee-id"));
  const empId=203;

  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ View modal states
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any | null>(null);

  const loadPending = async () => {
    try {
      setLoading(true);
      const res = await getLeavesApi({ emp_id: empId });

      let rows = Array.isArray(res.data) ? res.data : [];

      // ✅ Only Pending Leaves
      rows = rows.filter((r) => r.status_name === "Pending");

      setLeaves(rows);
    } catch (err) {
      message.error("Failed to load pending leaves");
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!empId) {
      message.error("Employee not found. Please login again.");
      return;
    }
    loadPending();
  }, [empId]);

const handleCancel = async (leaveRequestId: number) => {
  try {
    setLoading(true);

    const res = await cancelLeaveApi(leaveRequestId, empId);

    console.log("Cancel response:", res.status, res.data);

    if (res.status === 200) {
      setLeaves((prev) =>
        prev.filter((l) => l.leave_request_id !== leaveRequestId)
      );
      message.success("Leave cancelled successfully");
    } else {
      message.error(res.data?.message || "Unable to cancel leave");
    }
  } catch (err) {
    message.error("Server error while cancelling leave");
  } finally {
    setLoading(false);
  }
};



  /* ✅ FILE PREVIEW (same as MyApprovals) */
const renderFile = () => {
  if (!selectedLeave) return <p>No file uploaded</p>;

  // 🔥 READ ALL POSSIBLE BACKEND KEYS
  const rawFile =
    selectedLeave.file ||
    selectedLeave.attachment ||
    selectedLeave.document ||
    selectedLeave.upload ||
    selectedLeave.upload_file;

  // 🔒 BACKEND SOMETIMES SENDS "No upload" OR ""
  if (!rawFile || rawFile === "No upload") {
    return <p>No file uploaded</p>;
  }

  const filePath = String(rawFile).replace(/\\/g, "/");
  const fileUrl = FILE_BASE_URL + filePath;

  console.log("FILE URL 👉", fileUrl);

  // ✅ PDF preview
  if (fileUrl.toLowerCase().endsWith(".pdf")) {
    return (
      <iframe
        src={fileUrl}
        title="Leave Attachment"
        style={{ width: "100%", height: "500px", border: "none" }}
      />
    );
  }

  // ✅ Image preview
  if (fileUrl.match(/\.(jpg|jpeg|png)$/i)) {
    return (
      <img
        src={fileUrl}
        alt="Leave Attachment"
        style={{ maxWidth: "100%" }}
      />
    );
  }

  // ✅ Other files
  return (
    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
      Download File
    </a>
  );
};



  const columns: ColumnsType<any> = [
    {
      title: "Leave Type",
      dataIndex: "leave_type",
        align: "center",

    },
    {
      title: "From Date",
      dataIndex: "start_date",
        align: "center",

    },
    {
      title: "To Date",
      dataIndex: "end_date",
        align: "center",

    },
    {
      title: "Total Days",
      dataIndex: "total_days",
        align: "center",

    },
    {
      title: "Reason",
      dataIndex: "reason",
        align: "center",

      render: (text: string) =>
        text ? (
          <Tooltip title={text}>
            <span
              style={{
                maxWidth: 120,
                display: "inline-block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {text}
            </span>
          </Tooltip>
        ) : (
          "-"
        ),
    },
  {
  title: "View",
  align: "center",
  render: (_, record) => (
    <Button
      type="link"
      onClick={() => {
        console.log("VIEW RECORD 👉", record); // ✅ ADD THIS LINE
        setSelectedLeave(record);
        setViewOpen(true);
      }}
    >
      View
    </Button>
  ),
},

    {
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Cancel this leave request?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleCancel(record.leave_request_id)}
        >
          <Button danger size="small">
            Cancel
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Spin spinning={loading}>
        <Table
          rowKey="leave_request_id"
          columns={columns}
          dataSource={leaves}
          pagination={false}
        />
      </Spin>

      {/* ✅ View Modal */}
      <Modal
        open={viewOpen}
        title="Applied Leave – Uploaded File"
        footer={null}
        width={800}
        onCancel={() => setViewOpen(false)}
      >
        {renderFile()}
      </Modal>
    </>
  );
};

export default LeavePending;
