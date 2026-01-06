import React, { useState, useEffect } from "react";
import SlaModal from "./SlaModal";
import SlaModalUpdate from "./SlaModalUpdate";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import SlaDetail from "./SlaDetail";
import { Pencil, View } from "lucide-react";

const SlaPolicies = () => {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [slaData, setSlaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReview, setIsReview] = useState(false);
    const [slaId, setSlaId] = useState(null);

    const fetchSlaPolicies = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/sla/", {
                params: { plan_id: 1 },
            });
            setSlaData(response.data.results);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlaPolicies();
    }, []);

    const handleReview = (id) => {
        setSlaId(id);
        setIsReview(true);
    };

    const handleEdit = (id) => {
        setSlaId(id);
        setShowEditModal(true);
    };

    return (
        <>
            {/* Search and Button Wrapper */}
            <div className="mb-6 flex justify-between items-center pl-10 w-full">
                <h2 className="text-lg font-semibold mb-2">SLA Policies</h2>
                <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm w-full sm:w-auto"
                    >
                        + New SLA
                    </button>
                </div>
            </div>

            {/* SLA Modal */}
            {showModal && (
                <SlaModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    fetchSlaPolicies={fetchSlaPolicies}
                />
            )}

            {/* SLA Update Modal */}
            {showEditModal && (
                <SlaModalUpdate
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    slaId={slaId}
                    fetchSlaPolicies={fetchSlaPolicies}
                />
            )}

            {/* SLA Detail Modal */}
            {isReview && (
                <SlaDetail
                    isOpen={isReview}
                    onClose={() =>
                        setIsReview(false)}
                    slaId={slaId} />
            )}

            {/* Table Section */}
            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="body-theme px-10 overflow-auto">
                    <table className="min-w-full ">
                        <thead className="bg-gray-100 dark:bg-neutral-900">
                            <tr>
                                <th className="styled-th py-3 px-4 text-left font-semibold text-gray-600 border-b border-gray-500">SLA Name</th>
                                <th className="styled-th py-3 px-4 text-left font-semibold text-gray-600 border-b border-gray-500">Start Alert</th>
                                <th className="styled-th py-3 px-4 text-left font-semibold text-gray-600 border-b border-gray-500">Due Alert</th>
                                <th className="styled-th py-3 px-4 text-left font-semibold text-gray-600 border-b border-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slaData.map((sla) => (
                                <tr key={sla.id} className="hover:bg-gray-100 dark:hover:bg-neutral-900 cursor-pointer">
                                    <td className="py-3 px-4 border-b">{sla.title}</td>
                                    <td className="py-3 px-4 border-b">
                                        {`${sla.not_started_hours}h ${sla.not_started_minutes}m` || "N/A"}
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        {`${sla.overdue_hours}h ${sla.overdue_minutes}m` || "N/A"}
                                    </td>
                                    <td className="py-3 px-4 border-b flex gap-2">
                                        <button
                                            onClick={() => handleReview(sla.id)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded-md shadow-sm"
                                        >
                                            <View />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(sla.id)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded-md shadow-sm"
                                        >
                                            <Pencil />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default SlaPolicies;
