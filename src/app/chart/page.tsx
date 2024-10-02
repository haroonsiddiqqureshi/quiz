"use client";

import Link from "next/link";
import axios from "axios";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface transactionsType {
    _id: string,
    amount: number,
    date: string,
    type: "income" | "expense",
    note: string,
}

export default function Chart() {
    const { data: session } = useSession();

    const [transactions, setTransactions] = useState<transactionsType[]>([])

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
    }, [session])

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
                    <div className="max-w-6xl mx-auto">
                        <IncomeExpenseChart transactions={transactions} />
                    </div>
                </div>
            </div >
        )
    }
}
