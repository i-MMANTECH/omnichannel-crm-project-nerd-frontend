import React from "react";
import KanbanViewColumn from "./KanbanViewColumn";

export default function KanbanView({ tasks, handleDelete, openViewModal, openUpdateModal }) {
  const columns = [
    {
      title: "To Do",
      status: "todo",
    },
    {
      title: "Overdue",
      status: "overdue",
    },
    {
      title: "In Progress",
      status: "in_progress",
    },
    {
      title: "Done",
      status: "done",
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        {columns.map((column, index) => (
          <KanbanViewColumn key={index} 
            column={column} 
            tasks={tasks} 
            handleDelete={handleDelete} 
            openViewModal={openViewModal} 
            openUpdateModal={openUpdateModal} 
          />
        ))}
      </div>
    </>
  );
}
