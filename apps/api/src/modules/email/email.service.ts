import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private fromEmail: string;
  private appUrl: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('EMAIL_FROM', 'noreply@2becollab.com');
    this.appUrl = this.configService.get<string>('APP_URL', 'http://localhost:5173');

    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('✅ Resend email service initialized');
    } else {
      this.logger.warn('⚠️ RESEND_API_KEY not set — emails will be logged to console');
    }
  }

  async sendVerificationEmail(to: string, token: string, fullName: string): Promise<void> {
    const verifyUrl = `${this.appUrl}/auth/verify-email?token=${token}`;

    const subject = 'Verify your 2BeCollab account';
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f23; color: #f1f5f9; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; margin: 0;">
            <span style="background: linear-gradient(135deg, #818cf8, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">2Be</span><span>Collab</span>
          </h1>
        </div>
        <h2 style="font-size: 22px; margin-bottom: 16px;">Welcome, ${fullName}! 👋</h2>
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Thanks for signing up! Please verify your email address to get started.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #3730a3); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${verifyUrl}" style="color: #818cf8; word-break: break-all;">${verifyUrl}</a>
        </p>
        <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
          This link expires in 24 hours. If you didn't sign up for 2BeCollab, you can ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #334155; margin: 32px 0;" />
        <p style="color: #64748b; font-size: 12px; text-align: center;">
          © 2026 2BeCollab. All rights reserved.
        </p>
      </div>
    `;

    await this.send(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${this.appUrl}/auth/reset-password?token=${token}`;

    const subject = 'Reset your 2BeCollab password';
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f23; color: #f1f5f9; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; margin: 0;">
            <span style="background: linear-gradient(135deg, #818cf8, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">2Be</span><span>Collab</span>
          </h1>
        </div>
        <h2 style="font-size: 22px; margin-bottom: 16px;">Password Reset</h2>
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          We received a request to reset your password. Click the button below to create a new password.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #3730a3); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${resetUrl}" style="color: #818cf8; word-break: break-all;">${resetUrl}</a>
        </p>
        <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
          This link expires in 1 hour. If you didn't request a password reset, you can ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #334155; margin: 32px 0;" />
        <p style="color: #64748b; font-size: 12px; text-align: center;">
          © 2026 2BeCollab. All rights reserved.
        </p>
      </div>
    `;

    await this.send(to, subject, html);
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: this.fromEmail,
          to,
          subject,
          html,
        });
        this.logger.log(`📧 Email sent to ${to}: ${subject}`);
      } catch (error) {
        this.logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
        throw error;
      }
    } else {
      // Dev fallback: log to console
      this.logger.log('──────────────── EMAIL (DEV) ────────────────');
      this.logger.log(`To: ${to}`);
      this.logger.log(`Subject: ${subject}`);
      this.logger.log(`HTML: ${html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)}...`);
      this.logger.log('─────────────────────────────────────────────');
    }
  }
}
