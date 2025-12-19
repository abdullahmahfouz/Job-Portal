import React, { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import useFetch from '@/hooks/use-fetch'
import { getSavedJobs } from '@/api/apiJobs'
import JobCard from '@/components/job-card'
import { Heart } from 'lucide-react'

// Page where users can view jobs they have saved
const SavedJobs = () => {
  const { user } = useUser()

  const { 
    loading: loadingSavedJobs, 
    data: savedJobs, 
    fn: fnSavedJobs 
  } = useFetch(getSavedJobs)

  useEffect(() => {
    if (user) {
      fnSavedJobs()
    }
  }, [user])

  if (loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Heart size={36} fill="red" color="red" />
          Saved Jobs
        </h1>
        <p className="text-gray-400">
          {savedJobs?.length || 0} job{savedJobs?.length !== 1 ? 's' : ''} saved for later
        </p>
      </div>

      {/* Jobs Grid */}
      {!savedJobs || savedJobs.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={64} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">No Saved Jobs Yet</h3>
          <p className="text-gray-400">
            Start saving jobs you're interested in by clicking the heart icon
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((saved) => (
            <JobCard 
              key={saved.id} 
              job={saved.job}
              savedInit={true}
              onJobSaved={fnSavedJobs}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedJobs