import nodemailer from "nodemailer"

export const sendEmail = async ({ from = process.env.APP_EMAIL, to = "", subject = "saraha App", text = "", html = "", attachments = [] } = {}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `"Route Academy" <${from}>`,
        to, subject, text, html, attachments
    });

    console.log("Message sent:", info.messageId);

}

