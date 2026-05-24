import React from "react";
import { FiUsers } from "react-icons/fi";

const AllArtisans = ({ artisans, onApprove, onReject }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        <FiUsers className="inline w-5 h-5 mr-2" />
        All Artisans ({artisans.length})
      </h3>
      {artisans.length === 0 ? (
        <p className="text-gray-500">No artisans registered</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {artisans.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isApproved
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {user.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!user.isApproved ? (
                      <>
                        <button
                          onClick={() => onApprove(user._id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onReject(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-green-600">✓ Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllArtisans;
