import Project from "../models/Project.js";
import Task from "../models/Task.js";

const canAccessProject = (project, userId) => {
  if (!project) return false;
  return project.members.some((member) => member.toString() === userId.toString());
};

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, project: projectId, status } = req.body;

    if (!title || !assignedTo || !projectId) {
      return res.status(400).json({ message: "title, assignedTo and project are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.members.some((id) => id.toString() === assignedTo.toString())) {
      return res.status(400).json({ message: "Assigned member must belong to the project" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      dueDate: dueDate || null,
      assignedTo,
      project: projectId,
      status: status || "Pending",
      createdBy: req.user._id
    });

    const populated = await task.populate("assignedTo project createdBy", "name email role title");
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create task", error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { project, status, assignedTo, overdue } = req.query;
    const query = {};

    if (project) query.project = project;
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    if (overdue === "true") {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: "Completed" };
    }

    if (req.user.role !== "Admin") {
      const memberProjects = await Project.find({ members: req.user._id }).select("_id");
      query.project = { $in: memberProjects.map((item) => item._id) };
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email role")
      .populate("project", "title")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project._id);

    if (req.user.role !== "Admin") {
      const canAccess = canAccessProject(project, req.user._id);
      const isAssigned = task.assignedTo?.toString() === req.user._id.toString();
      if (!canAccess || (!isAssigned && req.body.status === undefined)) {
        return res.status(403).json({ message: "Not allowed to update this task" });
      }
      if (!isAssigned && req.body.status !== undefined) {
        return res.status(403).json({ message: "Only assignee can update task status" });
      }
    }

    const allowedFields = ["title", "description", "status", "dueDate", "assignedTo", "project"];
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        task[key] = req.body[key];
      }
    }

    await task.save();

    const updated = await task.populate([
      { path: "assignedTo", select: "name email role" },
      { path: "project", select: "title" },
      { path: "createdBy", select: "name" }
    ]);

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update task", error: error.message });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    let projectIds = null;

    if (req.user.role !== "Admin") {
      const projects = await Project.find({ members: req.user._id }).select("_id");
      projectIds = projects.map((project) => project._id);
    }

    const baseQuery = projectIds ? { project: { $in: projectIds } } : {};

    const [
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      myTasks
    ] = await Promise.all([
      Task.countDocuments(baseQuery),
      Task.countDocuments({ ...baseQuery, status: "Pending" }),
      Task.countDocuments({ ...baseQuery, status: "In Progress" }),
      Task.countDocuments({ ...baseQuery, status: "Completed" }),
      Task.countDocuments({
        ...baseQuery,
        dueDate: { $lt: new Date() },
        status: { $ne: "Completed" }
      }),
      Task.countDocuments({ ...baseQuery, assignedTo: req.user._id })
    ]);

    return res.json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      myTasks
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch dashboard", error: error.message });
  }
};
