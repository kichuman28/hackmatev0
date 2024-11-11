'use client'

import { motion } from 'framer-motion'
import { Button } from "./components/ui/button"
import Navbar from './components/Navbar'
import Link from 'next/link'

// Define the steps array
const steps = [
  {
    title: "Sign Up",
    description: "Create your account using your college email and verify your student status.",
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    title: "Build Your Profile",
    description: "Showcase your skills, experience, and the type of projects you want to work on.",
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: "Find Teammates",
    description: "Connect with other students who match your interests and start building together.",
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
];

// Define the features array
const features = [
  {
    title: "Skill Matching",
    description: "Find teammates with complementary skills for your project.",
    icon: (
      <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Real-Time Chat",
    description: "Communicate instantly with potential teammates.",
    icon: (
      <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    title: "College Verified",
    description: "Connect with students from your college or others.",
    icon: (
      <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: "Project Tracking",
    description: "Keep track of your hackathon projects and team history.",
    icon: (
      <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  }
];

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="gradient-dark-bg" />
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center py-10 sm:py-20">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 gradient-text leading-tight mt-10 sm:mt-20 tracking-tight">
                Find Your Perfect Hackathon Teammates
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium">
                Connect with talented developers from your college and build award-winning projects together.
              </p>
              <div className="flex flex-col gap-4 justify-center items-center">
                <Link href="/login">
                  <Button className="primary-button text-base sm:text-lg">
                    Get Started
                  </Button>
                </Link>
                <div className="flex items-center gap-1">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="text-[#BC6FF1] hover:text-[#892CDC]">Sign in</Link>
                  </p>
                </div>
              </div>
            </motion.div>
            
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

            {/* Stats Section */}
            <motion.div 
              className="mt-10 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="feature-card">
                <h3 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">500+</h3>
                <p className="text-sm sm:text-base text-gray-400">Active Students</p>
              </div>
              <div className="feature-card">
                <h3 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">50+</h3>
                <p className="text-sm sm:text-base text-gray-400">Colleges</p>
              </div>
              <div className="feature-card">
                <h3 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">100+</h3>
                <p className="text-sm sm:text-base text-gray-400">Projects Built</p>
              </div>
            </motion.div>
          </section>

          {/* How It Works Section */}
          <section className="py-10 sm:py-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-16 gradient-text">
              How It Works
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#52057B] flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                    {step.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-center mb-3 sm:mb-4 text-white/90 bg-gradient-to-r from-[#BC6FF1] to-[#892CDC] bg-clip-text">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 text-center">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="py-10 sm:py-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-16 gradient-text">
              Why Choose Hackmate?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="feature-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-[#BC6FF1] mb-3 sm:mb-4">{feature.icon}</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white/90 bg-gradient-to-r from-[#BC6FF1] to-[#892CDC] bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-10 sm:py-20">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 gradient-text">
                Ready to Find Your Dream Team?
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8">
                Join hundreds of students building amazing projects together
              </p>
              <Link href="/login">
                <Button className="primary-button text-base sm:text-lg">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
