function getCursortPosition (ctrl) {
  var CaretPos = 0 // IE Support
  if (document.selection) {
    ctrl.focus()
    var Sel = document.selection.createRange()
    Sel.moveStart('character', -ctrl.value.length)
    CaretPos = Sel.text.length
  }
  // Firefox support
  else if (ctrl.selectionStart || ctrl.selectionStart === '0') { CaretPos = ctrl.selectionStart }
  return (CaretPos)
}

// 设置光标位置
function setCaretPosition (ctrl, pos) {
  if (ctrl.setSelectionRange) {
    ctrl.focus()
    ctrl.setSelectionRange(pos, pos)
  } else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange()
    range.collapse(true)
    range.moveEnd('character', pos)
    range.moveStart('character', pos)
    range.select()
  }
}

export function supportTab (id, tablen) {
  if (!tablen || tablen < 0)tablen = 2
  var spaces = ' '
  for (var i = 1; i < tablen; i++)spaces += ' '
  var textarea = document.getElementById(id)
  textarea.onkeydown = function (event) {
    // support tab on textarea
    var newCaretPosition
    if (event.keyCode === 9) { // tab was pressed
      newCaretPosition = getCursortPosition(textarea) + ' '.length * tablen
      textarea.value = textarea.value.substring(0, getCursortPosition(textarea)) + spaces + textarea.value.substring(getCursortPosition(textarea), textarea.value.length)
      setCaretPosition(textarea, newCaretPosition)
      return false
    }
    if (event.keyCode === 8) {
      // backspace
      if (textarea.value.substring(getCursortPosition(textarea) - tablen, getCursortPosition(textarea)) === spaces) {
        // it's a tab space
        newCaretPosition = getCursortPosition(textarea) - tablen
        textarea.value = textarea.value.substring(0, getCursortPosition(textarea) - tablen) + textarea.value.substring(getCursortPosition(textarea), textarea.value.length)
        if (newCaretPosition > 0)setCaretPosition(textarea, newCaretPosition)
        else setCaretPosition(textarea, 0)
      }
    }
    if (event.keyCode === 37) { // left arrow
      if (textarea.value.substring(getCursortPosition(textarea) - tablen, getCursortPosition(textarea)) === spaces) {
        // it's a tab space
        newCaretPosition = getCursortPosition(textarea) - tablen - 1
        if (newCaretPosition > 0)setCaretPosition(textarea, newCaretPosition)
        else setCaretPosition(textarea, 0)
      }
    }
    if (event.keyCode === 39) {
      // right arrow
      if (textarea.value.substring(getCursortPosition(textarea) + tablen, getCursortPosition(textarea)) === spaces) {
        // it's a tab space
        newCaretPosition = getCursortPosition(textarea) + tablen + 1
        if (newCaretPosition > 0)setCaretPosition(textarea, newCaretPosition)
        else setCaretPosition(textarea, 0)
      }
    }
  }
}
