'use client'
import React from 'react'
import { Permanent_Marker } from "next/font/google";
import Link from 'next/link';
import { Button } from '../ui/button';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { BriefcaseBusinessIcon, Heart, PenBox } from 'lucide-react';


  const permanentMarker = Permanent_Marker({
    subsets: ["latin"],
    weight: "400", // You can adjust the weight if needed
  });
const Header = () => {
 
  const {user,isSignedIn} = useUser();

    return (
    <header className=' '>
        <nav  className='py-4 flex justify-between items-center'>
            <Link href='/'><h2 className={`${permanentMarker.className} text-4xl `}>Hirex</h2></Link>

            <div className='flex gap-8'>

            <SignedIn >
              {/* add a confition that only recriuite can see this post a job button */}
              <Link href='/post-job'><Button variant="destructive" className="rounded-full text-center"><PenBox size={20} className="mr-2"/>Post a Job</Button></Link>
        
              <UserButton appearance={{elements:{avatarBox:"h-10 w-10"}}}>
               
                  <UserButton.MenuItems>
                  <UserButton.Link label='My Jobs' labelIcon={<BriefcaseBusinessIcon size={15}/>} href='/my-jobs' />
                  <UserButton.Link label='Saved Jobs' labelIcon={<Heart size={15}/>} href='/saved-jobs' />
                  </UserButton.MenuItems>
                 
                 </UserButton>
            </SignedIn>

            <SignedOut>
              {/* <SignInButton/> */}
              <Link href='/sign-in'><Button variant="outline" >Login</Button></Link>
            </SignedOut>
            </div>

            
        </nav>

        
    </header>
  )
}

export default Header
