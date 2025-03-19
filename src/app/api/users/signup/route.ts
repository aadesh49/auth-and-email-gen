import { ConnectDb } from '@/dbConfig/dbConfig';
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';

//as we know nextjs runs on edge we have to call db function everytime
ConnectDb()

/* route will be 'localhost:3000/users/signup' as per the file structure*/
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()                //as the request may take some time we write await
        const { username, email, password } = reqBody;
        //validation
        console.log(reqBody);

        const user = await User.findOne({ email })          //find the user

        //if user exists we don't need to sign them up, simply return
        if (user) {
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }
        
        //if we reach here that means user doesn't exists, create salt and hashed password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        //fill values as per the user model
        const newUser = new User({
            username,
            email,
            password: hashedPass
        })
        
        //save this user into the DB(create new document)
        const savedUser = await newUser.save();
        console.log(savedUser);

        //send a verify email to the user
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })

        //respond them with a success msg
        return NextResponse.json({message: "User registered successfully", success: true }, {status: 400});

    } catch (error: any) {
        return NextResponse.json({error: error.message }, {status: 500})
    }
}