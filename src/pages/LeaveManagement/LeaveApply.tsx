import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
  Space,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./LeaveApply.css";

import {
  applyLeaveApi,
  fetchEmployeesApi,
  // LeavePayload,
} from "../../services/leaveApplyService";

import { getLeaveBalanceApi } from "../../services/leaveBalanceService";

const { Option } = Select;

const defaultLeaveTypes = [
  { id: 1, leave_type: "Sick Leave" },
  { id: 2, leave_type: "Casual Leave" },
  { id: 3, leave_type: "Earned Leave" },
  { id: 4, leave_type: "Optional Holiday" },
  { id: 5, leave_type: "Loss of Pay" },
  { id: 6, leave_type: "Compensatory Off" },
  { id: 7, leave_type: "Paternity Leave" },
  { id: 8, leave_type: "Maternity Leave" },
  { id: 9, leave_type: "Miscarriage Leave" },
  { id: 10, leave_type: "Adoption Leave" },
];

interface Employee {
  id: number;
  first_name?: string;
  last_name?: string;
  name?: string;
}

const LeaveApply: React.FC = () => {
  const [form] = Form.useForm();
  const fromDate = Form.useWatch("fromDate", form);
  const toDate = Form.useWatch("toDate", form);
  const fromSession = Form.useWatch("fromSession", form);

  const navigate = useNavigate();
const empId = Number(localStorage.getItem("hrms-employee-id"));



  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [calculatedDays, setCalculatedDays] = useState<number | null>(null);
  const [dateErrorShown, setDateErrorShown] = useState(false);


  /* ================= FETCH EMPLOYEES ================= */
 useEffect(() => {
  fetchEmployeesApi()
    .then((res) => {
      const list = Array.isArray(res.data) ? res.data : [];

      // ✅ REMOVE SELF FROM MANAGER LIST
      const filtered = list.filter((e: any) => e.id !== empId);

      setEmployees(filtered);
    })
    .catch(() => message.error("Failed to load employees"));
}, [empId]);


useEffect(() => {
  if (!empId) return;

  getLeaveBalanceApi(empId, dayjs().year())
    .then((res) => setLeaveBalance(res.data?.leaves || []))
    .catch(() => message.error("Failed to load leave balance"));
}, [empId]);
useEffect(() => {
  if (!empId) {
    message.error("Employee not found. Please login again.");
    navigate("/login");
  }
}, [empId]);


 const disableToDates = (current: dayjs.Dayjs) => {
  const from = form.getFieldValue("fromDate"); // ✅ FIXED
  return from ? current.isBefore(from, "day") : false;
};


  const shouldHideToSession1 = () => {
    return (
      fromDate &&
      toDate &&
      dayjs(fromDate).isSame(dayjs(toDate), "day") &&
      fromSession === "2"
    );
  };

  useEffect(() => {
    if (shouldHideToSession1()) {
      form.setFieldsValue({ toSession: "2" });
    }
  }, [fromDate, toDate, fromSession, form]);
useEffect(() => {
  if (!fromDate || !toDate) return;

  const isSameDay = dayjs(fromDate).isSame(dayjs(toDate), "day");
  const fs = form.getFieldValue("fromSession");

  // ✅ ONLY same-day + From Session = 2 → auto To Session = 2
  if (isSameDay && fs === "2") {
    form.setFieldsValue({ toSession: "2" });
  }

  // ✅ Different days OR From Session = 1 → don't autofill
  calculateLeaveDays();
}, [fromDate, toDate, fromSession]);





  /* ================= CALCULATE DAYS ================= */
  const calculateLeaveDays = () => {
    const from = form.getFieldValue("fromDate");
    const to = form.getFieldValue("toDate");
    const fromSession = form.getFieldValue("fromSession");
    const toSession = form.getFieldValue("toSession");

    if (!from || !to || !fromSession || !toSession) {
      setCalculatedDays(null);
      return;
    }

if (to.isBefore(from, "day")) {
  if (!dateErrorShown) {
    message.error("To Date cannot be earlier than From Date");
    setDateErrorShown(true);
  }
  setCalculatedDays(null);
  return;
}

setDateErrorShown(false);



    let days = to.diff(from, "day") + 1;

  if (from.isSame(to, "day")) {
  // ✅ Full day
  if (fromSession === "1" && toSession === "2") {
    setCalculatedDays(1);
    return;
  }

  // ✅ Half day (First half)
  if (fromSession === "1" && toSession === "1") {
    setCalculatedDays(0.5);
    return;
  }

  // ✅ Half day (Second half)
  if (fromSession === "2" && toSession === "2") {
    setCalculatedDays(0.5);
    return;
  }

  // ❌ Invalid selection (Session2 → Session1)
  message.error("Invalid date/session selection");
  setCalculatedDays(null);
  return;
}


    if (fromSession === "2") days -= 0.5;
    if (toSession === "1") days -= 0.5;

    if (days <= 0) {
      message.error("Invalid date/session selection");
      setCalculatedDays(null);
      return;
    }

    setCalculatedDays(days);
  };

  /* ================= SUBMIT ================= */
 const handleSubmit = async (values: any) => {
  try {
    // ✅ ADD THIS FIRST
    if (!values.reporting_manager_id) {
      message.error("Please select a Reporting Manager");
      return;
    }

    // ✅ KEEP THIS AS-ISnpm run dev
    
    if (calculatedDays === null) {
      message.error("Invalid date/session selection");
      return;
    }
      // 🔒 BALANCE CHECK
     const selectedLeave = leaveBalance.find(
  (l) => Number(l.leave_type_id) === Number(values.leavetype_id)
);

if (!selectedLeave) {
  message.error("Leave balance not available for selected leave type");
  return;
}

const available = Number(selectedLeave.balance || 0);

if (calculatedDays > available) {
  message.error(
    `You are applying for ${calculatedDays} days but only ${available} days are available`
  );
  return;
}

const file = values.upload_file?.fileList?.[0]?.originFileObj;

const formData = new FormData();

formData.append("emp_id", String(empId));
formData.append("leavetype_id", String(values.leavetype_id));
formData.append("start_date", values.fromDate.format("YYYY-MM-DD"));
formData.append("end_date", values.toDate.format("YYYY-MM-DD"));
formData.append("from_date_session_id", String(values.fromSession));
formData.append("to_date_session_id", String(values.toSession));
formData.append("reason", values.reason);
formData.append("mobile", values.mobile);
formData.append(
  "reporting_manager_id",
  String(values.reporting_manager_id)
);

if (values.cc?.length) {
  formData.append("cc", values.cc.join(","));
}

if (file) {
formData.append("upload_file", file);
}


      setSubmitting(true);
await applyLeaveApi(formData);

      message.success("Leave applied successfully");
      form.resetFields();
      setCalculatedDays(null);
      navigate("/leave-management/apply?tab=2");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Already applied on that date");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="leave-main-container">
      <h3 className="form-title">Apply Leave</h3>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* Leave type + Manager */}
        <div className="two-col">
          <Form.Item
            name="leavetype_id"
            label="Leave Type"
            rules={[{ required: true, message: "Leave type is required" }]}
          >
<Select
  placeholder="Select leave type"
  showSearch
  optionFilterProp="children"
  filterOption={(input, option) =>
    (option?.children as unknown as string)
      .toLowerCase()
      .includes(input.toLowerCase())
  }
>
              {defaultLeaveTypes.map((l) => (
                <Option key={l.id} value={l.id}>
                  {l.leave_type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="reporting_manager_id"
            label="Reporting Manager"
            rules={[
              { required: true, message: "Reporting manager is required" },
            ]}
          >
<Select
  placeholder="Select manager"
  showSearch
  optionFilterProp="children"
  onChange={(val) =>
    form.setFieldValue("reporting_manager_id", Number(val))
  }
  filterOption={(input, option) =>
    (option?.children as unknown as string)
      .toLowerCase()
      .includes(input.toLowerCase())
  }
>

              {employees.map((e) => (
                <Option key={e.id} value={e.id}>
                  {e.first_name ? `${e.first_name} ${e.last_name ?? ""}` : e.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* From */}
        <div className="two-col">
          <Form.Item
            name="fromDate"
            label="From Date"
            rules={[{ required: true, message: "From date is required" }]}
          >
            <DatePicker onChange={calculateLeaveDays} />
          </Form.Item>

          <Form.Item
            label="From Session"
            name="fromSession"
            rules={[{ required: true, message: "From session is required" }]}
          >
            <Select placeholder="Select from session" onChange={calculateLeaveDays}>
              <Option value="1">Session 1</Option>
              <Option value="2">Session 2</Option>
            </Select>
          </Form.Item>
        </div>

        {/* To */}
        <div className="two-col">
          <Form.Item
            name="toDate"
            label="To Date"
            rules={[{ required: true, message: "To date is required" }]}
          >
<DatePicker
  disabledDate={disableToDates}
  onChange={() => {
    calculateLeaveDays();
  }}
/>
          </Form.Item>

          <Form.Item
            label="To Session"
            name="toSession"
            rules={[{ required: true, message: "To session is required" }]}
          >
<Select
  placeholder="Select to session"
  onChange={() => {
    calculateLeaveDays();
  }}
>
              {!shouldHideToSession1() && <Option value="1">Session 1</Option>}
              <Option value="2">Session 2</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Days */}
        {calculatedDays !== null && (
          <div className="leave-days-info">
            You are applying for <strong>{calculatedDays}</strong> days leave
          </div>
        )}

        {/* CC + Mobile */}
        <div className="two-col">
          <Form.Item name="cc" label="CC">
<Select
  mode="multiple"
  placeholder="Select employees"
  showSearch
  optionFilterProp="children"
  filterOption={(input, option) =>
    (option?.children as unknown as string)
      .toLowerCase()
      .includes(input.toLowerCase())
  }
>
              {employees.map((emp) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.first_name
                    ? `${emp.first_name} ${emp.last_name ?? ""}`
                    : emp.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Mobile Number */}
          <Form.Item label="Mobile Number" required>
            <Space.Compact style={{ width: "100%" }}>
              <Input value="+91" disabled style={{ width: "70px" }} />

              <Form.Item
                name="mobile"
                noStyle
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject("Mobile number is required");
                      }

                      if (!/^[6-9]/.test(value)) {
                        return Promise.reject("Must start with 6–9");
                      }

                      if (value.length !== 10) {
                        return Promise.reject("Must be 10 digits");
                      }

                      if (!/^[6-9][0-9]{9}$/.test(value)) {
                        return Promise.reject("Invalid mobile number");
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input maxLength={10} placeholder="Enter mobile number" />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        </div>


<Form.Item name="upload_file" label="Upload File">
  <Upload
    name="file"
    maxCount={1}
    beforeUpload={(file) => {
      const isJpgOrJpeg =
        file.type === "image/jpeg" || file.type === "image/jpg";
      const isPdf = file.type === "application/pdf";

      if (!isJpgOrJpeg && !isPdf) {
        message.error("Only PDF and JPG images are allowed");
        return Upload.LIST_IGNORE; // ❌ block invalid file
      }

      return false; // ✅ allow valid file (manual upload)
    }}
  >
    <Button icon={<UploadOutlined />}>Upload File</Button>
  </Upload>
</Form.Item>


        {/* Reason */}
        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: "Reason is required" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        {/* Actions */}
        <div className="action-btns">
          <Button type="primary" htmlType="submit" loading={submitting}>
            Apply
          </Button>
          <Button onClick={() => form.resetFields()}>Cancel</Button>
        </div>
      </Form>
    </div>
  );
};

export default LeaveApply;