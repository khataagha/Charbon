export interface CharbonSettings {
  theme: 'light' | 'dark' | 'system';
  keyHeight: 'compact' | 'medium' | 'tall';
  charSize: 'small' | 'medium' | 'large';
  showInfo: boolean;
  vibrate: boolean;
  sound: boolean;
  autoRecent: boolean;
  recentLimit: number;
}

const DEFAULT_SETTINGS: CharbonSettings = {
  theme: 'system',
  keyHeight: 'medium',
  charSize: 'medium',
  showInfo: true,
  vibrate: true,
  sound: false,
  autoRecent: true,
  recentLimit: 32,
};

const STORAGE_KEYS = {
  SETTINGS: 'charbon_settings',
  RECENT: 'charbon_recent',
  FAVORITES: 'charbon_favorites',
};

// Initial default favorites matching common useful symbols
const DEFAULT_FAVORITES = [
  'U+2192', // →
  'U+2190', // ←
  'U+2713', // ✓
  'U+2764 U+FE0F', // ❤️
  'U+221E', // ∞
  'U+20AC', // €
  'U+00A9', // ©
  'U+2605', // ★
  'U+1F680', // 🚀
  'U+2248', // ≈
];

const DEFAULT_RECENT = [
  'U+2192',
  'U+2194',
  'U+2713',
  'U+2605',
  'U+2318',
  'U+03B1',
  'U+03C0',
  'U+2211',
];

export class CharbonStorage {
  static getSettings(): CharbonSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: CharbonSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore storage quota errors
    }
  }

  static getRecent(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RECENT);
      if (raw === null) return DEFAULT_RECENT;
      return raw.split('\n').filter(Boolean);
    } catch {
      return DEFAULT_RECENT;
    }
  }

  static saveRecent(list: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT, list.join('\n'));
    } catch {
      // ignore
    }
  }

  static addRecent(key: string, limit = 32): string[] {
    const list = this.getRecent().filter((k) => k !== key);
    list.unshift(key);
    const trimmed = list.slice(0, Math.max(1, limit));
    this.saveRecent(trimmed);
    return trimmed;
  }

  static clearRecent(): void {
    localStorage.removeItem(STORAGE_KEYS.RECENT);
  }

  static getFavorites(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (raw === null) return DEFAULT_FAVORITES;
      return raw.split('\n').filter(Boolean);
    } catch {
      return DEFAULT_FAVORITES;
    }
  }

  static saveFavorites(list: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, list.join('\n'));
    } catch {
      // ignore
    }
  }

  static isFavorite(key: string): boolean {
    return this.getFavorites().includes(key);
  }

  static toggleFavorite(key: string): boolean {
    const list = this.getFavorites();
    const idx = list.indexOf(key);
    let isNowFav = false;
    if (idx >= 0) {
      list.splice(idx, 1);
      isNowFav = false;
    } else {
      list.unshift(key);
      isNowFav = true;
    }
    this.saveFavorites(list);
    return isNowFav;
  }

  static clearFavorites(): void {
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  }

  static resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.RECENT);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  }
}
