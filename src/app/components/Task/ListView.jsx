import React from "react";
import { DndContext } from "@dnd-kit/core";
import DroppableSection from "./DroppableSection";
import DraggableTaskCard from "./DraggableTaskCard";

const STATUS_ORDER = ["todo", "in_progress", "overdue", "done"];
const columns = [
  { title: "To Do", status: "todo" },
  { title: "Overdue", status: "overdue" },
  { title: "In Progress", status: "in_progress" },
  { title: "Done", status: "done" },
];

export default function ListView({ tasks, updateTask, setTasks, handleDelete}) {
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

  const groupedTasks = tasks?.reduce((sections, task) => {
    if (!sections[task.status.name]) {
      sections[task.status.name] = {
        status: task.status,
        tasks: [],
      };
    }
    sections[task.status.name].tasks.push(task);
    return sections;
  }, {});

  return (
    // <DndContext onDragEnd={handleDragEnd}>
      <div>
        {STATUS_ORDER.map((statusName, index) => {
          const section = groupedTasks?.[statusName];

          return (
            <DroppableSection
              key={index}
              id={`${statusName}-${columns.find(c => c.status === statusName)?.title}`}
              section={section || { status: { name: statusName, label: columns.find(c => c.status === statusName)?.title || statusName }, tasks: [] }}
            >
              {section?.tasks.length > 0 ? (
                section.tasks.map(task => (
                  <DraggableTaskCard key={task.id} task={task} handleDelete={handleDelete} />
                ))
              ) : (
                <div className="text-gray-500 text-sm italic">No tasks in this category</div>
              )}
            </DroppableSection>
          );
        })}
      </div>
    // </DndContext>
  );
}