import React, { useState } from 'react';
import Pagination from '../../Pagination/Pagination';
import './style.css';
import { useRouter } from 'next/navigation';
import UserAvatar from '../../UserAvatar';
import Image from 'next/image';

const CustomerTable = ({ searchQuery, customers }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); 
    const router = useRouter()

    const handlePageChange = (page) => setCurrentPage(page);

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1); 
    };

    const getChannelIcon = (channel) => {
        switch (channel) {
            case "WhatsApp":
                return "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";
            case "Facebook":
                return "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg";
            case "Instagram":
                return "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png";
            default:
                return "https://via.placeholder.com/24/000000/FFFFFF?text=?";
        }
    };
    

    return (
            <>
                <div className="overflow-auto">
                    <table className="min-w-full body-theme">
                        <thead className="bg-gray-100 dark:bg-neutral-900">
                            <tr>
                                <th className="styled-th">Customer Name</th>
                                <th className="styled-th">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                            <path d="M4 5.3335L6.80743 6.73721C7.55817 7.11258 8.44183 7.11258 9.19257 6.73721L12 5.3335M4 12.6668H12C13.1046 12.6668 14 11.7714 14 10.6668V5.3335C14 4.22893 13.1046 3.3335 12 3.3335H4C2.89543 3.3335 2 4.22893 2 5.3335V10.6668C2 11.7714 2.89543 12.6668 4 12.6668Z" stroke="#808897" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="ml-1">Email</span>
                                    </div>
                                </th>
                                <th className="styled-th">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                            <path d="M7.86164 9.82798L6.16797 8.13712C5.62282 7.59287 5.62282 6.71048 6.16797 6.16623C6.65516 5.67985 6.71403 4.91134 6.30658 4.35665L4.9159 2.46343C4.50421 1.90296 3.68898 1.84072 3.19671 2.33217C2.44724 3.08039 1.94543 4.07059 2.00475 5.12706C2.29456 10.2884 6.33224 13.7386 10.8984 13.9953C11.9455 14.0542 12.9207 13.5486 13.6623 12.8082C14.1619 12.3094 14.0986 11.4834 13.5289 11.0663L11.6484 9.68959C11.0928 9.28282 10.323 9.34159 9.83581 9.82798C9.29066 10.3722 8.4068 10.3722 7.86164 9.82798Z" stroke="#808897" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="ml-1">Phone</span>
                                    </div>
                                </th>
                                <th className="styled-th">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" style={{ flexShrink: 0 }} viewBox="0 0 16 16" fill="none">
                                            <path d="M6.66675 8.81966C6.76115 8.97426 6.87321 9.12059 7.00288 9.25553C7.80788 10.0933 9.03488 10.2243 9.97181 9.64846C10.1454 9.54173 10.309 9.41079 10.4582 9.25553L12.6178 7.00793C13.5719 6.01489 13.5719 4.40483 12.6178 3.41178C11.6636 2.41873 10.1166 2.41873 9.16241 3.41178L8.68675 3.90685" stroke="#808897" strokeLinecap="round" />
                                            <path d="M7.31362 12.0933L6.83775 12.5885C5.88359 13.5816 4.33656 13.5816 3.38238 12.5885C2.4282 11.5955 2.4282 9.98546 3.38238 8.9924L5.542 6.7448C6.49617 5.75174 8.04322 5.75173 8.99735 6.7448C9.12702 6.87966 9.23902 7.026 9.33342 7.18053" stroke="#808897" strokeLinecap="round" />
                                        </svg>
                                        <span className="ml-1">Channel</span>
                                    </div>
                                </th>
                                <th className="styled-th">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" style={{ flexShrink: 0 }} viewBox="0 0 16 16" fill="none">
                                            <path d="M8.66658 2.66699H4.15629C2.52941 2.66699 1.71597 2.66699 1.42951 3.17799C1.42078 3.19355 1.41247 3.20935 1.40459 3.22535C1.14587 3.75094 1.6068 4.42119 2.52865 5.76169C3.264 6.83099 3.63167 7.36566 3.64065 7.97066C3.64095 7.99046 3.64095 8.01019 3.64065 8.02999C3.63167 8.63499 3.264 9.16966 2.52865 10.239C1.6068 11.5795 1.14587 12.2497 1.40459 12.7753C1.41247 12.7913 1.42078 12.8071 1.42951 12.8227C1.71597 13.3337 2.52941 13.3337 4.15629 13.3337H8.66658C9.97512 13.3337 10.6295 13.3337 11.1925 13.0521C11.7555 12.7706 12.1481 12.2472 12.9333 11.2003C14.0888 9.65959 14.6666 8.88919 14.6666 8.00033C14.6666 7.11146 14.0888 6.34107 12.9333 4.80033C12.1481 3.75347 11.7555 3.23005 11.1925 2.94852C10.6295 2.66699 9.97512 2.66699 8.66658 2.66699Z" stroke="#808897" />
                                        </svg>

                                        <span className="ml-1">Tag</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {customers?.map((customer, index) => (
                                <tr  style={{
                                    width: '100px',
                                    flexShrink: 0,
                                    fontFamily: '"Encode Sans"',
                                    fontSize: '14px',
                                    fontStyle: 'normal',
                                    fontWeight: 500,
                                    lineHeight: '150%',
                                    letterSpacing: '0.2px'
                                }} key={index} className="hover:dark:bg-neutral-900 hover:bg-gray-100 cursor-pointer" 
                                onClick={() => router.push(`customers/${customer.id}`)}
                                >
                                    <td className="py-3 px-4 border-b flex items-center space-x-3">
                                        {customer?.image && <Image 
                                            alt="profile pic"
                                            width={10}
                                            height={10}
                                            className="customer-left-image mt-2 w-10 h-10 rounded-full" 
                                            src={customer.image} 
                                            />}
                                        {!customer?.image && <UserAvatar name={`${customer.first_name} ${customer.last_name}`} width="w-10" height="h-10" />}
                                        <span>{`${customer.first_name} ${customer.last_name}` || "--"}</span>
                                    </td>
                                    <td className="py-3 px-4 border-b">{customer.email}</td>
                                    <td className="py-3 px-4 border-b ">{customer.phone_number}</td>
                                    <td className="py-3 px-4 border-b">
                                        <div className="flex items-center space-x-2">
                                            {customer.channels?.map((channel, idx) => (
                                                <div
                                                    key={idx}
                                                    className="channel-icon-container"
                                                    title={channel}
                                                >
                                                    <img
                                                        src={getChannelIcon(channel)}
                                                        alt={channel}
                                                        className="channel-icon"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        {customer.tags?.length > 0 &&
                                            <div className='flex flex-col'>
                                                <p className="ms-1 text-right text-[#936DFF] bg-[#F4F0FF] font-encode-sans text-xs font-medium leading-[18px] tracking-[0.4px] flex px-[6.913px] py-[1.728px] justify-center items-center gap-[3.456px] rounded-[3.456px] ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="3.456" height="3.456" viewBox="0 0 5 5" fill="none">
                                                        <circle cx="2.64075" cy="2.65589" r="1.72816" fill="var(--Violet-100, #936DFF)" />
                                                    </svg>
                                                    {customer.tags?.map((tag) => (tag))}
                                                </p>
                                            </div>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </>
    );
};

export default CustomerTable;
