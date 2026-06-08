import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Select,
  Tag,
  Modal,
  Input,
  Row,
  Col,
  Radio,
  Form,
  message
} from "antd";
import {
  CalculatorOutlined,
  HomeOutlined,
  HeartOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import "./ITDeclaration.css";

const { Title, Text } = Typography;

type ScreenType = "declaration" | "planner" | "grid";



const ITDeclaration: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>("declaration");
  const [open80C, setOpen80C] = useState(false);
  const [openOtherDeduction, setOpenOtherDeduction] = useState(false);
  const [openHRA, setOpenHRA] = useState(false);
  const [open80D, setOpen80D] = useState(false);
  const [openHouseProperty, setOpenHouseProperty] = useState(false);
  const [openTcsTds, setOpenTcsTds] = useState(false);
  const [openOtherIncome, setOpenOtherIncome] = useState(false);

  const [form80C] = Form.useForm();
  const [formOtherDeduction] = Form.useForm();
  const [formHRA] = Form.useForm();
  const [form80D] = Form.useForm();
  const [formHouseProperty] = Form.useForm();
  const [formOtherIncome] = Form.useForm();
  const [formTcsTds] = Form.useForm();


  const [sec80CData, setSec80CData] = useState<Record<string, number>>({});
  const [sec80CTotal, setSec80CTotal] = useState(0);
  const [sec80DData, setSec80DData] = useState<Record<string, number>>({});
  const [sec80DTotal, setSec80DTotal] = useState(0);
  const [otherChapterData, setOtherChapterData] = useState<Record<string, number>>({});
  const [otherChapterTotal, setOtherChapterTotal] = useState(0);
  const [hraData, setHraData] = useState<any>({});
  const [hraTotal, setHraTotal] = useState(0);
  const [housePropertyData, setHousePropertyData] = useState<Record<string, number>>({});
  const [housePropertyTotal, setHousePropertyTotal] = useState(0);
  const [otherIncomeData, setOtherIncomeData] = useState<Record<string, number>>({});
  const [otherIncomeTotal, setOtherIncomeTotal] = useState(0);

  const [tcsTdsData, setTcsTdsData] = useState<Record<string, number>>({});
  const [tcsTdsTotal, setTcsTdsTotal] = useState(0);








  return (
    <div className="it-declaration-page">
      <div className="it-container">

        {/* ================= HEADER ================= */}
        <div className="it-header">
          <Title level={3} className="it-title">IT Declaration</Title>

          <div className="it-header-actions">
            {screen === "declaration" && (
              <Button type="primary" onClick={() => setScreen("planner")}>
                My Tax Planner
              </Button>
            )}

            <Select
              defaultValue="2025-2026"
              style={{ width: 140 }}
              options={[
                { value: "2025-2026", label: "2025 - 2026" },
              ]}
            />
          </div>
        </div>

        {/* ================= DECLARATION STATUS ================= */}
        {screen === "declaration" && (
          <>

            <Card className="it-status-card">
              <Text strong>Declaration Status :</Text>
              <Tag color="red" className="it-tag">Locked</Tag>
            </Card>

            {/* ================= STATIC DECLARATION VIEW ================= */}
            <Card style={{ marginTop: 16 }}>
              <Title level={5}>Apr 2025</Title>

              {/* Section 80C */}
              <Card size="small" style={{ marginBottom: 12 }}>
                <Row justify="space-between">
                  <Text strong>Section 80C (max limit 1.5 lakh)</Text>
                  <Text>
                    Declared: ₹{sec80CTotal.toLocaleString()} / 150000
                  </Text>
                </Row>

                {Object.entries(sec80CData).map(([label, amount]) =>
                  amount > 0 ? (
                    <Row justify="space-between" key={label}>
                      <Text>{label}</Text>
                      <Text>₹{amount.toLocaleString()}</Text>
                    </Row>
                  ) : null
                )}

                {sec80CTotal === 0 && (
                  <Text type="secondary">No declaration added</Text>
                )}
              </Card>


              {/* Other Chapter VI-A */}
              <Card size="small" style={{ marginBottom: 12 }}>
                <Row justify="space-between">
                  <Text strong>Other Chapter VI-A Deductions</Text>
                  <Text type="secondary">
                    Declared amount ₹ {otherChapterTotal.toLocaleString()}
                  </Text>
                </Row>

                {Object.entries(otherChapterData).map(([label, amount]) =>
                  amount > 0 ? (
                    <Row justify="space-between" key={label}>
                      <Text>{label}</Text>
                      <Text>₹{amount.toLocaleString()}</Text>
                    </Row>
                  ) : null
                )}

                {otherChapterTotal === 0 && (
                  <Text type="secondary">No declaration added</Text>
                )}
              </Card>


              {/* HRA */}
              <Card size="small" style={{ marginBottom: 12 }}>
                <Row justify="space-between">
                  <Text strong>House Rent Allowance</Text>
                  <Text type="secondary">
                    Declared amount ₹ {hraTotal.toLocaleString()}
                  </Text>
                </Row>

                {hraTotal > 0 && (
                  <>
                    <Row justify="space-between">
                      <Text>
                        From {hraData.fromMonth} – {hraData.toMonth}
                      </Text>
                      <Text>₹{hraTotal.toLocaleString()}</Text>
                    </Row>

                    <Text type="secondary">
                      Address: {hraData.houseNo}, {hraData.street}, {hraData.city} – {hraData.pincode}
                    </Text>
                  </>
                )}

                {hraTotal === 0 && (
                  <Text type="secondary">No declaration added</Text>
                )}
              </Card>


              {/* Medical 80D */}
              <Card size="small" style={{ marginBottom: 12 }}>
                <Row justify="space-between">
                  <Text strong>Medical (Sec 80D)</Text>
                  <Text type="secondary">
                    Declared amount ₹ {sec80DTotal.toLocaleString()}
                  </Text>
                </Row>

                {Object.entries(sec80DData).map(([label, amount]) =>
                  amount > 0 ? (
                    <Row justify="space-between" key={label}>
                      <Text>{label}</Text>
                      <Text>₹{amount.toLocaleString()}</Text>
                    </Row>
                  ) : null
                )}
              </Card>


              {/* Income / Loss */}
              <Card size="small">
                <Row justify="space-between">
                  <Text strong>Income / Loss from House Property</Text>
                  <Text type="secondary">
                    Declared amount ₹ {housePropertyTotal.toLocaleString()}
                  </Text>
                </Row>

                {Object.entries(housePropertyData).map(([label, amount]) =>
                  amount !== 0 ? (
                    <Row justify="space-between" key={label}>
                      <Text>{label}</Text>
                      <Text>
                        ₹{amount.toLocaleString()}
                      </Text>
                    </Row>
                  ) : null
                )}

                {housePropertyTotal === 0 && (
                  <Text type="secondary">No declaration added</Text>
                )}
              </Card>


              {/* Other Income */}
              <Card size="small" style={{ marginTop: 12 }}>
                <Row justify="space-between">
                  <Text strong>Other Income</Text>
                  <Text type="secondary">
                    Declared amount ₹ {otherIncomeTotal.toLocaleString()}
                  </Text>
                </Row>

                {Object.entries(otherIncomeData).map(([key, amount]) =>
                  amount > 0 ? (
                    <Row justify="space-between" key={key}>
                      <Text>{key.replace("Amount", "")}</Text>
                      <Text>₹{amount.toLocaleString()}</Text>
                    </Row>
                  ) : null
                )}

                {otherIncomeTotal === 0 && (
                  <Text type="secondary">No declaration added</Text>
                )}
              </Card>


              {/* TCS / TDS Deduction */}
              <Card size="small" style={{ marginTop: 12 }}>
                <Row justify="space-between">
                  <Text strong>TCS / TDS Deduction</Text>
                  <Text type="secondary">
                    Declared amount ₹ {tcsTdsTotal.toLocaleString()}
                  </Text>
                </Row>

                {Object.entries(tcsTdsData).map(([label, amount]) =>
                  amount > 0 ? (
                    <Row justify="space-between" key={label}>
                      <Text>{label}</Text>
                      <Text>₹{amount.toLocaleString()}</Text>
                    </Row>
                  ) : null
                )}

                {tcsTdsTotal === 0 && (
                  <Text type="secondary">No declaration added</Text>
                )}
              </Card>

            </Card>
          </>
        )}


        {/* ================= CREATE PLAN ================= */}
        {screen === "planner" && (
          <Card className="planner-create-card">
            <Title level={4}>Create Your Tax Plan</Title>
            <Text type="secondary">
              Please create a tax plan to calculate your taxes.
            </Text>
            <br /><br />
            <Button type="primary" size="large" onClick={() => setScreen("grid")}>
              Create Plan
            </Button>
          </Card>
        )}

        {screen === "grid" && (
          <>
            {/* ===== GRID HEADER WITH BACK BUTTON ===== */}
            <div className="planner-grid-header">
              <Button type="link" onClick={() => setScreen("declaration")}>
                ← Back to IT Declaration
              </Button>
            </div>

            <div className="planner-grid">
              <Card
                className="planner-box"
                extra={
                  <Button type="link" size="small" onClick={() => setOpen80C(true)}>
                    Edit
                  </Button>
                }
              >
                <Text strong>Sec 80C</Text>
                <p> <Text>
                  Declared: ₹{sec80CTotal.toLocaleString()} / 0
                </Text></p>
              </Card>

              <Card
                className="planner-box"
                extra={
                  <Button type="link" size="small" onClick={() => setOpenOtherDeduction(true)}>
                    Edit
                  </Button>
                }
              >
                <Text strong>Other Deductions</Text>
                <p><Text>Declared: ₹{otherChapterTotal.toLocaleString()}</Text></p>
              </Card>

              <Card
                className="planner-box"
                extra={<Button type="link" onClick={() => setOpenHRA(true)}>Edit</Button>}
              >
                <Text strong>House Rent Allowance</Text>
                <p><Text>Declared: ₹{hraTotal.toLocaleString()}</Text></p>
              </Card>

              <Card
                className="planner-box"
                extra={<Button type="link" size="small" onClick={() => setOpen80D(true)}>Edit</Button>}
              >
                <Text strong>Medical (80D)</Text>
                <p><Text>Declared: ₹{sec80DTotal.toLocaleString()}</Text></p>
              </Card>

              <Card
                className="planner-box"
                extra={<Button type="link" size="small" onClick={() => setOpenHouseProperty(true)}>Edit</Button>}
              >
                <Text strong>Income / Loss</Text>
                <p><Text>Declared: ₹{housePropertyTotal.toLocaleString()}</Text></p>
              </Card>

              <Card
                className="planner-box dashed"
                extra={<Button type="link" size="small" onClick={() => setOpenOtherIncome(true)}>Edit</Button>}
              >
                <Text strong>Other Income</Text>
                <p><Text>Declared: ₹{otherIncomeTotal.toLocaleString()}</Text></p>
              </Card>


              <Card
                className="planner-box dashed"
                extra={<Button type="link" size="small" onClick={() => setOpenTcsTds(true)}>Edit</Button>}
              >
                <Text strong>TCS / TDS Deduction</Text>
                <p><Text>Declared: ₹{tcsTdsTotal.toLocaleString()}</Text></p>
              </Card>

            </div>
          </>
        )}



        <Modal
          title="Sec 80C"
          open={open80C}
          onCancel={() => setOpen80C(false)}
          width={900}
          footer={[
            <Button
              key="clear"
              onClick={() => form80C.resetFields()}
            >
              Clear Form
            </Button>,
            <Button
              key="update"
              type="primary"
              onClick={() => {
                const values = form80C.getFieldsValue();

                const parsedValues: Record<string, number> = {};
                let total = 0;

                Object.entries(values).forEach(([key, value]) => {
                  const amount = Number(value) || 0;
                  parsedValues[key] = amount;
                  total += amount;
                });

                setSec80CData(parsedValues);
                setSec80CTotal(total);

                message.success("80C updated successfully");
                setOpen80C(false);
              }}

            >
              Update
            </Button>,
          ]}
        >
          <Form form={form80C} layout="vertical">
            <Row gutter={[24, 16]}>
              {[
                "5 Years of Fixed Deposit in Scheduled Bank",
                "Children Tuition Fees",
                "Contribution to Pension Fund",
                "Deposit in NSC",
                "Deposit in NSS",
                "Deposit in Post Office Savings Schemes",
                "Equity Linked Savings Scheme (ELSS)",
                "Interest on NSC Reinvested",
                "Life Insurance Premium",
                "Long term Infrastructure Bonds",
                "Mutual Funds",
                "NABARD Rural Bonds",
                "National Pension Scheme",
                "NHB Scheme",
                "Post office time deposit for 5 years",
                "Pradhan Mantri Suraksha Bima Yojana",
                "Public Provident Fund",
                "Repayment of Housing loan (Principal amount)",
              ].map((label) => (
                <Col span={12} key={label}>
                  <Form.Item name={label}>
                    <Text>{label}</Text>
                    <Input prefix="₹" placeholder="Enter Amount" />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form>
        </Modal>



        <Modal
          title="Other Chapter VI-A Deductions"
          open={openOtherDeduction}
          onCancel={() => setOpenOtherDeduction(false)}
          width={1000}
          footer={[
            <Button
              key="clear"
              onClick={() => formOtherDeduction.resetFields()}
            >
              Clear Form
            </Button>,
            <Button
              key="update"
              type="primary"
              onClick={() => {
                const values = formOtherDeduction.getFieldsValue();

                const parsed: Record<string, number> = {};
                let total = 0;

                Object.entries(values).forEach(([key, value]) => {
                  const amount = Number(value) || 0;
                  parsed[key] = amount;
                  total += amount;
                });

                setOtherChapterData(parsed);
                setOtherChapterTotal(total);

                message.success("Other deductions updated successfully");
                setOpenOtherDeduction(false);
              }}

            >
              Update
            </Button>,
          ]}
        >
          <Form form={formOtherDeduction} layout="vertical">
            <Row gutter={[24, 16]}>
              {[
                "80EE Additional Interest on housing loan borrowed as on 1st Apr 2016",
                "80EEA Additional Interest on Housing loan borrowed as on 1st Apr 2019",
                "80GGC Donations made to Political Party or Electoral Trust",
                "80GGA Donations made for Scientific Research or Rural Development",
                "80CCD(1) Employee Contribution to NPS",
                "80EEB Interest on Electric Vehicle borrowed as on 1st Apr 2019",
                "80CCD(1B) Contribution to NPS 2015",
                "10(10B) Retrenchment Compensation",
                "80TTB Interest on Deposits in Savings Account (Senior Citizen)",
                "80G Donation - 100% Exemption",
                "80G Donation - 50% Exemption",
                "80G Donation - Children Education",
                "80G Donation - Political Parties",
                "80TTA Interest on Deposits in Savings Account",
              ].map((label) => (
                <Col span={12} key={label}>
                  <Form.Item name={label}>
                    <Text>{label}</Text>
                    <Input prefix="₹" placeholder="Enter Amount" />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form>
        </Modal>


        {/* ================= HRA MODAL (FIXED ONLY HERE) ================= */}
        <Modal
          title="House Rent Allowance"
          open={openHRA}
          onCancel={() => setOpenHRA(false)}
          width={1000}
          footer={[
            <Button
              key="clear"
              onClick={() => formHRA.resetFields()}
            >
              Clear Form
            </Button>,
            <Button
              key="update"
              type="primary"
              onClick={() => {
                const values = formHRA.getFieldsValue();

                const monthlyRent = Number(values.monthlyRent) || 0;

                const totalRent = monthlyRent * 12;

                setHraData(values);
                setHraTotal(totalRent);

                message.success("HRA updated successfully");
                setOpenHRA(false);
              }}

            >
              Update
            </Button>,
          ]}
        >
          <Form form={formHRA} layout="vertical">

            <Card bordered>
              <Text>Total Declared in ₹</Text>
              <Text strong>0.00</Text>
            </Card>

            <br />

            <Row justify="space-between">
              <Text strong>House 1</Text>
              <Button type="link">+ Add new house</Button>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="fromMonth" label="From *">
                  <Select
                    defaultValue="Apr 2025"
                    options={[{ value: "Apr 2025", label: "Apr 2025" }]}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="toMonth" label="To *">
                  <Select
                    defaultValue="Mar 2026"
                    options={[{ value: "Mar 2026", label: "Mar 2026" }]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="monthlyRent" label="Monthly Rent Amount *">
              <Input prefix="₹" />
            </Form.Item>

            <Text strong>ANNUAL RENT AMOUNT ₹ : 0.00</Text>

            <br /><br />

            <Form.Item name="addressType" label="Full Address">
              <Select
                defaultValue="New Address"
                options={[{ value: "New Address", label: "New Address" }]}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="houseNo" label="House Name / Number">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="street" label="Street / Area / Locality">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="city" label="Town / City">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="pincode" label="Pincode *">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="hasPan" label="Does your landlord have a PAN?">
              <Radio.Group>
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="landlordName" label="Landlord's Name *">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="landlordPan" label="Landlord's PAN *">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

          </Form>
        </Modal>


        <Modal
          title="Medical (Sec 80D)"
          open={open80D}
          onCancel={() => setOpen80D(false)}
          width={900}
          footer={[
            <Button
              key="clear"
              onClick={() => form80D.resetFields()}
            >
              Clear Form
            </Button>,
            <Button
              key="update"
              type="primary"
              onClick={() => {
                const values = form80D.getFieldsValue();

                let total = 0;
                const parsed: Record<string, number> = {};

                Object.entries(values).forEach(([key, value]) => {
                  const amount = Number(value) || 0;
                  parsed[key] = amount;
                  total += amount;
                });

                setSec80DData(parsed);
                setSec80DTotal(total);

                message.success("Medical (80D) updated successfully");
                setOpen80D(false);
              }}

            >
              Update
            </Button>,
          ]}
        >
          <Form form={form80D} layout="vertical">

            <Card bordered style={{ marginBottom: 16 }}>
              <Text>Total declared in ₹</Text>
              <Text strong> 0.00</Text>
            </Card>

            {/* Dependent Parents – Preventive Health */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Text strong>80D Preventive Health Checkup - Dependant Parents</Text>
              <Form.Item name="parentPreventiveAmount" label="Declared Amount">
                <Input prefix="₹" />
              </Form.Item>
              <Text type="secondary">Max limit in ₹ : 5,000.00</Text>
            </Card>

            {/* Senior Citizen Bills */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Text strong>80D Medical Bills - Senior Citizen (&gt;60)</Text>
              <Form.Item name="seniorBills" label="Declared Amount">
                <Input prefix="₹" />
              </Form.Item>
              <Text type="secondary">Max limit in ₹ : 50,000.00</Text>
            </Card>

            {/* Insurance Premium */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Text strong>80D Medical Insurance Premium</Text>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="selfAge" label="Age">
                    <Select>
                      <Select.Option value="<60">&lt; 60</Select.Option>
                      <Select.Option value=">60">&gt; 60</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="selfPremium" label="Declared Amount">
                    <Input prefix="₹" />
                  </Form.Item>
                  <Text type="secondary">Max limit in ₹ : 25,000.00</Text>
                </Col>
              </Row>
            </Card>

            {/* Dependent Parents Insurance */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Text strong>80D Medical Insurance Premium - Dependant Parents</Text>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="parentAge" label="Age">
                    <Select>
                      <Select.Option value="<60">&lt; 60</Select.Option>
                      <Select.Option value=">60">&gt; 60</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="parentPremium" label="Declared Amount">
                    <Input prefix="₹" />
                  </Form.Item>
                  <Text type="secondary">Max limit in ₹ : 25,000.00</Text>
                </Col>
              </Row>
            </Card>

            {/* Preventive Health */}
            <Card size="small">
              <Text strong>80D Preventive Health Check-up</Text>
              <Form.Item name="selfPreventive" label="Declared Amount">
                <Input prefix="₹" />
              </Form.Item>
              <Text type="secondary">Max limit in ₹ : 5,000.00</Text>
            </Card>

          </Form>
        </Modal>



        <Modal
          title="Income / Loss from House Property"
          open={openHouseProperty}
          onCancel={() => setOpenHouseProperty(false)}
          width={1000}
          footer={[
            <Button
              key="clear"
              onClick={() => formHouseProperty.resetFields()}
            >
              Clear Form
            </Button>,
            <Button
              key="update"
              type="primary"
              onClick={() => {
                const values = formHouseProperty.getFieldsValue();

                const parsed: Record<string, number> = {};
                let total = 0;

                Object.entries(values).forEach(([key, value]) => {
                  const amount = Number(value) || 0;
                  parsed[key] = amount;
                  total += amount;
                });

                setHousePropertyData(parsed);
                setHousePropertyTotal(total);

                message.success("House Property updated successfully");
                setOpenHouseProperty(false);
              }}

            >
              Update
            </Button>,
          ]}
        >
          <Form form={formHouseProperty} layout="vertical">

            <Card bordered style={{ marginBottom: 16 }}>
              <Text type="secondary">Total Exemption in ₹</Text>
              <Text strong> 0.00</Text>
            </Card>

            <Card size="small" style={{ marginBottom: 16 }}>
              <Text strong>a. Income from Self-Occupied Property</Text>

              <Form.Item
                name="selfInterest"
                label="Interest on Housing Loan (Self Occupied)"
              >
                <Input prefix="₹" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="lenderName" label="Lender’s Name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lenderPan" label="Lender’s PAN">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card size="small">
              <Text strong>b. Income from Let-out Property</Text>

              <Form.Item name="rentReceived" label="Annual Rent Received">
                <Input prefix="₹" />
              </Form.Item>

              <Form.Item name="municipalTax" label="Municipal Taxes Paid">
                <Input prefix="₹" />
              </Form.Item>

              <Form.Item name="unrealizedRent" label="Unrealized Rent">
                <Input prefix="₹" />
              </Form.Item>

              <Form.Item name="netValue" label="Net Value">
                <Input prefix="₹" />
              </Form.Item>
            </Card>

          </Form>
        </Modal>




        <Modal
          title="Other Income"
          open={openOtherIncome}
          onCancel={() => setOpenOtherIncome(false)}
          width={900}
          footer={[
            <Button
              key="clear"
              onClick={() => formOtherIncome.resetFields()}
            >
              Clear Form
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={() => {
                const values = formOtherIncome.getFieldsValue();

                const data: Record<string, number> = {};
                let total = 0;

                if (values.income1Amount && values.income1Type) {
                  const amt = Number(values.income1Amount);
                  if (amt > 0) {
                    data[values.income1Type] = amt;
                    total += amt;
                  }
                }

                if (values.income2Amount && values.income2Type) {
                  const amt = Number(values.income2Amount);
                  if (amt > 0) {
                    data[values.income2Type] = amt;
                    total += amt;
                  }
                }

                setOtherIncomeData(data);
                setOtherIncomeTotal(total);


                message.success("Other Income saved successfully");
                setOpenOtherIncome(false);
              }}

            >
              Save
            </Button>,
          ]}
        >
          <Form form={formOtherIncome} layout="vertical">

            <Card size="small" style={{ marginBottom: 16 }}>
              <Text strong>Other Income 1</Text>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="income1Type" label="Particulars">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="income1Amount" label="Declared Amount">
                    <Input prefix="₹" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card size="small">
              <Text strong>Other Income 2</Text>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="income2Type" label="Particulars">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="income2Amount" label="Declared Amount">
                    <Input prefix="₹" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

          </Form>
        </Modal>




        <Modal
          title="TCS / TDS Deduction"
          open={openTcsTds}
          onCancel={() => setOpenTcsTds(false)}
          width={900}
          footer={[
            <Button
              key="clear"
              onClick={() => formTcsTds.resetFields()}
            >
              Clear Form
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={() => {
                const values = formTcsTds.getFieldsValue();

                const tcs = Number(values.tcsAmount) || 0;
                const tds = Number(values.tdsAmount) || 0;

                setTcsTdsData({
                  TCS: tcs,
                  TDS: tds,
                });

                setTcsTdsTotal(tcs + tds);

                message.success("TCS / TDS saved successfully");
                setOpenTcsTds(false);
              }}

            >
              Save
            </Button>,
          ]}
        >
          <Form form={formTcsTds} layout="vertical">

            <Card size="small" style={{ marginBottom: 16 }}>
              <Form.Item name="tcsAmount" label="TCS Deduction">
                <Input prefix="₹" />
              </Form.Item>
            </Card>

            <Card size="small">
              <Form.Item name="tdsAmount" label="TDS Deduction">
                <Input prefix="₹" />
              </Form.Item>
            </Card>

          </Form>
        </Modal>


      </div>
    </div>
  );
};

export default ITDeclaration;
