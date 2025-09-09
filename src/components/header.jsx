import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="absolute top-4 left-4 z-20">
      <nav>
        <Link to="/" className="block">
          <img 
            src="/logo.png" 
            alt="HireMe Logo" 
            className="h-10 w-auto" 
          />
        </Link>
      </nav>
    </header>
  )
}

export default Header