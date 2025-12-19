import React, { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import useFetch from '@/hooks/use-fetch'
import { addNewJob } from '@/api/apiJobs'
import { BarLoader } from 'react-spinners'

// Form validation schema
const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(3, 'Location is required'),
  company_name: z.string().min(2, 'Company name is required'),
  requirements: z.string().min(20, 'Requirements must be at least 20 characters'),
})

// Page where recruiters can post new job listings
const PostJobs = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
  })

  const { 
    loading: loadingCreateJob, 
    error: errorCreateJob,
    data: dataCreateJob, 
    fn: fnCreateJob 
  } = useFetch(addNewJob)

  // Handle form submission
  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    })
  }

  // Redirect to my jobs page after successful creation
  useEffect(() => {
    if (dataCreateJob?.length > 0) {
      navigate('/my-jobs')
    }
  }, [dataCreateJob])

  if (loadingCreateJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Post a New Job</h1>
        <p className="text-gray-400">Fill in the details to create a job posting</p>
      </div>

      <Card className="border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">Job Details</CardTitle>
          <CardDescription>Provide information about the position you're hiring for</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Software Engineer"
                {...register('title')}
                className="bg-background"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                placeholder="e.g. Acme Inc."
                {...register('company_name')}
                className="bg-background"
              />
              {errors.company_name && (
                <p className="text-red-500 text-sm">{errors.company_name.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g. Remote, New York NY, or anywhere"
                {...register('location')}
                className="bg-background"
              />
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location.message}</p>
              )}
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                {...register('description')}
                className="bg-background min-h-[150px]"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements *</Label>
              <Textarea
                id="requirements"
                placeholder="List the required skills, experience, education, etc..."
                {...register('requirements')}
                className="bg-background min-h-[150px]"
              />
              {errors.requirements && (
                <p className="text-red-500 text-sm">{errors.requirements.message}</p>
              )}
            </div>

            {/* Error Message */}
            {errorCreateJob && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                {errorCreateJob.message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                size="lg" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loadingCreateJob}
              >
                {loadingCreateJob ? 'Posting...' : 'Post Job'}
              </Button>
              <Button 
                type="button" 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/my-jobs')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default PostJobs