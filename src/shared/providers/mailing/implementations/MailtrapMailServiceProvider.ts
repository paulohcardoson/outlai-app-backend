import { env } from '@config/env';
import nodemailer from 'nodemailer';
import type { MailServiceProvider, SendEmailDTO } from '../interface/MailServiceProvider';

export class MailtrapMailServiceProvider implements MailServiceProvider {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.MAILTRAP_HOST,
      port: env.MAILTRAP_PORT,
      secure: false, // use SSL
      auth: {
        user: env.MAILTRAP_USER,
        pass: env.MAILTRAP_PASS,
      }
    });
  }

  async verify(): Promise<boolean> {
    return await this.transporter.verify();
  }

  async sendMail(data: SendEmailDTO): Promise<void> {
    const info = await this.transporter.sendMail({
      from: 'equipe@outlai.com',
      ...data
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
}
