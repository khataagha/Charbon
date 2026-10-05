package uni.charbon.keyboard

import android.content.Context

/**
 * Local persistence for Charbon. Everything is stored privately on-device in
 * SharedPreferences. Nothing is ever transmitted. Recent/favorites are stored as
 * Unicode keys ("U+2192" or "U+1F468 U+200D ...").
 */
class CharbonPrefs(context: Context) {

    private val sp = context.getSharedPreferences("charbon_prefs", Context.MODE_PRIVATE)

    var theme: String
        get() = sp.getString("theme", "system") ?: "system"
        set(v) = sp.edit().putString("theme", v).apply()

    var keyHeight: String
        get() = sp.getString("keyHeight", "medium") ?: "medium"
        set(v) = sp.edit().putString("keyHeight", v).apply()

    var charSize: String
        get() = sp.getString("charSize", "medium") ?: "medium"
        set(v) = sp.edit().putString("charSize", v).apply()

    var showInfo: Boolean
        get() = sp.getBoolean("showInfo", true)
        set(v) = sp.edit().putBoolean("showInfo", v).apply()

    var vibrate: Boolean
        get() = sp.getBoolean("vibrate", true)
        set(v) = sp.edit().putBoolean("vibrate", v).apply()

    var sound: Boolean
        get() = sp.getBoolean("sound", false)
        set(v) = sp.edit().putBoolean("sound", v).apply()

    var autoRecent: Boolean
        get() = sp.getBoolean("autoRecent", true)
        set(v) = sp.edit().putBoolean("autoRecent", v).apply()

    var recentLimit: Int
        get() = sp.getInt("recentLimit", 32)
        set(v) = sp.edit().putInt("recentLimit", v).apply()

    fun recent(): MutableList<String> =
        (sp.getString("recent", "") ?: "").split('\n').filter { it.isNotEmpty() }.toMutableList()

    fun saveRecent(list: List<String>) =
        sp.edit().putString("recent", list.joinToString("\n")).apply()

    fun addRecent(key: String) {
        val l = recent()
        l.remove(key)
        l.add(0, key)
        saveRecent(l.take(recentLimit.coerceAtLeast(1)))
    }

    fun clearRecent() = sp.edit().putString("recent", "").apply()

    fun favorites(): MutableList<String> =
        (sp.getString("favorites", "") ?: "").split('\n').filter { it.isNotEmpty() }.toMutableList()

    fun saveFavorites(list: List<String>) =
        sp.edit().putString("favorites", list.joinToString("\n")).apply()

    fun isFavorite(key: String) = favorites().contains(key)

    fun toggleFavorite(key: String): Boolean {
        val l = favorites()
        return if (l.contains(key)) {
            l.remove(key); saveFavorites(l); false
        } else {
            l.add(0, key); saveFavorites(l); true
        }
    }

    fun clearFavorites() = sp.edit().putString("favorites", "").apply()

    fun resetAll() = sp.edit().clear().apply()
}
