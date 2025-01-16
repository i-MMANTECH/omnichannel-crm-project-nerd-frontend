import NoDataFound from "../NoDataFound";

export default function ProgessBar() {
  const userPerformanceData = [
    { percentage: 60, date: "2024-11-21" },
    { percentage: 80, date: "2024-11-20" },
    { percentage: 50, date: "2024-11-19" },
    { percentage: 90, date: "2024-11-18" },
    { percentage: 40, date: "2024-11-17" },
    { percentage: 30, date: "2024-11-16" },
    { percentage: 70, date: "2024-11-15" },
  ];

  const timeLabels = [0, 25, 50, 75, 100];

  return (
    <div className="mt-5 h-[320px] flex flex-col items-start flex-shrink-0 rounded-[12px] border border-[#DFE1E6] body-theme shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)]">
      <div className="flex items-center gap-4 p-4 self-stretch border-b border-[#DFE1E6]">
        <span>Task Completion Rate</span>
      </div>

      <div className="progess-bar-body mt-5  w-full flex items-center justify-center">
        <NoDataFound message="No records found" />

        <div className="progress-bar-container " style={{display: 'none'}}>
          <div className="time-labels ">
            {timeLabels.map((label, index) => (
              <div key={index} className="time-label">
                {label}%
              </div>
            ))}
          </div>

          {userPerformanceData.length === 0 ? (
            <div className="no-data-center flex justify-center items-center">
              <NoDataFound message="No records found" />
            </div>
          ) : (
            userPerformanceData.map((performance, index) => (
              <div key={index} className="progress-bar-wrapper">
                <div className="progress-bar">
                  <div
                    className={performance.percentage > 0 ? 'progress-fill' : 'no-data'}
                    data-time={performance.date}
                    style={{ height: `${performance.percentage}%` }}
                  >
                    {performance.percentage > 0 && `${performance.percentage}%`}
                  </div>
                </div>
                <div className="text-center text-[#808897] font-['Encode Sans'] text-sm font-medium leading-[21px] tracking-[0.2px]">{performance.date}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
