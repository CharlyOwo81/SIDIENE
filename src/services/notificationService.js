import nodemailer from 'nodemailer';
import twilio from 'twilio';

const { 
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER
} = process.env;

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Twilio client initialization
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      text
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

export const sendSMS = async (to, message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to
    });
    console.log(`SMS sent to ${to}`);
  } catch (error) {
    console.error('SMS send error:', error);
    throw error;
  }
};