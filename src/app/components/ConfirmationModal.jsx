import React from "react";

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="body-theme rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-center text-xl font-semibold">{title}</h2>
                    <p className="mt-3 text-center font-normal text-sm">{message}</p>
                    <div className="flex justify-between mt-5">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md  hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 ml-2 px-4 py-2 bg-[#3EBF0F] text-white rounded-md hover:bg-green-600"
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ConfirmationModal;  