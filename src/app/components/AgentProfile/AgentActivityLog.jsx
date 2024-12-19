import React from 'react';

const AgentActivityLog = () => {
  const user = {
    name: 'Aunt Viv started a chat on',
    imagePath: 'https://via.placeholder.com/40',
  };

  const tasks = [
    {
      id: 1,
      taskName: 'Competitive Targeting',
      status: 'Done',
      timestamp: '10 October, 2024 at 10:30am',
      agent: 'Jenny Adebola',
    },
    {
      id: 2,
      taskName: 'Review Marketing Materials',
      status: 'In Progress',
      timestamp: '10 October, 2024 at 9:00am',
      agent: 'John Doe',
    },
  ];

  return (
    <div className="flex mt-5 flex-col p-6 items-start gap-4 self-stretch rounded-lg border border-[#DFE1E6] ">
      <div className="flex h-[40px] px-[12px] py-[8px] justify-center items-center gap-[8px] rounded-[10px] border border-[#DFE1E6] shadow-[0px_1px_2px_0px_rgba(13,_13,_18,_0.06)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M5.33333 2.00065H4C2.89543 2.00065 2 2.89608 2 4.00065V6.00065M5.33333 2.00065V1.33398M5.33333 2.00065H10.6667M5.33333 2.00065V2.66732M10.6667 2.00065H12C13.1046 2.00065 14 2.89608 14 4.00065V6.00065M10.6667 2.00065V1.33398M10.6667 2.00065V2.66732M2 6.00065V12.6673C2 13.7719 2.89543 14.6673 4 14.6673H12C13.1046 14.6673 14 13.7719 14 12.6673V6.00065M2 6.00065H14" stroke="#808897" strokeWidth="1.33333" strokeLinecap="round" />
        </svg>
        
        <p className="text-[#666D80] text-center font-medium text-[14px] leading-[21px] tracking-[0.2px]">
          Last Login: 23m ago
        </p>

        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8.00008 2.66732C5.05456 2.66732 2.66675 5.05513 2.66675 8.00065C2.66675 9.97474 3.73928 11.6983 5.33341 12.6205M8.00008 2.66732L6.66675 1.33398M8.00008 2.66732L7.00008 4.33398M8.00008 13.334C10.9456 13.334 13.3334 10.9462 13.3334 8.00065C13.3334 6.02657 12.2609 4.30298 10.6667 3.38082M8.00008 13.334L9.33341 14.6673M8.00008 13.334L9.00008 11.6673" stroke="#3EBF0F" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="flex h-[1px] items-center gap-2 self-stretch bg-[#DFE1E6]" />

      <div className="w-[575px] h-[93px] p-[16.049px] rounded-[8px] border border-[#DFE1E6]">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-4 justify-between items-center">
            <div className="w-[24px] h-[24px] flex-shrink-0 rounded-full bg-cover bg-center" style={{backgroundImage: `url(${user.imagePath})`}} />
            <p className="flex-shrink-0 text-[#0D0D12] text-[14px] font-semibold leading-[21px] tracking-[0.2px]">
              {user.name}
            </p>
            <p className="text-[#267F0C] font-semibold text-[12px] leading-[18px] tracking-[0.4px] flex h-[24.073px] px-[8.024px] py-[4.012px] justify-center items-center gap-[8.024px] rounded-[6.018px] bg-[#EFFFE6]">
              Whatsapp
            </p>
          </div>
          <span className="text-[#808897] font-normal text-[14px] leading-[21px] tracking-[0.2px] ml-auto">
            2 min ago
          </span>
        </div>

        <div className="flex mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 17" fill="none">
            <path d="M9.38208 9.87435H6.71541C4.87446 9.87435 3.38208 11.3667 3.38208 13.2077V13.8743C3.38208 14.2425 3.68056 14.541 4.04875 14.541H12.0487C12.4169 14.541 12.7154 14.2425 12.7154 13.8743V13.2077C12.7154 11.3667 11.223 9.87435 9.38208 9.87435Z" stroke="#808897" strokeWidth="1.5"/>
            <path d="M8.04875 7.87435C9.52151 7.87435 10.7154 6.68044 10.7154 5.20768C10.7154 3.73492 9.52151 2.54102 8.04875 2.54102C6.57599 2.54102 5.38208 3.73492 5.38208 5.20768C5.38208 6.68044 6.57599 7.87435 8.04875 7.87435Z" stroke="#808897" strokeWidth="1.5"/>
          </svg>

          <p className="text-[#808897] font-encodeSans text-[12px] font-medium leading-[18px] tracking-[0.4px]">
            Agent: Jenny Adebola
          </p>
        </div>
      </div>

      {tasks.map((task, index) => (
        <div key={index} className="w-[575px] h-[93px] p-[16.049px] rounded-[8px] border border-[#DFE1E6] ">
          <p className="text-[#0D0D12] font-encodeSans text-[12px] font-medium leading-[18px] tracking-[0.4px]">
            {task.taskName}
          </p>
          <div className="flex justify-between">
            <div className="flex gap-3">
              <p className="text-[#0D0D12] font-encodeSans text-[14px] font-medium leading-[21px] tracking-[0.2px]">
                Task status changed to
              </p>
              <div className="flex p-[2px_8px_2px_4px] justify-center items-center gap-2 rounded-md bg-[#E7FEF8]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M4.375 7.29167L6.125 9.04167L9.625 5.54167M10.5 1.75H3.5C2.5335 1.75 1.75 2.5335 1.75 3.5V10.5C1.75 11.4665 2.5335 12.25 3.5 12.25H10.5C11.4665 12.25 12.25 11.4665 12.25 10.5V3.5C12.25 2.5335 11.4665 1.75 10.5 1.75Z"
                    stroke="#40C4AA"
                    stroke-width="1.11"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p className="text-[#40C4AA]">{task.status}</p>
              </div>
            </div>
            <p class="text-[var(--Greyscale-400,_#808897)] font-['Encode_Sans'] text-sm font-normal leading-[21px] tracking-[0.2px]">
                {task.timestamp}
              </p>
          </div>
          <div className="flex mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 17" fill="none">
              <path d="M9.38208 9.87435H6.71541C4.87446 9.87435 3.38208 11.3667 3.38208 13.2077V13.8743C3.38208 14.2425 3.68056 14.541 4.04875 14.541H12.0487C12.4169 14.541 12.7154 14.2425 12.7154 13.8743V13.2077C12.7154 11.3667 11.223 9.87435 9.38208 9.87435Z" stroke="#808897" strokeWidth="1.5"/>
              <path d="M8.04875 7.87435C9.52151 7.87435 10.7154 6.68044 10.7154 5.20768C10.7154 3.73492 9.52151 2.54102 8.04875 2.54102C6.57599 2.54102 5.38208 3.73492 5.38208 5.20768C5.38208 6.68044 6.57599 7.87435 8.04875 7.87435Z" stroke="#808897" strokeWidth="1.5"/>
            </svg>

            <p className="text-[#808897] font-encodeSans text-[12px] font-medium leading-[18px] tracking-[0.4px]">
              {task.agent}
            </p>
          </div>
      </div>
      ))}
    </div>
  );
};

export default AgentActivityLog;
