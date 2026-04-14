import React, { useMemo, useState } from 'react';

const TIMEZONE_OPTIONS = [
  { value: 'Africa/Lagos', label: 'Africa/Lagos (UTC+1)' },
];

const Toggle = ({ isToggled, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isToggled ? 'bg-[#3EBF0F]' : 'bg-[#DFE1E6]'
      }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isToggled ? 'translate-x-6' : 'translate-x-1'
        }`}
    />
  </button>
);

const DailyAnalysisSettings = ({ settings, setSettings, onSave, onTestAuth, connectors, loading }) => {
  const [savedMessage, setSavedMessage] = useState('');
  const [testingMessage, setTestingMessage] = useState('');

  const emailString = useMemo(
    () => (settings.daily_analysis_extra_emails || []).join(', '),
    [settings.daily_analysis_extra_emails]
  );
  const nextRunText = useMemo(() => {
    if (!settings.next_daily_analysis_run_at) return 'Not scheduled yet';
    const date = new Date(settings.next_daily_analysis_run_at);
    if (Number.isNaN(date.getTime())) return settings.next_daily_analysis_run_at;
    return date.toLocaleString();
  }, [settings.next_daily_analysis_run_at]);

  const handleChange = (field, value) => {
    setSavedMessage('');
    setTestingMessage('');
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailsChange = (value) => {
    const emails = value
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(Boolean);

    handleChange('daily_analysis_extra_emails', [...new Set(emails)]);
  };

  const handleSave = async () => {
    await onSave(settings);
    setSavedMessage('Daily analysis settings saved.');
  };

  const handleTest = async () => {
    const data = await onTestAuth(settings);
    const count = (data.connectors || []).length;
    setTestingMessage(`AI service connected. ${count} OmniCRM connector${count === 1 ? '' : 's'} available.`);
  };

  return (
    <div className="ms-10 max-w-4xl pb-16">
      <h2 className="text-lg font-semibold mb-2">Daily Message Analysis</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Schedule one daily analysis window for your company.
      </p>

      <div className="space-y-6">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium dark:text-white">Enable Daily Message Analysis</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                When enabled, OmniCRM will submit the previous 24-hour window to the AI service once per day.
              </p>
            </div>
            <Toggle
              isToggled={settings.daily_analysis_enabled}
              onToggle={() => handleChange('daily_analysis_enabled', !settings.daily_analysis_enabled)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-white mb-2">Analysis Time</label>
              <input
                type="time"
                value={(settings.daily_analysis_time || '20:00:00').slice(0, 5)}
                onChange={(e) => handleChange('daily_analysis_time', `${e.target.value}:00`)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-white mb-2">Timezone</label>
              <select
                value={settings.daily_analysis_timezone || 'Africa/Lagos'}
                onChange={(e) => handleChange('daily_analysis_timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-sm"
              >
                {TIMEZONE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800">
          <p className="font-medium dark:text-white mb-2">Recipients</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Extra recipients are optional. Company primary emails already count as recipients if they exist.
          </p>
          <textarea
            rows="4"
            value={emailString}
            onChange={(e) => handleEmailsChange(e.target.value)}
            placeholder="ops@company.com, owner@gmail.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800">
          <p className="font-medium dark:text-white mb-2">AI Service Connection</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Store company-specific AI service credentials so OmniCRM can refresh the token automatically before submission.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium dark:text-white mb-2">LLM Email</label>
              <input
                type="email"
                value={settings.llm_email || ''}
                onChange={(e) => handleChange('llm_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-sm"
                placeholder="sales@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-white mb-2">LLM Password</label>
              <input
                type="password"
                value={settings.llm_password || ''}
                onChange={(e) => handleChange('llm_password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-sm"
                placeholder={settings.llm_password_masked || 'Enter AI service password'}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Leave blank to keep the saved password.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-end mb-4">
            <button
              type="button"
              onClick={handleTest}
              disabled={loading}
              className="px-4 py-2 bg-white border border-[#3EBF0F] text-[#3EBF0F] text-sm font-medium rounded-lg hover:bg-green-50 transition-colors disabled:opacity-60"
            >
              {loading ? 'Testing...' : 'Test AI Service Login'}
            </button>

            {testingMessage && (
              <p className="text-sm text-[#3EBF0F]">{testingMessage}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-white mb-2">OmniCRM Connector on AI Service</label>
            <select
              value={settings.daily_analysis_connector_id || ''}
              onChange={(e) => handleChange('daily_analysis_connector_id', e.target.value)}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="">Select connector</option>
              {(connectors || []).map(connector => (
                <option key={connector.id} value={connector.id}>
                  {connector.label} (ID: {connector.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-[#3EBF0F] text-white text-sm font-medium rounded-lg hover:bg-[#2fa00d] transition-colors disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Daily Analysis Settings'}
          </button>

          {savedMessage && (
            <p className="text-sm text-[#3EBF0F]">{savedMessage}</p>
          )}
        </div>

        {(settings.last_daily_analysis_status || settings.last_daily_analysis_window_end || settings.last_daily_analysis_error) && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800">
            <p className="font-medium dark:text-white mb-2">Daily Analysis Status</p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>
                AI Service Connection: {settings.last_daily_analysis_status === 'pending' ? 'Connected' : settings.last_daily_analysis_status === 'failed' ? 'Needs attention' : 'Not tested yet'}
              </p>
              <p>
                Next Scheduled Run: {nextRunText}
              </p>
              <p>
                Daily Analysis Job: {settings.last_daily_analysis_window_end ? 'Completed at least once' : 'Not run yet'}
              </p>
              <p>
                Last Successful Analysis Window: {settings.last_daily_analysis_window_end || 'Not run yet'}
              </p>
              <p>
                Last Error: {settings.last_daily_analysis_error || 'None'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyAnalysisSettings;
