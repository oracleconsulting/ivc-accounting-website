import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  data?: Record<string, any>;
  from?: string;
  fromName?: string;
}

export interface EmailProvider {
  id: string;
  name: string;
  config: any;
}

export class EmailService {
  private provider: string;
  private config: any;
  private transporter: any;

  constructor(provider: string, config: any) {
    this.provider = provider;
    this.config = config;
    this.initialize();
  }

  private initialize() {
    switch (this.provider) {
      case 'sendgrid':
        sgMail.setApiKey(this.config.sendgrid.apiKey);
        break;
      case 'smtp':
        this.transporter = nodemailer.createTransporter({
          host: this.config.smtp.host,
          port: this.config.smtp.port,
          secure: this.config.smtp.secure,
          auth: {
            user: this.config.smtp.username,
            pass: this.config.smtp.password
          }
        });
        break;
      case 'mailgun':
        // Mailgun will be handled via API calls
        break;
      case 'aws-ses':
        // AWS SES will be handled via AWS SDK
        break;
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const fromEmail = options.from || this.getDefaultFromEmail();
      const fromName = options.fromName || this.getDefaultFromName();

      switch (this.provider) {
        case 'sendgrid':
          return this.sendViaSendGrid(options, fromEmail, fromName);
        case 'smtp':
          return this.sendViaSMTP(options, fromEmail, fromName);
        case 'mailgun':
          return this.sendViaMailgun(options, fromEmail, fromName);
        case 'aws-ses':
          return this.sendViaAWSSES(options, fromEmail, fromName);
        default:
          throw new Error(`Unsupported email provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  private async sendViaSendGrid(options: EmailOptions, fromEmail: string, fromName: string): Promise<boolean> {
    const msg = {
      to: options.to,
      from: `${fromName} <${fromEmail}>`,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    await sgMail.send(msg);
    return true;
  }

  private async sendViaSMTP(options: EmailOptions, fromEmail: string, fromName: string): Promise<boolean> {
    const mailOptions = {
      from: `${fromName} <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    await this.transporter.sendMail(mailOptions);
    return true;
  }

  private async sendViaMailgun(options: EmailOptions, fromEmail: string, fromName: string): Promise<boolean> {
    const formData = new URLSearchParams();
    formData.append('from', `${fromName} <${fromEmail}>`);
    formData.append('to', Array.isArray(options.to) ? options.to.join(',') : options.to);
    formData.append('subject', options.subject);
    
    if (options.html) {
      formData.append('html', options.html);
    }
    if (options.text) {
      formData.append('text', options.text);
    }

    const response = await fetch(
      `https://api.mailgun.net/v3/${this.config.mailgun.domain}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${this.config.mailgun.apiKey}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Mailgun API error: ${response.statusText}`);
    }

    return true;
  }

  private async sendViaAWSSES(options: EmailOptions, fromEmail: string, fromName: string): Promise<boolean> {
    // This would require AWS SDK setup
    // For now, we'll use a simple fetch approach
    const response = await fetch('/api/email/aws-ses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: options.to,
        from: `${fromName} <${fromEmail}>`,
        subject: options.subject,
        html: options.html,
        text: options.text,
        config: this.config.aws
      })
    });

    if (!response.ok) {
      throw new Error(`AWS SES error: ${response.statusText}`);
    }

    return true;
  }

  async sendBulkEmails(recipients: string[], options: EmailOptions, batchSize = 100): Promise<boolean> {
    try {
      // Split recipients into batches
      const batches = [];
      for (let i = 0; i < recipients.length; i += batchSize) {
        batches.push(recipients.slice(i, i + batchSize));
      }

      // Send emails in batches with rate limiting
      for (const batch of batches) {
        const batchPromises = batch.map(recipient => 
          this.sendEmail({
            ...options,
            to: recipient
          })
        );

        await Promise.all(batchPromises);
        
        // Rate limiting delay
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between batches
        }
      }

      return true;
    } catch (error) {
      console.error('Bulk email sending failed:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const testOptions: EmailOptions = {
        to: 'test@example.com',
        subject: 'Connection Test',
        html: '<p>This is a test email to verify the connection.</p>',
        text: 'This is a test email to verify the connection.'
      };

      // We'll just test the configuration, not actually send
      switch (this.provider) {
        case 'sendgrid':
          // Test API key validity
          const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
            headers: {
              'Authorization': `Bearer ${this.config.sendgrid.apiKey}`
            }
          });
          return response.ok;

        case 'smtp':
          // Test SMTP connection
          await this.transporter.verify();
          return true;

        case 'mailgun':
          // Test Mailgun API
          const mgResponse = await fetch(
            `https://api.mailgun.net/v3/${this.config.mailgun.domain}`,
            {
              headers: {
                'Authorization': `Basic ${btoa(`api:${this.config.mailgun.apiKey}`)}`
              }
            }
          );
          return mgResponse.ok;

        case 'aws-ses':
          // Test AWS credentials
          const awsResponse = await fetch('/api/email/aws-ses/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ config: this.config.aws })
          });
          return awsResponse.ok;

        default:
          return false;
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  private getDefaultFromEmail(): string {
    switch (this.provider) {
      case 'sendgrid':
        return this.config.sendgrid.fromEmail;
      case 'mailgun':
        return this.config.mailgun.fromEmail;
      case 'aws-ses':
        return this.config.aws.fromEmail;
      case 'smtp':
        return this.config.smtp.username;
      default:
        return 'noreply@ivcaccounting.co.uk';
    }
  }

  private getDefaultFromName(): string {
    switch (this.provider) {
      case 'sendgrid':
        return this.config.sendgrid.fromName;
      case 'mailgun':
        return this.config.mailgun.fromName;
      case 'aws-ses':
        return this.config.aws.fromName;
      case 'smtp':
        return 'IVC Accounting';
      default:
        return 'IVC Accounting';
    }
  }

  renderTemplate(template: string, data: Record<string, any>): string {
    let rendered = template;
    
    // Replace variables in the format {{variable}}
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, String(value));
    });

    return rendered;
  }

  async sendTemplateEmail(
    templateName: string,
    template: string,
    recipients: string | string[],
    data: Record<string, any>,
    subject: string
  ): Promise<boolean> {
    const renderedHtml = this.renderTemplate(template, data);
    const renderedText = this.renderTemplate(template.replace(/<[^>]*>/g, ''), data);

    return this.sendEmail({
      to: recipients,
      subject,
      html: renderedHtml,
      text: renderedText
    });
  }
} 