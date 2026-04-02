import React, { useState } from 'react';
import Drawer from '@/app/components/Drawer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import { toast } from 'react-toastify';

const CreateCategoryDrawer = ({ show, onClose, onCategoryCreated, moduleType = "tickets" }) => {
  const [categoryName, setCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post(`/${moduleType}/categories/`, {
        name: categoryName.trim(),
      });

      toast.success("Category created successfully");
      onCategoryCreated();
      handleClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCategoryName("");
    onClose();
  };

  const footerContent = (
    <div className="flex justify-start gap-3">
      <button
        type="button"
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={handleClose}
        disabled={submitting}
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        disabled={submitting}
      >
        {submitting ? "Creating..." : "Create"}
      </button>
    </div>
  );

  return (
    <Drawer
      show={show}
      onClose={handleClose}
      title="Create New Category"
      width="35%"
      footer={footerContent}
    >
      <form id="categoryForm" onSubmit={handleSubmit} className="py-2">
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">
            Category Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2 body-theme"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
      </form>
    </Drawer>
  );
};

export default CreateCategoryDrawer;
