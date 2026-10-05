import React, { useState } from 'react';
import { Copy, Trash2, Check, Sparkles } from 'lucide-react';
import { hexOf } from '../data/unicodeData';

interface ComposerProps {
  text: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const Composer: React.FC<ComposerProps> = ({ text, onChangeText, onClear }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }).catch(() => {});
  };

  // Convert text into array of individual code points for detailed inspection
  const codePoints = Array.from(text).map((char) => {
    const cp = char.codePointAt(0) || 0;
    return {
      char,
      cp,
      hex: hexOf(cp),
    };
  });

  const samplePresets = [
    { label: 'Math theorem', text: '∀x ∈ ℝ : e^(iπ) + 1 = 0' },
    { label: 'Flowchart arrows', text: 'START ──▶ CHECK ──▶ SUCCESS ✔' },
    { label: 'Greek alphabet', text: 'α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω' },
    { label: 'Special emoji', text: '🚀 🏳️‍🌈 🏴‍☠️ 👩‍💻 🍕 ❤️' },
  ];

  return (
    <div className="w-full flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-100/80 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Active Text Buffer
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-200/80 dark:bg-neutral-700/80 text-neutral-600 dark:text-neutral-300 font-mono">
            {Array.from(text).length} chars ({text.length} UTF-16 code units)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            disabled={!text}
            title="Copy text buffer"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !text
                ? 'opacity-40 cursor-not-allowed text-neutral-400'
                : copied
                ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
                : 'bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-700/80 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={onClear}
            disabled={!text}
            title="Clear buffer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Real-time editable textarea */}
      <div className="p-3.5">
        <textarea
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Tap characters on the keyboard below or type here directly..."
          rows={3}
          className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-200/80 dark:border-neutral-800"
        />

        {/* Quick presets pills */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1 shrink-0 font-medium">
            <Sparkles size={12} /> Samples:
          </span>
          {samplePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onChangeText(preset.text)}
              className="px-2.5 py-1 rounded-full text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 whitespace-nowrap transition-colors border border-neutral-200/60 dark:border-neutral-700/60"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Live Hex Stream of typed characters */}
        {codePoints.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 block">
              Character Breakdown & Code Points:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {codePoints.map((item, idx) => (
                <div
                  key={`${item.hex}-${idx}`}
                  title={`${item.char} - ${item.hex}`}
                  className="flex flex-col items-center px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-center shrink-0 min-w-[36px]"
                >
                  <span className="text-sm font-sans text-neutral-900 dark:text-neutral-100">
                    {item.char === ' ' ? '␣' : item.char}
                  </span>
                  <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    {item.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
