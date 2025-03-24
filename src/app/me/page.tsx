"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<{ 
        id: string;
        username: string;
        email: string;
        isVerified: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getUserDetails = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get("/api/users/me");
            const { _id, username, email, isVerified } = res.data.data;
            setUser({ id: _id, username, email, isVerified });
        } catch (error: any) {
            setError("Failed to fetch user details.");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await axios.get("/api/users/logout");
            router.push("/login");
        } catch (error: any) {
            setError("Logout failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-6 min-h-screen bg-black text-white">
            <h1 className="text-2xl font-bold">{loading ? "Processing..." : "Profile Page"}</h1>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-col w-90 gap-4 bg-gray-900 p-4 rounded-lg shadow-lg">
                {user ? (
                    <>
                        <p className="text-sm">
                            <span className="font-medium">User ID:</span>{" "}
                            <Link href={`/me/${user.id}`} className="text-amber-400 hover:underline">
                                {user.id}
                            </Link>
                        </p>
                        <p className="text-lg font-semibold text-gray-300">Username: <span className="text-amber-400">{user.username}</span></p>
                        <p className="text-lg font-semibold text-gray-300">Email: <span className="text-amber-400">{user.email}</span></p>
                        <p className="text-sm">
                            <span className="font-medium">Verified:</span>{" "}
                            {user.isVerified ? (
                                <span className="text-green-400">Yes ✅</span>
                            ) : (
                                <span className="text-red-400">No ❌</span>
                            )}
                        </p>
                    </>
                ) : (
                    <p className="text-center text-gray-400">No user data</p>
                )}

                <button
                    onClick={getUserDetails}
                    disabled={loading}
                    className={`p-2 rounded text-black font-semibold cursor-pointer ${
                        loading ? "bg-gray-600 cursor-not-allowed" : "bg-amber-400 hover:bg-amber-500"
                    }`}
                >
                    {loading ? "Loading..." : "Get User Details"}
                </button>

                <button
                    onClick={logout}
                    disabled={loading}
                    className="p-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                >
                    {loading ? "Logging out..." : "Logout"}
                </button>
            </div> 
        </div>
    );
}
