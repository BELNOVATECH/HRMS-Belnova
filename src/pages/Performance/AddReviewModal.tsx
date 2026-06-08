import React, { useEffect } from "react";
import { Form, Select, InputNumber, DatePicker, Button, message, Input } from "antd";
import { createEmployeeRating, getDesignations, getPendingReviews } from "../../services/CandidateService";
import { getEmployees } from "../../services/CandidateService";

const AddReviewModal = ({
  employee,
  onClose,
}: {
  employee: any;
  onClose: () => void;
}) => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = React.useState<any[]>([]);
  const [designations, setDesignations] = React.useState<any[]>([]);
//  const [reviewers, setReviewers] = React.useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        employee: employee.employee_name,
      });
    }
  }, [employee]);
  

  const load = async () => {
  const pending = await getPendingReviews(); // employees to be reviewed
  // const allEmployees = await getEmployees(); // reviewers source

  setEmployees(pending.data.employees);
  // setReviewers(allEmployees.data);
};


 const submit = async (values: any) => {
  const emp = employees.find(
    (e) => e.employee_name === values.employee
  );

  if (!emp) return;

  await createEmployeeRating({
    emp_id: emp.employee_id,
    designation_id: emp.designation_id,
    rating: values.rating,
    reviewer_id: values.reviewer, // same employee
  });

  message.success("Review added");
  form.resetFields();
  onClose();
};


  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Form layout="vertical" form={form} onFinish={submit}>
        <Form.Item label="Employee" name="employee">
          <Input disabled />
        </Form.Item>

   <Form.Item
  label="Rating"
  name="rating"
  rules={[
    { required: true, message: "Please enter rating" },
    {
      validator: (_, value) => {
        if (value === undefined || value === null || value === "") {
          return Promise.resolve();
        }

        const num = Number(value);

        if (isNaN(num)) {
          return Promise.reject(
            new Error("Rating must be a number")
          );
        }

        if (num < 1 || num > 5) {
          return Promise.reject(
            new Error("Rating must be between 1.0 and 5.0")
          );
        }

        return Promise.resolve();
      },
    },
  ]}
>
  <InputNumber
    style={{ width: "100%" }}
    step={0.1}
    precision={1}
    controls={false}
    placeholder="Enter rating (1.0 – 5.0)"
    stringMode
    onKeyDown={(e) => {
      if (["e", "E", "+", "-"].includes(e.key)) {
        e.preventDefault();
      }
    }}
  />
</Form.Item>





<Form.Item
  label="Reviewer"
  name="reviewer"
  rules={[{ required: true, message: "Please select reviewer" }]}
>
  <Select placeholder="Select Reviewer">
    {employees.map((e) => (
      <Select.Option
        key={e.employee_id}
        value={e.employee_id}
      >
        {e.employee_name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>







        <Form.Item label="Date" name="date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Submit Review
        </Button>
      </Form>
    </div>
  );
};

export default AddReviewModal;
