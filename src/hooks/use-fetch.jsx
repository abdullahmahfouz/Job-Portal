import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

// Custom hook for fetching data with authentication and state management
const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { session } = useSession();

  // Async function that handles the data fetching with authentication
  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      // Get Supabase access token from Clerk session
      const supabaseAccessToken = await session.getToken({ template: "supabase" });

      // Call the callback function with token, options, and any additional args
      const response = await cb(supabaseAccessToken, options, ...args);

      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
