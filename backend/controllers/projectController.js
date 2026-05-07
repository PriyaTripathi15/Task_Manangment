import Project from "../models/Project.js";

const canAccessProject = (project, userId) => {
  if (!project) return false;
  return project.members.some((member) => member.toString() === userId.toString());
};

export const createProject = async (req, res) => {
  try {
    const { title, description, members = [] } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const uniqueMembers = [...new Set([...members, req.user._id.toString()])];

    const project = await Project.create({
      title: title.trim(),
      description: description?.trim() || "",
      owner: req.user._id,
      members: uniqueMembers
    });

    const populated = await project.populate("owner members", "name email role");
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create project", error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const query = req.user.role === "Admin"
      ? {}
      : { members: req.user._id };

    const projects = await Project.find(query)
      .populate("owner", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email role")
      .populate("members", "name email role");

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (req.user.role !== "Admin" && !canAccessProject(project, req.user._id)) {
      return res.status(403).json({ message: "Not allowed to access this project" });
    }

    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch project", error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();

    if (Array.isArray(members)) {
      project.members = [...new Set([...members, project.owner.toString()])];
    }

    await project.save();
    const updated = await project.populate("owner members", "name email role");

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update project", error: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId) return res.status(400).json({ message: "memberId is required" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.members.some((id) => id.toString() === memberId)) {
      project.members.push(memberId);
    }

    await project.save();
    const updated = await project.populate("owner members", "name email role");
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add member", error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.json({ message: "Project deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete project", error: error.message });
  }
};
