import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";
import "./CreateTask.css";

import { useNavigate } from "react-router-dom";
import { createTask, getProjects, getTaskTypes, getTaskStatuses, getProjectModules } from "../../services/CandidateService";


const { TextArea } = Input;
const { Option } = Select;




const CreateTask: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [taskTypes, setTaskTypes] = useState<
    { id: number; task_type: string; is_active: boolean }[]
  >([]);

  const [statuses, setStatuses] = useState<
    { id: number; name: string; is_active: boolean }[]
  >([]);



  const [projects, setProjects] = useState<
    { id: number; project_name: string; is_active: boolean }[]
  >([]);

  const [modules, setModules] = useState<
    { id: number; project_module: string; project_id: number; is_active: boolean }[]
  >([]);

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const loggedInEmpId = Number(localStorage.getItem("hrms-employee-id"));
  const loggedInUserName = localStorage.getItem("hrms-user-name");
  useEffect(() => {
    if (loggedInEmpId) {
      form.setFieldsValue({
        task_manager: loggedInEmpId,
      });
    }
  }, [loggedInEmpId, form]);

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const res = await getTaskTypes();
        setTaskTypes(
          Array.isArray(res.data)
            ? res.data.filter((t) => t.is_active)
            : []
        );
      } catch (error) {
        message.error("Failed to load task types");
      }
    };

    fetchTaskTypes();
  }, []);


  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await getTaskStatuses();
        setStatuses(
          Array.isArray(res.data)
            ? res.data.filter((s) => s.is_active)
            : []
        );
      } catch {
        message.error("Failed to load task statuses");
      }
    };

    fetchStatuses();
  }, []);



  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const payload = {
        title: values.task_name,
        description: values.description,
        task_type_id: values.task_type_id,
        project_id: values.project,
        project_module_id: values.project_module_id,
        emp_id: loggedInEmpId,
        task_manager_id: loggedInEmpId,
        reporting_manager_id: loggedInEmpId,

        status_id: values.status_id,
        due_date: values.due_date.format("YYYY-MM-DD"),
        efforts_in_days: values.efforts,
        is_active: true,
      };



      console.log("CREATE TASK PAYLOAD", payload);

      await createTask(payload);

      message.success("Task created & saved successfully ");

      form.resetFields();


      navigate("/task-management/assign");

    } catch (err: any) {
      console.error(err);
      message.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(
          Array.isArray(res.data)
            ? res.data.filter((p) => p.is_active)
            : []
        );
      } catch (error) {
        message.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await getProjectModules();
        setModules(Array.isArray(res.data) ? res.data.filter(m => m.is_active) : []);
      } catch {
        message.error("Failed to load project modules");
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="create-task-page">
      <Card title="Create Task" className="create-task-card">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Task Name"
                name="task_name"
                rules={[{ required: true, message: "Task name is required" }]}
              >
                <Input placeholder="Enter task name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Task Type"
                name="task_type_id"
                rules={[{ required: true, message: "Select task type" }]}
              >
                <Select
                  placeholder="Select task type"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {taskTypes.map((type) => (
                    <Option key={type.id} value={type.id}>
                      {type.task_type}
                    </Option>
                  ))}
                </Select>

              </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item
                label="Status"
                name="status_id"
                rules={[{ required: true, message: "Select status" }]}
              >
                <Select
                  placeholder="Select status"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {statuses.map((s) => (
                    <Option key={s.id} value={s.id}>
                      {s.name}
                    </Option>
                  ))}
                </Select>

              </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item
                label="Due Date"
                name="due_date"
                rules={[{ required: true, message: "Select due date" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={(date) => date && date < dayjs().startOf("day")}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Description is required" }]}
              >
                <TextArea rows={4} placeholder="Task description" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Efforts (Days)"
                name="efforts"
                rules={[
                  { required: true, message: "Enter effort in days" },
                ]}
              >
                <InputNumber
                  min={1}
                  precision={0}
                  style={{ width: "100%" }}
                  placeholder="Enter number of days"
                />
              </Form.Item>
            </Col>


            <Col span={12}>
              <Form.Item label="Task Manager">
                <Input
                  value={loggedInUserName || ""}

                />
              </Form.Item>
            </Col>


            <Col span={12}>
              <Form.Item
                label="Project"
                name="project"
                rules={[{ required: true, message: "Select project" }]}
              >
                <Select
                  placeholder="Select project"
                  onChange={(value) => {
                    setSelectedProjectId(value);
                    form.setFieldsValue({ project_module_id: undefined });
                  }}
                >
                  {projects.map((p) => (
                    <Option key={p.id} value={p.id}>
                      {p.project_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>


            </Col>


            <Col span={12}>
              <Form.Item
                label="Module"
                name="project_module_id"
                rules={[{ required: true, message: "Select module" }]}
              >
                <Select
                  placeholder={
                    selectedProjectId ? "Select module" : "Select project first"
                  }
                  disabled={!selectedProjectId}
                >
                  {modules
                    .filter((m) => m.project_id === selectedProjectId)
                    .map((m) => (
                      <Option key={m.id} value={m.id}>
                        {m.project_module}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTask;
