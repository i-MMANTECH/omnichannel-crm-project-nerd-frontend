// ExportTasksModal.jsx
"use client";

import React, { useState } from "react";
import { X, Download, Calendar } from "lucide-react";

const ExportTasksModal = ({ isOpen, onClose, onExport }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleExport = async () => {
        // Validate dates
        if (!startDate || !endDate) {
            setError("Please select both start and end dates");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError("Start date cannot be after end date");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            await onExport(startDate, endDate);
            // Reset form after successful export
            setStartDate("");
            setEndDate("");
            onClose();
        } catch (err) {
            setError("Failed to export tasks. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStartDate("");
        setEndDate("");
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-[#3EBF0F]" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Export Tasks
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Select a date range to export your tasks as a CSV file.
                    </p>

                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] dark:bg-gray-700 dark:text-white"
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] dark:bg-gray-700 dark:text-white"
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isLoading}
                        className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-[#35a00d] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Export CSV
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportTasksModal;