import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import TaskForm from "../components/TaskForm";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/tasks", {
        headers: { Authorization: `${token}` },
      });
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
        headers: { Authorization: `${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task", error);
      alert("Failed to delete task.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between max-w-6xl mx-auto my-4">
        <div className="mx-2 font-bold text-2xl text-gray-600">Dashboard</div>
        <button
          className="mx-2 border-2 rounded-lg px-4 py-2 text-white bg-green-600 hover:bg-green-800 transition"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={handleFormClose}
            >
              ×
            </button>

            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {editingTask ? "Edit Task" : "Add Task"}
            </h2>

            <TaskForm
              task={editingTask}
              onClose={handleFormClose}
              token={token}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center items-center mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {tasks.map((task) => (
            <Card
              key={task._id}
              title={task.title}
              description={task.description}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task._id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
