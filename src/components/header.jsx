import React from 'react'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Button } from "./ui/ui/button";
const Header = () => {
  return (
    <nav className="py-4 flex justify-between items-center px-8 bg-white shadow-md">
      <Link to="/" className="block">
        <img
          src="/logo.png"
          alt="HireMe Logo"
            className="h-20"
            style={{ maxHeight: '150px', maxWidth: '200px' }}

          />
        </Link>

      

    </nav>
  )
}

export default Header