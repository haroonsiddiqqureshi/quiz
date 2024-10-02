"use client";

import Link from "next/link";
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
}
