# Charbon — Android Unicode Keyboard

A real Android Input Method (IME) that gives you the full Unicode repertoire the
device supports: browse by category, search by name or code point, see the
Unicode name/value, insert into any text field, and keep Recent + Favorites.

Package: `uni.charbon.keyboard`

---

## How it is built (no Android Studio needed)

A GitHub Actions workflow compiles the project and hands you an installable APK.

### One-time setup on GitHub

1. **Get the project into a repository.**
   - If you connected this Base44 app to GitHub (Dashboard → GitHub → Connect),
     the `android/` folder is pushed to your repo automatically.
   - The workflow file itself cannot be synced (GitHub blocks apps from editing
     Actions workflows). Create it by hand once: open your repository on
     github.com → **Add file → Create new file** → name it exactly
     `.github/workflows/build-apk.yml` → paste the contents of the file
     `android/github-workflow-build-apk.yml` (included in this project) →
     **Commit changes**.

2. **Let Actions run.** Go to the repo's **Actions** tab → **Build Charbon APK**.
   If GitHub asks, click **Enable workflows**. Push any change (or use
   **Run workflow**) to start a build. It takes a few minutes.

3. **Download the APK.** Open the finished run → **Artifacts** →
   `charbon-debug-apk` → download the zip → inside is `app-debug.apk`.

### Install on your phone

1. Copy `app-debug.apk` to your Samsung A51.
2. Open it (Files → Downloads → tap the APK). Allow "Install unknown apps" for
   your file manager if asked.
3. Open the **Charbon** app → **Enable Charbon keyboard** → turn Charbon on →
   **Choose active keyboard** → pick **Charbon Keyboard**.

You're now typing with Charbon. To use it anywhere: tap any text field and select
Charbon from the keyboard switcher (the 🌐 key cycles keyboards).

---

## Using the keyboard

- **Categories** (top row): Recent, Favorites, Latin, Greek, Cyrillic, Arabic,
  Hebrew, Indic, Asian, More Scripts, Mathematical, Currency, Arrows, Technical,
  Shapes, Punctuation, Letterlike, Super/Sub, Enclosed, Dingbats, Emoji, Misc
  Symbols, Combining, Ancient, Other Blocks.
- **Search**: tap the search box → type a name (`arrow`, `heart`, `greek alpha`),
  a code point (`2192`, `U+2192`), then tap ✓. Search covers the whole device
  Unicode database, not just the current category.
- **Info panel**: tap (or long-press) a character to see its preview, Unicode
  name, code point, block and general category. ★ saves it to Favorites.
- **Keys**: ABC / ?123 / ⌘ (Unicode grid) / space / ⌫ / ↵ / 🌐 (switch keyboard).

## Compatibility

- `minSdk 24` (Android 7.0+) up to the latest. Works on Android 13 / One UI 5.1.
- Responsive, density-independent sizes; adapts to the system dark/light theme.
- Fully offline. **No INTERNET permission is requested.**

## Privacy

Nothing you type is stored or transmitted. Recent and Favorites live only in the
app's private storage on your phone (SharedPreferences).

## Unicode data

Character names, categories and scripts come from Android's built-in Unicode
database (`android.icu`), so the full repertoire the device supports is available
offline with no bundled data. Multi-code-point sequences (ZWJ emoji, flags) are
supported and inserted as complete sequences; supplementary-plane characters
(above U+FFFF) are handled correctly.

## Project layout

```
android/
  app/src/main/AndroidManifest.xml        IME registration + app
  app/src/main/res/xml/method.xml         IME metadata (subtype)
  app/src/main/res/values/                strings, colors, theme
  app/src/main/java/uni/charbon/keyboard/
    CharbonIME.kt          InputMethodService (the keyboard service)
    CharbonKeyboardView.kt The input view: grid, search, info, controls
    UnicodeDatabase.kt     Unicode access + search index (android.icu)
    UnicodeCatalog.kt      Browsable categories / blocks
    CharbonPrefs.kt        Local persistence (recent, favorites, settings)
    MainActivity.kt        Setup + settings screen
```

## Versioning

`versionName 1.0.0`, `versionCode 1` — kept in `android/app/build.gradle`.
