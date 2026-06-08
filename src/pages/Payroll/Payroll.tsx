import React, { ReactNode, useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Avatar,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  message,
} from "antd";

import {
  DollarOutlined,
  FileTextOutlined,
  UserOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Sidebar from "../../components/sidebar/Sidebar";
import PayslipPreview from "./PayslipPreview";
import "./Payroll.css";

import { getDepartments , getEmployees , createPayslip , getPayrollForMonth } from "../../services/CandidateService";

const { Title } = Typography;
interface PayrollRecord {
  key: number;
  emp_id: number;
  employee: string;
  designation: string;
  period: string;
  basic: number;
  hra: number;
  gross: number;
  deductions: number;
  net: number;
  attendance: {
    paid_days: number;
    lop_days: number;
  };
  raw: any;
}




const Payroll: React.FC = () => {
  const [data, setData] = useState<PayrollRecord[]>([]);

  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<PayrollRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [form] = Form.useForm();
  const [calculatedNet, setCalculatedNet] = useState(0);

  // ⬇️ NEW: Department State
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [payslipData, setPayslipData] = useState<any>(null);



//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const deptRes = await getDepartments();
//       setDepartments(deptRes.data);

//       const empRes = await getEmployees();
//       setEmployees(empRes.data.filter((emp: any) => emp.is_active)); // only active employees
//     } catch (error) {
//       console.log("❌ Error loading departments or employees", error);
//     }
//   };

//   fetchData();
// }, []);

  // ⬇️ NEW: Fetch departments on page load
  // useEffect(() => {
  //   const fetchDepartments = async () => {
  //     try {
  //       const res = await getDepartments();
  //       setDepartments(res.data);
  //     } catch (error) {
  //       console.error("❌ Failed to load departments", error);
  //     }
  //   };
  //   fetchDepartments();
  // }, []);

const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadAllData = async () => {
    try {
      setLoading(true);

      const [deptRes, empRes, payrollRes] = await Promise.all([
        getDepartments(),
        getEmployees(),
        getPayrollForMonth(3, 6), 
      ]);

      setDepartments(deptRes.data);
      setEmployees(empRes.data.filter((emp: any) => emp.is_active));

      const payrollArray = payrollRes.data.payroll ?? [];

      const mappedData = payrollArray.map((item: any, index: number) => ({
        key: index + 1,
        emp_id: item.employee.id,
employee: `${item.employee.first_name} ${item.employee.last_name}`,
        designation: item.employee.designation_name ?? "-",
        period: `${payrollRes.data.month_id}/${payrollRes.data.year}`,
        basic: item.earnings.basic,
        hra: item.earnings.hra,
        gross: item.earnings.gross_after_lop,
        deductions: item.deductions.total_deductions,
        net: item.net_salary,
        attendance: {
          paid_days: item.attendance.paid_days,
          lop_days: item.attendance.lop_days,
        },
        raw: item,
      }));

      setData(mappedData);
    } catch (err) {
      console.error("Error loading data", err);
      message.error("Failed to load payroll data");
    } finally {
      setLoading(false);
    }
  };

  loadAllData();
}, []);





//   const loadPayroll = async () => {
//     try {
//       const res = await getPayslips();
//       setData(
//         res.data.map((item: any, index: number) => {
//           const emp = employees.find(e => e.id === item.emp_id);
//           const dept = departments.find(d => d.id === item.department_id);

//           return {
//             key: String(index + 1),
//             employee: emp ? `${emp.first_name} ${emp.last_name}` : `ID ${item.emp_id}`,
//             department: dept ? dept.department : `ID ${item.department_id}`,
//             basic: item.basic_salary,
//             hra: item.hra,
//             bonus: item.bonus,
//             pf: item.pf,
//             esi: item.esi,
//             deductions: item.other_deductions,
//             net: item.net_salary,
//           };
//         })
//       );
//     } catch (error) {
//       console.log("❌ Error fetching payroll", error);
//     }
//   };

//   // Only load payroll after employees and departments are loaded
//   if (employees.length && departments.length) {
//     loadPayroll();
//   }
// }, [employees, departments]);


  const onFormValuesChange = (_changed: any, allValues: any) => {
    const net =
      Number(allValues.basic || 0) +
      Number(allValues.hra || 0) +
      Number(allValues.bonus || 0) -
      (Number(allValues.pf || 0) +
        Number(allValues.esi || 0) +
        Number(allValues.deductions || 0));
    setCalculatedNet(net);
  };

// const savePayroll = () => {
//   form.validateFields().then(async (values) => {
//     // 🔹 Calculate NET Salary here
//     const net_salary =
//       Number(values.basic || 0) +
//       Number(values.hra || 0) +
//       Number(values.bonus || 0) -
//       (Number(values.pf || 0) + Number(values.esi || 0) + Number(values.deductions || 0));

//     const payload = {
//       emp_id: values.employee,
//       department_id: values.department_id,
//       basic_salary: Number(values.basic || 0),
//       hra: Number(values.hra || 0),
//       bonus: Number(values.bonus || 0),
//       pf: Number(values.pf || 0),
//       esi: Number(values.esi || 0),
//       other_deductions: Number(values.deductions || 0),
//       net_salary: net_salary, 
//     };

//     try {
//       await createPayslip(payload);
//       message.success("Payroll saved successfully!");

//       // Refresh list
//       const res = await getPayslips();
//  setData(
//   res.data.map((item: any, index: number) => {
//     const emp = employees.find(e => e.id === item.emp_id);
//     const dept = departments.find(d => d.id === item.department_id);

//     return {
//       key: String(index + 1),
//       employee: emp ? `${emp.first_name} ${emp.last_name}` : `ID ${item.emp_id}`,
//       department: dept ? dept.department : `ID ${item.department_id}`,
//       basic: item.basic_salary,
//       hra: item.hra,
//       bonus: item.bonus,
//       pf: item.pf,
//       esi: item.esi,
//       deductions: item.other_deductions,
//       net: item.net_salary,
//     };
//   })
// );


//       setIsAddModalOpen(false);
//       form.resetFields();
//       setCalculatedNet(0);

//     } catch (error) {
//       console.error("❌ Failed to save payroll", error);
//       message.error("Failed to save payroll!");
//     }
//   });
// };


const openPreview = (record: PayrollRecord) => {
  setPayslipData(record.raw); // 👈 already calculated
  setIsPayslipModalOpen(true);
};





  const downloadPDF = async () => {
    const element = document.getElementById("payslip-preview-box");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.width;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    if (viewRecord) pdf.save(`${viewRecord.employee}-Payslip.pdf`);
  };
const columns = [
  {
    title: "Employee",
    dataIndex: "employee",
    render: (name: string, record: PayrollRecord) => (
      <Space>
        <Avatar icon={<UserOutlined />} />
        <div>
          <strong>{name}</strong>
          <div style={{ fontSize: 12 }}>{record.designation}</div>
        </div>
      </Space>
    ),
  },
  { title: "Basic", dataIndex: "basic", render: (v: number) => `₹${v}` },
  { title: "HRA", dataIndex: "hra", render: (v: number) => `₹${v}` },
 { 
  title: "Special Allowance", 
  render: (_: any, record: PayrollRecord) => 
    `₹${record.raw.earnings.special_allowance}` 
},

 {
  title: "Net Salary",
  render: (_: any, record: PayrollRecord) => (
    <p className="salary-normal">₹{record.net}</p>
  ),
},


  {
    title: "Actions",
    render: (_: any, record: PayrollRecord) => (
      <Button
        type="primary"
        onClick={() => openPreview(record)}
      >
        Generate Payslip
      </Button>
    ),
  },
];


  return (
    <div className="hrms-dashboard-container">
      <Sidebar />

      <div className="hrms-dashboard-main">
        <div className="payroll-header">
          <Title level={2}>
            <DollarOutlined /> Payroll Management
          </Title>

          {/* <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
            + Add Payroll
          </Button> */}
        </div>

<Table
  columns={columns}
  dataSource={data}
  loading={loading}
  bordered
  pagination={false}
/>

        <Modal
          title="Add Payroll"
       
        >
          <Form layout="vertical" form={form} onValuesChange={onFormValuesChange}>
            <Row gutter={16}>
            <Col span={12}>
  <Form.Item
    name="employee"
    label="Employee Name"
    rules={[{ required: true, message: "Please select an employee" }]}
  >
    <Select
      placeholder="Select Employee"
      showSearch
      optionFilterProp="label"
      options={employees.map((emp: any) => ({
        value: emp.id,
        label: `${emp.first_name} ${emp.last_name}`,
      }))}
    />
  </Form.Item>
</Col>


              {/* 🔥 Updated Department Select */}
              <Col span={12}>
                <Form.Item
                  name="department_id"
                  label="Department"
                  rules={[{ required: true }]}
                >
                <Select
  placeholder="Select Department"
  showSearch                 // 👈 ENABLE SEARCH
  optionFilterProp="label"   // 👈 SEARCH BY LABEL
  filterOption={(input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
  }
  options={departments
    .filter((d: any) => d.is_active)
    .map((d: any) => ({
      value: d.id,
      label: d.department, 
    }))
  }
/>

                </Form.Item>
              </Col>
            </Row>

<Row gutter={16}>
  <Col span={8}>
    <Form.Item name="basic" label="Basic Salary" rules={[{ required: true }]}>
      <Input
        maxLength={7}
        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
        onChange={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
      />
    </Form.Item>
  </Col>

  <Col span={8}>
    <Form.Item name="hra" label="HRA" rules={[{ required: true }]}>
      <Input
        maxLength={7}
        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
        onChange={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
      />
    </Form.Item>
  </Col>

  <Col span={8}>
    <Form.Item name="bonus" label="Bonus" rules={[{ required: true }]}>
      <Input
        maxLength={7}
        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
        onChange={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
      />
    </Form.Item>
  </Col>
</Row>


<Row gutter={16}>
  <Col span={8}>
    <Form.Item name="pf" label="PF" rules={[{ required: true }]}>
      <Input
        maxLength={7}
        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
        onChange={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
      />
    </Form.Item>
  </Col>

  <Col span={8}>
    <Form.Item name="esi" label="ESI" rules={[{ required: true }]}>
      <Input
        maxLength={7}
        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
        onChange={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
      />
    </Form.Item>
  </Col>

  <Col span={8}>
    <Form.Item name="deductions" label="Other Deductions">
      <Input
        maxLength={7}
        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
        onChange={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
      />
    </Form.Item>
  </Col>
</Row>


            <Form.Item label="Net Salary">
              <InputNumber style={{ width: "100%" }} value={calculatedNet} disabled />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Payslip Preview"
          open={isPayslipModalOpen}
          onCancel={() => setIsPayslipModalOpen(false)}
          width={750}
          footer={[
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={downloadPDF}
            >
              Download PDF
            </Button>,
          ]}
        >
         {payslipData && (
  <PayslipPreview
    record={payslipData}
    onClose={() => setIsPayslipModalOpen(false)}
  />
)}

        </Modal>
      </div>
    </div>
  );
};

export default Payroll;
