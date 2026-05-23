import { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useArtisanActions = (fetchAllArtisans, fetchUnapprovedArtisans) => {
  const handleApproveArtisan = useCallback(async (id) => {
    try {
      console.log('Approving artisan ID:', id);
      await axios.patch(`http://localhost:5000/api/v1/admin/approve-artisan/${id}`);
      toast.success('Artisan approved ✅');
      await fetchAllArtisans();
      await fetchUnapprovedArtisans();
    } catch (err) {
      console.error('Approve failed:', err.response?.status, err.response?.data || err.message);
      toast.error('Error approving artisan');
    }
  }, [fetchAllArtisans, fetchUnapprovedArtisans]);

  const handleRejectArtisan = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to reject this artisan?')) {
      try {
        console.log('Rejecting artisan:', id);
        await axios.delete(`http://localhost:5000/api/v1/admin/reject-artisan/${id}`);
        toast.error('Artisan rejected ❌');
        await fetchAllArtisans();
        await fetchUnapprovedArtisans();
      } catch (err) {
        console.error('Reject artisan failed:', err.response?.status, err.response?.data);
        toast.error('Error rejecting artisan');
      }
    }
  }, [fetchAllArtisans, fetchUnapprovedArtisans]);

  return { handleApproveArtisan, handleRejectArtisan };
};

export default useArtisanActions;
