import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

const TasksReport = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const router = useRouter();


  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="mt-6">
      <h2 className="font-semibold text-lg">Tasks Report</h2>
    </div>
  );
};

export default TasksReport;
