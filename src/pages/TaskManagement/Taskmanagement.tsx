import { useEffect, useState } from "react";
import { Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import CreateTask from "./CreateTask";
import AssignTask from "./AssignTask";
import TaskHistory from "./TaskHistory";

import "./Taskmanagement.css";

const { Option } = Select;

const TaskManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedPage, setSelectedPage] = useState("create");

  // ✅ URL sync
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get("page");
    if (page) setSelectedPage(page);
  }, [location.search]);

  // ✅ Dropdown change handler
  const handleChange = (value: string) => {
    setSelectedPage(value);
    navigate(`/task-management?page=${value}`);
  };

  // ✅ Render component based on selection
  const renderComponent = () => {
    switch (selectedPage) {
      case "create":
        return <CreateTask />;
      case "assign":
        return <AssignTask />;
      case "history":
        return <TaskHistory />;
      default:
        return <CreateTask />;
    }
  };

  return (
    <div className="task-page-container">
      {/* ✅ Dropdown */}
      <div className="task-dropdown-container">
        <Select value={selectedPage} onChange={handleChange} style={{ width: 250 }}>
          <Option value="create">Create Task</Option>
          <Option value="assign">Assign Task</Option>
          <Option value="history">Task History</Option>
        </Select>
      </div>

      {/* ✅ Selected content */}
      <div className="task-content">{renderComponent()}</div>
    </div>
  );
};

export default TaskManagement;
