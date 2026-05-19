import React, { useState, useMemo, useRef, useEffect } from 'react';

const IndeterminateToggle = ({ state, onChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = state === 'some';
    }
  }, [state]);

  return (
    <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={state === 'all'}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`w-11 h-6 rounded-full transition-colors ${state !== 'none' ? 'bg-[#3EBF0F]' : 'bg-gray-300'}`}>
        <div className={`w-6 h-6 body-theme rounded-full transition-transform ${state !== 'none' ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </label>
  );
};

const GroupedPermissionPicker = ({ permissions = [], groups = [], selectedIds = [], onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(() => {
    const initial = {};
    groups.forEach((g) => { initial[g] = true; });
    initial['Other'] = true;
    return initial;
  });

  // Expand any new groups that arrive after initial load
  useEffect(() => {
    setExpandedGroups((prev) => {
      const next = { ...prev };
      groups.forEach((g) => { if (!(g in next)) next[g] = true; });
      return next;
    });
  }, [groups]);

  const groupedPermissions = useMemo(() => {
    const map = {};
    permissions.forEach((perm) => {
      const g = perm.group || 'Other';
      if (!map[g]) map[g] = [];
      map[g].push(perm);
    });
    return map;
  }, [permissions]);

  const filteredGroupedPermissions = useMemo(() => {
    if (!searchQuery.trim()) return groupedPermissions;
    const q = searchQuery.toLowerCase();
    const map = {};
    Object.entries(groupedPermissions).forEach(([group, perms]) => {
      const matched = perms.filter(
        (p) => p.name.toLowerCase().includes(q) || p.codename.toLowerCase().includes(q)
      );
      if (matched.length > 0) map[group] = matched;
    });
    return map;
  }, [groupedPermissions, searchQuery]);

  const orderedGroups = useMemo(() => {
    const result = groups.filter((g) => filteredGroupedPermissions[g]?.length > 0);
    if (filteredGroupedPermissions['Other']?.length > 0) result.push('Other');
    return result;
  }, [groups, filteredGroupedPermissions]);

  const getGroupState = (groupName) => {
    const groupPerms = filteredGroupedPermissions[groupName] || [];
    if (groupPerms.length === 0) return 'none';
    const selectedCount = groupPerms.filter((p) => selectedIds.includes(p.id)).length;
    if (selectedCount === 0) return 'none';
    if (selectedCount === groupPerms.length) return 'all';
    return 'some';
  };

  const handleGroupToggle = (groupName) => {
    const groupPerms = filteredGroupedPermissions[groupName] || [];
    const groupIds = groupPerms.map((p) => p.id);
    const allSelected = groupIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      onChange(selectedIds.filter((id) => !groupIds.includes(id)));
    } else {
      onChange([...new Set([...selectedIds, ...groupIds])]);
    }
  };

  const handlePermissionToggle = (permId) => {
    if (selectedIds.includes(permId)) {
      onChange(selectedIds.filter((id) => id !== permId));
    } else {
      onChange([...selectedIds, permId]);
    }
  };

  const toggleGroupExpand = (groupName) => {
    setExpandedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const totalSelected = selectedIds.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">Permissions</h3>
        {totalSelected > 0 && (
          <span className="text-xs text-gray-500">{totalSelected} selected</span>
        )}
      </div>

      <div className="relative mb-4">
        <input
          className="w-full body-theme bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          placeholder="Search permissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="absolute right-3 top-2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
          </svg>
        </span>
      </div>

      {orderedGroups.length === 0 && (
        <p className="text-sm text-gray-400 py-4 text-center">No permissions found.</p>
      )}

      <div className="space-y-2">
        {orderedGroups.map((groupName) => {
          const groupPerms = filteredGroupedPermissions[groupName] || [];
          const state = getGroupState(groupName);
          const selectedCount = groupPerms.filter((p) => selectedIds.includes(p.id)).length;
          const isExpanded = expandedGroups[groupName];

          return (
            <div key={groupName} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 cursor-pointer select-none"
                onClick={() => toggleGroupExpand(groupName)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  >
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-sm">{groupName}</span>
                  <span className="text-xs text-gray-400">
                    {selectedCount}/{groupPerms.length}
                  </span>
                </div>
                <IndeterminateToggle state={state} onChange={() => handleGroupToggle(groupName)} />
              </div>

              {isExpanded && (
                <div className="px-4 divide-y divide-gray-100 dark:divide-gray-700">
                  {groupPerms.map((perm) => (
                    <div key={perm.id} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{perm.name}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(perm.id)}
                          onChange={() => handlePermissionToggle(perm.id)}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors ${selectedIds.includes(perm.id) ? 'bg-[#3EBF0F]' : 'bg-gray-300'}`}>
                          <div className={`w-6 h-6 body-theme rounded-full transition-transform ${selectedIds.includes(perm.id) ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupedPermissionPicker;
