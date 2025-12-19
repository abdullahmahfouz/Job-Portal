import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Trash2Icon, MapPinIcon, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import useFetch from '../hooks/use-fetch';
import { saveJobs } from '../api/apiJobs';

const JobCard = ({
    job, 
    isMyjob=false,
    savedInit=false,
    onJobSaved=()=>{},
}) => {
  const [saved, setSaved] = useState(savedInit || (job?.saved && job.saved.length > 0));
  const {
    fn: fnSavedJobs,
    data: savedJob,
    loading: loadingSavedJobs,
  } = useFetch(saveJobs);
  
  const {user} = useUser();

  const handleSaveJob = async () => {
    await fnSavedJobs({
      alreadySaved: saved,
    }, {
      user_id: user.id,
      job_id: job.id,
    });
    onJobSaved();
  };
  
  useEffect(() => {
    if (savedJob !== undefined) {
      setSaved(savedJob?.length > 0);
    }
  }, [savedJob]);

  useEffect(() => {
    setSaved(savedInit || (job?.saved && job.saved.length > 0));
  }, [job?.saved, savedInit]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">{job.title}</CardTitle>
        {isMyjob && (
          <Trash2Icon 
            fill="red" 
            size={18} 
            className="text-red-300 cursor-pointer" 
          />
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between"> 
          {job.company && <img src={job.company.company_logo} className="h-6" />}
          <div className = "flex gap-2 items-center">
            <MapPinIcon size={15} />
            <span>{job.location}</span>
          </div>
        </div>
        <hr /> 
        {job.description.substring(0, job.description.indexOf("."))}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {!isMyjob && ( 
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJobs}
          >
            <Heart 
              size={20} 
              stroke="red" 
              fill={saved ? 'red' : 'transparent'}
            />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;