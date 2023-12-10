import * as nodeMailer from "nodemailer";

export class MailUtils {
  // transport를 싱글톤으로 사용하지 않은 이유
  // 해당 transport의 유지 자체가 메모리를 잡아먹기 때문에
  // 회원가입은 많이 이루어지지 않을듯.....
  static sendMail = async ({
    email,
    subject,
    content,
  }: {
    email: string;
    subject: string;
    content: string;
  }): Promise<void> => {
    let transporter: nodeMailer.Transporter | null = null;
    try {
      transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.COMPANY_EMAIL,
          pass: process.env.COMPANY_EMAIL_PASSWORD,
        },
        // 스팸처리 이슈 해결
        from: process.env.COMPANY_EMAIL,
      });

      const mailOptions = {
        to: email,
        subject: subject,
        html: content,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(new Date().toISOString() + ": npm log: " + error);
      throw error;
    }
  };
}
