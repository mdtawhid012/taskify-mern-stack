import express from "express";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "./model/user.js";
import { Task } from "./model/task.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware/auth.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).send("All fields are required.");
    }
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).send("user already exists.");
    } else {
      const hashedPass = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        username,
        password: hashedPass,
      });

      return res
        .status(201)
        .send({ message: "User created succesfully", user });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/api/auth/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("All fields are required.");
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User doesn't exist.");
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).send("Incorrect Credentials.");
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).send({
      message: "User signed In.",
      token,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    return res.status(200).send({
      tasks,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/api/tasks/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!task) {
      return res.status(404).send({
        message: "Task does not exists.",
      });
    }
    return res.status(200).send({
      task,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to fetch task.",
    });
  }
});

app.post("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).send({
        message: "All the fields are required.",
      });
    }
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
    });

    return res.status(201).send({
      message: "Task created succesfully",
      task,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;

  if (!title && !description) {
    return res.status(400).send({
      message: "At least one of title or description must be provided.",
    });
  }

  try {
    const updateTask = await Task.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
      },
      {
        $set: { title, description, status },
      },
      {
        new: true,
      }
    );

    if (!updateTask) {
      return res.status(400).send({
        message: "Task not found or you don't have permission to update it.",
      });
    }

    return res.status(200).send({
      message: "Updated Task successfully.",
      updateTask,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error updating task.",
    });
  }
});

app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const deleteTask = await Task.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deleteTask) {
      return res.status(403).send({
        message: "Failed to delete task or permission denied.",
      });
    }

    return res.status(200).send({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error deleting task.",
    });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
