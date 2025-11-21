import { createClient } from '@/lib/supabase/client';

export type EventType =
  | 'analysis_started'
  | 'analysis_completed'
  | 'upgrade_clicked'
  | 'pdf_downloaded';

export interface EventMetadata {
  url?: string;
  duration?: number;
  from_tier?: string;
  to_tier?: string;
  analysis_id?: string;
  [key: string]: string | number | boolean | undefined;
}

export async function trackEvent(
  eventType: EventType,
  metadata: EventMetadata = {},
  userId?: string
): Promise<void> {
  try {
    const supabase = createClient();

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

export async function getRecentEvents(
  limit: number = 10,
  eventType?: EventType
): Promise<any[]> {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    let query = supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch events:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEventStats(
  userId: string
): Promise<Record<EventType, number>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('events')
      .select('event_type')
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to fetch event stats:', error);
      return {
        analysis_started: 0,
        analysis_completed: 0,
        upgrade_clicked: 0,
        pdf_downloaded: 0,
      };
    }

    const stats: Record<string, number> = {};
    data.forEach((event) => {
      stats[event.event_type] = (stats[event.event_type] || 0) + 1;
    });

    return {
      analysis_started: stats.analysis_started || 0,
      analysis_completed: stats.analysis_completed || 0,
      upgrade_clicked: stats.upgrade_clicked || 0,
      pdf_downloaded: stats.pdf_downloaded || 0,
    };
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return {
      analysis_started: 0,
      analysis_completed: 0,
      upgrade_clicked: 0,
      pdf_downloaded: 0,
    };
  }
}
