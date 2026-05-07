import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("Missing MongoDB connection string. Set MONGO_URI (or MONGODB_URI) in backend/.env");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(mongoUri);

  await Promise.all([
    Task.deleteMany({}),
    Project.deleteMany({}),
    User.deleteMany({})
  ]);

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const [admin, memberOne, memberTwo] = await User.create([
    {
      name: "Aarav Shah",
      email: "admin@teamtask.local",
      password: passwordHash,
      role: "Admin"
    },
    {
      name: "Neha Patel",
      email: "neha@teamtask.local",
      password: passwordHash,
      role: "Member"
    },
    {
      name: "Rohan Mehta",
      email: "rohan@teamtask.local",
      password: passwordHash,
      role: "Member"
    }
  ]);

  const [websiteLaunch, internalOps] = await Project.create([
    {
      title: "Website Launch",
      description: "Marketing site refresh with final QA and go-live checklist.",
      owner: admin._id,
      members: [memberOne._id, memberTwo._id]
    },
    {
      title: "Internal Ops",
      description: "Day-to-day team coordination, reporting, and admin improvements.",
      owner: admin._id,
      members: [memberOne._id]
    }
  ]);

  const today = new Date();
  const addDays = (days) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };

  await Task.create([
    {
      title: "Finalize homepage copy",
      description: "Review the new hero section and approve final wording.",
      status: "In Progress",
      dueDate: addDays(2),
      assignedTo: memberOne._id,
      project: websiteLaunch._id,
      createdBy: admin._id
    },
    {
      title: "QA responsive layout",
      description: "Check tablet and mobile breakpoints before release.",
      status: "Pending",
      dueDate: addDays(4),
      assignedTo: memberTwo._id,
      project: websiteLaunch._id,
      createdBy: admin._id
    },
    {
      title: "Prepare weekly status report",
      description: "Summarize progress and blockers for the leadership update.",
      status: "Completed",
      dueDate: addDays(-1),
      assignedTo: memberOne._id,
      project: internalOps._id,
      createdBy: admin._id
    },
    {
      title: "Clean up backlog tasks",
      description: "Move stale tasks and close out low-priority items.",
      status: "Pending",
      dueDate: addDays(-3),
      assignedTo: memberOne._id,
      project: internalOps._id,
      createdBy: admin._id
    }
  ]);

  console.log("Seed complete");
  console.log("Login accounts:");
  console.log("Admin: admin@teamtask.local / Password123!");
  console.log("Member: neha@teamtask.local / Password123!");
  console.log("Member: rohan@teamtask.local / Password123!");

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
