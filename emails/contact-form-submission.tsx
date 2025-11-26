import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactFormSubmissionEmailProps {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const ContactFormSubmissionEmail = ({
    name,
    email,
    subject,
    message,
}: ContactFormSubmissionEmailProps) => {
    const previewText = `New contact form submission from ${name}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>New Contact Form Submission</Heading>

                    <Section style={detailsSection}>
                        <Text style={detailRow}>
                            <strong style={detailLabel}>From:</strong> {name}
                        </Text>
                        <Text style={detailRow}>
                            <strong style={detailLabel}>Email:</strong> {email}
                        </Text>
                        <Text style={detailRow}>
                            <strong style={detailLabel}>Subject:</strong> {subject}
                        </Text>
                    </Section>

                    <Section style={messageSection}>
                        <Text style={messageLabel}>Message:</Text>
                        <Text style={messageText}>{message}</Text>
                    </Section>

                    <Text style={footer}>
                        Reply to {email} to respond to this inquiry.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default ContactFormSubmissionEmail;

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
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 20px',
};

const detailsSection = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
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

const messageSection = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
};

const messageLabel = {
    color: '#22d3ee',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 12px',
};

const messageText = {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0',
    whiteSpace: 'pre-wrap' as const,
};

const footer = {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '24px',
    marginTop: '24px',
};
