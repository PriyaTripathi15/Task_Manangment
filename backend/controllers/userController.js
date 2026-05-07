import User from "../models/User.js";

export const listUsers = async (_req, res) => {
  try {
    const users = await User.find().select("_id name email role").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};
