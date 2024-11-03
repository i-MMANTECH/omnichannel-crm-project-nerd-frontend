import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, onPageSizeChange, pageSize }) => {
  
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 3) pages.push(1, 2, 3, '...');
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i > 3 && i < totalPages - 2) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...', totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-between items-center p-4">
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-white text-[#0D0D12] hover:bg-gray-100'} border-[#C1C7CF]`}
        >
          {'<'}
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`px-3 py-1 rounded-md border ${page === currentPage ? 'bg-[#3EBF0F] text-white' : 'bg-white text-[#0D0D12] hover:bg-gray-100'} border-[#C1C7CF}`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md border ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-white text-[#0D0D12] hover:bg-gray-100'} border-[#C1C7CF]`}
        >
          {'>'}
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-gray-600">Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2 py-1 border border-[#C1C7CF] rounded-md bg-white text-[#0D0D12]"
        >
          {[8, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span className="text-gray-600">entries</span>
      </div>
    </div>
  );
};

export default Pagination;
