import { ConnectDb } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";


ConnectDb();

export async function GET(request: NextRequest) {
    try {
        //first create a message and then remove token
        const res = NextResponse.json({ message: "Logged Out Successfully" }, { status: 200 })
        
        //expire the cookie by updating token by empty string
        res.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        return res;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}