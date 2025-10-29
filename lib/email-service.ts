// Email service using Nodemailer with Gmail
// This handles all email sending functionality - NO DOMAIN VERIFICATION NEEDED!

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class EmailService {
  private transporter: any;
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@yourdomain.com';
    
    // Configure Gmail transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.error('Gmail credentials not configured');
        return { success: false, error: 'Email service not configured' };
      }

      const mailOptions = {
        from: `"Yacht Services" <${process.env.GMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments?.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        })),
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log(' Email sent successfully:', info.messageId);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Email service error:', error);
      return { success: false, error: error.message || 'Internal email service error' };
    }
  }
}

export const emailService = new EmailService();

