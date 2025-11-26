// Paddle Server-Side SDK
import { Paddle, Environment } from '@paddle/paddle-node-sdk';

let paddleInstance: Paddle | null = null;

export function getPaddle(): Paddle {
    if (!paddleInstance) {
        if (!process.env.PADDLE_API_KEY) {
            throw new Error('PADDLE_API_KEY is not set in environment variables');
        }

        // Use sandbox for testing, production for live
        const environment = process.env.PADDLE_ENVIRONMENT === 'production'
            ? Environment.production
            : Environment.sandbox;

        paddleInstance = new Paddle(process.env.PADDLE_API_KEY, {
            environment,
        });
    }

    return paddleInstance;
}

// For backward compatibility
export const paddle = new Proxy({} as Paddle, {
    get(target, prop) {
        return getPaddle()[prop as keyof Paddle];
    }
});

export { Environment };
