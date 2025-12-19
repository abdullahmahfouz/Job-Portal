import React, { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import useFetch from '@/hooks/use-fetch'
import { getMyJobs, updateJobStatus } from '@/api/apiJobs'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Briefcase, MapPin, Users, Calendar, Eye, Trash2, CheckCircle2, XCircle } from 'lucide-react'

// Page for recruiters to see and manage their posted jobs
const MyJobs = () => {
  const { user } = useUser()

  // Fetch jobs posted by this recruiter
  const { 
    loading: loadingJobs, 
    data: jobs, 
    fn: fnJobs 
  } = useFetch(getMyJobs, { recruiter_id: user?.id })

  const { 
    loading: loadingStatus,
    fn: fnUpdateStatus 
  } = useFetch(updateJobStatus)

  useEffect(() => {
    if (user?.id) {
      fnJobs()
    }
  }, [user])

  const handleStatusToggle = (job_id, currentStatus) => {
    fnUpdateStatus({ job_id, isOpen: !currentStatus }).then(() => {
      fnJobs() // Refresh the jobs list
    })
  }

  if (loadingJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Job Postings</h1>
          <p className="text-gray-400">Manage your posted jobs and view applications</p>
        </div>
        <Link to="/post-job">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Briefcase size={18} className="mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      {jobs && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-800 bg-gradient-to-br from-blue-600/10 to-blue-600/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Jobs</p>
                  <p className="text-3xl font-bold">{jobs.length}</p>
                </div>
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <Briefcase size={24} className="text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gradient-to-br from-green-600/10 to-green-600/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Open Jobs</p>
                  <p className="text-3xl font-bold">
                    {jobs.filter(job => job.isOpen).length}
                  </p>
                </div>
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <CheckCircle2 size={24} className="text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gradient-to-br from-purple-600/10 to-purple-600/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Applications</p>
                  <p className="text-3xl font-bold">
                    {jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0)}
                  </p>
                </div>
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <Users size={24} className="text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gradient-to-br from-orange-600/10 to-orange-600/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Closed Jobs</p>
                  <p className="text-3xl font-bold">
                    {jobs.filter(job => !job.isOpen).length}
                  </p>
                </div>
                <div className="bg-orange-600/20 p-3 rounded-lg">
                  <XCircle size={24} className="text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Jobs List */}
      {!jobs || jobs.length === 0 ? (
        <Card className="border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase size={64} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Jobs Posted Yet</h3>
            <p className="text-gray-400 mb-6">Start by posting your first job opening</p>
            <Link to="/post-job">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Post Your First Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="border-gray-800 hover:border-gray-700 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {/* Company Logo */}
                    {job.company?.company_logo && (
                      <div className="bg-white rounded-lg p-2 h-14 w-14 flex items-center justify-center flex-shrink-0">
                        <img 
                          src={job.company.company_logo} 
                          alt={job.company.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-2xl">{job.title}</CardTitle>
                        {/* Status Badge */}
                        {job.isOpen ? (
                          <span className="px-3 py-1 bg-green-600/20 border border-green-600/30 text-green-400 text-xs font-semibold rounded-full">
                            OPEN
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-semibold rounded-full">
                            CLOSED
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Briefcase size={14} />
                          <span>{job.company?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Application Count Badge */}
                  <div className="bg-green-600/20 px-4 py-2 rounded-lg border border-green-600/30">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-green-400" />
                      <span className="font-semibold text-green-400">
                        {job.applications?.length || 0} Applicants
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-300 line-clamp-2">{job.description}</p>
              </CardContent>

              <CardFooter className="flex gap-3">
                <Link to={`/job/${job.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Eye size={16} className="mr-2" />
                    View Details
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => handleStatusToggle(job.id, job.isOpen)}
                  disabled={loadingStatus}
                  className={job.isOpen ? "text-orange-400 hover:bg-orange-600/10" : "text-green-400 hover:bg-green-600/10"}
                >
                  {job.isOpen ? (
                    <>
                      <XCircle size={16} className="mr-2" />
                      Close
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} className="mr-2" />
                      Open
                    </>
                  )}
                </Button>
                <Button variant="outline" className="text-red-400 hover:text-red-300 hover:bg-red-600/10">
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyJobs