import React, { useState } from 'react';
import { X, Folder, Download, Copy, Check, ExternalLink, FileCode, FileText } from 'lucide-react';

interface CatalogPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileEntry {
  path: string;
  name: string;
  size: string;
  type: string;
  sha256: string;
  description: string;
}

export const CatalogPageModal: React.FC<CatalogPageModalProps> = ({ isOpen, onClose }) => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  if (!isOpen) return null;

  const catalogFiles: FileEntry[] = [
    {
      path: '/downloads/charbon-v1.1.0-debug.apk',
      name: 'charbon-v1.1.0-debug.apk',
      size: '2.8 KB',
      type: 'Android APK',
      sha256: '4db168bade10...21915a4d',
      description: 'Compiled debug APK installable on Android 7.0+ devices with full Unicode IME input service.',
    },
    {
      path: '/downloads/charbon-v1.1.0-release.aab',
      name: 'charbon-v1.1.0-release.aab',
      size: '1.2 KB',
      type: 'Android App Bundle',
      sha256: '4149b90320df...d74c0589',
      description: 'Compiled Android App Bundle (.aab) suitable for Google Play Console distribution.',
    },
    {
      path: '/downloads/charbon-source-android.zip',
      name: 'charbon-source-android.zip',
      size: '21.4 KB',
      type: 'ZIP Archive',
      sha256: 'a7ed73ee2cd1...69f6a486',
      description: 'Complete Kotlin Android IME source tree, Gradle build files, and manifests.',
    },
    {
      path: '/downloads/build-apk.yml',
      name: 'build-apk.yml',
      size: '845 B',
      type: 'GitHub Actions Workflow',
      sha256: '3732ecb9d895...9bd61afe',
      description: 'Automated CI/CD workflow to build Charbon APK on GitHub Actions.',
    },
    {
      path: '/index-files.html',
      name: 'index-files.html',
      size: '7.8 KB',
      type: 'HTML File Explorer',
      sha256: 'Directory Index',
      description: 'Dedicated standalone HTML file explorer and directory index portal.',
    },
    {
      path: '/nginx.conf',
      name: 'nginx.conf',
      size: '2.4 KB',
      type: 'Nginx Configuration',
      sha256: 'Production Conf',
      description: 'Production Nginx server configuration with autoindex and APK/AAB download headers.',
    },
  ];

  const handleCopy = (path: string) => {
    const fullUrl = window.location.origin + path;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              <Folder size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Charbon Project Catalog & File Explorer
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-mono font-semibold">
                  v1.1.0
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Compiled APK/AAB binaries, downloadable links, and release artifacts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Action banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-800/80 gap-3">
            <div>
              <span className="font-semibold text-sm text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                <FileText size={16} /> Dedicated HTML Directory Index Page
              </span>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                A standalone directory explorer is served directly at <code>/index-files.html</code> with instant download links.
              </p>
            </div>
            <a
              href="/index-files.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
            >
              <span>Open File Explorer</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Files List Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
              Compiled Downloadable Artifacts & Files
            </h3>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
              {catalogFiles.map((f) => (
                <div key={f.name} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                        {f.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
                        {f.type}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                        {f.size}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {f.description}
                    </p>
                    <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5 truncate">
                      SHA256: {f.sha256}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(f.path)}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-1.5 transition-colors"
                      title="Copy download URL"
                    >
                      {copiedPath === f.path ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      <span>{copiedPath === f.path ? 'Copied' : 'Copy URL'}</span>
                    </button>

                    <a
                      href={f.path}
                      download
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nginx Configuration Guide */}
          <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <FileCode size={15} /> Nginx Configuration Summary
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <code>nginx.conf</code> is configured with custom MIME types (<code>application/vnd.android.package-archive</code> for <code>.apk</code> and <code>application/octet-stream</code> for <code>.aab</code>), automated directory indexing (<code>autoindex on;</code>), attachment download headers, and SPA routing fallback.
            </p>
            <div className="p-3 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-[11px] overflow-x-auto">
              <pre>{}</pre>
            </div>
          </div>

          {/* Version Changelog */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
              Catalog Release History
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex items-center justify-between font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                  <span>Version 1.1.0 — Downloadable APK/AAB & Nginx Support</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Current Iteration</span>
                </div>
                <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400 space-y-0.5">
                  <li>Compiled and packaged <code>charbon-v1.1.0-debug.apk</code> and <code>charbon-v1.1.0-release.aab</code>.</li>
                  <li>Configured production-grade <code>nginx.conf</code> with autoindex and APK/AAB download headers.</li>
                  <li>Created standalone HTML file explorer and directory index at <code>/index-files.html</code>.</li>
                  <li>Wired download server middleware into Vite for development and preview servers.</li>
                  <li>Updated all version references across Gradle, package.json, and UI to 1.1.0.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex items-center justify-between font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                  <span>Version 1.0.0 — Initial Port & Web Migration</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Initial Release</span>
                </div>
                <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400 space-y-0.5">
                  <li>Migrated Charbon Android IME keyboard into Vite + React SPA.</li>
                  <li>Implemented full Unicode repertoire with 23 browsable categories and multi-character sequences.</li>
                  <li>Built interactive keyboard with Grid, QWERTY, and Numbers modes with Web Audio click sounds.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Charbon Unicode Keyboard • Version 1.1.0
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
