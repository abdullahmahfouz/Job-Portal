import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '@/hooks/use-fetch'
import { getSingleJob, applyToJob, uploadResume, saveJobs } from '@/api/apiJobs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { BarLoader } from 'react-spinners'
import { Briefcase, MapPin, Heart, DoorOpen, Clock, Building2 } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'

const JobPage = () => {
  const { id } = useParams()
  const { user, session } = useUser()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)

  // Application form state
  const [applicationData, setApplicationData] = useState({
    skills: '',
    experience: '',
    education: '',
    resume: ''
  })

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

  const { 
    loading: loadingSave, 
    data: savedJob,
    fn: fnSave 
  } = useFetch(saveJobs)

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (id) {
      fnJob()
    }
  }, [id])

  // Check if job is saved
  useEffect(() => {
    if (job?.saved && job.saved.length > 0) {
      setSaved(true)
    } else {
      setSaved(false)
    }
  }, [job])

  // Update saved state after save/unsave
  useEffect(() => {
    if (savedJob !== undefined) {
      fnJob() // Refetch to update saved status
    }
  }, [savedJob])

  // Close drawer and show success when application is submitted
  useEffect(() => {
    if (application) {
      setIsDrawerOpen(false)
      // Refetch job to update application count
      fnJob()
    }
  }, [application])

  const handleApply = async (e) => {
    e.preventDefault()
    
    let resumeUrl = applicationData.resume
    
    // Upload resume file if provided
    if (resumeFile) {
      try {
        const token = await session?.getToken({ template: 'supabase' })
        resumeUrl = await uploadResume(token, resumeFile, user.id)
      } catch (error) {
        console.error('Error uploading resume:', error)
        alert('Failed to upload resume. Please try again.')
        return
      }
    }
    
    fnApply({
      job_id: id,
      candidate_id: user.id,
      name: user.fullName,
      status: 'applied',
      ...applicationData,
      resume: resumeUrl
    })
  }

  const handleInputChange = (field, value) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveJob = () => {
    fnSave(
      { alreadySaved: saved },
      {
        user_id: user.id,
        job_id: id
      }
    )
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
              onClick={handleSaveJob}
              disabled={loadingSave}
              className="flex-1 md:flex-none"
            >
              <Heart 
                size={18} 
                className="mr-2" 
                fill={saved ? "red" : "none"}
                color={saved ? "red" : "currentColor"}
              />
              {saved ? 'Saved' : 'Save'}
            </Button>
            
            {/* Apply Button with Drawer */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button 
                  size="lg"
                  className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700"
                >
                  <Briefcase size={18} className="mr-2" />
                  Apply Now
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Apply for {job.title}</DrawerTitle>
                  <DrawerDescription>
                    Please fill in your details to submit your application
                  </DrawerDescription>
                </DrawerHeader>
                
                <form onSubmit={handleApply} className="px-4">
                  <div className="space-y-4 py-4">
                    {/* Skills */}
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills *</Label>
                      <Textarea
                        id="skills"
                        placeholder="e.g. JavaScript, React, Node.js, etc."
                        value={applicationData.skills}
                        onChange={(e) => handleInputChange('skills', e.target.value)}
                        required
                        className="min-h-[80px]"
                      />
                    </div>

                    {/* Experience */}
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience *</Label>
                      <Textarea
                        id="experience"
                        placeholder="Describe your relevant work experience..."
                        value={applicationData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        required
                        className="min-h-[100px]"
                      />
                    </div>

                    {/* Education */}
                    <div className="space-y-2">
                      <Label htmlFor="education">Education *</Label>
                      <Textarea
                        id="education"
                        placeholder="Your educational background..."
                        value={applicationData.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                        required
                        className="min-h-[80px]"
                      />
                    </div>

                    {/* Resume File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="resume-file">Upload Resume *</Label>
                      <Input
                        id="resume-file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        required
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-400">
                        Upload your resume (PDF, DOC, or DOCX - Max 5MB)
                      </p>
                      {resumeFile && (
                        <p className="text-xs text-green-400">
                          ✓ Selected: {resumeFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <DrawerFooter>
                    <Button 
                      type="submit" 
                      disabled={loadingApply}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loadingApply ? 'Submitting...' : 'Submit Application'}
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </form>
              </DrawerContent>
            </Drawer>
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