import { useDroppable } from "@dnd-kit/core";
import getStatusSvg from "./getStatusSvg";

export default function DroppableSection({ id, section, children }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="mb-7">
      <div className="w-full mb-4 flex h-9 p-2 gap-2 items-center rounded-lg bg-gray-100 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          {getStatusSvg(section.status.name)}
        </div>
        {section.status.label}{" "}
        <span className="text-sm text-gray-500">({section.tasks.length})</span>
      </div>
      {children}
    </div>
  );
}
