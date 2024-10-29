import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-between items-center p-4">
      <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
      
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200 text-gray-600 hover:bg-gray-100'}`}
        >
          Previous
        </button>
        
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200 text-gray-600 hover:bg-gray-100'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
