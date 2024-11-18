import supabaseClient, { supabaseUrl } from "@/utils/supabase/client";

export const ApplyToJob = async (token,_,jobData) => {
    const supabase = await supabaseClient(token);

  

   const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 90000);
    const fileName = `resume-${random}-${timestamp}-${jobData.candidate_id}`;
   const {  error:storeageError} = await supabase.storage
      .from("resumes")
      .upload(fileName, jobData.resume);

     const resumeUrl = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

    const { data, error } = await supabase.from("applications").insert([{
        ...jobData,
        resume:resumeUrl
    }]).select();
      
   if(storeageError){
      console.log("Error uploading resume", storeageError);
      return null;
    }
    
    if (error) {
      console.log("Error updating job", error);
      return null;
    }
    return [{data,error:error||storeageError}];
}

export const updateApplicationStatus = async (token, {job_id},status) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .update({status:status}).eq("job_id", job_id).select();

    if (error || data.length === 0) {
      console.error("Error Updating Application Status:", error);
      return null;
    }
  
  
  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}