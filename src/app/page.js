
'use client'
import { getCompanies } from "@/actions/companies.actions";
import { AddNewJob } from "@/actions/jobs.actions";
import AddCompanyDrawer from "@/components/shared/AddCompanyDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession, useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Sparkles, Building2, MapPin, FileText, ClipboardList } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const [dataCreateJob, setDataCreateJob] = useState(null);
  const [loadingCreateJob, setLoadingCreateJob] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const {session} = useSession();

  const fnCreateJob = async (data) => {
    setLoadingCreateJob(true);
    try {
      const supabasesessiontoken = await session.getToken({
        template: "supabase",
      });
  
      if (!supabasesessiontoken) {
        console.log("No token available");
        return;
      } 
      const response = await AddNewJob(supabasesessiontoken,null, data);
      setDataCreateJob(response);
    } catch (error) {
      console.log("error creating job", error);
    }
    finally {
      setLoadingCreateJob(false);
    }
  };

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) router.push(`/job-listing`);
  }, [loadingCreateJob]);

  const fnCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const supabasesessiontoken = await session.getToken({
        template: "supabase",
      });
  
      if (!supabasesessiontoken) {
        console.log("No token available");
        return;
      } 
      const response = await getCompanies(supabasesessiontoken);
      setCompanies(response);
    } catch (error) {
      console.log("error fetching companies", error);
    }
    finally {
      setLoadingCompanies(false);
    }
  }

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BarLoader color="#8B5CF6" />
      </div>
    );
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    router.push("/job-listing");
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
        className="max-w-4xl mx-auto relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </motion.div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-center mb-12">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Post a Job
          </span>
        </h1>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 backdrop-blur-sm bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50"
        >
          {/* Job Title */}
          <motion.div
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <label className="flex gap-2 text-gray-200 mb-2">
              <FileText className="w-5 h-5" />
              Job Title
            </label>
            <Input 
              placeholder="Enter job title" 
              {...register("title")} 
              className="h-12 bg-gray-900/50 border-gray-700/50 focus:border-purple-500/50 rounded-xl text-gray-200 placeholder:text-gray-400"
            />
            {errors.title && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-rose-500"
              >
                {errors.title.message}
              </motion.p>
            )}
          </motion.div>

          {/* Job Description */}
          <motion.div
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <label className="flex gap-2 text-gray-200 mb-2">
              <ClipboardList className="w-5 h-5" />
              Job Description
            </label>
            <Textarea 
              placeholder="Enter job description" 
              {...register("description")} 
              className="min-h-[120px] bg-gray-900/50 border-gray-700/50 focus:border-purple-500/50 rounded-xl text-gray-200 placeholder:text-gray-400"
            />
            {errors.description && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-rose-500"
              >
                {errors.description.message}
              </motion.p>
            )}
          </motion.div>

          {/* Location and Company Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <label className="flex gap-2 text-gray-200 mb-2">
                <MapPin className="w-5 h-5" />
                Location
              </label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 bg-gray-900/50 border-gray-700/50 focus:border-purple-500/50 rounded-xl text-gray-200">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectGroup>
                        {State.getStatesOfCountry("IN").map(({ name }) => (
                          <SelectItem key={name} value={name} className="text-gray-200 focus:bg-purple-500/20">
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-rose-500"
                >
                  {errors.location.message}
                </motion.p>
              )}
            </motion.div>

            {/* Company */}
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <label className="flex gap-2 text-gray-200 mb-2">
                <Building2 className="w-5 h-5" />
                Company
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Controller
                    name="company_id"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-12 bg-gray-900/50 border-gray-700/50 focus:border-purple-500/50 rounded-xl text-gray-200">
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectGroup>
                            {companies?.map(({ name, id }) => (
                              <SelectItem key={name} value={id} className="text-gray-200 focus:bg-purple-500/20">
                                {name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <AddCompanyDrawer fetchCompanies={fnCompanies} session={session} />
              </div>
              {errors.company_id && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-rose-500"
                >
                  {errors.company_id.message}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Requirements */}
          <motion.div
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <label className="flex gap-2 text-gray-200 mb-2">
              <ClipboardList className="w-5 h-5" />
              Requirements
            </label>
            <Controller
              name="requirements"
              control={control}
              render={({ field }) => (
                <div className="rounded-xl overflow-hidden border border-gray-700/50">
                  <MDEditor 
                    value={field.value} 
                    onChange={field.onChange}
                    preview="edit"
                    className="bg-gray-900/50"
                  />
                </div>
              )}
            />
            {errors.requirements && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-rose-500"
              >
                {errors.requirements.message}
              </motion.p>
            )}
          </motion.div>

          {loadingCreateJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-2"
            >
              <BarLoader width="100%" color="#8B5CF6" />
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              disabled={loadingCreateJob}
            >
              Post Job
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default PostJob;