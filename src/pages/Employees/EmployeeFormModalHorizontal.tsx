import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Button,
  Upload,
  Avatar,
  message,
  Card,
  Divider,
    Spin,

} from "antd";
import { PlusOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./EmployeeFormModalHorizontal.css";
import { getDepartments, getDesignations } from "../../services/CandidateService";
import { getEmployeeStatuses } from "../../services/StatusService";


const { Option } = Select;
const { TextArea } = Input;
// 🔥 ADD THIS EXACTLY HERE
const OCCUPATION_MAP: Record<string, number> = {
  GovernmentEmployee: 1,
  PrivateEmployee: 2,
  Business: 3,
  Farmer: 4,
  SelfEmployed: 5,
  Labourer: 6,
  Teacher: 7,
  Driver: 8,
  HomeMaker: 9,
  Retired: 10,
  NA: 11,
};

interface Employee {
  id?: number;

  emp_code?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;

  father_name?: string;
  present_address?: string;
  permanent_address?: string;

  blood_group_id?: number;
  gender_id?: number;
  marital_status_id?: number;

  department_id?: number;
  designation_id?: number;
  employee_type_id?: number;
  manager_id?: number;
  role_id?: number;

  work_location_id?: number;
  shift_id?: number;

  salary?: number;
  ctc?: number;

  aadhaar?: string;
  pan?: string;
  uan?: string;

  bank_ac_no?: string;
  ifsc_code?: string;

  date_of_birth?: string;
  join_date?: string;
  hired_date?: string;
  probation_end_date?: string;

  emergency_mobile?: string;
  reference_mobile?: string;

  family_members?: any[];
  photo?: string | null;
  status?: string;
}


/* ================= VALIDATIONS ================= */
const validateEmail = (_: any, value: string) => {
  if (!value) {
    return Promise.reject(new Error("Email is required"));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return Promise.reject(new Error("Enter a valid email address"));
  }

  return Promise.resolve();
};


/* ================= BASE64 ================= */
const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employee?: any;

  onSave: (payload: any) => void;
}

const EmployeeFormModalHorizontal: React.FC<Props> = ({
  
  isOpen,
  onClose,
  employee,
  onSave,
  
}) => {
  const [form] = Form.useForm();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false); // ✅ ADD THIS

  const [managers, setManagers] = useState<any[]>([]);
const [departments, setDepartments] = useState<any[]>([]);
const [designations, setDesignations] = useState<any[]>([]);
const [statuses, setStatuses] = useState<any[]>([]);

const [filteredDesignations, setFilteredDesignations] = useState<any[]>([]);
// 🔥 DUPLICATE CHECK FUNCTION ADD HERE
const checkDuplicate = (field: string, value: string) => {

  if (employee) return Promise.resolve(); // 🔥 EDIT → skip validation

  if (!value) return Promise.resolve();

  const exists = managers.some((emp: any) => emp[field] === value);

  if (exists) {
    return Promise.reject(`${field} already exists`);
  }

  return Promise.resolve();
};


useEffect(() => {
  if (isOpen) {
    setTimeout(() => {
      const modalBody = document.querySelector(".ant-modal-body");
      modalBody?.scrollTo({ top: 0, behavior: "auto" });
    }, 0);
  }
}, [isOpen]);


// 🔥 STEP 4: FILTER DESIGNATIONS BY DEPARTMENT
const handleDepartmentChange = (deptId: number) => {
  // clear designation when department changes
  form.setFieldsValue({ designation: undefined });

  const filtered = designations.filter(
    (d: any) => d.dept_id === deptId
  );

  setFilteredDesignations(filtered);
};
useEffect(() => {
  if (employee) {
    form.setFieldsValue({
      /* ================= BASIC DETAILS ================= */
      employeeId: employee.emp_code,
      firstName: employee.first_name,
      lastName: employee.last_name,
      fatherName: employee.father_name,

      email: employee.email,
      phone: employee.mobile,
      emergencyMobile: employee.emergency_mobile,

      presentAddress: employee.present_address,
      permanentAddress: employee.permanent_address,

      bloodGroup: employee.blood_group_id,
      gender: employee.gender_id,
      maritalStatus: employee.marital_status_id,

      /* ================= JOB DETAILS ================= */
      department: employee.department_id,
      designation: employee.designation_id
  ? {
      value: employee.designation_id,
      label:
        designations.find(
          (d: any) => d.id === employee.designation_id
        )?.designation_name,
    }
  : undefined,

      employeeType: employee.employee_type_id,
      manager: employee.manager_id,
      role: employee.role_id,

      workLocation: employee.work_location_id,
      shift: employee.shift_id,
      ctc: employee.salary,
      status: employee.status_id,


      /* ================= BANK & IDS ================= */
      pan: employee.pan,
      uan: employee.uan,
      aadhaar: employee.aadhaar,
      bankAccount: employee.bank_ac_no,
      ifsc: employee.ifsc_code,

      /* ================= DATES ================= */
      dob: employee.date_of_birth
        ? dayjs(employee.date_of_birth)
        : null,

      joinDate: employee.join_date
        ? dayjs(employee.join_date)
        : null,

      prohibitionEndDate: employee.probation_end_date
        ? dayjs(employee.probation_end_date)
        : null,

      /* ================= FAMILY DETAILS (IMPORTANT FIX) ================= */
      familyMembers: employee.family_members?.map((fm: any) => ({
        relation: fm.relation_id,
        first_name: fm.first_name,
        last_name: fm.last_name,
        dob: fm.date_of_birth ? dayjs(fm.date_of_birth) : null,

        occupation: Object.keys(OCCUPATION_MAP).find(
          (key) => OCCUPATION_MAP[key] === fm.occupation_id
        ),

        phone: fm.phone,
        email: fm.email,
        presentAddress: fm.present_address,
        permanentAddress: fm.permanent_address,
        bankAccount: fm.bank_account,
        ifsc: fm.ifsc_code,
        pan: fm.pan,
        aadhaar: fm.aadhaar,
      })) || [],

      /* ================= PHOTO ================= */
      photo: employee.photo || null,
    });

    setPhotoPreview(employee.photo || null);
  } else {
    form.resetFields();
    setPhotoPreview(null);
  }
}, [employee, form, isOpen]);

  useEffect(() => {
  axios
    .get("https://belnova-hrms-be-7.onrender.com//employees")
    
    .then((res) => {
      setManagers(res.data);
    })
    .catch(() => {
      message.error("Failed to load employees");
    });
}, []);
useEffect(() => {
  const loadConfigData = async () => {
    try {
      const deptRes = await getDepartments();
      setDepartments(
        deptRes.data.filter((d: any) => d.is_active)
      );

      const desRes = await getDesignations();
      setDesignations(
        desRes.data.filter((d: any) => d.is_active)
      );
    } catch {
      message.error("Failed to load departments/designations");
    }
  };

  loadConfigData();
}, []);
useEffect(() => {
  const loadStatuses = async () => {
    try {
      const res = await getEmployeeStatuses();

      // only active statuses
      setStatuses(
        res.data
      );
    } catch {
      message.error("Failed to load statuses");
    }
  };

  loadStatuses();
}, []);


const handleFinish = async (values: any) => {
  if (!values.familyMembers || values.familyMembers.length === 0) {
    message.error("Family member is required");
    return;
  }

  const fm = values.familyMembers[0];
let payload: any = {
    id: employee?.id,  

  first_name: values.firstName,
  last_name: values.lastName,
  email: values.email,
  mobile: values.phone,

  father_name: values.fatherName,
  present_address: values.presentAddress,
  permanent_address: values.permanentAddress,

  blood_group_id: Number(values.bloodGroup),
  gender_id: Number(values.gender),
  marital_status_id: Number(values.maritalStatus),

  date_of_birth: values.dob.format("YYYY-MM-DD"),
  join_date: values.joinDate.format("YYYY-MM-DD"),
  hired_date: values.joinDate.format("YYYY-MM-DD"),
  probation_end_date: values.prohibitionEndDate
    ? values.prohibitionEndDate.format("YYYY-MM-DD")
    : values.joinDate.format("YYYY-MM-DD"),

  emergency_mobile: values.emergencyMobile,
  reference_mobile: values.referenceMobile || null,

  department_id: Number(values.department),
  designation_id:
  values.designation?.value
    ? Number(values.designation.value)
    : Number(employee?.designation_id),



  employee_type_id: Number(values.employeeType),
  manager_id: values.manager ? Number(values.manager) : null,

  role_id: Number(values.role),

  work_location_id: Number(values.workLocation),
  shift_id: Number(values.shift),
  status_id: Number(values.status),


 salary: Number(values.ctc),  // 🔥 MUST
ctc: Number(values.ctc),


  bank_id: 2,
  bank_ac_no: values.bankAccount,
  ifsc_code: values.ifsc,
  pan: values.pan,
  uan: values.uan || null,
aadhaar: values.aadhaar,


  family_members: values.familyMembers.map((fm:any) => ({
    relation_id: Number(fm.relation),
    first_name: fm.first_name,
    last_name: fm.last_name,
    date_of_birth: fm.dob.format("YYYY-MM-DD"),
    occupation_id: OCCUPATION_MAP[fm.occupation] ?? 11,
    phone: fm.phone || null,
    email: fm.email || null,
    present_address: fm.presentAddress,
    permanent_address: fm.permanentAddress,
    bank_account: fm.bankAccount || null,
    ifsc_code: fm.ifsc || null,
    pan: fm.pan || null,
    aadhaar: fm.aadhaar,
  }))
};
if (employee?.id) {
  // ✅ EDIT CASE

  // ❌ REMOVE these for PUT
  delete payload.created_by;
} else {
  // ✅ ADD CASE
  payload.emp_code = values.employeeId;
}

  console.log("FINAL PAYLOAD ✅", payload);
setSaving(true); // 🔄 loader start

try {
  await onSave(payload);   // API success

  form.resetFields();      // ✅ clear form
  setPhotoPreview(null);
  onClose();               // ✅ CLOSE MODAL
} catch (err) {
  // error already handled
} finally {
  setSaving(false);        // ⛔ loader stop
}

};


  const beforeUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only images allowed");
      return false;
    }
    const base64 = await getBase64(file);
    setPhotoPreview(base64);
    form.setFieldsValue({ photo: base64 });
    return false;
  };
  return (
    
    <Modal
      title={employee ? "Edit Employee" : "Add Employee"}
      open={isOpen}
      width="95%"
      onCancel={() => {
        form.resetFields();
        setPhotoPreview(null);
        onClose();
      }}
      footer={null}
    >
      <div style={{ position: "relative" }}></div>
      <Form
        form={form}
        layout="vertical"
        size="middle"
        onFinish={handleFinish}
        initialValues={{ familyMembers: [] }}
      >
        {/* ---------------- TOP SECTION ---------------- */}
<Row gutter={16} align="middle">
  <Col xs={24} sm={6} md={4}>
   <Form.Item
  name="photo"
  label="Photo"
>
  <div className="avatar-upload">
    <Avatar size={96} src={photoPreview || undefined}>
      {!photoPreview && (employee?.first_name?.[0] || "U")}
    </Avatar>

    <Upload
      showUploadList={false}
      beforeUpload={beforeUpload}
      accept="image/*"
    >
      <Button icon={<UploadOutlined />} style={{ marginTop: 10 }}>
        Upload Photo
      </Button>
    </Upload>

    {photoPreview && (
      <Button
        type="link"
        danger
        onClick={() => {
          setPhotoPreview(null);
          form.setFieldsValue({ photo: null });
        }}
      >
        Remove
      </Button>
    )}
  </div>
</Form.Item>

  </Col>

  <Col xs={24} sm={18} md={20}>
    <Row gutter={12}>

   <Col xs={24} sm={12} md={6}>
  <Form.Item
    name="employeeId"
    label="Employee ID"
    rules={[
      { required: true, message: "Employee ID is required" },
      {
        pattern: /^[a-zA-Z0-9]+$/,
        message: "Employee ID must contain only letters and numbers",
      },
    ]}
    required
  >
    <Input
  placeholder="EMP001"
  disabled={!!employee}   // 👈 IDHI IMPORTANT
  onChange={(e) => {
    const filteredValue = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    form.setFieldsValue({ employeeId: filteredValue });
  }}
/>

  </Form.Item>
</Col>




     {/* First Name */}
<Col xs={24} sm={12} md={6}>
  <Form.Item
  name="firstName"
  label="First Name"
  rules={[
    { required: true, message: "First name is required" },
    {
      pattern: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
      message: "Only alphabets allowed (no numbers or symbols)",
    },
    { min: 2, message: "Minimum 2 characters required" },
    { max: 50, message: "Maximum 50 characters allowed" },
  ]}
 getValueFromEvent={(e) =>
  e.target.value
    .replace(/[^A-Za-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

>
  <Input maxLength={50} autoComplete="off" />
</Form.Item>

</Col>

{/* Last Name */}
<Col xs={24} sm={12} md={6}>
  <Form.Item
  name="lastName"
  label="Last Name"
  rules={[
    { required: true, message: "Last name is required" },
    {
      pattern: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
      message: "Only alphabets allowed",
    },
    { min: 1, message: "At least 1 character required" },
    { max: 50, message: "Maximum 50 characters allowed" },
  ]}
  getValueFromEvent={(e) =>
    e.target.value.replace(/[^A-Za-z\s]/g, "")
  }
>
  <Input maxLength={50} autoComplete="off" />
</Form.Item>

</Col>


      {/* Father Name */}
      <Col xs={24} sm={12} md={6}>
        <Form.Item
  name="fatherName"
  label="Father Name"
  rules={[
    { required: true, message: "Father name is required" },
    {
      pattern: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
      message: "Only alphabets allowed (no numbers or symbols)",
    },
    { min: 2, message: "Minimum 2 characters required" },
    { max: 50, message: "Maximum 50 characters allowed" },
  ]}
  getValueFromEvent={(e) =>
    e.target.value
      .replace(/[^A-Za-z\s]/g, "") // ❌ removes digits & symbols
      .replace(/\s+/g, " ")        // single space only
      .replace(/^\s/, "")          // no leading space
  }
>
  <Input
    placeholder="Enter Father Name"
    maxLength={50}
    autoComplete="off"
  />
</Form.Item>

      </Col>

      {/* Blood Group */}
      <Col xs={24} sm={12} md={6}>
        <Form.Item
  name="bloodGroup"
  label="Blood Group"
  rules={[{ required: true, message: "Blood Group is required" }]}
>
  <Select placeholder="Select Blood Group">
    <Option value={1}>A+</Option>
    <Option value={2}>A-</Option>
    <Option value={3}>B+</Option>
    <Option value={4}>B-</Option>
    <Option value={5}>AB+</Option>
    <Option value={6}>AB-</Option>
    <Option value={7}>O+</Option>
  </Select>
</Form.Item>

      </Col>

    </Row>
  </Col>
</Row>


{/* ---------------- PERSONAL DETAILS ---------------- */}
<h3>Personal Details</h3>

<Row gutter={12}>
  {/* DOB */}
  <Col xs={24} sm={12} md={6}>
    <Form.Item
      name="dob"
      label="Date of Birth"
      required
      rules={[{ required: true, message: "DOB is required" }]}
    >
      <DatePicker style={{ width: "100%" }} />
    </Form.Item>
  </Col>

  {/* Gender */}
  <Col xs={24} sm={12} md={6}>
    <Form.Item
  name="gender"
  label="Gender"
  rules={[{ required: true, message: "Gender is required" }]}
>
  <Select placeholder="Select Gender">
    <Option value={1}>Male</Option>
    <Option value={2}>Female</Option>
    <Option value={3}>Other</Option>
  </Select>
</Form.Item>

  </Col>

  {/* Marital Status */}
  <Col xs={24} sm={12} md={6}>
    <Form.Item
  name="maritalStatus"
  label="Marital Status"
  rules={[{ required: true, message: "Marital Status is required" }]}
>
  <Select placeholder="Select Marital Status">
    <Option value={1}>Single</Option>
    <Option value={2}>Married</Option>
    <Option value={3}>Other</Option>
  </Select>
</Form.Item>

  </Col>

  {/* Email */}
  <Col xs={24} sm={12} md={6}>
  <Form.Item
  name="email"
  label="Email"
  rules={[
    { required: true, message: "Email is required" },
    {
      validator: (_, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) return Promise.resolve(); // required rule handles empty

        if (!emailRegex.test(value)) {
          return Promise.reject("Enter a valid email");
        }

        return Promise.resolve();
      },
    },
    {
  validator: (_, value) => checkDuplicate("email", value),
}

  ]}
>
  <Input placeholder="example@gmail.com" />
</Form.Item>




  </Col>
</Row>

<Row gutter={12}>
  {/* Present Address */}
  <Col xs={24} sm={12}>
    <Form.Item
      name="presentAddress"
      label="Present Address"
      required
      rules={[{ required: true, message: "Present address is required" }]}
    >
      <TextArea rows={2} />
    </Form.Item>
  </Col>

  {/* Permanent Address */}
  <Col xs={24} sm={12}>
    <Form.Item
      name="permanentAddress"
      label="Permanent Address"
      required
      rules={[{ required: true, message: "Permanent address is required" }]}
    >
      <TextArea rows={2} />
    </Form.Item>
  </Col>
</Row>


   {/* ---------------- JOB DETAILS ---------------- */}
<h3>Job Details</h3>
 <Row gutter={12}>
  <Col xs={24} sm={12} md={6}>
    <Form.Item
      name="role"
      label="Role"
      rules={[{ required: true, message: "Role is required" }]}
    >
      <Select placeholder="Select Role">
        <Option value={1}>HR Admin</Option>
        <Option value={2}>Employee</Option>
        <Option value={3}>Manager / Supervisor</Option>
        <Option value={4}>Payroll Officer</Option>
        <Option value={5}>System Administrator</Option>
      </Select>
    </Form.Item>
  </Col>

  <Col xs={24} sm={12} md={6}>
    <Form.Item
      name="department"
      label="Department"
      rules={[{ required: true, message: "Department is required" }]}
    >
      <Select
        placeholder="Select Department"
        onChange={handleDepartmentChange}
      >
        {departments.map((dept) => (
          <Option key={dept.id} value={dept.id}>
            {dept.department}
          </Option>
        ))}
      </Select>
    </Form.Item>
  </Col>

  <Col xs={24} sm={12} md={6}>
    <Form.Item
      name="designation"
      label="Designation"
      rules={[{ required: true, message: "Designation is required" }]}
    >
      <Select
  placeholder="Select Designation"
  labelInValue
>

        {filteredDesignations.map((des) => (
          <Option key={des.id} value={des.id}>
            {des.designation_name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  </Col>

  <Col xs={24} sm={12} md={6}>
    <Form.Item
      name="employeeType"
      label="Employee Type"
      rules={[{ required: true, message: "Employee Type is required" }]}
    >
      <Select placeholder="Select Employee Type">
        <Option value={1}>Regular</Option>
        <Option value={2}>Contract</Option>
        <Option value={3}>Intern</Option>
      </Select>
    </Form.Item>
  </Col>
</Row>


<Row gutter={12}>
  <Col xs={24} sm={12} md={6}>
    <Form.Item
  name="workLocation"
  label="Work Location"
  rules={[{ required: true, message: "Work Location is required" }]}
>
  <Select placeholder="Select Work Location">
    <Option value={1}>Hyderabad</Option>
    <Option value={2}>Bangalore</Option>
    <Option value={3}>Chennai</Option>
  </Select>
</Form.Item>

  </Col>

  <Col xs={24} sm={12} md={6}>
    <Form.Item
  name="shift"
  label="Shift"
  rules={[{ required: true, message: "Shift is required" }]}
>
  <Select placeholder="Select Shift">
    <Option value={1}>Day</Option>
    <Option value={2}>Night</Option>
    <Option value={3}>Flexible</Option>
  </Select>
</Form.Item>

  </Col>

  <Col xs={24} sm={12} md={6}>
 <Form.Item
  name="manager"
  label="Reporting Manager"
  rules={[{ required: true, message: "Select Reporting Manager" }]}
>
  <Select
    showSearch
    placeholder="Select Reporting Manager"
    optionFilterProp="children"
    onMouseDown={(e) => e.stopPropagation()}
    onClick={(e) => e.stopPropagation()}
  >
    {managers.map((emp) => (
      <Option key={emp.id} value={emp.id}>
        {emp.first_name} {emp.last_name} ({emp.emp_code})
      </Option>
    ))}
  </Select>
</Form.Item>


  </Col>

  <Col xs={24} sm={12} md={6}>
  <Form.Item
  name="joinDate"
  label="Joining Date"
  rules={[{ required: true, message: "Joining date is required" }]}
>
  <DatePicker style={{ width: "100%" }} />
</Form.Item>


  </Col>
</Row>

<Row gutter={12}>
  <Col xs={24} sm={12} md={6}>
 <Form.Item
  name="prohibitionEndDate"
  label="Prohibition End Date"
>
  <DatePicker
    style={{ width: "100%" }}
    disabledDate={(current) => {
      const joinDate = form.getFieldValue("joinDate");

      if (!joinDate) return false; // allow all until joining date selected

      return current < joinDate.startOf("day"); // block before joining date
    }}
  />
</Form.Item>

  </Col>

   <Col xs={24} sm={12} md={6}>
  <Form.Item
    name="status"
    label="Status"
    rules={[{ required: true, message: "Status is required" }]}
  >
    <Select placeholder="Select Status">
 {statuses
  .sort((a, b) => a.id - b.id)
  .map((s) => (

    <Option value={s.id}>

      {s.status_name}
    </Option>
  ))}
</Select>

  </Form.Item>
</Col>


  <Col xs={24} sm={12} md={6}>
    <Form.Item
  name="uan"
  label="UAN"
  rules={[
    
    {
      pattern: /^[0-9]{12}$/,
      message: "UAN must be exactly 12 digits",
    },
  ]}
  getValueFromEvent={(e) =>
    e.target.value.replace(/\D/g, "") // ❌ removes alphabets & symbols
  }
>
  <Input
    maxLength={12}
    placeholder="Enter 12-digit UAN"
    autoComplete="off"
  />
</Form.Item>

  </Col>

  <Col xs={24} sm={12} md={6}>
    <Form.Item
  name="pan"
  label="PAN"
  normalize={(v) => v?.toUpperCase()}
 rules={[
  { required: true, message: "PAN is required" },
  {
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
    message: "Invalid PAN format (ABCDE1234F)",
  },
  {
    validator: (_, value) => checkDuplicate("pan", value),
  },
]}

  getValueFromEvent={(e) =>
    e.target.value
      .replace(/[^a-zA-Z0-9]/g, "") // ❌ removes special characters
      .toUpperCase()
  }
>
  <Input
    maxLength={10}
    placeholder="ABCDE1234F"
    autoComplete="off"
  />
</Form.Item>

  </Col>
</Row>

<Row gutter={12}>
  <Col xs={24} sm={12} md={6}>
    <Form.Item
  name="aadhaar"
  label="Aadhaar"
  rules={[
    { required: true, message: "Aadhaar is required" },
    {
      pattern: /^[0-9]{12}$/,
      message: "Aadhaar must be exactly 12 digits",
    },
    {
  validator: (_, value) => checkDuplicate("aadhaar", value),
}

  ]}
  getValueFromEvent={(e) =>
    e.target.value.replace(/\D/g, "") // ❌ removes alphabets & symbols
  }
>
  <Input
    maxLength={12}
    placeholder="Enter 12-digit Aadhaar"
    autoComplete="off"
    inputMode="numeric"
  />
</Form.Item>

  </Col>

  <Col xs={24} sm={12} md={6}>
 <Form.Item
  name="ctc"
  label="CTC"
  rules={[
    { required: true, message: "CTC is required" },
    {
      pattern: /^[0-9]+$/,
      message: "CTC must contain only numbers",
    },
    {
      validator: (_, value) => {
        if (!value) return Promise.resolve();
        if (value.length > 8) {
          return Promise.reject(
            new Error("CTC must not exceed 8 digits")
          );
        }
        return Promise.resolve();
      },
    },
  ]}
  validateTrigger={["onChange", "onBlur"]}
>
  <Input placeholder="Enter CTC" />
</Form.Item>


</Col>


  <Col xs={24} sm={12} md={6}>
   <Form.Item
  name="bankAccount"
  label="Bank Account"
  rules={[
    { required: true, message: "Bank account is required" },
    {
      pattern: /^[0-9]{9,18}$/,
      message: "Bank account must be 9–18 digits",
    },
    {
  validator: (_, value) => checkDuplicate("bank_ac_no", value),
}

  ]}
 getValueFromEvent={(e) =>
  e.target.value.replace(/\D/g, "").slice(0, 18)
}

>
  <Input
    maxLength={18}
    placeholder="Enter bank account number"
    autoComplete="off"
    inputMode="numeric"
  />
</Form.Item>

  </Col>

  <Col xs={24} sm={12} md={6}>
    <Form.Item
  name="ifsc"
  label="IFSC"
  rules={[
    { required: true, message: "IFSC Code is required" },
    {
      pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
      message: "Invalid IFSC Code (eg: HDFC0001234)",
    },
  ]}
  getValueFromEvent={(e) =>
    e.target.value
      .replace(/[^a-zA-Z0-9]/g, "") // ❌ removes special characters
      .toUpperCase()
  }
>
  <Input
    maxLength={11}
    placeholder="HDFC0001234"
    autoComplete="off"
  />
</Form.Item>

  </Col>
</Row>

{/* ---------------- CONTACT INFO ---------------- */}
<h3>Contact Info</h3>

<Row gutter={12}>
  <Col xs={24} sm={12}>
   <Form.Item
  name="phone"
  label="Phone Number"
  rules={[
    { required: true, message: "Phone number is required" },
    {
      pattern: /^[6-9][0-9]{9}$/,
      message: "Phone number must be 10 digits and start with 6, 7, 8, or 9",
    },
    {
  validator: (_, value) => checkDuplicate("mobile", value),
}

  ]}
  getValueFromEvent={(e) => {
    let value = e.target.value.replace(/\D/g, ""); // allow digits only

    // ❌ block if first digit is not 6–9
    if (value.length === 1 && !/^[6-9]$/.test(value)) {
      return "";
    }

    // ✅ limit to 10 digits
    return value.slice(0, 10);
  }}
>


  <Input
    maxLength={10}
    placeholder="Enter 10-digit phone number"
    autoComplete="off"
    inputMode="numeric"
  />
</Form.Item>

  </Col>

  <Col xs={24} sm={12}>
  <Form.Item
  name="emergencyMobile"
  label="Emergency Mobile"
  rules={[
    { required: true, message: "Emergency mobile is required" },
    {
      pattern: /^[6-9][0-9]{9}$/,
      message: "Emergency mobile must be 10 digits and start with 6, 7, 8, or 9",
    },
  ]}
  getValueFromEvent={(e) => {
    let value = e.target.value.replace(/\D/g, "");

    // ❌ block first digit if not 6–9
    if (value.length === 1 && !/^[6-9]$/.test(value)) {
      return "";
    }

    // ✅ limit to 10 digits
    return value.slice(0, 10);
  }}
>
  <Input maxLength={10} />
</Form.Item>


  </Col>
</Row>


      

    {/* ============================
      FAMILY DETAILS SECTION 
============================ */}
{/* <Divider orientation="start">Family Details</Divider> */}

<Form.List name="familyMembers">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name }) => (
        <Card
          key={key}
          style={{
            marginBottom: 16,
            background: "#fafafa",
            borderRadius: 8,
          }}
        >

          {/* ------------------- ROW 1 (4 Columns) ------------------- */}
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name={[name, "relation"]}
                label="Relation"
                rules={[{ required: true, message: "Relation is required" }]}
              >
                <Select placeholder="Select Relation">
   <Option value={1}>Father</Option>
<Option value={2}>Mother</Option>
<Option value={3}>Spouse</Option>
<Option value={4}>Son</Option>
<Option value={5}>Daughter</Option>
<Option value={6}>Husband</Option>
  </Select>
              </Form.Item>
            </Col>

 <Col span={6}>
  <Form.Item
    name={[name, "first_name"]}
    label="First Name"
    rules={[
      { required: true, message: "First name is required" },
      {
        pattern: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
        message: "Only alphabets are allowed (no numbers or symbols)",
      },
      {
        min: 2,
        message: "First name must be at least 2 characters",
      },
      {
        max: 50,
        message: "First name cannot exceed 50 characters",
      },
    ]}
    getValueFromEvent={(e) =>
      e.target.value
        .replace(/[^A-Za-z\s]/g, "")   // remove digits & symbols
        .replace(/\s+/g, " ")          // collapse multiple spaces
        .replace(/^\s/, "")            // no leading space
    }
  >
    <Input
      placeholder="Enter First Name"
      maxLength={50}
      autoComplete="off"
    />
  </Form.Item>
</Col>

             <Col span={6}>
<Form.Item
name={[name, "last_name"]}
  label="Last Name"
  rules={[
    { required: true, message: "Last name is required" },
    {
      pattern: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
      message: "Only alphabets allowed",
    },
    { max: 50, message: "Maximum 50 characters allowed" },
  ]}
  getValueFromEvent={(e) =>
    e.target.value.replace(/[^A-Za-z\s]/g, "")
  }
>
  <Input maxLength={50} />
</Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name={[name, "dob"]}
                label="Date of Birth"
                rules={[{ required: true, message: "DOB is required" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name={[name, "occupation"]}
                label="Occupation"
                rules={[{ required: true, message: "Occupation is required" }]}
              >
              <Select placeholder="Select Occupation">
    <Option value="GovernmentEmployee">Government Employee</Option>
    <Option value="PrivateEmployee">Private Employee</Option>
    <Option value="Business">Business</Option>
    <Option value="Farmer">Farmer</Option>
    <Option value="SelfEmployed">Self Employed</Option>
    <Option value="Labourer">Labourer</Option>
    <Option value="Teacher">Teacher</Option>
    <Option value="Driver">Driver</Option>
    <Option value="HomeMaker">Home Maker</Option>
    <Option value="Retired">Retired</Option>
    <Option value="NA">NA</Option>
  </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* ------------------- ROW 2 (4 Columns) ------------------- */}
          <Row gutter={16}>
            <Col span={6}>
             <Form.Item
  name={[name, "phone"]}
  label="Phone Number"
  rules={[
    {
      pattern: /^[0-9]{10}$/,
      message: "Phone number must be exactly 10 digits",
    },
  ]}
  getValueFromEvent={(e) =>
    e.target.value.replace(/\D/g, "") // ❌ removes alphabets & symbols
  }
>
  <Input
    placeholder="Enter phone"
    maxLength={10}
    autoComplete="off"
    inputMode="numeric"
  />
</Form.Item>

            </Col>

            <Col span={6}>
              <Form.Item
                name={[name, "email"]}
                label="Email"
                rules={[
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input placeholder="example@gmail.com" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name={[name, "presentAddress"]}
                label="Present Address"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input.TextArea rows={1} placeholder="Present address" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name={[name, "permanentAddress"]}
                label="Permanent Address"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input.TextArea rows={1} placeholder="Permanent address" />
              </Form.Item>
            </Col>
          </Row>

          {/* ------------------- ROW 3 (4 Columns) ------------------- */}
          <Row gutter={16}>
            <Col span={6}>
             <Form.Item
  name={[name, "bankAccount"]}
  label="Bank Account"
  rules={[
    {
      pattern: /^[0-9]{9,18}$/,
      message: "Bank account must be 9–18 digits only",
    },
  ]}
  getValueFromEvent={(e) =>
    e.target.value.replace(/\D/g, "") // ❌ blocks alphabets & symbols
  }
>
  <Input
    placeholder="Enter account number"
    maxLength={18}
    autoComplete="off"
    inputMode="numeric"
  />
</Form.Item>

            </Col>

            <Col span={6}>
             <Form.Item
  name={[name, "ifsc"]}
  label="IFSC Code"
  rules={[
    {
      pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
      message: "Invalid IFSC format (eg: HDFC0001234)",
    },
  ]}
  getValueFromEvent={(e) =>
    e.target.value
      .replace(/[^a-zA-Z0-9]/g, "") // ❌ blocks special characters
      .toUpperCase()
  }
>
  <Input
    placeholder="HDFC0001234"
    maxLength={11}
    autoComplete="off"
  />
</Form.Item>

            </Col>

            <Col span={6}>
             <Form.Item
  name={[name, "pan"]}
  label="PAN"
  rules={[
    {
      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
      message: "Invalid PAN format (ABCDE1234F)",
    },
  ]}
  getValueFromEvent={(e) =>
    e.target.value
      .replace(/[^a-zA-Z0-9]/g, "") // ❌ blocks special characters
      .toUpperCase()
  }
>
  <Input
    placeholder="ABCDE1234F"
    maxLength={10}
    autoComplete="off"
  />
</Form.Item>

            </Col>

            <Col span={6}>
              <Form.Item
  name={[name, "aadhaar"]}
  label="Aadhaar"
  rules={[
    { required: true, message: "Aadhaar is required" },
    {
      pattern: /^[0-9]{12}$/,
      message: "Aadhaar must be exactly 12 digits",
    },
  ]}
  getValueFromEvent={(e) =>
    e.target.value.replace(/\D/g, "") // ❌ blocks alphabets & symbols
  }
>
  <Input
    placeholder="Enter 12-digit Aadhaar"
    maxLength={12}
    autoComplete="off"
    inputMode="numeric"
  />
</Form.Item>

            </Col>
          </Row>

          <Button style={{ width: "15%",marginLeft:"85%" }}
            danger
            onClick={() => remove(name)}
            icon={<DeleteOutlined />}
          >
            Remove Member
          </Button>
        </Card>
      ))}

      <Button
        type="dashed"
        onClick={() => add()}
        block
        icon={<PlusOutlined />}
        style={{ width: "15%" }}
      >
        Add Family Member
      </Button>
    </>
  )}
</Form.List>

<Divider />



        {/* ============================
              SUBMIT BUTTON
        ============================ */}
      <Form.Item>
  <Button
    type="primary"
    htmlType="submit"
    loading={saving}
    disabled={saving}
    style={{ width: "10%", height: 35, marginLeft: "90%" }}
  >
    {employee ? "Update Employee" : "Add Employee"}
  </Button>
</Form.Item>

</Form>   {/* ✅ THIS LINE WAS MISSING */}
{saving && (
  <>
    {/* Blur full screen */}
    <div
      style={{
        position: "fixed",   // 🔥 KEY CHANGE
        inset: 0,
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 2000,
      }}
    />

    {/* Loader ALWAYS visible at top */}
    <div
      style={{
        position: "fixed",   // 🔥 KEY CHANGE
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2001,
      }}
    >
      <Spin size="large" />
    </div>
  </>
)}



</Modal>
);
};

export default EmployeeFormModalHorizontal;



