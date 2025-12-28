import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../config';
import type { SendEmailRequest, EmailSendResult, EmailAddress, Attachment } from '../types';
import { AppError, ErrorCodes } from '../middleware/errorHandler';

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.auth.user,
        pass: config.smtp.auth.pass,
      },
      // Connection pool settings
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      // Timeout settings
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 30000, // 30 seconds
    });
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection verification failed:', error);
      return false;
    }
  }

  /**
   * Send an email
   */
  async sendEmail(request: SendEmailRequest): Promise<EmailSendResult> {
    try {
      const mailOptions = this.buildMailOptions(request);
      const result = await this.transporter.sendMail(mailOptions);

      return {
        messageId: result.messageId,
        accepted: result.accepted as string[],
        rejected: result.rejected as string[],
      };
    } catch (error) {
      this.handleSmtpError(error);
      throw error; // Should never reach here
    }
  }

  /**
   * Build nodemailer mail options from request
   */
  private buildMailOptions(request: SendEmailRequest): SendMailOptions {
    const from = `"${config.smtp.from.name}" <${config.smtp.from.email}>`;

    const mailOptions: SendMailOptions = {
      from,
      to: this.formatRecipients(request.to),
      subject: request.subject,
    };

    // Add CC if provided
    if (request.cc) {
      mailOptions.cc = this.formatRecipients(request.cc);
    }

    // Add BCC if provided
    if (request.bcc) {
      mailOptions.bcc = this.formatRecipients(request.bcc);
    }

    // Add reply-to if provided
    if (request.replyTo) {
      mailOptions.replyTo = this.formatSingleRecipient(request.replyTo);
    }

    // Add text body
    if (request.text) {
      mailOptions.text = request.text;
    }

    // Add HTML body
    if (request.html) {
      mailOptions.html = request.html;
    }

    // Add attachments
    if (request.attachments && request.attachments.length > 0) {
      mailOptions.attachments = request.attachments.map((att) => 
        this.formatAttachment(att)
      );
    }

    return mailOptions;
  }

  /**
   * Format recipients for nodemailer
   */
  private formatRecipients(
    recipients: string | string[] | EmailAddress | EmailAddress[]
  ): string | string[] {
    if (typeof recipients === 'string') {
      return recipients;
    }

    if (Array.isArray(recipients)) {
      return recipients.map((r) => this.formatSingleRecipient(r));
    }

    return this.formatSingleRecipient(recipients);
  }

  /**
   * Format a single recipient
   */
  private formatSingleRecipient(recipient: string | EmailAddress): string {
    if (typeof recipient === 'string') {
      return recipient;
    }

    if (recipient.name) {
      return `"${recipient.name}" <${recipient.email}>`;
    }

    return recipient.email;
  }

  /**
   * Format attachment for nodemailer
   */
  private formatAttachment(attachment: Attachment) {
    return {
      filename: attachment.filename,
      content: Buffer.from(attachment.content, 'base64'),
      contentType: attachment.contentType,
    };
  }

  /**
   * Handle SMTP errors and convert to AppError
   */
  private handleSmtpError(error: unknown): never {
    const err = error as Error & { code?: string; responseCode?: number };

    // Connection errors
    if (err.code === 'ECONNECTION' || err.code === 'ECONNREFUSED') {
      throw new AppError(
        502,
        ErrorCodes.SMTP_CONNECTION_ERROR,
        'Failed to connect to SMTP server',
        'The email server is unavailable. Please try again later.'
      );
    }

    // Authentication errors
    if (err.code === 'EAUTH' || err.responseCode === 535) {
      throw new AppError(
        502,
        ErrorCodes.SMTP_AUTH_ERROR,
        'SMTP authentication failed',
        'The email server rejected the credentials.'
      );
    }

    // Timeout errors
    if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKET') {
      throw new AppError(
        502,
        ErrorCodes.SMTP_CONNECTION_ERROR,
        'SMTP connection timed out',
        'The email server did not respond in time.'
      );
    }

    // Generic send error
    throw new AppError(
      500,
      ErrorCodes.SMTP_SEND_ERROR,
      'Failed to send email',
      config.nodeEnv === 'development' ? err.message : 'An error occurred while sending the email.'
    );
  }

  /**
   * Close the transporter connection pool
   */
  async close(): Promise<void> {
    this.transporter.close();
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
