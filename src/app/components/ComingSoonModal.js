import React from "react";

const ComingSoonModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="body-theme rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-center text-xl font-semibold">{title}</h2>
                    <p className="mt-3 text-center font-normal text-sm">{message}</p>
                    <div className="flex mt-5 justify-center">
                        <button
                            onClick={onCancel}
                            className="px-4 w-8/12 py-2 border border-gray-300 rounded-md  hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ComingSoonModal; 