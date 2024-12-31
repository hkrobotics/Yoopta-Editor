// [TODO] - check for window.getSelection()
export function getRectByCurrentSelection(): DOMRect {
  const domSelection = window.getSelection();
  const domRange = domSelection!.getRangeAt(0);
  // const rect = domRange.getBoundingClientRect();

  let selectionRect = domRange.getBoundingClientRect();

  if (domSelection && domSelection.rangeCount > 0) {
    if (selectionRect.width === 0 && selectionRect.height === 0) {
      const startNode = domRange.startContainer;
      if (startNode.nodeType === Node.TEXT_NODE && startNode.parentElement) {
        selectionRect = startNode.parentElement.getBoundingClientRect();
      } else if (startNode.nodeType === Node.ELEMENT_NODE) {
        const startNodeRef = startNode as HTMLElement;
        selectionRect = startNodeRef.getBoundingClientRect();
      }
    }
  } else {
    console.log('No selection found');
    return { x: 0, y: 0, width: 0, height: 0, bottom: 0, left: 0, right: 0, top: 0 };
  }

  console.log('selectionRect : ', selectionRect);

  return selectionRect;
}
