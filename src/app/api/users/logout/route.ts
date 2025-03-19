import { ConnectDb } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";


ConnectDb();

export async function POST(request: NextRequest) {
    try {
        const res = NextResponse.json({message: "Logged Out Successfully"}, {status: 200})

        res.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        return res;
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}