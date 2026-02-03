"use client";

import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import Modal from '@/app/components/Modal';

const ImportCustomersModal = ({ isOpen, onClose, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [importMode, setImportMode] = useState('skip'); // 'skip' or 'update'
    const [importResult, setImportResult] = useState(null);
    const [errors, setErrors] = useState(null);
    const fileInputRef = useRef(null);

    const { axiosInstance } = useApi();
    const { handleApiError } = useError();

    const handleDownloadTemplate = async () => {
        try {
            const response = await axiosInstance.get('/customers/import/template/?download=1', {
                responseType: 'blob',
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'customer_import_template.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleFileSelect = (file) => {
        // Validate file type
        const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/csv'];
        if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
            setErrors({ file: 'Please upload a CSV file' });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors({ file: 'File size must be less than 5MB' });
            return;
        }

        setSelectedFile(file);
        setErrors(null);
        setImportResult(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleImport = async () => {
        if (!selectedFile) {
            setErrors({ file: 'Please select a file to import' });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setErrors(null);
        setImportResult(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axiosInstance.post(
                `/customers/import/?mode=${importMode}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            setImportResult(response.data);
            setIsUploading(false);

            // If successful, wait a bit to show the success message, then close and refresh
            if (response.data.success) {
                setTimeout(() => {
                    onSuccess();
                    handleClose();
                }, 2000);
            }
        } catch (error) {
            setIsUploading(false);
            setUploadProgress(0);

            if (error.response?.data) {
                setErrors(error.response.data);
            } else {
                handleApiError(error);
            }
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setIsDragging(false);
        setIsUploading(false);
        setUploadProgress(0);
        setImportResult(null);
        setErrors(null);
        onClose();
    };

    const removeFile = () => {
        setSelectedFile(null);
        setErrors(null);
        setImportResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Custom footer with buttons
    const footer = (
        <>
            <button
                onClick={handleClose}
                disabled={isUploading}
                className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={handleImport}
                disabled={!selectedFile || isUploading || (importResult && importResult.success)}
                className="px-4 py-2 bg-[#3EBF0F] hover:bg-[#35a509] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isUploading ? 'Importing...' : 'Import Customers'}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Import Customers"
            footer={footer}
        >
            {/* Subtitle */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Upload a CSV file to bulk import customers
            </p>

            <div className="space-y-6">
                {/* Download Template Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <FileText className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" size={20} />
                        <div className="flex-1">
                            <h3 className="font-medium text-blue-900 dark:text-blue-100">
                                Download Template
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                Download the CSV template with required columns and sample data
                            </p>
                            <button
                                onClick={handleDownloadTemplate}
                                className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                            >
                                <Download size={16} className="mr-2" />
                                Download Template
                            </button>
                        </div>
                    </div>
                </div>

                {/* Import Mode Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Import Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setImportMode('skip')}
                            disabled={isUploading}
                            className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${importMode === 'skip'
                                ? 'border-[#3EBF0F] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                : 'border-gray-300 dark:border-neutral-600 hover:border-gray-400 dark:hover:border-neutral-500'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <div className="font-semibold">Skip Duplicates</div>
                            <div className="text-xs mt-1 opacity-75">
                                Skip existing customers
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setImportMode('update')}
                            disabled={isUploading}
                            className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${importMode === 'update'
                                ? 'border-[#3EBF0F] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                : 'border-gray-300 dark:border-neutral-600 hover:border-gray-400 dark:hover:border-neutral-500'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <div className="font-semibold">Update Existing</div>
                            <div className="text-xs mt-1 opacity-75">
                                Update duplicate customers
                            </div>
                        </button>
                    </div>
                </div>

                {/* File Upload Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Upload CSV File
                    </label>

                    {!selectedFile ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging
                                ? 'border-[#3EBF0F] bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-300 dark:border-neutral-600 hover:border-gray-400 dark:hover:border-neutral-500'
                                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Upload
                                size={48}
                                className="mx-auto mb-4 text-gray-400 dark:text-neutral-500"
                            />
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <span className="font-medium text-[#3EBF0F]">
                                    Click to upload
                                </span>{' '}
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                CSV files only (max 5MB)
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,text/csv,application/csv"
                                onChange={handleFileInputChange}
                                className="hidden"
                                disabled={isUploading}
                            />
                        </div>
                    ) : (
                        <div className="border border-gray-300 dark:border-neutral-600 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <FileText className="text-[#3EBF0F] flex-shrink-0" size={24} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {(selectedFile.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                </div>
                                {!isUploading && (
                                    <button
                                        onClick={removeFile}
                                        className="ml-3 text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex-shrink-0"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Upload Progress */}
                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                                {uploadProgress}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                            <div
                                className="bg-[#3EBF0F] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Error Messages */}
                {errors && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <h4 className="font-medium text-red-900 dark:text-red-100">
                                    Import Failed
                                </h4>
                                {errors.file && (
                                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                        {errors.file}
                                    </p>
                                )}
                                {errors.errors && Array.isArray(errors.errors) && (
                                    <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-300">
                                        {errors.errors.slice(0, 5).map((error, index) => (
                                            <li key={index}>• {error}</li>
                                        ))}
                                        {errors.errors.length > 5 && (
                                            <li className="font-medium">
                                                ... and {errors.errors.length - 5} more errors
                                            </li>
                                        )}
                                    </ul>
                                )}
                                {errors.error && (
                                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                        {errors.error}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {importResult && importResult.success && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <CheckCircle2 className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <h4 className="font-medium text-green-900 dark:text-green-100">
                                    Import Successful!
                                </h4>
                                <div className="mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                                    {importResult.created > 0 && (
                                        <p>✓ {importResult.created} customers imported</p>
                                    )}
                                    {importResult.updated > 0 && (
                                        <p>✓ {importResult.updated} customers updated</p>
                                    )}
                                    {importResult.skipped > 0 && (
                                        <p>⊘ {importResult.skipped} customers skipped</p>
                                    )}
                                    {importResult.failed > 0 && (
                                        <p className="text-red-600 dark:text-red-400">
                                            ✗ {importResult.failed} customers failed
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ImportCustomersModal;