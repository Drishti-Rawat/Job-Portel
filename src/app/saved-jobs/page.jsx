
'use client'
import { getSavedJobs } from "@/actions/jobs.actions";
import JobCard from "@/components/shared/JobCard";
import { useSession, useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Sparkles, BookmarkX } from "lucide-react";

const SavedJobs = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { session } = useSession();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(false);

  useEffect(() => {
    if (user && !user.unsafeMetadata.role) {
      router.push("/onboarding");
    }
  }, [user, router]);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BarLoader color="#8B5CF6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative py-10 px-4">
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
        className="max-w-6xl mx-auto relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-5xl sm:text-7xl font-extrabold text-center mb-12"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Saved Jobs
          </span>
        </motion.h1>

        {savedJobs.length ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {savedJobs.map((saved, index) => (
              <motion.div
                key={saved.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.6 + index * 0.1,
                  duration: 0.5 
                }}
              >
                <JobCard
                  job={saved?.job}
                  onJobSaved={fnSavedJobs}
                  savedInit={true}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center justify-center space-y-4 text-gray-400 text-center p-12 bg-gray-800/30 rounded-2xl"
          >
            <BookmarkX className="w-16 h-16 text-gray-500" />
            <p className="text-2xl font-semibold">No Saved Jobs Found</p>
            <p className="text-sm">Jobs you save will appear here</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SavedJobs;