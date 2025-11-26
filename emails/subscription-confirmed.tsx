import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface SubscriptionConfirmedEmailProps {
    userName?: string;
    tier: string;
    billingCycle: 'monthly' | 'annual';
    amount: string;
    nextBillingDate?: string;
}

export const SubscriptionConfirmedEmail = ({
    userName,
    tier,
    billingCycle,
    amount,
    nextBillingDate,
}: SubscriptionConfirmedEmailProps) => {
    const previewText = `Welcome to Dravikly ${tier}!`;

    const tierBenefits = {
        STARTER: [
            '60 analyses per month',
            'PDF export',
            '90-day history',
            'Email support',
        ],
        PRO: [
            '300 analyses per month',
            'API access',
            'Priority processing',
            'Unlimited history',
            'Priority support',
        ],
        ENTERPRISE: [
            'Unlimited analyses',
            'White-label reports',
            '5 team seats',
            'Priority support',
            'Dedicated account manager',
        ],
    };

    const benefits = tierBenefits[tier as keyof typeof tierBenefits] || [];

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Welcome to {tier}! 🎉</Heading>

                    <Text style={text}>
                        Hi {userName || 'there'},
                    </Text>

                    <Text style={text}>
                        Thank you for upgrading to Dravikly {tier}! Your subscription is now active
                        and you have access to all premium features.
                    </Text>

                    <Section style={detailsSection}>
                        <Text style={detailRow}>
                            <strong style={detailLabel}>Plan:</strong> {tier}
                        </Text>
                        <Text style={detailRow}>
                            <strong style={detailLabel}>Billing:</strong> {amount} / {billingCycle}
                        </Text>
                        {nextBillingDate && (
                            <Text style={detailRow}>
                                <strong style={detailLabel}>Next billing date:</strong> {nextBillingDate}
                            </Text>
                        )}
                    </Section>

                    <Section style={benefitsSection}>
                        <Text style={benefitsTitle}>Your {tier} benefits:</Text>
                        {benefits.map((benefit, index) => (
                            <Text key={index} style={benefitItem}>✓ {benefit}</Text>
                        ))}
                    </Section>

                    <Section style={buttonContainer}>
                        <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
                            Go to Dashboard
                        </Button>
                    </Section>

                    <Text style={text}>
                        You can manage your subscription anytime from your account settings.
                    </Text>

                    <Text style={footer}>
                        Thanks for your support!<br />
                        The Dravikly Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default SubscriptionConfirmedEmail;

const main = {
    backgroundColor: '#0f172a',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#1e293b',
    margin: '0 auto',
    padding: '40px 20px',
    borderRadius: '8px',
    maxWidth: '600px',
};

const h1 = {
    color: '#22d3ee',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 20px',
    textAlign: 'center' as const,
};

const text = {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '16px 0',
};

const detailsSection = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
};

const detailRow = {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '28px',
    margin: '8px 0',
};

const detailLabel = {
    color: '#22d3ee',
};

const benefitsSection = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
};

const benefitsTitle = {
    color: '#22d3ee',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 12px',
};

const benefitItem = {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '28px',
    margin: '4px 0',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#22d3ee',
    borderRadius: '8px',
    color: '#0f172a',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 32px',
};

const footer = {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '24px',
    marginTop: '32px',
};
