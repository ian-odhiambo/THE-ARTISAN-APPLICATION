import React from "react";
import { FaBoxOpen } from "react-icons/fa";

const AllProducts = ({ products, onApprove, onReject }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        <FaBoxOpen className="inline w-5 h-5 mr-2" />
        All Products ({products.length})
      </h3>
      {products.length === 0 ? (
        <p className="text-gray-500">No products</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 hover:shadow-xl transition-all border ${
              p.isApproved ? 'border-green-200' : 'border-yellow-200'
            }"
            >
              <span
                className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 ${
                  p.isApproved
                    ? "bg-green-100 text-green-800 dark:bg-green-900"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900"
                }`}
              >
                {p.isApproved ? "Approved" : "Pending"}
              </span>
              <img
                src={p.image || "/placeholder.jpg"}
                alt={p.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h4 className="font-bold text-lg line-clamp-1 mb-1">{p.title}</h4>
              <p className="text-sm text-gray-600 mb-1">{p.category}</p>
              <p className="text-lg font-semibold text-orange-600 mb-2">
                KSh {p.price}

              </p>
              <p className="text-sm text-gray-500 mb-3">
                Artisan: {p.artisanId?.name || "N/A"}
              </p>
              {!p.isApproved && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(p._id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(p._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
