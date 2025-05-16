import { useRef, useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './calendar-theme.css';

const DateFilter = ({ onDateChange }) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (item) => {
    setDateRange([item.selection]);
    onDateChange(item.selection);
  };

  if (!menuOpen) return null;

  return (
    <div ref={menuRef} className="absolute right-0 mt-10 z-50 bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg">
      <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Date Range</p>
      <DateRange
        editableDateInputs={true}
        onChange={handleDateChange}
        moveRangeOnFirstSelection={false}
        ranges={dateRange}
      />
    </div>
  );
};

export default DateFilter;
