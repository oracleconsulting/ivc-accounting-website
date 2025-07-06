import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { ResendEmailService } from '@/lib/services/resendEmailService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter-error?error=invalid-token`
    );
  }

  try {
    // Find subscriber by token
    const { data: subscriber, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('confirmation_token', token)
      .single();

    if (error || !subscriber) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter-error?error=invalid-token`
      );
    }

    if (subscriber.status === 'confirmed') {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter-success?already=true`
      );
    }

    // Confirm subscription
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmation_token: null
      })
      .eq('id', subscriber.id);

    if (updateError) throw updateError;

    // Send welcome email
    await sendWelcomeEmail(subscriber.email);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter-success`
    );
  } catch (error) {
    console.error('Newsletter confirm error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter-error?error=server-error`
    );
  }
}

async function sendWelcomeEmail(email: string) {
  try {
    const emailService = new ResendEmailService();
    await emailService.sendNewsletterWelcome(email);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw error to avoid breaking the confirmation flow
  }
} 