import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const fetchAllProducts = useCallback(async () => {
    try {
      console.log("Fetching all products...");
      const res = await axios.get(
        `http://localhost:5000/api/v1/admin/products`,
      );
      setAllProducts(res.data);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to fetch all products");
    }
  }, []);

  const fetchUnapprovedProducts = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/products/unapproved",
      );
      console.log("Unapproved products:", res.data.length);
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  }, []);

  return {
    products,
    allProducts,
    fetchAllProducts,
    fetchUnapprovedProducts,
    setProducts,
    setAllProducts,
  };
};

export default useFetchProducts;
