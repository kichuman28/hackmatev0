'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { useAuth } from '@/app/hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';
import "@/app/globals.css";
import Navbar from "@/app/components/Navbar";

const LoginPage = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 pt-20">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={signInWithGoogle}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our Terms and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
