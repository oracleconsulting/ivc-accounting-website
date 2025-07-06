import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class ResendEmailService {
  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
  }) {
    try {
      const { data, error } = await resend.emails.send({
        from: options.from || 'IVC Accounting <hello@ivcaccounting.co.uk>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo || 'james@ivcaccounting.co.uk'
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Resend email error:', error);
      throw error;
    }
  }

  async sendBulkEmails(recipients: string[], options: {
    subject: string;
    html: string;
    text?: string;
  }) {
    // Resend supports batch sending
    const batches = this.chunkArray(recipients, 100); // Resend limit
    const results = [];

    for (const batch of batches) {
      const result = await this.sendEmail({
        ...options,
        to: batch
      });
      results.push(result);
    }

    return results;
  }

  async sendNewsletterConfirmation(email: string, confirmUrl: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a2b4a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f5f5f5; }
            .button { display: inline-block; padding: 12px 24px; background: #ff6b35; color: white; text-decoration: none; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to IVC Accounting Newsletter</h1>
            </div>
            <div class="content">
              <h2>Confirm Your Subscription</h2>
              <p>Thank you for subscribing to our newsletter! We're excited to share valuable tax tips and accounting insights for Essex businesses.</p>
              <p>Please confirm your email address by clicking the button below:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${confirmUrl}" class="button">Confirm Subscription</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #fff; padding: 10px; border: 1px solid #ddd;">
                ${confirmUrl}
              </p>
              <p>If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>IVC Accounting - OTHER ACCOUNTANTS FILE. WE FIGHT.</p>
              <p>Halstead, Essex | james@ivcaccounting.co.uk</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Confirm your IVC Accounting newsletter subscription',
      html,
      text: `Confirm your subscription: ${confirmUrl}`
    });
  }

  async sendNewsletterWelcome(email: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a2b4a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f5f5f5; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to IVC Accounting</h1>
            </div>
            <div class="content">
              <h2>You're In!</h2>
              <p>Welcome to the IVC Accounting newsletter family! You'll now receive our weekly insights on:</p>
              <ul>
                <li>Tax-saving strategies for Essex businesses</li>
                <li>Important HMRC updates and deadlines</li>
                <li>Practical accounting tips that save you money</li>
                <li>Business growth strategies that actually work</li>
              </ul>
              <p>Remember our motto: <strong>OTHER ACCOUNTANTS FILE. WE FIGHT.</strong></p>
              <p>We're here to fight for your financial success, not just file your paperwork.</p>
              <h3>What's Next?</h3>
              <p>Keep an eye on your inbox every Tuesday for our newsletter. In the meantime:</p>
              <ul>
                <li><a href="${process.env.NEXT_PUBLIC_SITE_URL}/blog">Check out our latest blog posts</a></li>
                <li><a href="${process.env.NEXT_PUBLIC_SITE_URL}/services">Explore our services</a></li>
                <li><a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact">Book a free consultation</a></li>
              </ul>
            </div>
            <div class="footer">
              <p>IVC Accounting | Halstead, Essex</p>
              <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe">Unsubscribe</a> | <a href="${process.env.NEXT_PUBLIC_SITE_URL}/privacy">Privacy Policy</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to IVC Accounting Newsletter!',
      html
    });
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
} 