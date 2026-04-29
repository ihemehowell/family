// app/api/shareable-links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { generateShareableToken, createShareableLink } from '@/lib/shareableLink';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const token = generateShareableToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { error: insertError } = await supabaseAdmin
      .from('shareable_links')
      .insert({ token, email, expires_at: expiresAt, used: false });

    // ✅ actually handle the error
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

    const { data: link, error } = await supabaseAdmin
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

    if (new Date(link.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Link has expired' },
        { status: 410 }
      );
    }

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