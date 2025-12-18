'use client'

import React, { useState, useEffect } from 'react';
import Drawer from '@/app/components/Drawer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import NoDataFound from '../../NoDataFound';
import empty from "@/public/assets/empty.svg";

const PaymentMethodsDrawer = ({ show, onClose, onRoleCreated }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  useEffect(() => {
    if (show) {
      fetchPaymentMethods();
    }
  }, [show, currentPage, pageSize]);

  const initializePayment = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`/billings/payment-methods/`);
      const { authorization_url, access_code, reference, email, amount } = response.data;

      let handler = PaystackPop.setup({
          key: 'pk_live_4c73f3f9f417baa3bfd6518592e5583a7c0b78fb',    
          reference: reference,            
          email: email,
          amount: amount * 100,
          onClose: function(){
              alert('Payment cancelled')
          },
          onerror: function(error) {
              handleApiError(error)
          },
          callback: function(response) {
              axios.post(`/billings/payment-methods/verify/`, {
                  reference,
                })
                .then(() => {
                  fetchPaymentMethods()
                })
                .catch((error) => {
                  handleApiError(error)
              })
          }
      })
      handler.openIframe();
    } catch (error) {
      console.log('error is ', error)
      handleApiError(error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await axiosInstance.get(`/billings/payment-methods/`);
      setPaymentMethods(response.data.payment_methods);
    } catch (error) {
      handleApiError(error);
    }
  };

  const footerContent = (
    <div className="flex justify-start gap-3">
      <button
        type="button"
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        onClick={initializePayment}
        form="roleForm"
        className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-green-600"
      >
        Add new
      </button>
    </div>
  );

  return (
    <Drawer
      show={show}
      onClose={onClose}
      title="Payment Methods"
      width="35%"
      footer={footerContent}
    >
      <label className="block text-sm font-medium mb-2">Setup and Manage your payment methods</label>
      <div className="h-full">
        {paymentMethods.length > 0 ? (
          <div className='flex flex-col w-full h-full mt-10 pointer'>
            {paymentMethods.map((method, index) => (
              <div key={index} className='border flex py-4 rounded-lg px-5 justify-between items-center w-full body-theme mb-4'>
                <div>{method.card_number}</div>
                <div>{method.card_expiry_date}</div>

                <div className='bg-red-100 text-red-600 px-2 py-0.5 rounded pointer'>Remove</div>
              </div>
            ))              
            }            
          </div>
        ) : (
          <div className="relative top-40 flex flex-col items-center justify-center">
            <NoDataFound message="No payment methods found." icon={empty} />
            <div className="flex gap-3">
              <button
                onClick={initializePayment}
                disabled={isLoading}
                className="bg-[#3EBF0F] py-2 px-4 rounded-lg hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Add payment method'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default PaymentMethodsDrawer;