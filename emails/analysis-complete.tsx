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

interface AnalysisCompleteEmailProps {
    userName?: string;
    url: string;
    frictionScore: number;
    analysisId: string;
}

export const AnalysisCompleteEmail = ({
    userName,
    url,
    frictionScore,
    analysisId,
}: AnalysisCompleteEmailProps) => {
    const previewText = `Your friction analysis for ${url} is ready!`;
    const scoreColor = frictionScore < 30 ? '#10b981' : frictionScore < 60 ? '#f59e0b' : '#ef4444';

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Analysis Complete! ✅</Heading>

                    <Text style={text}>
                        Hi {userName || 'there'},
                    </Text>

                    <Text style={text}>
                        Your friction analysis is ready! We've analyzed <strong style={urlText}>{url}</strong>
                        and identified key friction points that may be hurting your conversions.
                    </Text>

                    <Section style={scoreSection}>
                        <Text style={scoreLabel}>Friction Score</Text>
                        <Text style={{ ...scoreValue, color: scoreColor }}>{frictionScore}/100</Text>
                        <Text style={scoreDescription}>
                            {frictionScore < 30 && 'Excellent! Low friction detected.'}
                            {frictionScore >= 30 && frictionScore < 60 && 'Moderate friction - room for improvement.'}
                            {frictionScore >= 60 && 'High friction - significant optimization needed.'}
                        </Text>
                    </Section>

                    <Section style={buttonContainer}>
                        <Button
                            style={button}
                            href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/results/${analysisId}`}
                        >
                            View Full Report
                        </Button>
                    </Section>

                    <Text style={text}>
                        The report includes detailed insights and actionable recommendations to help
                        you eliminate friction and boost conversions.
                    </Text>

                    <Text style={footer}>
                        Keep optimizing!<br />
                        The Dravikly Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default AnalysisCompleteEmail;

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

const urlText = {
    color: '#22d3ee',
};

const scoreSection = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
    textAlign: 'center' as const,
};

const scoreLabel = {
    color: '#94a3b8',
    fontSize: '14px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    margin: '0 0 8px',
};

const scoreValue = {
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '8px 0',
};

const scoreDescription = {
    color: '#cbd5e1',
    fontSize: '16px',
    margin: '12px 0 0',
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
