'use client'
import { getMyJobs } from "@/actions/jobs.actions";
import { useSession, useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/shared/JobCard";
import { useEffect, useState } from "react";

const CreatedJobs = () => {
  const { user } = useUser();
  const [createdJobs, setCreatedJobs] = useState([]);
  const [loadingCreatedJobs, setLoadingCreatedJobs] = useState(false);
  const {session} = useSession();

//   const {
//     loading: loadingCreatedJobs,
//     data: createdJobs,
//     fn: fnCreatedJobs,
//   } = useFetch(getMyJobs, {
//     recruiter_id: user.id,
//   });

const fnCreatedJobs = async () => {
    setLoadingCreatedJobs(true);
    try {
        const supabaseSessionToken = await session.getToken({ template: "supabase" });
        if (!supabaseSessionToken) {
            console.error("No token available");
            return;
        }
        const response = await getMyJobs(supabaseSessionToken, { recruiter_id: user.id });
        setCreatedJobs(response);
    } catch (error) {
        console.error("Error fetching created jobs", error);
    } finally {
        setLoadingCreatedJobs(false);
    }
}

  useEffect(() => {
    fnCreatedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {loadingCreatedJobs ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            createdJobs.map((job) => 
              
                <JobCard
                  key={job.id}
                  job={job}
                  onJobSaved={fnCreatedJobs}
                  isMyjob
                />
             
            )
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;