import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { EventType, EventMetadata } from './track-event';

export async function trackEventServer(
  eventType: EventType,
  metadata: EventMetadata = {},
  userId?: string
): Promise<void> {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    let finalUserId = userId;

    if (!finalUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('Cannot track event: user not authenticated');
        return;
      }
      finalUserId = user.id;
    }

    const { error } = await supabase
      .from('events')
      .insert({
        user_id: finalUserId,
        event_type: eventType,
        metadata,
      });

    if (error) {
      console.error('Failed to track event:', error);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}
