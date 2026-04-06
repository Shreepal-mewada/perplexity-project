import dotenv from "dotenv";
import { sendEmail } from "./mail.service.js";

dotenv.config();
export function generateVerificationEmail(username, verificationLink) {
  return {
    subject: "Verify your WebCore AI account",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f9fafb;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 480px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 32px 32px; text-align: center;">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 12px; background-color: #3b82f6; margin-bottom: 24px;">
                      <span style="color: #ffffff; font-size: 24px; font-weight: bold;">W</span>
                    </div>
                    <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #111827;">WebCore AI</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px 24px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 16px; color: #374151;">Hi ${username},</p>
                    <p style="margin: 0 0 24px; font-size: 15px; color: #6b7280; line-height: 1.6;">Thanks for signing up! Please verify your email address to activate your account.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px 32px; text-align: center;">
                    <a href="${verificationLink}" style="display: inline-block; padding: 12px 32px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">Verify Email Address</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px 32px; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">This link will expire in 1 hour. If you didn't create an account, you can safely ignore this email.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px 24px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 16px 0 0; font-size: 12px; color: #9ca3af;">&copy; ${new Date().getFullYear()} WebCore AI. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `Hi ${username},\n\nThanks for signing up for WebCore AI! Please verify your email by clicking this link: ${verificationLink}\n\nThis link will expire in 1 hour.`,
  };
}

export async function sendVerificationEmail(to, username, verificationLink) {
  try {
    const { subject, html, text } = generateVerificationEmail(username, verificationLink);

    const result = await sendEmail({
      to,
      subject,
      html,
      text,
    });

    console.log("Verification email sent to:", to, "ID:", result.messageId);
    return { success: true, id: result.messageId };
  } catch (error) {
    console.error("Error sending verification email to", to, ":", error.message);
    throw error;
  }
}
