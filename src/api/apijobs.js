import supabaseClient from "@/utils/supabase/client";

export async function getJobs(token){
    const supabase = supabaseClient()

    let query = supabase.from('jobs').select('*')

    const  {data, error} = await  query

    if(error){
        console.log("Error fetching jobs",error)
        return null
    }

    return data
}