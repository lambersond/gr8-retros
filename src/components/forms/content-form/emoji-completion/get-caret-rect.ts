const MIRROR_PROPERTIES = [
  'direction',
  'boxSizing',
  'width',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
  'whiteSpace',
  'wordWrap',
  'wordBreak',
] as const

/**
 * Returns a DOMRect-like object for the caret position inside a textarea,
 * in viewport coordinates. Uses a hidden mirror div to measure.
 */
export function getCaretRect(
  textarea: HTMLTextAreaElement,
  position: number,
): DOMRect {
  const div = document.createElement('div')
  const computed = getComputedStyle(textarea)

  div.style.position = 'absolute'
  div.style.visibility = 'hidden'
  div.style.whiteSpace = 'pre-wrap'
  div.style.wordWrap = 'break-word'
  div.style.height = 'auto'
  div.style.overflow = 'hidden'

  for (const prop of MIRROR_PROPERTIES) {
    div.style.setProperty(prop, computed.getPropertyValue(prop))
  }

  const textBefore = textarea.value.slice(0, position)
  div.textContent = textBefore

  const span = document.createElement('span')
  span.textContent = textarea.value.slice(position) || '\u200b'
  div.appendChild(span)

  document.body.appendChild(div)

  const textareaRect = textarea.getBoundingClientRect()
  const divRect = div.getBoundingClientRect()
  const spanRect = span.getBoundingClientRect()

  const top =
    textareaRect.top + (spanRect.top - divRect.top) - textarea.scrollTop
  const left =
    textareaRect.left + (spanRect.left - divRect.left) - textarea.scrollLeft

  document.body.removeChild(div)

  return DOMRect.fromRect({ x: left, y: top, width: 0, height: spanRect.height })
}
