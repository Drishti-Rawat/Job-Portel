"use client";
import { getCompanies } from "@/actions/companies.actions";
import { getJobs } from "@/actions/jobs.actions";
import JobCard from "@/components/shared/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession, useUser } from "@clerk/nextjs";
import { State } from "country-state-city";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobListingpage = () => {
  const { user, isLoaded } = useUser();
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [isloadingjobs, setIsloadingjobs] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (user && !user.unsafeMetadata.role) {
      router.push("/onboarding");
    }
  }, []);

  const { session } = useSession();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const supabasesessiontoken = await session.getToken({
          template: "supabase",
        });

        const data = await getCompanies(supabasesessiontoken);
        // console.log(data);
        setCompanies(data);
      } catch (error) {
        console.log("error loding job in job-listing page", error);
      }
    };
    if (isLoaded){
      fetchCompanies();
    }
  }, [isLoaded]);
  // console.log(companies);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsloadingjobs(true);
      try {
        const supabasesessiontoken = await session.getToken({
          template: "supabase",
        });

        // console.log(supabasesessiontoken);
        const data = await getJobs(supabasesessiontoken, {
          location,
          searchQuery,
          company_id,
        });
        setJobs(data);
        // console.log(data);
      } catch (error) {
        console.log("error loding job in job-listing page", error);
      } finally {
        setIsloadingjobs(false);
      }
    };

    if (isLoaded) {
      fetchJobs();
    }
  }, [isLoaded, location, searchQuery, company_id]);

  const handleSearch = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if(query){
      setSearchQuery(query);
    }

  };
  // console.log(searchQuery);
  const handleClearFilter = async () => {
    
    setCompany_id('');
     setSearchQuery('');
     setLocation('');
  }

  if (!isLoaded || !user?.unsafeMetadata?.role) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <section>
      <h1 className="font-extrabold text-6xl sm:text-7xl text-center pb-8 gradient-title">
        Latest Jobs
      </h1>

      {/* add filters here */}
      <form onSubmit={handleSearch} className="flex w-full h-14 gap-2 items-center mb-3">
        <Input
          type="text"
          placeholder="Search by title"
          name="search-query"
          className="h-full flex-1 px-4 text-sm"
          />
          <Button className="h-full sm:w-28" variant="blue" type="submit">Search</Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="">
            <SelectValue placeholder="filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map((state) => (
                <SelectItem key={state.name} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
          <SelectTrigger className="">
            <SelectValue placeholder="filter by company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="destructive" className="sm:w-1/2" onClick={handleClearFilter}>Clear filters</Button>
      </div>


      {isloadingjobs ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div>No jobs found 😐</div>
          )}
        </div>
      )}
    </section>
  );
};

export default JobListingpage;
