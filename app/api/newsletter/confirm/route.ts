import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { ResendEmailService } from '@/lib/services/resendEmailService';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and service role key are required');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter-error?error=invalid-token`
    );
  }

  try {
    const supabase = getSupabaseClient();
    
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
    try {
      if (process.env.RESEND_API_KEY) {
        await sendWelcomeEmail(subscriber.email);
      } else {
        console.log('Email sending skipped - no RESEND_API_KEY');
      }
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail the confirmation - continue anyway
    }

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
  // Only send email if API key is available
  if (process.env.RESEND_API_KEY) {
    try {
      const emailService = new ResendEmailService();
      await emailService.sendNewsletterWelcome(email);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw error to avoid breaking the confirmation flow
    }
  } else {
    console.log('RESEND_API_KEY not set. Would send welcome email to:', email);
  }
} 