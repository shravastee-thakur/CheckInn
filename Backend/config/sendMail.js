import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const sendMail = async (to, subject, htmlContent) => {
  const apiKey = process.env.BREVO_API_KEY;

  const data = {
    sender: { email: process.env.SENDER_EMAIL },
    to: [{ email: to }],
    subject: subject,
    htmlContent: htmlContent,
  };

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error sending email: ${
        error.response ? error.response.data : error.message
      }`
    );
  }
};

export default sendMail;
