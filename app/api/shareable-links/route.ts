// app/api/shareable-links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { generateShareableToken, createShareableLink } from '@/lib/shareableLink';

/**
 * POST /api/shareable-links
 * Generate a new shareable login link
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate unique token
    const token = generateShareableToken();

    // Store in shareable_links table with expiry (7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
      .from('shareable_links')
      .insert({
        token,
        email,
        expires_at: expiresAt,
        used: false,
      });

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create shareable link' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shareableLink = createShareableLink(baseUrl, token);

    return NextResponse.json({
      success: true,
      link: shareableLink,
      token,
      expiresAt,
    });
  } catch (error) {
    console.error('Error generating shareable link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/shareable-links/:token
 * Validate a shareable link
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Fetch link from database
    const { data: link, error } = await supabase
      .from('shareable_links')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !link) {
      return NextResponse.json(
        { error: 'Invalid or expired link' },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date(link.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Link has expired' },
        { status: 410 }
      );
    }

    // Check if already used
    if (link.used) {
      return NextResponse.json(
        { error: 'Link has already been used' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      email: link.email,
      token,
    });
  } catch (error) {
    console.error('Error validating shareable link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
