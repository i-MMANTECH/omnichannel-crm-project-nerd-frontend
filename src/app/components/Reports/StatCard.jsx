import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const socialIcons = [
  { id: "fb", icon: Facebook, name: "Facebook" },
  { id: "tw", icon: Twitter, name: "Twitter" },
  { id: "ig", icon: Instagram, name: "Instagram" },
  { id: "li", icon: Linkedin, name: "LinkedIn" },
];

const StatCard = ({ icon, title, value, borderColor, bgColor, isMessagesReport }) => {
  return (
    <div
      className="h-[120px] flex cursor-pointer flex-col items-start gap-2 p-[16px_16px_14px] rounded-[16px] border body-theme shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex-1"
      style={{ borderColor }}
    >
      <div
        className="flex items-center gap-1 w-full"
      >
        <div
          className="flex justify-center items-center w-[36px] h-[36px] p-[8px] rounded-[8px] shadow-[0px_-4px_6px_0px_rgba(255,255,255,0.50)_inset,_0px_1px_2px_0px_rgba(13,13,18,0.10)]"
          style={{ backgroundColor: bgColor, borderColor }}
        >
          {icon}
        </div>
      </div>

      <div>
        <span className="block font-[400] text-[14px] leading-[150%] tracking-[0.2px]">
          {title}
        </span>

        <div className="flex -space-x-2">
        {isMessagesReport && socialIcons.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white rounded-full p-1 border border-gray-200 shadow-sm cursor-pointer transition-all duration-300 hover:z-20"
              title={item.name}
            >
              <IconComponent className="w-4 h-4 text-gray-600" />
            </div>
          );
        })}
        </div>

        <span className="font-[400] text-[14px] leading-[150%] tracking-[0.2px]">
          {value}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
