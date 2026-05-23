// import { useState, useEffect } from 'react';
// import useFetchArtisans from './useFetchArtisans';
// import useFetchProducts from './useFetchProducts';
// import useFetchStats from './useFetchStats';
// import useArtisanActions from './useArtisanActions';
// import useProductActions from './useProductActions';

// const useAdminData = () => {
//   const [loading, setLoading] = useState(false);

//   const { allArtisans, fetchAllArtisans, setAllArtisans } = useFetchArtisans();
//   const { 
//     products, 
//     allProducts, 
//     fetchAllProducts, 
//     fetchUnapprovedProducts,
//     setProducts,
//     setAllProducts
//   } = useFetchProducts();
//   const { stats, fetchStats, setStats } = useFetchStats();

//   // Fetch unapproved artisans separately since it's a specific endpoint
//   const [unapprovedArtisans, setUnapprovedArtisans] = useState([]);
//   const fetchUnapprovedArtisans = async () => {
//     try {
//       console.log('Fetching unapproved artisans...');
//       const res = await fetch('http://localhost:5000/api/v1/admin/unapproved-artisans');
//       const data = await res.json();
//       setUnapprovedArtisans(data);
//     } catch (err) {
//       console.error('Fetch unapproved artisans error:', err);
//     }
//   };

//   const { handleApproveArtisan, handleRejectArtisan } = useArtisanActions(
//     fetchAllArtisans,
//     fetchUnapprovedArtisans
//   );
//   const { handleApproveProduct, handleRejectProduct } = useProductActions(
//     fetchUnapprovedProducts,
//     fetchAllProducts
//   );

//   // Load all data on mount
//   useEffect(() => {
//     const loadAllData = async () => {
//       setLoading(true);
//       await Promise.all([
//         fetchUnapprovedProducts(),
//         fetchUnapprovedArtisans(),
//         fetchAllArtisans(),
//         fetchAllProducts(),
//         fetchStats()
//       ]);
//       setLoading(false);
//     };
//     loadAllData();
//   }, []);

//   return {
//     // State
//     products,
//     allProducts,
//     allArtisans,
//     unapprovedArtisans,
//     stats,
//     loading,
//     // Setters
//     setProducts,
//     setAllProducts,
//     setAllArtisans,
//     setUnapprovedArtisans,
//     setStats,
//     // Fetchers
//     fetchAllArtisans,
//     fetchAllProducts,
//     fetchUnapprovedProducts,
//     fetchUnapprovedArtisans,
//     fetchStats,
//     // Actions
//     handleApproveArtisan,
//     handleRejectArtisan,
//     handleApproveProduct,
//     handleRejectProduct
//   };
// };

// export default useAdminData;
