import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { EmailService } from '@/lib/email/service';

export const dynamic = 'force-dynamic';

/**
 * Send welcome email to newly registered users
 * This endpoint should be called after successful signup
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: any) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: any) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );

        // Verify user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user email
        const userEmail = user.email;
        if (!userEmail) {
            return NextResponse.json(
                { error: 'User email not found' },
                { status: 400 }
            );
        }

        // Extract name from email (before @) as fallback
        const userName = user.user_metadata?.name || userEmail.split('@')[0];

        // Send welcome email
        await EmailService.sendWelcomeEmail({
            to: userEmail,
            userName,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending welcome email:', error);
        // Don't fail the request if email fails
        return NextResponse.json(
            { error: 'Failed to send welcome email', details: error },
            { status: 500 }
        );
    }
}
