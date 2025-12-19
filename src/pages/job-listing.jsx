import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import { getJobs } from '../api/apijJobs';
import useFetch from '../hooks/use-fetch';
import JobCard from '../components/job-card';

// Page that will list all available jobs for candidates
const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: dataJobs,
    loading: loadingJobs,
    error,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded]);

  console.log('Job Listing State:', { isLoaded, dataJobs, loadingJobs, error });

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Job Openings
      </h1>
      {/* Search and filter section */}
      {loadingJobs && <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />}
      
      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataJobs?.length ? (
            dataJobs.map((job) => {
              return <JobCard key={job.id} job={job} />;
            })
          ) : (
            <div>No Jobs Found </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-center mt-4">
          Error: {error.message}
        </div>
      )}
    </div>
  );
};

export default JobListing;