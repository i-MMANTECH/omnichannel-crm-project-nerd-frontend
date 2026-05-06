import React, { useState } from 'react';
import { Bell, AlertCircle, User, CircleCheckBig } from 'lucide-react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const [tickets, setTickets] = useState([
    {
      id: 1,
      user: "Aunt Viv",
      avatar: "/api/placeholder/32/32",
      message: "I still can't access my account. Can you help me reset my password?",
      time: "37 minutes ago",
      status: "waiting",
      waitingTime: "35 minutes",
      category: "all",
      isRead: false
    },
    {
      id: 2,
      user: "Lisa Mona",
      avatar: "/api/placeholder/32/32", 
      message: "There seems to be a discrepancy in my last invoice. I was charged for features I...",
      time: "about 1 hour ago",
      status: "escalated",
      category: "escalated",
      isRead: true
    },
    {
      id: 3,
      user: "Lisa Mona",
      avatar: "/api/placeholder/32/32",
      message: "There seems to be a discrepancy in my last invoice. I was charged for features I...",
      time: "about 1 hour ago", 
      status: "escalated",
      category: "escalated",
      isRead: true
    },
    {
      id: 4,
      user: "Lisa Mona",
      avatar: "/api/placeholder/32/32",
      message: "There seems to be a discrepancy in my last invoice. I was charged for features I...",
      time: "about 1 hour ago",
      status: "escalated", 
      category: "escalated",
      isRead: true
    },
    {
      id: 5,
      user: "Lisa Mona",
      avatar: "/api/placeholder/32/32",
      message: "There seems to be a discrepancy in my last invoice. I was charged for features I...",
      time: "about 1 hour ago",
      status: "escalated",
      category: "escalated",
      isRead: true
    },
    {
      id: 6,
      user: "Lisa Mona", 
      avatar: "/api/placeholder/32/32",
      message: "There seems to be a discrepancy in my last invoice. I was charged for features I...",
      time: "about 1 hour ago",
      status: "escalated",
      category: "escalated",
      isRead: true
    }
  ]);

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'all') return true;
    if (activeTab === 'urgent') return ticket.status === 'waiting';
    if (activeTab === 'escalated') return ticket.status === 'escalated';
    return true;
  });

  const getTabCount = (tab) => {
    if (tab === 'all') return tickets.length;
    if (tab === 'urgent') return tickets.filter(t => t.status === 'waiting').length;
    if (tab === 'escalated') return tickets.filter(t => t.status === 'escalated').length;
    return 0;
  };

  return (
    <div className="body-theme">
      <div className="flex p-1 gap-1 sticky top-0 z-10 body-theme w-full overflow-x-auto">

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center flex-shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'all'
              ? 'bg-[#3EBF0F] text-white'
              : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          All
          <span className={`ml-2 px-2 py-1 text-xs rounded-lg font-medium ${
            activeTab === 'all'
              ? 'bg-white text-[#3EBF0F]'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {getTabCount('all')}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('urgent')}
          className={`flex items-center flex-shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'urgent'
              ? 'bg-[#3EBF0F] text-white'
              : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Urgent
          <span className={`ml-2 px-2 py-1 text-xs rounded-lg font-medium ${
            activeTab === 'urgent'
              ? 'bg-white text-[#3EBF0F]'
              : 'bg-[#DF1C41] text-white'
          }`}>
            {getTabCount('urgent')}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('escalated')}
          className={`flex items-center flex-shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'escalated'
              ? 'bg-[#3EBF0F] text-white'
              : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Escalated
          <span className={`ml-2 px-2 py-1 text-xs rounded-lg font-medium ${
            activeTab === 'escalated'
              ? 'bg-white text-[#3EBF0F]'
              : 'bg-[#DF1C41] text-white'
          }`}>
            {getTabCount('escalated')}
          </span>
        </button>
      </div>

      <div className=' mt-5 overflow-y-auto flex-1 space-y-4'>
        {filteredTickets.map((ticket) => (
          <div 
            key={ticket.id} 
            className={`p-4 ${
              ticket.isRead ? 'body-theme' : 'bg-[#F8F9FB] dark:bg-gray-800 rounded-lg'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium truncate">
                    {ticket.user}
                  </h3>
                  <span className="text-xs flex-shrink-0 whitespace-nowrap">
                    {ticket.time}
                  </span>
                </div>

                <p className="mt-1 text-sm break-words">
                  {ticket.message}
                </p>

                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    {ticket.status === 'waiting' && (
                      <div className="flex items-center">
                        <div className="w-1 h-4 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                        <div className="flex items-center text-xs text-blue-600">
                          <Bell className="w-3 h-3 mr-1 flex-shrink-0" />
                          Waiting for {ticket.waitingTime}
                        </div>
                      </div>
                    )}
                    {ticket.status === 'escalated' && (
                      <div className="flex items-center">
                        <div className="w-1 h-4 bg-red-500 rounded-full mr-2 flex-shrink-0"></div>
                        <div className="flex items-center text-xs text-red-600">
                          <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                          Escalated to supervisor
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="text-xs hover:text-gray-600 flex items-center px-2 py-2 -mx-2 rounded-md self-start sm:self-auto">
                    <CircleCheckBig size={14} />
                    <span className='ms-1'>Mark as read</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;