import { useState } from "react";
import ConfirmationModal from "@/app/components/ConfirmationModal";


const useCustomAlert = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const showAlert = (title, message, onConfirmCallback) => {
        setTitle(title);
        setMessage(message);
        setOnConfirm(() => () => {
            onConfirmCallback();
            closeAlert();
        });
        setIsOpen(true);
    };

    const closeAlert = () => {
        setIsOpen(false);
        setTitle("");
        setMessage("");
        setOnConfirm(() => () => {});
    };

    const AlertModal = () => (
        <ConfirmationModal
            isOpen={isOpen}
            title={title}
            message={message}
            onConfirm={onConfirm}
            onCancel={closeAlert}
        />
    );

    return { showAlert, AlertModal };
};

export default useCustomAlert; 