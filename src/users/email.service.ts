import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: "bsskk2022@gmail.com", // Your Gmail address
        pass: "vggtkmvrrddxshdc", // Your Gmail password
      },
    });
  }

  async sendPasswordEmail(recipientEmail: string, password: string) {
    const mailOptions = {
      from: "bsskk2022@gmail.com", // Your email address
      to: recipientEmail,
      subject: "Your Account Password",
      text: `Here is your generated password: ${password}`,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Password email sent successfully");
    } catch (error: any) {
      console.error("Error sending email:", error);
      if (error.response.includes("550-5.4.5")) {
        throw new InternalServerErrorException(
          "Daily user sending limit exceeded."
        );
      }
      throw new InternalServerErrorException("Failed to send email.");
    }
  }

  async sendResetMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: "bsskk2022@gmail.com",
      to,
      subject,
      text,
    });
  }
}
