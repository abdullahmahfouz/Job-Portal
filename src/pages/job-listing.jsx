import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import { getJobs } from '../api/apiJobs';
import useFetch from '../hooks/use-fetch';
import JobCard from '../components/job-card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MapPin } from 'lucide-react';
import companies from '../data/companies.json';

// List of common locations
const locations = [
  "Toronto Ontario",
  "New York NY", 
  "San Francisco CA",
  "London UK",
  "Remote"
];

// Time filter options
const dateFilters = [
  { label: "Last 24 hours", value: "1" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "All time", value: "all" },
];

// Page that will list all available jobs for candidates
const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [date_posted, setDate_posted] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
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
    date_posted,
  });

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, company_id, searchQuery, date_posted]);

  const handleSearch = (e) => {
    e.preventDefault();
    fnJobs();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setCompany_id("");
    setDate_posted("");
  };

  const handleFindMyLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For now, set to closest location from list
          // In production, you'd use a geocoding API
          setLocation(locations[0]); // Default to first location
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please select manually.');
          setLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
    }
  };

  console.log('Job Listing State:', { isLoaded, dataJobs, loadingJobs, error });

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Job Openings
      </h1>
      
      {/* Search and filter section */}
      <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search by job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleFindMyLocation}
            disabled={loadingLocation}
            className="w-full md:w-auto"
          >
            <MapPin size={16} className="mr-2" />
            {loadingLocation ? 'Finding...' : 'Find My Location'}
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={company_id} onValueChange={setCompany_id}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map(({ name, id }) => (
              <SelectItem key={id} value={id.toString()}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={date_posted} onValueChange={setDate_posted}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Posted Date" />
          </SelectTrigger>
          <SelectContent>
            {dateFilters.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button type="submit" variant="destructive" className="w-full md:w-auto">
          Search
        </Button>
        
        {(searchQuery || location || company_id || date_posted) && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={clearFilters}
            className="w-full md:w-auto"
          >
            Clear
          </Button>
        )}
        </div>
      </form>
      
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