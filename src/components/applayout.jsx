import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <header style={{ background: 'transparent' }}>
        <nav style={{ background: 'transparent', padding: '1rem' }}>
          <h1 style={{ color: 'white', margin: 0 }}>Job Portal</h1>
          {/* Navigation will go here */}
        </nav>
      </header>
      <main style={{ background: 'transparent', padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout