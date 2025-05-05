
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type SubscriptionStatus = {
  active: boolean;
  status: string;
  trialEnd: string | null;
  currentPeriodEnd: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  subscription: SubscriptionStatus | null;
  loadingSubscription: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  openCustomerPortal: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const refreshSubscription = async () => {
    if (!user) return;
    
    setLoadingSubscription(true);
    try {
      console.log("Refreshing subscription data for user:", user.id);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: { userId: user.id }
      });
      
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      
      console.log("Subscription data received:", data);
      setSubscription(data);
      
      // If subscription is active or in trial, we can redirect to dashboard
      if (data?.active || data?.status === 'trialing') {
        console.log("Active subscription detected during refresh");
      }
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { 
          userId: user.id,
          returnUrl: window.location.origin + '/dashboard'
        }
      });
      
      if (error) {
        throw new Error(`Error creating portal session: ${error.message}`);
      }
      
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Unable to open subscription management. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(`Auth event: ${event}`);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN') {
          toast({
            title: "Success!",
            description: "You've successfully signed in.",
          });
          // Don't navigate here - we'll do that after checking subscription status
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You've been successfully signed out.",
          });
          setSubscription(null);
          navigate('/');
        }
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Checking existing session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast, navigate]);

  // Check subscription when user changes
  useEffect(() => {
    if (user) {
      console.log("User detected, checking subscription");
      refreshSubscription();
    }
  }, [user]);

  const sendWelcomeEmail = async (email: string, fullName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: { email, fullName }
      });
      
      if (error) {
        console.error('Error invoking welcome email function:', error);
        toast({
          title: "Welcome email could not be sent",
          description: "Your account was created, but we couldn't send you a welcome email.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Welcome email sent successfully:', data);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't block the signup process if email fails
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      }
    });
    
    if (!error) {
      await sendWelcomeEmail(email, fullName);
      navigate('/welcome');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error) {
      // Check subscription status before navigating
      try {
        console.log("Checking subscription after sign in");
        const { data } = await supabase.functions.invoke('check-subscription', {
          body: { userId: user?.id }
        });
        
        setSubscription(data);
        
        if (data && (data.active || data.status === 'trialing')) {
          console.log("Active subscription found, navigating to dashboard");
          navigate('/dashboard');
        } else {
          console.log("No active subscription, navigating to welcome");
          navigate('/welcome');
        }
      } catch (error) {
        console.error('Failed to check subscription status:', error);
        navigate('/welcome');
      }
    }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      subscription, 
      loadingSubscription, 
      signUp, 
      signIn, 
      signOut, 
      refreshSubscription, 
      openCustomerPortal 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
