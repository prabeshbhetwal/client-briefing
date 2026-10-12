export async function saveSubmission(payload) {
  // shortcut: a timed-out save may already exist, add idempotency when retries must avoid duplicates.
  const response = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Could not save submission. Retry later.');
  return result;
}

export function downloadSummary(text, filename = 'website-brief.txt') {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function openSummary(html, text) {
  const popup = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
  if (popup) {
    popup.opener = null;
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
  } else downloadSummary(text);
  return popup ? 'Printable summary opened.' : 'Pop-up blocked; complete summary downloaded.';
}

export function loadDraft(key, initial) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return initial;
    const result = { ...initial };
    for (const [key, value] of Object.entries(initial)) {
      const candidate = saved[key];
      if (Array.isArray(value)) {
        if (Array.isArray(candidate) && candidate.every(v => typeof v === 'string')) result[key] = candidate;
      } else if (typeof candidate === typeof value) result[key] = candidate;
    }
    return result;
  } catch {
    return initial;
  }
}
