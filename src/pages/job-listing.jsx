import React from 'react';
import { useEffect } from 'react';
import { useSession } from '@clerk/clerk-react';
import { getJobs } from '../api/apijJobs';
import useFetch from '../hooks/use-fetch';

// Page that will list all available jobs for candidates
const JobListing = () => {
  const { session } = useSession();
  
  // Use the custom hook to fetch jobs with automatic token handling
  const { data: jobs, loading, error, fn: fetchJobs } = useFetch(getJobs);

  // Load jobs when component mounts and session is available
  useEffect(() => {
    if (session) {
      fetchJobs();
    }
  }, [session, fetchJobs]);

  // Show loading state while fetching
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading jobs...</p>
      </div>
    );
  }

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading jobs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      
      {jobs && jobs.length > 0 ? (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
              {/* Add more job details here */}
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
};

export default JobListing