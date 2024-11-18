"use client";
import React, { useState } from "react";
import { BarLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApplyToJob } from "@/actions/application.actions";
import { Upload, AlertTriangle, CheckCircle } from "lucide-react";

const ApplyToJobSchema = z.object({
  name: z.string().min(1, "Name is required"),
  experience: z.number().min(0, "Experience must be positive"),
  skills: z.string().min(1, "Skills are required"),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"]),
  resume: z.any().refine((files) => files?.length === 1, "Resume is required")
});

const ApplyJobDrawer = ({ job, user, applied = false, fetchJobDetails, session }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(ApplyToJobSchema),
    defaultValues: {
      name: "",
      experience: "",
      skills: "",
      education: undefined,
      resume: undefined
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setIsSuccess(false);

      const supabaseSessionToken = await session?.getToken({
        template: "supabase"
      });

      if (!supabaseSessionToken) {
        throw new Error("Authentication token not found");
      }

      const jobData = {
        name: data.name,
        job_id: job.id,
        candidate_id: user.id,
        status: "applied",
        experience: data.experience,
        skills: data.skills,
        education: data.education,
        resume: data.resume[0]
      };

      const response = await ApplyToJob(supabaseSessionToken, null, jobData);

      if (!response || response[0]?.error) {
        throw new Error(response?.[0]?.error?.message || "Failed to submit application");
      }

      setIsSuccess(true);
      reset();
      await fetchJobDetails();
      
      setTimeout(() => {
        setIsSuccess(false);
        document.querySelector('[role="dialog"] button[type="button"]')?.click();
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job.isOpen || applied}
          className="w-full  "
        >
          {job.isOpen ? (applied ? "Applied" : "Apply") : "Hiring closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <DrawerHeader className="bg-indigo-700/10 p-4 rounded-t-lg">
          <DrawerTitle className="text-indigo-700 dark:text-indigo-300">
            Apply for {job.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription className="text-indigo-500 dark:text-indigo-400">
            Please fill the form below
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 dark:bg-red-950 p-4 rounded-md text-red-500 dark:text-red-300 text-sm flex items-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                {error}
              </motion.div>
            )}
            
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-50 dark:bg-green-950 p-4 rounded-md text-green-500 dark:text-green-300 text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Application submitted successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {isSubmitting && (
            <div className="w-full">
              <BarLoader width={"100%"} color="#6366F1" />
            </div>
          )}

          {[
            { 
              name: "name", 
              type: "text", 
              placeholder: "Name of candidate",
              errorKey: "name"
            },
            { 
              name: "experience", 
              type: "number", 
              placeholder: "Years of Experience",
              errorKey: "experience",
              valueAsNumber: true
            },
            { 
              name: "skills", 
              type: "text", 
              placeholder: "Skills (comma separated)",
              errorKey: "skills"
            }
          ].map(({ name, type, placeholder, errorKey, valueAsNumber }) => (
            <div key={name}>
              <Input
                type={type}
                placeholder={placeholder}
                className="flex-1 border-indigo-200 dark:border-indigo-800 focus:border-pink-500 focus:ring-pink-500"
                disabled={isSubmitting}
                {...register(name, { valueAsNumber })}
              />
              {errors[errorKey] && (
                <p className="text-red-500 text-sm mt-1">{errors[errorKey].message}</p>
              )}
            </div>
          ))}

          <div>
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col gap-2"
                  disabled={isSubmitting}
                >
                  {["Intermediate", "Graduate", "Post Graduate"].map((edu) => (
                    <div key={edu} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={edu} 
                        id={edu.toLowerCase().replace(" ", "")} 
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                      <Label 
                        htmlFor={edu.toLowerCase().replace(" ", "")} 
                        className="text-indigo-700 dark:text-indigo-300"
                      >
                        {edu}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {errors.education && (
              <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>
            )}
          </div>

          <div>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              className="flex-1 file:text-indigo-500 dark:file:text-indigo-300 border-indigo-200 dark:border-indigo-800"
              disabled={isSubmitting}
              {...register("resume")}
              icon={<Upload className="w-5 h-5 text-indigo-500" />}
            />
            {errors.resume && (
              <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            size="lg"
            variant="blue"
            disabled={isSubmitting}
            className=""
          >
            {isSubmitting ? "Submitting..." : "Apply"}
          </Button>
        </form>

        <DrawerFooter className="bg-indigo-50/50 dark:bg-indigo-950/50 p-4">
          <DrawerClose asChild>
            <Button 
              variant="outline" 
              disabled={isSubmitting}
              className="border-indigo-200 text-indigo-600 dark:border-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;