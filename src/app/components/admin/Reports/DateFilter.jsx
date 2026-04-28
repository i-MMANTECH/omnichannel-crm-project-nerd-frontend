import { useRef, useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './calendar-theme.css';

const DateFilter = ({ onDateChange, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        if (typeof onClose === 'function') {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const onRangeChange = ({ selection }) => {
    setRange([selection]);
    onDateChange(selection);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute right-0 mt-10 z-50 bg-white p-4 rounded-md shadow-lg"
    >
      <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
        Date Range
      </p>
      <DateRange
        editableDateInputs
        onChange={onRangeChange}
        moveRangeOnFirstSelection={false}
        ranges={range}
      />
    </div>
  );
};

export default DateFilter;
