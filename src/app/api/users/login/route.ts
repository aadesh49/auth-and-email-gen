import { ConnectDb } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'


ConnectDb();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {email, password} = reqBody;

        if(!email){
            return NextResponse.json({message: "Please provide the email"}, {status: 400});
        }
        if(!password){
            return NextResponse.json({message: "Please provide the password"}, {status: 400});
        }

        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json({message: "User does not exists"}, {status: 400});
        }
        
        const check = await bcrypt.compare(password, user.password);

        if(!check){
            return NextResponse.json({message: "Please check your details"}, {status: 500});
        }

        const tokenData = {
            id: user._id,
            username: user.username
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET !, {expiresIn: '1d'});

        const res = NextResponse.json({message: "Logged In Successfully", success: true}, {status: 200});

        res.cookies.set("token", token, {
            httpOnly: true
        })

        return res;
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}