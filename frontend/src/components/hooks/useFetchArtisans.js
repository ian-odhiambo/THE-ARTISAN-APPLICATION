// import { useState, useCallback } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const useFetchArtisans = () => {
//   const [allArtisans, setAllArtisans] = useState([]);

//   const fetchAllArtisans = useCallback(async () => {
//     try {
//       console.log(
//         "Fetching all artisans from: http://localhost:5000/api/v1/admin/artisans",
//       );
//       const res = await axios.get(
//         "http://localhost:5000/api/v1/admin/artisans",
//       );
//       console.log("Artisans loaded:", res.data.length);
//       setAllArtisans(res.data);
//     } catch (err) {
//       console.error(
//         "All artisans fetch failed:",
//         err.response?.status,
//         err.message,
//       );
//       toast.error("Failed to fetch all artisans");
//     }
//   }, []);

//   return { allArtisans, fetchAllArtisans, setAllArtisans };
// };

// export default useFetchArtisans;
