import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { TierName } from '../../lib/paddle-config'

interface Subscription {
  tier: TierName
  status: string
  paddle_subscription_id: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('tier, status, paddle_subscription_id, current_period_end, cancel_at_period_end')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching subscription:', error)
        return
      }

      setSubscription(data)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivePlan = () => {
    if (!subscription) return 'free'
    return subscription.tier
  }

  return { subscription, loading, getActivePlan, refetch: fetchSubscription }
}