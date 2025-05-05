
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WelcomePage: React.FC = () => {
  const { user, refreshSubscription, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const canceled = searchParams.get('canceled') === 'true';
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // If no user, redirect to auth
    if (!user) {
      navigate('/auth');
      return;
    }

    // If there's a session_id in the URL, it means the user has completed checkout
    if (sessionId) {
      // Refresh subscription status and navigate to dashboard
      handleSuccessfulCheckout();
      return;
    }

    // Check if user already has an active subscription
    const checkSubscription = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          body: { userId: user.id }
        });

        if (error) {
          console.error('Error checking subscription:', error);
          return;
        }

        if (data.active) {
          // User already has an active subscription or trial, redirect to dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Failed to check subscription status:', error);
      }
    };

    checkSubscription();
  }, [user, navigate, sessionId]);

  const handleSuccessfulCheckout = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Refresh subscription status
      await refreshSubscription();
      
      toast({
        title: "Subscription activated!",
        description: "Your trial has started. Welcome to LeadHustle Pro!",
        variant: "default"
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Error processing successful checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  const startSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          userId: user.id,
          returnUrl: window.location.origin
        }
      });

      if (error) {
        throw new Error(`Error creating checkout session: ${error.message}`);
      }
      
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error starting subscription:', error);
      toast({
        title: "Subscription Error",
        description: "There was a problem starting your subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col p-4">
      <div className="w-full flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <UserCircle className="h-8 w-8" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">My Account</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleSignOut}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to LeadHustle.pro!</CardTitle>
            <CardDescription className="text-center">
              Start your 7-day free trial today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">LeadHustle Pro Plan</h3>
                <p className="text-3xl font-bold">$49<span className="text-base font-normal">/month</span></p>
                <p className="text-gray-500 text-sm mt-1">First 7 days free</p>
              </div>

              {canceled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
                  Your subscription setup was canceled. You can try again whenever you're ready.
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="mr-2 bg-green-100 rounded-full p-1">
                    <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Unlimited leads management</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 bg-green-100 rounded-full p-1">
                    <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Automated follow-ups</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 bg-green-100 rounded-full p-1">
                    <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Performance analytics</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 bg-green-100 rounded-full p-1">
                    <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Premium support</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-leadhustle-blue hover:bg-leadhustle-darkBlue" 
              onClick={startSubscription}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                'Start Your Free Trial'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <p className="mt-6 text-sm text-gray-500">
          By starting your trial, you agree to our Terms of Service and Privacy Policy.
          You won't be charged until your trial ends.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
