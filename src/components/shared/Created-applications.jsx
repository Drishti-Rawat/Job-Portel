'use client'
import { useSession, useUser } from "@clerk/clerk-react";
import ApplicationCard from "@/components/shared/JobApplicationCard";
import { useEffect, useState } from "react";
import { getApplications } from "@/actions/application.actions";
import { BarLoader } from "react-spinners";

const CreatedApplications = () => {
  const { user } = useUser();
  const {session} = useSession();

  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

//   const {
//     loading: loadingApplications,
//     data: applications,
//     fn: fnApplications,
//   } = useFetch(getApplications, {
//     user_id: user.id,
//   });

const fnApplications = async () => {
    setLoadingApplications(true);
    try {
        const supabaseSessionToken = await session.getToken({ template: "supabase" });
        if (!supabaseSessionToken) {
            console.error("No token available");
            return;
        }
        const response = await getApplications(supabaseSessionToken, { user_id: user.id });
        setApplications(response);
    } catch (error) {
        console.error("Error fetching created applications", error);
    } finally {
        setLoadingApplications(false);
    }
}

  useEffect(() => {
    fnApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {applications?.map((application) => {
        return (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        );
      })}
    </div>
  );
};

export default CreatedApplications;