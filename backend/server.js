
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

const rawOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : defaultOrigins;

const allowedOrigins = [...new Set([...defaultOrigins, ...rawOrigins])]
  .map((o) => o.trim().replace(/\/+$/g, ""));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (process.env.ALLOW_ALL_CORS === "true") return callback(null, true);
    const normalized = origin.replace(/\/+$/g, "");
    if (allowedOrigins.includes(normalized)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

app.use(
  cors(corsOptions)
);

app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    service: "Team Task Manager Backend",
    status: "running",
    message: "Backend is up",
    health: "/api/health"
  });
});

app.get("/api", (_req, res) => {
  res.status(200).json({
    service: "Team Task Manager API",
    status: "running",
    auth: "/api/auth",
    projects: "/api/projects",
    tasks: "/api/tasks",
    users: "/api/users"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});

if (!mongoUri) {
  console.error("Missing MongoDB connection string. Set MONGO_URI (or MONGODB_URI) in backend/.env or Railway variables");
} else {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => console.log(err));
}
