import { useEffect, useMemo, useState, type JSX } from "react";
import {
  Table,
  Button,
  Card,
  Tag,
  Select,
  Row,
  Col,
  Typography,
  Modal,
  Input,
  Form,
  Upload,
  message,
  Rate,
  Space,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  CommentOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import "./Recruitement.css";
import { getCandidates, createJobOpening, addCandidate, getDepartments, getJobOpenings, getInterviewSchedules, createInterviewSchedule, uploadResume, getInterviewStages, updateInterviewSchedule, deleteInterviewSchedule, updateCandidate, getDesignations, updateJobOpening } from "../../services/CandidateService";
import { useRef } from "react";


const { Title } = Typography;
const { Option } = Select;

type Job = {
  title: any;
  id: number;
  designation_id: number;
  department_id: number;
  status: string;
  is_active?: boolean;
};
type Candidate = {
  id: number;
  name: string;
  designation_id: number; // ✅ ID ONLY
  email: string;
  dob?: string;
  address?: string;
  mobile_number?: string;
  resume?: any;
  application?: string;
};



type Interview = {
  id: number;
  candidate: number; // candidate_id
  role: number;      // position_id
  stage: number;     // stage_id
  status: string;    // UI only
  date: string;
  feedback?: { rating: number; comments?: string };
};

type JobTitle = {
  id: number;
  position: string;
  dept_id: number;
};


export default function RecruitmentScreen(): JSX.Element {
  /* -------------------- FETCH CONFIG VALUES -------------------- */
  const scheduleRef = useRef<HTMLDivElement | null>(null);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [stages, setStages] = useState<{ id: number; stage_name: string }[]>([]);

  const [departments, setDepartments] = useState<
    { id: number; department: string }[]
  >([]);



  /* --------------------------- jobs --------------------------- */
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobModalVisible, setJobModalVisible] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [jobForm] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [jobFilterOpen, setJobFilterOpen] = useState(false);
  const [jobSaving, setJobSaving] = useState(false);
  const [okDisabled, setOkDisabled] = useState(false);
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [selectedDept, setSelectedDept] = useState<number | null>(null);













  // ✅ Roles that can be used for interview scheduling
  // const selectableJobRoles = useMemo(
  //   () => jobs.filter((j) => j.status !== "Closed"),
  //   [jobs]
  // );


  /* --------------------------- candidates --------------------------- */
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidateModalVisible, setCandidateModalVisible] = useState(false);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [candidateForm] = Form.useForm();
  const [uploadFileList, setUploadFileList] = useState<any[]>([]);
  const [candidateSaving, setCandidateSaving] = useState(false);







  // import { getDesignations } from "../../services/CandidateService";

  const fetchDesignations = async () => {
    try {
      const res = await getDesignations();

      setJobTitles(
        res.data
          .filter((d: any) => d.is_active)
          .map((d: any) => ({
            id: d.id,
            position: d.designation_name,
            dept_id: d.dept_id,
          }))
      );
    } catch (e) {
      message.error("Failed to load designations");
    }
  };

  const fetchDepartmentsList = async () => {
    const res = await getDepartments();
    setDepartments(
      res.data
        .filter((d: any) => d.is_active)
        .map((d: any) => ({
          id: d.id,
          department: d.department,
        }))
    );
  };


  const fetchJobOpenings = async () => {
    try {
      const res = await getJobOpenings();

      const mapped = res.data.map((j: any) => ({
        id: j.id,
        designation_id: j.designation_id,
        department_id: j.department_id,
        status:
          j.status_id === 1
            ? "Open"
            : j.status_id === 2
              ? "In Progress"
              : "Closed",
        is_active: j.is_active,
      }));

      setJobs([...mapped].reverse());

    } catch (err) {
      console.error(err);
      message.error("Failed to fetch job openings");
    }
  };



  useEffect(() => {
    const init = async () => {
      await fetchDesignations();        // loads jobTitles
      await fetchDepartmentsList();
      await fetchInterviewStages();
      await fetchJobOpenings();
    };
    init();
  }, []);


  // 🔥 fetch candidates ONLY AFTER jobTitles changes
  useEffect(() => {
    if (jobTitles.length > 0) {
      fetchCandidates();
      fetchInterviewSchedules();
    }
  }, [jobTitles]);

  useEffect(() => {
    const handleScroll = () => {
      setJobFilterOpen(false); // 🔥 close dropdown on scroll
    };

    window.addEventListener("scroll", handleScroll, true); // capture scroll
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);



  const fetchCandidates = async () => {
    try {
      const res = await getCandidates();

      const mapped = res.data.map((c: any) => ({
        id: c.id,
        name: c.candidate_name,
        designation_id: c.designation_id,


        email: c.email,
        dob: c.dob,
        address: c.address,
        mobile_number: c.mobile,
        resume: c.upload_resume,
        application:
          c.application_status_id === 1
            ? "In Progress"
            : c.application_status_id === 2
              ? "Hired"
              : "Rejected",
      }));

      setCandidates(mapped);
    } catch (err) {
      console.log(err);
      message.error("Failed to fetch candidates");
    }
  };

  const fetchInterviewStages = async () => {
    try {
      const res = await getInterviewStages();

      setStages(
        res.data
          .filter((s: any) => s.is_active)
          .map((s: any) => ({
            id: s.id,
            stage_name: s.stage_name,
          }))
      );
    } catch (err) {
      console.error(err);
      message.error("Failed to load interview stages");
    }
  };

  const filteredDesignations = useMemo(() => {
    if (!selectedDept) return [];
    return jobTitles.filter((j) => j.dept_id === selectedDept);
  }, [jobTitles, selectedDept]);




  /* --------------------------- interviews --------------------------- */
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [editInterview, setEditInterview] = useState<Interview | null>(null);
  const [interviewForm] = Form.useForm();

  const [interviewEdits, setInterviewEdits] = useState<Record<number, Partial<Interview>>>({});
  const [lockedMap, setLockedMap] = useState<Record<number, boolean>>({});


  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] = useState<Interview | null>(null);
  const [feedbackForm] = Form.useForm();

  /* --------------------------- helpers --------------------------- */
  const extractFilenameFromUrl = (url: string) => {
    try {
      const parts = url.split("/");
      return parts[parts.length - 1] || "resume.pdf";
    } catch {
      return "resume.pdf";
    }
  };

  const activeJobRoles = useMemo(() => jobs.filter((j) => j.status !== "Closed").map((j) => j.title), [jobs]);

  /* --------------------------- JOB COLUMNS --------------------------- */
  const jobColumns = [
    {
      title: "Department",
      render: (_: any, r: Job) =>
        departments.find((d) => d.id === r.department_id)?.department || "—",
    },
    {
      title: "Designation",
      render: (_: any, r: Job) =>
        jobTitles.find((d) => d.id === r.designation_id)?.position || "—",
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (t: string) => (
        <Tag color={t === "Open" ? "green" : t === "In Progress" ? "blue" : "red"}>
          {t}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_: any, r: Job) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditJob(r);
              setSelectedDept(r.department_id);
              jobForm.setFieldsValue({
                title: r.designation_id,
                dept: r.department_id,
                status: r.status,
              });
              setJobModalVisible(true);
            }}
          />
        </Space>
      ),
    },
  ];

  const handleOk = async () => {
    try {
      setOkDisabled(true);        // 🔒 disable immediately

      await saveRatingAndComment();  // your API call

      message.success("Saved successfully");
    } catch (e) {
      message.error("Failed to save");
      setOkDisabled(false);       // 🔓 re-enable if error
    }
  };

  /* --------------------------- CANDIDATE COLUMNS --------------------------- */
  const candidateColumns = [
    { title: "Candidate", dataIndex: "name" },
    {
      title: "Designation",
      render: (_: any, r: Candidate) =>
        jobTitles.find((j) => j.id === r.designation_id)?.position || "—",
    },

    { title: "Email", dataIndex: "email" },
    {
      title: "Status",
      dataIndex: "application",
      render: (s: string) => <Tag color={s === "Hired" ? "green" : s === "In Progress" ? "blue" : "orange"}>{s}</Tag>,
    },
    {
      title: "Resume",
      render: (_: any, r: Candidate) => {
        // ✅ no resume uploaded
        if (!r.resume || typeof r.resume !== "string" || r.resume.trim() === "") {
          return <span style={{ color: "#999" }}>No resume</span>;
        }

        // ✅ resume exists
        const encodedPath = encodeURI(r.resume);

        return (
          <Button
            type="link"
            onClick={() =>
              window.open(
                `https://hrms-be-ppze.onrender.com/${encodedPath}`,
                "_blank"
              )
            }
          >
            View Resume
          </Button>
        );
      },
    },



    {
      title: "Actions",
      render: (_: any, r: Candidate) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditCandidateModal(r)} />
          {/* <Button
            size="small"
            // icon={<DeleteOutlined />}
            onClick={() => {
              setCandidates((prev) => prev.filter((c) => c.id !== r.id));
              message.success("Candidate removed"); */}
          {/* }} */}
          {/* /> */}
        </Space>
      ),
    },
  ];

  /* --------------------------- INTERVIEW COLUMNS --------------------------- */
  const interviewColumns = [
    {
      title: "Candidate",
      dataIndex: "candidate",
      render: (id: number) => {
        const cand = candidates.find((c) => c.id === id);
        return cand ? cand.name : "Unknown";
      },
    },


    {
      title: "Role",
      render: (_: any, record: Interview) =>
        jobTitles.find((j) => j.id === record.role)?.position || "Unknown",
    },
    { title: "Date", dataIndex: "date" },
    {
      title: "Stage",
      render: (_: any, record: Interview) =>
        stages.find((s) => s.id === record.stage)?.stage_name || "Unknown",
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (val: string, record: Interview) => {
        const isLocked = !!lockedMap[record.id];
        const editing = !!interviewEdits[record.id];
        if (!isLocked || editing) {
          return (
            <Select
              value={interviewEdits[record.id]?.status ?? val}
              onChange={(v) =>
                setInterviewEdits((prev) => ({ ...prev, [record.id]: { ...(prev[record.id] ?? {}), status: v } }))
              }
              style={{ width: 160 }}
            >
              <Option value="In Progress">In Progress</Option>
              <Option value="Selected">Selected</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          );
        }
        return <Tag color={val === "Selected" ? "green" : val === "In Progress" ? "blue" : "red"}>{val}</Tag>;
      },
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      render: (fb: any) => (fb ? <Rate disabled value={fb.rating} /> : <i style={{ color: "#888" }}>No feedback</i>),
    },
    {
      title: "Actions",

      render: (_: any, r: Interview) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditInterview(r);
              interviewForm.setFieldsValue({
                candidate: r.candidate,
                designation: r.role,
                stage: r.stage,
                status: r.status,
                date: r.date ? dayjs(r.date) : null,
              });

              setLockedMap((p) => ({ ...p, [r.id]: false })); // allow editing
              setInterviewEdits((p) => ({
                ...p,
                [r.id]: { candidate: r.candidate, role: r.role, date: r.date, stage: r.stage, status: r.status },
              }));

              scheduleRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          />

          <Button size="small" icon={<CommentOutlined />} onClick={() => openFeedbackModalFor(r)} />

          {/* <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Delete Interview",
                content: "Are you sure you want to delete this interview?",
                okText: "Yes, Delete",
                okType: "danger",
                cancelText: "Cancel",
                onOk: async () => {
                  try {
                    await deleteInterviewSchedule(r.id);

                    message.success("Interview deleted successfully");

                    // refresh from backend
                    await fetchInterviewSchedules();
                  } catch (error: any) {
                    console.error(error);
                    message.error("Failed to delete interview");
                  }
                },
              });
            }}
          /> */}

          {!!interviewEdits[r.id] && (
            <Button
              size="small"
              type="primary"
              icon={<SaveOutlined />}
              onClick={async () => {
                const edits = interviewEdits[r.id];
                if (!edits) return;

                const payload = {
                  candidate_id: edits.candidate ?? r.candidate, // 🔥 FIX
                  designation_id: edits.role ?? r.role,                  // 🔥 FIX
                  stage_id: edits.stage ?? r.stage,
                  status_id:
                    (edits.status ?? r.status) === "In Progress"
                      ? 1
                      : (edits.status ?? r.status) === "Selected"
                        ? 2
                        : 3,
                  interview_date: edits.date ?? r.date,
                  created_by: 1,
                };


                await updateInterviewSchedule(r.id, payload);

                message.success("Interview updated");

                setInterviewEdits((prev) => {
                  const cp = { ...prev };
                  delete cp[r.id];
                  return cp;
                });

                setLockedMap((prev) => ({ ...prev, [r.id]: true }));
                setEditInterview(null);
                interviewForm.resetFields();

                await fetchInterviewSchedules(); // ✅ refresh SAME row
              }}

            >
              Save
            </Button>
          )}
        </Space>
      ),
    }

  ];

  /* --------------------------- SAVE JOB --------------------------- */
  const handleSaveJob = async (values: any) => {
    if (jobSaving) return; // 🚫 prevent double click

    try {
      setJobSaving(true); // 🔒 lock button

      const payload = {
        designation_id: values.title,
        department_id: values.dept,
        status_id:
          values.status === "Open"
            ? 1
            : values.status === "In Progress"
              ? 2
              : 3,
        is_active: true,
      };

      if (editJob) {
        await updateJobOpening(editJob.id, payload);
        message.success("Job updated successfully");
      } else {
        await createJobOpening(payload);
        message.success("Job added successfully");
      }

      jobForm.resetFields();
      setEditJob(null);
      setJobModalVisible(false);
      await fetchJobOpenings();

    } catch (err) {
      console.error(err);
      message.error("Failed to save job opening");
    } finally {
      setJobSaving(false); // 🔓 unlock
    }
  };


  const handleUpdateInterview = async (values: any) => {
    if (!editInterview) return;

    try {
      const payload = {
        candidate_id: values.candidate,  // 🔥 FIX
        designation_id: values.designation,     // 🔥 FIX
        stage_id: values.stage,
        status_id:
          values.status === "In Progress"
            ? 1
            : values.status === "Selected"
              ? 2
              : 3,
        interview_date: values.date.format("YYYY-MM-DD"),
        created_by: 1,
      };


      await updateInterviewSchedule(editInterview.id, payload);

      message.success("Interview updated successfully");

      interviewForm.resetFields();
      setEditInterview(null);

      await fetchInterviewSchedules();
    } catch (error: any) {
      console.error(error);
      message.error("Failed to update interview");
    }
  };

  /* --------------------------- CANDIDATE SAVE --------------------------- */
  const beforeUploadCandidateResume = (file: any) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
    ];

    // ❌ Reject anything not allowed
    if (!allowedTypes.includes(file.type)) {
      message.error("Only PDF, DOC, DOCX, JPG, JPEG files are allowed!");
      return Upload.LIST_IGNORE; // stops upload + doesn't add to list
    }

    // ✔️ Accept & set resume in state
    setUploadFileList([
      {
        uid: file.uid,
        name: file.name,
        status: "done",
        originFileObj: file, // required for backend upload
      },
    ]);

    return false; // prevent auto upload (manual upload later)
  };



  const openEditCandidateModal = (r: Candidate) => {
    const job = jobTitles.find((j) => j.id === r.designation_id);


    setEditCandidate(r);

    candidateForm.setFieldsValue({
      ...r,
      designation: job?.id,

      dob: r.dob ? dayjs(r.dob) : null, // ✅ FIX
    });

    setUploadFileList(
      r.resume
        ? [{
          uid: "-1",
          name: extractFilenameFromUrl(r.resume),
          status: "done",
          // Do NOT store originFileObj for existing resume.
          url: r.resume,
        }]
        : []
    );


    setCandidateModalVisible(true);
  };



  const handleSaveCandidate = async (values: any) => {
    if (candidateSaving) return;
    try {

      setCandidateSaving(true);
let resumePath = uploadFileList.length
  ? (uploadFileList[0]?.url || editCandidate?.resume || "")
  : "";
      const fileObj = uploadFileList[0]?.originFileObj;

      // 👉 If a new file is uploaded, then upload it
      if (fileObj && fileObj instanceof File) {
        const uploadRes = await uploadResume(fileObj);
        resumePath = uploadRes.data.file_url;
      }

   // ✅ Resume mandatory for BOTH add & update
if (!resumePath) {
  message.error("Resume upload is mandatory");
  setCandidateSaving(false); // VERY IMPORTANT
  return;
}



      const payload = {
        candidate_name: values.name,
        designation_id: values.designation,
        dob: values.dob?.format("YYYY-MM-DD"),
        email: values.email,
        mobile: values.mobile_number,
        address: values.address,
        application_status_id:
          values.application === "In Progress"
            ? 1
            : values.application === "Hired"
              ? 2
              : 3,
        upload_resume: resumePath,
      };

      // 🔥 DIFFERENT API BASED ON MODE
      if (editCandidate) {
        await updateCandidate(editCandidate.id, payload); // ✅ UPDATE
        message.success("Candidate updated successfully");
      } else {
        await addCandidate(payload); // ✅ CREATE
        message.success("Candidate added successfully");
      }

      setCandidateModalVisible(false);
      setEditCandidate(null);
      candidateForm.resetFields();
      setUploadFileList([]);

      const newCandidate = {
        id: editCandidate ? editCandidate.id : Date.now(), // temp id
        name: values.name,
        designation_id: values.designation,
        email: values.email,
        dob: values.dob?.format("YYYY-MM-DD"),
        address: values.address,
        mobile_number: values.mobile_number,
        resume: resumePath,
        application: values.application,
      };

      if (editCandidate) {
        // UPDATE MODE
        setCandidates((prev) =>
          prev.map((c) => (c.id === editCandidate.id ? newCandidate : c))
        );
      } else {
        // 🔥 ADD MODE → PREPEND
        setCandidates((prev) => [newCandidate, ...prev]);
      }

    } catch (error: any) {
      handleCandidateError(error);
    } finally {
      setCandidateSaving(false);
    }
  };




  /* --------------------------- INTERVIEW SAVE --------------------------- */
  const handleScheduleInterview = async (values: any) => {

    // 🚫 Block duplicates except when editing same interview
    const exists = interviews.some(
      i => i.candidate === values.candidate && i.id !== editInterview?.id
    );

    if (exists) {
      message.error("This candidate already has an interview scheduled!");
      return;
    }

    try {
      const payload = {
        candidate_id: values.candidate,
        designation_id: values.designation,
        stage_id: values.stage,
        status_id:
          values.status === "In Progress" ? 1 :
            values.status === "Selected" ? 2 : 3,
        interview_date: values.date.format("YYYY-MM-DD"),
        created_by: 1,
      };

      if (editInterview) {
        await updateInterviewSchedule(editInterview.id, payload);
        message.success("Interview updated successfully");
      } else {
        await createInterviewSchedule(payload);
        message.success("Interview scheduled successfully");
      }

      interviewForm.resetFields();
      setEditInterview(null);
      await fetchInterviewSchedules();

    } catch (error: any) {
      console.error("Interview save error:", error?.response?.data || error);
      message.error("Failed to save interview");
    }
  };



  const openFeedbackModalFor = (r: Interview) => {
    setSelectedInterviewForFeedback(r);
    feedbackForm.setFieldsValue(r.feedback ?? { rating: 0, comments: "" });
    setFeedbackModalOpen(true);
  };
  const submitFeedback = async () => {
    if (feedbackSaving) return;   // 🛑 block double click

    try {
      setFeedbackSaving(true);    // 🔒 disable OK

      const values = await feedbackForm.validateFields();
      if (!selectedInterviewForFeedback) return;

      const payload = {
        candidate_id: selectedInterviewForFeedback.candidate,
        designation_id: selectedInterviewForFeedback.role,
        stage_id: selectedInterviewForFeedback.stage,
        status_id:
          selectedInterviewForFeedback.status === "Selected" ? 2 :
            selectedInterviewForFeedback.status === "In Progress" ? 1 : 3,
        interview_date: selectedInterviewForFeedback.date,
        rating: values.rating,
        feedback: values.comments,
        created_by: 1,
      };

      await updateInterviewSchedule(selectedInterviewForFeedback.id, payload);

      message.success("Feedback saved");

      setFeedbackModalOpen(false);
      await fetchInterviewSchedules();

    } catch (e) {
      message.error("Failed to save feedback");
    } finally {
      setFeedbackSaving(false);   // 🔓 enable again
    }
  };







  const fetchInterviewSchedules = async () => {
    try {
      const res = await getInterviewSchedules();

      const mapped = res.data.map((i: any) => {

        return {
          id: i.id,
          candidate: i.candidate_id, // keep ID (used in column render)
          role: i.designation_id,  // store ID
          stage: i.stage_id,     // store ID



          status:
            i.status_id === 1
              ? "In Progress"
              : i.status_id === 2
                ? "Selected"
                : "Rejected",
          date: i.interview_date,
          feedback: i.rating
            ? { rating: i.rating, comments: i.feedback }
            : undefined,
        };
      });

      setInterviews(mapped);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch interview schedules");
    }
  };


  const handleCandidateError = (error: any) => {
    const backendError = error?.response?.data;


    if (typeof backendError?.detail === "string") {
      const msg = backendError.detail.toLowerCase();

      if (msg.includes("email")) {
        message.error("Candidate with this email already exists");
        return;
      }

      if (msg.includes("mobile")) {
        message.error("Candidate with this mobile number already exists");
        return;
      }

      message.error(backendError.detail);
      return;
    }
  }
  const getDesignationsForInterview = () => {
    // ✏️ EDIT MODE → show all
    if (editInterview) {
      return jobTitles;
    }

    // ➕ ADD MODE → show candidate's designation only
    const candidateId = interviewForm.getFieldValue("candidate");
    const candidate = candidates.find((c) => c.id === candidateId);

    if (!candidate) return [];

    return jobTitles.filter(
      (j) => j.id === candidate.designation_id
    );
  };


  /* --------------------------- RETURN JSX --------------------------- */
  return (
    <div className="recruitment-container" style={{ padding: 18 }}>
      <div className="recruit">
        <Title level={3}>Recruitment Center</Title>
        <div style={{ display: "flex", gap: 10 }}>
          <Select
            placeholder="Filter Jobs"
            style={{ width: 160 }}
            open={jobFilterOpen}
            onDropdownVisibleChange={setJobFilterOpen}
            onChange={(v) => setFilterStatus(v)}
            getPopupContainer={(node) => node.parentElement!}
          >
            <Option value="">All</Option>
            <Option value="Open">Open</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Closed">Closed</Option>
          </Select>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditJob(null);
              jobForm.resetFields();
              setJobModalVisible(true);
            }}
          >
            Add Job
          </Button>
        </div>
      </div>

      {/* JOBS */}
      <Card title="Job Listings" style={{ marginBottom: 16 }}>
        <Table
          columns={jobColumns}
          dataSource={filterStatus ? jobs.filter((j) => j.status === filterStatus) : jobs}
          rowKey="id"
        />
      </Card>

      {/* CANDIDATES */}
      <Card
        title="Candidates Applied"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditCandidate(null);
              candidateForm.resetFields();
              setUploadFileList([]);
              setCandidateModalVisible(true);
            }}>Add Candidate</Button>} style={{ marginBottom: 16 }}
      >
        <Table
          columns={candidateColumns}
          dataSource={candidates}
          rowKey="id"
        />
      </Card>

      {/* INTERVIEWS */}
      <div ref={scheduleRef} className="schedule-form">
        <Card title="Schedule Interview" style={{ marginBottom: 16 }}>
          <Form layout="vertical" form={interviewForm} onFinish={handleScheduleInterview}>
            <Row gutter={[16, 12]}>
              <Col xs={24} sm={12}>
                <Form.Item name="candidate" label="Candidate" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select candidate"
                    showSearch
                    optionFilterProp="label"
                    onChange={(candidateId) => {
                      const candidate = candidates.find((c) => c.id === candidateId);

                      if (candidate) {
                        interviewForm.setFieldsValue({
                          designation: candidate.designation_id, // 🔥 AUTO SET
                        });
                      }
                    }}
                    options={candidates.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                  />
                </Form.Item>

              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
                  <Select placeholder="Select designation">
                    {jobTitles.map((j) => (
                      <Option key={j.id} value={j.id}>
                        {j.position}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>




              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="date"
                  label="Interview Date"
                  rules={[{ required: true, message: "Interview date is required" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </Form.Item>

              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="stage" label="Stage" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select stage"
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    options={stages.map((s) => ({
                      value: s.id,
                      label: s.stage_name,
                    }))}

                  />

                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                  <Select>
                    <Option value="In Progress">In Progress</Option>
                    <Option value="Selected">Selected</Option>
                    <Option value="Rejected">Rejected</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Button
                  type="primary"
                  block
                  onClick={async () => {
                    await interviewForm.validateFields();
                    interviewForm.submit();
                  }}
                >
                  {editInterview ? "Update Interview" : "Schedule Interview"}
                </Button>

              </Col>
            </Row>
          </Form>
        </Card>
      </div>
      {/* INTERVIEWS TABLE */}
      <Card title="Scheduled Interviews">
        <Table columns={interviewColumns} dataSource={interviews} rowKey="id" scroll={{ x: 900 }} />
      </Card>


      {/* ===================== JOB MODAL ===================== */}
      <Modal
        title={editJob ? "Edit Job Opening" : "Add Job Opening"}
        open={jobModalVisible}
        onCancel={() => {
          if (!jobSaving) setJobModalVisible(false);
        }}
        onOk={() => jobForm.submit()}
        okButtonProps={{
          loading: jobSaving,
          disabled: jobSaving,
        }}
        cancelButtonProps={{
          disabled: jobSaving,
        }}
      >

        <Form form={jobForm} layout="vertical" onFinish={handleSaveJob}>

          <Form.Item name="dept" label="Department" rules={[{ required: true }]}>
            <Select
              placeholder="Select Department"
              onChange={(deptId) => {
                setSelectedDept(deptId);
                jobForm.setFieldsValue({ title: undefined }); // reset designation
              }}
            >
              {departments.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.department}
                </Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item name="title" label="Designation" rules={[{ required: true }]}>
            <Select placeholder="Select Designation" disabled={!selectedDept}>
              {filteredDesignations.map((j) => (
                <Option key={j.id} value={j.id}>
                  {j.position}
                </Option>
              ))}
            </Select>
          </Form.Item>




          <Form.Item name="status" label="Status" initialValue="Open">
            <Select>
              <Option value="Open">Open</Option>
              <Option value="In Progress">In Progress</Option>

              {/* ✅ Show Closed ONLY while editing */}
              {editJob && <Option value="Closed">Closed</Option>}
            </Select>
          </Form.Item>

        </Form>
      </Modal>

      {/* ===================== CANDIDATE MODAL ===================== */}
      <Modal
        title={editCandidate ? "Edit Candidate" : "Add Candidate"}
        open={candidateModalVisible}
        onCancel={() => {
          if (!candidateSaving) setCandidateModalVisible(false);
        }}
        footer={[
          <Button
            key="cancel"
            disabled={candidateSaving}
            onClick={() => setCandidateModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={candidateSaving}
            disabled={candidateSaving}
            onClick={() => candidateForm.submit()}
          >
            {editCandidate ? "Update" : "Save"}
          </Button>,
        ]}
      >


        <Form form={candidateForm} layout="vertical" onFinish={handleSaveCandidate} validateTrigger={["onChange", "onBlur"]} >
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
            <Select>
              {jobTitles.map((j) => (
                <Option key={j.id} value={j.id}>{j.position}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobile_number"
            label="Mobile"
            rules={[
              { required: true, message: "Mobile number is required" },
              {
                pattern: /^[6-9]\d{9}$/,
                message: "Enter valid 10-digit Indian mobile number",
              },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>

          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: "Date of birth is required" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current > dayjs().endOf("day")}
            />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="application" label="Status" initialValue="In Progress">
            <Select>
              <Option value="In Progress">In Progress</Option>
              <Option value="Hired">Hired</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Resume">
            <Upload
              beforeUpload={beforeUploadCandidateResume}
              fileList={uploadFileList}
              onRemove={() => setUploadFileList([])}
              accept=".pdf,.doc,.docx,.jpg,.jpeg"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Resume</Button>
            </Upload>

          </Form.Item>

        </Form>
      </Modal>

      {/* ===================== FEEDBACK MODAL ===================== */}
      <Modal
        open={feedbackModalOpen}
        title="Interview Feedback"
        onCancel={() => setFeedbackModalOpen(false)}
        onOk={submitFeedback}
        okButtonProps={{
          loading: feedbackSaving,   // ⏳ spinner
          disabled: feedbackSaving,  // 🔒 disable click
        }}
        cancelButtonProps={{
          disabled: feedbackSaving,
        }}
      >

        <Form form={feedbackForm} layout="vertical">
          <Form.Item
            name="rating"
            label="Rating"
            required
            rules={[
              {
                validator: (_, value) =>
                  value && value > 0
                    ? Promise.resolve()
                    : Promise.reject("Rating is required")
              }
            ]}
          >
            <Rate />
          </Form.Item>


          <Form.Item
            name="comments"
            label="Comments"
            rules={[{ required: true, message: "'comments' is required" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>

      </Modal>
    </div>
  );
}
function saveRatingAndComment() {
  throw new Error("Function not implemented.");
}

