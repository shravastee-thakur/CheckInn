export const loginOtpTemplate = (otp) => `
  <p>Login Verification</p>
  <p>Your OTP for login is:</p>
  <h2><strong>${otp}</strong></h2>
  <p>This OTP will expire in 5 minutes.</p>
`;

export const resetPasswordTemplate = (resetLink) =>
  `
        <h2>Password Reset</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${resetLink}" style="padding:10px 15px;background:#4f46e5;color:#fff;   border-radius:4px;text-decoration:none;">
      Verify Email
        </a>
        <p>This link will expire in 5 minutes.</p>
      `;
