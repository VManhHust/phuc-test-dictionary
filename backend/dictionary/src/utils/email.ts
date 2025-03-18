import nodemailer from "nodemailer"

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Gửi email đặt lại mật khẩu
export const sendResetPasswordEmail = async (
  email: string,
  username: string,
  resetUrl: string
) => {
  const mailOptions = {
    from: `"TuDien.vn" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Đặt lại mật khẩu cho tài khoản TuDien.vn",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Đặt lại mật khẩu</h2>
        <p>Xin chào ${username},</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại TuDien.vn.</p>
        <p>Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu:</p>
        <p>
          <a 
            href="${resetUrl}" 
            style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;"
          >
            Đặt lại mật khẩu
          </a>
        </p>
        <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br>Đội ngũ TuDien.vn</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}