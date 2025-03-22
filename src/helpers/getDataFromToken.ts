import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server"

//This function will take user token and then get the user data
export const getDataFromToken = (request: NextRequest) => {
    try {
        //get token from the cookies
        const token = request.cookies.get("token")?.value || "";

        //verify the token using jwt and secret string
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

        if (!decodedToken) {
            return NextResponse.json({ message: "something went wrong" })
        }

        return decodedToken.id;             //return id as we created tokenData while logging the user 
    } catch (error: any) {
        throw NextResponse.json({ error: error.message })
    }
}