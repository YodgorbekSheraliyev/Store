import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        pass: process.env.EMAIL_PASS,
        user: process.env.EMAIL_USER
    }   
})

const sendMail = async (to, message, subject="") => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject,
        text: message
    })
}

export {sendMail}