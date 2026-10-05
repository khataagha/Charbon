package uni.charbon.keyboard

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SwitchCompat

/**
 * Setup + settings screen. Also opened from the keyboard's gear key.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var prefs: CharbonPrefs

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        prefs = CharbonPrefs(this)

        val scroll = ScrollView(this)
        val root = LinearLayout(this)
        root.orientation = LinearLayout.VERTICAL
        val pad = dp(20)
        root.setPadding(pad, pad, pad, pad)
        scroll.addView(root)
        setContentView(scroll)

        root.addView(heading("Charbon"))
        root.addView(body("Universal Unicode keyboard. Enable it below, then choose Charbon as your active keyboard."))

        root.addView(action("Enable Charbon keyboard") {
            startActivity(Intent(Settings.ACTION_INPUT_METHOD_SETTINGS))
        })
        root.addView(action("Choose active keyboard") {
            val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as? InputMethodManager
            imm?.showInputMethodPicker()
        })

        root.addView(section("Appearance"))
        root.addView(body("Theme"))
        root.addView(segmented(listOf("light", "dark", "system"), prefs.theme) { prefs.theme = it })
        root.addView(body("Keyboard height"))
        root.addView(segmented(listOf("compact", "medium", "tall"), prefs.keyHeight) { prefs.keyHeight = it })
        root.addView(body("Character size"))
        root.addView(segmented(listOf("small", "medium", "large"), prefs.charSize) { prefs.charSize = it })

        root.addView(section("Behavior"))
        root.addView(toggle("Vibrate on key press", prefs.vibrate) { prefs.vibrate = it })
        root.addView(toggle("Sound on key press", prefs.sound) { prefs.sound = it })
        root.addView(toggle("Auto-add to Recent", prefs.autoRecent) { prefs.autoRecent = it })
        root.addView(toggle("Show character info panel", prefs.showInfo) { prefs.showInfo = it })

        root.addView(section("Data"))
        root.addView(action("Clear recently used") {
            prefs.clearRecent(); toast("Recent history cleared")
        })
        root.addView(action("Clear favorites") {
            prefs.clearFavorites(); toast("Favorites cleared")
        })
        root.addView(action("Reset all settings") {
            prefs.resetAll(); toast("Settings reset — reopen this screen")
        })

        root.addView(body("Privacy: Charbon works fully offline and never transmits anything you type. " +
            "Unicode data comes from your device's built-in Unicode database. No internet permission is requested."))
    }

    // ------------------------------------------------------------- builders

    private fun heading(t: String): TextView = TextView(this).apply {
        text = t
        textSize = 24f
        setPadding(0, 0, 0, dp(8))
    }

    private fun body(t: String): TextView = TextView(this).apply {
        text = t
        textSize = 13f
        setPadding(0, dp(4), 0, dp(8))
    }

    private fun section(t: String): TextView = TextView(this).apply {
        text = t.uppercase()
        textSize = 11f
        setPadding(0, dp(20), 0, dp(6))
    }

    private fun action(label: String, onClick: () -> Unit): Button = Button(this).apply {
        text = label
        isAllCaps = false
        setOnClickListener { onClick() }
        layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
    }

    private fun toggle(label: String, checked: Boolean, onChange: (Boolean) -> Unit): SwitchCompat = SwitchCompat(this).apply {
        text = label
        isChecked = checked
        setPadding(0, dp(8), 0, dp(8))
        setOnCheckedChangeListener { _, value -> onChange(value) }
    }

    private fun segmented(options: List<String>, current: String, onPick: (String) -> Unit): LinearLayout {
        val row = LinearLayout(this)
        row.orientation = LinearLayout.HORIZONTAL
        for (opt in options) {
            val b = Button(this).apply {
                text = opt.replaceFirstChar { it.uppercase() }
                isAllCaps = false
                setOnClickListener { onPick(opt); toast("Saved") }
            }
            val lp = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
            lp.rightMargin = dp(6)
            row.addView(b, lp)
        }
        return row
    }

    private fun toast(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
    }

    private fun dp(v: Int): Int = (v * resources.displayMetrics.density).toInt()
}
