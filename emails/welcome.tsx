import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    userName?: string;
    userEmail: string;
}

export const WelcomeEmail = ({ userName, userEmail }: WelcomeEmailProps) => {
    const previewText = 'Welcome to Dravikly - Start eliminating friction today!';

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Welcome to Dravikly! 🚀</Heading>

                    <Text style={text}>
                        Hi {userName || 'there'},
                    </Text>

                    <Text style={text}>
                        Thanks for joining Dravikly! We're excited to help you eliminate friction
                        and boost your conversion rates with AI-powered insights.
                    </Text>

                    <Section style={benefitsSection}>
                        <Text style={benefitsTitle}>What you can do with your FREE account:</Text>
                        <Text style={benefitItem}>✓ 3 analyses per day</Text>
                        <Text style={benefitItem}>✓ AI-powered friction detection</Text>
                        <Text style={benefitItem}>✓ Actionable recommendations</Text>
                        <Text style={benefitItem}>✓ 7-day history retention</Text>
                    </Section>

                    <Section style={buttonContainer}>
                        <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
                            Start Your First Analysis
                        </Button>
                    </Section>

                    <Text style={text}>
                        Need help getting started? Check out our{' '}
                        <Link style={link} href={`${process.env.NEXT_PUBLIC_APP_URL}/guide`}>
                            Quick Start Guide
                        </Link>
                        {' '}or reply to this email with any questions.
                    </Text>

                    <Text style={footer}>
                        Happy analyzing!<br />
                        The Dravikly Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default WelcomeEmail;

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

const link = {
    color: '#22d3ee',
    textDecoration: 'underline',
};

const footer = {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '24px',
    marginTop: '32px',
};
