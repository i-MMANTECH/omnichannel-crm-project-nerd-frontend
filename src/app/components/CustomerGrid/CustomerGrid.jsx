import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faTh, faSort, faFilter, faEnvelope, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import CustomerTable from '../CustomerTable/CustomerTable';
import Link from 'next/link';
import CreateCustomerModal from './CreateCustomerModal';

const customers = [
  {
    id: 1,
    name: 'Ogechi Arinze',
    email: 'ogecharinze@gmail.com',
    phone: '+234 810 179 0957',
    role: 'Manager',
    comments: 15,
    lastActive: '2d',
    image: 'https://via.placeholder.com/40',
    mark: 1,
    tag: 'Task',
    channels: ['WhatsApp', 'Facebook'],
  },
];

const CustomerGrid = ({ searchQuery }) => {
  const [customersData, setCustomersData] = useState(customers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('grid');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const filteredCustomer = useMemo(() => {
    return customersData.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Effect that runs only on the client side to avoid SSR errors
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('view') || 'grid';
      setView(savedView);
    }

    const fetchCustomers = async () => {
      try {
        const { data } = await axiosInstance.get('/customers');
        const backendUsers = data.result || [];
        setCustomersData((prevUsers) => [...prevUsers, ...backendUsers]);
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('view', view);
    }
  }, [view]);

  return (
    <div className="p-6 min-h-screen border-l-2 border-gray-100 bg-theme border-l">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faTh} className="text-blue-500 mr-2" />
            <span className="text-sm font-medium">{view === 'grid' ? 'List View' : 'Grid View'}</span>
          </button>
          <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
            <FontAwesomeIcon icon={faSort} className="text-gray-500 mr-2" />
            <span className="text-sm font-medium">Sort by</span>
          </button>
          <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
            <FontAwesomeIcon icon={faFilter} className="text-gray-500 mr-2" />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>
        <button 
          onClick={openModal}
          className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm">
          + New Customer
        </button>
      </div>

      {view === 'list' ? (
        <CustomerTable searchQuery={searchQuery} customers={filteredCustomer} />
      ) : (
        <div className="grid gap-6 grid-cols-3">
          {filteredCustomer.map((customer) => (
            <Link key={customer.id} style={{color:"inherit", textDecoration:"none"}} href={`/nativecrm/customers/customer-details/${customer.id}`}>
              <div className="bg-theme border rounded-lg">
                <div className='flex justify-between items-center p-2 border-b'>
                  <div className='flex items-center space-x-2'>
                    <img src={customer.image} alt={customer.name} className="w-10 h-10 rounded-full" />
                    <h3 className="text-lg font-semibold">{customer.name}</h3>
                  </div>

                  <FontAwesomeIcon icon={faEllipsis} className="ml-auto cursor-pointer" />
                </div>
                
                <div className='p-2'>
                  <p className="text-gray-500 mb-2">
                    <FontAwesomeIcon className='mr-1' icon={faEnvelope} /> {customer.email}
                  </p>
                  
                  <p className="text-gray-500 flex items-center space-x-2 mb-2">
                    <FontAwesomeIcon icon={faPhone} />
                    <span>{customer.phone}</span>
                  </p>

                  {/* Social Media Icons */}
                  <div className="flex mb-2">
                    {/* Icons here */}
                  </div>

                  <div className="flex">
                    {/* VIP Badge */}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateCustomerModal isModalOpen={isModalOpen} closeModal={closeModal}/>
    </div>
  );
};

export default CustomerGrid;
