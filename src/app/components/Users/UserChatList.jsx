import filter from '/public/assets/filter.svg'
import Image from "next/image"

export default function UserChatList({dummyData, handleChatSelect}){
    return (
        <div className="flex flex-col items-start gap-4 self-stretch p-6 rounded-lg border border-[#C1C7CF] body-theme">
            <div className="flex justify-between w-full">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6.66663 11.2497H13.3333M6.66663 7.08301H9.99996" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.0823 15.833C3.99888 15.7264 3.18725 15.401 2.64293 14.8567C1.66663 13.8804 1.66663 12.309 1.66663 9.16634V8.74967C1.66663 5.60697 1.66663 4.03563 2.64293 3.05932C3.61925 2.08301 5.19059 2.08301 8.33329 2.08301H11.6666C14.8093 2.08301 16.3807 2.08301 17.357 3.05932C18.3333 4.03563 18.3333 5.60697 18.3333 8.74967V9.16634C18.3333 12.309 18.3333 13.8804 17.357 14.8567C16.3807 15.833 14.8093 15.833 11.6666 15.833C11.1995 15.8434 10.8275 15.8789 10.4621 15.9622C9.46346 16.1921 8.53871 16.7031 7.62485 17.1488C6.3227 17.7837 5.67163 18.1012 5.26303 17.8039C4.48137 17.2218 5.24541 15.4179 5.41663 14.583" stroke="#808897" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
        
                    <p className="ms-2 font-['Encode Sans'] text-[14px] font-semibold leading-[21px] tracking-[0.2px]">
                    All Messages
                    </p>
                </div>
    
                <div className="flex h-10 px-3 py-2 justify-center items-center gap-2 rounded-lg border border-[#DFE1E6] body-theme cursor-pointer shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path 
                        d="M13.3333 2H2.66667C2.29848 2 2 2.29848 2 2.66667V3.7468C2 4.33065 2.25513 4.88535 2.69842 5.26531L5.96825 8.06802C6.41154 8.44799 6.66667 9.00269 6.66667 9.58654V14L9.33333 12.6667V9.58654C9.33333 9.00269 9.58846 8.44799 10.0318 8.06802L13.3016 5.26531C13.7449 4.88535 14 4.33065 14 3.7468V2.66667C14 2.29848 13.7015 2 13.3333 2Z" 
                        stroke="#808897" 
                        strokeWidth="1.33333" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                    </svg>
        
                    <p className=" text-[14px] font-medium leading-[150%] tracking-[0.2px]">
                    Filter
                    </p>
                </div>
                {/* <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm 
                    hover:dark:bg-neutral-900 hover:bg-gray-100">
                    <Image src={filter} className='mr-2' width={15} height={15} />
                    <span className="text-sm font-medium"> </span>
                </button> */}
            </div>
        
        <div>
        {dummyData.map((user) => (
          <div key={user.id}
          style={{cursor:"pointer"}}
          onClick={() => handleChatSelect(user)}
          >
            <div className="mb-3 mt-3 w-[692px] h-[1px] bg-[#DFE1E6]"></div>
  
            <div className="flex justify-between">
              <div className="flex justify-center items-center ">
                <div>
                  <img className="user-left-image" src={user.imageUrl} alt={`${user.name} profile`} />
                </div>
                <div className="flex flex-col ms-4">
                  <p className="font-['Encode_Sans'] text-[14px] font-medium leading-[150%] tracking-[0.2px]">
                    {user.name}
                  </p>
                  <p className=" mt-4 font-['Encode_Sans'] text-[12px] font-normal leading-[160%] tracking-[0.4px]">
                    {user.message}
                  </p>
                </div>
              </div>
  
              <div>
                <div className="flex flex flex-col">
                  <span className=" text-right font-['Encode_Sans'] text-[12px] font-normal leading-[170%] tracking-[0.2px]">
                    {user.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  {user.unreadCount > 0 && (
                    <span className="flex w-[20px] h-[20px] flex-col justify-center items-center gap-[8px] flex-shrink-0 rounded-full bg-[#3EBF0F] text-center font-['Encode_Sans'] text-[10px] font-bold leading-[160%] tracking-[0.2px]">
                      {user.unreadCount}
                    </span>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{ width: 20, height: 20, flexShrink: 0 }}
                  >
                    <path
                      d="M10.8337 9.99935C10.8337 10.4596 10.4606 10.8327 10.0003 10.8327C9.54009 10.8327 9.16699 10.4596 9.16699 9.99935C9.16699 9.53911 9.54009 9.16602 10.0003 9.16602C10.4606 9.16602 10.8337 9.53911 10.8337 9.99935Z"
                      stroke="#808897"
                      strokeWidth="2"
                    />
                    <path
                      d="M5.83366 9.99935C5.83366 10.4596 5.46056 10.8327 5.00033 10.8327C4.54009 10.8327 4.16699 10.4596 4.16699 9.99935C4.16699 9.53911 4.54009 9.16602 5.00033 9.16602C5.46056 9.16602 5.83366 9.53911 5.83366 9.99935Z"
                      stroke="#808897"
                      strokeWidth="2"
                    />
                    <path
                      d="M15.8337 9.99935C15.8337 10.4596 15.4606 10.8327 15.0003 10.8327C14.5401 10.8327 14.167 10.4596 14.167 9.99935C14.167 9.53911 14.5401 9.16602 15.0003 9.16602C15.4606 9.16602 15.8337 9.53911 15.8337 9.99935Z"
                      stroke="#808897"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    )
}