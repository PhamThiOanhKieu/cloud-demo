const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// kết nối database (tạm thời localhost)
mongoose.connect("mongodb://127.0.0.1:27017/cloud_demo");

const TaskSchema = new mongoose.Schema({
  name: String
});

const Task = mongoose.model("Task", TaskSchema);

// API test
app.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/add", async (req, res) => {
  const task = new Task({ name: req.body.name });
  await task.save();
  res.send("Added");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});