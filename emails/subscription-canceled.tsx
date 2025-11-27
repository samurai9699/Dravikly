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

interface SubscriptionCanceledEmailProps {
    userName?: string;
    tier: string;
    endDate?: string;
}

export const SubscriptionCanceledEmail = ({
    userName,
    tier,
    endDate,
}: SubscriptionCanceledEmailProps) => {
    const previewText = 'Your Dravikly subscription has been canceled';

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Subscription Canceled</Heading>

                    <Text style={text}>
                        Hi {userName || 'there'},
                    </Text>

                    <Text style={text}>
                        We're sorry to see you go. Your Dravikly {tier} subscription has been canceled.
                    </Text>

                    {endDate && (
                        <Section style={infoSection}>
                            <Text style={infoText}>
                                You'll continue to have access to {tier} features until <strong>{endDate}</strong>.
                                After that, your account will be downgraded to the FREE tier.
                            </Text>
                        </Section>
                    )}

                    <Section style={freeSection}>
                        <Text style={freeSectionTitle}>FREE tier includes:</Text>
                        <Text style={benefitItem}>✓ 5 analyses total</Text>
                        <Text style={benefitItem}>✓ Basic friction reports</Text>
                        <Text style={benefitItem}>✓ 7-day history</Text>
                    </Section>

                    <Text style={text}>
                        Changed your mind? You can reactivate your subscription anytime from your account settings.
                    </Text>

                    <Section style={buttonContainer}>
                        <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/pricing`}>
                            View Plans
                        </Button>
                    </Section>

                    <Text style={text}>
                        We'd love to hear your feedback. Reply to this email and let us know how we can improve.
                    </Text>

                    <Text style={footer}>
                        Thanks for being part of Dravikly,<br />
                        The Dravikly Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default SubscriptionCanceledEmail;

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
    color: '#cbd5e1',
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

const infoSection = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    borderLeft: '4px solid #f59e0b',
};

const infoText = {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0',
};

const freeSection = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
};

const freeSectionTitle = {
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
