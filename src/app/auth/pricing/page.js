'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [selectedPlan, setSelectedPlan] = useState('Pro');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const plans = [
        {
            name: 'Basic',
            price: 8,
            description: 'Includes up to 5 users',
            features: {
                users: 'Up to 5',
                managingPlatforms: '3',
                taskManagement: 'Yes',
                customerProfiles: '500',
                slaTracking: 'Unlimited',
                performanceDashboard: 'Yes',
                analytics: 'Yes',
                storage: '2GB',
                support: 'Standard'
            }
        },
        {
            name: 'Pro',
            price: 19,
            description: 'Includes up to 20 users',
            features: {
                users: 'Up to 20',
                managingPlatforms: 'Unlimited',
                taskManagement: 'Yes',
                customerProfiles: '2,000',
                slaTracking: 'Unlimited',
                performanceDashboard: 'Yes',
                analytics: 'Yes',
                storage: '10GB',
                support: 'Premium'
            }
        },
        {
            name: 'Enterprise',
            price: 88,
            description: 'Unlimited users',
            features: {
                users: 'Unlimited',
                managingPlatforms: 'Unlimited',
                taskManagement: 'Custom & Automated',
                customerProfiles: 'Unlimited',
                slaTracking: 'Unlimited',
                performanceDashboard: 'Yes (Advanced)',
                analytics: 'Custom & Real',
                storage: '50GB (Customized)',
                support: 'VIP'
            }
        }
    ];

    const toggleBilling = (cycle) => {
        setBillingCycle(cycle);
    };

    const openModal = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <img className='m-5' src='../../assets/logo.png' alt="Logo" style={{ width: '150px', height: 'auto' }} />
            <div style={{ width: '60%' }} className="max-w-5xl mx-auto p-8 bg-white">
                <p className='pl-4 text-Greyscale/100'>Nativetalk Pricing</p>

                <div
                    style={{ borderBottom: '2px solid #D1D5DB' }}
                    className="flex justify-between items-center mb-8 p-4"
                >
                    <h2 className="text-2xl font-bold text-left mb-6">
                        Choose a plan that is right for you
                    </h2>
                    <div>
                        <button
                            onClick={() => toggleBilling('monthly')}
                            className={`px-4 py-2 text-sm font-medium ${
                                billingCycle === 'monthly'
                                    ? 'bg-[#3EBF0F] text-white rounded-md'
                                    : 'bg-[#F8F9FB] text-gray-500 rounded'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => toggleBilling('yearly')}
                            className={`px-4 py-2 text-sm font-medium ${
                                billingCycle === 'yearly'
                                    ? 'bg-[#3EBF0F] text-white rounded-md'
                                    : 'bg-[#F8F9FB] text-gray-500 rounded'
                            }`}
                        >
                            Yearly
                        </button>
                    </div>
                </div>

               {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-8"> 
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            style={{
                                width: '238.67px',
                                height: 'auto',
                                borderRadius: '16px',
                                border: '1px solid #D1D5DB',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px',
                                justifyContent: 'space-between',
                            }}
                            className="text-left"
                        >
                            <div>
                                <div className="flex items-center">
                                    <div
                                        style={{
                                            borderRadius: '50%',
                                            border: '2px solid #DFE1E6',
                                            backgroundColor: 'white',
                                            padding: '8px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={farStar} className="text-Greyscale/400" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold">{plan.name}</h3>
                                <p className="text-gray-500 mb-4">{plan.description}</p>
                            </div>
                            <div className="text-3xl font-bold mb-2">
                                ${billingCycle === 'monthly' ? plan.price : plan.price * 10} 
                                <span className="text-sm font-normal"> / {billingCycle}</span>
                            </div>

                            <div
                                style={{
                                    borderTop: '1px dashed #D1D5DB',
                                    margin: '2px 0',
                                }}
                            ></div>

                            <button
                                style={{
                                    width: '80%',
                                    margin: 'auto',
                                    padding: '10px 0',
                                }}
                                onClick={() => openModal(plan.name)}
                                className="border border-gray-200 text-black rounded mt-4 mb-4"
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>

                <table style={{ width: '108%' }} className="w-full text-left border-t border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-3" style={{ backgroundColor: '#F8F9FB' }}>Feature</th>
                            <th className="py-3" style={{ backgroundColor: '#F8F9FB' }}>Basic</th>
                            <th className="py-3" style={{ backgroundColor: '#F8F9FB' }}>Pro</th>
                            <th className="py-3" style={{ backgroundColor: '#F8F9FB' }}>Enterprise</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(plans[0].features).map((feature, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-3 px-2">{feature.replace(/([A-Z])/g, ' $1')}</td>
                                {plans.map((plan, idx) => (
                                    <td key={idx} className="py-3 px-2">{plan.features[feature]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>


                {/* Payment Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                            <div style={{ borderBottom: '2px solid #D1D5DB', width: '100%' }} className="flex items-center justify-between">
                                <p className="text-lg font-semibold">Payment Summary</p>
                              

                                <FontAwesomeIcon className='text-Greyscale/400'
                                    style={{ cursor: 'pointer' }}
                                    onClick={closeModal}
                                    icon={faXmark}
                                />

                            </div>
                            
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Pricing;
