import { ConnectDb } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'


ConnectDb();

export async function POST(request: NextRequest) {
    try {
        //get value from frontend
        const reqBody = await request.json();
        const { email, password } = reqBody;                  //destructure email and password

        //Validation for email and password
        if (!email) {
            return NextResponse.json({ message: "Please provide the email" }, { status: 400 });
        }
        if (!password) {
            return NextResponse.json({ message: "Please provide the password" }, { status: 400 });
        }

        //based on email find a user docment, as email was unique we will get only one document
        const user = await User.findOne({ email });

        //if user was not found, it certainly means that email does not exists
        if (!user) {
            return NextResponse.json({ message: "Email does not exists" }, { status: 404 });
        }

        //till here we know that this user is present so, we compare the password using bcrypt
        const check = await bcrypt.compare(password, user.password);

        //if the password is wrong, respond with wrong details
        if (!check) {
            return NextResponse.json({ message: "Please check your details" }, { status: 409 });
        }

        //till here user details are ok, we can allow them to login and provide them token 
        const tokenData = {
            id: user._id,
            username: user.username
        }

        //token is generated using jwt and secret present in .env file
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

        //store success msg for the user
        const res = NextResponse.json({ message: "Logged In Successfully", success: true }, { status: 200 });

        //set the cookies as a token
        res.cookies.set("token", token, {
            httpOnly: true                          //this will help the token to be unchanged
        })

        return res;                                 //return response
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}