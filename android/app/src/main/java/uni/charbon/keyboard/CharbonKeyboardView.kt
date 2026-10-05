package uni.charbon.keyboard

import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.AbsListView
import android.widget.BaseAdapter
import android.widget.FrameLayout
import android.widget.GridView
import android.widget.HorizontalScrollView
import android.widget.LinearLayout
import android.widget.TextView

/**
 * The Charbon input view: Unicode browsing + search + info + a practical control
 * row and QWERTY/number pages. Built programmatically so it has no XML/layout
 * dependencies. All input is committed through [Listener] (the IME service).
 */
class CharbonKeyboardView(context: Context) : LinearLayout(context) {

    interface Listener {
        fun commit(text: String, key: String)
        fun backspace()
        fun enter()
        fun space()
        fun switchKeyboard()
    }

    var listener: Listener? = null

    private val prefs = CharbonPrefs(context)
    private val main = Handler(Looper.getMainLooper())

    private val dark: Boolean
    private val cBg: Int
    private val cKey: Int
    private val cKeyActive: Int
    private val cFg: Int
    private val cMuted: Int
    private val cAccent: Int
    private val cBorder: Int

    init {
        dark = computeDark()
        cBg = if (dark) Color.parseColor("#121212") else Color.parseColor("#FFFFFF")
        cKey = if (dark) Color.parseColor("#262626") else Color.parseColor("#F0F0F0")
        cKeyActive = if (dark) Color.parseColor("#3D3D3D") else Color.parseColor("#DADADA")
        cFg = if (dark) Color.parseColor("#EDEDED") else Color.parseColor("#111111")
        cMuted = if (dark) Color.parseColor("#9AA0A6") else Color.parseColor("#6B7280")
        cAccent = if (dark) Color.parseColor("#8AB4F8") else Color.parseColor("#1A73E8")
        cBorder = if (dark) Color.parseColor("#2E2E2E") else Color.parseColor("#E3E3E3")
    }

    private var mode = MODE_GRID
    private var searching = false
    private var category = "arrows"
    private var query = ""
    private var shift = false
    private var caps = false
    private var sensitive = false
    private var items: List<IntArray> = emptyList()
    private var selected: IntArray? = null

    // views
    private lateinit var searchField: TextView
    private lateinit var tabRow: LinearLayout
    private lateinit var infoBar: LinearLayout
    private lateinit var infoChar: TextView
    private lateinit var infoName: TextView
    private lateinit var infoCode: TextView
    private lateinit var favBtn: TextView
    private lateinit var content: FrameLayout
    private lateinit var controls: LinearLayout
    private lateinit var grid: GridView

    init {
        orientation = VERTICAL
        setBackgroundColor(cBg)
        buildTop()
        buildTabs()
        buildInfo()
        buildContent()
        buildControls()
        selectCategory("arrows")
    }

    fun setSensitive(value: Boolean) { sensitive = value }

    // ---------------------------------------------------------------- building

    private fun buildTop() {
        val row = LinearLayout(context)
        row.orientation = HORIZONTAL
        row.setPadding(dp(8), dp(6), dp(8), dp(6))

        val gear = iconKey("\u2699")
        gear.setOnClickListener { openSettings() }
        row.addView(gear, LinearLayout.LayoutParams(dp(42), dp(42)))

        searchField = TextView(context)
        searchField.gravity = Gravity.CENTER_VERTICAL
        searchField.setPadding(dp(12), 0, dp(12), 0)
        searchField.textSize = 14f
        searchField.setTextColor(cMuted)
        searchField.text = context.getString(R.string.search_hint)
        searchField.background = round(cKey, 10f)
        searchField.isClickable = true
        searchField.setOnClickListener { startSearch() }
        val lp = LinearLayout.LayoutParams(0, dp(42), 1f)
        lp.leftMargin = dp(8)
        row.addView(searchField, lp)

        addView(row)
    }

    private fun buildTabs() {
        val scroll = HorizontalScrollView(context)
        scroll.isHorizontalScrollBarEnabled = false
        tabRow = LinearLayout(context)
        tabRow.orientation = HORIZONTAL
        tabRow.setPadding(dp(6), 0, dp(6), dp(6))
        scroll.addView(tabRow)
        addView(scroll)
        rebuildTabs()
    }

    private fun rebuildTabs() {
        tabRow.removeAllViews()
        addTab(context.getString(R.string.recent), category == "recent") { selectCategory("recent") }
        addTab(context.getString(R.string.favorites), category == "favorites") { selectCategory("favorites") }
        for (c in UnicodeCatalog.categories) {
            addTab(c.label, category == c.id) { selectCategory(c.id) }
        }
    }

    private fun addTab(label: String, active: Boolean, onClick: () -> Unit) {
        val tv = TextView(context)
        tv.text = label
        tv.textSize = 12f
        tv.gravity = Gravity.CENTER
        tv.setPadding(dp(12), dp(7), dp(12), dp(7))
        tv.setTextColor(if (active) cBg else cMuted)
        tv.background = round(if (active) cFg else cKey, 20f)
        tv.isClickable = true
        tv.setOnClickListener { onClick() }
        val lp = LinearLayout.LayoutParams(WRAP, WRAP)
        lp.rightMargin = dp(6)
        tabRow.addView(tv, lp)
    }

    private fun buildInfo() {
        infoBar = LinearLayout(context)
        infoBar.orientation = HORIZONTAL
        infoBar.setPadding(dp(10), dp(6), dp(10), dp(6))
        infoBar.background = round(cKey, 10f)
        infoBar.visibility = GONE

        infoChar = TextView(context)
        infoChar.textSize = 24f
        infoChar.gravity = Gravity.CENTER
        infoChar.setTextColor(cFg)
        infoChar.background = round(cBg, 8f)
        infoBar.addView(infoChar, LinearLayout.LayoutParams(dp(46), dp(46)))

        val col = LinearLayout(context)
        col.orientation = VERTICAL
        col.setPadding(dp(10), 0, 0, 0)
        infoName = TextView(context)
        infoName.textSize = 13f
        infoName.setTextColor(cFg)
        infoName.maxLines = 1
        infoCode = TextView(context)
        infoCode.textSize = 11f
        infoCode.setTextColor(cMuted)
        col.addView(infoName)
        col.addView(infoCode)
        infoBar.addView(col, LinearLayout.LayoutParams(0, WRAP, 1f))

        favBtn = iconKey("\u2606")
        favBtn.setOnClickListener { toggleFavorite() }
        infoBar.addView(favBtn, LinearLayout.LayoutParams(dp(42), dp(42)))

        val lp = LinearLayout.LayoutParams(MATCH, WRAP)
        lp.setMargins(dp(8), 0, dp(8), dp(6))
        addView(infoBar, lp)
    }

    private fun buildContent() {
        content = FrameLayout(context)
        grid = GridView(context)
        grid.numColumns = GridView.AUTO_FIT
        grid.columnWidth = dp(46)
        grid.horizontalSpacing = dp(6)
        grid.verticalSpacing = dp(6)
        grid.stretchMode = GridView.STRETCH_COLUMN_WIDTH
        grid.setPadding(dp(6), dp(4), dp(6), dp(4))
        grid.adapter = GridAdapter()
        grid.setOnItemClickListener { _, _, position, _ -> onCellTap(items[position]) }
        grid.setOnItemLongClickListener { _, _, position, _ -> onCellLong(items[position]); true }
        content.addView(grid)
        addView(content, LinearLayout.LayoutParams(MATCH, 0, 1f))
    }

    private fun buildControls() {
        controls = LinearLayout(context)
        controls.orientation = HORIZONTAL
        controls.setPadding(dp(4), dp(4), dp(4), dp(6))

        controls.addView(controlKey("ABC") { setMode(MODE_ABC) })
        controls.addView(controlKey("?123") { setMode(MODE_NUM) })
        controls.addView(controlKey("\u2318") { setMode(MODE_GRID) })

        val space = controlKey("\u2423") { if (searching) query += " " else listener?.space() }
        val spLp = LinearLayout.LayoutParams(0, dp(46), 2f)
        spLp.leftMargin = dp(4); spLp.rightMargin = dp(4)
        controls.addView(space, spLp)

        val backspaceKey = iconKey("\u232B") { if (searching) queryDrop() else listener?.backspace() }
        controls.addView(backspaceKey, LinearLayout.LayoutParams(dp(46), dp(46)))

        val enterKey = iconKey("\u21B5") { if (searching) exitSearch(false) else listener?.enter() }
        controls.addView(enterKey, LinearLayout.LayoutParams(dp(46), dp(46)))

        val globeKey = iconKey("\uD83C\uDF10") { listener?.switchKeyboard() }
        controls.addView(globeKey, LinearLayout.LayoutParams(dp(46), dp(46)))

        addView(controls)
    }

    private fun controlKey(label: String, onClick: () -> Unit): TextView {
        val tv = TextView(context)
        tv.text = label
        tv.textSize = 14f
        tv.gravity = Gravity.CENTER
        tv.setTextColor(cFg)
        tv.background = round(cKey, 10f)
        tv.isClickable = true
        tv.setOnClickListener { feedback(); onClick() }
        tv.layoutParams = LinearLayout.LayoutParams(dp(52), dp(46))
        return tv
    }

    private fun iconKey(glyph: String, onClick: (() -> Unit)? = null): TextView {
        val tv = TextView(context)
        tv.text = glyph
        tv.textSize = 18f
        tv.gravity = Gravity.CENTER
        tv.setTextColor(cFg)
        tv.background = round(cKey, 10f)
        tv.isClickable = true
        if (onClick != null) {
            tv.setOnClickListener { feedback(); onClick() }
        }
        return tv
    }

    // ------------------------------------------------------------- navigation

    private fun selectCategory(id: String) {
        searching = false
        query = ""
        category = id
        rebuildTabs()
        updateSearchField()
        if (id == "recent" || id == "favorites") {
            setItems(keysToItems(if (id == "recent") prefs.recent() else prefs.favorites()))
        } else {
            showLoading()
            Thread {
                val list = UnicodeDatabase.itemsForCategory(id)
                main.post { if (category == id && !searching) setItems(list) }
            }.start()
        }
        if (mode == MODE_GRID) renderContent()
    }

    private fun startSearch() {
        searching = true
        query = ""
        setMode(MODE_ABC)
        updateSearchField()
        setItems(emptyList())
    }

    private fun exitSearch(clear: Boolean) {
        if (clear) query = ""
        searching = false
        updateSearchField()
        if (query.isBlank()) {
            selectCategory(category)
        } else {
            setItems(emptyList())
            showLoading()
            Thread {
                val cps = UnicodeDatabase.search(query, 400)
                val list = cps.map { intArrayOf(it) }
                main.post { if (searching.not() && query.isNotBlank()) setItems(list) }
            }.start()
        }
        setMode(MODE_GRID)
    }

    private fun queryDrop() {
        if (query.isNotEmpty()) {
            query = query.substring(0, query.length - 1)
            updateSearchField()
            liveSearch()
        }
    }

    private fun liveSearch() {
        if (query.isBlank()) { setItems(emptyList()); return }
        Thread {
            val cps = UnicodeDatabase.search(query, 400)
            val list = cps.map { intArrayOf(it) }
            main.post { if (searching) setItems(list) }
        }.start()
    }

    private fun updateSearchField() {
        searchField.text = if (query.isEmpty()) context.getString(R.string.search_hint) else query
        searchField.setTextColor(if (query.isEmpty()) cMuted else cFg)
        searchField.background = round(if (searching) cKeyActive else cKey, 10f)
    }

    private fun setMode(m: Int) {
        mode = m
        renderContent()
    }

    private fun renderContent() {
        grid.visibility = if (mode == MODE_GRID && !searching) View.VISIBLE else View.GONE
        content.removeAllViews()
        if (mode == MODE_GRID && !searching) {
            content.addView(grid)
        } else {
            val pad = if (mode == MODE_NUM) buildNumberPad(searching) else buildQwerty(searching)
            content.addView(pad, FrameLayout.LayoutParams(MATCH, MATCH))
        }
        controls.visibility = if (searching) View.GONE else View.VISIBLE
    }

    private fun setItems(list: List<IntArray>) {
        items = list
        (grid.adapter as GridAdapter).notifyDataSetChanged()
        if (grid.visibility != View.VISIBLE && !searching && mode == MODE_GRID) {
            grid.visibility = View.VISIBLE
        }
    }

    private fun showLoading() {
        items = emptyList()
        (grid.adapter as GridAdapter).notifyDataSetChanged()
    }

    // ------------------------------------------------------------- selection

    private fun onCellTap(cps: IntArray) {
        val text = UnicodeDatabase.textFor(cps)
        val key = UnicodeDatabase.keyOf(cps)
        listener?.commit(text, key)
        if (prefs.autoRecent && !sensitive) prefs.addRecent(key)
        select(cps)
        refreshIfRecent()
    }

    private fun onCellLong(cps: IntArray) {
        select(cps)
    }

    private fun select(cps: IntArray) {
        selected = cps
        if (!prefs.showInfo) return
        val first = cps[0]
        val preview = if (UnicodeDatabase.isCombining(first)) "\u25CC" + UnicodeDatabase.textFor(cps)
        else UnicodeDatabase.textFor(cps)
        infoChar.text = preview
        infoName.text = UnicodeDatabase.nameFor(first)
        val code = UnicodeDatabase.keyOf(cps) +
            "  ·  " + UnicodeDatabase.blockFor(first) +
            "  ·  " + UnicodeDatabase.generalCategory(first)
        infoCode.text = code
        val key = UnicodeDatabase.keyOf(cps)
        val fav = prefs.isFavorite(key)
        favBtn.text = if (fav) "\u2605" else "\u2606"
        favBtn.setTextColor(if (fav) Color.parseColor("#F5A623") else cFg)
        infoBar.visibility = VISIBLE
    }

    private fun toggleFavorite() {
        val cps = selected ?: return
        val key = UnicodeDatabase.keyOf(cps)
        val nowFav = prefs.toggleFavorite(key)
        favBtn.text = if (nowFav) "\u2605" else "\u2606"
        favBtn.setTextColor(if (nowFav) Color.parseColor("#F5A623") else cFg)
        if (category == "favorites") selectCategory("favorites")
    }

    private fun refreshIfRecent() {
        if (category == "recent" && !searching) setItems(keysToItems(prefs.recent()))
    }

    private fun keysToItems(keys: List<String>): List<IntArray> =
        keys.map { UnicodeDatabase.codePointsOfKey(it) }.filter { it.isNotEmpty() }

    // ----------------------------------------------------------------- qwerty

    private fun buildQwerty(fromSearch: Boolean): View {
        val wrap = LinearLayout(context)
        wrap.orientation = VERTICAL
        wrap.setPadding(dp(4), dp(2), dp(4), dp(4))

        val rows = listOf("qwertyuiop", "asdfghjkl", "zxcvbnm")
        for ((idx, letters) in rows.withIndex()) {
            val row = LinearLayout(context)
            row.orientation = HORIZONTAL
            row.gravity = Gravity.CENTER
            if (idx == rows.lastIndex) {
                val shiftKey = qKey(if (caps) "\u21E7\u21E7" else "\u21E7") { toggleShiftTap() }
                shiftKey.setOnLongClickListener { toggleCaps(); true }
                row.addView(shiftKey, keyLp(1.5f))
            }
            for (ch in letters) {
                val label = if (shift || caps) ch.uppercase() else ch.toString()
                row.addView(qKey(label) {
                    typeChar(label, fromSearch)
                    if (!fromSearch && shift && !caps) {
                        shift = false
                        renderContent()
                    }
                }, keyLp(1f))
            }
            if (idx == rows.lastIndex) {
                row.addView(qKey("\u232B") { if (fromSearch) queryDrop() else listener?.backspace() }, keyLp(1.5f))
            }
            wrap.addView(row)
        }

        if (fromSearch) wrap.addView(searchActionRow(backToLetters = false))
        return wrap
    }

    private fun buildNumberPad(fromSearch: Boolean): View {
        val wrap = LinearLayout(context)
        wrap.orientation = VERTICAL
        wrap.setPadding(dp(4), dp(2), dp(4), dp(4))
        val rows = listOf(
            "1234567890",
            "-/:;()\$&@\"",
            ".,?!'#+="
        )
        for (r in rows) {
            val row = LinearLayout(context)
            row.orientation = HORIZONTAL
            row.gravity = Gravity.CENTER
            for (ch in r) {
                val s = ch.toString()
                row.addView(qKey(s) { typeChar(s, fromSearch) }, keyLp(1f))
            }
            wrap.addView(row)
        }
        if (fromSearch) wrap.addView(searchActionRow(backToLetters = true))
        return wrap
    }

    private fun searchActionRow(backToLetters: Boolean): View {
        val row = LinearLayout(context)
        row.orientation = HORIZONTAL
        row.gravity = Gravity.CENTER
        if (backToLetters) {
            row.addView(qKey("ABC") { setMode(MODE_ABC) }, keyLp(1.2f))
        } else {
            row.addView(qKey("?123") { setMode(MODE_NUM) }, keyLp(1.2f))
        }
        row.addView(qKey("\u2423") { query += " "; updateSearchField(); liveSearch() }, keyLp(2f))
        row.addView(qKey("\u2713") { exitSearch(false) }, keyLp(1.2f))
        return row
    }

    private fun keyLp(weight: Float) = LinearLayout.LayoutParams(0, dp(44), weight).apply {
        setMargins(dp(3), dp(3), dp(3), dp(3))
    }

    private fun qKey(label: String, onClick: () -> Unit): TextView {
        val tv = TextView(context)
        tv.text = label
        tv.textSize = 16f
        tv.gravity = Gravity.CENTER
        tv.setTextColor(cFg)
        tv.background = round(cKey, 9f)
        tv.isClickable = true
        tv.setOnClickListener { feedback(); onClick() }
        return tv
    }

    private fun typeChar(ch: String, fromSearch: Boolean) {
        if (fromSearch) {
            query += ch
            updateSearchField()
            liveSearch()
        } else {
            listener?.commit(ch, ch)
        }
    }

    private fun toggleShiftTap() {
        if (caps) { caps = false; shift = false } else shift = !shift
        renderContent()
    }

    private fun toggleCaps() {
        caps = !caps
        shift = false
        renderContent()
    }

    // -------------------------------------------------------------- platform

    private fun openSettings() {
        val i = Intent(context, MainActivity::class.java)
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(i)
    }

    private fun feedback() {
        if (prefs.vibrate) {
            try {
                val v = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                if (v != null && v.hasVibrator()) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        v.vibrate(VibrationEffect.createOneShot(12, VibrationEffect.DEFAULT_AMPLITUDE))
                    } else {
                        @Suppress("DEPRECATION") v.vibrate(12)
                    }
                }
            } catch (e: Exception) { /* ignore */ }
        }
    }

    private fun computeDark(): Boolean {
        when (prefs.theme) {
            "dark" -> return true
            "light" -> return false
        }
        val night = (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
            Configuration.UI_MODE_NIGHT_YES
        return night
    }

    private fun round(color: Int, radiusDp: Float): GradientDrawable {
        val d = GradientDrawable()
        d.setColor(color)
        d.cornerRadius = dp(radiusDp.toInt()).toFloat()
        return d
    }

    private fun dp(v: Int): Int = (v * resources.displayMetrics.density).toInt()

    private fun charSizeSp(): Float = when (prefs.charSize) {
        "small" -> 18f
        "large" -> 26f
        else -> 22f
    }

    private fun cellHeight(): Int = when (prefs.charSize) {
        "small" -> dp(42)
        "large" -> dp(60)
        else -> dp(50)
    }

    // --------------------------------------------------------------- adapter

    private inner class GridAdapter : BaseAdapter() {
        override fun getCount(): Int = items.size
        override fun getItem(position: Int): Any = items[position]
        override fun getItemId(position: Int): Long = position.toLong()

        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val tv = (convertView as? TextView) ?: TextView(context).apply {
                gravity = Gravity.CENTER
                setPadding(dp(2), 0, dp(2), 0)
            }
            val cps = items[position]
            val first = cps[0]
            tv.text = if (UnicodeDatabase.isCombining(first)) "\u25CC" + UnicodeDatabase.textFor(cps)
            else UnicodeDatabase.textFor(cps)
            tv.setTextColor(cFg)
            tv.textSize = charSizeSp()
            tv.background = round(cKey, 10f)
            tv.layoutParams = AbsListView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, cellHeight()
            )
            return tv
        }
    }

    companion object {
        private const val MODE_GRID = 0
        private const val MODE_ABC = 1
        private const val MODE_NUM = 2
        private const val WRAP = ViewGroup.LayoutParams.WRAP_CONTENT
        private const val MATCH = ViewGroup.LayoutParams.MATCH_PARENT
    }
}
