import React, { useState } from 'react';
import { X, Smartphone, Check, ShieldCheck } from 'lucide-react';
import { CharbonSettings, CharbonStorage } from '../services/prefs';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CharbonSettings;
  onSaveSettings: (settings: CharbonSettings) => void;
  onDataReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onDataReset,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'apk'>('settings');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const updateSetting = <K extends keyof CharbonSettings>(key: K, value: CharbonSettings[K]) => {
    const updated = { ...settings, [key]: value };
    onSaveSettings(updated);
    showToast('Saved');
  };

  const handleClearRecent = () => {
    CharbonStorage.clearRecent();
    onDataReset();
    showToast('Recent history cleared');
  };

  const handleClearFavorites = () => {
    CharbonStorage.clearFavorites();
    onDataReset();
    showToast('Favorites cleared');
  };

  const handleResetAll = () => {
    CharbonStorage.resetAll();
    onDataReset();
    showToast('All settings & data reset');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span>Charbon Preferences</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Universal Unicode Keyboard & Explorer (v1.0.0)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900 px-6 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Settings & Appearance
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`pb-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'apk'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Smartphone size={14} />
            Android Native APK
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {activeTab === 'settings' ? (
            <>
              {/* Appearance */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-3">
                  Appearance
                </span>

                {/* Theme */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['light', 'dark', 'system'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => updateSetting('theme', t)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                          settings.theme === t
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Height */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Keyboard Height
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['compact', 'medium', 'tall'] as const).map((h) => (
                      <button
                        key={h}
                        onClick={() => updateSetting('keyHeight', h)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                          settings.keyHeight === h
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Character Size */}
                <div>
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Character Grid Glyph Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['small', 'medium', 'large'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateSetting('charSize', s)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                          settings.charSize === s
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Behavior */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-3">
                  Behavior & Feedback
                </span>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">
                        Sound on key press
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        Plays soft mechanical audio feedback when tapping keys
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.sound}
                      onChange={(e) => updateSetting('sound', e.target.checked)}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">
                        Haptic vibration on key press
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        Vibrates supported devices when keys are pressed
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.vibrate}
                      onChange={(e) => updateSetting('vibrate', e.target.checked)}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">
                        Auto-add to Recent
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        Automatically saves newly inserted characters to Recent tab
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoRecent}
                      onChange={(e) => updateSetting('autoRecent', e.target.checked)}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">
                        Show character info panel
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        Displays glyph preview, Unicode code point, name, and block
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showInfo}
                      onChange={(e) => updateSetting('showInfo', e.target.checked)}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-3">
                  Data & History
                </span>

                <div className="space-y-2">
                  <button
                    onClick={handleClearRecent}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors text-left flex items-center justify-between"
                  >
                    <span>Clear Recently Used</span>
                    <span className="text-[10px] text-neutral-400">Reset recent characters</span>
                  </button>

                  <button
                    onClick={handleClearFavorites}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors text-left flex items-center justify-between"
                  >
                    <span>Clear Favorites</span>
                    <span className="text-[10px] text-neutral-400">Reset saved favorites</span>
                  </button>

                  <button
                    onClick={handleResetAll}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors text-left flex items-center justify-between"
                  >
                    <span>Reset All Settings & History</span>
                    <span className="text-[10px] text-red-400">Default values</span>
                  </button>
                </div>
              </div>

              {/* Privacy notice matching MainActivity.kt */}
              <div className="p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/60 flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  <strong>Privacy Guarantee:</strong> Charbon works 100% offline and never transmits anything you type.
                  Recent and favorites are stored purely on your local device.
                </p>
              </div>
            </>
          ) : (
            /* Android APK Guide Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1 flex items-center gap-1.5">
                  <Smartphone size={16} /> Native Android IME Keyboard APK
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                  The original source code of <strong>Charbon</strong> is an Android Input Method Service (IME).
                  The complete Kotlin source code is preserved in the repository under <code className="font-mono bg-blue-100 dark:bg-blue-900/80 px-1 py-0.5 rounded">/android</code> and can be compiled into an installable APK for Android 7.0+ devices.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  How to Build the APK on GitHub:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  <li>
                    The repository includes the GitHub Actions workflow at <code className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">.github/workflows/build-apk.yml</code>.
                  </li>
                  <li>
                    Push this repository to GitHub or run the workflow from the <strong>Actions</strong> tab.
                  </li>
                  <li>
                    When the action finishes running, open the run and download the artifact named <code className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">charbon-debug-apk</code>.
                  </li>
                  <li>
                    Inside is <code className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">app-debug.apk</code>. Copy it to your Android phone and install.
                  </li>
                  <li>
                    In Android Settings, navigate to <em>Language & Input &gt; Keyboards</em> and enable <strong>Charbon Keyboard</strong>.
                  </li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Android Package Information
                </span>
                <div className="space-y-1 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                  <div>Package: uni.charbon.keyboard</div>
                  <div>Min SDK: 24 (Android 7.0+) | Target SDK: 34</div>
                  <div>Permissions: Offline, NO INTERNET required</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            {toastMsg ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check size={14} /> {toastMsg}
              </span>
            ) : (
              'Changes saved automatically'
            )}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
