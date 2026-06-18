import axios from "axios";
import api from "./taskcreation";

const API_URL = "https://belnova-hrms-be-7.onrender.com";



// ================= DESIGNATIONS (FIXED) =================

export const getDesignations = () =>
  axios.get(`${API_URL}/designations/`);
export const getAttendance = () => {
  return api.get("/attendance/");
};
export const createDesignation = (data: {
  designation_name: string;
  dept_id: number;
}) =>
  axios.post(`${API_URL}/designations/`, data);

// UPDATE STATUS
export const updateDesignationStatus = (
  id: number,
  is_active: boolean
) =>
  axios.put(`${API_URL}/designations/${id}/status`, {
    is_active,
  });



// ================= INTERVIEW STAGES =================
export const createInterviewStage = (data: {
  stage_name: string;
  description?: string;
  is_active: boolean;
}) =>
  axios.post(
    `${API_URL}/interview-stage`,
    data
  );

export const getInterviewStages = () =>
  axios.get(`${API_URL}/interview-stage`);

export const deleteInterviewStage = (id: number) =>
  axios.delete(
    `${API_URL}/interview-stage/interview-stage/${id}`
  );

  // ✅ UPDATE INTERVIEW STAGE STATUS
export const updateInterviewStageStatus = (
  id: number,
  is_active: boolean
) =>
  axios.put(
    `${API_URL}/interview-stage/${id}/status`,
    { is_active }
  );



// ✅ GET ALL DEPARTMENTS
export const getDepartments = () =>
  axios.get(`${API_URL}/departments/`);


export const createDepartment = (data: {
  department: string;
  is_active: boolean;
}) =>
  axios.post(`${API_URL}/departments/`, data);

// ✅ UPDATE STATUS (ACTIVE / INACTIVE)
export const updateDepartmentStatus = (
  id: number,
  is_active: boolean
) =>
  axios.put(`${API_URL}/departments/${id}/status`, {
    is_active,
  });

// ================= ROLES =================
export const getRoles = () =>
  axios.get(`${API_URL}/roles/`);

export const createRole = (data: {
  role_name: string;
  is_active: boolean;
}) =>
  axios.post(`${API_URL}/roles/`, data);

export const updateRoleStatus = (
  id: number,
  is_active: boolean
) =>
  axios.put(`${API_URL}/roles/${id}`, {
    is_active,
  });


  // ================= PROJECTS =================
export const getProjects = () =>
  axios.get(`${API_URL}/projects/`);

export const createProject = (data: {
  project_name: string;
  is_active: boolean;
}) =>
  axios.post(`${API_URL}/projects/`, data);

export const updateProjectStatus = (
  id: number,
  is_active: boolean
) =>
  axios.put(`${API_URL}/projects/${id}/status`, {
    is_active,
  });



  // PROJECT MODULES
export const getProjectModules = () =>
  api.get("/master-project-module/");

export const createProjectModule = (data: {
  project_module: string;
  project_id: number;
  is_active: boolean;
}) =>
  api.post("/master-project-module/", data);

export const updateProjectModuleStatus = (id: number, status: boolean) =>
  api.patch(`/master-project-module/${id}/status`, null, {
    params: { is_active: status ? "true" : "false" },
  });




export const createJobOpening = (data: {
  designation_id: number;
  department_id: number;
  status_id: number;
  is_active: boolean;
}) =>
  axios.post(`${API_URL}/job-openings`, data);

export const getJobOpenings = () =>
  axios.get(`${API_URL}/job-openings/job-openings`);


export const updateJobOpening = (
  id: number,
  data: {
    designation_id: number;
    department_id: number;
    status_id: number;
    is_active: boolean;
  }
) =>
  axios.put(
    `${API_URL}/job-openings/${id}/update`,
    data
  );



// ================= CANDIDATES =================
export const getCandidates = () => axios.get(`${API_URL}/candidates/`);
export const addCandidate = (data: any) =>
  axios.post(`${API_URL}/candidates/`, data);
export const updateCandidate = (id: number, data: any) =>
  axios.put(`${API_URL}/candidates/${id}`, data);
export const deleteCandidate = (id: number) =>
  axios.delete(`${API_URL}/candidates/${id}`);

/*upload resume*/
export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(
    `${API_URL}/upload/resume`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// ================= INTERVIEW SCHEDULE =================
export const createInterviewSchedule = (data: any) =>
  axios.post(`${API_URL}/interview-schedule/schedule`, data);
export const getEmployeeStatuses = () =>
  axios.get(`${API_URL}/employees/master-status`);

export const getInterviewSchedules = () =>
  axios.get(`${API_URL}/interview-schedule/`);

export const updateInterviewSchedule = (id: number, data: any) =>
  axios.put(`${API_URL}/interview-schedule/${id}`, data);


export const deleteInterviewSchedule = (id: number) =>
  axios.delete(`${API_URL}/interview-schedule/${id}`);

/*payroll*/




// ➤ CREATE / SAVE PAYSLIP
export const createPayslip = (data: {
  emp_id: number;
  department_id: number;
  basic_salary: number;
  hra: number;
  bonus: number;
  pf: number;
  esi: number;
  other_deductions: number;
}) =>
  axios.post(`${API_URL}/payroll/payslip`, data);

/* ================= PAYROLL ================= */

// ➤ GET ALL PAYROLL (MONTH + YEAR)


export const getPayrollForMonth = (monthId: number, yearId: number) => {
  return api.get(
    `/payroll/calculate-all?month_id=${monthId}&year_id=${yearId}`
  );
};




export const getPayslipByEmpId = (
  empId: number,
  month: number,
  year: number
) => {
  return axios.get(
    `${API_URL}/payroll/calculate/${empId}?month_id=${month}&year_id=${year}`
  );
};



export const getEmployees = () =>
  axios.get(`${API_URL}/employees/`);
// GET all performance ratings
export const getPerformanceRatings = () =>
  axios.get(`${API_URL}/performance-ratings/`);

// POST a new rating
export const createEmployeeRating = (data: {
  emp_id: number;
  designation_id: number;
  rating: number;
  reviewer_id: number;
}) =>
  axios.post(`${API_URL}/employee-rating/`, data);

// ================= PERFORMANCE ANALYTICS =================

export const getTopPerformers = () =>
  axios.get(`${API_URL}/top-performers/`);

export const getAverageRating = () =>
  axios.get(`${API_URL}/average-rating/`);

export const getPendingReviews = () =>
  axios.get(`${API_URL}/pending-reviews/`);


  // ================= ANALYTICS =================
export const getActiveEmployeeCount = () =>
  axios.get(`${API_URL}/employee-count/active`);



// ================= DASHBOARD =================
export const getDashboardSummary = () =>
  axios.get(`${API_URL}/dashboard/summary`);
// ================= NEW JOINERS =================

export const loginUser = (data: {
  email: string;
  password: string;
}) =>
  axios.post(`${API_URL}/auth/login`, data);




  export const getPayrollCost = () =>
  axios.get(`${API_URL}/payroll/cost`);

export const getNewJoinersCount = (year: number, month: number) =>
  axios.get(
    `${API_URL}/employee/new-joiners/count?year=${year}&month=${month}`
  );


export const getRecentActivities = async () => {
  const res = await axios.get(`${API_URL}/employee-activity/`);
  return res.data;
};

// ================= TASKS =================
export const createTask = (data: {
  title: string;
  description: string;
  task_type_id: number;
  project_id: number;
  emp_id: number;
  reporting_manager_id: number;
  task_manager_id: number;
  status_id: number;
  due_date: string;
  efforts_in_days: number;
  is_active: boolean;
}) =>
  api.post("/tasks/", data);


export const getTaskTypes = () => {
  return axios.get(`${API_URL}/master-task-type/`);
};
export const getTaskStatuses = () => {
  return axios.get(`${API_URL}/master-status/`);
};

export const getTaskHistoryByFilters = (params: {
  employee_id?: number;
  manager_id?: number;
  project_id?: number;
  project_module_id?: number;
  status_id?: number;
}) => {
  return axios.get(`${API_URL}/task-history/filter`, {
    params,
  });
};


export const getTaskHistoryByTaskId = (taskId: number) =>
  axios.get(`/tasks/${taskId}/history`);

