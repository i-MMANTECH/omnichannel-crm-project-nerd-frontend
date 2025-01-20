import React, { useState } from "react";

const PricingPlans = () => {
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
        "Access to agent performance dashboard",
        "Advanced reporting and analytics",
        "Up to 2GB storage",
        "Standard access to support"
      ],
    },
    {
      id: "Pro",
      title: "Pro",
      description: "Includes up to 20 users",
      price: "$19/Month",
      features: [
        "Up to 20 individual users",
        "Unlimited",
        "Access to task management",
        "Up to 2,000 customer profiles",
        "Unlimited SLA tracking",
        "Access to agent performance dashboard",
        "Advanced reporting and analytics",
        "Up to 10GB storage",
        "Premium access to support"
      ],
    },
    {
      id: "Enterprise",
      title: "Enterprise",
      description: "Unlimited users",
      price: "$88/Month",
      features: [
        "Unlimited users",
        "Unlimited messaging platforms",
        "Custom & automated task management",
        "Unlimited customer profiles",
        "Unlimited SLA tracking",
        "Access to agent performance dashboard",
        "Custom reporting and analytics",
        "Up to 50GB storage (Customizable)",
        "VIP access to support",
      ],
    },
  ];

  return (
    <div className="p-6">
      <h1 className="">Manage your plan and billing history</h1>
      <h1 className="text-2xl font-semibold mb-6">Choose a plan that is right for you</h1>

      <div className="flex justify-center gap-6 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col border rounded-lg shadow-sm bg-white p-6 w-[320px] ${
              selectedPlan === plan.id ? "border-[#3EBF0F]" : "border-gray-300"
            }`}
          > 
            <div
              className={`flex justify-center items-center w-8 h-8 rounded-full border shadow-inner shadow-sm ${
                selectedPlan === plan.id
                  ? "bg-[#3EBF0F] border-[#30A808]"
                  : "bg-white border-[#DFE1E6]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 20 20"
                fill="none"
                className="w-5 h-5"
              >
                <path
                  d="M10.5733 5.38504C10.3597 4.87165 9.63229 4.87165 9.41871 5.38504L8.43153 7.75788C8.34206 7.97291 8.14045 8.12039 7.90837 8.14056L5.57197 8.34365C5.03584 8.39025 4.80515 9.04721 5.19449 9.41863L6.96921 11.1117C7.13014 11.2652 7.19736 11.4926 7.14575 11.7089L6.54472 14.2279C6.41567 14.7688 7.00419 15.1962 7.47882 14.9064L9.6701 13.5684C9.87019 13.4462 10.1218 13.4462 10.3219 13.5684L12.5132 14.9064C12.9878 15.1962 13.5764 14.7688 13.4473 14.2279L12.8465 11.7097C12.7948 11.493 12.8624 11.2651 13.0239 11.1116L14.8046 9.41947C15.1952 9.04837 14.9647 8.39017 14.4279 8.34364L12.0838 8.14048C11.8516 8.12036 11.65 7.97286 11.5605 7.75778L10.5733 5.38504Z"
                  stroke={selectedPlan === plan.id ? "white" : "#808897"}
                  strokeWidth="1.66667"
                />
              </svg>
            </div>

            <h2 className="text-lg font-semibold">{plan.title}</h2>
            <p className="text-gray-500 mb-4">{plan.description}</p>
            <p className="text-3xl font-bold mb-6">
              {plan.price}
              <span className="text-sm font-medium">/Month</span>
            </p>
            <ul className="text-gray-500 text-sm space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li className="flex items-center space-x-2" key={index}><svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 14 15" fill="none">
                  <g clipPath="url(#clip0_466_13767)">
                    <path 
                      d="M4.37484 7.79102L6.12484 9.54102L9.62484 6.04102M6.99984 13.3327C3.77818 13.3327 1.1665 10.721 1.1665 7.49935C1.1665 4.27769 3.77818 1.66602 6.99984 1.66602C10.2215 1.66602 12.8332 4.27769 12.8332 7.49935C12.8332 10.721 10.2215 13.3327 6.99984 13.3327Z" 
                      stroke="#808897" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_466_13767">
                      <rect width="14" height="14" fill="white" transform="translate(0 0.5)" />
                    </clipPath>
                  </defs>
                </svg>
                <span>{feature}</span>
               </li>
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
        <table className="min-w-full border rounded-lg bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm font-medium">
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
                  <td className="py-3 px-6 text-gray-700">Basic Plan - Nov 2024</td>
                  <td className="py-3 px-6 text-gray-700">$8</td>
                  <td className="py-3 px-6 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 20 20" 
                        fill="none" 
                        className="flex-shrink-0"
                      >
                        <path 
                          d="M6.66667 2.49935H5C3.61929 2.49935 2.5 3.61864 2.5 4.99935V7.49935M6.66667 2.49935V1.66602M6.66667 2.49935H13.3333M6.66667 2.49935V3.33268M13.3333 2.49935H15C16.3807 2.49935 17.5 3.61864 17.5 4.99935V7.49935M13.3333 2.49935V1.66602M13.3333 2.49935V3.33268M2.5 7.49935V15.8327C2.5 17.2134 3.61929 18.3327 5 18.3327H15C16.3807 18.3327 17.5 17.2134 17.5 15.8327V7.49935M2.5 7.49935H17.5M11.25 10.416H13.75L11.6667 14.5827M8.75 11.666V13.3327C8.75 14.023 8.19036 14.5827 7.5 14.5827C6.80964 14.5827 6.25 14.023 6.25 13.3327V11.666C6.25 10.9757 6.80964 10.416 7.5 10.416C8.19036 10.416 8.75 10.9757 8.75 11.666Z" 
                          stroke="#808897" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                      </svg>
                      <span>Oct 23</span>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <span style={{width:"50px"}} className="flex items-center space-x-1 bg-[#E7FEF8] text-[#40C4AA] py-1 px-2 rounded-lg text-xs">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          style={{ flexShrink: 0 }}
                        >
                          <path
                            d="M4.375 7.29167L6.125 9.04167L9.625 5.54167M10.5 1.75H3.5C2.5335 1.75 1.75 2.5335 1.75 3.5V10.5C1.75 11.4665 2.5335 12.25 3.5 12.25H10.5C11.4665 12.25 12.25 11.4665 12.25 10.5V3.5C12.25 2.5335 11.4665 1.75 10.5 1.75Z"
                            stroke="#40C4AA"
                            strokeWidth="1.11"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Paid</span>
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingPlans;
