"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Expanse {
  _id: string;
  amount: number;
  date: string;
  type: string;
  note?: string; // Note can be optional
}

export default function Home() {
  const [expanses, setExpanses] = useState<Expanse[]>([]);

  const updateComplateExpanseStatus = async (id: string, currentType: string) => {
    try {
      const newType = currentType === "expense" ? "income" : "expense"; // Toggle between types
      const res = await fetch(`http://localhost:3000/api/v1/expanse/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: newType }), // Send the updated type
        cache: "no-store",
      });

      if (res.ok) {
        setExpanses(
          expanses.map((expanse) =>
            expanse._id === id ? { ...expanse, type: newType } : expanse
          )
        );
      } else {
        console.log(`Failed to update expanse status: ${res.status}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteExpanse = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/expanse/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (res.ok) {
        setExpanses(expanses.filter((expanse) => expanse._id !== id));
      } else {
        console.log(`Failed to delete expanse: ${res.status}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getExpanses = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/expanse/", {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();

      if (res.ok) {
        setExpanses(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function formatDate(input: string): string {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    getExpanses();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-end mb-4">
        <Link
          href="/create"
          className="px-4 py-2 font-bold text-purple-400 hover:text-purple-500 rounded-md bg-pastel-purple hover:bg-pastel-purple-dark shadow-lg transition"
        >
          Add Expanse
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {expanses.map((task) => (
          <div
            key={task._id}
            className="w-full p-4 bg-white rounded-lg shadow-lg"
          >
            <h1
              className={`text-2xl mb-1 font-bold text-gray-800 ${
                task.type === "expense" ? "line-through text-gray-400" : ""
              }`}
            >
              {task.amount}
            </h1>
            <p className="mb-1 font-semibold text-gray-600">{formatDate(task.date)}</p>
            <span className="text-xs font-medium text-gray-500">
              Note: {task.note || "No notes available"} {/* Display note */}
            </span>
            <div className="flex justify-between gap-2 mt-3">
              <button
                onClick={() => updateComplateExpanseStatus(task._id, task.type)}
                className="flex-1 px-4 py-2 font-bold text-emerald-500 hover:text-emerald-600 bg-pastel-green hover:bg-pastel-green-dark rounded-md text-sm transition"
                type="button"
              >
                Mark as {task.type === "expense" ? "Income" : "Expense"}
              </button>
              <div className="flex gap-2">
                <Link
                  className="px-4 py-2 font-bold text-yellow-500 hover:text-yellow-600 bg-pastel-yellow hover:bg-pastel-yellow-dark rounded-md text-sm transition"
                  href={`/edit/${task._id}`}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="px-4 py-2 font-bold text-red-500 hover:text-red-600 bg-pastel-red hover:bg-pastel-red-dark rounded-md text-sm transition"
                  onClick={() => deleteExpanse(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
