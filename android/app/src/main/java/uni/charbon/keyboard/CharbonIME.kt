package uni.charbon.keyboard

import android.view.View
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputMethodManager
import android.inputmethodservice.InputMethodService

/**
 * Charbon's Input Method Service. Registers as a system keyboard, builds the
 * Unicode input view, and commits text through the active InputConnection.
 */
class CharbonIME : InputMethodService(), CharbonKeyboardView.Listener {

    private var keyboard: CharbonKeyboardView? = null

    override fun onCreateInputView(): View {
        val v = CharbonKeyboardView(this)
        v.listener = this
        keyboard = v
        // Warm up the Unicode index in the background so search is instant.
        UnicodeDatabase.ensureLoaded { }
        return v
    }

    override fun onStartInputView(info: EditorInfo?, restarting: Boolean) {
        super.onStartInputView(info, restarting)
        val type = info?.inputType ?: 0
        val password =
            (type and EditorInfo.TYPE_TEXT_VARIATION_PASSWORD) == EditorInfo.TYPE_TEXT_VARIATION_PASSWORD ||
            (type and EditorInfo.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD) == EditorInfo.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD ||
            (type and EditorInfo.TYPE_TEXT_VARIATION_WEB_PASSWORD) == EditorInfo.TYPE_TEXT_VARIATION_WEB_PASSWORD ||
            (type and EditorInfo.TYPE_TEXT_VARIATION_PASSWORD) == EditorInfo.TYPE_NUMBER_VARIATION_PASSWORD
        keyboard?.setSensitive(password)
    }

    override fun commit(text: String, key: String) {
        currentInputConnection?.commitText(text, 1)
    }

    override fun backspace() {
        val ic = currentInputConnection ?: return
        val sel = ic.getSelectedText(0)
        if (!sel.isNullOrEmpty()) {
            ic.commitText("", 1)
        } else {
            ic.deleteSurroundingText(1, 0)
        }
    }

    override fun enter() {
        val ic = currentInputConnection ?: return
        val action = currentInputEditorInfo?.imeOptions?.and(EditorInfo.IME_MASK_ACTION) ?: EditorInfo.IME_ACTION_NONE
        if (action != EditorInfo.IME_ACTION_NONE && action != EditorInfo.IME_ACTION_UNSPECIFIED) {
            ic.performEditorAction(action)
        } else {
            ic.commitText("\n", 1)
        }
    }

    override fun space() {
        currentInputConnection?.commitText(" ", 1)
    }

    override fun switchKeyboard() {
        try {
            val imm = getSystemService(INPUT_METHOD_SERVICE) as? InputMethodManager
            imm?.showInputMethodPicker()
        } catch (e: Exception) { /* ignore */ }
    }
}
