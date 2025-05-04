import nodemailer, { Transporter } from 'nodemailer';

export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your@gmail.com',
      pass: process.env.EMAIL_PASS || 'yourpassword',
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || 'your@gmail.com',
    to: email,
    subject: 'Verify your email',
    text: `Your verification code is ${verificationToken}`,
  };

  await transporter.sendMail(mailOptions);
};