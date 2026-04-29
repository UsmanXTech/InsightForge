import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { BarChart3, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (token: string) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          ...("name" in data && { name: data.name })
        })
      });
      const payload = await res.json();

      if (res.ok) {
        onLogin(payload.token);
      } else {
        alert(payload.detail || "Authentication failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-4xl font-bold tracking-tight text-foreground">InsightForge</span>
          </div>
        </div>

        <Card className="border-border shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-serif">{isLogin ? 'Welcome Back' : 'Create an Account'}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {isLogin 
                ? 'Enter your credentials to access the dashboard.' 
                : 'Sign up to start analyzing your data.'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      name="name"
                      placeholder="John Doe" 
                      className="pl-10 bg-background/50 border-border h-10" 
                      required 
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="email"
                    type="email" 
                    placeholder="name@company.com" 
                    className="pl-10 bg-background/50 border-border h-10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground">Password</label>
                  {isLogin && (
                    <a href="#" className="flex-1 text-right text-xs font-semibold text-primary hover:underline">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="password"
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 bg-background/50 border-border h-10" 
                    required 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-10 mt-6 bg-foreground text-background hover:brightness-110 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-foreground hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
