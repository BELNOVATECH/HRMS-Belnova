import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopPerformersOverlay from "./TopPerformersOverlay";
import PendingReviewsOverlay from "./PendingReviewsOverlay";


import {
  Card,
  Table,
  Tag,
  Avatar,
  Space,
  Typography,
  Progress,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Select,
  message,
} from "antd";
import Icon, {
  TrophyOutlined,
  StarOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Performance.css";
import dayjs from "dayjs";
import { useEffect } from "react";
import { getEmployees, getDesignations, createEmployeeRating, getPerformanceRatings,  getTopPerformers, getAverageRating, getPendingReviews, } from "../../services/CandidateService";


const { Title } = Typography;

const Performance: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  const [employees, setEmployees] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [topPerformersCount, setTopPerformersCount] = useState(0);
  const [averageRating, setAverageRating] = useState("0.0");
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();



const onSubmit = async (values: any) => {
  try {
    const emp = employees.find(
      e => `${e.first_name} ${e.last_name}` === values.name
    );

    const reviewer = employees.find(
      e => `${e.first_name} ${e.last_name}` === values.reviewer
    );

    if (!emp || !reviewer) return;

    const payload = {
  emp_id: emp.id,
  designation_id: emp.designation_id,
  rating: values.rating,
  reviewer_id: reviewer.id,

  created_by: reviewer.id,               // or logged in user id
  created_date: new Date().toISOString(),
  is_active: true
};


    await createEmployeeRating(payload);

    message.success("Review added successfully!");

    // 🔥 REFRESH EVERYTHING
    fetchPerformanceData();
    fetchTopPerformers();
    fetchAverageRating();
    fetchPendingReviews();

    form.resetFields();
    setModalOpen(false);
  } catch (err) {
    console.error(err);
    message.error("Failed to submit review");
  }
};




  useEffect(() => {
    fetchEmployees();
    fetchDesignations();
    fetchPerformanceData();
    fetchTopPerformers();
   fetchAverageRating();
   fetchPendingReviews();
  }, []);
const filteredPerformanceData = performanceData.filter((item) =>
  (item.name ?? "")
    .toLowerCase()
    .includes((searchText ?? "").toLowerCase())
);

  const fetchTopPerformers = async () => {
  try {
    const res = await getTopPerformers();
    setTopPerformersCount(res.data.length); // array length
  } catch (err) {
    console.error("Top performers error", err);
  }
};

const fetchAverageRating = async () => {
  try {
    const res = await getAverageRating();
    setAverageRating(res.data.average_rating.toFixed(2));
  } catch (err) {
    console.error("Average rating error", err);
  }
};

const fetchPendingReviews = async () => {
  try {
    const res = await getPendingReviews();
    setPendingReviewsCount(res.data.total_pending_reviews);
  } catch (err) {
    console.error("Pending reviews error", err);
  }
};



  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);   // 👈 from /employees/
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await getDesignations();
      setDesignations(res.data);   // 👈 from /designations/
    } catch (err) {
      console.error("DESIGNATION ERROR ❌", err);
    }
  };
   const isMobile = window.innerWidth < 768;
  const fetchPerformanceData = async () => {
    try {
      const res = await getPerformanceRatings();
      // Map backend data to table-friendly format
      const data = res.data.map((item: any, index: number) => ({
        key: item.id,
        name: item.employee_name,
        designation: item.designation_name || "N/A",
        rating: item.rating,
        reviewer: item.reviewer_name,
        date: dayjs(item.created_date).format("DD-MMM-YYYY"),
        emp_id: item.emp_id,
        designation_id: item.designation_id,
        reviewer_id: item.reviewer_id,
      }));
      setPerformanceData(data);
    } catch (err) {
      console.error("Failed to fetch performance data", err);
    }
  };

  const columns = [
    {
  title: "Employee",
  dataIndex: "name",
  key: "name",
  render: (text: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Avatar
        size={36}
        icon={<UserOutlined />}
        style={{ backgroundColor: "#3b82f6" }}
      />
      <span
        style={{
          fontWeight: 500,
          color: "#1f2937",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  ),
},

    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (desig: string) => <Tag color="geekblue">{desig}</Tag>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <Progress
          type="circle"
          percent={(rating / 5) * 100}
          width={40}
          strokeColor={rating >= 4.5 ? "#16a34a" : rating >= 4 ? "#facc15" : "#ef4444"}
          format={() => rating.toFixed(1)}
        />
      ),
    },
    {
      title: "Reviewer",
      dataIndex: "reviewer",
      key: "reviewer",
      render: (name: string) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (

    <div className="hrms-dashboard-container">
      <Sidebar />

      <div className="hrms-dashboard-main">
     <Outlet />


<div className="performance-header">
  <div className="performance-title">
    <TrophyOutlined className="title-icon" />
    <div className="title-text">
      <h2>Employee Performance</h2>
      <p className="performance-subtitle">
        Overview of appraisals, KPIs, and ratings.
      </p>
    </div>
  </div>
</div>




        <div className="performance-stats">
          <Card className="stat-card top" onClick={() => setShowTop(true)}>
         <TrophyOutlined className="stat-icon" />
        <h3>Top Performers</h3>
        <p>{topPerformersCount}</p>
        </Card>


          <Card className="stat-card average">
            <StarOutlined className="stat-icon" />
          <h3>Average Rating</h3>
    <p>{averageRating}</p>
          </Card>

         <Card className="stat-card pending" onClick={() => setShowPending(true)}>
          <ClockCircleOutlined className="stat-icon" />
        <h3>Pending Reviews</h3>
        <p>{pendingReviewsCount}</p>
        </Card>

        </div>
       <div className="performance-search-row">
  <Input
    placeholder="🔍  Search by employee name"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    className="performance-search"
  />
</div>


        <Card className="performance-table-card">
          <Table
            columns={columns}
            dataSource={filteredPerformanceData}
            pagination={{ pageSize: 5 }}
            bordered
          />
        </Card>
      </div>

      {/* <Modal
        open={modalOpen}
        title="Add Performance Review"
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        footer={false}
      >

        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item label="Employee Name" name="name" rules={[{ required: true }]}>
            <Select
              placeholder="Select Employee"
              showSearch
              optionFilterProp="children"
              onChange={(value) => {
                const emp = employees.find(
                  e => `${e.first_name} ${e.last_name}` === value
                );
                if (emp) {
                  form.setFieldsValue({
                    designation: emp.designation_name,
                  });
                }
              }}
            >
              {employees.map(emp => (
                <Select.Option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
                  {emp.first_name} {emp.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item
            label="Designation"
            name="designation"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Designation"
              showSearch
              optionFilterProp="children"
            >
              {designations.map(d => (
                <Select.Option key={d.id} value={d.designation_name}>
                  {d.designation_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>




          <Form.Item label="Rating (1-5)" name="rating" rules={[{ required: true }]}>
            <InputNumber min={1} max={5} className="full-width" />
          </Form.Item>

          <Form.Item label="Reviewer" name="reviewer" rules={[{ required: true }]}>
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Select Reviewer"
            >
              {employees.map(emp => (
                <Select.Option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
                  {emp.first_name} {emp.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker className="full-width" />
          </Form.Item>

          <Button type="rimary" htmlType="submit" block>
            Submit Review
          </Button>
        </Form>
      </Modal> */}
      <TopPerformersOverlay open={showTop} onClose={() => setShowTop(false)} />
        <PendingReviewsOverlay
  open={showPending}
  onClose={() => setShowPending(false)}
/>


    </div>
  );
};

export default Performance;