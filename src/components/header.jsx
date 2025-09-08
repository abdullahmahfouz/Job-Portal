
import React from 'react'

const Header = () => {
  return (
    <>
    <nav className="py-4 flex justify-between items-center">
      <Link>
      <img src="/logo.png" alt="logo" className="w-32" />
      </Link>
      <Button variant="outline">Login</Button>

    </nav>
    </>
  )
}

export default Header