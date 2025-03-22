import { ConnectDb } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


ConnectDb();

export async function GET(request: NextRequest) {
    const id = await getDataFromToken(request);             //called a function that will return id of the user by provided token as user is logged in

    //get a user based on password, also deselect the password so that it is not being displayed
    const user = await User.findOne({ _id: id }).select("-password");

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    return NextResponse.json({ message: "User found", success: true, data: user }, { status: 200 })

}