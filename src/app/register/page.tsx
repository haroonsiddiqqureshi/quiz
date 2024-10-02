"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");

    const signUp = async () => {
        try {
            const res = await axios.post("api/auth/signup", {
                email,
                password,
            });

            if (res.status == 201) {
                setSuccess(true);
                setError(false);
            } else {
                setError(true);
                setSuccess(false);
            }
            setMessage(res.data.message);
        } catch (err: any) {
            setError(true);
            setSuccess(false);
            setMessage(err.response.data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                {success && (<p className='text-green-600 font-semibold mb-4'>{message}</p>)}
                {error && (<p className='text-red-600 font-semibold mb-4'>{message}</p>)}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        type="email"
                        placeholder="user@example.com"
                        value={email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        type="password"
                        placeholder="user1234"
                        value={password}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={signUp}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Sign Up
                    </button>
                </div>
                <div className="text-center text-sm text-gray-500">
                    Already have an account? <Link href="./login" className="text-blue-500 hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
}
