import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

async function getAccessToken() {
  if (
    !process.env.GOOGLE_USER ||
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REFRESH_TOKEN
  ) {
    throw new Error(
      "Google OAuth credentials are not configured in environment variables",
    );
  }

  const accessTokenResponse = await oauth2Client.getAccessToken();
  if (!accessTokenResponse || !accessTokenResponse.token) {
    throw new Error("Unable to fetch access token from Google OAuth2");
  }

  return accessTokenResponse.token;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Email transporter is ready to send emails");
  })
  .catch((err) => {
    console.error("Email transporter verification failed:", err);
  });

export async function sendEmail({ to, subject, html, text }) {
  try {
    if (!to || !subject) {
      throw new Error("Email 'to' and 'subject' are required");
    }

    const accessToken = await getAccessToken();

    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html: html || text,
      text: text || html,
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken,
      },
    };

    const details = await transporter.sendMail(mailOptions);
    console.log(
      "Email sent successfully to:",
      to,
      "MessageId:",
      details.messageId,
    );
    return { success: true, messageId: details.messageId };
  } catch (error) {
    let message = "Unknown mail error";

    if (error.response && error.response.data) {
      if (typeof error.response.data === "string") {
        message = error.response.data;
      } else {
        message = JSON.stringify(error.response.data);
      }
    } else if (error.message) {
      message = error.message;
    }

    console.error("Error sending email to", to, ":", message);

    const normalizedMessage = String(message).toLowerCase();

    if (normalizedMessage.includes("unauthorized_client")) {
      throw new Error(
        "Google OAuth client is unauthorized. Check Google API consent screen and OAuth client credentials.",
      );
    }

    throw new Error(`Failed to send email: ${message}`);
  }
}
