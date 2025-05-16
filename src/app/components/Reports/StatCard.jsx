const StatCard = ({ icon, title, value, borderColor, bgColor }) => {
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

        <span className="font-[400] text-[14px] leading-[150%] tracking-[0.2px]">
          {value}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
