import React from "react";

const SuccessModal = ({ isOpen, title, message, buttonText, onClose }) => {
    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="body-theme rounded-lg shadow-lg p-6 w-full max-w-md">
                    <div className="flex justify-center mb-4">
                        <img className="w-16 h-16" src="/assets/checkmark.png" alt="Success Checkmark" />
                    </div>
                    <h2 className="text-center text-xl font-semibold">{title}</h2>
                    <p className="mt-3 text-center font-normal text-sm">
                        {message}
                    </p>

                    <div onClick={onClose} className="cursor-pointer flex mt-5 h-[52px] px-4 py-2 justify-center items-center gap-2 self-stretch rounded-lg bg-[#3EBF0F] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
                        <p className="text-white">{buttonText}</p>
                    </div>
                </div>
            </div>
        )
    );
};

export default SuccessModal;
