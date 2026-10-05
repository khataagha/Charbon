import React, { useState, useEffect } from 'react';
import { CharbonKeyboard } from './components/CharbonKeyboard';
import { Composer } from './components/Composer';
import { SettingsModal } from './components/SettingsModal';
import { CharbonSettings, CharbonStorage } from './services/prefs';
import { Settings, Smartphone, Moon, Sun, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [settings, setSettings] = useState<CharbonSettings>(() => CharbonStorage.getSettings());
  const [textBuffer, setTextBuffer] = useState<string>('Hello Charbon ⌘ → ★');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('dark');

  // Handle system vs explicit theme
  useEffect(() => {
    const updateTheme = () => {
      let isDark = false;
      if (settings.theme === 'dark') {
        isDark = true;
      } else if (settings.theme === 'light') {
        isDark = false;
      } else {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setActiveTheme(isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [settings.theme]);

  // Buffer actions triggered from keyboard
  const handleCommit = (chars: string) => {
    setTextBuffer((prev) => prev + chars);
  };

  const handleBackspace = () => {
    setTextBuffer((prev) => {
      if (!prev) return '';
      // Correctly handle multi-byte surrogate pairs and unicode graphemes
      const arr = Array.from(prev);
      arr.pop();
      return arr.join('');
    });
  };

  const handleEnter = () => {
    setTextBuffer((prev) => prev + '\n');
  };

  const handleSpace = () => {
    setTextBuffer((prev) => prev + ' ');
  };

  const handleSaveSettings = (newSettings: CharbonSettings) => {
    setSettings(newSettings);
    CharbonStorage.saveSettings(newSettings);
  };

  const handleDataReset = () => {
    setSettings(CharbonStorage.getSettings());
  };

  const toggleThemeQuick = () => {
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
    handleSaveSettings({ ...settings, theme: nextTheme });
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* App Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              ⌘
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100">
                  Charbon
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold">
                  v1.0.0
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:block">
                Universal Unicode Keyboard & Character Inspector
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleThemeQuick}
              title={`Switch to ${activeTheme === 'dark' ? 'Light' : 'Dark'} theme`}
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {activeTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Settings & APK Guide"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold transition-colors"
            >
              <Settings size={15} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Active Composer / Typing Buffer */}
        <section>
          <Composer
            text={textBuffer}
            onChangeText={setTextBuffer}
            onClear={() => setTextBuffer('')}
          />
        </section>

        {/* Charbon Universal Unicode Keyboard */}
        <section className="flex-1">
          <CharbonKeyboard
            onCommit={handleCommit}
            onBackspace={handleBackspace}
            onEnter={handleEnter}
            onSpace={handleSpace}
            onOpenSettings={() => setIsSettingsOpen(true)}
            settings={settings}
            onUpdateSettings={handleSaveSettings}
          />
        </section>

        {/* Key Features & Tips footer bar */}
        <footer className="mt-2 py-3 px-4 rounded-xl bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-500 dark:text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck size={14} /> 100% Offline & Private
            </span>
            <span>•</span>
            <span>Native Android IME codebase in <code className="font-mono text-neutral-700 dark:text-neutral-300">/android</code></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Smartphone size={13} /> Android APK Instructions
            </button>
          </div>
        </footer>
      </main>

      {/* Settings & Android Build Info Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onDataReset={handleDataReset}
      />
    </div>
  );
};
