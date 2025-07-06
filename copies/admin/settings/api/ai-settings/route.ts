// FILE: app/api/ai/settings/route.ts
// AI settings API route

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Add error handling for missing env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
}

// Create client only if we have the required keys
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET current AI settings
export async function GET() {
  if (!supabase) {
    // Return defaults if Supabase is not configured
    return NextResponse.json({
      research_system_prompt: `You are an expert UK accounting and tax research assistant specializing in finding timely, relevant topics for accounting blog content. Your expertise includes UK tax law and HMRC regulations, small business accounting challenges, regional business trends in Essex and East of England, and financial planning and strategy.`,
      research_temperature: 0.7,
      research_model: 'anthropic/claude-3-haiku',
      writing_system_prompt: `You are an expert blog writer for IVC Accounting, a chartered accounting firm in Halstead, Essex. Your writing style is professional, educational, SEO-optimized without being keyword-stuffed, practical and actionable for UK small businesses, and compliant with UK financial regulations. Brand voice: "OTHER ACCOUNTANTS FILE. WE FIGHT." - We're proactive, protective, and passionate about our clients' success.`,
      writing_temperature: 0.8,
      writing_model: 'anthropic/claude-3-sonnet',
      social_system_prompt: `You are a social media expert for IVC Accounting. Create engaging, platform-specific content that maintains professional credibility while being approachable, uses platform best practices, includes relevant hashtags, drives traffic back to the blog, and reflects the brand: "OTHER ACCOUNTANTS FILE. WE FIGHT."`,
      social_temperature: 0.9,
      social_model: 'anthropic/claude-3-haiku',
    });
  }

  try {
    const { data, error } = await supabase
      .from('ai_settings')
      .select('*')
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching AI settings:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
    
    if (!data) {
      // Return defaults if no settings exist
      return NextResponse.json({
        research_system_prompt: `You are an expert UK accounting and tax research assistant specializing in finding timely, relevant topics for accounting blog content. Your expertise includes UK tax law and HMRC regulations, small business accounting challenges, regional business trends in Essex and East of England, and financial planning and strategy.`,
        research_temperature: 0.7,
        research_model: 'anthropic/claude-3-haiku',
        writing_system_prompt: `You are an expert blog writer for IVC Accounting, a chartered accounting firm in Halstead, Essex. Your writing style is professional, educational, SEO-optimized without being keyword-stuffed, practical and actionable for UK small businesses, and compliant with UK financial regulations. Brand voice: "OTHER ACCOUNTANTS FILE. WE FIGHT." - We're proactive, protective, and passionate about our clients' success.`,
        writing_temperature: 0.8,
        writing_model: 'anthropic/claude-3-sonnet',
        social_system_prompt: `You are a social media expert for IVC Accounting. Create engaging, platform-specific content that maintains professional credibility while being approachable, uses platform best practices, includes relevant hashtags, drives traffic back to the blog, and reflects the brand: "OTHER ACCOUNTANTS FILE. WE FIGHT."`,
        social_temperature: 0.9,
        social_model: 'anthropic/claude-3-haiku',
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in AI settings GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update AI settings
export async function PUT(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const settings = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'research_system_prompt',
      'writing_system_prompt', 
      'social_system_prompt'
    ];
    
    for (const field of requiredFields) {
      if (!settings[field] || typeof settings[field] !== 'string') {
        return NextResponse.json(
          { error: `Missing or invalid ${field}` }, 
          { status: 400 }
        );
      }
    }
    
    // Validate temperature values
    const temperatureFields = ['research_temperature', 'writing_temperature', 'social_temperature'];
    for (const field of temperatureFields) {
      if (settings[field] !== undefined) {
        const temp = parseFloat(settings[field]);
        if (isNaN(temp) || temp < 0 || temp > 1) {
          return NextResponse.json(
            { error: `${field} must be a number between 0 and 1` }, 
            { status: 400 }
          );
        }
      }
    }
    
    const { error } = await supabase
      .from('ai_settings')
      .upsert({
        id: 1, // Single row for settings
        ...settings,
        updated_at: new Date().toISOString()
      });
      
    if (error) {
      console.error('Error updating AI settings:', error);
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in AI settings PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 