


'use client'

import { useSession, useUser } from '@clerk/nextjs';
import React, {  useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Heart, MapPin, Trash2Icon, Building2, Clock } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { saveJob, deleteJob } from '@/actions/jobs.actions';
import { BarLoader } from 'react-spinners';
import { getTimeAgo } from '../../../utility/timeutils';
import { motion } from 'framer-motion';

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
      if (response !== undefined) {
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
      if(response) {
        onJobSaved();
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setIsLoadingDeleteJob(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="group hover:shadow-xl transition-all duration-300 ease-in-out 
        bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm 
        border-indigo-100 dark:border-indigo-900/50 
        hover:border-indigo-200 dark:hover:border-indigo-800/70
        rounded-xl overflow-hidden"
      >
        {isLoadingDeleteJob && (
          <div className="absolute top-0 left-0 right-0">
            <BarLoader width={"100%"} color='#6366F1' />
          </div>
        )}
        
        <CardHeader className="pb-4 relative ">
          <div className="flex items-start justify-between">
            <div className="space-y-2.5">
              <CardTitle className="font-bold text-xl text-indigo-700 dark:text-indigo-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200">
                {job.title}
              </CardTitle>
              {job.company && (
                <div className="flex items-center gap-3">
                  {job.company.logo_url ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-indigo-100 dark:border-indigo-900 shadow-sm">
                      <Image
                        src={job.company.logo_url}
                        alt={job.company.name}
                        fill
                        className="object-contain p-2 transform group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-indigo-400" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="font-medium text-sm text-indigo-800 dark:text-indigo-200">
                      {job.company.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-indigo-500 dark:text-indigo-400 mt-4">
                      <time dateTime={job.created_at} className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getTimeAgo(job.created_at)}
                      </time>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {isMyjob && (
              <Button
                variant="ghost"
                size="icon"
                className="text-indigo-400 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950 transition-colors duration-200"
                onClick={handledeleteJob}
              >
                <Trash2Icon className="w-5 h-5" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 bg-white/50 dark:bg-gray-900/50">
          <div className="space-y-4">
            <div className="mt-2 pt-4 border-t border-indigo-100 dark:border-indigo-900">
              <p className="text-sm text-indigo-700 dark:text-indigo-300 line-clamp-3 leading-relaxed">
                {job.description.substring(0, job.description.indexOf(".") + 1)}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 gap-3 bg-indigo-50/50 dark:bg-indigo-950/50">
          <Link href={`/job/${job.id}`} className="flex-1">
            <Button 
              variant="blue"
              className="w-full shadow-sm hover:shadow-md transition-all duration-200 
               
                text-white"
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
              className={`hover:scale-105 active:scale-95 transition-all duration-200 
                border-indigo-200 dark:border-indigo-800 
                ${isSaved 
                  ? 'text-pink-500 hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950' 
                  : 'text-indigo-500 hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950'
                }`}
            >
              <Heart
                fill={isSaved ? 'currentColor' : 'none'}
                className={`w-5 h-5 transform transition-transform duration-200 ${
                  isSaved ? 'scale-110' : 'scale-100'
                }`}
                strokeWidth={2}
              />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JobCard;
