// Paddle Client-Side Integration
// Paddle.js is loaded via script tag, this provides TypeScript types and helpers

declare global {
    interface Window {
        Paddle?: any;
    }
}

let paddleInitialized = false;

export function initializePaddle(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (paddleInitialized && window.Paddle) {
            resolve();
            return;
        }

        // Check if script already exists
        if (document.querySelector('script[src*="paddle.js"]')) {
            // Wait for Paddle to be available
            const checkPaddle = setInterval(() => {
                if (window.Paddle) {
                    clearInterval(checkPaddle);
                    paddleInitialized = true;
                    resolve();
                }
            }, 100);

            setTimeout(() => {
                clearInterval(checkPaddle);
                reject(new Error('Paddle failed to load'));
            }, 10000);
            return;
        }

        // Load Paddle.js script
        const script = document.createElement('script');
        script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
        script.async = true;

        script.onload = () => {
            if (window.Paddle) {
                // Initialize Paddle with your client token
                const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production'
                    ? 'production'
                    : 'sandbox';

                window.Paddle.Environment.set(environment);
                window.Paddle.Initialize({
                    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',
                    eventCallback: (event: any) => {
                        // Handle Paddle events (optional)
                        console.log('Paddle event:', event);
                    },
                });

                paddleInitialized = true;
                resolve();
            } else {
                reject(new Error('Paddle object not found after script load'));
            }
        };

        script.onerror = () => {
            reject(new Error('Failed to load Paddle script'));
        };

        document.head.appendChild(script);
    });
}

export async function openPaddleCheckout(priceId: string, email?: string): Promise<void> {
    await initializePaddle();

    if (!window.Paddle) {
        throw new Error('Paddle is not initialized');
    }

    const checkoutOptions: any = {
        items: [{ priceId, quantity: 1 }],
    };

    if (email) {
        checkoutOptions.customer = { email };
    }

    window.Paddle.Checkout.open(checkoutOptions);
}

export async function openPaddleUpdatePayment(subscriptionId: string): Promise<void> {
    await initializePaddle();

    if (!window.Paddle) {
        throw new Error('Paddle is not initialized');
    }

    // Open update payment method flow
    window.Paddle.Checkout.open({
        settings: {
            displayMode: 'overlay',
            theme: 'dark',
        },
        transactionId: subscriptionId,
    });
}

export function getPaddle() {
    return window.Paddle;
}
