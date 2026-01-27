import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading,setLoading] = useState(false);

  console.log("Current page:", page);

  const [totalPages, setTotalPages] = useState(1);

  // Fetch Todos with Search + Pagination
  const fetchTodos = async () => {
  setLoading(true);

  const res = await apiFetch(
    `https://mernbackend-aruu.duckdns.org/api/todos?page=${page}&limit=5&search=${search}`
  );

  const data = await res.json();

  setTodos(data.todos || []);
  setTotalPages(data.totalpages || 1);

  setLoading(false);
};

  useEffect(() => {
    fetchTodos();
  }, [page, search]);

  // Create Todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await apiFetch("https://mernbackend-aruu.duckdns.org/api/todos", {
      method: "POST",
      body: JSON.stringify({ title: newTitle }),
    });

    setNewTitle("");
    fetchTodos();
  };

  // Save Edited Todo
  const saveEdit = async (id) => {
    await apiFetch(`https://mernbackend-aruu.duckdns.org/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title: editText }),
    });

    setEditingId(null);
    setEditText("");
    fetchTodos();
  };

  // Toggle Status
  const toggleStatus = async (todo) => {
    await apiFetch(`https://mernbackend-aruu.duckdns.org/api/todos/${todo._id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !todo.completed }),
    });

    fetchTodos();
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    await apiFetch(`https://mernbackend-aruu.duckdns.org/api/todos/${id}`, {
      method: "DELETE"
    });

    fetchTodos();
  };

  const handleLogout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  await apiFetch("https://mernbackend-aruu.duckdns.org/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  localStorage.clear();
  window.location.reload();
};

   console.log("Current page:", page);
   console.log("Total Pages:", totalPages);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">My Todos</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search todos..."
          className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Create Todo */}
        <form onSubmit={createTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a new todo..."
            className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>

        {/* Todo List */}
       {loading ? (
         <div className="text-center py-6">
         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mx-auto"></div>
         <p className="text-sm text-gray-500 mt-2">Loading todos...</p>
         </div>
         ) : todos.length === 0 ? (
             <p className="text-gray-500">No todos found.</p>
            ) : (
  <div className="grid gap-4">
    {todos.map((todo) => (
      <div
        key={todo._id}
        className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
      >
        <div className="flex-1">
          {editingId === todo._id ? (
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border p-2 rounded"
            />
          ) : (
            <p className="font-medium text-gray-800">{todo.title}</p>
          )}

          <p className="text-xs text-gray-500 mt-1">
            Status:{" "}
            <span
              className={
                todo.completed
                  ? "text-green-600 font-semibold"
                  : "text-yellow-600 font-semibold"
              }
            >
              {todo.completed ? "Completed" : "Pending"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <button
            onClick={() => toggleStatus(todo)}
            className="text-sm text-purple-600"
          >
            {todo.completed ? "Mark Pending" : "Mark Done"}
          </button>

          {editingId === todo._id ? (
            <button
              onClick={() => saveEdit(todo._id)}
              className="text-sm text-green-600"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingId(todo._id);
                setEditText(todo.title);
              }}
              className="text-sm text-blue-600"
            >
              Edit
            </button>
          )}

          <button
            onClick={() => deleteTodo(todo._id)}
            className="text-sm text-red-600"
          >
            Delete
          </button>

          <span
            className={`px-3 py-1 text-xs rounded-full ${
              todo.completed
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {todo.completed ? "Done" : "Todo"}
          </span>
        </div>
      </div>
    ))}
  </div>
)}

<div className="flex justify-between items-center mt-6">
  <button
    onClick={() => {
      console.log("Previous clicked");
      setPage(page - 1);
    }}
    disabled={page === 1}
    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-sm text-gray-600">
    Page {page} of {totalPages}
  </span>

  <button
    onClick={() => {
      console.log("Next clicked");
      setPage(page + 1);
    }}
    disabled={page === totalPages}
    className="px-4 py-2 bg-gray-300 rounded"
  >
    Next
  </button>
</div>


      </main>
    </div>
  );
};

export default Todos;
