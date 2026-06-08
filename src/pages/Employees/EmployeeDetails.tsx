import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Avatar, Button, Spin, Divider, message } from "antd";

import {
  UserOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";

import Sidebar from "../../components/sidebar/Sidebar";
import EmployeeFormModalHorizontal from "./EmployeeFormModalHorizontal";
import "./EmployeeDetails.css";

import jsPDF from "jspdf";
import autoTable  from "jspdf-autotable";


import type { EmployeeDetails } from "./Employees";
import logo from "../../assets/Logo/logo.jpg";




const API_BASE = "https://hrms-be-ppze.onrender.com";
// 🔹 Occupation ID → Name mapping
const occupationMap: Record<number, string> = {
  1: "Government Employee",
  2: "Private Employee",
  3: "Business",
  4: "Farmer",
  5: "Self Employed",
  6: "Labourer",
  7: "Teacher",
  8: "Driver",
  9: "Home Maker",
  10: "Retired",
  11: "NA",
};

// 🔹 Department ID → Name
const departmentMap: Record<number, string> = {
  1: "Business & Operations",
  2: "Media & Communication",
  3: "People & Support",
  4: "Legal Risk & Compliance",
  5: "Supply Chain & Procurement",
  6: "Management & Strategy",
  7: "Technology & Engineering",
  8: "Information Technology",
  9: "Software Development",
  10: "DevOps & Cloud",
  11: "Quality Assurance",
  12: "Cyber Security",
  13: "Data & Analytics",
};


// 🔹 Designation ID → Name
const designationMap: Record<number, string> = {
  1: "Operations Manager",
  2: "Business Analyst",
  3: "Content Manager",
  4: "Digital Marketing Executive",
  5: "HR Executive",
  6: "Talent Acquisition Specialist",
  7: "Legal Officer",
  8: "Compliance Manager",
  9: "Procurement Executive",
  10: "Logistics Coordinator",
  11: "Project Manager",
  12: "Strategy Analyst",
  13: "Technology Lead",
  14: "IT Support Engineer",
  15: "Software Engineer",
  16: "DevOps Engineer",
  17: "QA Engineer",
  18: "Security Analyst",
  19: "Data Analyst",
  20: "Senior Software Engineer",
};


// 🔹 Relation ID → Name
const relationMap: Record<number, string> = {
  1: "Father",
  2: "Mother",
  3: "Spouse",
  4: "Son",
  5: "Daughter",
  6: "Husband",
};
// 🔹 Status ID → Name
const statusMap: Record<number, string> = {
  1: "Active",
  2: "Inactive",
  3: "On Leave",   // ✅ FIXED
  4: "Resigned",   // ✅ FIXED
};


const EmployeeDetailsPage: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);

useEffect(() => {
  axios
    .get("https://hrms-be-ppze.onrender.com/employees")
    .then((res) => setEmployees(res.data))
    .catch(() => {});
}, []);


  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  

  const [rawEmployee, setRawEmployee] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);


  /* ================= FETCH EMPLOYEE ================= */
 useEffect(() => {
  window.scrollTo(0, 0);  // 🔥 THIS LINE FIXES YOUR ISSUE
  if (id) fetchEmployeeFromAll(id);
}, [id]);


 const fetchEmployeeFromAll = async (empId: string) => {
  try {
    setLoading(true);

   const res = await axios.get(`${API_BASE}/employees/${empId}`);

   const e = res.data;

setRawEmployee(e);

    if (!e) {
      setEmployee(null);
      return;
    }

  setEmployee({
  id: e.id,

  // BASIC
  employeeId: e.emp_code || "-",
  name: `${e.first_name} ${e.last_name}`,
  email: e.email || "-",
  phone: e.mobile || "-",
  emergency_mobile: e.emergency_mobile || "-",

  // PERSONAL
  date_of_birth: e.date_of_birth || "-",

  gender:
    e.gender_id === 1
      ? "Male"
      : e.gender_id === 2
      ? "Female"
      : e.gender_id === 3
      ? "Other"
      : "-",

  marital_status:
    e.marital_status_id === 1
      ? "Single"
      : e.marital_status_id === 2
      ? "Married"
      : "Other",

  blood_group:
    e.blood_group_id === 1
      ? "A+"
      : e.blood_group_id === 2
      ? "A-"
      : e.blood_group_id === 3
      ? "B+"
      : e.blood_group_id === 4
      ? "B-"
      : e.blood_group_id === 5
      ? "AB+"
      : e.blood_group_id === 6
      ? "AB-"
      : e.blood_group_id === 7
      ? "O+"
      : "-",

  present_address: e.present_address || "-",
  permanent_address: e.permanent_address || "-",

  // JOB
  joinDate: e.join_date || "-",
  probationEndDate: e.probation_end_date || "-",

 department: e.department_name ?? departmentMap[e.department_id] ?? e.department_id,
designation: e.designation_name ?? designationMap[e.designation_id],


  employeeType:
    e.employee_type_id === 1
      ? "Regular"
      : e.employee_type_id === 2
      ? "Contract"
      : "Intern",

  workLocation:
    e.work_location_id === 1
      ? "Hyderabad"
      : e.work_location_id === 2
      ? "Bangalore"
      : "Chennai",

  shift:
    e.shift_id === 1
      ? "Day"
      : e.shift_id === 2
      ? "Night"
      : "Flexible",

manager: e.manager_id,



  role: e.role_id === 2 ? "Employee" : "Other",
  status: statusMap[e.status_id] ?? e.status_name ?? "-",





  // SALARY & IDs
  salary: e.ctc || 0,
  pan: e.pan || "-",
  uan: e.uan || "-",
  aadhaar: e.aadhaar || "-",


  bank_ac_no: e.bank_ac_no || "-",
  ifsc_code: e.ifsc_code || "-",

  // FAMILY
 family_members:
  e.family_members ||
  e.familyMembers ||
  e.family_member ||
  [],

});


  } catch (error) {
    console.error("Error fetching employee:", error);
    setEmployee(null);
  } finally {
    setLoading(false);
  }
};

const handleUpdateEmployee = async (payload: any) => {
  try {

    const { status_id, ...employeePayload } = payload;

  await axios.put(
  `${API_BASE}/employees/${rawEmployee.id}`,
  payload
);


  


    message.success("Employee updated successfully ✅");

    setIsModalOpen(false);
    fetchEmployeeFromAll(String(rawEmployee.id));

  } catch (error) {
    console.error("Update error:", error);
    message.error("Failed to update employee ❌");
  }
};

  /* ================= PDF DOWNLOAD ================= */
  const handleDownload = () => {
    if (!employee) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    const img = new Image();
    img.src = logo;

    img.onload = () => {
      doc.addImage(img, "JPEG", 12, 10, 40, 28);

     doc.setFont("helvetica", "normal");
doc.setFontSize(11);

      doc.text(
        "RM1 Coders Hub Software Solutions",
        pageWidth / 2,
        18,
        { align: "center" }
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(
        "Vasavi Sky City, Office No:2, 8th Floor,",
        pageWidth / 2,
        26,
        { align: "center" }
      );
      doc.text(
        "Telecom Nagar, Gachibowli, Hyderabad - 500032",
        pageWidth / 2,
        31,
        { align: "center" }
      );
    
doc.text(
  "Email: info@rm1codershub.com",
  pageWidth / 2,
  36,
  { align: "center" }
);



      // 🔐 Prevent email from becoming clickable (mailto)
const safeEmail = employee.email
  ? employee.email.replace("@", "@\u200B")
  : "-";

autoTable(doc, {
  startY: 42,
  theme: "grid",
  head: [["Field", "Value"]],
  body: [
    ["Employee ID", employee.employeeId ?? "-"],
    ["Name", employee.name ?? "-"],
    ["Role", employee.role ?? "-"],

    [
      "Department",
      rawEmployee?.department_name ||
      departmentMap[Number(rawEmployee?.department_id)] ||
      "-"
    ],

    ["Designation", employee.designation ?? "-"],
    ["Status", employee.status ?? "-"],
    ["Email", employee.email ?? "-"],
    ["Phone", employee.phone ?? "-"],
    ["Emergency Mobile", employee.emergency_mobile ?? "-"],
    ["Date of Birth", employee.date_of_birth ?? "-"],
    ["Gender", employee.gender ?? "-"],
    ["Marital Status", employee.marital_status ?? "-"],
    ["Blood Group", employee.blood_group ?? "-"],
    ["Present Address", employee.present_address ?? "-"],
    ["Permanent Address", employee.permanent_address ?? "-"],
    ["Join Date", employee.joinDate ?? "-"],
    ["CTC", employee.salary ? String(employee.salary) : "-"],
    ["PAN", employee.pan ?? "-"],
    ["UAN", employee.uan ?? "-"],
    ["Bank Account", employee.bank_ac_no ?? "-"],
    ["IFSC Code", employee.ifsc_code ?? "-"],
  ],
});





let finalY = (doc as any).lastAutoTable.finalY + 8;

if (employee.family_members && employee.family_members.length > 0) {
  employee.family_members.forEach((fm: any, index: number) => {
    doc.setFont("helvetica", "bold");
    doc.text(`Family Member ${index + 1}`, 14, finalY);

    autoTable(doc, {
      startY: finalY + 4,
      theme: "grid",
      head: [["Field", "Value"]],
      body: [
        ["Relation", relationMap[fm.relation_id] || "-"],
        ["Name", `${fm.first_name} ${fm.last_name}`],
        ["Date of Birth", fm.date_of_birth || "-"],
       ["Occupation", occupationMap[fm.occupation_id] || "-"],
        ["Phone", fm.phone || "-"],
        ["Email", fm.email || "-"],
        ["Present Address", fm.present_address || "-"],
        ["Permanent Address", fm.permanent_address || "-"],
        ["Bank Account", fm.bank_account || "-"],
        ["IFSC Code", fm.ifsc_code || "-"],
        ["Aadhaar", fm.aadhaar || "-"],
      ],
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;
  });
}

      doc.save(`${employee.name}-Employee-Details.pdf`);
    };
  };

  /* ================= LOADER ================= */
  if (loading) {
    
    return (
      
      <div className="employee-details-layout">
        <Sidebar />
        <div className="employee-loader-wrapper">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  /* ================= NO DATA ================= */
  if (!employee) {
    
    return (
      
      <div className="employee-details-layout">
        <Sidebar />
        <div className="employee-details-container">
          <Button type="link" onClick={() => navigate(-1)}>
            ← Back to Employees
          </Button>
          <h2>No employee found</h2>
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  
  return (
    
    <div className="employee-details-layout">
      <Sidebar />

      <div className="employee-details-container">
        <Button type="link" onClick={() => navigate(-1)}>
          ← Back to Employees
        </Button>

        <Card className="employee-details-card">
          <div className="employee-header">
            <Avatar size={90} icon={<UserOutlined />} />
            <div>
              <h2>{employee.name}</h2>
              <p>{employee.role}</p>
            </div>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Edit
            </Button>
          </div>

          <div className="salary-box">
            <h3>CTC: ₹ {employee.salary}</h3>
          </div>
        </Card>

      {/* PERSONAL DETAILS */}
<Card title="Personal Details" className="section-card">
  <div className="details-row">
    <div className="detail-box">
      <label>Email</label>
      <span>{employee.email}</span>
    </div>

    <div className="detail-box">
      <label>Phone</label>
      <span>{employee.phone}</span>
    </div>

    <div className="detail-box">
      <label>Date of Birth</label>
      <span>{employee.date_of_birth}</span>
    </div>
  </div>

  <div className="details-row">
    <div className="detail-box">
      <label>Gender</label>
      <span>{employee.gender}</span>
    </div>

    <div className="detail-box">
      <label>Marital Status</label>
      <span>{employee.marital_status}</span>
    </div>

    <div className="detail-box">
      <label>Blood Group</label>
      <span>{employee.blood_group}</span>
    </div>
  </div>

  <div className="details-row">
    <div className="detail-box">
      <label>Present Address</label>
      <span>{employee.present_address}</span>
    </div>

    <div className="detail-box">
      <label>Permanent Address</label>
      <span>{employee.permanent_address}</span>
    </div>
  </div>


</Card>


       {/* JOB DETAILS */}
<Card title="Job Details" className="section-card">
  <div className="details-row">
    <div className="detail-box">
      <label>Employee ID</label>
      <span>{employee.employeeId}</span>
    </div>

    <div className="detail-box">
      <label>Department</label>
      <span>{employee.department}</span>
    </div>

    <div className="detail-box">
      <label>Designation</label>
      <span>{employee.designation}</span>
    </div>
  </div>

  <div className="details-row">
    <div className="detail-box">
      <label>Employee Type</label>
      <span>{employee.employeeType}</span>
    </div>

    <div className="detail-box">
      <label>Work Location</label>
      <span>{employee.workLocation}</span>
    </div>

    <div className="detail-box">
      <label>Shift</label>
      <span>{employee.shift}</span>
    </div>
  </div>

  <div className="details-row">
    <div className="detail-box">
      <label>Reporting Manager</label>
     <span>
  {
    employees.find(emp => Number(emp.id) === Number(employee.manager))
      ? `${employees.find(emp => Number(emp.id) === Number(employee.manager))?.first_name} ${employees.find(emp => Number(emp.id) === Number(employee.manager))?.last_name}`
      : "-"
  }
</span>

    </div>

    <div className="detail-box">
      <label>Join Date</label>
      <span>{employee.joinDate}</span>
    </div>

    <div className="detail-box">
      <label>Prohibition End</label>
      <span>{employee.probationEndDate}</span>
    </div>
  </div>

  <div className="details-row">
    <div className="detail-box">
      <label>Status</label>
      <span>{employee.status}</span>
    </div>

   <div className="detail-box">
      <label>UAN</label>
      <span>{employee.uan}</span>
    </div>

    <div className="detail-box">
      <label>PAN</label>
      <span>{employee.pan}</span>
    </div>
  </div>



  <div className="details-row">
    <div className="detail-box">
      <label>Bank Account</label>
      <span>{employee.bank_ac_no}</span>
    </div>
 <div className="detail-box">
      <label>Aadhaar</label>
      <span>{employee.aadhaar}</span>
    </div>
    <div className="detail-box">
      <label>IFSC Code</label>
      <span>{employee.ifsc_code}</span>
    </div>
  </div>
</Card>

{/* CONTACT DETAILS */}
<Card title="Contact Details" className="section-card">
  <div className="details-row">
    <div className="detail-box">
      <label>Phone Number</label>
      <span>{employee.phone}</span>
    </div>

    <div className="detail-box">
      <label>Emergency Mobile</label>
      <span>{employee.emergency_mobile}</span>
    </div>
  </div>
</Card>


{/* FAMILY DETAILS */}
<Card title="Family Details" className="section-card">
  {employee.family_members && employee.family_members.length > 0 ? (
    employee.family_members.map((fm: any, index: number) => (
      <div key={index} style={{ marginBottom: 16 }}>
        <div className="details-row">
          <div className="detail-box">
            <label>Relation</label>
            <span>{relationMap[fm.relation_id] || "-"}</span>

          </div>

          <div className="detail-box">
            <label>Name</label>
            <span>{fm.first_name} {fm.last_name}</span>
          </div>

          <div className="detail-box">
            <label>Date of Birth</label>
            <span>{fm.date_of_birth || "-"}</span>
          </div>
        </div>

        <div className="details-row">
          <div className="detail-box">
            <label>Occupation</label>
            <span>{occupationMap[fm.occupation_id] || "-"}</span>

          </div>

          <div className="detail-box">
            <label>Phone</label>
            <span>{fm.phone || "-"}</span>
          </div>

          <div className="detail-box">
            <label>Email</label>
            <span>{fm.email || "-"}</span>
          </div>
        </div>

      

        <div className="details-row">
          <div className="detail-box">
            <label>Bank Account</label>
            <span>{fm.bank_account || "-"}</span>
          </div>

          <div className="detail-box">
            <label>IFSC</label>
            <span>{fm.ifsc_code || "-"}</span>
          </div>

          <div className="detail-box">
            <label>Aadhaar</label>
            <span>{fm.aadhaar || "-"}</span>
          </div>
        </div>
 <div className="details-row">
          <div className="detail-box">
            <label>Present Address</label>
            <span>{fm.present_address || "-"}</span>
          </div>

          <div className="detail-box">
            <label>Permanent Address</label>
            <span>{fm.permanent_address || "-"}</span>
          </div>
        </div>
        {index !== employee.family_members.length - 1 && <Divider />}
      </div>
    ))
  ) : (
    <span>No family details available</span>
  )}
</Card>

        <div className="download-btn-container">
         <Button
  type="primary"
  htmlType="button"
  shape="round"
  icon={<DownloadOutlined />}
  onClick={handleDownload}
>

            Download PDF
          </Button>
        </div>
      </div>

<EmployeeFormModalHorizontal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  employee={rawEmployee}
  onSave={handleUpdateEmployee}
/>

    </div>
  );
};

export default EmployeeDetailsPage;
