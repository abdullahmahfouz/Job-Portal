import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

// Guarded route that requires a signed‑in user and remembers where they came from
export default function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  // While Clerk is still loading, don’t flash anything
  if (!isLoaded) {
    return null;
  }

  // If not signed in, send them to landing page and open login,
  // passing the current path so we can return after sign‑in.
  if (!isSignedIn) {
    const redirectTo = encodeURIComponent(
      `${location.pathname}${location.search || ""}`
    );

    return (
      <Navigate
        to={`/?sign-in=true&redirectTo=${redirectTo}`}
        state={{ from: location }}
        replace
      />
    );
  }

  // User is signed in, render the protected content
  return children;
}