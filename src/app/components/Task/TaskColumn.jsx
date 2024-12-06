import React from "react";

const TaskColumn = ({tasks, status }) => {
  return (
    <section className="flex flex-col items-start self-stretch rounded-lg border border-[#DFE1E6] bg-white shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] p-3 w-[220px]">
      
        {tasks
          .filter((task) => task.status === status)
          .map((task, index) => (
            <div key={index} className="task_card bg-white p-2 rounded-md shadow-sm mb-2">
              <p>{task.title}</p>
            </div>
          ))}
    </section>
  );
};

export default TaskColumn;
