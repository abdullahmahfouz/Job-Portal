import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import { getJobs } from '../api/apijJobs';
import useFetch from '../hooks/use-fetch';

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
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-8xl text-center pb-8">
        Job Listings
      </h1>
      {/* Search and filter section */}
      {loadingJobs && <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />}
    </div>
  );
};

export default JobListing;