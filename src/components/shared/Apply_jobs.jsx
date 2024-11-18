import React, { useState } from "react";
import { BarLoader } from "react-spinners";
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

      // Success
      setIsSuccess(true);
      reset();
      await fetchJobDetails();
      
      // Close drawer after successful submission
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
        >
          {job.isOpen ? (applied ? "Applied" : "Apply") : "Hiring closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please fill the form below</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
          {error && (
            <div className="bg-red-50 p-4 rounded-md text-red-500 text-sm">
              {error}
            </div>
          )}
          
          {isSuccess && (
            <div className="bg-green-50 p-4 rounded-md text-green-500 text-sm">
              Application submitted successfully!
            </div>
          )}

          {isSubmitting && (
            <div className="w-full">
              <BarLoader width={"100%"} color="#36d7b7" />
            </div>
          )}

          <div>
            <Input
              type="text"
              placeholder="Name of candidate"
              className="flex-1"
              disabled={isSubmitting}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Years of Experience"
              className="flex-1"
              disabled={isSubmitting}
              {...register("experience", { valueAsNumber: true })}
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
            )}
          </div>

          <div>
            <Input
              type="text"
              placeholder="Skills (comma separated)"
              className="flex-1"
              disabled={isSubmitting}
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
            )}
          </div>

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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Graduate" id="graduate" />
                    <Label htmlFor="graduate">Graduate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Post Graduate" id="postGraduate" />
                    <Label htmlFor="postGraduate">Post Graduate</Label>
                  </div>
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
              className="flex-1 file:text-gray-500"
              disabled={isSubmitting}
              {...register("resume")}
            />
            {errors.resume && (
              <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            variant="blue" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Apply"}
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;