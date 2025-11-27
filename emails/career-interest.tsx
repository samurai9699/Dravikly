import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface CareerInterestEmailProps {
    userEmail: string;
}

export const CareerInterestEmail = ({ userEmail }: CareerInterestEmailProps) => {
    const previewText = 'Thanks for your interest in joining Dravikly!';

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Thanks for Your Interest! 🚀</Heading>

                    <Text style={text}>
                        Hi there,
                    </Text>

                    <Text style={text}>
                        Thank you for your interest in joining the Dravikly team! We're building
                        something special, and it means a lot that talented people like you want
                        to be part of our journey.
                    </Text>

                    <Section style={highlightSection}>
                        <Text style={highlightText}>
                            While we don't have any open positions right now, we're growing fast
                            and always looking for exceptional talent. We've added you to our
                            careers list and will reach out as soon as opportunities arise.
                        </Text>
                    </Section>

                    <Text style={text}>
                        In the meantime, here's what we're working on:
                    </Text>

                    <Section style={benefitsSection}>
                        <Text style={benefitItem}>🤖 AI-powered conversion optimization</Text>
                        <Text style={benefitItem}>⚡ Real-time friction detection</Text>
                        <Text style={benefitItem}>📊 Advanced analytics at scale</Text>
                        <Text style={benefitItem}>✨ Beautiful, intuitive interfaces</Text>
                    </Section>

                    <Section style={buttonContainer}>
                        <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}`}>
                            Explore Dravikly
                        </Button>
                    </Section>

                    <Text style={text}>
                        Want to learn more about what we do? Try our{' '}
                        <Link style={link} href={`${process.env.NEXT_PUBLIC_APP_URL}/signup`}>
                            free analysis tool
                        </Link>
                        {' '}or reach out to us at{' '}
                        <Link style={link} href={`${process.env.NEXT_PUBLIC_APP_URL}/contact`}>
                            our contact page
                        </Link>.
                    </Text>

                    <Text style={footer}>
                        We'll be in touch soon!<br />
                        The Dravikly Team
                    </Text>

                    <Text style={disclaimer}>
                        You're receiving this because you signed up for career updates at dravikly.com/careers
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default CareerInterestEmail;

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

const highlightSection = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    borderLeft: '4px solid #22d3ee',
};

const highlightText = {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0',
};

const benefitsSection = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
};

const benefitItem = {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '28px',
    margin: '8px 0',
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

const disclaimer = {
    color: '#64748b',
    fontSize: '12px',
    lineHeight: '20px',
    marginTop: '24px',
    textAlign: 'center' as const,
};
