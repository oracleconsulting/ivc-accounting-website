import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { ResendEmailService } from '@/lib/services/resendEmailService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, source, consent } = await request.json();

    if (!email || !consent) {
      return NextResponse.json(
        { error: 'Email and consent are required' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'confirmed') {
        return NextResponse.json(
          { error: 'Already subscribed' },
          { status: 400 }
        );
      }
      
      if (existing.status === 'unsubscribed') {
        // Resubscribe
        const { error } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'pending',
            consent: true,
            consent_timestamp: new Date().toISOString(),
            source,
            unsubscribed_at: null
          })
          .eq('id', existing.id);

        if (error) throw error;
      }
    } else {
      // Generate confirmation token
      const confirmationToken = crypto.randomBytes(32).toString('hex');

      // Create new subscriber
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email,
          source,
          consent,
          consent_timestamp: new Date().toISOString(),
          confirmation_token: confirmationToken
        });

      if (error) throw error;

      // Send confirmation email via Resend
      await sendConfirmationEmail(email, confirmationToken);
    }

    return NextResponse.json({
      success: true,
      message: 'Please check your email to confirm your subscription'
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/newsletter/confirm?token=${token}`;
  
  try {
    const emailService = new ResendEmailService();
    await emailService.sendNewsletterConfirmation(email, confirmUrl);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    // Don't throw error to avoid breaking the subscription flow
  }
} 