// Nodemailer
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","mialtrap")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure true EMAIL_PORT= 465 , if false set EMAIL_PORT = 587
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define email  ( from, to, subject, content)
  const mailOpts = {
    from: 'Authuntcation <>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
