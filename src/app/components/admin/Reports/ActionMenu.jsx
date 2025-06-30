import { Check, AlertTriangle, Mail } from "lucide-react";


const ActionMenu = ({ isOpen, onClose, position }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
       style={{
          top: position.y,
          left: position.x - -20,
        }}
        className="absolute bg-white border rounded shadow z-50 inset-0 z-40"
        onClick={onClose}
      />
      
      <div 
        className=" z-50 bg-white rounded-md shadow-lg border border-gray-200 py-0.5 w-40"
       
      >
        <button 
          className="w-full px-2 py-1.5 text-left hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 text-xs"
          onClick={onClose}
        >
          <Check className="h-3 w-3" />
          <span>Mark as Responded</span>
        </button>
        
        <button 
          className="w-full px-2 py-1.5 text-left hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 text-xs"
          onClick={onClose}
        >
          <AlertTriangle className="h-3 w-3" />
          <span>Escalate</span>
        </button>
        
        <button 
          className="w-full px-2 py-1.5 text-left hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 text-xs"
          onClick={onClose}
        >
          <Mail className="h-3 w-3" />
          <span>View Conversation</span>
        </button>
      </div>
    </>
  );
};

export default ActionMenu;
