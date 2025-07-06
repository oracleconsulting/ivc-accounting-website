// FILE: supabase/migrations/004_email_templates.sql
// Email templates migration

-- Email Templates and Configuration
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Email configuration table
CREATE TABLE IF NOT EXISTS email_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'sendgrid',
  config JSONB NOT NULL DEFAULT '{}',
  templates JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Email logs for tracking
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL, -- sent, failed, pending
  provider TEXT NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP
);

-- Sample templates
INSERT INTO email_templates (name, subject, html_content, variables) VALUES
('newsletter', 'IVC Accounting: {{month}} Newsletter', 
'<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; }
    .cta-button { display: inline-block; background-color: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>IVC Accounting Newsletter</h1>
    <p>{{month}} {{year}}</p>
  </div>
  <div class="content">
    <p>Hello {{name}},</p>
    <p>{{content}}</p>
    <p style="text-align: center;">
      <a href="{{cta_url}}" class="cta-button">{{cta_text}}</a>
    </p>
  </div>
  <div class="footer">
    <p>OTHER ACCOUNTANTS FILE. WE FIGHT.</p>
    <p>© {{year}} IVC Accounting. All rights reserved.</p>
  </div>
</body>
</html>', 
'["name", "month", "year", "content", "cta_url", "cta_text"]'),

('blog_notification', 'New Post: {{title}}', 
'<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; }
    .read-button { display: inline-block; background-color: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>New Blog Post</h1>
  </div>
  <div class="content">
    <h2>{{title}}</h2>
    <p><strong>By {{author}}</strong> | {{date}}</p>
    <p>{{excerpt}}</p>
    <p style="text-align: center;">
      <a href="{{url}}" class="read-button">Read Full Article</a>
    </p>
  </div>
  <div class="footer">
    <p>OTHER ACCOUNTANTS FILE. WE FIGHT.</p>
    <p>© {{year}} IVC Accounting. All rights reserved.</p>
  </div>
</body>
</html>', 
'["title", "author", "date", "excerpt", "url", "year"]'),

('contact_response', 'Thank you for contacting IVC Accounting', 
'<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Thank You for Contacting Us</h1>
  </div>
  <div class="content">
    <p>Hello {{name}},</p>
    <p>Thank you for reaching out to IVC Accounting. We have received your message and will respond within 24 hours.</p>
    <p><strong>Your message:</strong></p>
    <blockquote style="border-left: 3px solid #ff6b35; padding-left: 15px; margin: 15px 0;">
      {{message}}
    </blockquote>
    <p>In the meantime, you might find answers to common questions in our <a href="https://www.ivcaccounting.co.uk/resources">Resources section</a>.</p>
  </div>
  <div class="footer">
    <p>OTHER ACCOUNTANTS FILE. WE FIGHT.</p>
    <p>© {{year}} IVC Accounting. All rights reserved.</p>
  </div>
</body>
</html>', 
'["name", "message", "year"]'),

('appointment_confirmation', 'Appointment Confirmed: {{date}} at {{time}}', 
'<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; }
    .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Appointment Confirmed</h1>
  </div>
  <div class="content">
    <p>Hello {{name}},</p>
    <p>Your appointment with IVC Accounting has been confirmed.</p>
    <div class="details">
      <p><strong>Date:</strong> {{date}}</p>
      <p><strong>Time:</strong> {{time}}</p>
      <p><strong>Location:</strong> {{location}}</p>
      <p><strong>Type:</strong> {{appointment_type}}</p>
    </div>
    <p>Please arrive 10 minutes before your scheduled time. If you need to reschedule, please contact us at least 24 hours in advance.</p>
  </div>
  <div class="footer">
    <p>OTHER ACCOUNTANTS FILE. WE FIGHT.</p>
    <p>© {{year}} IVC Accounting. All rights reserved.</p>
  </div>
</body>
</html>', 
'["name", "date", "time", "location", "appointment_type", "year"]');

-- Insert default email configuration
INSERT INTO email_config (provider, config, templates, settings) VALUES
('sendgrid', 
'{
  "sendgrid": {
    "apiKey": "",
    "fromEmail": "hello@ivcaccounting.co.uk",
    "fromName": "IVC Accounting"
  }
}', 
'{
  "newsletter": "newsletter",
  "blogNotification": "blog_notification", 
  "contactAutoResponse": "contact_response",
  "appointmentConfirmation": "appointment_confirmation"
}',
'{
  "enableNewsletter": true,
  "enableBlogNotifications": true,
  "enableContactAutoResponse": true,
  "enableAppointmentConfirmations": true,
  "maxEmailsPerHour": 100
}');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage email templates" ON email_templates
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage email config" ON email_config
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view email logs" ON email_logs
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert email logs" ON email_logs
  FOR INSERT WITH CHECK (true); 