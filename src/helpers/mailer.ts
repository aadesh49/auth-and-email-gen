import User  from '@/models/user.model';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    //generate a token 
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    //when we need to verify the user, we pass token and expiry time is 60mins
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 })
    } else if (emailType === "Reset") {
      await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 })
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "4e3c1a5709a47d",
        pass: "06cca23bc71c8b"
      }
    });

    const MailOptions = {
      from: 'host@.gmail.com', // sender address
      to: email, // list of receivers
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> Here </a>
      to ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"} 
      or copy and paste the below link in your browser. <br>
      ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`, // html body
    };

    const mailResponse = await transport.sendMail(MailOptions);
    return mailResponse

  } catch (error: any) {
    throw new Error(error.message)
  }
}