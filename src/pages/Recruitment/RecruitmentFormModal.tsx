import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";

export interface JobType {
  id?: number;
  title: string;
  department: string;
  status: string;
  deadline?: string | null;
  description?: string;
}

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (job: JobType) => void;
  editingJob: JobType | null;
}

const { Option } = Select;

const RecruitmentFormModal: React.FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  editingJob,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingJob) {
      form.setFieldsValue({
        ...editingJob,
        deadline: editingJob.deadline ? dayjs(editingJob.deadline) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingJob, form]);

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      id: editingJob?.id ?? Date.now(),
      deadline: values.deadline ? values.deadline.format("YYYY-MM-DD") : null,
    });
    form.resetFields();
  };

  return (
    <Modal
      title={editingJob ? "Edit Job Posting" : "Add New Job"}
      open={visible}
      onCancel={onCancel}
      okText="Save"
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
          <Input placeholder="Ex: Software Engineer" />
        </Form.Item>

        <Form.Item name="department" label="Department" rules={[{ required: true }]}>
          <Input placeholder="Ex: IT, HR, Finance" />
        </Form.Item>

        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select placeholder="Select Status">
            <Option value="Open">Open</Option>
            <Option value="Under Review">Under Review</Option>
            <Option value="Closed">Closed</Option>
          </Select>
        </Form.Item>

        <Form.Item name="deadline" label="Deadline">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Job requirements and details..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RecruitmentFormModal;
