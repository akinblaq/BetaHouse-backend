// still valid
const crypto = require("crypto"); // built-in
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true, // use SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = async function sendEmail({ to, subject, html }) {
  try {
    console.log("Attempting to send email to:", to);

    await transporter.sendMail({
      from: `"BetaHouse" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to", to);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};
