import { useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useProductActions = (fetchUnapprovedProducts, fetchAllProducts) => {
  const handleApproveProduct = useCallback(
    async (id) => {
      try {
        console.log("=== APPROVING PRODUCT === ID:", id);
        const response = await axios.patch(
          `http://localhost:5000/api/v1/products/approve/${id}`,
          { isApproved: true },
        );
        console.log("Approve response:", response.status, response.data);
        toast.success("Product approved ✅");
        await fetchUnapprovedProducts();
        await fetchAllProducts();
      } catch (err) {
        console.error("=== APPROVE ERROR ===");
        console.error("Status:", err.response?.status);
        console.error("Data:", err.response?.data);
        console.error("Message:", err.message);
        toast.error(
          `Error approving product (${err.response?.status || "Unknown"})`,
        );
      }
    },
    [fetchUnapprovedProducts, fetchAllProducts],
  );

  const handleRejectProduct = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to reject this product?")) {
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`);
          toast.error("Product rejected ❌");
          await fetchUnapprovedProducts();
        } catch (err) {
          toast.error("Error rejecting product");
        }
      }
    },
    [fetchUnapprovedProducts],
  );

  return { handleApproveProduct, handleRejectProduct };
};

export default useProductActions;
