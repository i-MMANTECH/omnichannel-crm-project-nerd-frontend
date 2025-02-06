import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const Pagination = ({ currentPage, totalPages, onPageChange, onPageSizeChange, pageSize }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateURL = (page, limit) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", page);
    newParams.set("limit", limit);
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
    updateURL(page, pageSize);
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    onPageSizeChange(newSize);
    updateURL(currentPage, newSize);
  };

  const getPageNumbers = () => {
    const pages = [];
    pages.push(1);

    if (totalPages <= 5) {
      for (let i = 2; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(2, 3);
        if (totalPages > 4) pages.push("...");
      } else if (currentPage >= totalPages - 2) {
        pages.push("...", totalPages - 3, totalPages - 2);
      } else {
        pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...");
      }
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto scrollbar-hide">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-[#0D0D12] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'} border-[#C1C7CF]`}
        >
          {'<'}
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            className={`px-3 py-1 rounded-md border ${page === currentPage ? 'bg-[#3EBF0F] text-white' : 'bg-white dark:bg-gray-800 text-[#0D0D12] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'} border-[#C1C7CF]`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md border ${currentPage === totalPages ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-[#0D0D12] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'} border-[#C1C7CF]`}
        >
          {'>'}
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-gray-600 dark:text-gray-300">Show</span>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="px-2 py-1 border border-[#C1C7CF] rounded-md bg-white dark:bg-gray-800 text-[#0D0D12] dark:text-white"
        >
          {[8, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span className="text-gray-600 dark:text-gray-300">entries</span>
      </div>
    </div>
  );
};

export default Pagination;
