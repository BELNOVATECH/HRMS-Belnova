import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  message,
  Select,
  Row,
  Col,
  Modal,
  Descriptions,
  Tabs,
  Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import "./TaskHistory.css";

import {
  getTaskHistoryByFilters,
  getEmployees,
  getProjects,
  getProjectModules,
  getTaskHistoryByTaskId,
} from "../../services/CandidateService";

interface Task {
  id: number;
  employee_name: string;
  title: string;
  description: string;
  reporting_manager_name: string;
  status: string;
  project_name: string;
  module_name?: string;
  efforts: number;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  manager_id: number | null;
}

interface Project {
  id: number;
  project_name: string;
  is_active: boolean;
}

interface ProjectModule {
  id: number;
  project_module: string;
  project_id: number;
  is_active: boolean;
}

const TaskHistory: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const [employeeId, setEmployeeId] = useState<number>();
  const [managerId, setManagerId] = useState<number>();
  const [projectId, setProjectId] = useState<number>();
  const [moduleId, setModuleId] = useState<number>();
  const [statusId, setStatusId] = useState<number>();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [modules, setModules] = useState<ProjectModule[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskHistory, setTaskHistory] = useState<any[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchTaskHistory();
  }, [employeeId, managerId, projectId, moduleId, statusId]);

  const loadInitialData = async () => {
    try {
      const [empRes, projRes, modRes] = await Promise.all([
        getEmployees(),
        getProjects(),
        getProjectModules(),
      ]);

      setEmployees(empRes.data);
      setProjects(projRes.data.filter((p: Project) => p.is_active));
      setModules(modRes.data.filter((m: ProjectModule) => m.is_active));
    } catch {
      message.error("Failed to load filters");
    }
  };

  const fetchTaskHistory = async () => {
    setLoading(true);
    try {
      const res = await getTaskHistoryByFilters({
        employee_id: employeeId,
        manager_id: managerId,
        project_id: projectId,
        project_module_id: moduleId,
        status_id: statusId,
      });

      const mapped: Task[] = res.data.data.map((item: any) => ({
        id: item.task_id,
        employee_name: item.employee_name,
        title: item.title,
        description: item.description,
        reporting_manager_name: item.manager_name,
        status: item.status_name,
        project_name: item.project_name,
        module_name: item.project_module,
        efforts: item.efforts_in_days,
      }));

      setTasks(mapped);
    } catch {
      message.error("Failed to load task history");
    } finally {
      setLoading(false);
    }
  };

  const openTaskModal = async (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);

    try {
      const res = await getTaskHistoryByTaskId(task.id);

      // remove duplicates
      const uniqueHistory = Array.from(
        new Map(res.data.map((item: any) => [item.history_id, item])).values()
      );

      setTaskHistory(uniqueHistory);
    } catch {
      message.error("Failed to load task activity");
    }
  };

  const columns: ColumnsType<Task> = [
    { title: "Employee", dataIndex: "employee_name" },
    { title: "Task", dataIndex: "title" },
    { title: "Manager", dataIndex: "reporting_manager_name" },
    { title: "Status", dataIndex: "status" },
    { title: "Project", dataIndex: "project_name" },
    { title: "Module", dataIndex: "module_name" },
    { title: "Efforts", dataIndex: "efforts" },
  ];

  return (
    <div className="task-history-container">
      <Card title="Task History" className="task-history-card">
        
        {/* FILTERS */}
        <Row gutter={[24, 24]} style={{ marginBottom: 16 }}>
          
          {/* Employee */}
          <Col xs={24} sm={12} md={4}>
            <Select
              allowClear
              showSearch
              placeholder="Employee"
              onChange={setEmployeeId}
              optionFilterProp="label"
              style={{ width: "110%" }}
              options={employees.map((e) => ({
                value: e.id,
                label: `${e.first_name} ${e.last_name}`,
              }))}
            />
          </Col>

          {/* Manager */}
          <Col xs={24} sm={12} md={4}>
            <Select
              allowClear
              showSearch
              placeholder="Manager"
              onChange={setManagerId}
              optionFilterProp="label"
              style={{ width: "110%" }}
              options={employees.map((e) => ({
                value: e.id,
                label: `${e.first_name} ${e.last_name}`,
              }))}
            />
          </Col>

          {/* Project */}
          <Col xs={24} sm={12} md={4}>
            <Select
              allowClear
              showSearch
              placeholder="Project"
              onChange={setProjectId}
              optionFilterProp="label"
              style={{ width: "110%" }}
              options={projects.map((p) => ({
                value: p.id,
                label: p.project_name,
              }))}
            />
          </Col>

          {/* Module */}
          <Col xs={24} sm={12} md={4}>
            <Select
              allowClear
              showSearch
              placeholder="Module"
              onChange={setModuleId}
              optionFilterProp="label"
              style={{ width: "110%" }}
              options={modules.map((m) => ({
                value: m.id,
                label: m.project_module,
              }))}
            />
          </Col>

          {/* Status */}
          <Col xs={24} sm={12} md={4}>
            <Select
              allowClear
              showSearch
              placeholder="Status"
              onChange={setStatusId}
              optionFilterProp="label"
              style={{ width: "110%" }}
              options={[
                { value: 11, label: "Pending" },
                { value: 12, label: "Completed" },
                { value: 7, label: "Active" },
                { value: 1, label: "In-Progress" },
                { value: 3, label: "Rejected" },
              ]}
            />
          </Col>
        </Row>

        {/* TABLE */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={tasks}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          scroll={{ x: true }}
          onRow={(record) => ({
            onClick: () => openTaskModal(record),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      {/* MODAL */}
      <Modal
        title="Task Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={720}
      >
        {selectedTask && (
          <>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Project">
                {selectedTask.project_name}
              </Descriptions.Item>

              <Descriptions.Item label="Module">
                {selectedTask.module_name || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Task Name">
                {selectedTask.title}
              </Descriptions.Item>

              <Descriptions.Item label="Description">
                {selectedTask.description}
              </Descriptions.Item>
            </Descriptions>

            <Divider>Activity</Divider>

            <Tabs
              defaultActiveKey="comments"
              items={[
                {
                  key: "comments",
                  label: "Comments",
                  children: (
                    <div>
                      {taskHistory.length === 0 ? (
                        <p>No comments available</p>
                      ) : (
                        taskHistory.map((h) => (
                          <Card
                            key={h.history_id}
                            size="small"
                            style={{ marginBottom: 10 }}
                          >
                            <b>{h.employee_name}:</b> {h.comments}
                            <br />
                            <small>
                              {new Date(h.created_date).toLocaleString()}
                            </small>
                          </Card>
                        ))
                      )}
                    </div>
                  ),
                },
                {
                  key: "history",
                  label: "History",
                  children: (
                    <ul style={{ paddingLeft: 20 }}>
                      {taskHistory.map((h) => (
                        <li key={h.history_id}>
                          {h.employee_name} updated task on{" "}
                          <b>
                            {new Date(h.created_date).toLocaleString()}
                          </b>
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ]}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default TaskHistory;
