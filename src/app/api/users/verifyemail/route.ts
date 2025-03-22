import { ConnectDb } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

//as we know nextjs runs on edge we have to call db function everytime
ConnectDb()

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json();                   //get body from the user
        const { token } = reqBody;                              //destructure token from the body

        //if token is not found 
        if (!token) {
            return NextResponse.json({ message: "No token found" }, { status: 400 });
        }

        //get user document from the DB based in token provided
        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } })          /* The date should be greater than curr date, as we have added 60mins for expiry */

        //if user is not present
        if (!user) {
            return NextResponse.json({ message: "No User found" }, { status: 404 });
        }

        //update the values in local user document
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        //save the local user in DB
        await user.save();

        return NextResponse.json({ message: "User Verified Successfully", success: true }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: "Oh noo " + error.message }, { status: 500 });
    }
}