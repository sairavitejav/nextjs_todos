"use client";

import { useEffect, useState } from "react";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  // Get all todos
  useEffect(() => {
    async function fetchTodos() {
      try {
        const res = await fetch("/api/todos");
        const data = await res.json();
        if (Array.isArray(data)) setTodos(data);
        else setTodos([]);
        // setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTodos();
  }, []);

  // POST a new todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const res = await fetch("api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTodo }),
    });
    const data = await res.json();
    setTodos((prev) => [data, ...prev]);
    setNewTodo("");
  };

  // Edit an Existing Todo
  async function toogleComplete(id: string, completed: boolean) {
    const res = await fetch("api/todos", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, completed: !completed }),
    });
    const updated = await res.json();

    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id
          ? {
              ...todo,
              completed: updated.completed,
            }
          : todo
      )
    );
  }

  // Delete a Todo
  async function deleteTodo(id: string) {
    await fetch("api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setTodos((prev) => prev.filter((todo) => todo._id !== id));
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">
          My Todos
        </h1>
        <form onSubmit={handleAddTodo} className="flex mb-4">
          <input
            type="text"
            placeholder="Add a new Task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
          >
            Add Task
          </button>
        </form>
        {loading ? (
          <p className="text-center text-gray-500">Loading Your Todos...</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-gray-500">No todos yet. Add one!</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="p-3 bg-gray-50 border rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toogleComplete(todo._id, todo.completed)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <span
                    className={`${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
