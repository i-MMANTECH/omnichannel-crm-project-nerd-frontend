import React, { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const SlaDetail = ({ isOpen, onClose, slaId }) => {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    const [loading, setLoading] = useState(false);
    const [sla, setSla] = useState(null);

    useEffect(() => {
        if (!slaId || loading) return;

        const fetchSla = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get(`/sla/${slaId}`);
                setSla(data.result);
            } catch (error) {
                handleApiError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSla();
    }, [slaId]);

    const notStartedStaff = [
        sla?.not_started_staff_1,
        sla?.not_started_staff_2,
        sla?.not_started_staff_3,
    ].filter(Boolean);

    const overdueStaff = [
        sla?.overdue_staff_1,
        sla?.overdue_staff_2,
        sla?.overdue_staff_3,
    ].filter(Boolean);

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    SLA Detail
                </div>
            }
            footer={
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 body-theme text-black rounded-md border border-gray-300"
                >
                    Close
                </button>
            }
            width="600px"
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
                </div>
            ) : sla ? (
                <div className="max-w-full">
                   <div className="mb-4 flex justify-between items-center">
                            <span className="font-medium">Title</span>
                            <span className="font-medium p-1 rounded-md">
                            {sla.title}
                            </span>
                        </div>

                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium">Description</h2>
                    </div>
                    <p className="text-sm mb-4 mt-2">{sla.description || "No description available."}</p>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Start Alert Time</span>
                            <span className="font-medium p-1 rounded-md">
                                {`${sla.not_started_hours || 0}h ${sla.not_started_minutes || 0}m`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Due Alert Time</span>
                            <span className="px-2 py-1 rounded">
                                {`${sla.overdue_hours || 0}h ${sla.overdue_minutes || 0}m`}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="mt-6">
                                <h2 className="text-lg font-medium">Task Not Started Escalation</h2>
                                {notStartedStaff.length > 0 ? (
                                    <ul className="mt-2 border border-gray-300 p-2 rounded-md">
                                        {notStartedStaff.map((staff, index) => (
                                            <li key={index} className="py-1 px-2 border-b last:border-0">
                                                {`${staff.first_name} ${staff.last_name}`}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No staff members found.</p>
                                )}
                            </div>

                            {/* Overdue Staff List */}
                            <div className="mt-6">
                                <h2 className="text-lg font-medium">Task Overdue Escalation</h2>
                                {overdueStaff.length > 0 ? (
                                    <ul className="mt-2 border border-gray-300 p-2 rounded-md">
                                        {overdueStaff.map((staff, index) => (
                                            <li key={index} className="py-1 px-2 border-b last:border-0">
                                                {`${staff.first_name} ${staff.last_name}`}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No staff members found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center py-4">No SLA detail available.</p>
            )}
        </Modal>
    );
};

export default SlaDetail;
