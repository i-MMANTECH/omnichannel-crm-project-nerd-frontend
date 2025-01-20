import React from "react";
import Column from "./Column";
import { DndContext } from "@dnd-kit/core";

export default function KanbanView({ tasks, setTasks, updateTask, handleDelete }) {
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

 const handleDragEnd = (event) => {
  const { active, over } = event;

  if (!over) return;

  const taskId = active.id;
  const newColumn = columns.find((column) => `${column.status}-${column.title}` === over.id);

  if (!newColumn) return;

  const updatedTask = tasks.find((task) => task.id === taskId);
  if (updatedTask) {
    let newStatus = newColumn.status;

    if (updatedTask.status.name === newStatus) {
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: { name: newStatus, label: newColumn.title } }
          : task
      )
    );

    switch (newStatus) {
      case "todo":
        newStatus = 1;
        break;
      case "overdue":
        newStatus = 4;
        break;
      case "in_progress":
        newStatus = 2;
        break;
      case "done":
        newStatus = 3;
        break;
      default:
        newStatus = 0;
    }

    updateTask(taskId, { status: newStatus });
  }
};

  return (
    <>
      <div className="flex justify-between">
        {/* <DndContext onDragEnd={handleDragEnd}> */}
          {columns.map((column, index) => (
            <Column key={index} 
              column={column} 
              tasks={tasks} 
              handleDelete={handleDelete} />
          ))}
        {/* </DndContext> */}
      </div>
    </>
  );
}
