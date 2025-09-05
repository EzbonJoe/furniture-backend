const nodeEmailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodeEmailer.createTransport({
    service: 'gmail', // or any other email service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS // Your email password or app password
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
}

module.exports = sendEmail;