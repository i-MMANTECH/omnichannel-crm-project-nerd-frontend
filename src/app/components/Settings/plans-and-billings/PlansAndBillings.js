'use client'

import React, { useState, useEffect } from "react";
import "../settingsStyles.css";
import PaymentMethodsDrawer from "./PaymentMethodsDrawer";
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';

const PlansAndBillings = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [billingHistory, setBillingHistory] = useState([]);
  const [plans, setPlans] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  useEffect(() => {
    fetchBillingHistory();
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const response = await axiosInstance.get('/billings/plans/');
      if (response.data.success) {
        setPlans(response.data.results);
        // Set the first plan as selected if no plan is selected
        if (!selectedPlan && response.data.results.length > 0) {
          setSelectedPlan(response.data.results[0].id);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const fetchBillingHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await axiosInstance.get('/billings/subscriptions/history/');
      if (response.data.success) {
        setBillingHistory(response.data.subscriptions);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return numPrice === 0 ? 'Free' : `$${numPrice.toFixed(2)}`;
  };

  return (
    <div className="overflow-x-hidden flex flex-col pr-10">
      <div className="main-container max-w-full body-theme pl-10 w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-md mb-3">Manage your plan and billing history</p>
            <h2 className="text-lg font-semibold mb-4">Choose a plan that is right for you</h2>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="bg-[#3EBF0F] py-2 px-4 rounded-lg hover:bg-green-600 text-white">
                Payment Methods
            </button>
          </div>
        </div>

        {isLoadingPlans ? (
          <div className="text-center py-8">Loading plans...</div>
        ) : (
          <div className="flex justify-start gap-4 mb-10 w-full">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col border rounded-lg shadow-sm body-theme p-6 flex-1 ${
                  selectedPlan === plan.id ? "border-[#3EBF0F]" : "border-gray-300"
                }`}
              >
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <p className="text-gray-500 mb-4">{plan.duration_label}</p>
                <p className="text-3xl font-bold mb-6">
                  {formatPrice(plan.price)}
                  {plan.price !== "0.00" && <span className="text-sm font-medium">/{plan.duration_label}</span>}
                </p>
                <ul className="text-gray-500 text-sm space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index}>✅ {feature}</li>
                  ))}
                  {plan.features.length === 0 && (
                    <li className="text-gray-400">No features listed</li>
                  )}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`${
                    selectedPlan === plan.id
                      ? "bg-[#3EBF0F] text-white"
                      : "bg-white text-[#0D0D12] hover:bg-gray-200 rounded-lg border border-[#DFE1E6]"
                  } rounded-lg py-2 px-4 font-medium mt-auto`}
                >
                  {selectedPlan === plan.id ? "Selected Plan" : "Switch Plan"}
                </button>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-lg font-semibold mb-4">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg body-theme">
            <thead>
              <tr className="uppercase text-sm font-medium">
                <th className="py-3 px-6 text-left">Plan</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Start Date</th>
                <th className="py-3 px-6 text-left">Expiry Date</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingHistory ? (
                <tr>
                  <td colSpan="5" className="py-4 px-6 text-center">Loading...</td>
                </tr>
              ) : billingHistory.length > 0 ? (
                billingHistory.map((subscription) => (
                  <tr key={subscription.id} className="border-b">
                    <td className="py-3 px-6">{subscription.plan.name}</td>
                    <td className="py-3 px-6">{formatPrice(subscription.plan.price)}</td>
                    <td className="py-3 px-6">{formatDate(subscription.created_at)}</td>
                    <td className="py-3 px-6">{formatDate(subscription.expires_at)}</td>
                    <td className="py-3 px-6">
                      <span 
                        className={`py-1 px-3 rounded-full text-xs ${
                          subscription.is_active 
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {subscription.is_active ? "Active" : "Expired"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 px-6 text-center">No billing history found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentMethodsDrawer 
        show={isDrawerOpen} 
        onClose={() => {
          setIsDrawerOpen(false);
        }}
      />
    </div>
  );
};

export default PlansAndBillings;