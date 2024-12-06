import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTh,
  faSort,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import KanbanView from "./KanbanView";
import ListView from "./ListView";
import TableView from "./TableView";

export default function Task() {
  const [view, setView] = useState(() => {
    const savedView = localStorage.getItem("view");
    return savedView ? savedView : "kanban";
  });

  const toggleView = () => {
    setView((prevView) => {
      const nextView = prevView === "kanban" ? "list" : prevView === "list" ? "table" : "kanban";
      localStorage.setItem("view", nextView);

      return nextView;
    });
  };

  useEffect(() => {
    localStorage.setItem("view", view);
  }, [view]);

  return (
    <div className="p-6 min-h-screen border-l-2 border-gray-100 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleView}
            className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faTh} className="text-blue-500 mr-2" />
            <span className="text-sm font-medium">
              {view === "kanban"
                ? "List View"
                : view === "list"
                ? "Table View"
                : "Kanban View"}
            </span>
          </button>
          <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
            <FontAwesomeIcon icon={faSort} className="text-gray-500 mr-2" />
            <span className="text-sm font-medium">Sort by</span>
          </button>
          <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
            <FontAwesomeIcon icon={faFilter} className="text-gray-500 mr-2" />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>
        <button className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm">
          + New Task
        </button>
      </div>

      <div className="mt-6">
        {view === "kanban" && <KanbanView />}
        {view === "list" && <ListView />}
        {view === "table" && <TableView />}
      </div>
    </div>
  );
}
