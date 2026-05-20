import { Download, RotateCcw, Upload } from 'lucide-react';
import { Button } from '../components/Button.jsx';

export function SettingsPage({ settings, setSettings, tasks, importTasks, resetAll, toast }) {
  function exportJson() {
    const blob = new Blob([JSON.stringify({ tasks, settings }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tempo-ai-planner.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Export ready');
  }

  function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        importTasks(data.tasks || []);
        toast('Tasks imported');
      } catch {
        toast('Import failed');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="panel">
        <p className="eyebrow">Profile</p>
        <h2 className="section-title">Workspace settings</h2>
        <div className="mt-5 space-y-4">
          <label className="block"><span className="label">Name</span><input className="input mt-1" value={settings.profileName} onChange={(event) => setSettings((current) => ({ ...current, profileName: event.target.value }))} /></label>
          <label className="block"><span className="label">Theme</span><select className="input mt-1" value={settings.theme} onChange={(event) => setSettings((current) => ({ ...current, theme: event.target.value }))}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
          <label className="block"><span className="label">Time format</span><select className="input mt-1" value={settings.timeFormat} onChange={(event) => setSettings((current) => ({ ...current, timeFormat: event.target.value }))}><option value="12">12-hour</option><option value="24">24-hour</option></select></label>
          <label className="block"><span className="label">Default reminder</span><select className="input mt-1" value={settings.defaultReminderMinutes} onChange={(event) => setSettings((current) => ({ ...current, defaultReminderMinutes: Number(event.target.value) }))}><option value="10">10 minutes</option><option value="30">30 minutes</option><option value="60">1 hour</option><option value="1440">1 day</option></select></label>
        </div>
      </section>
      <section className="panel">
        <p className="eyebrow">Controls</p>
        <h2 className="section-title">Notifications and data</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ['notifications', 'Browser notifications'],
            ['reminderSound', 'Reminder sound'],
            ['vibration', 'Vibration']
          ].map(([key, label]) => (
            <label key={key} className="toggle-row">
              <span>{label}</span>
              <input type="checkbox" checked={settings[key]} onChange={() => setSettings((current) => ({ ...current, [key]: !current[key] }))} />
            </label>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="subtle" onClick={exportJson}><Download size={16} /> Export JSON</Button>
          <label className="button cursor-pointer bg-white/70 text-slate-700 hover:bg-white dark:bg-white/10 dark:text-slate-200"><Upload size={16} /> Import JSON<input type="file" accept="application/json" className="hidden" onChange={handleImport} /></label>
          <Button variant="danger" onClick={resetAll}><RotateCcw size={16} /> Reset data</Button>
        </div>
      </section>
    </div>
  );
}
