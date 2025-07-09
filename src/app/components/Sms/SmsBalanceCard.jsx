import { Send, Plus } from 'lucide-react';

const SmsBalanceCard = () => {
  const totalMessages = 300;
  const messagesLeft = 256;
  const percentageUsed = Math.floor((messagesLeft / totalMessages) * 100);

  return (
    <div className="flex gap-6 p-6 w-full">
      <div className="w-[50%] border rounded-lg p-6">
        <h3 className="text-sm font-medium mb-2">SMS Balance</h3>
        <div className="text-2xl font-bold mb-1">{messagesLeft} messages left</div>
        <div className="text-sm text-gray-500 mb-4">Out of {totalMessages}</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${percentageUsed}%` }}
          ></div>
        </div>
          <div className='border rounded-lg w[70%] flex items-center justify-center p-1'>
             <button className="py-2 px-6 rounded-lg font-medium transition">
              Top Up
            </button>
          </div>
      </div>

      <div className="w-[50%] border rounded-lg p-6 flex flex-col">
        <h3 className="text-sm font-medium mb-4">Quick Actions</h3>
        
        <div className="mt-10 flex space-x-3">
          <button className="flex items-center space-x-2 border px-4 py-2 rounded-md hover:bg-green-50 transition">
            <Send className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Send SMS</span>
          </button>
          <button className="flex items-center space-x-2 border px-4 py-2 rounded-md hover:bg-purple-50 transition">
            <Plus className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-700 font-medium">Create New Campaign</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmsBalanceCard;
