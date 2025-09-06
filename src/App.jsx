import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/landing'
import AppLayout from './components/applayout'
import Onboarding from './pages/onboarding'
import JobListing from './pages/job-listing'
import JobPage from './pages/job'
import SavedJobs from './pages/saved-jobs'
import MyJobs from './pages/my-jobs'
import { ThemeProvider } from './components/darkmode'

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: "/onboarding",
        element: <Onboarding />
      },
      {
        path: "jobs",
        element: <JobListing />
      },
      {
        path: "/jobs/:id",
        element: <JobPage />
      },
      {
        path: "/saved-jobs",
        element: <SavedJobs />
      },
      {
        path: "/my-jobs",
        element: <MyJobs />
      }
    ]
  }
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
