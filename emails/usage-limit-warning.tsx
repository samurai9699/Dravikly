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

interface UsageLimitWarningEmailProps {
    userName?: string;
    currentUsage: number;
    limit: number;
    tier: string;
}

export const UsageLimitWarningEmail = ({
    userName,
    currentUsage,
    limit,
    tier,
}: UsageLimitWarningEmailProps) => {
    const percentage = Math.round((currentUsage / limit) * 100);
    const previewText = `You've used ${percentage}% of your monthly analyses`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Usage Alert 📊</Heading>

                    <Text style={text}>
                        Hi {userName || 'there'},
                    </Text>

                    <Text style={text}>
                        You've used <strong>{currentUsage} of {limit}</strong> analyses this month
                        ({percentage}% of your {tier} plan limit).
                    </Text>

                    <Section style={progressSection}>
                        <div style={progressBar}>
                            <div style={{ ...progressFill, width: `${Math.min(percentage, 100)}%` }} />
                        </div>
                        <Text style={progressText}>{currentUsage} / {limit} analyses used</Text>
                    </Section>

                    {percentage >= 90 && (
                        <Section style={warningSection}>
                            <Text style={warningText}>
                                You're running low on analyses! Consider upgrading to continue analyzing
                                without interruption.
                            </Text>
                        </Section>
                    )}

                    <Section style={upgradeSection}>
                        <Text style={upgradeSectionTitle}>Need more analyses?</Text>
                        {tier === 'FREE' && (
                            <>
                                <Text style={upgradeOption}>
                                    <strong style={upgradeLabel}>STARTER:</strong> 60 analyses/month - $39/mo
                                </Text>
                                <Text style={upgradeOption}>
                                    <strong style={upgradeLabel}>PRO:</strong> 300 analyses/month - $99/mo
                                </Text>
                                <Text style={upgradeOption}>
                                    <strong style={upgradeLabel}>ENTERPRISE:</strong> Unlimited - $299/mo
                                </Text>
                            </>
                        )}
                        {tier === 'STARTER' && (
                            <>
                                <Text style={upgradeOption}>
                                    <strong style={upgradeLabel}>PRO:</strong> 300 analyses/month - $99/mo
                                </Text>
                                <Text style={upgradeOption}>
                                    <strong style={upgradeLabel}>ENTERPRISE:</strong> Unlimited - $299/mo
                                </Text>
                            </>
                        )}
                        {tier === 'PRO' && (
                            <Text style={upgradeOption}>
                                <strong style={upgradeLabel}>ENTERPRISE:</strong> Unlimited analyses - $299/mo
                            </Text>
                        )}
                    </Section>

                    <Section style={buttonContainer}>
                        <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/pricing`}>
                            View Upgrade Options
                        </Button>
                    </Section>

                    <Text style={footer}>
                        Keep analyzing!<br />
                        The Dravikly Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default UsageLimitWarningEmail;

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

const progressSection = {
    margin: '24px 0',
};

const progressBar = {
    width: '100%',
    height: '24px',
    backgroundColor: '#0f172a',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '8px',
};

const progressFill = {
    height: '100%',
    backgroundColor: '#22d3ee',
    transition: 'width 0.3s ease',
};

const progressText = {
    color: '#94a3b8',
    fontSize: '14px',
    textAlign: 'center' as const,
    margin: '8px 0 0',
};

const warningSection = {
    backgroundColor: '#7f1d1d',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    borderLeft: '4px solid #f59e0b',
};

const warningText = {
    color: '#fecaca',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0',
};

const upgradeSection = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
};

const upgradeSectionTitle = {
    color: '#22d3ee',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 12px',
};

const upgradeOption = {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '28px',
    margin: '8px 0',
};

const upgradeLabel = {
    color: '#22d3ee',
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
