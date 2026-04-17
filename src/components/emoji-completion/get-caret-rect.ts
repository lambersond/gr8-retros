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
 * Returns a DOMRect-like object for the caret position inside a text element,
 * in viewport coordinates. Uses a hidden mirror div to measure.
 */
export function getCaretRect(
  element: HTMLTextAreaElement | HTMLInputElement,
  position: number,
): DOMRect {
  const div = document.createElement('div')
  const computed = getComputedStyle(element)

  div.style.position = 'absolute'
  div.style.visibility = 'hidden'
  div.style.whiteSpace = 'pre-wrap'
  div.style.overflowWrap = 'break-word'
  div.style.height = 'auto'
  div.style.overflow = 'hidden'

  for (const prop of MIRROR_PROPERTIES) {
    div.style.setProperty(prop, computed.getPropertyValue(prop))
  }

  const textBefore = element.value.slice(0, position)
  div.textContent = textBefore

  const span = document.createElement('span')
  span.textContent = element.value.slice(position) || '\u200B'
  div.append(span)

  document.body.append(div)

  const elRect = element.getBoundingClientRect()
  const divRect = div.getBoundingClientRect()
  const spanRect = span.getBoundingClientRect()

  const top = elRect.top + (spanRect.top - divRect.top) - element.scrollTop
  const left = elRect.left + (spanRect.left - divRect.left) - element.scrollLeft

  div.remove()

  return DOMRect.fromRect({
    x: left,
    y: top,
    width: 0,
    height: spanRect.height,
  })
}
