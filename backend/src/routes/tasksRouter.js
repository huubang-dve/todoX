import express from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasksControllers.js";

const router = express.Router();

// Tạo CRUD => "Create, Read, Update, Delete" <=> "POST, GET, PUT/PATCH, DELETE"
router.get("/", getAllTasks);

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;
