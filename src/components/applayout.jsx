import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div>
      <header>
        <nav>
          <h1>Job Portal</h1>
          {/* Navigation will go here */}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout