import nodemailer from "nodemailer";

/**
 * Gửi email xác thực chứa mật khẩu ngẫu nhiên
 * @param to Email của người nhận
 * @param password Mật khẩu ngẫu nhiên để đăng nhập lần đầu
 */
export async function sendVerificationEmail(to: string, password: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Xác thực tài khoản của bạn",
      html: `
        <h2>Chào mừng bạn đến với ứng dụng của chúng tôi!</h2>
        <p>Bạn đã đăng ký tài khoản bằng email này. Vui lòng sử dụng mật khẩu dưới đây để đăng nhập lần đầu:</p>
        <h3 style="color:blue;">${password}</h3>
        <p>Hãy đăng nhập và đổi mật khẩu ngay để bảo mật tài khoản.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email đã gửi thành công tới ${to}`);
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    throw new Error("Không thể gửi email xác thực.");
  }
}
