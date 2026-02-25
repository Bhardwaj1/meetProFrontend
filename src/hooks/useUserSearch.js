import { useState, useEffect } from "react";

const mockUsers = [
  {
    id: 1,
    name: "Gaurav Bhardwaj",
    email: "gaurav@meetpro.com",
  },
  {
    id: 2,
    name: "Gaurav Sharma",
    email: "gaurav.s@company.com",
  },
  {
    id: 3,
    name: "Rohit Verma",
    email: "rohit@meetpro.com",
  },
];

export default function useUserSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(() => {
      const filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filtered);
      setLoading(false);
    }, 300); // debounce 300ms

    return () => clearTimeout(timeout);
  }, [query]);

  return { results, loading };
}