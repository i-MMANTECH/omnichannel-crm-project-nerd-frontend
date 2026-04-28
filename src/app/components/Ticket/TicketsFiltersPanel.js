import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Drawer from '@/app/components/Drawer';
import TextInput from '@/app/components/TextInput';
import { selectStyles } from '@/app/components/selectStyles';

export const EMPTY_FILTERS = {
  statusIds: [],
  priorityIds: [],
  categoryIds: [],
  assigneeIds: [],
  followerIds: [],
  createdAfter: '',
  createdBefore: '',
  dueAfter: '',
  dueBefore: '',
  sort: 'created_at',
  order: 'desc',
};

const toOptions = (items, labelKey = 'label', valueKey = 'id') =>
  (items || []).map((item) => ({
    value: item[valueKey],
    label: item[labelKey] || item.name || item.email || `#${item[valueKey]}`,
  }));

const userToOption = (user) => {
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim();
  return { value: user.id, label: fullName || user.email || `User ${user.id}` };
};

const pickOptions = (options, ids) =>
  options.filter((opt) => ids.includes(opt.value));

const TicketsFiltersPanel = ({
  show,
  onClose,
  filters,
  onApply,
  onReset,
  statuses = [],
  priorities = [],
  categories = [],
  users = [],
}) => {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (show) setDraft(filters);
  }, [show, filters]);

  const statusOptions = toOptions(statuses);
  const priorityOptions = toOptions(priorities);
  const categoryOptions = toOptions(categories);
  const userOptions = (users || []).map(userToOption);

  const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'updated_at', label: 'Last Updated' },
    { value: 'due_date', label: 'Due Date' },
  ];
  const orderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
  ];

  const update = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    setDraft(EMPTY_FILTERS);
    onReset();
    onClose();
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={handleReset}
        className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={handleApply}
        className="px-4 py-2 text-sm bg-[#3EBF0F] text-white rounded-md hover:bg-[#34ab0d]"
      >
        Apply Filters
      </button>
    </div>
  );

  return (
    <Drawer
      show={show}
      onClose={onClose}
      title="Filter Tickets"
      subtitle="Narrow the list by one or more criteria."
      width="400px"
      footer={footer}
    >
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            isMulti
            options={statusOptions}
            value={pickOptions(statusOptions, draft.statusIds)}
            onChange={(opts) => update({ statusIds: (opts || []).map((o) => o.value) })}
            styles={selectStyles}
            placeholder="Any status"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <Select
            isMulti
            options={priorityOptions}
            value={pickOptions(priorityOptions, draft.priorityIds)}
            onChange={(opts) => update({ priorityIds: (opts || []).map((o) => o.value) })}
            styles={selectStyles}
            placeholder="Any priority"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select
            isMulti
            options={categoryOptions}
            value={pickOptions(categoryOptions, draft.categoryIds)}
            onChange={(opts) => update({ categoryIds: (opts || []).map((o) => o.value) })}
            styles={selectStyles}
            placeholder="Any category"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assignee</label>
          <Select
            isMulti
            options={userOptions}
            value={pickOptions(userOptions, draft.assigneeIds)}
            onChange={(opts) => update({ assigneeIds: (opts || []).map((o) => o.value) })}
            styles={selectStyles}
            placeholder="Any assignee"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Follower</label>
          <Select
            isMulti
            options={userOptions}
            value={pickOptions(userOptions, draft.followerIds)}
            onChange={(opts) => update({ followerIds: (opts || []).map((o) => o.value) })}
            styles={selectStyles}
            placeholder="Any follower"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date Created</label>
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              type="date"
              placeholder="From"
              value={draft.createdAfter}
              onChange={(e) => update({ createdAfter: e.target.value })}
            />
            <TextInput
              type="date"
              placeholder="To"
              value={draft.createdBefore}
              onChange={(e) => update({ createdBefore: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              type="date"
              placeholder="From"
              value={draft.dueAfter}
              onChange={(e) => update({ dueAfter: e.target.value })}
            />
            <TextInput
              type="date"
              placeholder="To"
              value={draft.dueBefore}
              onChange={(e) => update({ dueBefore: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Sort by</label>
            <Select
              options={sortOptions}
              value={sortOptions.find((o) => o.value === draft.sort) || sortOptions[0]}
              onChange={(opt) => update({ sort: opt?.value || 'created_at' })}
              styles={selectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <Select
              options={orderOptions}
              value={orderOptions.find((o) => o.value === draft.order) || orderOptions[0]}
              onChange={(opt) => update({ order: opt?.value || 'desc' })}
              styles={selectStyles}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default TicketsFiltersPanel;
