"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [btnDisabled, setBtnDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);
        setError(""); // Reset error message

        try {
            await axios.post("/api/users/login", user);
            console.log("Login successful");
            router.push("/me");
        } catch (error: any) {
            setError(error.response?.data?.message || "Invalid credentials. Please try again.");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setBtnDisabled(!(user.email && user.password));
    }, [user]);

    return (
        <div className="flex flex-col justify-center items-center gap-6 min-h-screen bg-black text-white">
            <h1 className="text-2xl font-bold">{loading ? "Processing..." : "Login"}</h1>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-col w-80 gap-3">
                <label htmlFor="email" className="font-medium">Email</label>
                <input
                    className="border border-amber-300 p-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="Enter your email"
                />

                <label htmlFor="password" className="font-medium">Password</label>
                <input
                    className="border border-amber-300 p-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Enter your password"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                />

                <button
                    onClick={handleSubmit}
                    disabled={btnDisabled || loading}
                    className={`mt-4 p-2 rounded text-black font-semibold ${
                        btnDisabled || loading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-amber-400 hover:bg-amber-500"
                    }`}
                >
                    {loading ? "Logging In..." : "Login"}
                </button>
            </div>

            <Link href="/signup" className="text-amber-400 hover:underline">
                Don't have an account? Sign Up
            </Link>
        </div>
    );
}
