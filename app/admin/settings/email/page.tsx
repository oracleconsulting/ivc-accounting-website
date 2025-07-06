'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Mail, Send, Settings, FileText, TestTube } from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'mailgun' | 'aws-ses' | 'smtp';
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
  };
  resend: {
    apiKey: string;
    domain: string;
    fromEmail: string;
    fromName: string;
  };
  sendgrid: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  mailgun: {
    apiKey: string;
    domain: string;
    fromEmail: string;
    fromName: string;
  };
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    fromEmail: string;
    fromName: string;
  };
  templates: {
    newsletter: string;
    blogNotification: string;
    contactAutoResponse: string;
    appointmentConfirmation: string;
  };
  settings: {
    enableNewsletter: boolean;
    enableBlogNotifications: boolean;
    enableContactAutoResponse: boolean;
    enableAppointmentConfirmations: boolean;
    maxEmailsPerHour: number;
  };
}

export default function EmailSettingsPage() {
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    provider: 'resend',
    smtp: {
      host: '',
      port: 587,
      secure: true,
      username: '',
      password: ''
    },
    resend: {
      apiKey: '',
      domain: 'ivcaccounting.co.uk',
      fromEmail: 'hello@ivcaccounting.co.uk',
      fromName: 'IVC Accounting'
    },
    sendgrid: {
      apiKey: '',
      fromEmail: 'hello@ivcaccounting.co.uk',
      fromName: 'IVC Accounting'
    },
    mailgun: {
      apiKey: '',
      domain: '',
      fromEmail: 'hello@ivcaccounting.co.uk',
      fromName: 'IVC Accounting'
    },
    aws: {
      accessKeyId: '',
      secretAccessKey: '',
      region: 'eu-west-2',
      fromEmail: 'hello@ivcaccounting.co.uk',
      fromName: 'IVC Accounting'
    },
    templates: {
      newsletter: '',
      blogNotification: '',
      contactAutoResponse: '',
      appointmentConfirmation: ''
    },
    settings: {
      enableNewsletter: true,
      enableBlogNotifications: true,
      enableContactAutoResponse: true,
      enableAppointmentConfirmations: true,
      maxEmailsPerHour: 100
    }
  });

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadEmailConfig();
  }, []);

  const loadEmailConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/email/config');
      if (response.ok) {
        const config = await response.json();
        setEmailConfig(config);
      }
    } catch (error) {
      console.error('Failed to load email config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEmailConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/email/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailConfig)
      });

      if (response.ok) {
        toast.success('Email configuration saved successfully!');
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      toast.error('Failed to save email configuration');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testEmailConnection = async () => {
    try {
      setTesting(true);
      const response = await fetch('/api/admin/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: emailConfig.provider, config: emailConfig })
      });

      if (response.ok) {
        toast.success('Test email sent successfully!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Test failed');
      }
    } catch (error: any) {
      toast.error(`Test failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const updateConfig = (path: string, value: any) => {
    setEmailConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current: any = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading email configuration...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Email Settings</h1>
        <div className="flex gap-2">
          <Button
            onClick={testEmailConnection}
            disabled={testing}
            variant="outline"
          >
            <TestTube className="mr-2 h-4 w-4" />
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button
            onClick={saveEmailConfig}
            disabled={loading}
          >
            <Settings className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="provider" className="space-y-6">
        <TabsList>
          <TabsTrigger value="provider">
            <Mail className="mr-2 h-4 w-4" />
            Provider Settings
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="mr-2 h-4 w-4" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            General Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="provider">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Email Provider Configuration</h2>
            
            {/* Provider Selection */}
            <div className="mb-6">
              <Label htmlFor="provider">Email Provider</Label>
              <select
                id="provider"
                value={emailConfig.provider}
                onChange={(e) => updateConfig('provider', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
              >
                <option value="resend">Resend (Recommended)</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
                <option value="aws-ses">AWS SES</option>
                <option value="smtp">Custom SMTP</option>
              </select>
            </div>

            {/* Resend Configuration */}
            {emailConfig.provider === 'resend' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="resend-api-key">API Key</Label>
                  <Input
                    id="resend-api-key"
                    type="password"
                    value={emailConfig.resend.apiKey}
                    onChange={(e) => updateConfig('resend.apiKey', e.target.value)}
                    placeholder="re_xxxxxxxxxxxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="resend-domain">Domain</Label>
                  <Input
                    id="resend-domain"
                    value={emailConfig.resend.domain}
                    onChange={(e) => updateConfig('resend.domain', e.target.value)}
                    placeholder="ivcaccounting.co.uk"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="resend-from-email">From Email</Label>
                    <Input
                      id="resend-from-email"
                      type="email"
                      value={emailConfig.resend.fromEmail}
                      onChange={(e) => updateConfig('resend.fromEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="resend-from-name">From Name</Label>
                    <Input
                      id="resend-from-name"
                      value={emailConfig.resend.fromName}
                      onChange={(e) => updateConfig('resend.fromName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm">
                    <strong>Setup Instructions:</strong><br />
                    1. Sign up at <a href="https://resend.com" target="_blank" className="text-blue-600 underline">resend.com</a><br />
                    2. Verify your domain (ivcaccounting.co.uk)<br />
                    3. Create an API key and paste it above<br />
                    4. Test the configuration with the button below
                  </p>
                </div>
              </div>
            )}

            {/* SendGrid Configuration */}
            {emailConfig.provider === 'sendgrid' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sendgrid-api-key">API Key</Label>
                  <Input
                    id="sendgrid-api-key"
                    type="password"
                    value={emailConfig.sendgrid.apiKey}
                    onChange={(e) => updateConfig('sendgrid.apiKey', e.target.value)}
                    placeholder="SG.xxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sendgrid-from-email">From Email</Label>
                    <Input
                      id="sendgrid-from-email"
                      type="email"
                      value={emailConfig.sendgrid.fromEmail}
                      onChange={(e) => updateConfig('sendgrid.fromEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sendgrid-from-name">From Name</Label>
                    <Input
                      id="sendgrid-from-name"
                      value={emailConfig.sendgrid.fromName}
                      onChange={(e) => updateConfig('sendgrid.fromName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mailgun Configuration */}
            {emailConfig.provider === 'mailgun' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mailgun-api-key">API Key</Label>
                  <Input
                    id="mailgun-api-key"
                    type="password"
                    value={emailConfig.mailgun.apiKey}
                    onChange={(e) => updateConfig('mailgun.apiKey', e.target.value)}
                    placeholder="key-xxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="mailgun-domain">Domain</Label>
                  <Input
                    id="mailgun-domain"
                    value={emailConfig.mailgun.domain}
                    onChange={(e) => updateConfig('mailgun.domain', e.target.value)}
                    placeholder="mg.yourdomain.com"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mailgun-from-email">From Email</Label>
                    <Input
                      id="mailgun-from-email"
                      type="email"
                      value={emailConfig.mailgun.fromEmail}
                      onChange={(e) => updateConfig('mailgun.fromEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mailgun-from-name">From Name</Label>
                    <Input
                      id="mailgun-from-name"
                      value={emailConfig.mailgun.fromName}
                      onChange={(e) => updateConfig('mailgun.fromName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AWS SES Configuration */}
            {emailConfig.provider === 'aws-ses' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aws-access-key">Access Key ID</Label>
                    <Input
                      id="aws-access-key"
                      type="password"
                      value={emailConfig.aws.accessKeyId}
                      onChange={(e) => updateConfig('aws.accessKeyId', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="aws-secret-key">Secret Access Key</Label>
                    <Input
                      id="aws-secret-key"
                      type="password"
                      value={emailConfig.aws.secretAccessKey}
                      onChange={(e) => updateConfig('aws.secretAccessKey', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="aws-region">Region</Label>
                  <Input
                    id="aws-region"
                    value={emailConfig.aws.region}
                    onChange={(e) => updateConfig('aws.region', e.target.value)}
                    placeholder="eu-west-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aws-from-email">From Email</Label>
                    <Input
                      id="aws-from-email"
                      type="email"
                      value={emailConfig.aws.fromEmail}
                      onChange={(e) => updateConfig('aws.fromEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="aws-from-name">From Name</Label>
                    <Input
                      id="aws-from-name"
                      value={emailConfig.aws.fromName}
                      onChange={(e) => updateConfig('aws.fromName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SMTP Configuration */}
            {emailConfig.provider === 'smtp' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={emailConfig.smtp.host}
                      onChange={(e) => updateConfig('smtp.host', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp-port">Port</Label>
                    <Input
                      id="smtp-port"
                      type="number"
                      value={emailConfig.smtp.port}
                      onChange={(e) => updateConfig('smtp.port', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="smtp-secure"
                    checked={emailConfig.smtp.secure}
                    onCheckedChange={(checked) => updateConfig('smtp.secure', checked)}
                  />
                  <Label htmlFor="smtp-secure">Use SSL/TLS</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input
                      id="smtp-username"
                      value={emailConfig.smtp.username}
                      onChange={(e) => updateConfig('smtp.username', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      value={emailConfig.smtp.password}
                      onChange={(e) => updateConfig('smtp.password', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Email Templates</h2>
            
            <div className="space-y-6">
              {/* Newsletter Template */}
              <div>
                <Label htmlFor="newsletter-template">Newsletter Template</Label>
                <Textarea
                  id="newsletter-template"
                  value={emailConfig.templates.newsletter}
                  onChange={(e) => updateConfig('templates.newsletter', e.target.value)}
                  rows={8}
                  placeholder="<h1>IVC Accounting Newsletter</h1><p>Hello {{name}},</p><p>{{content}}</p><p>Best regards,<br>The IVC Team</p>"
                />
                <p className="text-sm text-gray-500 mt-1">
                Available variables: {`{{name}}, {{email}}, {{content}}, {{date}}`}
                </p>
              </div>

              {/* Blog Notification Template */}
              <div>
                <Label htmlFor="blog-notification-template">Blog Notification Template</Label>
                <Textarea
                  id="blog-notification-template"
                  value={emailConfig.templates.blogNotification}
                  onChange={(e) => updateConfig('templates.blogNotification', e.target.value)}
                  rows={6}
                  placeholder="<h2>New Blog Post: {{title}}</h2><p>{{excerpt}}</p><a href='{{url}}'>Read More</a>"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {{title}}, {{excerpt}}, {{url}}, {{author}}
                </p>
              </div>

              {/* Contact Auto Response Template */}
              <div>
                <Label htmlFor="contact-response-template">Contact Auto Response Template</Label>
                <Textarea
                  id="contact-response-template"
                  value={emailConfig.templates.contactAutoResponse}
                  onChange={(e) => updateConfig('templates.contactAutoResponse', e.target.value)}
                  rows={6}
                  placeholder="<h2>Thank you for contacting IVC Accounting</h2><p>Hello {{name}},</p><p>We've received your message and will respond within 24 hours.</p>"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {{name}}, {{email}}, {{subject}}, {{message}}
                </p>
              </div>

              {/* Appointment Confirmation Template */}
              <div>
                <Label htmlFor="appointment-template">Appointment Confirmation Template</Label>
                <Textarea
                  id="appointment-template"
                  value={emailConfig.templates.appointmentConfirmation}
                  onChange={(e) => updateConfig('templates.appointmentConfirmation', e.target.value)}
                  rows={6}
                  placeholder="<h2>Appointment Confirmed</h2><p>Hello {{name}},</p><p>Your appointment is confirmed for {{date}} at {{time}}.</p>"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {{name}}, {{date}}, {{time}}, {{location}}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">General Email Settings</h2>
            
            <div className="space-y-6">
              {/* Feature Toggles */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Features</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-newsletter">Enable Newsletter</Label>
                    <p className="text-sm text-gray-500">Send weekly/monthly newsletters to subscribers</p>
                  </div>
                  <Switch
                    id="enable-newsletter"
                    checked={emailConfig.settings.enableNewsletter}
                    onCheckedChange={(checked) => updateConfig('settings.enableNewsletter', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-blog-notifications">Blog Notifications</Label>
                    <p className="text-sm text-gray-500">Notify subscribers when new blog posts are published</p>
                  </div>
                  <Switch
                    id="enable-blog-notifications"
                    checked={emailConfig.settings.enableBlogNotifications}
                    onCheckedChange={(checked) => updateConfig('settings.enableBlogNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-contact-response">Contact Auto Response</Label>
                    <p className="text-sm text-gray-500">Send automatic confirmation emails for contact form submissions</p>
                  </div>
                  <Switch
                    id="enable-contact-response"
                    checked={emailConfig.settings.enableContactAutoResponse}
                    onCheckedChange={(checked) => updateConfig('settings.enableContactAutoResponse', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-appointment-confirmations">Appointment Confirmations</Label>
                    <p className="text-sm text-gray-500">Send confirmation emails for scheduled appointments</p>
                  </div>
                  <Switch
                    id="enable-appointment-confirmations"
                    checked={emailConfig.settings.enableAppointmentConfirmations}
                    onCheckedChange={(checked) => updateConfig('settings.enableAppointmentConfirmations', checked)}
                  />
                </div>
              </div>

              {/* Rate Limiting */}
              <div>
                <Label htmlFor="max-emails-per-hour">Maximum Emails Per Hour</Label>
                <Input
                  id="max-emails-per-hour"
                  type="number"
                  value={emailConfig.settings.maxEmailsPerHour}
                  onChange={(e) => updateConfig('settings.maxEmailsPerHour', parseInt(e.target.value))}
                  min="1"
                  max="1000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Rate limiting to prevent spam and stay within provider limits
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 