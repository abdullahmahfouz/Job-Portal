import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '@/hooks/use-fetch'
import { getSingleJob, applyToJob } from '@/api/apiJobs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarLoader } from 'react-spinners'
import { Briefcase, MapPin, Heart, DoorOpen, Clock, Building2 } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'

const JobPage = () => {
  const { id } = useParams()
  const { user } = useUser()

  const { 
    loading: loadingJob, 
    data: job, 
    fn: fnJob 
  } = useFetch(getSingleJob, { job_id: id })

  const { 
    loading: loadingApply, 
    data: application,
    fn: fnApply 
  } = useFetch(applyToJob)

  useEffect(() => {
    if (id) {
      fnJob()
    }
  }, [id])

  const handleApply = () => {
    fnApply({
      job_id: id,
      candidate_id: user.id,
      name: user.fullName,
      status: 'applied',
      resume: ''
    })
  }

  if (loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  if (!job) {
    return <div className="flex items-center justify-center h-screen text-xl">Job not found</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-lg p-8 border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left: Company & Job Info */}
          <div className="flex gap-4 items-start flex-1">
            {job.company?.company_logo && (
              <div className="bg-white rounded-lg p-3 h-16 w-16 flex items-center justify-center flex-shrink-0">
                <img 
                  src={job.company.company_logo} 
                  alt={job.company.name}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-white">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Building2 size={16} />
                  <span className="font-medium">{job.company?.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              size="lg"
              className="flex-1 md:flex-none"
            >
              <Heart size={18} className="mr-2" />
              Save
            </Button>
            <Button 
              size="lg"
              onClick={handleApply}
              disabled={loadingApply}
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700"
            >
              <Briefcase size={18} className="mr-2" />
              {loadingApply ? 'Applying...' : 'Apply Now'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="md:col-span-2 space-y-6">
          {/* Job Description */}
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl">About the Role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements && (
            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Company</p>
                <p className="font-semibold">{job.company?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Location</p>
                <p className="font-semibold">{job.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Job Type</p>
                <p className="font-semibold">Full-time</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Posted</p>
                <p className="font-semibold">
                  {new Date(job.created_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Applications Count */}
          {job.applications && job.applications.length > 0 && (
            <Card className="border-gray-800 bg-blue-600/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600/20 p-3 rounded-lg">
                    <DoorOpen size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{job.applications.length}</p>
                    <p className="text-sm text-gray-400">
                      Application{job.applications.length > 1 ? 's' : ''} received
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobPage