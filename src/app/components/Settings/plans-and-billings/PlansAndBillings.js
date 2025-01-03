import React, { useState } from "react";
import "../settingsStyles.css";


const PlansAndBillings = () => {
  const [selectedPlan, setSelectedPlan] = useState("Pro");

  const plans = [
    {
      id: "Basic",
      title: "Basic",
      description: "Includes up to 5 users",
      price: "$8/Month",
      features: [
        "Up to 5 individual users",
        "3 messaging platforms",
        "Access to task management",
        "Up to 500 customer profiles",
        "Unlimited SLA tracking",
        "1GB storage",
      ],
    },
    {
      id: "Pro",
      title: "Pro",
      description: "Includes up to 20 users",
      price: "$19/Month",
      features: [
        "Up to 20 individual users",
        "Unlimited messaging platforms",
        "Advanced task management",
        "2,000 customer profiles",
        "10GB storage",
      ],
    },
    {
      id: "Enterprise",
      title: "Enterprise",
      description: "Unlimited users",
      price: "$88/Month",
      features: [
        "Unlimited users",
        "Custom & automated task management",
        "Unlimited customer profiles",
        "VIP access to support",
        "50GB storage",
      ],
    },
  ];

  return (
    <div className="overflow-x-hidden flex flex-col pr-10">
      <div className="main-container max-w-full body-theme pl-10 w-full">
        <p  className="text-md mb-2">Manage your plan and billing history</p>
        <h2 className="text-lg font-semibold mb-4">Choose a plan that is right for you</h2>
        <div className="flex justify-start gap-4 mb-10 w-full">
            {plans.map((plan) => (
                <div
                key={plan.id}
                className={`flex flex-col border rounded-lg shadow-sm body-theme p-6 flex-1 ${
                    selectedPlan === plan.id ? "border-[#3EBF0F]" : "border-gray-300"
                }`}
                >
                <h2 className="text-lg font-semibold">{plan.title}</h2>
                <p className="text-gray-500 mb-4">{plan.description}</p>
                <p className="text-3xl font-bold mb-6">
                    {plan.price}
                    <span className="text-sm font-medium">/Month</span>
                </p>
                <ul className="text-gray-500 text-sm space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                    <li key={index}>✅ {feature}</li>
                    ))}
                </ul>
                <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`${
                    selectedPlan === plan.id
                        ? "bg-[#3EBF0F] text-white"
                        : "bg-white text-[#0D0D12] hover:bg-gray-200 rounded-lg border border-[#DFE1E6]"
                    } rounded-lg py-2 px-4 font-medium`}
                >
                    {selectedPlan === plan.id ? "Selected Plan" : "Switch Plan"}
                </button>
                </div>
            ))}
        </div>


        <h2 className="text-lg font-semibold mb-4">Billing History</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg body-theme">
            <thead>
                <tr className="uppercase text-sm font-medium">
                <th className="py-3 px-6 text-left">Invoice</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Status</th>
                </tr>
            </thead>
            <tbody>
                {Array(6)
                .fill(0)
                .map((_, index) => (
                    <tr key={index} className="border-b">
                    <td className="py-3 px-6 ">Basic Plan - Nov 2024</td>
                    <td className="py-3 px-6">$8</td>
                    <td className="py-3 px-6">Oct 23</td>
                    <td className="py-3 px-6">
                        <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs">
                        Paid
                        </span>
                    </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default PlansAndBillings;