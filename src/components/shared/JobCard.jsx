
'use client'

import { useSession, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Heart, MapPin, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { saveJob ,deleteJob} from '@/actions/jobs.actions';
import { BarLoader } from 'react-spinners';


const JobCard = ({ job, isMyjob = false, savedInit = false, onJobSaved = () => {} }) => {
  const { user } = useUser();
  const { session } = useSession();
  const [isLoadingSavedJob, setIsLoadingSavedJob] = useState(false);
  const [isSaved, setIsSaved] = useState(savedInit);
  const [isLoadingDeleteJob, setIsLoadingDeleteJob] = useState(false);
  

  const handleSaveJob = async () => {
    if (!user || isLoadingSavedJob) return;

  
    setIsLoadingSavedJob(true);
    try {
      const supabaseSessionToken = await session.getToken({
        template: "supabase",
      });
  
      const saveData = {
        job_id: job.id,
        user_id: user.id
      };
  
      const response = await saveJob(
        supabaseSessionToken,
        { alreadySaved: isSaved },
        saveData
      );
      // Modified condition: accept both array (for save) and null (for unsave) as successful responses
      if (response !== undefined) {  // Change from response !== null
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);
        onJobSaved();
      }
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
    } finally {
      setIsLoadingSavedJob(false);
    }
  };

  const handledeleteJob = async () => {

    setIsLoadingDeleteJob(true);
    try {
    const supabaseSessionToken = await session.getToken({
      template: "supabase",
    });

    if (!supabaseSessionToken) {
      console.error("Supabase session token not found.");
      return;
    }

    const response = await deleteJob(supabaseSessionToken, { job_id: job.id });
    if(response){
      onJobSaved();
    }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
    finally {
      setIsLoadingDeleteJob(false);
    }

  }


  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 flex flex-col">
      {
        isLoadingDeleteJob && (
          <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
        )
      }
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="font-semibold text-xl text-primary">
              {job.title}
            </CardTitle>
            {job.company && (
              <div className="flex items-center gap-2">
                {job.company.logo_url && (
                  <div className="relative w-20 h-12">
                    <Image
                      src={job.company.logo_url}
                      alt={job.company.name}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          {isMyjob && (
            <>
         
            <Trash2Icon 
              className="w-5 h-5 text-destructive hover:text-destructive/80 cursor-pointer transition-colors" 
              onClick={handledeleteJob}
            />
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          
          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {job.description.substring(0, job.description.indexOf(".") + 1)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 gap-3">
        <Link href={`/job/${job.id}`} className="flex-1">
          <Button 
            variant="secondary" 
            className="w-full hover:shadow-md transition-shadow"
          >
            View Details
          </Button>
        </Link>
        
        {!isMyjob && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleSaveJob}
            disabled={isLoadingSavedJob}
            className={`hover:shadow-sm transition-all ${
              isSaved ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
            }`}
          >
            <Heart
              fill={isSaved ? 'red' : 'none'}
              className="w-5 h-5"
              strokeWidth={2}
            />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;

