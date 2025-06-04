import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Utensils, Heart, Sparkles, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        toast.success("Welcome back! Redirecting to your dashboard...");
        navigate('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
        const {
          error
        } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        toast.success("Account created successfully! Please check your email to verify your account.");
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.message === "Invalid login credentials") {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.message === "User already registered") {
        toast.error("This email is already registered. Try logging in instead.");
      } else {
        toast.error(error.message || "An error occurred during authentication");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Utensils className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NutriAI</h1>
          <p className="text-gray-600">Your personal nutrition and companion</p>
        </div>

        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLogin ? 'Sign in to continue your health journey' : 'Join thousands improving their nutrition'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="Enter your email" required className="h-11" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={e => handleInputChange('password', e.target.value)} placeholder="Enter your password" required className="h-11 pr-10" />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-11 w-10 px-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </Button>
                </div>
              </div>

              {!isLogin && <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} placeholder="Confirm your password" required className="h-11" />
                </div>}

              <Button type="submit" className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium" disabled={isLoading}>
                {isLoading ? <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div> : <div className="flex items-center gap-2">
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <Sparkles className="w-4 h-4" />
                  </div>}
              </Button>
            </form>

            <div className="text-center">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-green-600 hover:text-green-700 font-medium">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {/* Features Highlight */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span>Personalized</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-1">
                  <Utensils className="w-3 h-3 text-green-400" />
                  <span>Expert Advice</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>;
};
export default Auth;