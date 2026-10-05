export interface BlockRange {
  name: string;
  start: number;
  end: number;
}

export interface CharCategory {
  id: string;
  label: string;
  blocks: BlockRange[];
}

export interface UnicodeCharInfo {
  codePoints: number[];
  text: string;
  hex: string;
  name: string;
  block: string;
  category: string;
  script?: string;
  isCombining?: boolean;
}

export const CATEGORIES: CharCategory[] = [
  {
    id: 'arrows',
    label: 'Arrows',
    blocks: [
      { name: 'Arrows', start: 0x2190, end: 0x21ff },
      { name: 'Supplemental Arrows-A', start: 0x27f0, end: 0x27ff },
      { name: 'Supplemental Arrows-B', start: 0x2900, end: 0x297f },
      { name: 'Miscellaneous Symbols and Arrows', start: 0x2b00, end: 0x2bff },
    ],
  },
  {
    id: 'math',
    label: 'Mathematical',
    blocks: [
      { name: 'Mathematical Operators', start: 0x2200, end: 0x22ff },
      { name: 'Miscellaneous Mathematical Symbols-A', start: 0x27c0, end: 0x27ef },
      { name: 'Miscellaneous Mathematical Symbols-B', start: 0x2980, end: 0x29ff },
      { name: 'Supplemental Mathematical Operators', start: 0x2a00, end: 0x2aff },
    ],
  },
  {
    id: 'currency',
    label: 'Currency',
    blocks: [{ name: 'Currency Symbols', start: 0x20a0, end: 0x20cf }],
  },
  {
    id: 'emoji',
    label: 'Emoji',
    blocks: [
      { name: 'Emoticons', start: 0x1f600, end: 0x1f64f },
      { name: 'Miscellaneous Symbols and Pictographs', start: 0x1f300, end: 0x1f5ff },
      { name: 'Transport and Map Symbols', start: 0x1f680, end: 0x1f6ff },
      { name: 'Supplemental Symbols and Pictographs', start: 0x1f900, end: 0x1f9ff },
    ],
  },
  {
    id: 'shapes',
    label: 'Shapes & Blocks',
    blocks: [
      { name: 'Geometric Shapes', start: 0x25a0, end: 0x25ff },
      { name: 'Box Drawing', start: 0x2500, end: 0x257f },
      { name: 'Block Elements', start: 0x2580, end: 0x259f },
    ],
  },
  {
    id: 'letterlike',
    label: 'Letterlike',
    blocks: [
      { name: 'Letterlike Symbols', start: 0x2100, end: 0x214f },
      { name: 'Number Forms', start: 0x2150, end: 0x218f },
    ],
  },
  {
    id: 'super',
    label: 'Super/Sub',
    blocks: [{ name: 'Superscripts and Subscripts', start: 0x2070, end: 0x209f }],
  },
  {
    id: 'enclosed',
    label: 'Enclosed',
    blocks: [{ name: 'Enclosed Alphanumerics', start: 0x2460, end: 0x24ff }],
  },
  {
    id: 'dingbats',
    label: 'Dingbats',
    blocks: [{ name: 'Dingbats', start: 0x2700, end: 0x27bf }],
  },
  {
    id: 'misc',
    label: 'Misc Symbols',
    blocks: [{ name: 'Miscellaneous Symbols', start: 0x2600, end: 0x26ff }],
  },
  {
    id: 'technical',
    label: 'Technical',
    blocks: [
      { name: 'Miscellaneous Technical', start: 0x2300, end: 0x23ff },
      { name: 'Control Pictures', start: 0x2400, end: 0x243f },
      { name: 'Optical Character Recognition', start: 0x2440, end: 0x245f },
    ],
  },
  {
    id: 'punctuation',
    label: 'Punctuation',
    blocks: [{ name: 'General Punctuation', start: 0x2000, end: 0x206f }],
  },
  {
    id: 'greek',
    label: 'Greek',
    blocks: [
      { name: 'Greek and Coptic', start: 0x0370, end: 0x03ff },
      { name: 'Greek Extended', start: 0x1f00, end: 0x1fff },
    ],
  },
  {
    id: 'latin',
    label: 'Latin',
    blocks: [
      { name: 'Basic Latin', start: 0x0021, end: 0x007e },
      { name: 'Latin-1 Supplement', start: 0x00a1, end: 0x00ff },
      { name: 'Latin Extended-A', start: 0x0100, end: 0x017f },
      { name: 'Latin Extended-B', start: 0x0180, end: 0x024f },
      { name: 'IPA Extensions', start: 0x0250, end: 0x02af },
      { name: 'Latin Extended Additional', start: 0x1e00, end: 0x1eff },
    ],
  },
  {
    id: 'cyrillic',
    label: 'Cyrillic',
    blocks: [
      { name: 'Cyrillic', start: 0x0400, end: 0x04ff },
      { name: 'Cyrillic Supplement', start: 0x0500, end: 0x052f },
    ],
  },
  {
    id: 'hebrew',
    label: 'Hebrew',
    blocks: [{ name: 'Hebrew', start: 0x0590, end: 0x05ff }],
  },
  {
    id: 'arabic',
    label: 'Arabic',
    blocks: [
      { name: 'Arabic', start: 0x0600, end: 0x06ff },
      { name: 'Arabic Supplement', start: 0x0750, end: 0x077f },
    ],
  },
  {
    id: 'indic',
    label: 'Indic Scripts',
    blocks: [
      { name: 'Devanagari', start: 0x0900, end: 0x097f },
      { name: 'Bengali', start: 0x0980, end: 0x09ff },
      { name: 'Tamil', start: 0x0b80, end: 0x0bff },
      { name: 'Telugu', start: 0x0c00, end: 0x0c7f },
      { name: 'Kannada', start: 0x0c80, end: 0x0cff },
    ],
  },
  {
    id: 'asian',
    label: 'Asian Scripts',
    blocks: [
      { name: 'Hiragana', start: 0x3040, end: 0x309f },
      { name: 'Katakana', start: 0x30a0, end: 0x30ff },
      { name: 'CJK Symbols and Punctuation', start: 0x3000, end: 0x303f },
      { name: 'Thai', start: 0x0e00, end: 0x0e7f },
      { name: 'Tibetan', start: 0x0f00, end: 0x0fff },
    ],
  },
  {
    id: 'combining',
    label: 'Combining',
    blocks: [
      { name: 'Combining Diacritical Marks', start: 0x0300, end: 0x036f },
      { name: 'Combining Marks for Symbols', start: 0x20d0, end: 0x20ff },
    ],
  },
  {
    id: 'ancient',
    label: 'Ancient',
    blocks: [
      { name: 'Ogham', start: 0x1680, end: 0x169f },
      { name: 'Runic', start: 0x16a0, end: 0x16ff },
      { name: 'Gothic', start: 0x10330, end: 0x1034f },
      { name: 'Phoenician', start: 0x10900, end: 0x1091f },
    ],
  },
  {
    id: 'other',
    label: 'Other Blocks',
    blocks: [
      { name: 'Braille Patterns', start: 0x2800, end: 0x28ff },
      { name: 'Small Form Variants', start: 0xfe50, end: 0xfe6f },
      { name: 'Spacing Modifier Letters', start: 0x02b0, end: 0x02ff },
    ],
  },
];

export const SPECIAL_SEQUENCES: { name: string; codePoints: number[] }[] = [
  { name: 'Rainbow Flag', codePoints: [0x1f3f3, 0xfe0f, 0x200d, 0x1f308] },
  { name: 'Pirate Flag', codePoints: [0x1f3f4, 0x200d, 0x2620, 0xfe0f] },
  { name: 'Family', codePoints: [0x1f468, 0x200d, 0x1f469, 0x200d, 0x1f467, 0x200d, 0x1f466] },
  { name: 'Woman Technologist', codePoints: [0x1f469, 0x200d, 0x1f4bb] },
  { name: 'United States Flag', codePoints: [0x1f1fa, 0x1f1f8] },
  { name: 'United Kingdom Flag', codePoints: [0x1f1ec, 0x1f1e7] },
  { name: 'Japan Flag', codePoints: [0x1f1ef, 0x1f1f5] },
  { name: 'India Flag', codePoints: [0x1f1ee, 0x1f1f3] },
  { name: 'Red Heart (VS16)', codePoints: [0x2764, 0xfe0f] },
  { name: 'Keycap Number Sign', codePoints: [0x0023, 0xfe0f, 0x20e3] },
];

export function hexOf(cp: number): string {
  return 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
}

export function keyOf(codePoints: number[]): string {
  return codePoints.map(hexOf).join(' ');
}

export function codePointsOfKey(key: string): number[] {
  return key
    .split(' ')
    .map((tok) => {
      if (tok.startsWith('U+') || tok.startsWith('u+')) {
        return parseInt(tok.substring(2), 16);
      }
      return NaN;
    })
    .filter((n) => !isNaN(n));
}

export function textOf(codePoints: number[]): string {
  return String.fromCodePoint(...codePoints);
}

// Flat block list for quick code-point to block resolution
const ALL_BLOCKS: BlockRange[] = [];
for (const cat of CATEGORIES) {
  for (const b of cat.blocks) {
    ALL_BLOCKS.push(b);
  }
}
ALL_BLOCKS.sort((a, b) => a.start - b.start);

export function blockNameFor(cp: number): string {
  let lo = 0;
  let hi = ALL_BLOCKS.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const b = ALL_BLOCKS[mid];
    if (cp >= b.start && cp <= b.end) {
      return b.name;
    }
    if (b.start <= cp) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return 'Unicode Character';
}

const COMMON_NAMES: Record<number, string> = {
  // Punctuation & math
  0x0020: 'SPACE',
  0x0021: 'EXCLAMATION MARK',
  0x0022: 'QUOTATION MARK',
  0x0023: 'NUMBER SIGN',
  0x0024: 'DOLLAR SIGN',
  0x0025: 'PERCENT SIGN',
  0x0026: 'AMPERSAND',
  0x0027: 'APOSTROPHE',
  0x0028: 'LEFT PARENTHESIS',
  0x0029: 'RIGHT PARENTHESIS',
  0x002a: 'ASTERISK',
  0x002b: 'PLUS SIGN',
  0x002c: 'COMMA',
  0x002d: 'HYPHEN-MINUS',
  0x002e: 'FULL STOP',
  0x002f: 'SOLIDUS',
  0x003a: 'COLON',
  0x003b: 'SEMICOLON',
  0x003c: 'LESS-THAN SIGN',
  0x003d: 'EQUALS SIGN',
  0x003e: 'GREATER-THAN SIGN',
  0x003f: 'QUESTION MARK',
  0x0040: 'COMMERCIAL AT',

  // Currencies
  0x00a2: 'CENT SIGN',
  0x00a3: 'POUND SIGN',
  0x00a4: 'CURRENCY SIGN',
  0x00a5: 'YEN SIGN',
  0x20a0: 'EURO-CURRENCY SIGN',
  0x20a1: 'COLON SIGN',
  0x20a2: 'CRUZEIRO SIGN',
  0x20a3: 'FRANC SIGN',
  0x20a4: 'LIRA SIGN',
  0x20a6: 'NAIRA SIGN',
  0x20a7: 'PESETA SIGN',
  0x20a8: 'RUPEE SIGN',
  0x20a9: 'WON SIGN',
  0x20aa: 'NEW SHEQEL SIGN',
  0x20ab: 'DONG SIGN',
  0x20ac: 'EURO SIGN',
  0x20ad: 'KIP SIGN',
  0x20ae: 'TUGRIK SIGN',
  0x20af: 'DRACHMA SIGN',
  0x20b0: 'GERMAN PENNY SIGN',
  0x20b1: 'PESO SIGN',
  0x20b2: 'GUARANI SIGN',
  0x20b4: 'HRYVNIA SIGN',
  0x20b8: 'TENGE SIGN',
  0x20b9: 'INDIAN RUPEE SIGN',
  0x20ba: 'TURKISH LIRA SIGN',
  0x20bd: 'RUBLE SIGN',
  0x20bf: 'BITCOIN SIGN',

  // Common arrows
  0x2190: 'LEFTWARDS ARROW',
  0x2191: 'UPWARDS ARROW',
  0x2192: 'RIGHTWARDS ARROW',
  0x2193: 'DOWNWARDS ARROW',
  0x2194: 'LEFT RIGHT ARROW',
  0x2195: 'UP DOWN ARROW',
  0x2196: 'NORTH WEST ARROW',
  0x2197: 'NORTH EAST ARROW',
  0x2198: 'SOUTH EAST ARROW',
  0x2199: 'SOUTH WEST ARROW',
  0x21a9: 'LEFTWARDS ARROW WITH HOOK',
  0x21aa: 'RIGHTWARDS ARROW WITH HOOK',
  0x21b5: 'DOWNWARDS ARROW WITH CORNER LEFTWARDS',
  0x21cc: 'RIGHTWARDS HARPOON OVER LEFTWARDS HARPOON',
  0x21d0: 'LEFTWARDS DOUBLE ARROW',
  0x21d2: 'RIGHTWARDS DOUBLE ARROW',
  0x21d4: 'LEFT RIGHT DOUBLE ARROW',
  0x21e7: 'UPWARDS WHITE ARROW (SHIFT)',

  // Math
  0x2200: 'FOR ALL',
  0x2202: 'PARTIAL DIFFERENTIAL',
  0x2203: 'THERE EXISTS',
  0x2205: 'EMPTY SET',
  0x2206: 'INCREMENT',
  0x2207: 'NABLA',
  0x2208: 'ELEMENT OF',
  0x2209: 'NOT AN ELEMENT OF',
  0x220b: 'CONTAINS AS MEMBER',
  0x220f: 'N-ARY PRODUCT',
  0x2211: 'N-ARY SUMMATION',
  0x2212: 'MINUS SIGN',
  0x2217: 'ASTERISK OPERATOR',
  0x221a: 'SQUARE ROOT',
  0x221e: 'INFINITY',
  0x2227: 'LOGICAL AND',
  0x2228: 'LOGICAL OR',
  0x2229: 'INTERSECTION',
  0x222a: 'UNION',
  0x222b: 'INTEGRAL',
  0x2248: 'ALMOST EQUAL TO',
  0x2260: 'NOT EQUAL TO',
  0x2261: 'IDENTICAL TO',
  0x2264: 'LESS-THAN OR EQUAL TO',
  0x2265: 'GREATER-THAN OR EQUAL TO',

  // Misc & Dingbats
  0x2702: 'BLACK SCISSORS',
  0x2705: 'WHITE HEAVY CHECK MARK',
  0x2708: 'AIRPLANE',
  0x2709: 'ENVELOPE',
  0x270e: 'RIGHT-POINTING PENCIL',
  0x2713: 'CHECK MARK',
  0x2714: 'HEAVY CHECK MARK',
  0x2716: 'HEAVY MULTIPLICATION X',
  0x2728: 'SPARKLES',
  0x274c: 'CROSS MARK',
  0x2764: 'HEAVY BLACK HEART',
  0x2600: 'BLACK SUN WITH RAYS',
  0x2601: 'CLOUD',
  0x2602: 'UMBRELLA',
  0x2605: 'BLACK STAR',
  0x2606: 'WHITE STAR',
  0x2614: 'UMBRELLA WITH RAIN DROPS',
  0x2615: 'HOT BEVERAGE',
  0x2620: 'SKULL AND CROSSBONES',
  0x262e: 'PEACE SYMBOL',
  0x263a: 'WHITE SMILING FACE',
  0x2660: 'BLACK SPADE SUIT',
  0x2663: 'BLACK CLUB SUIT',
  0x2665: 'BLACK HEART SUIT',
  0x2666: 'BLACK DIAMOND SUIT',
  0x266a: 'EIGHTH NOTE',
  0x266b: 'BEAMED EIGHTH NOTES',
  0x2699: 'GEAR',
  0x26a1: 'HIGH VOLTAGE SIGN',
  0x26bd: 'SOCCER BALL',
  0x26c4: 'SNOWMAN WITHOUT SNOW',

  // Technical
  0x2318: 'PLACE OF INTEREST SIGN (COMMAND)',
  0x2328: 'KEYBOARD',
  0x232b: 'ERASE TO THE LEFT (BACKSPACE)',
  0x23cf: 'EJECT SYMBOL',
  0x23ea: 'BLACK LEFT-POINTING DOUBLE TRIANGLE',
  0x23e9: 'BLACK RIGHT-POINTING DOUBLE TRIANGLE',
  0x23f0: 'ALARM CLOCK',
  0x23f3: 'HOURGLASS WITH FLOWING SAND',
  0x2423: 'OPEN BOX (SPACE INDICATOR)',

  // Common Emojis
  0x1f600: 'GRINNING FACE',
  0x1f601: 'BEAMING FACE WITH SMILING EYES',
  0x1f602: 'FACE WITH TEARS OF JOY',
  0x1f603: 'GRINNING FACE WITH BIG EYES',
  0x1f604: 'GRINNING FACE WITH SMILING EYES',
  0x1f605: 'GRINNING FACE WITH SWEAT',
  0x1f606: 'GRINNING SQUINTING FACE',
  0x1f607: 'SMILING FACE WITH HALO',
  0x1f609: 'WINKING FACE',
  0x1f60a: 'SMILING FACE WITH SMILING EYES',
  0x1f60d: 'SMILING FACE WITH HEART-EYES',
  0x1f60e: 'SMILING FACE WITH SUNGLASSES',
  0x1f618: 'FACE BLOWING A KISS',
  0x1f621: 'POUTING FACE',
  0x1f622: 'CRYING FACE',
  0x1f62d: 'LOUDLY CRYING FACE',
  0x1f631: 'FACE SCREAMING IN FEAR',
  0x1f633: 'FLUSHED FACE',
  0x1f634: 'SLEEPING FACE',
  0x1f680: 'ROCKET',
  0x1f681: 'HELICOPTER',
  0x1f697: 'AUTOMOBILE',
  0x1f308: 'RAINBOW',
  0x1f31f: 'GLOWING STAR',
  0x1f338: 'CHERRY BLOSSOM',
  0x1f34e: 'RED APPLE',
  0x1f355: 'PIZZA',
  0x1f389: 'PARTY POPPER',
  0x1f382: 'BIRTHDAY CAKE',
  0x1f44d: 'THUMBS UP SIGN',
  0x1f44e: 'THUMBS DOWN SIGN',
  0x1f44f: 'CLAPPING HANDS SIGN',
  0x1f4a9: 'PILE OF POO',
  0x1f4af: 'HUNDRED POINTS SYMBOL',
  0x1f525: 'FIRE',
  0x1f4bb: 'PERSONAL COMPUTER',
  0x1f916: 'ROBOT FACE',
  0x1f9e0: 'BRAIN',
  0x1f984: 'UNICORN FACE',
};

export function nameFor(codePoints: number[]): string {
  if (codePoints.length > 1) {
    const seq = SPECIAL_SEQUENCES.find(
      (s) => s.codePoints.length === codePoints.length && s.codePoints.every((v, i) => v === codePoints[i])
    );
    if (seq) return seq.name;
    return `SEQUENCE (${codePoints.map(hexOf).join(' ')})`;
  }

  const cp = codePoints[0];
  if (COMMON_NAMES[cp]) return COMMON_NAMES[cp];

  // Derive general name based on block & position
  const blk = blockNameFor(cp);
  const hex = hexOf(cp);

  // Greek capital/small
  if (cp >= 0x0391 && cp <= 0x03a9) {
    return `GREEK CAPITAL LETTER (U+${cp.toString(16).toUpperCase()})`;
  }
  if (cp >= 0x03b1 && cp <= 0x03c9) {
    return `GREEK SMALL LETTER (U+${cp.toString(16).toUpperCase()})`;
  }
  // Cyrillic capital/small
  if (cp >= 0x0410 && cp <= 0x042f) {
    return `CYRILLIC CAPITAL LETTER (U+${cp.toString(16).toUpperCase()})`;
  }
  if (cp >= 0x0430 && cp <= 0x044f) {
    return `CYRILLIC SMALL LETTER (U+${cp.toString(16).toUpperCase()})`;
  }

  return `${blk.toUpperCase()} CHARACTER ${hex}`;
}

export function generalCategoryFor(codePoints: number[]): string {
  if (codePoints.length > 1) return 'Symbol, Sequence';
  const cp = codePoints[0];
  if (cp >= 0x0030 && cp <= 0x0039) return 'Number, Decimal Digit';
  if ((cp >= 0x0041 && cp <= 0x005a) || (cp >= 0x0391 && cp <= 0x03a9) || (cp >= 0x0410 && cp <= 0x042f)) {
    return 'Letter, Uppercase';
  }
  if ((cp >= 0x0061 && cp <= 0x007a) || (cp >= 0x03b1 && cp <= 0x03c9) || (cp >= 0x0430 && cp <= 0x044f)) {
    return 'Letter, Lowercase';
  }
  if (cp >= 0x20a0 && cp <= 0x20cf) return 'Symbol, Currency';
  if ((cp >= 0x2190 && cp <= 0x21ff) || (cp >= 0x27f0 && cp <= 0x27ff) || (cp >= 0x2b00 && cp <= 0x2bff)) {
    return 'Symbol, Arrow';
  }
  if (cp >= 0x2200 && cp <= 0x22ff) return 'Symbol, Math';
  if ((cp >= 0x1f300 && cp <= 0x1f5ff) || (cp >= 0x1f600 && cp <= 0x1f64f) || (cp >= 0x1f900 && cp <= 0x1f9ff)) {
    return 'Symbol, Emoji';
  }
  if (cp >= 0x0300 && cp <= 0x036f) return 'Mark, Nonspacing Combining';
  return 'Symbol, Other';
}

export function isCombiningMark(codePoints: number[]): boolean {
  if (codePoints.length !== 1) return false;
  const cp = codePoints[0];
  return (cp >= 0x0300 && cp <= 0x036f) || (cp >= 0x20d0 && cp <= 0x20ff) || (cp >= 0xfe20 && cp <= 0xfe2f);
}

// Generate code points for category
export function itemsForCategory(categoryId: string): number[][] {
  if (categoryId === 'emoji') {
    const list: number[][] = [];
    for (const seq of SPECIAL_SEQUENCES) {
      list.push(seq.codePoints);
    }
    const cat = CATEGORIES.find((c) => c.id === 'emoji');
    if (cat) {
      for (const block of cat.blocks) {
        for (let cp = block.start; cp <= block.end; cp++) {
          list.push([cp]);
        }
      }
    }
    return list;
  }

  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return [];

  const list: number[][] = [];
  for (const block of cat.blocks) {
    for (let cp = block.start; cp <= block.end; cp++) {
      // Skip unassigned surrogate pairs and control gaps if any
      if (cp >= 0xd800 && cp <= 0xdfff) continue;
      list.push([cp]);
    }
  }
  return list;
}

// Search across categories and code points
export function searchCharacters(query: string, limit = 200): number[][] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Check if hex code point search (e.g., 2192, U+2192, 0x2192)
  let hexStr = q;
  if (hexStr.startsWith('u+')) hexStr = hexStr.substring(2);
  else if (hexStr.startsWith('0x')) hexStr = hexStr.substring(2);

  if (/^[0-9a-f]{1,6}$/i.test(hexStr)) {
    const cp = parseInt(hexStr, 16);
    if (cp >= 0 && cp <= 0x10ffff && !(cp >= 0xd800 && cp <= 0xdfff)) {
      return [[cp]];
    }
  }

  // Check if literal character query
  if (Array.from(q).length === 1) {
    const cp = q.codePointAt(0);
    if (cp !== undefined) {
      return [[cp]];
    }
  }

  const results: number[][] = [];
  const tokens = q.split(/\s+/).filter(Boolean);

  // Search special sequences first
  for (const seq of SPECIAL_SEQUENCES) {
    const nameMatch = tokens.every((t) => seq.name.toLowerCase().includes(t));
    if (nameMatch) {
      results.push(seq.codePoints);
    }
  }

  // Search common names dictionary
  for (const [cpStr, name] of Object.entries(COMMON_NAMES)) {
    const cp = Number(cpStr);
    const blk = blockNameFor(cp).toLowerCase();
    const hex = hexOf(cp).toLowerCase();
    const full = `${name.toLowerCase()} ${blk} ${hex}`;
    if (tokens.every((t) => full.includes(t))) {
      results.push([cp]);
      if (results.length >= limit) return results;
    }
  }

  // Search across category blocks
  for (const cat of CATEGORIES) {
    const catLabel = cat.label.toLowerCase();
    const catMatches = tokens.every((t) => catLabel.includes(t));

    for (const blk of cat.blocks) {
      const blkName = blk.name.toLowerCase();
      const blkMatches = tokens.every((t) => blkName.includes(t));

      if (catMatches || blkMatches) {
        for (let cp = blk.start; cp <= Math.min(blk.end, blk.start + 120); cp++) {
          if (!results.some((r) => r.length === 1 && r[0] === cp)) {
            results.push([cp]);
            if (results.length >= limit) return results;
          }
        }
      }
    }
  }

  return results;
}
