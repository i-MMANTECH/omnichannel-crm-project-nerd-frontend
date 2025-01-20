import { useDroppable } from "@dnd-kit/core";
import getStatusSvg from "./getStatusSvg";
import TaskCard from "./TaskCard";

export default function Column({ column, tasks, handleDelete }) {
  const { setNodeRef } = useDroppable({ id: `${column.status}-${column.title}` });
  const statusTasks = tasks?.filter((task) => task?.status?.name === column.status);

  return (
    <div>
      <div
        key={column.status}
        className="flex justify-start w-[230px] h-10 p-2.5 items-center rounded-lg bg-gray-100 dark:bg-neutral-900"
      >
        {getStatusSvg(column.status)}
        <div className="flex items-center gap-1">
          <h3 className="text-lg ms-2">{column.title}</h3>
          <h3 className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-500 rounded ms-2">{statusTasks.length}</h3>
        </div>
      </div>

      <div ref={setNodeRef}>
        {statusTasks.length > 0 ? (
          statusTasks.map((task, index) => (
            <TaskCard key={task.id || index} task={task} handleDelete={handleDelete} />
          ))
        ) : (
          <div className="text-gray-500 text-center mt-4">No tasks in this category</div>
        )}
      </div>
    </div>
  );
}
