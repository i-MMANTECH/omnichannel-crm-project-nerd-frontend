"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Upload } from "lucide-react";
import Pagination from "@/app/components/Pagination/Pagination";
import LeadToCustomer from "@/app/components/Message/LeadToCustomer";
import ImportLeadsModal from "@/app/components/admin/Leads/ImportLeadsModal";
import CreateLeadModal from "@/app/components/Leads/CreateLeadModal";
import SuccessModal from "@/app/components/SuccessModal";
import LeadsTable from "@/app/components/Leads/LeadsTable";  // ✅ IMPORT SHARED COMPONENT
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const LeadsContent = () => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [serverCount, setServerCount] = useState(null);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = useState(false);

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("page_size")) || 10;
    const search = searchParams.get("search") || "";

    setCurrentPage(page);
    setPageSize(size);
    setSearchQuery(search);
  }, [searchParams]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("page_size", String(pageSize));
        if (searchQuery) params.set("search", searchQuery);

        const { data } = await axiosInstance.get(`/customers/leads/?${params.toString()}`);
        const results = data?.results || data?.leads || [];
        const hasCount = typeof data?.count === "number";
        const count = hasCount ? data.count : results.length;

        setLeads(results);
        setServerCount(hasCount ? data.count : null);
        setTotalPages(Math.max(1, Math.ceil(count / pageSize)));
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchQuery, refreshKey]);

  useEffect(() => {
    if (isSuccessModalOpen) {
      setActiveLeadId(null);
      setRefreshKey((prev) => prev + 1);
    }
  }, [isSuccessModalOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleOpenConvertModal = (leadId) => {
    if (!leadId) return;
    setActiveLeadId(leadId);
    setIsConvertModalOpen(true);
  };

  const handleCloseConvertModal = () => {
    setIsConvertModalOpen(false);
    setActiveLeadId(null);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessModalMessage("");
  };

  const handleImportSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setIsImportModalOpen(false);
  };

  return (
    <div className="overflow-x-hidden flex flex-row body-theme min-h-[83vh] pl-10">
      <div className="relative body-theme flex-1 flex flex-col">

        {/* Search and Import Section */}
        <div className="w-[100%] max-w-[1200px] sm:max-w-full mx-auto mb-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
              <div className="relative w-72 max-w-full">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 body-theme bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-lg px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow dark:text-slate-200"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center whitespace-nowrap border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <Upload size={16} className="mr-2" />
                Import
              </button>
              <button
                type="button"
                onClick={() => setIsCreateLeadModalOpen(true)}
                className="whitespace-nowrap bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#35a509] transition-colors"
              >
                + New Lead
              </button>
            </div>
          </div>
        </div>

        {/* ✅ SHARED TABLE COMPONENT */}
        <div className="w-[100%] max-w-[1200px] sm:max-w-full mx-auto">
          <LeadsTable
            leads={leads}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            serverCount={serverCount}
            onConvertLead={handleOpenConvertModal}
          />
        </div>

        {/* Pagination */}
        <div className="mt-8 w-[100%] max-w-[1200px] sm:max-w-full mx-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSize={pageSize}
            pageParam="page"
            pageSizeParam="page_size"
          />
        </div>
      </div>

      {/* Modals */}
      <LeadToCustomer
        isOpen={isConvertModalOpen}
        onClose={handleCloseConvertModal}
        leadId={activeLeadId}
        setIsSuccessModalOpen={setIsSuccessModalOpen}
        setSuccessModalMessage={setSuccessModalMessage}
      />

      <ImportLeadsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />

      <CreateLeadModal
        isOpen={isCreateLeadModalOpen}
        onClose={() => setIsCreateLeadModalOpen(false)}
        setIsSuccessModalOpen={setIsSuccessModalOpen}
        setSuccessModalMessage={setSuccessModalMessage}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        title="Success!"
        message={successModalMessage || "Lead has been successfully converted to a customer."}
        buttonText="Okay, thank you"
        onClose={handleCloseSuccessModal}
      />
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadsContent />
    </Suspense>
  );
};

export default Page;