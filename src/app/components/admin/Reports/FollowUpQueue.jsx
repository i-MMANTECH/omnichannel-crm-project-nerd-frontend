import { Search } from "lucide-react";
import React, { useState } from "react";

const FollowUpQueue = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="body-theme w-[1106px] py-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
                <h1 className="text-lg font-semibold">Follow-Up Queue</h1>
            
                <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === "all"
                                ? "bg-[#3EBF0F] text-white"
                                : "bg-white text-gray-600 hover:bg-gray-300"
                            }`}
                        >
                            All conversations
                        </button>

                        <span className="text-gray-400">|</span>

                        <button
                            onClick={() => setActiveTab("my")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === "my"
                                ? "bg-[#3EBF0F] text-white"
                                : "bg-white text-gray-600 hover:bg-gray-300"
                            }`}
                        >
                            My Queue
                        </button>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>
        </div>
    </div>
  );
};

export default FollowUpQueue;