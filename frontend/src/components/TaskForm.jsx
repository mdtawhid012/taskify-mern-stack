import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskForm({ task, onClose, token }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      if (task) {
        await axios.put(
          `http://localhost:3000/api/tasks/${task._id}`,
          { title, description },
          { headers: { Authorization: `${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/tasks",
          { title, description },
          { headers: { Authorization: `${token}` } }
        );
      }
      onClose();
    } catch (error) {
      console.error("Task submission failed", error);
      alert("Something went wrong while saving the task.");
    }
  };

  return (
    <div className="flex justify-center mt-6 bg-gray-100 max-w-96 mx-auto shadow-lg rounded-lg">
      <form className="flex flex-col py-4 w-full" onSubmit={handleSubmit}>
        <input
          className="border-2 rounded-md mx-4 my-2 p-2"
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border-2 rounded-md mx-4 my-2 p-2 pb-12 inline-block align-top"
          id="description"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-between mx-4 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white py-1 px-4 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white py-1 px-4 rounded-lg hover:bg-green-800"
          >
            {task ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
