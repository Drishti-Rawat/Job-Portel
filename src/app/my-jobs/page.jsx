
'use client'
import CreatedApplications from '@/components/shared/Created-applications';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import CreatedJobs from '@/components/shared/CreatedJobs';

const Myjobspage = () => {
  const {user,isLoaded} = useUser();
  const router = useRouter();

  useEffect(() => {
    if(user && !user.unsafeMetadata.role){
      router.push("/onboarding");
    }
  })

  if(!isLoaded || !user?.unsafeMetadata?.role){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BarLoader color="#8B5CF6" />
      </div>
    )
  }

  return (
    <div className=" relative ">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
          className="absolute top-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-40 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className=" relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-5xl sm:text-7xl font-extrabold text-center mb-12"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            {user?.unsafeMetadata?.role === "candidate"
              ? "My Applications"
              : "My Jobs"}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="py-8"
        >
          {user?.unsafeMetadata?.role === "candidate" ? (
            <CreatedApplications />
          ) : (
            <CreatedJobs />
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Myjobspage