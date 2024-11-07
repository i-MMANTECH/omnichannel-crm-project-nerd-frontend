import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PaymentModal = ({ selectedPlan, closeModal }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [billingAddress, setBillingAddress] = useState('NG');
    const [phoneNumber, setPhoneNumber] = useState('');

    const planPrice = selectedPlan === 'Pro' ? 10 : selectedPlan === 'Basic' ? 5 : 15;
    const discount = planPrice * 0.2;
    const total = planPrice - discount;

    const handlePayment = () => {
        console.log("Payment initiated with:", { cardNumber, expiry, cvv, cardHolderName, billingAddress, phoneNumber });
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-2">
                    <h2 className="text-lg font-semibold">Payment Summary</h2>
                    <FontAwesomeIcon icon={faXmark} className="cursor-pointer" onClick={closeModal} />
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-7">
                        <h3 className="text-lg font-bold mb-2">{selectedPlan} Plan</h3>
                        {/* <h4 className="text-md font-semibold mb-2">Card Details</h4> */}
                        <img src="../../assets/card-details-icon.png"/>
                        <label className="text-sm mb-1">Card Number</label>
                        <input
                            type="text"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full p-2 mb-2 border rounded-md border-gray-300"
                            style={{ borderRadius: '8px', fontSize: '12px' }}
                        />
                        <div className="flex gap-2 mb-2">
                            <div className="w-1/2">
                                <label className="text-sm mb-1">Exp Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    className="w-full p-2 border rounded-md border-gray-300"
                                    style={{ borderRadius: '8px', fontSize: '12px' }}
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="text-sm mb-1">CVC</label>
                                <input
                                    type="text"
                                    placeholder="CVV"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    className="w-full p-2 border rounded-md border-gray-300"
                                    style={{ borderRadius: '8px', fontSize: '12px' }}
                                />
                            </div>
                        </div>
                        <label className="text-sm mb-1">Card Holder Name</label>
                        <input
                            type="text"
                            placeholder="Card Holder Name"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            className="w-full p-2 mb-2 border rounded-md border-gray-300"
                            style={{ borderRadius: '8px', fontSize: '12px' }}
                        />

                        <h4 className="text-md font-semibold mb-2">Payment information</h4>
                        <label className="text-sm mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            className="w-full p-2 mb-2 border rounded-md border-gray-300"
                            style={{ borderRadius: '8px', fontSize: '12px' }}
                        />
                        <label className="text-sm mb-1">Phone Number</label>
                        <PhoneInput
                            country={'ng'}
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            inputClass="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            containerClass="w-full mb-2"
                            placeholder="(123) 456-7890"
                        />
                        <label className="text-sm mb-1">Billing Address</label>
                        <select
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            className="w-full p-2 mb-2 border rounded-md border-gray-300"
                            style={{ borderRadius: '8px', fontSize: '12px' }}
                        >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                            <option value="NG">Nigeria</option>
                        </select>
                    </div>

                    <div className="col-span-5 border-l border-gray-300 pl-2">
                        <div className='border rounded-lg p-3'>
                            <div className="flex justify-between mb-2">
                                <h4 className="text-md font-semibold mb-2">1 seat on starter</h4>
                                <span>${planPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Annual discounts (30%)</span>
                                <span className='text-red-500'>-${discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Tax</span>
                                <span>$00.0</span>
                            </div>
                            <hr className='mt-2 mb-2'/>
                            <div className="flex justify-between mb-4 font-bold text-lg">
                                <span>Total due today</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handlePayment}
                            className="w-full bg-[#3EBF0F] text-white mt-5 py-2 rounded-md font-semibold"
                        >
                            Pay
                        </button>
                        <p className="text-xs text-center mt-2 text-gray-500">
                            Save and Secure Payment <br />
                            By purchasing, you accept Terms of Service
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px', 
    width: '800px', 
    maxHeight: '90vh', 
    overflowY: 'auto', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    margin: '20px', 
    display: 'flex',
    flexDirection: 'column',
};

export default PaymentModal;
