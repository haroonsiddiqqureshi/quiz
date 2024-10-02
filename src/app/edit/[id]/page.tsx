"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"

export default function Edit({ params }: { params: { id: string } }) {
    const [amount, setAmount] = useState<number | string>("");
    const [date, setDate] = useState<number | string>("");
    const [type, setType] = useState<"income" | "expense">("income")
    const [note, setNote] = useState<number | string>("")

    const { data: session } = useSession();

    const router = useRouter();

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const [message, setMessage] = useState("")

    function formatDate(input: string): string {
        const date = new Date(input);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }

    const editTransaction = async () => {
        if (!amount || !date || !note) {
            setError(true);
            setMessage("Please fill in all fields.");
            return;
        } try {
            const res = await axios.put(`/api/transaction/${params.id}/update`, {
                amount: Number(amount),
                date,
                type,
                note,
                userId: session?.user?.id,
            });

            if (res.status == 203) {
                setSuccess(true);
                router.push("/");
            } else {
                setError(true);
            }
            setMessage(res.data.message);
        } catch (err: any) {
            setError(true);
            setMessage(err.response.data.message)
        }
    }

    const getTransactions = async () => {
        if (session?.user?.id) {
            try {
                const res = await axios.get(`/api/transaction/${params.id}/update`)
                setAmount(res.data.amount)
                setDate(formatDate(res.data.date))
                setType(res.data.type)
                setNote(res.data.note)

            } catch (err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        getTransactions()
    }, [params.id])

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                {error && (<p className='bg-red-100 text-red-700 p-3 rounded mb-4'>{message}</p>)}
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-gray-700 font-medium mb-1">Amount</label>
                    <input
                        onChange={(e) => setAmount(e.target.value)}
                        id="amount"
                        type="number"
                        placeholder="0"
                        value={amount}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-gray-700 font-medium mb-1">Date</label>
                    <input
                        onChange={(e) => setDate(e.target.value)}
                        id="date"
                        type="date"
                        value={date}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="type" className="block text-gray-700 font-medium mb-1">Type</label>
                    <select
                        onChange={(e) => setType(e.target.value as "income" | "expense")}
                        id="type"
                        value={type}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="note" className="block text-gray-700 font-medium mb-1">Note</label>
                    <textarea
                        onChange={(e) => setNote(e.target.value)}
                        id="note"
                        value={note}
                        rows={3}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>
                <button
                    type="button"
                    onClick={editTransaction}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Update Transaction
                </button>
            </div>
        </div>
    )
}
