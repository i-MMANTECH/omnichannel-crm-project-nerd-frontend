import React from 'react';

const roles = [
  { name: 'Admin', count: 3, percent: 5, color: '#3EBF0F', icon: '/assets/admin_role_distribution.png' },
  { name: 'Manager', count: 10, percent: 10, color: '#3EBF0F', icon: '/assets/manager_role_distribution.png' },
  { name: 'Agent', count: 122, percent: 55, color: '#3EBF0F', icon: '/assets/agent_role_distribution.png' },
  { name: 'Team Member', count: 90, percent: 30, color: '#3EBF0F', icon: '/assets/team_role_distribution.png' },
];

const RoleDistribution = () => {
  return (
    <div className="body-theme border border-[#DFE1E6] rounded-lg shadow p-4 w-full">
      <h2 className="text-lg font-semibold mb-4">Role Distribution</h2>
      {roles.map((role, idx) => (
        <div key={idx} className="flex items-center mb-4">
          
          <div className="flex items-center w-1/4 space-x-2">
              <img src={role.icon} alt="" />
            <span className="text-sm">{role.name}</span>
          </div>

          <div className="flex-1 flex justify-end">
            <div className="relative flex space-x-1">
                {Array.from({ length: 20 }, (_, i) => (
                <div
                    key={i}
                    className="h-5 w-1.5 rounded-sm"
                    style={{
                    backgroundColor: i < (role.percent / 5) ? role.color : '#E5E7EB',
                    }}/>))}
                    
                    <span className="absolute top-[-1.5rem] left-0 text-sm text-gray-500">
                        {role.count}
                    </span>
                    
                    <span
                    className="absolute top-[-1.5rem] right-0 text-sm text-gray-500">
                    {role.percent}%
                    </span>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
};

export default RoleDistribution;

