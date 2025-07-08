import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import Select from 'react-select';
import Modal from '../../Modal';

const EscalationSettings = ({ 
  escalationSettings, 
  handleEscalationToggle, 
  tempThresholdMinutes, 
  handleThresholdMinutesChange,
  saveThresholdMinutes,
  loading,
  escalationLevels,
  users,
  onCreateLevel,
  onDeleteLevel
}) => {
  const [newLevel, setNewLevel] = useState({
    level: '',
    assigned_users: [],
    description: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleAddLevel = async () => {
    if (!newLevel.level || newLevel.assigned_users.length === 0) return;
    try {
      await onCreateLevel(newLevel);
      setNewLevel({ level: '', assigned_users: [], description: '' });
      setIsModalOpen(false);
    } catch (error) {
      return;
    }
  };

  const handleDeleteLevel = async (id) => {
    if (!confirm('Are you sure you want to delete this escalation level?')) return;
    try {
      await onDeleteLevel(id);
    } catch (error) {
      return;
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : `User ${userId}`;
  };

  const Toggle = ({ isToggled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isToggled ? 'bg-[#3EBF0F]' : 'bg-[#DFE1E6]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isToggled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  
const LevelForm = ({ level, onSave, onCancel }) => {
  const [formData, setFormData] = useState(level);

  useEffect(() => {
    setFormData(level);
  }, [level]);

  const handleSubmit = () => {
    if (!formData.level || formData.assigned_users.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const formattedData = {
      ...formData,
      assigned_users: formData.assigned_users.map(user => user.value)
    };

    onSave(formattedData);
  };

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.first_name} ${user.last_name}`
  }));

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-white mb-2">
            Level <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.level}
            onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-sm"
            placeholder="Enter level number"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-white mb-2">
            Assigned Staff <span className="text-red-500">*</span>
          </label>
          <Select
        isMulti
        name="assigned_users"
        options={userOptions}
        value={formData.assigned_users}
        onChange={(selected) =>
          setFormData(prev => ({ ...prev, assigned_users: selected || [] }))
        }
        className="text-sm"
        classNamePrefix="select"
      />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium dark:text-white mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-sm"
          placeholder="Enter description"
          rows="3"
        />
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          <X size={16} className="inline mr-1" /> Cancel
        </button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-[#3EBF0F] text-white text-sm font-medium rounded-lg hover:bg-[#2fa00d] transition-colors" disabled={loading}>
          <Save size={16} className="inline mr-1" /> {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};


  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-6 dark:text-white">Set up your preferences for automated AI-driven escalation</h2>

      {[{
        label: 'Escalation Enabled',
        desc: 'Enable escalation for unresolved issues',
        key: 'escalation_enabled'
      }, {
        label: 'Email Notifications',
        desc: 'Send escalation notifications via email',
        key: 'escalation_email_enabled'
      }, {
        label: 'In app notification',
        desc: 'Send escalation notifications via app',
        key: 'escalation_websocket_enabled'
      }].map(({ label, desc, key }) => (
        <div key={key} className="flex items-center justify-between mb-6">
          <div>
            <p className="font-medium dark:text-white">{label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
          </div>
          <Toggle isToggled={escalationSettings[key]} onToggle={() => handleEscalationToggle(key)} />
        </div>
      ))}

      <div className="mb-6">
        <p className="font-medium dark:text-white mb-2">Escalation Threshold (Minutes)</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Time to wait before escalating</p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={tempThresholdMinutes}
            onChange={(e) => handleThresholdMinutesChange(e.target.value)}
            placeholder="1h 00m"
            className="pl-3 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm w-32 text-center"
          />
          <button onClick={saveThresholdMinutes} className="px-4 py-2 bg-[#3EBF0F] text-white text-sm font-medium rounded-lg hover:bg-[#2fa00d] transition-colors">Save</button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-medium dark:text-white">Escalation Levels</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure escalation levels and assign users</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-[#3EBF0F] text-white text-sm font-medium rounded-lg hover:bg-[#2fa00d] transition-colors">
            <Plus size={16} className="inline mr-1" /> Add Level
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setNewLevel({ level: '', assigned_users: [], description: '' });
          }}
          title="Add Escalation Level"
          showFooter={false}
        >
          <LevelForm
            level={newLevel}
            onSave={(data) => {
              setNewLevel(data);
              handleAddLevel();
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>

        <div className="space-y-4">
          {loading && escalationLevels.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading escalation levels...</div>
          ) : escalationLevels.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">No escalation levels configured yet. Add your first level to get started.</div>
          ) : (
            escalationLevels.map(level => (
              <div key={level.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#3EBF0F] text-white">Level {level.level}</span>
                      <div className="flex items-center space-x-2">
                        {level.assigned_users.map(userId => (
                          <span key={userId} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{getUserName(userId)}</span>
                        ))}
                      </div>
                    </div>
                    {level.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{level.description}</p>}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button onClick={() => handleDeleteLevel(level.id)} className="p-2 text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EscalationSettings;