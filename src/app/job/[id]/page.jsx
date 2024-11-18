
"use client";

import { getsinglejob, updateHiringstatus } from "@/actions/jobs.actions";
import { useSession, useUser } from "@clerk/nextjs";
import MDEditor from "@uiw/react-md-editor";
import { BriefcaseIcon, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
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

  // All useEffect hooks must be at the top level, before any conditional returns
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
      // console.log("Fetched job data:", jobData);
      setJob(jobData);
      setIsOpen(jobData.isOpen); // Set initial isOpen state from job data
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
      // Refetch job details to get updated data
      await fetchJobDetails();
    } catch (error) {
      console.error("Error updating hiring status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (!isLoaded || !user?.unsafeMetadata?.role || isLoading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  // Error state
  if (!job) {
    return <div>Failed to load job details</div>;
  }

  // Render job details
  return (
    <section className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="font-extrabold pb-3 text-4xl sm:text-6xl gradient-title">
          {job.title}
        </h1>
        <Image
          src={job.company.logo_url}
          alt={job.company.name}
          width={200}
          height={200}
        />
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <MapPinIcon />
          {job.location}
        </div>

        <div className="flex items-center gap-2">
          <BriefcaseIcon /> {job?.applications?.length} Applicants
        </div>

        <div className="flex items-center gap-2">
          {isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      {/* hiring status toggle */}
      {job?.recruiter === user?.id && (
        <Select  onValueChange={handleStatusChange}>
          <SelectTrigger className={`w-full ${isOpen ? "bg-green-500/50" : "bg-red-500/50"}`}>
          <SelectValue
              placeholder={
                "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
              }
            />
          </SelectTrigger>
          <SelectContent>
            
              <SelectItem value={true}>Open</SelectItem>
              <SelectItem value={false}>Closed</SelectItem>
            
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl font-bold sm:text-3xl">About the Job</h2>
      <p className="sm:text-lg">{job.description}</p>
      <h2 className="text-2xl font-bold sm:text-3xl">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={job.requirements}
        className="bg-transparent sm:text-lg"
      />

      {/* render application */}
      {
        job?.recruiter !== user?.id && (
          <ApplyJobDrawer job={job} user={user} fetchJobDetails={fetchJobDetails} applied ={job?.applications?.find((application) => application.candidate_id === user.id)} session={session}/>
        )
      }

      {/* show appliants */}
      {
        job?.recruiter === user?.id && (
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Applications</h2>
            {
              job?.applications?.map((application) => (
                <JobApplicationCard key={application.id} application={application} session={session} />
              ))
            }
          </div>
        )
      }
    </section>
  );
};

export default JobPage;
