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
  }): Promise<boolean> => {
    let result: boolean = true;
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

      transporter.sendMail(mailOptions, (error, info) => {
        // 뒤에서 error를 throw 하기 때문에
        if (error !== null) {
          throw error;
        } else {
          result = true;
        }
      });
    } catch (error) {
      result = false;
      console.log(new Date().toISOString() + ": npm log: " + error);
    }
    if (transporter !== null) transporter.close();
    return result;
  };
}

// `
//                 인증번호입니당.<br/>
//                 ${verificationCode}
//                 `
