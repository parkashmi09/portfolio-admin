const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendContactNotification = async (contactData) => {
  const { name, email, phone, service, message } = contactData;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    
    // Send auto-reply to the contact
    const autoReplyOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Thank you for contacting ${process.env.COMPANY_NAME}`,
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>${process.env.COMPANY_NAME} Team</p>
      `,
    };
    
    await transporter.sendMail(autoReplyOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = {
  sendContactNotification,
}; 