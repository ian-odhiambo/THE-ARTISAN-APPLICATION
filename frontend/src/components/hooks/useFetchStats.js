import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useFetchStats = () => {
  const [stats, setStats] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      console.log('Fetching admin stats...');
      const res = await axios.get('http://localhost:5000/api/v1/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Stats fetch failed:', err.response?.status, err.message);
      toast.error('Failed to fetch stats');
    }
  }, []);

  return { stats, fetchStats, setStats };
};

export default useFetchStats;
