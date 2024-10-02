"use client";

import Link from "next/link";
<<<<<<< HEAD
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
=======
import axios from "axios";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface transactionsType {
  _id: string,
  amount: number,
  date: string,
  type: "income" | "expense",
  note: string,
}

export default function Home() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<transactionsType[]>([]);

  const router = useRouter()

  function formatDate(input: string): string {
    const date = new Date(input);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const deleteTransaction = async (id: string) => {
    if (confirm("confirm to delete")) {
      try {
        const res = await axios.delete(`/api/transaction/${id}`);
        if (res.status === 200) {
          setTransactions(transactions.filter((transaction) => transaction._id !== id));
          router.push("/");
        } else {
          console.log(`Failed to delete transaction: ${res.status}`);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  };

  const getTransactions = async () => {
    if (session?.user?.id) {
      try {
        const res = await axios.get(`api/transaction/${session?.user?.id}`)
        setTransactions(res.data)
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    getTransactions()
  }, [session]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-semibold">
        <p className="text-lg">Please login</p>
        <Link className="underline text-blue-600" href="/login">Login</Link>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="container mx-auto bg-white p-6 rounded shadow-md min-h-full">
          <div className="flex mb-5 justify-between items-center">
            <p className="text-lg font-semibold">Welcome, {session.user?.email}!</p>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
          <div className="mb-5 flex space-x-4">
            <Link href="./create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
              Create Transaction
            </Link>
            <Link href="./chart" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200">
              View Chart
            </Link>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Transaction Table</h2>
            <div className="bg-white p-6">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-4 py-2 font-medium">Amount</th>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 font-medium">Note</th>
                    <th className="px-4 py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr key={transaction._id} className="border-b border-gray-200">
                        <td className="px-4 py-2">{transaction.amount}</td>
                        <td className="px-4 py-2">{formatDate(transaction.date)}</td>
                        <td className={`px-4 py-2 font-bold ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
                          {transaction.type}
                        </td>
                        <td className="px-4 py-2">{transaction.note}</td>
                        <td className="px-4 py-2 space-x-2">
                          <Link
                            className="text-yellow-500 underline hover:text-yellow-600 font-semibold"
                            href={`/edit/${transaction._id}`}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteTransaction(transaction._id)}
                            className="text-red-600 underline hover:text-red-700 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-600 py-4">No transactions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
>>>>>>> 1463aec (First commit)
}
