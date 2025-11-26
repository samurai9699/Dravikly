import { resend, FROM_EMAIL, ADMIN_EMAIL } from './resend';
import { render } from '@react-email/components';
import WelcomeEmail from '@/emails/welcome';
import AnalysisCompleteEmail from '@/emails/analysis-complete';
import SubscriptionConfirmedEmail from '@/emails/subscription-confirmed';
import SubscriptionCanceledEmail from '@/emails/subscription-canceled';
import PaymentFailedEmail from '@/emails/payment-failed';
import ContactFormSubmissionEmail from '@/emails/contact-form-submission';
import UsageLimitWarningEmail from '@/emails/usage-limit-warning';

export interface SendWelcomeEmailParams {
    to: string;
    userName?: string;
}

export interface SendAnalysisCompleteParams {
    to: string;
    userName?: string;
    url: string;
    frictionScore: number;
    analysisId: string;
}

export interface SendSubscriptionConfirmedParams {
    to: string;
    userName?: string;
    tier: string;
    billingCycle: 'monthly' | 'annual';
    amount: string;
    nextBillingDate?: string;
}

export interface SendSubscriptionCanceledParams {
    to: string;
    userName?: string;
    tier: string;
    endDate?: string;
}

export interface SendPaymentFailedParams {
    to: string;
    userName?: string;
    tier: string;
    amount: string;
    retryDate?: string;
}

export interface SendContactFormParams {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface SendUsageLimitWarningParams {
    to: string;
    userName?: string;
    currentUsage: number;
    limit: number;
    tier: string;
}

export class EmailService {
    /**
     * Send welcome email to new users
     */
    static async sendWelcomeEmail({ to, userName }: SendWelcomeEmailParams) {
        try {
            const emailHtml = await render(
                WelcomeEmail({ userName, userEmail: to })
            );

            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to,
                subject: 'Welcome to Dravikly! 🚀',
                html: emailHtml,
            });

            if (error) {
                console.error('Error sending welcome email:', error);
                throw error;
            }

            console.log('Welcome email sent:', data?.id);
            return data;
        } catch (error) {
            console.error('Failed to send welcome email:', error);
            throw error;
        }
    }

    /**
     * Send analysis complete notification
     */
    static async sendAnalysisCompleteEmail({
        to,
        userName,
        url,
        frictionScore,
        analysisId,
    }: SendAnalysisCompleteParams) {
        try {
            const emailHtml = await render(
                AnalysisCompleteEmail({ userName, url, frictionScore, analysisId })
            );

            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to,
                subject: `Your friction analysis for ${url} is ready!`,
                html: emailHtml,
            });

            if (error) {
                console.error('Error sending analysis complete email:', error);
                throw error;
            }

            console.log('Analysis complete email sent:', data?.id);
            return data;
        } catch (error) {
            console.error('Failed to send analysis complete email:', error);
            throw error;
        }
    }

    /**
     * Send subscription confirmed email
     */
    static async sendSubscriptionConfirmedEmail({
        to,
        userName,
        tier,
        billingCycle,
        amount,
        nextBillingDate,
    }: SendSubscriptionConfirmedParams) {
        try {
            const emailHtml = await render(
                SubscriptionConfirmedEmail({
                    userName,
                    tier,
                    billingCycle,
                    amount,
                    nextBillingDate,
                })
            );

            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to,
                subject: `Welcome to Dravikly ${tier}! 🎉`,
                html: emailHtml,
            });

            if (error) {
                console.error('Error sending subscription confirmed email:', error);
                throw error;
            }

            console.log('Subscription confirmed email sent:', data?.id);
            return data;
        } catch (error) {
            console.error('Failed to send subscription confirmed email:', error);
            throw error;
        }
    }

    /**
     * Send subscription canceled email
     */
    static async sendSubscriptionCanceledEmail({
        to,
        userName,
        tier,
        endDate,
    }: SendSubscriptionCanceledParams) {
        try {
            const emailHtml = await render(
                SubscriptionCanceledEmail({ userName, tier, endDate })
            );

            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to,
                subject: 'Your Dravikly subscription has been canceled',
                html: emailHtml,
            });

            if (error) {
                console.error('Error sending subscription canceled email:', error);
                throw error;
            }

            console.log('Subscription canceled email sent:', data?.id);
            return data;
        } catch (error) {
            console.error('Failed to send subscription canceled email:', error);
            throw error;
        }
    }

    /**
     * Send payment failed email
     */
    static async sendPaymentFailedEmail({
        to,
        userName,
        tier,
        amount,
        retryDate,
    }: SendPaymentFailedParams) {
        try {
            const emailHtml = await render(
                PaymentFailedEmail({ userName, tier, amount, retryDate })
            );

            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to,
                subject: '⚠️ Action required: Payment failed for your Dravikly subscription',
                html: emailHtml,
            });

            if (error) {
                console.error('Error sending payment failed email:', error);
                throw error;
            }

            console.log('Payment failed email sent:', data?.id);
            return data;
        } catch (error) {
            console.error('Failed to send payment failed email:', error);
            throw error;
        }
    }

    /**
     * Send contact form submission to admin
     */
    static async sendContactFormEmail({
        name,
        email,
        subject,
        message,
    }: SendContactFormParams) {
        try {
            // Send to admin
            const adminEmailHtml = await render(
                ContactFormSubmissionEmail({ name, email, subject, message })
            );

            const { data: adminData, error: adminError } = await resend.emails.send({
                from: FROM_EMAIL,
                to: ADMIN_EMAIL,
                replyTo: email,
                subject: `Contact Form: ${subject}`,
                html: adminEmailHtml,
            });

            if (adminError) {
                console.error('Error sending contact form to admin:', adminError);
                throw adminError;
            }

            // Send auto-reply to user
            const { data: userReplyData, error: userReplyError } = await resend.emails.send({
                from: FROM_EMAIL,
                to: email,
                subject: 'We received your message',
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1e293b; color: #cbd5e1; border-radius: 8px;">
            <h1 style="color: #22d3ee; text-align: center;">Thanks for contacting us!</h1>
            <p>Hi ${name},</p>
            <p>We've received your message and will get back to you within 24 hours.</p>
            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong style="color: #22d3ee;">Your message:</strong></p>
              <p style="margin: 10px 0 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 32px;">
              Best regards,<br />
              The Dravikly Team
            </p>
          </div>
        `,
            });

            if (userReplyError) {
                console.error('Error sending auto-reply:', userReplyError);
                // Don't throw - admin email was sent successfully
            }

            console.log('Contact form emails sent:', { adminData, userReplyData });
            return { adminData, userReplyData };
        } catch (error) {
            console.error('Failed to send contact form email:', error);
            throw error;
        }
    }

    /**
     * Send usage limit warning
     */
    static async sendUsageLimitWarningEmail({
        to,
        userName,
        currentUsage,
        limit,
        tier,
    }: SendUsageLimitWarningParams) {
        try {
            const emailHtml = await render(
                UsageLimitWarningEmail({ userName, currentUsage, limit, tier })
            );

            const percentage = Math.round((currentUsage / limit) * 100);

            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to,
                subject: `Usage Alert: ${percentage}% of your monthly analyses used`,
                html: emailHtml,
            });

            if (error) {
                console.error('Error sending usage limit warning email:', error);
                throw error;
            }

            console.log('Usage limit warning email sent:', data?.id);
            return data;
        } catch (error) {
            console.error('Failed to send usage limit warning email:', error);
            throw error;
        }
    }
}
