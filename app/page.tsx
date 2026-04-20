"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const API = "http://localhost:8080/todos";

  const fetchTodos = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async (e: any) => {
    e.preventDefault();
    if (!title) return;
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, done: false }),
    });
    setTitle("");
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  const toggleDone = async (todo: any) => {
    await fetch(`${API}/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...todo, done: !todo.done }),
    });
    fetchTodos();
  };

  const updateTodo = async (id: number) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle, done: false }),
    });
    setEditingId(null);
    setEditingTitle("");
    fetchTodos();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-green-50 to-blue-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Todo App</h1>

        <form onSubmit={createTodo} className="flex gap-2 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add task..."
            className="flex-1 px-3 py-2 rounded-xl text-slate-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <button className="px-4 py-2 rounded-xl bg-linear-to-r from-red-400 to-orange-400 text-white">Add</button>
        </form>

        <ul className="space-y-2">
          {todos.map((todo: any) => (
            <li key={todo.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-100">
              <input type="checkbox" checked={todo.done} onChange={() => toggleDone(todo)} className="accent-green-400" />

              {editingId === todo.id ? (
                <>
                  <input value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} className="flex-1 px-2 py-1 text-slate-700 rounded-lg border border-gray-200 focus:outline-none" />
                  <button onClick={() => updateTodo(todo.id)} className="text-sm text-green-500">
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span className={`flex-1 ${todo.done ? "line-through text-gray-400" : "text-gray-700"}`}>{todo.title}</span>
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingTitle(todo.title);
                    }}
                    className="text-sm text-blue-400"
                  >
                    Edit
                  </button>
                </>
              )}

              <button onClick={() => deleteTodo(todo.id)} className="text-sm text-red-400">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
