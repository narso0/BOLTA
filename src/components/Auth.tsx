import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Footprints, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/Logo';

import { auth, googleProvider, facebookProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AuthProps {
  onAuth: (user: { name: string; email: string }) => void;
}

const Auth = ({ onAuth }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo authentication - in real app would connect to Supabase
    const user = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
    };
    onAuth(user);
  };

  const handleSocialAuth = async (providerName: 'google' | 'facebook') => {
  const provider = providerName === 'google' ? googleProvider : facebookProvider;
  try {
    const result = await signInWithPopup(auth, provider);
    onAuth({
      name: result.user.displayName ?? 'User',
      email: result.user.email ?? '',
    });
  } catch (err) {
    console.error(err);
    alert('Login failed – please try again.');
  }
};

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto">
            <Logo className="h-16 w-16 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">ბოლთა</h1>
            <p className="text-muted-foreground">იარე. მოიპოვე. გადაცვალე.</p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="border-0 shadow-soft">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">
              {isLogin ? 'Welcome Back' : 'Start Your Journey'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Sign in to continue' 
                : 'Create your account and start walking'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input border-border text-foreground"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-input border-border text-foreground"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-input border-border text-foreground"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-primary-foreground">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                type="button"
                variant="outline" 
                className="w-full bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                onClick={() => handleSocialAuth('google')}
              >
                <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="48px"
                height="48px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                Continue with Google
              </Button>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;