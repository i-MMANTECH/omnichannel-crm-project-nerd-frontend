import TaskCardListView from "./TaskCardListView";
import { useDraggable } from "@dnd-kit/core";

export default function DraggableTaskCard({ task, handleDelete}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-2">
      <TaskCardListView
        title={task.title}
        date={task.updated_at}
        priority={task.priority.label}
        assignees={task.assignees}
        status={task.status.label}
        taskId={task.id}
        handleDelete={handleDelete}
      />
    </div>
  );
}
