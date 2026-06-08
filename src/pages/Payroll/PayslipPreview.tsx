import React from "react";
import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import "./PayslipPreview.css";
import logo from "../../assets/Logo/logo.jpg";
import autoTable from "jspdf-autotable";




interface Props {
  record: any;
  onClose?: () => void;
}

const PayslipPreview: React.FC<Props> = ({ record, onClose }) => {
  if (!record) {
    return (
      <div className="payslip-overlay">
        <div className="payslip-modal-wrapper">
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
          <p>No payslip data available.</p>
        </div>
      </div>
    );
  }
  const getMonthName = (period: any) => {
    if (!period) return "-";

    let month: number | string;
    let year: number | string;

    if (typeof period === "string") {
      const parts = period.split("/");
      if (parts.length !== 2) return period;
      month = parts[0];
      year = parts[1];
    } else if (typeof period === "object") {
      month = period.month_id;
      year = period.year;
    } else {
      return "-";
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthIndex = Number(month) - 1;

    return monthNames[monthIndex]
      ? `${monthNames[monthIndex]} ${year}`
      : `${month}/${year}`;
  };



const downloadPDF = () => {
  const pdf = new jsPDF("p", "mm", "a4");

  let y = 15;

/* ================= HEADER ================= */
const pageWidth = pdf.internal.pageSize.getWidth();
const marginX = 25;

/* LOGO (LEFT) */
const logoWidth = 50;
const logoHeight = 50;
const logoX = marginX + 15; 
const logoY = 5; 

pdf.addImage(
  logo,
  "JPEG",
  logoX,
  logoY,
  logoWidth,
  logoHeight
);



/* COMPANY NAME + ADDRESS (RIGHT OF LOGO) */
const textX = marginX + logoWidth + 4;

pdf.setFont("helvetica", "bold");
pdf.setFontSize(14);
pdf.text(
  "RM1 Coders Hub Software Solutions",
  textX,
  y + 8
);

pdf.setFont("helvetica", "normal");
pdf.setFontSize(9);
pdf.text(
  "Vasavi Sky City, Office No:2, 8th Floor\nTelecom Nagar, Gachibowli, Hyderabad - 500032\nEmail: info@rm1codershub.com",
  textX,
  y + 14,
  {
    lineHeightFactor: 1.4 
  }
);

/* SPACE AFTER HEADER */
y += logoHeight + -10;

/* ================= EMPLOYEE DETAILS (LEFT) ================= */

pdf.setFontSize(9);
pdf.setFont("helvetica", "bold");

const leftX = 15;
let infoY = y;

const labelGap = 32;
const valueGap = 35;

const drawRow = (label: string, value: string) => {
  pdf.text(label, leftX, infoY);
  pdf.setFont("helvetica", "normal");
  pdf.text(value || "-", leftX + valueGap, infoY);
  pdf.setFont("helvetica", "bold");
  infoY += 6;
};

drawRow("Employee Name:", `${record.employee?.first_name ?? ""} ${record.employee?.last_name ?? ""}`);
drawRow("Designation:", record.employee?.designation_name);
drawRow("Date of Joining:", record.employee?.join_date);
drawRow("Work Location:", record.employee?.work_location);
drawRow("Bank Name:", record.employee?.bank_name);
drawRow("Bank Account No:", record.employee?.bank_account_no);
drawRow("PAN Number:", record.employee?.pan);
drawRow("UAN Number:", record.employee?.uan);
drawRow("PF Account No:", record.employee?.pf_acc_num);

/* ================= NET PAY CARD (RIGHT) ================= */

const cardX = 125;
const cardY = y - 4;
const cardWidth = 65;
const cardHeight = 45;

// Card background
pdf.setFillColor(230, 255, 230);
pdf.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, "F");

// Blue left border
pdf.setDrawColor(0, 102, 204);
pdf.setLineWidth(1);
pdf.line(cardX, cardY, cardX, cardY + cardHeight);

// Net Pay text
pdf.setFont("helvetica", "bold");
pdf.setFontSize(10);
pdf.text("Employee Net Pay", cardX + cardWidth / 2, cardY + 10, {
  align: "center",
});

pdf.setFontSize(16);
pdf.text(
  `${Number(record.net_salary ?? 0).toLocaleString("en-IN")}`,
  cardX + cardWidth / 2,
  cardY + 22,
  { align: "center" }
);

pdf.setFontSize(9);
pdf.setFont("helvetica", "normal");
pdf.text(
  `Paid Days: ${record.attendance?.paid_days ?? 0} | LOP Days: ${record.attendance?.lop_days ?? 0}`,
  cardX + cardWidth / 2,
  cardY + 35,
  { align: "center" }
);

// Move Y below section
y = Math.max(infoY, cardY + cardHeight) + 10;


  /* ================= EARNINGS ================= */
  autoTable(pdf, {
    startY: y,
    theme: "grid",
    head: [["EARNINGS", "AMOUNT"]],
    body: [
      ["Basic", record.earnings?.basic ?? 0],
      ["HRA", record.earnings?.hra ?? 0],
      ["Medical Allowance", record.earnings?.medical_allowance ?? 0],
      ["Special Allowance", record.earnings?.special_allowance ?? 0],
      ["Arrears", record.earnings?.arrears ?? 0],
      ["Gross After LOP", record.earnings?.gross_after_lop ?? 0],
    ],
 styles: {
    fontSize: 9,
    textColor: [0, 0, 0], // ✅ body text BLACK
  },
  headStyles: {
    fillColor: [240, 240, 240],
    textColor: [0, 0, 0], // ✅ header BLACK
    fontStyle: "bold",
  },
  });

  y = (pdf as any).lastAutoTable.finalY + 6;

  /* ================= DEDUCTIONS ================= */
  autoTable(pdf, {
    startY: y,
    theme: "grid",
    head: [["DEDUCTIONS", "AMOUNT"]],
    body: [
      ["PF", record.deductions?.pf ?? 0],
      ["ESIC", record.deductions?.esic ?? 0],
      ["PT", record.deductions?.pt ?? 0],
      ["TDS", record.deductions?.tds ?? 0],
      ["Other Deductions", record.deductions?.other_deductions ?? 0],
      ["Total Deductions", record.deductions?.total_deductions ?? 0],
    ],
  styles: {
    fontSize: 9,
    textColor: [0, 0, 0], // ✅ body text BLACK
  },
  headStyles: {
    fillColor: [240, 240, 240],
    textColor: [0, 0, 0], // ✅ header BLACK
    fontStyle: "bold",
  },
  });

  /* ================= FOOTER ================= */
  pdf.setFontSize(9);
  pdf.text(
    "This is a system generated payslip",
    105,
    290,
    { align: "center" }
  );

  const employeeName =
    `${record.employee?.first_name ?? ""} ${record.employee?.last_name ?? ""}`.trim() || "Employee";

  const periodName = getMonthName(record.period).replace(" ", "-");

  pdf.save(`Payslip-${employeeName}-${periodName}.pdf`);
};


  return (
    <div className="payslip-overlay">
      <div className="payslip-modal-wrapper">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="payslip-modal">
          <div id="payslip-print" className="payslip-container">
            {/* HEADER */}
            <div className="payslip-header">
              <img src={logo} alt="Logo" className="payslip-logo" />
              <div className="header-center">
                <h2 className="company-name">
                  RM1 Coders Hub Software Solutions
                </h2>
                <p className="company-address">
                  Vasavi Sky City, Office No:2, 8th Floor,
                  <br />
                  Telecom Nagar, Gachibowli, Hyderabad - 500032,
                  <br />
                  Email: info@rm1codershub.com
                </p>
              </div>
            </div>

            <h3 className="payslip-title">
              Payslip for the month of {getMonthName(record.period)}
            </h3>


            {/* EMPLOYEE INFO + NET PAY */}
            <div className="employee-summary-row">
              <div className="employee-info-column compact">
                <p>
                  <strong>Employee Name:</strong>{" "}
                  {`${record.employee?.first_name ?? ""} ${record.employee?.last_name ?? ""}`}

                </p>
                <p>
                  <strong>Designation:</strong>{" "}
                  {record.employee?.designation_name ?? "-"}
                </p>
                <p>
                  <strong>Date of Joining:</strong> {record.employee?.join_date ?? "-"}
                </p>
                <p>
                  <strong>Work Location:</strong>{" "}
                  {record.employee?.work_location ?? "-"}
                </p>

                <p>
                  <strong>Bank Name:</strong>{" "}
                  {record.employee?.bank_name ?? "-"}
                </p>
                <p>
                  <strong>Bank Account No:</strong>{" "}
                  {record.employee?.bank_account_no ?? "-"}
                </p>

                <p>
                  <strong>Pan Number:</strong>{" "}
                  {record.employee?.pan ?? "-"}
                </p>

                <p>
                  <strong>UAN Number:</strong>{" "}
                  {record.employee?.uan ?? "-"}
                </p>
                <p>
                  <strong>PF Account No:</strong>{" "}
                  {record.employee?.pf_acc_num ?? "-"}
                </p>

              </div>


              <div className="netpay-box">
                <p className="netpay-label">Employee Net Pay</p>
                <p className="netpay-amount">₹{record.net_salary ?? 0}</p>
                <p className="netpay-footer">
                  Paid Days: {record.attendance?.paid_days ?? 0} | LOP Days:{" "}
                  {record.attendance?.lop_days ?? 0}
                </p>
              </div>
            </div>

            {/* EARNINGS & DEDUCTIONS TABLE */}
            <div className="tables-wrapper">
              <table className="payslip-table">
                <thead>
                  <tr>
                    <th>EARNINGS</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic</td>
                    <td>₹{record.earnings?.basic ?? 0}</td>
                  </tr>
                  <tr>
                    <td>HRA</td>
                    <td>₹{record.earnings?.hra ?? 0}</td>
                  </tr>
                  <tr>
                    <td>Medical Allowance</td>
                    <td>₹{record.earnings?.medical_allowance ?? 0}</td>
                  </tr>
                  <tr>
                    <td>Special Allowance</td>
                    <td>₹{record.earnings?.special_allowance ?? 0}</td>
                  </tr>
                  <tr>
                    <td>Arrears</td>
                    <td>₹{record.earnings?.arrears ?? 0}</td>
                  </tr>
                  <tr className="grand-row">
                    <td>
                      <strong>Gross After LOP</strong>
                    </td>
                    <td>
                      <strong>₹{record.earnings?.gross_after_lop ?? 0}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="payslip-table">
                <thead>
                  <tr>
                    <th>DEDUCTIONS</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PF</td>
                    <td>₹{record.deductions?.pf ?? 0}</td>
                  </tr>
                  <tr>
                    <td>ESIC</td>
                    <td>₹{record.deductions?.esic ?? 0}</td>
                  </tr>
                  <tr>
                    <td>PT</td>
                    <td>₹{record.deductions?.pt ?? 0}</td>
                  </tr>
                  <tr>
                    <td>TDS</td>
                    <td>₹{record.deductions?.tds ?? 0}</td>
                  </tr>
                  <tr>
                    <td>Other Deductions</td>
                    <td>₹{record.deductions?.other_deductions ?? 0}</td>
                  </tr>
                  <tr className="grand-row">
                    <td>
                      <strong>Total Deductions</strong>
                    </td>
                    <td>
                      <strong>₹{record.deductions?.total_deductions ?? 0}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="footer-note">This is a system generated payslip</p>
          </div>

          <div className="pdf-download-bottom">
            <button className="pdf-btn" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipPreview;
