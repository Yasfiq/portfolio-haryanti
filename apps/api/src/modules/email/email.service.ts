import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import type { Message } from '@repo/database';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('Resend API key not configured. Email notifications disabled.');
    }
  }

  async sendNewMessageNotification(message: Message): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!this.resend || !adminEmail) {
      this.logger.warn('Email service not configured. Skipping notification.');
      return false;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Portfolio <noreply@yourdomain.com>',
        to: adminEmail,
        subject: `📬 New Message from ${message.name}`,
        html: this.buildNewMessageTemplate(message),
      });

      if (error) {
        this.logger.error(`Failed to send email: ${error.message}`);
        return false;
      }

      this.logger.log(`Email notification sent successfully: ${data?.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Email send error: ${error}`);
      return false;
    }
  }

  private buildNewMessageTemplate(message: Message): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFD369, #F5A623); padding: 20px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; color: #1a1a2e; font-size: 24px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .field label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
          .field p { margin: 5px 0 0; padding: 10px; background: white; border-radius: 4px; }
          .message-content { white-space: pre-wrap; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #FFD369; color: #1a1a2e; text-decoration: none; border-radius: 6px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Message Received</h1>
          </div>
          <div class="content">
            <div class="field">
              <label>From</label>
              <p>${message.name}</p>
            </div>
            <div class="field">
              <label>Email</label>
              <p><a href="mailto:${message.email}">${message.email}</a></p>
            </div>
            <div class="field">
              <label>Message</label>
              <p class="message-content">${message.content}</p>
            </div>
            <div class="field">
              <label>Received At</label>
              <p>${new Date(message.createdAt).toLocaleString('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short'
    })}</p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="mailto:${message.email}" class="button">Reply to Message</a>
            </div>
          </div>
          <div class="footer">
            <p>This email was sent from your Portfolio CMS</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
