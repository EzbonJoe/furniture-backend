// sendEmail.js
const nodemailer = require("nodemailer");

// Create the transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",  // Brevo SMTP server
  port: 587,                     // Recommended port
  secure: false,                 // false for port 587, true for port 465
  auth: {
    user: process.env.BREVO_USER, // Your Brevo login email
    pass: process.env.BREVO_PASS, // Your Brevo SMTP key
  },
});

// Main function to send email
const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL, // Verified sender email in Brevo
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    if (error.response) console.error("Response:", error.response);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
