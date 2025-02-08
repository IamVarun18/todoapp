"use client"; // ✅ Ensures client-side rendering

import { useState, useEffect } from "react";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [updatedText, setUpdatedText] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(dateString));
  };

  const addTask = async () => {
    if (!task.trim()) return;

    const newTask = { text: task, createdAt: new Date().toISOString() };

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    const savedTask = await res.json();
    setTasks([...tasks, savedTask]);
    setTask("");
  };

  const removeTask = async (id) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setTasks(tasks.filter((t) => t._id !== id));
  };

  const startEditing = (task) => {
    setEditingTask(task._id);
    setUpdatedText(task.text);
  };

  const updateTask = async (id) => {
    if (!updatedText.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text: updatedText }),
    });

    const updatedTask = await res.json();
    setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
    setEditingTask(null);
    setUpdatedText("");
  };

  return (
    <div className="w-[80vw] mx-auto mt-10 bg-white/30 backdrop-blur-md p-5 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-[#5a4d93]">Stay organized, stay productive - Manage your tasks with ease!</h2>
      <div className="flex gap-2 text-2xl">
        <input
          type="text"
          className="border p-2 flex-grow rounded"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button className="bg-[#6d52d7] text-white px-4 py-2 rounded" onClick={addTask}>
          Add
        </button>
      </div>
      <ul className="mt-4">
        {tasks.map((t) => (
          <li key={t._id} className="flex flex-col text-3xl bg-gray-100 text-[#81c0fd] p-2 rounded mt-2">
            {editingTask === t._id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="border p-2 flex-grow rounded"
                  value={updatedText}
                  onChange={(e) => setUpdatedText(e.target.value)}
                />
                <button className="bg-green-500 text-white px-3 py-2 rounded" onClick={() => updateTask(t._id)}>
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span>{t.text}</span>
                <div className="flex gap-2">
                  <button className="text-[#836047] text-xl" onClick={() => startEditing(t)}>✏️ Update</button>
                  <button className="text-red-500 text-xl" onClick={() => removeTask(t._id)}>  🗑️ Delete</button>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Created: {formatDate(t.createdAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
