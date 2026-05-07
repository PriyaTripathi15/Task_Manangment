
import React, { useEffect, useMemo, useState } from "react";
import api from "../api";

const defaultSummary = {
  totalTasks: 0,
  pendingTasks: 0,
  inProgressTasks: 0,
  completedTasks: 0,
  overdueTasks: 0,
  myTasks: 0
};

export default function Dashboard({ currentUser }) {
  const [summary, setSummary] = useState(defaultSummary);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    members: []
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    dueDate: "",
    status: "Pending"
  });

  const isAdmin = currentUser?.role === "Admin";

  const loadData = async () => {
    setError("");

    try {
      const requests = [
        api.get("/tasks/dashboard/summary"),
        api.get("/projects"),
        api.get("/tasks")
      ];

      if (isAdmin) requests.push(api.get("/users"));

      const responses = await Promise.all(requests);

      setSummary(responses[0].data);
      setProjects(responses[1].data);
      setTasks(responses[2].data);
      if (isAdmin) setUsers(responses[3].data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const projectMembers = useMemo(() => {
    if (!taskForm.project) return [];
    return projects.find((project) => project._id === taskForm.project)?.members || [];
  }, [projects, taskForm.project]);

  const createProject = async () => {
    try {
      await api.post("/projects", projectForm);
      setProjectForm({ title: "", description: "", members: [] });
      loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create project");
    }
  };

  const createTask = async () => {
    try {
      await api.post("/tasks", taskForm);
      setTaskForm({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        dueDate: "",
        status: "Pending"
      });
      loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create task");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update task status");
    }
  };

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 text-slate-100 md:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-300">
            Signed in as {currentUser.name} ({currentUser.role})
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-red-200">{error}</p>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <SummaryCard label="Total" value={summary.totalTasks} />
        <SummaryCard label="Pending" value={summary.pendingTasks} />
        <SummaryCard label="In Progress" value={summary.inProgressTasks} />
        <SummaryCard label="Completed" value={summary.completedTasks} />
        <SummaryCard label="Overdue" value={summary.overdueTasks} accent="text-orange-300" />
        <SummaryCard label="My Tasks" value={summary.myTasks} accent="text-teal-300" />
      </section>

      {isAdmin && (
        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/70 p-5">
            <h2 className="mb-4 text-xl font-bold">Create Project</h2>
            <input
              className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
              placeholder="Project title"
              value={projectForm.title}
              onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })}
            />
            <textarea
              className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
              placeholder="Description"
              rows={3}
              value={projectForm.description}
              onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })}
            />
            <select
              multiple
              className="mb-3 h-36 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
              value={projectForm.members}
              onChange={(event) => {
                const selected = [...event.target.selectedOptions].map((option) => option.value);
                setProjectForm({ ...projectForm, members: selected });
              }}
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
            <button onClick={createProject} className="rounded-lg bg-teal-400 px-4 py-2 font-semibold text-slate-900">
              Save Project
            </button>
          </div>

          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/70 p-5">
            <h2 className="mb-4 text-xl font-bold">Create Task</h2>
            <input
              className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
              placeholder="Task title"
              value={taskForm.title}
              onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
            />
            <textarea
              className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
              placeholder="Task description"
              rows={2}
              value={taskForm.description}
              onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <select
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
                value={taskForm.project}
                onChange={(event) => setTaskForm({ ...taskForm, project: event.target.value, assignedTo: "" })}
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.title}</option>
                ))}
              </select>

              <select
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
                value={taskForm.assignedTo}
                onChange={(event) => setTaskForm({ ...taskForm, assignedTo: event.target.value })}
              >
                <option value="">Assign member</option>
                {projectMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
                value={taskForm.dueDate}
                onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })}
              />

              <select
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
                value={taskForm.status}
                onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button onClick={createTask} className="mt-4 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-slate-900">
              Save Task
            </button>
          </div>
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-slate-700/40 bg-slate-900/70 p-5">
        <h2 className="mb-4 text-xl font-bold">Tasks</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-300">
              <tr>
                <th className="px-2 py-2">Title</th>
                <th className="px-2 py-2">Project</th>
                <th className="px-2 py-2">Assignee</th>
                <th className="px-2 py-2">Due</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="border-t border-slate-700/40">
                  <td className="px-2 py-2">{task.title}</td>
                  <td className="px-2 py-2">{task.project?.title || "-"}</td>
                  <td className="px-2 py-2">{task.assignedTo?.name || "-"}</td>
                  <td className="px-2 py-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                  <td className="px-2 py-2">
                    <select
                      className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1"
                      value={task.status}
                      onChange={(event) => updateStatus(task._id, event.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, accent = "text-slate-100" }) {
  return (
    <article className="rounded-2xl border border-slate-700/40 bg-slate-900/70 p-4">
      <p className="text-sm uppercase tracking-wide text-slate-300">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </article>
  );
}
