package uni.charbon.keyboard

import android.icu.lang.UCharacter
import android.icu.lang.UScript
import android.os.Handler
import android.os.Looper

/**
 * Unicode access layer. Character names, categories and scripts come from the
 * device's built-in Unicode database (android.icu), so the full repertoire the
 * device supports is available offline with no bundled data and no network use.
 *
 * A flat index of every named code point is built once, in the background, to
 * power fast search across the whole database.
 */
object UnicodeDatabase {

    private val main = Handler(Looper.getMainLooper())
    private val pending = ArrayList<() -> Unit>()
    @Volatile private var started = false
    @Volatile var ready = false
        private set

    private var cpsArr = IntArray(0)
    private var nameLower = emptyArray<String>()
    private var blockArr = emptyArray<String>()

    private val catCache = HashMap<String, IntArray>()

    /** Loads the index if needed, then invokes [cb] on the main thread. */
    fun ensureLoaded(cb: () -> Unit) {
        if (ready) { cb(); return }
        synchronized(pending) {
            pending.add(cb)
            if (started) return
            started = true
        }
        Thread {
            buildIndex()
            main.post {
                ready = true
                val callbacks: List<() -> Unit>
                synchronized(pending) {
                    callbacks = ArrayList(pending)
                    pending.clear()
                }
                for (c in callbacks) c()
            }
        }.start()
    }

    private fun buildIndex() {
        val cps = ArrayList<Int>(160000)
        val names = ArrayList<String>(160000)
        var cp = 0
        while (cp <= 0x10FFFF) {
            if (cp in 0xD800..0xDFFF) { cp++; continue }
            if (UCharacter.isDefined(cp)) {
                val n = try { UCharacter.getName(cp) } catch (e: Exception) { null }
                if (n != null) { cps.add(cp); names.add(n) }
            }
            cp++
        }
        val size = cps.size
        val c = IntArray(size)
        val nl = Array(size) { "" }
        val bn = Array(size) { "" }
        for (i in 0 until size) {
            val v = cps[i]
            val n = names[i]
            c[i] = v
            nl[i] = n.lowercase()
            bn[i] = UnicodeCatalog.blockNameFor(v)
        }
        cpsArr = c
        nameLower = nl
        blockArr = bn
    }

    /** Search by name (all tokens must match) or by code point (e.g. "2192", "U+2192"). */
    fun search(query: String, limit: Int): IntArray {
        if (!ready) return IntArray(0)
        val q = query.trim()
        if (q.isEmpty()) return IntArray(0)

        val hex = parseHex(q)
        if (hex != null) {
            val out = ArrayList<Int>(1)
            for (i in cpsArr.indices) if (cpsArr[i] == hex) out.add(cpsArr[i])
            return out.toIntArray()
        }

        val tokens = q.lowercase().split(' ').filter { it.isNotEmpty() }
        if (tokens.isEmpty()) return IntArray(0)
        val out = ArrayList<Int>()
        for (i in cpsArr.indices) {
            val n = nameLower[i]
            var ok = true
            for (t in tokens) {
                if (!n.contains(t)) { ok = false; break }
            }
            if (ok) {
                out.add(cpsArr[i])
                if (out.size >= limit) break
            }
        }
        return out.toIntArray()
    }

    private fun parseHex(q: String): Int? {
        var s = q.trim().lowercase()
        if (s.startsWith("u+")) s = s.substring(2) else if (s.startsWith("0x")) s = s.substring(2)
        if (s.length !in 1..6) return null
        if (!s.any { it in '0'..'9' }) return null
        if (!s.all { it in '0'..'9' || it in 'a'..'f' }) return null
        return s.toIntOrNull(16)
    }

    /** All code points belonging to a browsable category (cached). */
    fun cpsForCategory(id: String): IntArray {
        catCache[id]?.let { return it }
        val cat = UnicodeCatalog.byId[id] ?: return IntArray(0)
        val out = ArrayList<Int>()
        for (bl in cat.blocks) {
            var v = bl.start
            while (v <= bl.end) {
                if (v !in 0xD800..0xDFFF && UCharacter.isDefined(v)) {
                    val n = try { UCharacter.getName(v) } catch (e: Exception) { null }
                    if (n != null) out.add(v)
                }
                v++
            }
        }
        val arr = out.toIntArray()
        catCache[id] = arr
        return arr
    }

    fun nameFor(cp: Int): String =
        try { UCharacter.getName(cp) ?: hexOf(cp) } catch (e: Exception) { hexOf(cp) }

    fun blockFor(cp: Int): String = UnicodeCatalog.blockNameFor(cp)

    fun scriptFor(cp: Int): String =
        try { UScript.getShortName(UScript.getScript(cp)) } catch (e: Exception) { "Common" }

    fun generalCategory(cp: Int): String =
        try { categoryName(UCharacter.getType(cp)) } catch (e: Exception) { "Unknown" }

    fun isCombining(cp: Int): Boolean =
        try { UCharacter.getType(cp) == UCharacter.NON_SPACING_MARK } catch (e: Exception) { false }

    fun textFor(codePoints: IntArray): String = buildString {
        for (c in codePoints) appendCodePoint(c)
    }

    fun hexOf(cp: Int): String = "U+" + cp.toString(16).uppercase().padStart(4, '0')

    fun keyOf(codePoints: IntArray): String =
        codePoints.joinToString(" ") { hexOf(it) }

    fun codePointsOfKey(key: String): IntArray =
        key.split(' ').mapNotNull { tok ->
            if (tok.startsWith("U+")) tok.substring(2).toIntOrNull(16) else null
        }.toIntArray()

    /** Curated multi-code-point sequences (ZWJ emoji, flags, key sequences). */
    val sequenceCodePoints: List<IntArray> = listOf(
        intArrayOf(0x1F3F3, 0xFE0F, 0x200D, 0x1F308),                                  // rainbow flag
        intArrayOf(0x1F3F4, 0x200D, 0x2620, 0xFE0F),                                  // pirate flag
        intArrayOf(0x1F468, 0x200D, 0x1F469, 0x200D, 0x1F467, 0x200D, 0x1F466),       // family
        intArrayOf(0x1F469, 0x200D, 0x1F4BB),                                          // woman technologist
        intArrayOf(0x1F1FA, 0x1F1F8),                                                  // US flag
        intArrayOf(0x1F1EC, 0x1F1E7),                                                  // UK flag
        intArrayOf(0x1F1EF, 0x1F1F5),                                                  // JP flag
        intArrayOf(0x1F1EE, 0x1F1F3),                                                  // IN flag
        intArrayOf(0x2764, 0xFE0F),                                                    // red heart (VS16)
        intArrayOf(0x0023, 0xFE0F, 0x20E3)                                             // keycap #
    )

    fun itemsForCategory(id: String): List<IntArray> {
        val cps = cpsForCategory(id)
        val items = ArrayList<IntArray>(cps.size + 8)
        if (id == "emoji") for (s in sequenceCodePoints) items.add(s)
        for (cp in cps) items.add(intArrayOf(cp))
        return items
    }

    private fun categoryName(t: Int): String = when (t.toByte()) {
        UCharacter.UPPERCASE_LETTER -> "Letter, Uppercase"
        UCharacter.LOWERCASE_LETTER -> "Letter, Lowercase"
        UCharacter.TITLECASE_LETTER -> "Letter, Titlecase"
        UCharacter.MODIFIER_LETTER -> "Letter, Modifier"
        UCharacter.OTHER_LETTER -> "Letter, Other"
        UCharacter.NON_SPACING_MARK -> "Mark, Nonspacing"
        UCharacter.COMBINING_SPACING_MARK -> "Mark, Spacing"
        UCharacter.ENCLOSING_MARK -> "Mark, Enclosing"
        UCharacter.DECIMAL_DIGIT_NUMBER -> "Number, Decimal Digit"
        UCharacter.LETTER_NUMBER -> "Number, Letter"
        UCharacter.OTHER_NUMBER -> "Number, Other"
        UCharacter.SPACE_SEPARATOR -> "Separator, Space"
        UCharacter.LINE_SEPARATOR -> "Separator, Line"
        UCharacter.PARAGRAPH_SEPARATOR -> "Separator, Paragraph"
        UCharacter.CONTROL -> "Other, Control"
        UCharacter.FORMAT -> "Other, Format"
        UCharacter.PRIVATE_USE -> "Other, Private Use"
        UCharacter.SURROGATE -> "Other, Surrogate"
        UCharacter.DASH_PUNCTUATION -> "Punctuation, Dash"
        UCharacter.START_PUNCTUATION -> "Punctuation, Open"
        UCharacter.END_PUNCTUATION -> "Punctuation, Close"
        UCharacter.CONNECTOR_PUNCTUATION -> "Punctuation, Connector"
        UCharacter.OTHER_PUNCTUATION -> "Punctuation, Other"
        UCharacter.INITIAL_PUNCTUATION -> "Punctuation, Initial Quote"
        UCharacter.FINAL_PUNCTUATION -> "Punctuation, Final Quote"
        UCharacter.MATH_SYMBOL -> "Symbol, Math"
        UCharacter.CURRENCY_SYMBOL -> "Symbol, Currency"
        UCharacter.MODIFIER_SYMBOL -> "Symbol, Modifier"
        UCharacter.OTHER_SYMBOL -> "Symbol, Other"
        else -> "Symbol"
    }
}
