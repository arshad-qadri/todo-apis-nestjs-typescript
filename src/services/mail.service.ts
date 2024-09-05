import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transport;
  
  constructor(private configService: ConfigService) {
      
    this.transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:  this.configService.get("USER"),
        pass:  this.configService.get("PASS"),
      },
    });
  }
  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: this.configService.get("USER"),
      to,
      subject,
      text,
    };
    await this.transport.sendMail(mailOptions);
  }

  async sendOwnerMail(name: string, email: string, message: string) {
      console.log("user", process.env.USER);
    const mailOptions = {
      from:  this.configService.get("USER"),
      to:   this.configService.get("OWNERMAIL"),
      subject: 'New contact form submission',
    //   text: `You have received a new message from  \n name: ${name} \n email: ${email} \n message: ${message}`,
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p style="color: #555;">You have received a new message from your website's contact form. Below are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Name:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Email:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Message:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
            </tr>
          </table>
          
          <p style="color: #555;">Please respond to this message as soon as possible.</p>
          <p style="color: #555;">Best regards,<br>Your Website Team</p>
        </div>
      `,
    };
    await this.transport.sendMail(mailOptions);
  }
  async sendUserConfirmationMail(to: string) {
    const mailOptions = {
      from:  this.configService.get("USER"),
      to,
      subject: 'Thank you for contacting us!',
    //   text: 'We have received your message and will get back to you soon!',
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
      <h2 style="color: #333;">Thank You for Contacting Us!</h2>
      <p style="color: #555;">Hello,</p>
      <p style="color: #555;">
        We have received your message and want to thank you for reaching out to us. Our team will review your inquiry and get back to you as soon as possible.
      </p>
      <p style="color: #555;">
        In the meantime, if you have any additional questions or updates, feel free to reply to this email.
      </p>
      <p style="color: #555;">Best regards,<br>Your Website Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">
        Please do not reply directly to this automated email.
      </p>
    </div>
  `,
    };
    await this.transport.sendMail(mailOptions);
  }
}
