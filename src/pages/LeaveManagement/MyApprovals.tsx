import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Spin,
  Modal,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import "./LeavePending.css";
import { Tabs } from "antd";
import MyApprovalHistory from "./MyApprovalHistory";


import {
  // getPendingLeavesApi,
  approveRejectLeaveApi,
  PendingLeaveItem,
  ApproveRejectPayload,
} from "../../services/leavePendingService";

import { getLeavesApi } from "../../services/leaveListService";
import { getLeaveBalanceApi } from "../../services/leaveBalanceService";


const FILE_BASE_URL = "https://hrms-be-ppze.onrender.com/";

const MyApprovals: React.FC = () => {
const managerId = Number(localStorage.getItem("hrms-employee-id"));
console.log("🔥 Manager ID from localStorage:", managerId);



const [leaves, setLeaves] = useState<PendingLeaveItem[]>([]);
  const [loading, setLoading] = useState(false);
const [approveLoadingId, setApproveLoadingId] = useState<number | null>(null);
const [rejectLoadingId, setRejectLoadingId] = useState<number | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<PendingLeaveItem | null>(
    null
  );

  /* ✅ LOAD PENDING LEAVES */

const loadPending = async () => {
    console.log("🔥 loadPending() called");
  try {
    setLoading(true);

  const res = await getLeavesApi({
  manager_id: managerId,
});


    let rows = Array.isArray(res.data) ? res.data : [];

    // only pending
    rows = rows.filter((r: any) => r.status_name === "Pending");

    // map → PendingLeaveItem
    const mapped: PendingLeaveItem[] = rows.map((r: any) => ({
      leave_request_id: r.leave_request_id,
      emp_id: r.emp_id,
  employee_name: r.emp_name, // ✅ FIXED
      leave_type: r.leave_type,
      leavetype_id: r.leavetype_id ?? 0,
      start_date: r.start_date,
      end_date: r.end_date,
      total_days: r.total_days,
      status_id: r.status_id ?? 0,
      status_name: r.status_name,
      reason: r.reason,
      upload_file: r.upload_file,
    }));

    setLeaves(mapped);
  } catch (err) {
    console.error(err);
    message.error("Failed to load pending leaves");
    setLeaves([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!managerId) {
    message.error("Manager ID not found. Please login again.");
    return;
  }
  loadPending();
}, [managerId]);



  /* ✅ APPROVE / REJECT with Leave Balance Validation */
const handleAction = async (
  leaveId: number,
  action: "approve" | "reject",
  record?: PendingLeaveItem
) => {
  try {
    if (action === "approve") setApproveLoadingId(leaveId);
    if (action === "reject") setRejectLoadingId(leaveId);

      

      // ✅ REJECT (no balance check)
      if (action === "reject") {
        const payload: ApproveRejectPayload = {
          leave_id: leaveId,
          action: "reject",
          approver_id: managerId,
          remarks: "Rejected by manager",
        };

        const res = await approveRejectLeaveApi(payload);

        if ([200, 201, 204].includes(res.status)) {
          message.success("Leave rejected successfully ❌");
          setLeaves((prev) => prev.filter((l) => l.leave_request_id !== leaveId));
          loadPending();
          window.dispatchEvent(new Event("leave-updated"));
          return;
        }

        message.error(res.data?.message || "Reject failed ❌");
        return;
      }

      // ✅ APPROVE (balance validation)
      if (!record) {
        message.error("Leave record missing ❌");
        return;
      }

      const leaveYear = dayjs(record.start_date).year();
      const leaveMonth = dayjs(record.start_date).month() + 1;

      const balRes = await getLeaveBalanceApi(record.emp_id, leaveYear, leaveMonth);

      const leaveRow = balRes.data?.leaves?.find(
        (l) =>
          l.leave_type_id === record.leavetype_id ||
          l.leave_type?.toLowerCase() === record.leave_type?.toLowerCase()
      );

      if (!leaveRow) {
        message.error("Leave balance not found for this leave type ❌");
        return;
      }

      const available = Number(leaveRow.balance || 0);
      const requested = Number(record.total_days || 0);

      if (requested > available) {
        message.error(
          `Insufficient leave balance ❌ Requested: ${requested}, Available: ${available}`
        );
        return;
      }

      const afterApprove = available - requested;
      if (afterApprove < 0) {
        message.error("Approval will make leave balance negative ❌");
        return;
      }

      const payload: ApproveRejectPayload = {
        leave_id: leaveId,
        action: "approve",
        approver_id: managerId,
        remarks: "Approved by manager",
      };

      const res = await approveRejectLeaveApi(payload);

      if ([200, 201, 204].includes(res.status)) {
        message.success("Leave approved successfully ✅");
        setLeaves((prev) => prev.filter((l) => l.leave_request_id !== leaveId));
        loadPending();
        window.dispatchEvent(new Event("leave-updated"));
        return;
      }

      message.error(res.data?.message || "Approval failed ❌");
    } catch (err: any) {
      console.log("❌ Error =>", err?.response?.data || err);
      message.error("Something went wrong ❌");
    } finally {
  setApproveLoadingId(null);
  setRejectLoadingId(null);
}

  };

  /* ✅ TABLE COLUMNS */
  const columns: ColumnsType<PendingLeaveItem> = [
      {
    title: "Employee Name",
    dataIndex: "employee_name",
    align: "center",
    render: (text) => text || "-",
  },
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      align: "center",
    },
    {
      title: "From",
      dataIndex: "start_date",
      align: "center",
    },
    {
      title: "To",
      dataIndex: "end_date",
      align: "center",
    },
    {
      title: "Days",
      dataIndex: "total_days",
      align: "center",
    },
  
    {
      title: "Reason",
      dataIndex: "reason",
      align: "center",
      render: (text: string) => {
        if (!text) return "-";

        return (
          <Tooltip title={text}>
            <span
              style={{
                maxWidth: 100,
                display: "inline-block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                verticalAlign: "middle",
              }}
            >
              {text}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "View",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
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
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
         <Button
  type="primary"
  loading={approveLoadingId === record.leave_request_id}
  onClick={() =>
    handleAction(record.leave_request_id, "approve", record)
  }
>
  Approve
</Button>


        <Popconfirm
  title="Reject this leave?"
  onConfirm={() =>
    handleAction(record.leave_request_id, "reject")
  }
>
  <Button
    danger
    loading={rejectLoadingId === record.leave_request_id}
  >
    Reject
  </Button>
</Popconfirm>

        </div>
      ),
    },
  ];

  /* ✅ FILE PREVIEW */
  const renderFile = () => {
    if (!selectedLeave?.upload_file) return <p>No file uploaded</p>;

    const filePath = selectedLeave.upload_file.replace(/\\/g, "/");
    const fileUrl = FILE_BASE_URL + filePath;

    if (fileUrl.endsWith(".pdf")) {
      return (
        <iframe
          src={fileUrl}
          title="Leave Attachment"
          style={{ width: "100%", height: "500px" }}
        />
      );
    }

    if (fileUrl.match(/\.(jpg|jpeg|png)$/i)) {
      return <img src={fileUrl} alt="Leave Attachment" style={{ maxWidth: "100%" }} />;
    }

    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        Download File
      </a>
    );
  };
return (
  <div className="leave-page-container">
    <div className="leave-page-card">
      <h2 className="my-approvals-title">My Approvals</h2>

      <Tabs
        defaultActiveKey="1"
        centered
        items={[
          {
            key: "1",
            label: "Pending",
            children: (
              <>
                <Spin spinning={loading}>
                  <Table
                    rowKey="leave_request_id"
                    columns={columns}
                    dataSource={leaves}
                    pagination={false}
                    scroll={{ x: 900 }}
                  />
                </Spin>

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
            ),
          },
        {
  key: "2",
  label: "History",
  children: <MyApprovalHistory />,
}

        ]}
      />
    </div>
  </div>
);



  
};

export default MyApprovals;
