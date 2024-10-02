"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const Login = async () => {
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError(true);
            setMessage("Invalid email or password");
        } else {
            router.push("/");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                {error && (<p className="text-red-600 font-semibold mb-4">{message}</p>)}
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
                        onClick={Login}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Sign In
                    </button>
                </div>
                <div className="text-center text-sm text-gray-500">
                    Don't have an account? <Link href="./register" className="text-blue-500 hover:underline">Register</Link>
                </div>
            </div>
        </div>
    );
}
