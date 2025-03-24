"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    //  Extract token from URL only once (on first render)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token") || "";
        setToken(urlToken);
    }, []);  //  Empty dependency array ensures it runs only once.

    // Verify Email Automatically when Token is Available
    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token]); //  Runs only when `token` changes.

    // Email Verification API Call
    const verifyEmail = async () => {
        setLoading(true);
        setError(false);

        try {
            await axios.post("/api/users/verifyemail", { token });
            setVerified(true);
        } catch (error: any) {
            console.error("Verification Error:", error.response?.data || error.message);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h1 className="text-2xl font-bold mb-4">Verify Email</h1>

            {loading && <p className="text-yellow-400">Processing...</p>}

            {!loading && verified && (
                <div className="text-green-400 text-center">
                    <h2>Email Verified ✅</h2>
                    <Link href="/login" className="text-blue-400 underline">
                        Click here to login
                    </Link>
                </div>
            )}

            {!loading && error && (
                <div className="text-red-500 text-center">
                    <h2>Verification Failed ❌</h2>
                    <p>Invalid or expired token. Please try again.</p>
                </div>
            )}
        </div>
    );
}
