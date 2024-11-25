import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faTh, faSort, faFilter, faEnvelope, faEllipsis } from '@fortawesome/free-solid-svg-icons';

const customerData = [
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
  },
  {
    id: 2,
    name: 'Samuel Johnson',
    email: 'samuelj@gmail.com',
    phone: '+234 810 123 4567',
    role: 'Agent',
    comments: 10,
    lastActive: '5d',
    image: 'https://via.placeholder.com/40',
    mark: 1,
  },
  {
    id: 3,
    name: 'Amara Eze',
    email: 'amaraeze@gmail.com',
    phone: '+234 813 123 7890',
    role: 'Team Member',
    comments: 7,
    lastActive: '3h',
    image: 'https://via.placeholder.com/40',
    mark: 1,
  },
  {
    id: 4,
    name: 'Chidi Okafor',
    email: 'chidiokafor@gmail.com',
    phone: '+234 818 456 7890',
    role: 'Manager',
    comments: 20,
    lastActive: '1w',
    image: 'https://via.placeholder.com/40',
    mark: 1,
  },
  {
    id: 5,
    name: 'Fatima Bello',
    email: 'fatimabello@gmail.com',
    phone: '+234 802 987 6543',
    role: 'Agent',
    comments: 12,
    lastActive: '12h',
    image: 'https://via.placeholder.com/40',
    mark: 1,
  },
  {
    id: 6,
    name: 'Tunde Balogun',
    email: 'tundebalogun@gmail.com',
    phone: '+234 809 345 6789',
    role: 'Team Member',
    comments: 5,
    lastActive: '30m',
    image: 'https://via.placeholder.com/40',
    mark: 1,
    isActive: true,
  },
];

const CustomerGrid = ({ searchQuery }) => {
  const [view, setView] = useState('grid');

  const filteredCustomer = useMemo(() => {
    return customerData.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="p-6 min-h-screen border-l-2 border-gray-100 bg-white">
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
        <button className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm">
          + New Customer
        </button>
      </div>

     {/* User Cards */}
      <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {filteredCustomer.map((customer) => (
          <div key={customer.id} className="bg-white border rounded-lg">
            <div className='flex justify-between items-center p-2 border-b'>
              <div className='flex items-center space-x-2'>
                 <img  src={customer.image}
                  alt={customer.name}
                  className="w-10 h-10 rounded-full"
                />
             
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

              <div className="flex mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 21" fill="none">
                    <path d="M8.33325 11.892C8.45125 12.0853 8.59134 12.2682 8.75342 12.4368C9.75967 13.4841 11.2934 13.6478 12.4646 12.928C12.6816 12.7946 12.8861 12.6309 13.0726 12.4368L15.7721 9.62734C16.9648 8.38604 16.9648 6.37347 15.7721 5.13216C14.5793 3.89084 12.6456 3.89085 11.4528 5.13216L10.8583 5.75099" stroke="#808897" strokeWidth="1.88" strokeLinecap="round"/>
                    <path d="M9.14184 15.9848L8.547 16.6038C7.3543 17.8452 5.42051 17.8452 4.2278 16.6038C3.03507 15.3625 3.03507 13.35 4.2278 12.1087L6.92731 9.29916C8.12003 8.05784 10.0538 8.05783 11.2465 9.29916C11.4086 9.46774 11.5486 9.65066 11.6666 9.84383" stroke="#808897" strokeWidth="1.88" strokeLinecap="round"/>
                  </svg>

                  <div className="flex justify-center items-center w-[28px] h-[28px] p-[5.086px] rounded-[11.868px] border-[1.06px] border-[#FFF] bg-[#F7F7F7] flex-shrink-0">
                    <i className="fab fa-whatsapp text-[#25D366] text-[20px]"></i>
                  </div>

                  <div className="flex justify-center items-center w-[28px] h-[28px] p-[5.086px] rounded-[11.868px] border-[1.06px] border-[#FFF] bg-[#F7F7F7] flex-shrink-0">
                    <i className="fab fa-instagram text-[#E4405F] text-[20px]"></i>
                  </div>

                  <div className="flex justify-center items-center w-[28px] h-[28px] p-[5.086px] rounded-[11.868px] border-[1.06px] border-[#FFF] bg-[#F7F7F7] flex-shrink-0">
                    <i className="fab fa-facebook text-[#3b5998] text-[20px]"></i>
                  </div>
                </div>


              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 21" fill="none">
                  <path
                    d="M10.8334 3.79688H5.19555C3.16195 3.79688 2.14514 3.79688 1.78706 4.43562C1.77616 4.45508 1.76577 4.47482 1.75592 4.49483C1.43252 5.15181 2.00868 5.98962 3.161 7.66524C4.08018 9.00188 4.53977 9.67021 4.551 10.4265C4.55136 10.4512 4.55136 10.4759 4.551 10.5006C4.53977 11.2569 4.08018 11.9252 3.161 13.2619C2.00868 14.9375 1.43252 15.7753 1.75592 16.4323C1.76577 16.4523 1.77616 16.472 1.78706 16.4915C2.14514 17.1302 3.16195 17.1302 5.19555 17.1302H10.8334C12.4691 17.1302 13.287 17.1302 13.9908 16.7783C14.6946 16.4264 15.1853 15.7721 16.1667 14.4635C17.6112 12.5376 18.3334 11.5746 18.3334 10.4635C18.3334 9.35246 17.6112 8.38947 16.1667 6.46354C15.1853 5.15498 14.6946 4.50069 13.9908 4.14878C13.287 3.79687 12.4691 3.79688 10.8334 3.79688Z"
                    stroke="#808897"
                    strokeWidth="1.88"
                  />
                </svg>
                <p className="ms-1 text-right text-[#936DFF] font-encode-sans text-xs font-medium leading-[18px] tracking-[0.4px] flex px-[6.913px] py-[1.728px] justify-center items-center gap-[3.456px] rounded-[3.456px] bg-[#F4F0FF]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="3.456" height="3.456" viewBox="0 0 5 5" fill="none">
                    <circle cx="2.64075" cy="2.65589" r="1.72816" fill="var(--Violet-100, #936DFF)" />
                  </svg>
                  VIP Customer
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerGrid;
