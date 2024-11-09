'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useAuth } from '@/app/hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div className="gradient-dark-bg" />
      
      {/* Abstract Gradient Shapes */}
      <motion.div 
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-[#52057B] rounded-full mix-blend-multiply filter blur-[64px] sm:blur-[128px] opacity-50" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-[#892CDC] rounded-full mix-blend-multiply filter blur-[64px] sm:blur-[128px] opacity-50" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 sm:w-96 sm:h-96 bg-[#BC6FF1] rounded-full mix-blend-multiply filter blur-[64px] sm:blur-[128px] opacity-50" />
      </motion.div>

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md border border-purple-500/20 bg-black/30 backdrop-blur-lg">
            <CardHeader className="space-y-3 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto"
              >
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold gradient-text">
                Welcome to HackMate
              </CardTitle>
              <CardDescription className="text-gray-400">
                Sign in to connect with fellow hackers and build amazing projects together
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base border-purple-500/20 bg-black/30 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                  onClick={signInWithGoogle}
                >
                  <FcGoogle className="mr-2 h-5 w-5" />
                  <span className="text-white">Continue with Google</span>
                </Button>
              </motion.div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-purple-500/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-gray-400">
                    Secure Authentication
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-center">
              <p className="text-sm text-gray-400 px-6">
                By continuing, you agree to our{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline-offset-4 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline-offset-4 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default LoginPage;
