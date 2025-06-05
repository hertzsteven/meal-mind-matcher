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
  // Start with undefined state to indicate we haven't loaded yet
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [usageData, setUsageData] = useState<UsageData>({
    recommendations_used: 0,
    last_reset_date: new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  // Check local database first for existing subscription data
  const checkLocalSubscription = async () => {
    if (!user?.email) return null;

    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_tier, subscription_end')
        .eq('email', user.email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking local subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in checkLocalSubscription:', error);
      return null;
    }
  };

  const checkSubscription = async () => {
    if (!session?.access_token) {
      setIsLoading(false);
      return;
    }

    try {
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
      // Set default free state on error
      setSubscriptionData({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
      });
    }
  };

  const loadUsage = async () => {
    if (!user) {
      return;
    }

    try {
      console.log('📊 Loading usage for user:', user.id);
      const { data, error } = await supabase
        .from('user_usage')
        .select('recommendations_used, last_reset_date')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading usage:', error);
        throw error;
      }

      const today = new Date().toISOString().split('T')[0];
      console.log('📅 Today is:', today);
      
      if (data) {
        console.log('📊 Found existing usage data:', data);
        if (data.last_reset_date !== today) {
          // Reset usage for new day
          console.log('🔄 Resetting usage for new day');
          const { data: resetData, error: resetError } = await supabase
            .from('user_usage')
            .update({
              recommendations_used: 0,
              last_reset_date: today,
            })
            .eq('user_id', user.id)
            .select()
            .single();
          
          if (resetError) {
            console.error('❌ Error resetting usage:', resetError);
            throw resetError;
          }
          console.log('✅ Usage reset successfully:', resetData);
          setUsageData({ recommendations_used: 0, last_reset_date: today });
        } else {
          console.log('📊 Using existing usage data for today');
          setUsageData(data);
        }
      } else {
        // Create initial usage record
        console.log('🆕 Creating initial usage record');
        const { data: newData, error: insertError } = await supabase
          .from('user_usage')
          .insert({
            user_id: user.id,
            recommendations_used: 0,
            last_reset_date: today,
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('❌ Error creating usage record:', insertError);
          throw insertError;
        }
        console.log('✅ Initial usage record created:', newData);
        setUsageData({ recommendations_used: 0, last_reset_date: today });
      }
    } catch (error) {
      console.error('💥 Error in loadUsage:', error);
    }
  };

  const loadAllData = async () => {
    if (!user || !session || hasFetchedData) return;
    
    setIsLoading(true);
    console.log('🔄 Loading all subscription and usage data...');
    
    try {
      // First check local database for existing subscription data
      const localSubscription = await checkLocalSubscription();
      
      if (localSubscription) {
        console.log('📊 Found local subscription data:', localSubscription);
        setSubscriptionData(localSubscription);
      }
      
      // Load both subscription and usage data in parallel
      await Promise.all([
        checkSubscription(),
        loadUsage()
      ]);
      
      setHasFetchedData(true);
      console.log('✅ All data loaded successfully');
    } catch (error) {
      console.error('💥 Error loading data:', error);
      // Set default free state on error
      if (!subscriptionData) {
        setSubscriptionData({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const incrementUsage = async () => {
    if (!user) {
      console.error('❌ No user found for incrementUsage');
      return false;
    }

    try {
      console.log('📈 Incrementing usage from:', usageData.recommendations_used);
      console.log('👤 For user:', user.id);
      
      const newUsage = usageData.recommendations_used + 1;
      const today = new Date().toISOString().split('T')[0];
      
      console.log('📊 New usage will be:', newUsage);
      console.log('📅 Date:', today);
      
      const { data, error } = await supabase
        .from('user_usage')
        .update({
          recommendations_used: newUsage,
          last_reset_date: today,
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('💥 Error incrementing usage:', error);
        throw error;
      }

      console.log('✅ Usage incremented successfully:', data);
      
      // IMMEDIATELY update the local state to reflect the change
      const updatedUsageData = {
        recommendations_used: data.recommendations_used,
        last_reset_date: data.last_reset_date,
      };
      setUsageData(updatedUsageData);
      
      console.log('🔄 Local state updated immediately:', updatedUsageData);
      
      return true;
    } catch (error) {
      console.error('💥 Error in incrementUsage:', error);
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

  // Single useEffect to handle user/session changes and data loading
  useEffect(() => {
    if (user && session && !hasFetchedData) {
      loadAllData();
    } else if (!user || !session) {
      // Reset states when no user/session
      setIsLoading(false);
      setHasFetchedData(false);
      setSubscriptionData(null);
      setUsageData({
        recommendations_used: 0,
        last_reset_date: new Date().toISOString().split('T')[0],
      });
    }
  }, [user, session, hasFetchedData]);

  const canUseFeature = () => {
    const result = subscriptionData?.subscribed || usageData.recommendations_used < 1;
    console.log('🔍 canUseFeature check:', {
      subscribed: subscriptionData?.subscribed,
      usageCount: usageData.recommendations_used,
      canUse: result
    });
    return result;
  };

  const remainingRecommendations = Math.max(0, 1 - usageData.recommendations_used);

  console.log('📊 Current subscription state:', {
    subscribed: subscriptionData?.subscribed,
    usageData,
    remainingRecommendations,
    canUseFeature: canUseFeature(),
    isLoading,
    hasFetchedData
  });

  return {
    ...(subscriptionData || { subscribed: false, subscription_tier: null, subscription_end: null }),
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
