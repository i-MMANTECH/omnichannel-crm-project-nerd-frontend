import React from 'react';
import Image from 'next/image';
import empty1 from '/public/assets/empty1.svg'

const NoDataFound = ({ message = "No Data Available", icon = empty1 }) => {
  return (
    <div className="no-data-container flex justify-center items-center flex-col p-5">
      <Image src={icon} />
      <p className="mt-3 text-gray-600 text-center">{message}</p>
    </div>
  );
};

export default NoDataFound;
