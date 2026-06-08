import { useEffect, useState } from "react";
import "./TaskBoard.css";
import { getProjects, Project } from "../../services/projectService";
import {
  getProjectModules,
  ProjectModule,
} from "../../services/moduleService";
import { getEmployees, Employee } from "../../services/employeeService";


import {
  getTasks,
  createTask,
  BackendTask,
} from "../../services/taskboardService";

import {
  getStatuses,
  getTaskTypes,
  Status,
  TaskType,
} from "../../services/masterService";



interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "QA" | "DONE";
}



const TaskBoard = () => {
  const token = localStorage.getItem("hrms-token") || "";
  const [modules, setModules] = useState<ProjectModule[]>([]);
   const loggedInEmpId = Number(localStorage.getItem("hrms-employee-id"));
  const [employees, setEmployees] = useState<Employee[]>([]);
const [selectedEmpId, setSelectedEmpId] = useState<number>(loggedInEmpId);
 const [searchText, setSearchText] = useState("");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    taskType: "",
    statusId: "",
    dueDate: "",
    description: "",
    effortDays: "",
    projectId: "",
    moduleId: "",
  });
//  const loggedInEmpId = Number(localStorage.getItem("hrms-employee-id"));



 const mapStatus = (statusId: number): Task["status"] => {
  if (statusId === 2) return "TODO";
  if (statusId === 1) return "IN_PROGRESS";
  if (statusId === 4) return "QA";
  if (statusId === 12) return "DONE";
  return "TODO";
};

useEffect(() => {
  loadTasks();
}, [selectedEmpId]);

  useEffect(() => {
    loadMasterData();
  }, []);

 const loadMasterData = async () => {
  try {
   const [statusRes, typeRes, projectRes, moduleRes, empRes] =
  await Promise.all([
    getStatuses(),
    getTaskTypes(),
    getProjects(token),
    getProjectModules(token),
    getEmployees(token),
  ]);

setEmployees(empRes.filter(e => e.status === "Active"));

    setStatuses(statusRes);
    setTaskTypes(typeRes);
    setProjects(projectRes.filter((p) => p.is_active));
    setModules(moduleRes.filter((m) => m.is_active));
  } catch (err) {
    console.error("Master data error", err);
  }
};

const filteredModules = modules.filter(
  (m) => m.project_id === Number(formData.projectId)
);
// // 🔥 Employee filter states (ADD ONLY)
// const [allTasks, setAllTasks] = useState<BackendTask[]>([]);
// const [selectedEmpId, setSelectedEmpId] = useState<number>(loggedInEmpId);


const formatToDisplayDate = (value: string) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
};

const formatToApiDate = (value: string) => {
  if (!value) return "";
  const [day, month, year] = value.split("-");
  return `${year}-${month}-${day}`;
};


 const loadTasks = async () => {
  try {
    const data: BackendTask[] = await getTasks(token);

    const filtered = data.filter(
      (task) => task.emp_id === selectedEmpId
    );

    const mapped: Task[] = filtered.map((t) => ({
      id: `HRMS-${t.id}`,
      title: t.title,
      status: mapStatus(t.status_id),
    }));

    setTasks(mapped);
  } catch (err) {
    console.error("Task load error", err);
  }
};





  /* ================= FORM HANDLER ================= */
  const loggedInUserName =
  localStorage.getItem("hrms-user-name") || "";


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

const getByStatus = (s: Task["status"]) =>
  tasks.filter(
    (t) =>
      t.status === s &&
      (t.title.toLowerCase().includes(searchText.toLowerCase()) ||
        t.id.toLowerCase().includes(searchText.toLowerCase()))
  );



const handleCreateTask = async () => {
  try {
    await createTask(token, {
      title: formData.title,
      description: formData.description,
      task_type_id: Number(formData.taskType),
      status_id: Number(formData.statusId),
      project_id: Number(formData.projectId),
      project_module_id: Number(formData.moduleId),
      emp_id: selectedEmpId,
      task_manager_id: Number(localStorage.getItem("hrms-employee-id")),
      reporting_manager_id: Number(localStorage.getItem("hrms-employee-id")),
      due_date: formData.dueDate,
      efforts_in_days: Number(formData.effortDays),
      is_active: true,
    });

     alert("Task created successfully");

    // ✅ CLOSE MODAL
    setShowModal(false);

    // ✅ RESET FORM
    setFormData({
      title: "",
      taskType: "",
      statusId: "",
      dueDate: "",
      description: "",
      effortDays: "",
      projectId: "",
      moduleId: "",
    });

    // ✅ RELOAD FROM DATABASE (PURE DATA)
    loadTasks();

  } catch (err) {
    console.error("Create task failed", err);
  }
};


  /* ================= RENDER ================= */

  return (
    <div className="hrms-board-page">
      {/* <div className="task-search-bar">
  <input
    type="text"
    placeholder="Search by task name or HRMS ID..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />
</div> */}

      <h2 className="page-title">HRMS Task Board</h2>
    <div className="task-search-bar">
  <input
    type="text"
    placeholder="Search by task name or HRMS ID..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />
</div>





      <div className="hrms-board">
        {(["TODO", "IN_PROGRESS", "QA", "DONE"] as Task["status"][]).map(
          (col) => (
            <div key={col} className="hrms-column">
              <div className="column-header">
                {col.replace("_", " ")}
                <span>{getByStatus(col).length}</span>
              </div>

              {getByStatus(col).map((task) => (
                <div key={task.id} className="hrms-card">
                  <div className="hrms-card-title">{task.title}</div>
                  <div className="hrms-card-footer">
                    <span className="issue-key">{task.id}</span>
                  </div>
                </div>
              ))}

              {col === "TODO" && (
                <div className="create-issue" onClick={() => setShowModal(true)}>
                  + Create Task
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* ================= CREATE TASK POPUP ================= */}

       {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div
      className="modal large"
      onClick={(e) => e.stopPropagation()}
    >
            <h3>Create Task</h3>
            <div className="modal-body-scroll">
            <div className="form-grid">
              <div>
                <label>* Task Name</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>* Status</label>
                <select
  name="statusId"
  className="compact-select"
  onChange={handleChange}
>
  <option value="">Select status</option>
  {statuses.map((s) => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
  ))}
</select>

              </div>
                 <div>
                <label>* Task Type</label>
                <select
  name="taskType"
  className="compact-select"
  onChange={handleChange}
>
  <option value="">Select task type</option>
  {taskTypes.map((t) => (
    <option key={t.id} value={t.id}>
      {t.task_type}
    </option>
  ))}
</select>

              </div>

              <div>
                <label>* Due Date</label>
  <input
  type="date"
  name="dueDate"
  value={formData.dueDate}
  onChange={handleChange}
  min={new Date().toISOString().split("T")[0]}
/>


              </div>

              <div className="full-width">
                <label>* Description</label>
                <textarea
                  name="description"
                  onChange={handleChange}
                ></textarea>
              </div>

              <div>
                <label>* Efforts (Days)</label>
                <input
  type="number"
  name="effortDays"
 
  onChange={handleChange}
/>

              </div>

              <div>
                <label>Task Manager</label>
                <input
  value={loggedInUserName}
  disabled
  className="readonly-input"
/>

              </div>

              <div>
                <label>* Project</label>
                <select name="projectId"
               
                 onChange={handleChange}>
  <option value="">Select project</option>

  {projects.map((p) => (
    <option key={p.id} value={p.id}>
      {p.project_name}
    </option>
  ))}
</select>

              </div>

              <div>
                <label>* Module</label>
                <select
  name="moduleId"

  onChange={handleChange}
  disabled={!formData.projectId}
>
  <option value="">
    {formData.projectId ? "Select module" : "Select project first"}
  </option>

  {filteredModules.map((m) => (
    <option key={m.id} value={m.id}>
      {m.project_module}
    </option>
  ))}
</select>

              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button className="primary" onClick={handleCreateTask}>
                Submit
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;