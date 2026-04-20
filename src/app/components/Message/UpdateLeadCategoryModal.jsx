import React, { useEffect, useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import { selectStyles } from "../selectStyles";

const UpdateLeadCategoryModal = ({
  isOpen,
  onClose,
  leadId,
  initialCategories = [],
  onCategoryUpdated,
  setIsSuccessModalOpen,
  setSuccessModalMessage,
}) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const categoryOptions = useMemo(
    () =>
      (categories || []).map((category) => ({
        value: category.id,
        label: category.label || category.name,
      })),
    [categories]
  );

  useEffect(() => {
    const fetchModalData = async () => {
      if (!isOpen || !leadId) return;

      setIsFetching(true);
      try {
        const categoriesRes = await axiosInstance.get("/customers/leads/categories/", {
          showLoader: false,
        });

        const fetchedCategories =
          categoriesRes?.data?.categories || categoriesRes?.data?.results || [];
        setCategories(fetchedCategories);

        const leadCategories = Array.isArray(initialCategories)
          ? initialCategories
          : [];

        const fetchedOptions = fetchedCategories.map((category) => ({
          value: category.id,
          label: category.label || category.name,
        }));

        const normalizedLeadCategories = leadCategories.map((cat) =>
          String(cat).toLowerCase()
        );

        const preselected = fetchedOptions.filter((option) =>
          normalizedLeadCategories.includes(String(option.label).toLowerCase())
        );

        const uncapturedLeadCategories = leadCategories
          .filter(
            (cat) =>
              !preselected.some(
                (option) =>
                  String(option.label).toLowerCase() ===
                  String(cat).toLowerCase()
              )
          )
          .map((category) => ({
            value: `existing-${category}`,
            label: category,
          }));

        setSelectedCategories([...preselected, ...uncapturedLeadCategories]);
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchModalData();
    // axiosInstance and handleApiError are unstable references in this codebase.
    // We intentionally fetch once per open+leadId to avoid request loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, leadId]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCategories([]);
      setCategories([]);
      setIsFetching(false);
      setIsSaving(false);
      setIsCreatingCategory(false);
    }
  }, [isOpen]);

  const handleCreateCategory = async (inputValue) => {
    const trimmedValue = String(inputValue || "").trim();
    if (!trimmedValue || isCreatingCategory) return;

    setIsCreatingCategory(true);
    try {
      const response = await axiosInstance.post("/customers/leads/categories/", {
        name: trimmedValue,
      });

      const createdCategory =
        response?.data?.category || response?.data?.data || response?.data || {};
      const newOption = {
        value:
          createdCategory?.id ??
          createdCategory?.category_id ??
          `new-${Date.now()}`,
        label:
          createdCategory?.label ||
          createdCategory?.name ||
          trimmedValue,
      };

      setCategories((prev) => {
        const exists = prev.some((cat) => {
          const label = cat?.label || cat?.name;
          return String(label).toLowerCase() === newOption.label.toLowerCase();
        });
        if (exists) return prev;
        return [
          ...prev,
          {
            ...createdCategory,
            id: newOption.value,
            label: newOption.label,
          },
        ];
      });

      setSelectedCategories((prev) => {
        const exists = prev.some(
          (item) => item.label.toLowerCase() === newOption.label.toLowerCase()
        );
        if (exists) return prev;
        return [...prev, newOption];
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSave = async () => {
    if (!leadId || isSaving) return;

    setIsSaving(true);
    const updatedCategories = [...new Set((selectedCategories || [])
      .map((category) => category?.label)
      .filter(Boolean))];
    try {
      await axiosInstance.patch(`/customers/leads/${leadId}/`, {
        categories: updatedCategories,
      });

      if (typeof setSuccessModalMessage === "function") {
        setSuccessModalMessage("Lead category has been updated successfully.");
      }
      if (typeof setIsSuccessModalOpen === "function") {
        setIsSuccessModalOpen(true);
      }
      if (typeof onCategoryUpdated === "function") {
        onCategoryUpdated({
          leadId,
          categories: updatedCategories,
        });
      }
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const footerContent = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-30"
        disabled={isSaving}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSave}
        className="w-6/12 px-4 py-2 bg-[#3EBF0F] text-white rounded-md disabled:opacity-60"
        disabled={isSaving || isFetching || isCreatingCategory}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Category"
      showFooter={true}
      footer={footerContent}
      width="500px"
    >
      <div className="space-y-3">
        <label className="text-sm block">Category</label>
        <CreatableSelect
          isMulti
          options={categoryOptions}
          value={selectedCategories}
          onChange={(selected) => setSelectedCategories(selected || [])}
          onCreateOption={handleCreateCategory}
          placeholder={isFetching ? "Loading categories..." : "Select category"}
          styles={{
            ...selectStyles,
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          maxMenuHeight={240}
          isDisabled={isFetching || isSaving || isCreatingCategory}
          isClearable={false}
        />
      </div>
    </Modal>
  );
};

export default UpdateLeadCategoryModal;
