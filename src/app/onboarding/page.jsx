'use client'
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {BarLoader} from 'react-spinners'

const Onboardingpage = () => {
  const {user,isLoaded} = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  // console.log(user);
  const router = useRouter();

  const handleRoleSelection = async(role) => {
    try {
      setIsUpdating(true);
      await user?.update({
        unsafeMetadata: {
          role: role
        }
      }).then(() => {
        setIsUpdating(false);
        router.push(role === "candidate" ? "job-listing" : "post-job");
      });

    } catch (error) {
      console.error('Error updating role:', error);
    }
  
  }

  useEffect(() => {
    if(user?.unsafeMetadata?.role){
      router.push(user.unsafeMetadata.role === "candidate" ? "job-listing" : "post-job");
    }
  }, [user, router]);

  if(!isLoaded ){
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }

  return (
    <div className='flex flex-col items-center justify-center mt-32'>
      {
        isUpdating && (
          <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
        )
      }
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>
        I am a...
      </h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
        <Button className="h-36 text-2xl" variant="blue" onClick={() => handleRoleSelection("candidate")}>Candidate</Button>
        <Button className="h-36 text-2xl" variant="destructive" onClick={() => handleRoleSelection("recruiter")}>Recruiter</Button>

      </div>
    </div>
  )
}

export default Onboardingpage
