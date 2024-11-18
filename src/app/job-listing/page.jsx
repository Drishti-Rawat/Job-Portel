
"use client";
import { motion } from "framer-motion";
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
import { Search, MapPin, Building2, X } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Blob = ({ className }) => (
  <motion.div
    className={`absolute rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob ${className}`}
    initial={{ scale: 0.8 }}
    animate={{ 
      scale: [0.8, 1.1, 0.8],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  />
);

const ITEMS_PER_PAGE = 10; // Number of jobs per page

const JobListingPage = () => {
  const { user, isLoaded } = useUser();
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [isloadingjobs, setIsloadingjobs] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { session } = useSession();

  // Calculate pagination values
  const totalItems = jobs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentJobs = jobs.slice(startIndex, endIndex);

  // Your existing useEffect hooks remain the same
  useEffect(() => {
    if (user && !user.unsafeMetadata.role) {
      router.push("/onboarding");
    }
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const supabasesessiontoken = await session.getToken({
          template: "supabase",
        });
        const data = await getCompanies(supabasesessiontoken);
        setCompanies(data);
      } catch (error) {
        console.log("error loading job in job-listing page", error);
      }
    };
    if (isLoaded) {
      fetchCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsloadingjobs(true);
      try {
        const supabasesessiontoken = await session.getToken({
          template: "supabase",
        });
        const data = await getJobs(supabasesessiontoken, {
          location,
          searchQuery,
          company_id,
        });
        setJobs(data);
        setCurrentPage(1); // Reset to first page when filters change
      } catch (error) {
        console.log("error loading job in job-listing page", error);
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
    if (query) {
      setSearchQuery(query);
    }
  };

  const handleClearFilter = async () => {
    setCompany_id('');
    setSearchQuery('');
    setLocation('');
    setCurrentPage(1);
  };

   // Background animation controls
   const backgroundVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Add numbered pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (!isLoaded || !user?.unsafeMetadata?.role) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <motion.div 
    className="min-h-screen relative overflow-hidden "
    variants={backgroundVariants}
    animate="animate"
  >
    {/* Animated Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <Blob className="bg-purple-300 dark:bg-purple-700 top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2" />
      <Blob className="bg-blue-300 dark:bg-blue-700 bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2" />
      <Blob className="bg-teal-300 dark:bg-teal-700 top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ maskImage: 'radial-gradient(circle at center, transparent 0%, black 100%)' }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-gray-900/20 to-gray-900/60" />
    </div>

    <motion.section 
      className="relative max-w-7xl mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Glassmorphism Header */}
      <motion.div
        className="text-center mb-16 p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h1 className="font-extrabold text-6xl sm:text-7xl mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Discover Your Next Role
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Find the perfect job opportunity that matches your skills and aspirations
        </p>
      </motion.div>

      {/* Search and Filters Section */}
      <motion.div
        className="space-y-6 backdrop-blur-xl bg-white/5 p-6 rounded-xl border border-white/10 shadow-xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <form onSubmit={handleSearch} className="flex w-full gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by title"
              name="search-query"
              className="pl-10 h-12 bg-white/10 border-white/10 hover:bg-white/20 transition-colors focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <Button 
            className="h-12 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300" 
            type="submit"
          >
            Search
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Select value={location} onValueChange={(value) => setLocation(value)}>
              <SelectTrigger className="pl-10 h-12 bg-white/10 border-white/10 hover:bg-white/20 transition-colors">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectGroup>
                  {State.getStatesOfCountry("IN").map((state) => (
                    <SelectItem key={state.name} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="relative flex-1">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
              <SelectTrigger className="pl-10 h-12 bg-white/10 border-white/10 hover:bg-white/20 transition-colors">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectGroup>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="destructive" 
            className="h-12 px-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/50 transform hover:scale-105 transition-all duration-300"
            onClick={handleClearFilter}
          >
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        </div>
      </motion.div>

      {/* Jobs Grid Section */}
      {isloadingjobs ? (
        <div className="flex justify-center mt-12">
          <BarLoader width={"100%"} color="#36d7b7" />
        </div>
      ) : (
        <motion.div 
          className="mt-12 space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? (
              jobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  <JobCard job={job} savedInit={job?.saved?.length > 0} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full text-center p-8 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-2xl text-gray-400 mb-2">No jobs found 😐</p>
                <p className="text-gray-500">Try adjusting your search filters</p>
              </motion.div>
            )}
          </div>

          {/* Pagination */}
          {jobs.length > ITEMS_PER_PAGE && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex justify-center mt-12"
            >
              <Pagination>
                <PaginationContent className="bg-white/5 backdrop-blur-xl rounded-lg p-2">
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={`hover:bg-white/10 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.ceil(jobs.length / ITEMS_PER_PAGE) }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                        className={`hover:bg-white/10 ${currentPage === index + 1 ? 'bg-purple-500 text-white' : ''}`}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(jobs.length / ITEMS_PER_PAGE), prev + 1))}
                      className={`hover:bg-white/10 ${currentPage === Math.ceil(jobs.length / ITEMS_PER_PAGE) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.section>
  </motion.div>
  );
};

export default JobListingPage;