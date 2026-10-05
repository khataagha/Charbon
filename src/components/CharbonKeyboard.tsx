import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CATEGORIES,
  nameFor,
  blockNameFor,
  generalCategoryFor,
  keyOf,
  codePointsOfKey,
  textOf,
  itemsForCategory,
  searchCharacters,
  isCombiningMark,
} from '../data/unicodeData';
import { CharbonSettings, CharbonStorage } from '../services/prefs';
import { playKeyClick, triggerHaptic } from '../services/audioHaptics';
import {
  Settings,
  Search,
  Star,
  Copy,
  Check,
  X,
  Globe,
  CornerDownLeft,
  Delete,
  Space,
} from 'lucide-react';

export type KeyboardMode = 'grid' | 'abc' | 'num';

interface CharbonKeyboardProps {
  onCommit: (text: string, keyStr: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSpace: () => void;
  onOpenSettings: () => void;
  settings: CharbonSettings;
  onUpdateSettings?: (newSettings: CharbonSettings) => void;
}

export const CharbonKeyboard: React.FC<CharbonKeyboardProps> = ({
  onCommit,
  onBackspace,
  onEnter,
  onSpace,
  onOpenSettings,
  settings,
}) => {
  const [mode, setMode] = useState<KeyboardMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('arrows');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [shift, setShift] = useState<boolean>(false);
  const [capsLock, setCapsLock] = useState<boolean>(false);

  // Inspected character
  const [inspectedCodePoints, setInspectedCodePoints] = useState<number[]>([0x2192]);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Favorites & Recents state from storage
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  // Page / chunk limit for category rendering
  const [displayLimit, setDisplayLimit] = useState<number>(120);

  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFavorites(CharbonStorage.getFavorites());
    setRecent(CharbonStorage.getRecent());
  }, []);

  const handleFeedback = (type: 'standard' | 'space' | 'delete' | 'action' = 'standard') => {
    if (settings.sound) playKeyClick(type);
    if (settings.vibrate) triggerHaptic(15);
  };

  // Compute character items list
  const currentItems = useMemo(() => {
    if (isSearching && searchQuery.trim().length > 0) {
      return searchCharacters(searchQuery, 300);
    }

    if (selectedCategory === 'recent') {
      return recent.map(codePointsOfKey).filter((arr) => arr.length > 0);
    }
    if (selectedCategory === 'favorites') {
      return favorites.map(codePointsOfKey).filter((arr) => arr.length > 0);
    }

    return itemsForCategory(selectedCategory);
  }, [selectedCategory, searchQuery, isSearching, recent, favorites]);

  // Reset display chunk limit when category or search changes
  useEffect(() => {
    setDisplayLimit(120);
  }, [selectedCategory, searchQuery, isSearching]);

  // Inspected info details
  const inspectedText = useMemo(() => textOf(inspectedCodePoints), [inspectedCodePoints]);
  const inspectedName = useMemo(() => nameFor(inspectedCodePoints), [inspectedCodePoints]);
  const inspectedHex = useMemo(() => keyOf(inspectedCodePoints), [inspectedCodePoints]);
  const inspectedBlock = useMemo(() => {
    return inspectedCodePoints.length === 1
      ? blockNameFor(inspectedCodePoints[0])
      : 'Special Multi-Codepoint Sequence';
  }, [inspectedCodePoints]);
  const inspectedCategory = useMemo(() => generalCategoryFor(inspectedCodePoints), [inspectedCodePoints]);
  const isCurrentlyFavorite = useMemo(() => favorites.includes(inspectedHex), [favorites, inspectedHex]);

  const handleSelectChar = (cps: number[]) => {
    handleFeedback('standard');
    setInspectedCodePoints(cps);
    const text = textOf(cps);
    const keyStr = keyOf(cps);

    // Commit to buffer
    onCommit(text, keyStr);

    // Auto-add to recent if enabled
    if (settings.autoRecent) {
      const updatedRecent = CharbonStorage.addRecent(keyStr, settings.recentLimit);
      setRecent(updatedRecent);
    }
  };

  const handleInspectOnly = (e: React.MouseEvent, cps: number[]) => {
    e.preventDefault();
    handleFeedback('action');
    setInspectedCodePoints(cps);
  };

  const handleToggleFavorite = () => {
    handleFeedback('action');
    const isFav = CharbonStorage.toggleFavorite(inspectedHex);
    setFavorites(CharbonStorage.getFavorites());
    if (isFav && selectedCategory === 'favorites') {
      // Refresh list
    }
  };

  const handleCopyCurrent = () => {
    handleFeedback('action');
    navigator.clipboard.writeText(inspectedText).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 1500);
    }).catch(() => {});
  };

  const handleTabClick = (catId: string) => {
    handleFeedback('action');
    setIsSearching(false);
    setSearchQuery('');
    setSelectedCategory(catId);
    setMode('grid');
  };

  // Keyboard sizing styles
  const heightClasses = {
    compact: 'h-[360px]',
    medium: 'h-[430px]',
    tall: 'h-[500px]',
  }[settings.keyHeight];

  const charFontSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl',
  }[settings.charSize];

  // QWERTY Layout keys
  const qwertyRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  // Number & Symbol Layout keys
  const numRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
    ['.', ',', '?', '!', '\'', '#', '%', '*', '+', '='],
  ];

  return (
    <div
      className={`w-full flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden select-none transition-all duration-200 ${heightClasses}`}
    >
      {/* 1. TOP BAR: Settings gear + Search input */}
      <div className="flex items-center gap-2 p-2.5 bg-neutral-100 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <button
          onClick={() => {
            handleFeedback('action');
            onOpenSettings();
          }}
          title="Open Settings & Info"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-200/70 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
        >
          <Settings size={18} />
        </button>

        <div className="flex-1 relative flex items-center">
          <div className="absolute left-3 text-neutral-400 pointer-events-none">
            <Search size={16} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            placeholder="Search by name (e.g. arrow, heart) or hex (e.g. 2192, U+2192)..."
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(e.target.value.length > 0);
              if (mode !== 'grid') setMode('grid');
            }}
            onFocus={() => {
              setIsSearching(true);
            }}
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              className="absolute right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. CATEGORY TABS (visible in Grid mode) */}
      {mode === 'grid' && (
        <div
          ref={tabsScrollRef}
          className="flex items-center gap-1.5 px-2 py-1.5 overflow-x-auto no-scrollbar bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800 shrink-0"
        >
          {/* Recent */}
          <button
            onClick={() => handleTabClick('recent')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedCategory === 'recent' && !isSearching
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'bg-neutral-200/70 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <span>Recent</span>
            {recent.length > 0 && <span className="opacity-70 text-[10px]">({recent.length})</span>}
          </button>

          {/* Favorites */}
          <button
            onClick={() => handleTabClick('favorites')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedCategory === 'favorites' && !isSearching
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'bg-neutral-200/70 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Star size={11} className={selectedCategory === 'favorites' ? 'fill-current' : ''} />
            <span>Favorites</span>
            {favorites.length > 0 && <span className="opacity-70 text-[10px]">({favorites.length})</span>}
          </button>

          {/* Catalog Categories */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleTabClick(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id && !isSearching
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'bg-neutral-200/70 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* 3. INSPECTION / INFO PANEL (Show character info if enabled) */}
      {settings.showInfo && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-100/90 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Glyph large tile */}
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-700/80 text-2xl font-sans shrink-0 shadow-sm">
              {inspectedText}
            </div>

            {/* Meta text */}
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {inspectedName}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{inspectedHex}</span>
                <span>•</span>
                <span className="truncate">{inspectedBlock}</span>
                <span>•</span>
                <span className="truncate opacity-80">{inspectedCategory}</span>
              </div>
            </div>
          </div>

          {/* Action buttons: Favorite & Copy */}
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <button
              onClick={handleToggleFavorite}
              title={isCurrentlyFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2 rounded-lg transition-colors ${
                isCurrentlyFavorite
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60'
              }`}
            >
              <Star size={16} className={isCurrentlyFavorite ? 'fill-current' : ''} />
            </button>
            <button
              onClick={handleCopyCurrent}
              title="Copy inspected character to clipboard"
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-colors relative"
            >
              {copiedNotification ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 4. MAIN CONTENT AREA: Unicode Grid OR QWERTY OR Number Pad */}
      <div className="flex-1 overflow-y-auto p-2 bg-neutral-50 dark:bg-neutral-950 min-h-0">
        {mode === 'grid' ? (
          <div>
            {currentItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-neutral-400 dark:text-neutral-600 text-center">
                <Search size={32} className="mb-2 opacity-50" />
                <p className="text-sm font-medium">No characters found</p>
                <p className="text-xs">Try searching for an arrow, smiley, Greek letter, or hex like U+2192</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-1.5 justify-items-center">
                  {currentItems.slice(0, displayLimit).map((cps, index) => {
                    const text = textOf(cps);
                    const keyStr = keyOf(cps);
                    const isSelected = keyStr === inspectedHex;
                    const combining = isCombiningMark(cps);

                    return (
                      <button
                        key={`${keyStr}-${index}`}
                        onClick={() => handleSelectChar(cps)}
                        onContextMenu={(e) => handleInspectOnly(e, cps)}
                        title={`${nameFor(cps)} (${keyStr}) - Right click to inspect`}
                        className={`w-11 h-11 flex items-center justify-center rounded-xl font-sans transition-all active:scale-90 relative ${charFontSizes} ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                            : 'bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200/80 dark:border-neutral-800 shadow-xs'
                        }`}
                      >
                        {combining ? `◌${text}` : text}
                      </button>
                    );
                  })}
                </div>

                {/* Show More button if large block */}
                {currentItems.length > displayLimit && (
                  <div className="flex justify-center mt-3 mb-1">
                    <button
                      onClick={() => setDisplayLimit((prev) => prev + 120)}
                      className="px-4 py-1.5 rounded-full text-xs font-medium bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      Load More ({currentItems.length - displayLimit} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : mode === 'abc' ? (
          /* QWERTY LAYOUT */
          <div className="h-full flex flex-col justify-center gap-1.5 max-w-xl mx-auto py-1">
            {qwertyRows.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1.5">
                {rIdx === 2 && (
                  <button
                    onClick={() => {
                      handleFeedback('action');
                      if (shift && !capsLock) {
                        setCapsLock(true);
                      } else if (capsLock) {
                        setCapsLock(false);
                        setShift(false);
                      } else {
                        setShift(true);
                      }
                    }}
                    className={`w-12 h-11 flex items-center justify-center rounded-xl font-semibold text-xs border transition-colors ${
                      capsLock
                        ? 'bg-blue-600 text-white border-blue-600'
                        : shift
                        ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-white border-neutral-400'
                        : 'bg-neutral-200/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    ⇧
                  </button>
                )}

                {row.map((char) => {
                  const letter = shift || capsLock ? char.toUpperCase() : char;
                  return (
                    <button
                      key={char}
                      onClick={() => {
                        handleFeedback('standard');
                        if (isSearching) {
                          setSearchQuery((prev) => prev + letter);
                        } else {
                          onCommit(letter, `U+${letter.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}`);
                        }
                        if (shift && !capsLock) setShift(false);
                      }}
                      className="flex-1 max-w-[48px] h-11 flex items-center justify-center rounded-xl bg-white hover:bg-neutral-100 dark:bg-neutral-800/90 dark:hover:bg-neutral-700/90 text-neutral-900 dark:text-neutral-100 text-base font-medium shadow-xs border border-neutral-200/70 dark:border-neutral-700/70 active:scale-95 transition-transform"
                    >
                      {letter}
                    </button>
                  );
                })}

                {rIdx === 2 && (
                  <button
                    onClick={() => {
                      handleFeedback('delete');
                      if (isSearching) {
                        setSearchQuery((prev) => prev.slice(0, -1));
                      } else {
                        onBackspace();
                      }
                    }}
                    className="w-12 h-11 flex items-center justify-center rounded-xl bg-neutral-200/90 hover:bg-neutral-300 dark:bg-neutral-800/90 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 transition-colors"
                  >
                    <Delete size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* NUMBER & COMMON SYMBOLS LAYOUT */
          <div className="h-full flex flex-col justify-center gap-1.5 max-w-xl mx-auto py-1">
            {numRows.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1.5">
                {row.map((char) => (
                  <button
                    key={char}
                    onClick={() => {
                      handleFeedback('standard');
                      if (isSearching) {
                        setSearchQuery((prev) => prev + char);
                      } else {
                        onCommit(char, `U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}`);
                      }
                    }}
                    className="flex-1 max-w-[48px] h-11 flex items-center justify-center rounded-xl bg-white hover:bg-neutral-100 dark:bg-neutral-800/90 dark:hover:bg-neutral-700/90 text-neutral-900 dark:text-neutral-100 text-base font-mono shadow-xs border border-neutral-200/70 dark:border-neutral-700/70 active:scale-95 transition-transform"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. PRACTICAL CONTROL BAR */}
      <div className="flex items-center gap-1.5 p-2 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
        {/* Mode switch ABC */}
        <button
          onClick={() => {
            handleFeedback('action');
            setMode(mode === 'abc' ? 'grid' : 'abc');
          }}
          className={`h-11 px-3.5 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center ${
            mode === 'abc'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-sm'
              : 'bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-300/80 dark:border-neutral-700/80'
          }`}
        >
          ABC
        </button>

        {/* Mode switch ?123 */}
        <button
          onClick={() => {
            handleFeedback('action');
            setMode(mode === 'num' ? 'grid' : 'num');
          }}
          className={`h-11 px-3 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center ${
            mode === 'num'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-sm'
              : 'bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-300/80 dark:border-neutral-700/80'
          }`}
        >
          ?123
        </button>

        {/* Mode switch ⌘ (Unicode grid) */}
        <button
          onClick={() => {
            handleFeedback('action');
            setMode('grid');
          }}
          className={`h-11 px-3.5 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center ${
            mode === 'grid'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-sm'
              : 'bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-300/80 dark:border-neutral-700/80'
          }`}
        >
          ⌘
        </button>

        {/* Space Bar */}
        <button
          onClick={() => {
            handleFeedback('space');
            if (isSearching) {
              setSearchQuery((prev) => prev + ' ');
            } else {
              onSpace();
            }
          }}
          className="flex-1 h-11 flex items-center justify-center rounded-xl bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-300/80 dark:border-neutral-700/80 shadow-xs active:scale-[0.98] transition-transform text-xs font-medium"
        >
          <Space size={16} className="mr-1.5 opacity-60" />
          <span>Space</span>
        </button>

        {/* Backspace */}
        <button
          onClick={() => {
            handleFeedback('delete');
            if (isSearching) {
              setSearchQuery((prev) => prev.slice(0, -1));
            } else {
              onBackspace();
            }
          }}
          title="Backspace"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-300/80 dark:border-neutral-700/80 transition-colors"
        >
          <Delete size={17} />
        </button>

        {/* Enter / Newline */}
        <button
          onClick={() => {
            handleFeedback('action');
            if (isSearching) {
              setIsSearching(false);
            } else {
              onEnter();
            }
          }}
          title="Enter / Next line"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-300/80 dark:border-neutral-700/80 transition-colors"
        >
          <CornerDownLeft size={17} />
        </button>

        {/* Switch layout button 🌐 */}
        <button
          onClick={() => {
            handleFeedback('action');
            setMode((prev) => (prev === 'grid' ? 'abc' : prev === 'abc' ? 'num' : 'grid'));
          }}
          title="Cycle keyboard layout (Grid -> ABC -> ?123)"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-300/80 dark:border-neutral-700/80 transition-colors"
        >
          <Globe size={17} />
        </button>
      </div>
    </div>
  );
};
