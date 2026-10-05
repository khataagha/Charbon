package uni.charbon.keyboard

/** A contiguous Unicode block. */
data class BlockRange(val name: String, val start: Int, val end: Int)

/** A browsable category made of one or more Unicode blocks. */
data class CharCategory(val id: String, val label: String, val blocks: List<BlockRange>)

/**
 * Catalogue of browsable Unicode categories. Character data itself comes from the
 * device's built-in Unicode database (android.icu); this only defines how characters
 * are grouped for browsing. New blocks/categories can be added here without touching
 * the keyboard UI.
 */
object UnicodeCatalog {

    private fun b(name: String, start: Int, end: Int) = BlockRange(name, start, end)

    val categories: List<CharCategory> = listOf(
        CharCategory("latin", "Latin", listOf(
            b("Basic Latin", 0x0000, 0x007F),
            b("Latin-1 Supplement", 0x0080, 0x00FF),
            b("Latin Extended-A", 0x0100, 0x017F),
            b("Latin Extended-B", 0x0180, 0x024F),
            b("IPA Extensions", 0x0250, 0x02AF),
            b("Latin Extended Additional", 0x1E00, 0x1EFF),
            b("Latin Extended-C", 0x2C60, 0x2C7F),
            b("Latin Extended-D", 0xA720, 0xA7FF)
        )),
        CharCategory("greek", "Greek", listOf(
            b("Greek and Coptic", 0x0370, 0x03FF),
            b("Greek Extended", 0x1F00, 0x1FFF)
        )),
        CharCategory("cyrillic", "Cyrillic", listOf(
            b("Cyrillic", 0x0400, 0x04FF),
            b("Cyrillic Supplement", 0x0500, 0x052F)
        )),
        CharCategory("hebrew", "Hebrew", listOf(
            b("Hebrew", 0x0590, 0x05FF)
        )),
        CharCategory("arabic", "Arabic", listOf(
            b("Arabic", 0x0600, 0x06FF),
            b("Arabic Supplement", 0x0750, 0x077F),
            b("Arabic Extended-A", 0x08A0, 0x08FF)
        )),
        CharCategory("indic", "Indic Scripts", listOf(
            b("Devanagari", 0x0900, 0x097F),
            b("Bengali", 0x0980, 0x09FF),
            b("Gurmukhi", 0x0A00, 0x0A7F),
            b("Gujarati", 0x0A80, 0x0AFF),
            b("Oriya", 0x0B00, 0x0B7F),
            b("Tamil", 0x0B80, 0x0BFF),
            b("Telugu", 0x0C00, 0x0C7F),
            b("Kannada", 0x0C80, 0x0CFF),
            b("Malayalam", 0x0D00, 0x0D7F),
            b("Sinhala", 0x0D80, 0x0DFF)
        )),
        CharCategory("asian", "Asian Scripts", listOf(
            b("Thai", 0x0E00, 0x0E7F),
            b("Lao", 0x0E80, 0x0EFF),
            b("Tibetan", 0x0F00, 0x0FFF),
            b("Myanmar", 0x1000, 0x109F),
            b("Hangul Jamo", 0x1100, 0x11FF),
            b("Khmer", 0x1780, 0x17FF),
            b("CJK Symbols and Punctuation", 0x3000, 0x303F),
            b("Hiragana", 0x3040, 0x309F),
            b("Katakana", 0x30A0, 0x30FF),
            b("Hangul Syllables", 0xAC00, 0xD7A3),
            b("CJK Unified Ideographs", 0x4E00, 0x9FFF),
            b("Halfwidth and Fullwidth Forms", 0xFF00, 0xFFEF)
        )),
        CharCategory("scripts", "More Scripts", listOf(
            b("Armenian", 0x0530, 0x058F),
            b("Georgian", 0x10A0, 0x10FF),
            b("Ethiopic", 0x1200, 0x137F),
            b("Cherokee", 0x13A0, 0x13FF),
            b("Mongolian", 0x1800, 0x18AF),
            b("Glagolitic", 0x2C00, 0x2C5F),
            b("Coptic", 0x2C80, 0x2CFF)
        )),
        CharCategory("math", "Mathematical", listOf(
            b("Mathematical Operators", 0x2200, 0x22FF),
            b("Miscellaneous Mathematical Symbols-A", 0x27C0, 0x27EF),
            b("Miscellaneous Mathematical Symbols-B", 0x2980, 0x29FF),
            b("Supplemental Mathematical Operators", 0x2A00, 0x2AFF),
            b("Mathematical Alphanumeric Symbols", 0x1D400, 0x1D7FF)
        )),
        CharCategory("currency", "Currency", listOf(
            b("Currency Symbols", 0x20A0, 0x20CF)
        )),
        CharCategory("arrows", "Arrows", listOf(
            b("Arrows", 0x2190, 0x21FF),
            b("Supplemental Arrows-A", 0x27F0, 0x27FF),
            b("Supplemental Arrows-B", 0x2900, 0x297F),
            b("Miscellaneous Symbols and Arrows", 0x2B00, 0x2BFF)
        )),
        CharCategory("technical", "Technical", listOf(
            b("Miscellaneous Technical", 0x2300, 0x23FF),
            b("Control Pictures", 0x2400, 0x243F),
            b("Optical Character Recognition", 0x2440, 0x245F)
        )),
        CharCategory("shapes", "Shapes & Blocks", listOf(
            b("Box Drawing", 0x2500, 0x257F),
            b("Block Elements", 0x2580, 0x259F),
            b("Geometric Shapes", 0x25A0, 0x25FF)
        )),
        CharCategory("punctuation", "Punctuation", listOf(
            b("General Punctuation", 0x2000, 0x206F)
        )),
        CharCategory("letterlike", "Letterlike", listOf(
            b("Letterlike Symbols", 0x2100, 0x214F),
            b("Number Forms", 0x2150, 0x218F)
        )),
        CharCategory("super", "Super/Sub", listOf(
            b("Superscripts and Subscripts", 0x2070, 0x209F)
        )),
        CharCategory("enclosed", "Enclosed", listOf(
            b("Enclosed Alphanumerics", 0x2460, 0x24FF)
        )),
        CharCategory("dingbats", "Dingbats", listOf(
            b("Dingbats", 0x2700, 0x27BF)
        )),
        CharCategory("emoji", "Emoji", listOf(
            b("Miscellaneous Symbols and Pictographs", 0x1F300, 0x1F5FF),
            b("Emoticons", 0x1F600, 0x1F64F),
            b("Transport and Map Symbols", 0x1F680, 0x1F6FF),
            b("Supplemental Symbols and Pictographs", 0x1F900, 0x1F9FF),
            b("Symbols and Pictographs Extended-A", 0x1FA70, 0x1FAFF)
        )),
        CharCategory("misc", "Misc Symbols", listOf(
            b("Miscellaneous Symbols", 0x2600, 0x26FF)
        )),
        CharCategory("combining", "Combining", listOf(
            b("Combining Diacritical Marks", 0x0300, 0x036F),
            b("Combining Diacritical Marks Supplement", 0x1DC0, 0x1DFF),
            b("Combining Diacritical Marks for Symbols", 0x20D0, 0x20FF),
            b("Combining Half Marks", 0xFE20, 0xFE2F)
        )),
        CharCategory("ancient", "Ancient", listOf(
            b("Ogham", 0x1680, 0x169F),
            b("Runic", 0x16A0, 0x16FF),
            b("Old Italic", 0x10300, 0x1032F),
            b("Gothic", 0x10330, 0x1034F),
            b("Deseret", 0x10400, 0x1044F),
            b("Phoenician", 0x10900, 0x1091F),
            b("Linear B Syllabary", 0x10000, 0x1007F),
            b("Cuneiform", 0x12000, 0x123FF)
        )),
        CharCategory("other", "Other Blocks", listOf(
            b("Spacing Modifier Letters", 0x02B0, 0x02FF),
            b("Phonetic Extensions", 0x1D00, 0x1D7F),
            b("Braille Patterns", 0x2800, 0x28FF),
            b("Ancient Greek Numbers", 0x10140, 0x1018F),
            b("Small Form Variants", 0xFE50, 0xFE6F)
        ))
    )

    val byId: Map<String, CharCategory> = categories.associateBy { it.id }

    private val rangeStarts: IntArray
    private val rangeEnds: IntArray
    private val rangeNames: Array<String>

    init {
        val pairs = ArrayList<BlockRange>()
        for (c in categories) for (bl in c.blocks) pairs.add(bl)
        val sorted = pairs.sortedBy { it.start }
        rangeStarts = IntArray(sorted.size) { sorted[it].start }
        rangeEnds = IntArray(sorted.size) { sorted[it].end }
        rangeNames = Array(sorted.size) { sorted[it].name }
    }

    /** Human-readable block name for a code point (catalogue first, then platform). */
    fun blockNameFor(cp: Int): String {
        var lo = 0
        var hi = rangeStarts.size - 1
        var found = -1
        while (lo <= hi) {
            val mid = (lo + hi) / 2
            if (rangeStarts[mid] <= cp) { found = mid; lo = mid + 1 } else hi = mid - 1
        }
        if (found >= 0 && cp <= rangeEnds[found]) return rangeNames[found]
        return prettify(try { java.lang.Character.UnicodeBlock.of(cp)?.toString() } catch (e: Exception) { null })
    }

    private fun prettify(raw: String?): String {
        if (raw.isNullOrEmpty()) return "Other"
        return raw.replace('_', ' ').split(' ')
            .filter { it.isNotEmpty() }
            .joinToString(" ") { p -> p.lowercase().replaceFirstChar { it.uppercase() } }
    }
}
