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
    const [billingAddress, setBillingAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('NG');

    const planPrice = selectedPlan === 'Pro' ? 10 : selectedPlan === 'Basic' ? 5 : 15;
    const discount = planPrice * 0.2;
    const total = planPrice - discount;

    const handlePayment = () => {
        console.log("Payment initiated with:", { cardNumber, expiry, cvv, cardHolderName, billingAddress, phoneNumber, country });
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h2 className="text-lg font-semibold">Payment Summary</h2>
                    <FontAwesomeIcon icon={faXmark} className="cursor-pointer" onClick={closeModal} />
                </div>

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-7">
                        <h3 className="text-xl font-bold mb-4">{selectedPlan} Plan</h3>
                        <h4 className="text-lg font-semibold mb-4">Card Details</h4>
                        <input
                            type="text"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full p-2 mb-4 border rounded"
                        />
                        <div className="flex gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                className="w-1/2 p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                className="w-1/2 p-2 border rounded"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Card Holder Name"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            className="w-full p-2 mb-4 border rounded"
                        />

                        <h4 className="text-lg font-semibold mb-4">Billing Information</h4>
                        <PhoneInput
                            country={'ng'}
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            inputClass="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            containerClass="w-full mb-4"
                            placeholder="(123) 456-7890"
                        />
                        <input
                            type="text"
                            placeholder="Billing Address"
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            className="w-full p-2 mb-4 border rounded"
                        />
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full p-2 mb-4 border rounded"
                        >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                            <option value="NG">Nigeria</option>
                        </select>
                    </div>

                    <div className="col-span-5">
                        <h4 className="text-lg font-semibold mb-4">Total to Pay</h4>
                        <div className="flex justify-between mb-2">
                            <span>Plan Cost</span>
                            <span>${planPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-red-500">
                            <span>Annual Discount (20%)</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-6 font-bold text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handlePayment}
                            className="w-full bg-green-500 text-white py-3 rounded-md font-semibold"
                        >
                            Pay ${total.toFixed(2)}
                        </button>
                        <p className="text-sm text-center mt-4 text-gray-500">
                            Secure and encrypted payment. By purchasing, you agree to our Terms of Service.
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
    width: '400px',
    maxWidth: '90%', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    margin: '20px', 
};

export default PaymentModal;
