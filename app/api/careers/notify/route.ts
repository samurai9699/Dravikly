import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email/service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate input
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Send career interest confirmation email
        await EmailService.sendCareerInterestEmail({ to: email });

        // TODO: Store email in database for future notifications
        // await db.careerInterests.create({ email, createdAt: new Date() });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing career interest:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
