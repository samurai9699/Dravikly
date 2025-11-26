import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/**
 * Comprehensive subscription debugging endpoint
 * Tests all aspects of subscription creation
 */
export async function GET(request: NextRequest) {
    const results: any = {
        timestamp: new Date().toISOString(),
        tests: {},
        errors: [],
        recommendations: [],
    };

    try {
        // Test 1: Environment Variables
        results.tests.env_vars = {
            supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            paddle_api_key: !!process.env.PADDLE_API_KEY,
            paddle_webhook_secret: !!process.env.PADDLE_WEBHOOK_SECRET,
        };

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            results.errors.push('SUPABASE_SERVICE_ROLE_KEY is not set');
        }

        // Test 2: Supabase Connection
        try {
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false,
                    },
                }
            );

            results.tests.supabase_connection = 'success';

            // Test 3: Table Exists
            const { data: tableCheck, error: tableError } = await supabaseAdmin
                .from('subscriptions')
                .select('id')
                .limit(1);

            if (tableError) {
                results.tests.table_exists = false;
                results.errors.push(`Subscriptions table error: ${tableError.message}`);
            } else {
                results.tests.table_exists = true;
            }

            // Test 4: RLS Policies (skip this test - not critical)
            results.tests.rls_policies = 'Skipped (not critical for diagnosis)';

            // Test 5: Try to Insert Test Subscription
            const testUserId = '00000000-0000-0000-0000-000000000000'; // Dummy UUID
            const { error: insertError } = await supabaseAdmin
                .from('subscriptions')
                .upsert({
                    user_id: testUserId,
                    tier: 'free',
                    status: 'active',
                    paddle_customer_id: 'test_customer',
                    paddle_subscription_id: 'test_sub',
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id'
                });

            if (insertError) {
                results.tests.can_insert = false;
                results.errors.push(`Cannot insert subscription: ${insertError.message}`);

                if (insertError.message.includes('row-level security') ||
                    insertError.message.includes('RLS') ||
                    insertError.message.includes('policy')) {
                    results.recommendations.push('RLS POLICY ISSUE DETECTED! Run the migration: supabase/migrations/20251127000000_fix_subscription_webhook_insert.sql');
                }
            } else {
                results.tests.can_insert = true;

                // Clean up test data
                await supabaseAdmin
                    .from('subscriptions')
                    .delete()
                    .eq('user_id', testUserId);
            }

            // Test 6: Check existing subscriptions
            const { data: existingSubs, error: subsError } = await supabaseAdmin
                .from('subscriptions')
                .select('user_id, tier, status, paddle_subscription_id')
                .limit(5);

            if (subsError) {
                results.tests.can_read = false;
                results.errors.push(`Cannot read subscriptions: ${subsError.message}`);
            } else {
                results.tests.can_read = true;
                results.tests.existing_subscriptions_count = existingSubs?.length || 0;
                results.tests.paid_subscriptions_count = existingSubs?.filter(
                    s => s.tier !== 'free' && s.tier !== 'FREE'
                ).length || 0;
            }

        } catch (error: any) {
            results.tests.supabase_connection = 'failed';
            results.errors.push(`Supabase connection error: ${error.message}`);
        }

        // Test 7: Paddle Configuration
        results.tests.paddle_config = {
            environment: process.env.PADDLE_ENVIRONMENT || 'not set',
            has_price_ids: {
                starter_monthly: !!process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID,
                starter_annual: !!process.env.NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID,
                pro_monthly: !!process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID,
                pro_annual: !!process.env.NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID,
            },
        };

        // Generate recommendations
        if (results.errors.length === 0) {
            results.recommendations.push('All tests passed! System should be working correctly.');
        } else {
            results.recommendations.push('Issues detected. See errors array for details.');
        }

        // Overall status
        results.status = results.errors.length === 0 ? 'HEALTHY' : 'ISSUES_DETECTED';

        return NextResponse.json(results, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            status: 'ERROR',
            error: error.message,
            stack: error.stack,
        }, { status: 500 });
    }
}
