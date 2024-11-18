'use client'

import { getSavedJobs } from "@/actions/jobs.actions";
import JobCard from "@/components/shared/JobCard";
import { useSession, useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { session } = useSession();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(false);

  // Redirect user if not onboarded
  useEffect(() => {
    if (user && !user.unsafeMetadata.role) {
      router.push("/onboarding");
    }
  }, [user, router]);

  // Function to fetch saved jobs
  const fnSavedJobs = async () => {
    setLoadingSavedJobs(true);
    try {
      const supabaseSessionToken = await session.getToken({ template: "supabase" });
      if (!supabaseSessionToken) {
        console.error("No token available");
        return;
      }
      const response = await getSavedJobs(supabaseSessionToken);
      setSavedJobs(response);
    } catch (error) {
      console.error("Error fetching saved jobs", error);
    } finally {
      setLoadingSavedJobs(false);
    }
  };

 

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
  }, [isLoaded,session]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {savedJobs.length ? (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map((saved) => (
            <JobCard
              key={saved.id}
              job={saved?.job}
              onJobSaved={fnSavedJobs}
              savedInit={true}
            />
          ))}
        </div>
      ) : (
        <div>No Saved Jobs 👀</div>
      )}
    </div>
  );
};

export default SavedJobs;
