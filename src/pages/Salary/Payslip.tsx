import React, { useEffect, useRef, useState } from "react";
import "./Payslip.css";
import { Select, Button, Card, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getPayslipByEmpId } from "../../services/CandidateService";
import { Spin } from "antd";
import logo from "../../assets/Logo/logo.jpg";

const YEAR_MAP: Record<string, number> = {
  "2026": 7,
  "2025": 6,
};


const { Option } = Select;

interface PayrollRecord {
  employee: {
    first_name: string;
    last_name: string;
    emp_code: string | null;
    designation_name: string;
    join_date: string;
    bank_account_no: string | null;
    work_location: string | null
    bank_name: string | null;
    uan: string | null;
    pan: string | null;
    pf_acc_num: string | null;

  };

  period: {
    month_id: number;
    year_id: number;
    year: string;
  };

  attendance: {
    total_days: number;
    paid_days: number;
    lop_days: number;
  };
  earnings: {
    basic: number;
    hra: number;
    medical_allowance: number;
    special_allowance: number;
    arrears: number;
    gross_after_lop: number;
  };
  deductions: {
    pf: number;
    esic: number;
    pt: number;
    tds: number;
    other_deductions: number;
    total_deductions: number;
  };
  net_salary: number;
}

const Payslip: React.FC = () => {
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState("2025");

  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<PayrollRecord | null>(null);




  const monthName = (m: string) => {
    const names = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return names[Number(m) - 1] || "";
  };

  const MONTHS = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];


  const periodLabel = `${monthName(month)} ${year}`;
  const noDataMessage = `Payslip not available for ${periodLabel}.`;

  const numberToWords = (num: number) => {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six",
      "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
      "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen",
    ];

    const b = [
      "", "", "Twenty", "Thirty", "Forty",
      "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
    ];

    const inWords = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + inWords(n % 100) : "")
        );
      if (n < 100000)
        return (
          inWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + inWords(n % 1000) : "")
        );
      if (n < 10000000)
        return (
          inWords(Math.floor(n / 100000)) +
          " Lakh" +
          (n % 100000 ? " " + inWords(n % 100000) : "")
        );
      return (
        inWords(Math.floor(n / 10000000)) +
        " Crore" +
        (n % 10000000 ? " " + inWords(n % 10000000) : "")
      );
    };

    return inWords(Math.floor(num));
  };




  const payslipRef = useRef<HTMLDivElement>(null);

  const [empId, setEmpId] = useState<number | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("hrms-employee-id");
    if (id) {
      setEmpId(Number(id));
    } else {
      message.error("User not logged in");
    }
  }, []);


  // ---------------- FETCH PAYROLL ----------------
  useEffect(() => {
    if (empId) {
      fetchPayslip();
    }
  }, [empId, month, year]);



  const fetchPayslip = async () => {
    if (!empId) return;

    try {
      setLoading(true);

      const yearId = YEAR_MAP[year];
      if (!yearId) {
        message.error("Invalid year selected");
        return;
      }

      const res = await getPayslipByEmpId(
        empId,
        Number(month),
        yearId
      );
      console.log("Fetching payslip for:", {
        empId,
        month,
        year,
        yearId,
      });


      setRecord(res.data);
    } catch (err: any) {
      console.error("Payslip error:", err);
      message.error(err?.response?.data?.detail || "Payslip not found");
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };




  // ---------------- DOWNLOAD PDF ----------------
  const handleDownload = async () => {
    if (!payslipRef.current) return;

    // clone UI
    const cloned = payslipRef.current.cloneNode(true) as HTMLElement;

    // 👉 FORCE DESKTOP MODE FOR PDF
    cloned.classList.add("pdf-mode");

    /* ================= TITLE ================= */
    const title = document.createElement("div");
    title.innerHTML = `Payslip for the month of <strong>${periodLabel}</strong>`;
    title.style.textAlign = "center";
    title.style.fontSize = "16px";
    title.style.fontWeight = "600";
    title.style.margin = "12px 0 16px";

    /* ================= HEADER ================= */
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "center";
    header.style.alignItems = "center";
    header.style.gap = "16px";
    header.style.borderBottom = "1px solid #eee";
    header.style.paddingBottom = "10px";
    header.style.marginBottom = "12px";

    header.innerHTML = `
    <img src="${logo}" style="height:160px; margin-top:20px" />
    <div style="margin-left:-70px">
      <h2 style="margin:0; font-size:20px;">RM1 Coders Hub Software Solutions</h2>
      <p style="margin:4px 0 0; font-size:13px; color:#444; line-height:1.4;">
        Vasavi Sky City, Office No:2, 8th Floor,<br/>
        Telecom Nagar, Gachibowli, Hyderabad - 500032,<br/>
        Email: info@rm1codershub.com
      </p>
    </div>
  `;

    // add header + title
    cloned.prepend(title);
    cloned.prepend(header);

    // remove UI-only parts
    cloned.querySelector(".payslip-topbar")?.remove();
    cloned.querySelector(".payslip-period")?.remove();

    // 🔒 FORCE WIDTH
    const PDF_WIDTH = 900;
    cloned.style.width = PDF_WIDTH + "px";
    cloned.style.maxWidth = PDF_WIDTH + "px";
    cloned.style.backgroundColor = "#fff";

    // off-screen wrapper
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-10000px";
    wrapper.style.top = "0";
    wrapper.style.width = PDF_WIDTH + "px";
    wrapper.appendChild(cloned);
    document.body.appendChild(wrapper);

    // capture
    const canvas = await html2canvas(cloned, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    document.body.removeChild(wrapper);

    // create pdf
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(
      `Payslip-${record?.employee?.first_name}-${periodLabel}.pdf`
    );
  };




  // helper
  const imgDataFrom = (canvas: HTMLCanvasElement) =>
    canvas.toDataURL("image/png");




  // ---------------- HELPERS ----------------
  const money = (v?: number) =>
    `₹${(v ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;


  return (
    <div className="payslip-page" ref={payslipRef}>
      <div className="payslip-period">
        Payslip for the month of <strong>{periodLabel}</strong>
      </div>

      {/* TOP BAR */}
      <div className="payslip-topbar">
        <div className="tabs">

        </div>
        {/* {!hideForDownload && ( */}
        <div className="actions">
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            onClick={handleDownload}
            disabled={!record}
          >
            Download
          </Button>
          <Select value={month} onChange={setMonth} className="month-select">
            {MONTHS.map(m => (
              <Option key={m.value} value={m.value}>
                {m.label}
              </Option>
            ))}
          </Select>


          <Select value={year} onChange={setYear} className="month-select">
            <Option value="2025">2025</Option>
            <Option value="2026">2026</Option>
          </Select>
        </div>
        {/* )} */}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          <Spin size="large" />
        </div>
      ) : !record ? (
        <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
          <h3>No Payslip Found</h3>
          <p>{noDataMessage}</p>
        </div>
      ) : (

        <>
          {/* MAIN CONTENT */}
          <div className="payslip-content">
            {/* EARNINGS */}
            <Card className="box">
              {/* <h3 className="box-title">Earnings</h3> */}
              <div className="box-header">
                <span>Earnings</span>
                <span>Amount (₹)</span>
              </div>

              <div className="row">
                <span>Basic</span>
                <span>{money(record.earnings.basic)}</span>
              </div>
              <div className="row">
                <span>HRA</span>
                <span>{money(record.earnings.hra)}</span>
              </div>
              <div className="row">
                <span>Medical Allowance</span>
                <span>{money(record.earnings.medical_allowance)}</span>
              </div>
              <div className="row">
                <span>Special Allowance</span>
                <span>{money(record.earnings.special_allowance)}</span>
              </div>
              <div className="row">
                <span>Arrears</span>
                <span>{money(record.earnings.arrears)}</span>
              </div>

              <div className="row total">
                <span>Gross After LOP</span>
                <span>{money(record.earnings.gross_after_lop)}</span>
              </div>
            </Card>

            {/* DEDUCTIONS */}
            <Card className="box">
              {/* <h3 className="box-title">Deductions</h3> */}
              <div className="box-header">
                <span>Deductions</span>
                <span>Amount (₹)</span>
              </div>

              <div className="row">
                <span>PF</span>
                <span>{money(record.deductions.pf)}</span>
              </div>
              <div className="row">
                <span>ESIC</span>
                <span>{money(record.deductions.esic)}</span>
              </div>
              <div className="row">
                <span>PT</span>
                <span>{money(record.deductions.pt)}</span>
              </div>
              <div className="row">
                <span>TDS</span>
                <span>{money(record.deductions.tds)}</span>
              </div>
              <div className="row">
                <span>Other</span>
                <span>{money(record.deductions.other_deductions)}</span>
              </div>

              <div className="row total">
                <span>Total Deductions</span>
                <span>{money(record.deductions.total_deductions)}</span>
              </div>
            </Card>

            {/* EMPLOYEE DETAILS */}
            <Card className="box employee-box employee-details">
              <div className="emp-header">
                <h3>Employee details</h3>
              </div>

              <div className="emp-grid">
                <div>
                  <label>Name</label>
                  <p>
                    {record.employee.first_name} {record.employee.last_name}
                  </p>
                </div>

                <div>
                  <label>Designation</label>
                  <p>{record.employee.designation_name}</p>
                </div>

                <div>
                  <label>Work Location</label>
                  <p>{record.employee.work_location ?? "-"}</p>
                </div>

                <div>
                  <label>Joining Date</label>
                  <p>{record.employee.join_date}</p>
                </div>

                <div>
                  <label>Bank Name</label>
                  <p>{record.employee.bank_name ?? "-"}</p>
                </div>

                <div>
                  <label>Bank Account No</label>
                  <p>{record.employee.bank_account_no ?? "-"}</p>
                </div>

                <div>
                  <label>PAN</label>
                  <p>{record.employee.pan ?? "-"}</p>
                </div>

                <div>
                  <label>UAN</label>
                  <p>{record.employee.uan ?? "-"}</p>
                </div>
                <div>
                  <label>PF Account No</label>
                  <p>{record.employee.pf_acc_num ?? "-"}</p>
                </div>

                <div>
                  <label>Paid Days</label>
                  <p>{record.attendance.paid_days}</p>
                </div>

                <div>
                  <label>LOP Days</label>
                  <p>{record.attendance.lop_days}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* NET PAY */}
          <Card className="netpay-card">
            <h3>Net Pay</h3>
            <div className="netpay-amount">
              {money(record.net_salary)}
            </div>
            <div className="netpay-words">
              ({numberToWords(record.net_salary)} Rupees Only)
            </div>

          </Card>
        </>
      )}
    </div>
  );
};

export default Payslip;
