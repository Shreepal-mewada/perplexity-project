import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const useAppPassword = Boolean(process.env.GOOGLE_APP_PASSWORD);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: useAppPassword
    ? {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
      }
    : {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Error setting up email transporter:", error);
  } else {
    console.log("Email transporter is ready to send messages");
  }
});

export async function sendEmail({ to, subject, html, text }) {
  try {
    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
      text: text || "", 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);

    // More informative error for debugging
    if (error.response) {
      console.error("SMTP response:", error.response);
    }

    throw new Error("Failed to send email");
  }
}
