import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";

const NotesModal = ({ 
  isOpen, 
  onClose, 
  conversationId, 
  setIsSuccessModalOpen, 
  setSuccessModalMessage 
}) => {
  const [note, setNote] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const { axiosInstance, loading } = useApi();

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const handleSaveNote = async () => {
    if (!note.trim()) return;

    try {
      const payload = {
        model: "conversation",
        object_id: conversationId,
        content: note,
        // tag: selectedTag,
      };

      await axiosInstance.post("/comments/", payload);
      setSuccessModalMessage("Note has been added successfully");
      setIsSuccessModalOpen(true);
      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const footerContent = (
    <>
      <button
        onClick={onClose}
        className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-30"
      >
        Cancel
      </button>
      <button
        onClick={handleSaveNote}
        disabled={!note.trim()}
        className={`w-6/12 px-4 py-2 rounded-md ${!note.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-[#3EBF0F] text-white"}`}
      >
        Save
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notes"
      showFooter={true}
      footer={footerContent}
      width="500px"
    >
      <div className="modal-body">
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Add notes"
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg mt-4 body-theme"
        />

        <div className="mt-4 body-theme hidden">
          <label htmlFor="tag-select" className="block text-sm font-medium">
            Add Tag
          </label>
          <select
            id="tag-select"
            value={selectedTag}
            onChange={handleTagChange}
            className="mt-2 body-theme block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a tag</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default NotesModal;
