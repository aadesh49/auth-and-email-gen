"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
    });

    const [btnDisabled, setBtnDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);
        setError(""); // Reset error message

        try {
            await axios.post("/api/users/signup", user);
            console.log("Sign up successful");
            router.push("/login");
        } catch (error: any) {
            setError(error.response?.data?.message || "Something went wrong. Please try again.");
            console.error("Signup error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setBtnDisabled(!(user.email && user.password && user.username));
    }, [user]);

    return (
        <div className="flex flex-col justify-center items-center gap-6 min-h-screen bg-black text-white">
            <h1 className="text-2xl font-bold">{loading ? "Processing..." : "Sign Up"}</h1>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-col w-80 gap-3">
                <label htmlFor="username" className="font-medium">Username</label>
                <input
                    className="border border-amber-300 p-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="Enter your username"
                />

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
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
            </div>

            <Link href="/login" className="text-amber-400 hover:underline">
                Already have an account? Login
            </Link>
        </div>
    );
}
