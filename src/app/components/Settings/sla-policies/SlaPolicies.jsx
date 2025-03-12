import React, { useState } from "react";
import SlaModal from "./SlaModal";

const SlaPolicies = () => {
    const [showModal, setShowModal] = useState(false);
    const dummyData = [
        {
        id: 1,
        name: "Ogechi Arinze",
        email: "ogechiarinze@gmail.com",
        department: "VoIP",
        startAlert: "00:20:00",
        dueAlert: "00:20:00",
        },
        {
        id: 2,
        name: "Ogechi Arinze",
        email: "ogechiarinze@gmail.com",
        department: "VoIP",
        startAlert: "00:20:00",
        dueAlert: "00:20:00",
        },
        {
        id: 3,
        name: "Ogechi Arinze",
        email: "ogechiarinze@gmail.com",
        department: "VoIP",
        startAlert: "00:20:00",
        dueAlert: "00:20:00",
        },
    ];

  return (
    <>
      {/* Search and Button Wrapper */}
      <div className="my-10 flex justify-end w-full">
        <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
          <div className="relative w-full sm:w-auto">
            <input
              className="w-full body-theme bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Search..."
            />
            <button
              className="absolute top-1 right-1 flex items-center rounded py-1 px-2.5 text-sm text-white transition-all shadow-sm hover:shadow active:bg-gray-400 dark:active:bg-black hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <button
          onClick={() => setShowModal(true)}
          className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm w-full sm:w-auto">
            + New SLA
          </button>
        </div>
      </div>

      {setShowModal && (
        <SlaModal isOpen={showModal} onClose={() => setShowModal(false)} />
      )}

      {/* Table Section */}
      <div className="overflow-auto">
        <table className="min-w-full body-theme">
          <thead className="bg-gray-100 dark:bg-neutral-900">
            <tr>
              <th className="styled-th py-3 px-4 text-left font-semibold text-gray-600 border-b border-gray-500">
                SLA Name
              </th>
              <th className="styled-th py-3 px-4 text-left font-semibold text-gray-600 border-b border-gray-500">
                Tags
              </th>
              <th className="styled-th py-3 px-4 text-left font-semibold text-gray-600 border-b border-gray-500">
                Department
              </th>
              <th className="styled-th py-3 px-4 text-left font-semibold text-gray-600 border-b border-gray-500">
                Start Alert
              </th>
              <th className="styled-th py-3 px-4 text-left font-semibold text-gray-600 border-b border-gray-500">
                Due Alert
              </th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((sla) => (
              <tr
                key={sla.id}
                className="hover:bg-gray-100 dark:hover:bg-neutral-900 cursor-pointer"
              >
                <td className="py-3 px-4 border-b">{sla.name}</td>
                <td className="py-3 px-4 border-b">{sla.email}</td>
                <td className="py-3 px-4 border-b">{sla.department}</td>
                <td className="py-3 px-4 border-b">{sla.startAlert}</td>
                <td className="py-3 px-4 border-b">{sla.dueAlert}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SlaPolicies;
