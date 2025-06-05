
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

interface UsageData {
  recommendations_used: number;
  last_reset_date: string;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
  });
  const [usageData, setUsageData] = useState<UsageData>({
    recommendations_used: 0,
    last_reset_date: new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkSubscription = async () => {
    if (!session?.access_token) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      console.log('Subscription check result:', data);
      setSubscriptionData({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier,
        subscription_end: data.subscription_end,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsage = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_usage')
        .select('recommendations_used, last_reset_date')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const today = new Date().toISOString().split('T')[0];
      
      if (data) {
        if (data.last_reset_date !== today) {
          // Reset usage for new day
          console.log('Resetting usage for new day');
          const { data: resetData, error: resetError } = await supabase
            .from('user_usage')
            .upsert({
              user_id: user.id,
              recommendations_used: 0,
              last_reset_date: today,
            })
            .select()
            .single();
          
          if (resetError) throw resetError;
          setUsageData({ recommendations_used: 0, last_reset_date: today });
        } else {
          setUsageData(data);
        }
      } else {
        // Create initial usage record
        console.log('Creating initial usage record');
        const { data: newData, error: insertError } = await supabase
          .from('user_usage')
          .insert({
            user_id: user.id,
            recommendations_used: 0,
            last_reset_date: today,
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        setUsageData({ recommendations_used: 0, last_reset_date: today });
      }
    } catch (error) {
      console.error('Error loading usage:', error);
    }
  };

  const incrementUsage = async () => {
    if (!user) return false;

    try {
      console.log('Incrementing usage from:', usageData.recommendations_used);
      const newUsage = usageData.recommendations_used + 1;
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('user_usage')
        .update({
          recommendations_used: newUsage,
          last_reset_date: today,
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      console.log('Usage incremented to:', data.recommendations_used);
      setUsageData({
        recommendations_used: data.recommendations_used,
        last_reset_date: data.last_reset_date,
      });
      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  };

  const createCheckout = async () => {
    if (!session?.access_token) {
      toast.error('Please log in to upgrade');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!session?.access_token) {
      toast.error('Please log in to manage subscription');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open customer portal');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && session) {
      checkSubscription();
      loadUsage();
    }
  }, [user, session]);

  const canUseFeature = () => {
    console.log('Checking feature access:', {
      subscribed: subscriptionData.subscribed,
      usageCount: usageData.recommendations_used,
      canUse: subscriptionData.subscribed || usageData.recommendations_used < 1
    });
    
    // Premium users can always use features
    if (subscriptionData.subscribed) {
      return true;
    }
    
    // Free users can use 1 recommendation per day
    return usageData.recommendations_used < 1;
  };

  const remainingRecommendations = Math.max(0, 1 - usageData.recommendations_used);

  console.log('Current subscription state:', {
    subscribed: subscriptionData.subscribed,
    usageData,
    remainingRecommendations,
    canUseFeature: canUseFeature()
  });

  return {
    ...subscriptionData,
    usageData,
    isLoading,
    canUseFeature,
    remainingRecommendations,
    checkSubscription,
    incrementUsage,
    createCheckout,
    openCustomerPortal,
  };
};
