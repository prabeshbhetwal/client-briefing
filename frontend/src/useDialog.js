import { useEffect } from 'react';

export default function useDialog(open, close, selector) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const dialog = document.querySelector(selector);
    if (!dialog) return;
    const focusable = () => [...dialog.querySelectorAll('button, input, textarea, a[href], [tabindex="0"]')]
      .filter(el => !el.disabled);
    focusable()[0]?.focus();
    const onKey = event => {
      if (event.key === 'Escape') close();
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    dialog.addEventListener('keydown', onKey);
    return () => { dialog.removeEventListener('keydown', onKey); if (previous?.isConnected) previous.focus(); };
  }, [open, close, selector]);
}
