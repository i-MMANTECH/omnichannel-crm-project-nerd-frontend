import { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  options = [],
  selected: defaultSelected = '',
  onSelect,
  width = 'w-40',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultSelected || options[0]);
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    setSelectedOption(value);
    onSelect?.(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`body-theme border px-4 py-2 rounded-md text-sm ${width} flex justify-between items-center`}
      >
        {selectedOption}
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`body-theme absolute mt-2 z-10 ${width} border border-[#DFE1E6] rounded-lg shadow-lg p-2 space-y-2 bg-white`}
        >
          {options.map((item) => (
            <div
              key={item}
              onClick={() => handleSelect(item)}
              className="hover:bg-gray-900 hover:text-white px-3 py-2 rounded cursor-pointer text-sm capitalize"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
