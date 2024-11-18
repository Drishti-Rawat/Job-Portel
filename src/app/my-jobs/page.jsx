'use client'
import CreatedApplications from '@/components/shared/Created-applications';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import CreatedJobs from '@/components/shared/CreatedJobs';

const page = () => {
  const {user,isLoaded} = useUser();
  const router = useRouter();
  useEffect(() => {
    if(user && !user.unsafeMetadata.role){
      router.push("/onboarding");
    }
  })

  if(!isLoaded || !user?.unsafeMetadata?.role){
      return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }
  
  return (
    <div>
    <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
      {user?.unsafeMetadata?.role === "candidate"
        ? "My Applications"
        : "My Jobs"}
    </h1>
    {user?.unsafeMetadata?.role === "candidate" ? (
      <CreatedApplications />
    ) : (
      <CreatedJobs />
    )}
  </div>
  )
}

export default page
