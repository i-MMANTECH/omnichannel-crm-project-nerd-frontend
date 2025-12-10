import getStatusSvg from "./getStatusSvg";
import KanbanViewTaskCard from "./KanbanViewTaskCard";

export default function KanbanViewColumn({ column, tasks, handleDelete, openViewModal, openUpdateModal }) {
  const statusTasks = tasks?.filter((task) => task?.status?.name === column.status);

  return (
    <div className="flex-shrink-0 w-[280px]"> {/* Changed from 230px to 280px and added flex-shrink-0 */}
      <div
        key={column.status}
        className="flex justify-start h-10 p-2.5 items-center rounded-lg bg-gray-100 dark:bg-neutral-900 mb-3"
      >
        {getStatusSvg(column.status)}
        <div className="flex items-center gap-1">
          <h3 className="text-base ms-2">{column.title}</h3>
          <h3 className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-500 rounded ms-2">{statusTasks.length}</h3>
        </div>
      </div>

      <div className="space-y-3"> {/* Added spacing between cards */}
        {statusTasks.length > 0 ? (
          statusTasks.map((task, index) => (
            <KanbanViewTaskCard
              key={task.id || index}
              task={task}
              handleDelete={handleDelete}
              openViewModal={openViewModal}
              openUpdateModal={openUpdateModal}
            />
          ))
        ) : (
          <div className="text-gray-500 dark:text-gray-300 text-center mt-4 text-sm">
            No tasks in this category
          </div>
        )}
      </div>
    </div>
  );
}