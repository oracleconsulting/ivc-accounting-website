// /lib/services/newsletterService.ts
import { supabase } from '@/lib/supabaseClient';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  plain_text: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduled_for?: string;
  sent_at?: string;
  recipient_count?: number;
}

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  tags?: string[];
  subscribed_at: string;
}

interface SendResult {
  success: boolean;
  sent: number;
  failed: number;
  errors?: string[];
}

export class NewsletterService {
  // Create a new newsletter
  async createNewsletter(data: Partial<Newsletter>): Promise<Newsletter> {
    try {
      const { data: newsletter, error } = await supabase
        .from('newsletters')
        .insert({
          ...data,
          status: 'draft',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return newsletter;
    } catch (error) {
      console.error('Error creating newsletter:', error);
      throw error;
    }
  }

  // Update newsletter
  async updateNewsletter(id: string, updates: Partial<Newsletter>): Promise<Newsletter> {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating newsletter:', error);
      throw error;
    }
  }

  // Send newsletter
  async send(newsletterId: string): Promise<SendResult> {
    try {
      // Get newsletter details
      const { data: newsletter, error: newsletterError } = await supabase
        .from('newsletters')
        .select('*')
        .eq('id', newsletterId)
        .single();

      if (newsletterError) throw newsletterError;
      if (!newsletter) throw new Error('Newsletter not found');

      // Update status to sending
      await this.updateNewsletter(newsletterId, { status: 'sending' });

      // Get active subscribers
      const subscribers = await this.getActiveSubscribers();
      
      // Send in batches to avoid rate limits
      const batchSize = 100;
      const batches = this.chunkArray(subscribers, batchSize);
      
      let totalSent = 0;
      let totalFailed = 0;
      const errors: string[] = [];

      for (const batch of batches) {
        const results = await Promise.allSettled(
          batch.map(subscriber => this.sendToSubscriber(newsletter, subscriber))
        );

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            totalSent++;
          } else {
            totalFailed++;
            errors.push(`Failed to send to ${batch[index].email}: ${result.reason}`);
          }
        });

        // Rate limiting delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Update newsletter status and stats
      await supabase
        .from('newsletters')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          recipient_count: totalSent
        })
        .eq('id', newsletterId);

      // Record send event
      await supabase
        .from('newsletter_sends')
        .insert({
          newsletter_id: newsletterId,
          sent_at: new Date().toISOString(),
          recipient_count: totalSent,
          failed_count: totalFailed
        });

      return {
        success: totalFailed === 0,
        sent: totalSent,
        failed: totalFailed,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Error sending newsletter:', error);
      
      // Update status back to draft on complete failure
      await this.updateNewsletter(newsletterId, { status: 'draft' });
      
      throw error;
    }
  }

  // Send to individual subscriber
  private async sendToSubscriber(newsletter: Newsletter, subscriber: Subscriber): Promise<void> {
    try {
      // Personalize content
      const personalizedHtml = this.personalizeContent(newsletter.content, subscriber);
      const personalizedText = this.personalizeContent(newsletter.plain_text, subscriber);

      // Add tracking pixel
      const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/track/open?id=${newsletter.id}&subscriber=${subscriber.id}" width="1" height="1" />`;
      const htmlWithTracking = personalizedHtml + trackingPixel;

      // Send via Resend
      const { data, error } = await resend.emails.send({
        from: 'IVC Accounting <newsletter@ivcaccounting.com>',
        to: subscriber.email,
        subject: newsletter.subject,
        html: htmlWithTracking,
        text: personalizedText,
        headers: {
          'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${subscriber.email}>`,
          'X-Campaign-ID': newsletter.id
        }
      });

      if (error) throw error;

      // Record send
      await supabase
        .from('newsletter_subscriber_sends')
        .insert({
          newsletter_id: newsletter.id,
          subscriber_id: subscriber.id,
          sent_at: new Date().toISOString(),
          message_id: data?.id
        });
    } catch (error) {
      console.error(`Failed to send to ${subscriber.email}:`, error);
      throw error;
    }
  }

  // Get active subscribers
  async getActiveSubscribers(tags?: string[]): Promise<Subscriber[]> {
    try {
      let query = supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('status', 'active');

      if (tags && tags.length > 0) {
        query = query.contains('tags', tags);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      throw error;
    }
  }

  // Subscribe a new email
  async subscribe(email: string, name?: string, tags?: string[]): Promise<Subscriber> {
    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single();

      if (existing) {
        // Reactivate if unsubscribed
        if (existing.status === 'unsubscribed') {
          const { data, error } = await supabase
            .from('newsletter_subscribers')
            .update({
              status: 'active',
              name: name || existing.name,
              tags: tags || existing.tags,
              resubscribed_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single();

          if (error) throw error;
          return data;
        }
        return existing;
      }

      // Create new subscriber
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email,
          name,
          tags,
          status: 'active',
          subscribed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Send welcome email
      await this.sendWelcomeEmail(data);

      return data;
    } catch (error) {
      console.error('Error subscribing:', error);
      throw error;
    }
  }

  // Unsubscribe
  async unsubscribe(email: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email);

      if (error) throw error;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      throw error;
    }
  }

  // Track email open
  async trackOpen(newsletterId: string, subscriberId: string): Promise<void> {
    try {
      await supabase
        .from('newsletter_opens')
        .insert({
          newsletter_id: newsletterId,
          subscriber_id: subscriberId,
          opened_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking open:', error);
    }
  }

  // Track link click
  async trackClick(newsletterId: string, subscriberId: string, url: string): Promise<void> {
    try {
      await supabase
        .from('newsletter_clicks')
        .insert({
          newsletter_id: newsletterId,
          subscriber_id: subscriberId,
          url,
          clicked_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  // Get newsletter analytics
  async getAnalytics(newsletterId: string): Promise<any> {
    try {
      const [sends, opens, clicks] = await Promise.all([
        supabase
          .from('newsletter_sends')
          .select('*')
          .eq('newsletter_id', newsletterId)
          .single(),
        supabase
          .from('newsletter_opens')
          .select('*', { count: 'exact' })
          .eq('newsletter_id', newsletterId),
        supabase
          .from('newsletter_clicks')
          .select('*', { count: 'exact' })
          .eq('newsletter_id', newsletterId)
      ]);

      const sendData = sends.data;
      const openCount = opens.count || 0;
      const clickCount = clicks.count || 0;
      const recipientCount = sendData?.recipient_count || 0;

      return {
        sent: recipientCount,
        opens: openCount,
        openRate: recipientCount > 0 ? (openCount / recipientCount) * 100 : 0,
        clicks: clickCount,
        clickRate: recipientCount > 0 ? (clickCount / recipientCount) * 100 : 0,
        clickToOpenRate: openCount > 0 ? (clickCount / openCount) * 100 : 0
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Helper methods
  private personalizeContent(content: string, subscriber: Subscriber): string {
    return content
      .replace(/\{\{name\}\}/g, subscriber.name || 'Valued Client')
      .replace(/\{\{email\}\}/g, subscriber.email)
      .replace(/\{\{unsubscribe_url\}\}/g, 
        `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${subscriber.email}`);
  }

  private async sendWelcomeEmail(subscriber: Subscriber): Promise<void> {
    try {
      await resend.emails.send({
        from: 'IVC Accounting <welcome@ivcaccounting.com>',
        to: subscriber.email,
        subject: 'Welcome to IVC Accounting Newsletter!',
        html: `
          <h1>Welcome${subscriber.name ? `, ${subscriber.name}` : ''}!</h1>
          <p>Thank you for subscribing to the IVC Accounting newsletter.</p>
          <p>You'll receive our latest insights on tax strategies, accounting tips, and business growth advice.</p>
          <p>Best regards,<br>The IVC Accounting Team</p>
        `,
        text: `Welcome${subscriber.name ? `, ${subscriber.name}` : ''}! Thank you for subscribing to the IVC Accounting newsletter.`
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export const newsletterService = new NewsletterService();