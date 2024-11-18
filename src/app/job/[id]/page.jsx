

"use client";

import { getsinglejob, updateHiringstatus } from "@/actions/jobs.actions";
import { useSession, useUser } from "@clerk/nextjs";
import MDEditor from "@uiw/react-md-editor";
import { BriefcaseIcon, DoorClosed, DoorOpen, MapPinIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplyJobDrawer from "@/components/shared/Apply_jobs";
import JobApplicationCard from "@/components/shared/JobApplicationCard";

const JobPage = ({ params }) => {
  const { id } = params;
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { session } = useSession();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user && !user.unsafeMetadata.role) {
      router.push("/onboarding");
    }
  }, [user, router]);

  const fetchJobDetails = async () => {
    if (!session || !isLoaded) return;

    try {
      const supabasesessiontoken = await session.getToken({
        template: "supabase",
      });

      if (!supabasesessiontoken) {
        console.log("No token available");
        return;
      }

      const jobData = await getsinglejob(supabasesessiontoken, { job_id: id });
      setJob(jobData);
      setIsOpen(jobData.isOpen);
    } catch (error) {
      console.error("Error loading job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id, session, isLoaded]);

  const handleStatusChange = async (value) => {
    if (!session) return;

    setIsLoading(true);
    try {
      const supabasesessiontoken = await session.getToken({
        template: "supabase",
      });

      if (!supabasesessiontoken) {
        console.log("No token available");
        return;
      }

      await updateHiringstatus(supabasesessiontoken, { job_id: id }, value);
      setIsOpen(value);
      await fetchJobDetails();
    } catch (error) {
      console.error("Error updating hiring status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (!isLoaded || !user?.unsafeMetadata?.role || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BarLoader color="#8B5CF6" />
      </div>
    );
  }

  // Error state
  if (!job) {
    return <div>Failed to load job details</div>;
  }

  // Render job details
  return (
    <div className=" relative py-10 px-4">
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

        <motion.div 
          className="backdrop-blur-sm bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50 space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
            <h1 className="font-extrabold pb-3 text-5xl sm:text-7xl">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                {job.title}
              </span>
            </h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={job.company.logo_url}
                alt={job.company.name}
                width={200}
                height={200}
                className="rounded-xl shadow-lg"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <MapPinIcon />, text: job.location },
              { icon: <BriefcaseIcon />, text: `${job?.applications?.length} Applicants` },
              { 
                icon: isOpen ? <DoorOpen /> : <DoorClosed />, 
                text: isOpen ? "Open" : "Closed" 
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 bg-gray-900/50 p-4 rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.icon}
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>

          {job?.recruiter === user?.id && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger 
                  className={`w-full h-12 ${isOpen 
                    ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                    : "bg-gradient-to-r from-red-500 to-rose-600"} 
                    text-white rounded-xl`}
                >
                  <SelectValue
                    placeholder={`Hiring Status ${isOpen ? "( Open )" : "( Closed )"}`}
                  />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value={true} className="text-gray-200 focus:bg-green-500/20">Open</SelectItem>
                  <SelectItem value={false} className="text-gray-200 focus:bg-red-500/20">Closed</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          <div>
            <h2 className="text-2xl font-bold sm:text-3xl mb-4">About the Job</h2>
            <p className="sm:text-lg bg-gray-900/50 p-4 rounded-xl">{job.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold sm:text-3xl mb-4">What we are looking for</h2>
            <div className="bg-gray-900/50 p-4 rounded-xl">
              <MDEditor.Markdown
                source={job.requirements}
                className="bg-transparent sm:text-lg"
              />
            </div>
          </div>

          {job?.recruiter !== user?.id && (
            <ApplyJobDrawer 
              job={job} 
              user={user} 
              fetchJobDetails={fetchJobDetails} 
              applied={job?.applications?.find((application) => application.candidate_id === user.id)} 
              session={session}
            />
          )}

          {(job?.recruiter === user?.id )  && (
            
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl mb-4">Applications</h2>
              <div className="space-y-4">
                {job?.applications?.length >= 0 ? job?.applications?.map((application) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <JobApplicationCard 
                      application={application} 
                      session={session} 
                    />
                  </motion.div>
                )
              ): (
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <p>No applications yet.</p>
                </div>
              )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JobPage;
