import React from "react";
import { FiClock, FiCheck, FiX } from "react-icons/fi";

const PendingArtisans = ({ artisans, onApprove, onReject }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        <FiClock className="inline w-5 h-5 mr-2" />
        Pending Artisan Approvals ({artisans.length})
      </h3>
      {artisans.length === 0 ? (
        <p className="text-gray-500">No pending artisans</p>
      ) : (
        <ul className="space-y-4">
          {artisans.map((user) => (
            <li
              key={user._id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition-all border border-yellow-200 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1">
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 mb-2">
                  Pending
                </span>
                <h4 className="font-bold text-xl mb-1">{user.name}</h4>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(user._id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  <FiCheck className="inline w-4 h-4 mr-2" /> Approve
                </button>
                <button
                  onClick={() => onReject(user._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  <FiX className="inline w-4 h-4 mr-2" /> Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingArtisans;
