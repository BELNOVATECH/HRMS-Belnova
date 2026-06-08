import React from "react";
import "./Proofofinvestment.css";

const ProofOfInvestment: React.FC = () => {
  return (
    <div className="poi-container">
      {/* Header */}
      <div className="poi-header">
        <div>
          <h2>Proof of Investment</h2>
          <p className="poi-subtext">
            POI Status 2025–2026 : <span className="status-open">OPEN</span>
          </p>
        </div>
        <div className="poi-banner">
          POI window is open till <b>09 Feb 2026</b>
        </div>
      </div>

      {/* Info Bar */}
      {/* <div className="poi-info">
        You have currently selected <b>Old Regime</b>. No further changes can
        be made on regime selection.
      </div> */}

      {/* Content */}
      <div className="poi-content">
        {/* Left Menu */}
        <div className="poi-left">
          <h4>POI COMPONENTS</h4>
          <ul>
            <li className="active">Section 80C</li>
            <li>Other Chapter VI-A Deductions</li>
            <li>House Rent Allowance</li>
            <li>Medical (Sec 80D)</li>
            <li>Income/Loss from House Property</li>
            <li>TCS/TDS Deduction</li>
          </ul>
        </div>

        {/* Right Table */}
        <div className="poi-right">
          <table>
            <thead>
              <tr>
                <th>Particulars</th>
                <th>Attachments</th>
                <th>Max Limit</th>
                <th>Declared Amount</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {/* Section 80C */}
              <tr className="section-row">
                <td colSpan={5}>Section 80C</td>
              </tr>

              <tr>
                <td>80CCD(1) Employee Contribution to NPS</td>
                <td className="center red">0</td>
                <td>1,50,000.00</td>
                <td>1,50,000.00</td>
                <td className="link">→</td>
              </tr>

              <tr>
                <td>80C Public Provident Fund</td>
                <td className="center red">0</td>
                <td>1,50,000.00</td>
                <td>60,000.00</td>
                <td className="link">→</td>
              </tr>

              <tr>
                <td>80C Investment of Housing Loan Principal</td>
                <td className="center red">0</td>
                <td>1,50,000.00</td>
                <td>1,25,127.00</td>
                <td className="link">→</td>
              </tr>

              {/* Other Deductions */}
              <tr className="section-row">
                <td colSpan={5}>Other Chapter VI-A Deductions</td>
              </tr>

              <tr>
                <td>80EEA Interest on Housing Loan</td>
                <td className="center red">0</td>
                <td>1,50,000.00</td>
                <td>1,50,000.00</td>
                <td className="link">→</td>
              </tr>

              {/* HRA */}
              <tr className="section-row">
                <td colSpan={5}>House Rent Allowance</td>
              </tr>

              <tr>
                <td>House Rent Paid</td>
                <td className="center red">0</td>
                <td>0.00</td>
                <td>5,40,000.00</td>
                <td className="link">→</td>
              </tr>

              {/* Medical */}
              <tr className="section-row">
                <td colSpan={5}>Medical (Sec 80D)</td>
              </tr>

              <tr>
                <td>80D Medical Insurance Premium</td>
                <td className="center red">0</td>
                <td>25,000.00</td>
                <td>25,000.00</td>
                <td className="link">→</td>
              </tr>
            </tbody>
          </table>

          <div className="poi-footer">
            <button className="submit-btn">Submit POI</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofOfInvestment;
