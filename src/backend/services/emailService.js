import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // For self-signed certificates
  }
});

export const sendPDFEmail = async (to, subject, text, pdfBuffer, filename) => {
  try {
    const info = await transporter.sendMail({
      from: `"Sistema Escolar" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      attachments: [{
        filename: `${filename}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    });
    
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default transporter;