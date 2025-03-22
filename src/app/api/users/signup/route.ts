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
        const { username, email, password } = reqBody;      //destructure the req values 

        //validation
        if(!username){
            return NextResponse.json({message: "Please provide the username"}, {status: 400})
        }
        if(!email){
            return NextResponse.json({message: "Please provide the email"}, {status: 400})
        }
        if(!password || password.length < 4){
            return NextResponse.json({message: "Please provide a valid password"}, {status: 400})
        }

        const user = await User.findOne({ email })          //find the user

        //if user exists we don't need to sign them up, simply return
        if (user) {
            return NextResponse.json({message: "User already exists, you can sign in"}, {status: 409})
        }
        
        //if we reach here that means user doesn't exists, create salt and hashed password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        //fill values as per the user model
        const newUser = new User({
            username,                       //when the name is same as in user model, we directly pass the value
            email,
            password: hashedPass          //here we have to define password explicitly
        })
        
        //save this user into the DB(create new document)
        const savedUser = await newUser.save();

        //send a verify email to the user
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })

        //respond them with a success msg
        return NextResponse.json({message: "User registered successfully", success: true }, {status: 200});

    } catch (error: any) {
        console.log(error)
        if (error.name === "ValidationError") {
            return NextResponse.json({ message: "Invalid user data." }, { status: 400 });
        }

        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}