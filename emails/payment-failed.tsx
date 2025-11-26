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

interface PaymentFailedEmailProps {
    userName?: string;
    tier: string;
    amount: string;
    retryDate?: string;
}

export const PaymentFailedEmail = ({
    userName,
    tier,
    amount,
    retryDate,
}: PaymentFailedEmailProps) => {
    const previewText = 'Action required: Payment failed for your Dravikly subscription';

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>⚠️ Payment Failed</Heading>

                    <Text style={text}>
                        Hi {userName || 'there'},
                    </Text>

                    <Text style={text}>
                        We were unable to process your payment of <strong>{amount}</strong> for
                        your Dravikly {tier} subscription.
                    </Text>

                    <Section style={warningSection}>
                        <Text style={warningText}>
                            <strong>Action Required:</strong> Please update your payment method to avoid
                            service interruption.
                        </Text>
                    </Section>

                    {retryDate && (
                        <Text style={text}>
                            We'll automatically retry the payment on <strong>{retryDate}</strong>.
                            If the payment fails again, your subscription may be canceled.
                        </Text>
                    )}

                    <Section style={buttonContainer}>
                        <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`}>
                            Update Payment Method
                        </Button>
                    </Section>

                    <Text style={text}>
                        Common reasons for payment failure:
                    </Text>

                    <Section style={reasonsSection}>
                        <Text style={reasonItem}>• Insufficient funds</Text>
                        <Text style={reasonItem}>• Expired card</Text>
                        <Text style={reasonItem}>• Card declined by bank</Text>
                        <Text style={reasonItem}>• Incorrect billing information</Text>
                    </Section>

                    <Text style={text}>
                        If you continue to experience issues, please contact your bank or reply to
                        this email for assistance.
                    </Text>

                    <Text style={footer}>
                        Need help?<br />
                        The Dravikly Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default PaymentFailedEmail;

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
    color: '#ef4444',
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

const warningSection = {
    backgroundColor: '#7f1d1d',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    borderLeft: '4px solid #ef4444',
};

const warningText = {
    color: '#fecaca',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0',
};

const reasonsSection = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '20px',
    margin: '16px 0',
};

const reasonItem = {
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
    backgroundColor: '#ef4444',
    borderRadius: '8px',
    color: '#ffffff',
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
