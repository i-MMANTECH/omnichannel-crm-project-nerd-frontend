import React, { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import SuccessModal from "@/app/components/SuccessModal";

const SlaModalUpdate = ({ isOpen, onClose, fetchSlaPolicies, slaId }) => {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
  
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [users, setUsers] = useState([]);
    const [sla, setSla] = useState(null);
    const [isFetching, setIsFetching] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        department: "",
        not_started_hours: 0,
        not_started_minutes: 0,
        not_started_staff_1: "", 
        not_started_staff_2: "", 
        not_started_staff_3: "", 
        overdue_hours: 0,
        overdue_minutes: 0,
        overdue_staff_1: "", 
        overdue_staff_2: "", 
        overdue_staff_3: "", 
        });

    useEffect(() => {
        if (!slaId || isFetching) return;
      
        const fetchSla = async () => {
          setIsFetching(true);
          try {
            const { data } = await axiosInstance.get(`/sla/${slaId}`);
            setSla(data.result);
          } catch (error) {
            handleApiError(error);
          } finally {
            setIsFetching(false);
          }
        };
      
        const fetchUsers = async () => {
          try {
            const res = await axiosInstance.get("/users/");
            setUsers(res.data.results);
          } catch (error) {
            handleApiError(error);
          }
        };
      
        fetchSla();
        fetchUsers();
      }, [slaId]);
      
    useEffect(() => {
        if (sla) {
          setFormData({
            title: sla.title || "",
            department: sla.department || "",
            not_started_hours: sla.not_started_hours || 0,
            not_started_minutes: sla.not_started_minutes || 0,
            not_started_staff_1: sla.not_started_staff_1?.id || "", 
            not_started_staff_2: sla.not_started_staff_2?.id || "", 
            not_started_staff_3: sla.not_started_staff_3?.id || "", 
            overdue_hours: sla.overdue_hours || 0,
            overdue_minutes: sla.overdue_minutes || 0,
            overdue_staff_1: sla.overdue_staff_1?.id || "", 
            overdue_staff_2: sla.overdue_staff_2?.id || "", 
            overdue_staff_3: sla.overdue_staff_3?.id || "", 
          });
        }
    }, [sla]);  
  
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!slaId || loading) return;

        setLoading(true);

        try {
        await axiosInstance.put(`/sla/${slaId}/`, formData);
        setShowSuccess(true);
        } catch (error) {
        handleApiError(error);
        } finally {
            setLoading(false); 
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        fetchSlaPolicies();
        onClose();
      };

    if (!isOpen) return null;

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onClose={onClose} 
                footer={<Footer onClose={onClose} handleSubmit={handleSubmit} loading={loading} />} 
                title="Update SLA">

                {isFetching ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">SLA Title</h3>
                    <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Edit SLA policy name"
                    className="w-full p-3 border rounded-[10px] mb-3 bg-white dark:bg-gray-700 dark:text-white shadow-sm border-[#DFE1E6]"
                    />

                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Escalation Matrix</h3>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                    {[
                        { label: "Task not started escalation", hourKey: "not_started_hours", minKey: "not_started_minutes" },
                        { label: "Task overdue escalation", hourKey: "overdue_hours", minKey: "overdue_minutes" },
                    ].map((item, index) => (
                        <EscalationInput key={index} label={item.label} hourKey={item.hourKey} minKey={item.minKey} formData={formData} handleChange={handleChange} />
                    ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <StaffSelection title="Not Started Staff" users={users} formData={formData} handleChange={handleChange} prefix="not_started" />
                    <StaffSelection title="Overdue Staff" users={users} formData={formData} handleChange={handleChange} prefix="overdue" />
                    </div>
                </form>
                )}
            </Modal>

            <SuccessModal isOpen={showSuccess} title="Success" message="SLA policy updated successfully!" buttonText="Okay, thank you." onClose={handleSuccessClose} />
        </>
        );
    };

    const Footer = ({ onClose, handleSubmit, loading }) => (
        <div className="flex justify-between w-full">
        <button 
            className="flex w-[110px] h-[44px] px-3 py-2 justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme" 
            onClick={onClose}
        >
            Cancel
        </button>
        <button
            disabled={loading}
            className={`flex w-[110px] h-[44px] px-3 py-2 justify-center items-center gap-2 rounded-[10px] 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#3EBF0F] shadow-sm text-white"}`}
            onClick={handleSubmit}
        >
            {loading ? "Updating..." : "Update SLA"}
        </button>
        </div>
    );

    const EscalationInput = ({ label, hourKey, minKey, formData, handleChange }) => (
    <div>
        <p className="text-gray-700 dark:text-gray-300 mb-1">{label}</p>
        <div className="flex gap-2">
        <input
            type="number"
            name={hourKey}
            value={formData[hourKey] || ""}
            onChange={handleChange}
            className="w-[90px] h-[42px] p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white"
            placeholder="0 hrs"
            min="0"
        />
        <input
            type="number"
            name={minKey}
            value={formData[minKey] || ""}
            onChange={handleChange}
            className="w-[90px] h-[42px] p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white"
            placeholder="0 mins"
            min="0"
            max="59"
        />
        </div>
    </div>
    );

    const StaffSelection = ({ title, users, formData, handleChange, prefix }) => {
        return (
            <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
                {[1, 2, 3].map((level) => {
                    const fieldName = `${prefix}_staff_${level}`;
                    const prefilledUser = users.find(user => user.id == formData[fieldName]);
    
                    return (
                        <select
                            key={level}
                            name={fieldName}
                            value={formData[fieldName] || ""}
                            onChange={handleChange}
                            className="mt-2 w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">
                                {prefilledUser ? `${prefilledUser.first_name} ${prefilledUser.last_name}` : `Select Level ${level} Staff`}
                            </option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name}
                                </option>
                            ))}
                        </select>
                    );
                })}
            </div>
        );
    };

    export default SlaModalUpdate;
