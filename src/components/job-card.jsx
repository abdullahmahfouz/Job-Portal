import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Trash2Icon, MapPinIcon, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const JobCard = ({
    job, 
    isMyjob=false,
    savedInit=false,
    onJobSaved=()=>{},
}) => {
  const {user} = useUser();
  
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
          {job.company && <img src={job.company.logo_url} className="h-6" />}
          <div>
            <MapPinIcon size={15} className="inline mr-1 mb-1" />
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

        <Heart size={20} stroke= "red" fill='red'/>
      </CardFooter>
    </Card>
  );
};

export default JobCard;