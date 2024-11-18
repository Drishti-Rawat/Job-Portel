'use client'
import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { session } = useSession();


  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
        const supabasesessiontoken = await session.getToken({
            template: "supabase",
          })
      const response = await cb(supabasesessiontoken, options, ...args);
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