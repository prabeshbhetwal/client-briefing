import { useState, useRef } from 'react';

export default function Admin() {
  const [token, setToken] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [status, setStatus] = useState('Enter the server admin token to review saved briefs.');
  const [loading, setLoading] = useState(false);
  const generation = useRef(0);

  async function load(event, before = null) {
    event.preventDefault();
    if (loading) return;
    const request = ++generation.current;
    setLoading(true);
    setStatus('Loading submissions…');
    try {
      const response = await fetch(`/api/submissions${before ? `?before=${before}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10000),
      });
      const result = await response.json();
      if (request !== generation.current) return;
      if (!response.ok) throw new Error(result.error);
      setSubmissions(previous => before ? [...previous, ...result.submissions] : result.submissions);
      setCursor(result.next);
      setStatus(result.submissions.length ? 'Saved submissions loaded.' : 'No submissions on this page.');
    } catch (error) {
      if (request !== generation.current) return;
      setSubmissions([]);
      setCursor(null);
      setStatus(error.message || 'Could not load submissions. Retry later.');
    } finally { if (request === generation.current) setLoading(false); }
  }

  return (
    <main className="admin-page">
      <a href="/">Back to briefing form</a>
      <h1>Review submitted briefs</h1>
      <p>Token stays in this page’s memory. Use a trusted device; close this tab after review.</p>
      <form onSubmit={load}>
        <label htmlFor="admin-token">Admin token</label>
        <input id="admin-token" type="password" value={token} required autoComplete="off"
          onChange={event => { generation.current++; setLoading(false); setToken(event.target.value); setSubmissions([]); setCursor(null); }} />
        <button type="submit" disabled={loading}>Load submissions</button>
        <button type="button" onClick={() => { generation.current++; setLoading(false); setToken(''); setSubmissions([]); setCursor(null); setStatus('Signed out.'); }}>Sign out</button>
      </form>
      <p role="status">{status}</p>
      {submissions.map(item => (
        <details key={item._id}>
          <summary>{item.title} — {new Date(item.createdAt).toLocaleString('en-AU')}</summary>
          <p>Contact: {item.senderEmail || 'Not provided'} · Guide: {item.guideId}</p>
          <pre>{item.summary || item.questions.map(q => `${q.question}\n${q.answer}`).join('\n\n')}</pre>
        </details>
      ))}
      {cursor && <button type="button" disabled={loading} onClick={event => load(event, cursor)}>Load older submissions</button>}
    </main>
  );
}
