import { useState, useEffect, useRef, useCallback } from 'react';
import '../home.css';

const CONFIG = {
  developerName: 'Prabesh Bhetwal',
  emailjs_public_key: 'fKgFK2YwaZ4q2H_8R',
  emailjs_service_id: 'personalprojects',
  emailjs_template_id: 'projects_template',
  formspree_endpoint: 'https://formspree.io/f/mykbowbn',
};

const SAVE_KEY = 'website_brief_v2';

const INITIAL_FORM = {
  A1_Business_Name: '',
  A2_Business_Description: '',
  A3_Primary_Goal: '',
  A4_Reference_Website: '',
  'B1_Audience[]': [],
  B1_Audience_Other: '',
  B2_Primary_Audience: '',
  B3_Visitor_Intent: '',
  B4_Visitor_Outcome: '',
  C1_Success_Definition: '',
  C2_Goal_Professional: false,
  C2_Priority_Professional: '',
  C2_Goal_Projects: false,
  C2_Priority_Projects: '',
  C2_Goal_Attract: false,
  C2_Priority_Attract: '',
  C2_Goal_Contact: false,
  C2_Priority_Contact: '',
  C2_Goal_Credibility: false,
  C2_Priority_Credibility: '',
  C2_Goal_Other: false,
  C2_Priority_Other: '',
  C2_Other_Goal_Detail: '',
  C3_Call_To_Action: '',
  D1_Home_When: '',
  D1_Home_Have: '',
  D1_Home_Need: '',
  D2_About_When: '',
  D2_About_Have: '',
  D2_About_Need: '',
  D3_Projects_When: '',
  D3_Projects_Have: '',
  D3_Projects_Need: '',
  D3_Projects_Count: '',
  D4_Contact_When: '',
  D4_Contact_Details: '',
  D5_Other_Pages: '',
  'E1_Future[]': [],
  E2_Future_Ideas: '',
  'F1_Feel[]': [],
  F1_Feel_Other: '',
  F2_Liked_Sites: '',
  'F3_Dislikes[]': [],
  F3_Dislikes_Other: '',
  F4_Tone: '',
  F4_Balance: '',
  F4_Structure: '',
  F5_Colours: '',
  'G1_Have[]': [],
  G2_Domain: '',
  G2_Domain_Name: '',
  'G3_Contact_Methods[]': [],
  G3_Contact_Details: '',
  G4_Social_Media: '',
  H1_Questions: '',
  H2_Concerns: '',
  H3_Definitely_Not: '',
  H4_Anything_Else: '',
};

function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function buildSummaryText(data, senderEmail) {
  const clientName = (data.A1_Business_Name || '').trim();
  const lines = [];
  lines.push(`WEBSITE BRIEF${clientName ? ' — ' + clientName.toUpperCase() : ''}`);
  lines.push('==================================================');
  lines.push(`Date: ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`);
  if (senderEmail) lines.push(`Submitted by: ${senderEmail}`);
  lines.push('');

  const sections = [
    ['A — Quick Overview', ['A1_Business_Name', 'A2_Business_Description', 'A3_Primary_Goal', 'A4_Reference_Website']],
    ['B — Target Audience', ['B1_Audience[]', 'B1_Audience_Other', 'B2_Primary_Audience', 'B3_Visitor_Intent', 'B4_Visitor_Outcome']],
    ['C — Business Goals', ['C1_Success_Definition', 'C2_Goal_Professional', 'C2_Priority_Professional', 'C2_Goal_Projects', 'C2_Priority_Projects', 'C2_Goal_Attract', 'C2_Priority_Attract', 'C2_Goal_Contact', 'C2_Priority_Contact', 'C2_Goal_Credibility', 'C2_Priority_Credibility', 'C2_Other_Goal_Detail', 'C3_Call_To_Action']],
    ['D — Version 1 Pages', ['D1_Home_When', 'D1_Home_Have', 'D1_Home_Need', 'D2_About_When', 'D2_About_Have', 'D2_About_Need', 'D3_Projects_When', 'D3_Projects_Have', 'D3_Projects_Need', 'D3_Projects_Count', 'D4_Contact_When', 'D4_Contact_Details', 'D5_Other_Pages']],
    ['E — Future Plans', ['E1_Future[]', 'E2_Future_Ideas']],
    ['F — Look and Feel', ['F1_Feel[]', 'F1_Feel_Other', 'F2_Liked_Sites', 'F3_Dislikes[]', 'F3_Dislikes_Other', 'F4_Tone', 'F4_Balance', 'F4_Structure', 'F5_Colours']],
    ['G — Practical Details', ['G1_Have[]', 'G2_Domain', 'G2_Domain_Name', 'G3_Contact_Methods[]', 'G3_Contact_Details', 'G4_Social_Media']],
    ['H — Questions & Concerns', ['H1_Questions', 'H2_Concerns', 'H3_Definitely_Not', 'H4_Anything_Else']],
  ];

  sections.forEach(([title, keys]) => {
    lines.push('--------------------------------------------------');
    lines.push(title);
    lines.push('--------------------------------------------------');
    keys.forEach((key) => {
      const val = data[key];
      if (!val) return;
      if (Array.isArray(val) && val.length === 0) return;
      const displayVal = Array.isArray(val) ? val.join(', ') : String(val);
      if (displayVal.trim()) {
        const displayKey = key.replace(/_/g, ' ').replace(/\[\]/, '').replace(/^[A-H]\d+\s*/, '').trim();
        lines.push(`${displayKey}:\n  ${displayVal.replace(/\n/g, '\n  ')}`);
      }
    });
    lines.push('');
  });
  return lines.join('\n');
}

// ── Sub-components ────────────────────────────────────────────────
function SectionHeader({ badge, title, subtitle }) {
  return (
    <div className="section-header">
      <div className="section-badge">{badge}</div>
      <div className="section-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function CheckItem({ id, name, value, label, sub, checked, onChange }) {
  return (
    <div className="c-item">
      <input type="checkbox" id={id} name={name} value={value} checked={checked} onChange={onChange} />
      <label htmlFor={id}>{label}{sub && <span className="sub">{sub}</span>}</label>
    </div>
  );
}

function RadioItem({ id, name, value, label, sub, checked, onChange }) {
  return (
    <div className="r-item">
      <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} />
      <label htmlFor={id}>{label}{sub && <span className="sub">{sub}</span>}</label>
    </div>
  );
}

function WhenRadio({ name, value, onChange }) {
  return (
    <div className="when-radio">
      {['Include now', 'Add later', 'Not needed'].map((opt) => (
        <label key={opt}>
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={onChange} />
          {opt}
        </label>
      ))}
    </div>
  );
}

function GoalRow({ label, small, checkName, checkValue, priorityName, priorityValue, onCheck, onPriority }) {
  return (
    <div className="goal-row">
      <div className="goal-name">{label}<small>{small}</small></div>
      <div className="goal-tick">
        <input type="checkbox" checked={checkValue} onChange={onCheck} title="Tick if relevant" />
      </div>
      <div className="goal-priority">
        <label style={{ fontSize: '12px' }}>Priority:</label>
        <input type="number" min="1" max="6" placeholder="—" value={priorityValue} onChange={onPriority} />
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────
function Toast({ message, visible }) {
  return (
    <div className={`toast${visible ? ' show' : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function Home() {
  const [form, setForm] = useState(() => {
    const saved = loadSaved();
    return saved ? { ...INITIAL_FORM, ...saved } : INITIAL_FORM;
  });
  const [saveStatus, setSaveStatus] = useState('saved');
  const [saveTime, setSaveTime] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const saveTimer = useRef(null);
  const toastTimer = useRef(null);
  const emailjsReady = useRef(false);

  // Init EmailJS
  useEffect(() => {
    if (CONFIG.emailjs_public_key && !emailjsReady.current) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.async = true;
      script.onload = () => {
        if (window.emailjs) {
          window.emailjs.init({ publicKey: CONFIG.emailjs_public_key });
          emailjsReady.current = true;
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  // Restore saved toast
  useEffect(() => {
    const saved = loadSaved();
    if (saved) showToast('Your previous answers have been restored.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = useCallback((msg) => {
    setToast({ message: msg, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
  }, []);

  const triggerAutoSave = useCallback((newForm) => {
    setSaveStatus('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(newForm));
        const t = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
        setSaveTime(t);
        setSaveStatus('saved');
      } catch {
        // silent
      }
    }, 700);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      let updated;
      if (type === 'checkbox' && name.endsWith('[]')) {
        const arr = prev[name] || [];
        updated = {
          ...prev,
          [name]: checked ? [...arr, value] : arr.filter((v) => v !== value),
        };
      } else if (type === 'checkbox') {
        updated = { ...prev, [name]: checked };
      } else {
        updated = { ...prev, [name]: value };
      }
      triggerAutoSave(updated);
      return updated;
    });
  }, [triggerAutoSave]);

  const clearAll = () => {
    if (!confirm('Are you sure you want to clear all your answers? This cannot be undone.')) return;
    setForm(INITIAL_FORM);
    localStorage.removeItem(SAVE_KEY);
    setSaveStatus('saved');
    showToast('All answers have been cleared.');
  };

  const sendCopyViaEmailJS = (toEmail, briefText) => {
    if (!emailjsReady.current || !window.emailjs) return;
    const clientName = (form.A1_Business_Name || '').trim();
    window.emailjs.send(CONFIG.emailjs_service_id, CONFIG.emailjs_template_id, {
      to_email: toEmail,
      to_name: clientName || 'there',
      developer_name: CONFIG.developerName,
      brief_text: briefText,
      subject: `Your website brief${clientName ? ' — ' + clientName : ''}`,
    }).then(() => {
      showToast(`A copy has been sent to ${toEmail}`);
    }).catch((err) => {
      console.warn('EmailJS send failed:', err);
    });
  };

  const openSummaryWindow = (senderEmail, existingWin) => {
    const summaryText = buildSummaryText(form, senderEmail);
    const clientName = (form.A1_Business_Name || '').trim();
    const w = existingWin || window.open('', '_blank', 'width=700,height=600,scrollbars=yes');
    if (!w) {
      navigator.clipboard?.writeText(summaryText).then(() => showToast('Answers copied to clipboard.')).catch(() => showToast('Could not copy. Please try printing.'));
      return;
    }
    const doc = w.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Website Brief</title></head><body></body></html>`);
    doc.close();
    const style = doc.createElement('style');
    style.textContent = `body{font-family:monospace;font-size:13px;line-height:1.7;padding:30px;background:white;color:#111;}h1{font-family:sans-serif;font-size:18px;margin-bottom:4px;}p{font-family:sans-serif;font-size:13px;color:#666;margin-bottom:20px;}pre{white-space:pre-wrap;word-break:break-word;}.btn{font-family:sans-serif;padding:8px 16px;margin-right:8px;cursor:pointer;border-radius:5px;border:1px solid #ccc;font-size:13px;}.btn-print{background:#1B2B4B;color:white;border-color:#1B2B4B;}@media print{.no-print{display:none;}}`;
    doc.head.appendChild(style);
    const h1 = doc.createElement('h1');
    h1.textContent = `Website Brief${clientName ? ' — ' + clientName : ''}`;
    doc.body.appendChild(h1);
    const p = doc.createElement('p');
    p.textContent = 'Print this page or copy the text below to share with your web developer.';
    doc.body.appendChild(p);
    const toolbar = doc.createElement('div');
    toolbar.className = 'no-print';
    toolbar.style.marginBottom = '20px';
    const printBtn = doc.createElement('button');
    printBtn.className = 'btn btn-print';
    printBtn.textContent = '🖨 Print / Save as PDF';
    printBtn.onclick = () => w.print();
    toolbar.appendChild(printBtn);
    const copyBtn = doc.createElement('button');
    copyBtn.className = 'btn';
    copyBtn.textContent = '📋 Copy all text';
    copyBtn.onclick = () => {
      const pre = doc.getElementById('briefText');
      if (w.navigator.clipboard) {
        w.navigator.clipboard.writeText(pre.innerText).then(() => w.alert('Copied!')).catch(() => { pre.select(); doc.execCommand('copy'); });
      }
    };
    toolbar.appendChild(copyBtn);
    doc.body.appendChild(toolbar);
    const pre = doc.createElement('pre');
    pre.id = 'briefText';
    pre.textContent = summaryText;
    doc.body.appendChild(pre);
    showToast('Your answers have been compiled. Check the new window.');
  };

  const handleSubmit = async () => {
    const email = submitterEmail.trim();
    setModalOpen(false);

    const summaryWin = window.open('', '_blank', 'width=700,height=600,scrollbars=yes');
    if (summaryWin) {
      summaryWin.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preparing…</title></head><body style="font-family:sans-serif;padding:40px;color:#555"><p>Sending your answers… this window will update in a moment.</p></body></html>`);
    }

    // Build FormData for Formspree
    const fd = new FormData();
    const clientName = (form.A1_Business_Name || '').trim();
    fd.append('_subject', `Website Brief${clientName ? ' — ' + clientName : ''}`);
    if (email) fd.append('_replyto', email);

    Object.entries(form).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((v) => fd.append(key, v));
      } else if (typeof val === 'boolean') {
        if (val) fd.append(key, 'Yes');
      } else if (val) {
        fd.append(key, val);
      }
    });
    if (email) fd.append('Submitter_Email', email);

    try {
      const res = await fetch(CONFIG.formspree_endpoint, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setSubmitted(true);
        openSummaryWindow(email, summaryWin);
        if (email) sendCopyViaEmailJS(email, buildSummaryText(form, email));
      } else {
        showToast('There was a problem sending. Please try printing instead.');
        if (summaryWin && !summaryWin.closed) summaryWin.close();
      }
    } catch {
      showToast('Could not connect. Please print your answers as a backup.');
      if (summaryWin && !summaryWin.closed) summaryWin.close();
    }
  };

  const today = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const isArrayChecked = (key, val) => (form[key] || []).includes(val);

  if (submitted) {
    return (
      <>
        <header className="site-header">
          <div className="brand">{CONFIG.developerName}</div>
          <div className="doc-title">Website Brief — What Do You Want From Your Website?</div>
          <div className="doc-meta">{today}</div>
        </header>
        <main className="container">
          <div className="success-banner" style={{ display: 'block' }}>
            <h3>Answers submitted successfully ✓</h3>
            <p>Your web developer has received your answers and will be in touch shortly. Thank you for taking the time to complete this.</p>
          </div>
        </main>
        <footer className="site-footer"><p>Website Brief · All information is confidential</p></footer>
      </>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <header className="site-header">
        <div className="brand">{CONFIG.developerName}</div>
        <div className="doc-title">Website Brief — What Do You Want From Your Website?</div>
        <div className="doc-meta">Complete this form and submit it, or print it to discuss in person · {today}</div>
      </header>

      {/* ── Main ── */}
      <main className="container">
        <div className="intro-card">
          <h2>Before you begin</h2>
          <p>This checklist will help turn your ideas for your new website into a clear, practical plan. There are no wrong answers — the goal is simply to understand what you want, who it is for, and what it should achieve for your business.</p>
          <p>Take your time. Your answers are <strong>automatically saved</strong> as you type, so you can close the page and come back to it. When you are finished, use the buttons at the bottom to either <strong>print a copy</strong> or <strong>submit your answers directly</strong>.</p>
          <p>If any question is unclear, skip it and write your question in <strong>Section H</strong> at the end.</p>
        </div>

        <div className="status-bar">
          <div className={`status-dot${saveStatus === 'saving' ? ' unsaved' : ''}`}></div>
          <span>
            {saveStatus === 'saving'
              ? 'Saving your answers…'
              : saveTime
              ? `Answers saved at ${saveTime}. You can close this page and return later.`
              : 'Your answers will be saved automatically as you type.'}
          </span>
        </div>

        {/* ═══════════ A — QUICK OVERVIEW ═══════════ */}
        <div className="section-card" id="secA">
          <SectionHeader badge="A" title="Quick Overview" subtitle="A few warm-up questions to get things started" />
          <div className="section-body">
            <div className="q-group">
              <label className="q-label" htmlFor="a1">What is the name of your business or project?</label>
              <input type="text" id="a1" name="A1_Business_Name" placeholder="e.g. Acme Trading Co." value={form.A1_Business_Name} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="a2">In one or two sentences, how would you describe what your business does to a friend?</label>
              <span className="q-hint">Imagine you are at dinner and someone asks, "So what does your company actually do?" — write your answer here.</span>
              <textarea id="a2" name="A2_Business_Description" placeholder="Your answer here…" value={form.A2_Business_Description} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="a3">In one or two sentences, what do you want this website to help you with right now?</label>
              <span className="q-hint">Think about the one most important problem the website should solve for you at this stage.</span>
              <div className="q-example">Example: "I want people to find us online and see that we are a credible, professional developer."<br />Or: "I want investors and buyers to see our current projects and contact us easily."</div>
              <textarea id="a3" name="A3_Primary_Goal" placeholder="Your answer here…" value={form.A3_Primary_Goal} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="a4">Is there a website you can point us to as a reference or starting point? <span className="optional">Optional</span></label>
              <span className="q-hint">Not a commitment — just a visual reference so we understand your style from the start.</span>
              <div className="q-example">Example: <em>www.squarespace.com/templates</em>, or any business in your industry whose website you admire.</div>
              <input type="text" id="a4" name="A4_Reference_Website" placeholder="e.g. www.example.com.au" value={form.A4_Reference_Website} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ═══════════ B — TARGET AUDIENCE ═══════════ */}
        <div className="section-card" id="secB">
          <SectionHeader badge="B" title="Who This Website Is For" subtitle="Understanding your visitors helps us show them the right things" />
          <div className="section-body">
            <div className="q-group">
              <span className="q-label">Which types of people are most likely to visit your website?</span>
              <span className="q-hint">Tick all that apply — these are the people you most want to reach.</span>
              <div className="check-grid">
                {[
                  { id: 'aud_customers', value: 'Potential customers or clients', label: 'Potential customers or clients', sub: 'People who might buy your product or service' },
                  { id: 'aud_existing', value: 'Existing customers', label: 'Existing customers', sub: 'People who already work with you' },
                  { id: 'aud_partners', value: 'Business partners or suppliers', label: 'Business partners or suppliers', sub: 'Companies or individuals you work alongside' },
                  { id: 'aud_investors', value: 'Investors or funders', label: 'Investors or funders', sub: 'People providing financial backing or support' },
                  { id: 'aud_industry', value: 'Industry peers or referrers', label: 'Industry peers or referrers', sub: 'Other professionals who might recommend you' },
                  { id: 'aud_media', value: 'Media or press', label: 'Media or press', sub: 'Journalists, bloggers, or publications' },
                  { id: 'aud_public', value: 'General public', label: 'General public', sub: 'People who find you via search or word of mouth' },
                  { id: 'aud_other', value: 'Other (see below)', label: 'Other', sub: 'Describe below' },
                ].map(({ id, value, label, sub }) => (
                  <CheckItem key={id} id={id} name="B1_Audience[]" value={value} label={label} sub={sub}
                    checked={isArrayChecked('B1_Audience[]', value)} onChange={handleChange} />
                ))}
              </div>
              <textarea name="B1_Audience_Other" placeholder="Any others not listed above? Describe them here…" style={{ marginTop: '10px' }} value={form.B1_Audience_Other} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="b2">Of those visitors, who is the single most important group you want to reach right now?</label>
              <span className="q-hint">If the website could only speak to one group perfectly, who would that be?</span>
              <input type="text" id="b2" name="B2_Primary_Audience" placeholder="e.g. Potential customers, or existing clients, or business partners…" value={form.B2_Primary_Audience} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="b3">When that type of person visits your website, what are they most likely looking for?</label>
              <span className="q-hint">Think about what questions they would arrive with, or what information would make them stop and read.</span>
              <div className="q-example">Example: "A potential client would want to see our past work, understand what we offer, and know how to get in touch."<br />Or: "A business partner would want to understand our values, our track record, and how to start a conversation."</div>
              <textarea id="b3" name="B3_Visitor_Intent" placeholder="Your answer here…" value={form.B3_Visitor_Intent} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="b4">What would be a "good outcome" for them after visiting your website?</label>
              <span className="q-hint">A good outcome means they leave the site feeling or doing something positive for your business.</span>
              <div className="q-example">Example: "They feel confident we are a serious, credible business."<br />Or: "They call us." &nbsp;Or: "They save our site to come back when they are ready to proceed."</div>
              <textarea id="b4" name="B4_Visitor_Outcome" placeholder="Your answer here…" value={form.B4_Visitor_Outcome} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ═══════════ C — BUSINESS GOALS ═══════════ */}
        <div className="section-card" id="secC">
          <SectionHeader badge="C" title="What the Website Should Achieve" subtitle="Your goals for this website over the next six to twelve months" />
          <div className="section-body">
            <div className="q-group">
              <label className="q-label" htmlFor="c1">In your own words, what would make this website a success for you in the next six to twelve months?</label>
              <span className="q-hint">Think about what would make you look back and say, "Yes — that was worth building."</span>
              <textarea id="c1" name="C1_Success_Definition" className="ta-tall" placeholder="Your answer here…" value={form.C1_Success_Definition} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <span className="q-label">Which of these goals are important to you?</span>
              <span className="q-hint">Tick all that apply. Then use the Priority column to rank them — enter 1 for the most important, 2 for the next, and so on.</span>
              <div className="goals-list">
                {[
                  { label: 'Look professional and trustworthy', small: 'First impressions matter — clients, banks, and partners all check your site.', checkKey: 'C2_Goal_Professional', priorityKey: 'C2_Priority_Professional' },
                  { label: 'Showcase products, services, or past work', small: 'Let visitors see what you offer or what you have done.', checkKey: 'C2_Goal_Projects', priorityKey: 'C2_Priority_Projects' },
                  { label: 'Attract new customers or clients', small: 'Generate enquiries from people who find you online.', checkKey: 'C2_Goal_Attract', priorityKey: 'C2_Priority_Attract' },
                  { label: 'Help people contact you easily', small: 'Make it simple for any visitor to call or send an enquiry.', checkKey: 'C2_Goal_Contact', priorityKey: 'C2_Priority_Contact' },
                  { label: 'Build credibility with partners, investors, or suppliers', small: 'Show that you are established, serious, and have a track record.', checkKey: 'C2_Goal_Credibility', priorityKey: 'C2_Priority_Credibility' },
                  { label: 'Something else', small: 'Describe it in the box below.', checkKey: 'C2_Goal_Other', priorityKey: 'C2_Priority_Other' },
                ].map(({ label, small, checkKey, priorityKey }) => (
                  <GoalRow key={checkKey} label={label} small={small}
                    checkName={checkKey} checkValue={form[checkKey] || false}
                    priorityName={priorityKey} priorityValue={form[priorityKey] || ''}
                    onCheck={(e) => setForm((prev) => { const u = { ...prev, [checkKey]: e.target.checked }; triggerAutoSave(u); return u; })}
                    onPriority={(e) => setForm((prev) => { const u = { ...prev, [priorityKey]: e.target.value }; triggerAutoSave(u); return u; })}
                  />
                ))}
              </div>
              <input type="text" name="C2_Other_Goal_Detail" placeholder="If you ticked 'Something else' — describe your goal here…" style={{ marginTop: '10px' }} value={form.C2_Other_Goal_Detail} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="c3">If someone visits your website and only does one thing — what would you most want that to be?</label>
              <span className="q-hint">This is sometimes called a "call to action" — the single most important thing you want visitors to do.</span>
              <div className="q-example">Example: "Call me." &nbsp; Or: "Send an enquiry." &nbsp; Or: "Register interest in the project."</div>
              <input type="text" id="c3" name="C3_Call_To_Action" placeholder="e.g. Call us on 04XX XXX XXX — or — Complete an online enquiry form…" value={form.C3_Call_To_Action} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ═══════════ D — VERSION 1 PAGES ═══════════ */}
        <div className="section-card" id="secD">
          <SectionHeader badge="D" title="The First Version of the Website" subtitle="Which pages and content do you need to launch with?" />
          <div className="section-body">
            <p style={{ fontSize: '14px', color: 'var(--text-mid)', marginBottom: '18px' }}>
              Think of the website as a set of building blocks. Each block below is a page or section. Tell us which blocks you want <strong>right now</strong>, which can <strong>wait</strong>, and which you <strong>don't need</strong>.
            </p>

            {[
              { title: 'Home Page', desc: 'The first thing people see when they arrive on your site', hint: 'Usually includes a short headline, a summary of what you do, and a clear way to contact you.', whenKey: 'D1_Home_When', haveKey: 'D1_Home_Have', needKey: 'D1_Home_Need', havePh: 'e.g. Logo, short company description, a hero photo…', needPh: 'e.g. A professional headline, a background photo…' },
              { title: 'About Us / Who We Are', desc: 'Your company story, values, and why people should trust you', hint: null, whenKey: 'D2_About_When', haveKey: 'D2_About_Have', needKey: 'D2_About_Need', havePh: 'e.g. Company history, team bio, headshot…', needPh: 'e.g. Written description of the company…' },
              { title: 'Work, Projects, or Portfolio', desc: 'Examples of your work — past or current', hint: 'Could be case studies, completed jobs, products, services, or any work you want to showcase.', whenKey: 'D3_Projects_When', haveKey: 'D3_Projects_Have', needKey: 'D3_Projects_Need', havePh: 'e.g. Project names, photos, case study notes, completion dates…', needPh: 'e.g. Professional photography, written descriptions…' },
              { title: 'Contact Page', desc: 'Your contact details, an enquiry form, and optionally a map or address', hint: null, whenKey: 'D4_Contact_When', haveKey: 'D4_Contact_Have', needKey: 'D4_Contact_Need', havePh: null, needPh: null },
            ].map(({ title, desc, hint, whenKey, haveKey, needKey, havePh, needPh }) => (
              <div className="page-block" key={whenKey}>
                <div className="page-block-header">
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
                <div className="page-block-body">
                  {hint && <span className="q-hint" style={{ marginBottom: '10px' }}>{hint}</span>}
                  <WhenRadio name={whenKey} value={form[whenKey] || ''} onChange={handleChange} />
                  {title === 'Contact Page' ? (
                    <>
                      <span className="sub-label">What contact details should be shown?</span>
                      <textarea name="D4_Contact_Details" style={{ minHeight: '70px' }} placeholder="e.g. Phone: 04XX XXX XXX, Email: hello@yourbusiness.com.au…" value={form.D4_Contact_Details} onChange={handleChange} />
                    </>
                  ) : title === 'Work, Projects, or Portfolio' ? (
                    <>
                      <div className="twin-col">
                        <div>
                          <span className="sub-label">What do you already have?</span>
                          <textarea name={haveKey} style={{ minHeight: '70px' }} placeholder={havePh} value={form[haveKey] || ''} onChange={handleChange} />
                        </div>
                        <div>
                          <span className="sub-label">What do you still need?</span>
                          <textarea name={needKey} style={{ minHeight: '70px' }} placeholder={needPh} value={form[needKey] || ''} onChange={handleChange} />
                        </div>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <span className="sub-label">Roughly how many items would you like to show at launch?</span>
                        <input type="text" name="D3_Projects_Count" placeholder="e.g. 3 completed projects + 1 in progress" value={form.D3_Projects_Count} onChange={handleChange} />
                      </div>
                    </>
                  ) : (
                    <div className="twin-col">
                      <div>
                        <span className="sub-label">What do you already have for this page?</span>
                        <textarea name={haveKey} style={{ minHeight: '70px' }} placeholder={havePh} value={form[haveKey] || ''} onChange={handleChange} />
                      </div>
                      <div>
                        <span className="sub-label">What do you still need to prepare?</span>
                        <textarea name={needKey} style={{ minHeight: '70px' }} placeholder={needPh} value={form[needKey] || ''} onChange={handleChange} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="q-group" style={{ marginTop: '16px' }}>
              <label className="q-label" htmlFor="d5">Are there any other pages or sections you want to include at launch?</label>
              <span className="q-hint">Anything not listed above that you feel the site needs right from the start.</span>
              <textarea id="d5" name="D5_Other_Pages" placeholder="Describe any additional pages or sections here…" value={form.D5_Other_Pages} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ═══════════ E — FUTURE PLANS ═══════════ */}
        <div className="section-card" id="secE">
          <SectionHeader badge="E" title="Future Plans and Scalability" subtitle="No commitment needed — just dreaming a little about what comes next" />
          <div className="section-body">
            <p style={{ fontSize: '14px', color: 'var(--text-mid)', marginBottom: '18px' }}>
              You've said: <em>"Start simple for now, and expand later."</em> That is a smart approach. This section is only about capturing future ideas — nothing here is being built right now.
            </p>
            <div className="q-group">
              <span className="q-label">Which of these features might interest you in the future?</span>
              <span className="q-hint">Tick anything that sounds potentially useful. No pressure to commit.</span>
              <div className="check-grid" style={{ marginTop: '10px' }}>
                {[
                  { id: 'fut_blog', value: 'News or updates section', label: 'News or updates section', sub: 'Post project updates, announcements, or industry news' },
                  { id: 'fut_gallery', value: 'Full project gallery', label: 'Full project gallery', sub: 'More photos, videos, and walk-through content for each project' },
                  { id: 'fut_downloads', value: 'Downloads (brochures, floor plans)', label: 'Downloads', sub: 'Brochures, floor plans, PDFs, or fact sheets people can save' },
                  { id: 'fut_testimonials', value: 'Testimonials or case studies', label: 'Testimonials or case studies', sub: 'Quotes or stories from satisfied buyers or partners' },
                  { id: 'fut_faq', value: 'FAQ section', label: 'FAQ section', sub: 'Answers to questions your clients ask most often' },
                  { id: 'fut_enquiry', value: 'Online enquiry form', label: 'Online enquiry or booking form', sub: 'Let people express interest or request a meeting online' },
                  { id: 'fut_team', value: 'Team or partner profiles', label: 'Team or partner profiles', sub: 'Pages for key people or trusted partners' },
                  { id: 'fut_portal', value: 'Investor portal or private login', label: 'Investor portal or private login area', sub: 'A secure section where investors can access project details' },
                  { id: 'fut_newsletter', value: 'Mailing list or newsletter', label: 'Mailing list or email newsletter', sub: 'Let interested people subscribe to receive project updates' },
                ].map(({ id, value, label, sub }) => (
                  <CheckItem key={id} id={id} name="E1_Future[]" value={value} label={label} sub={sub}
                    checked={isArrayChecked('E1_Future[]', value)} onChange={handleChange} />
                ))}
              </div>
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="e2">Have you seen anything on other websites that you liked and might want one day?</label>
              <span className="q-hint">Could be a feature, a type of content, a layout, or just a feeling you got from browsing.</span>
              <textarea id="e2" name="E2_Future_Ideas" placeholder="Describe any ideas you've seen elsewhere that you'd like to have in mind for later…" value={form.E2_Future_Ideas} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ═══════════ F — LOOK AND FEEL ═══════════ */}
        <div className="section-card" id="secF">
          <SectionHeader badge="F" title="Look and Feel" subtitle="How you want the website to look, feel, and present itself" />
          <div className="section-body">
            <div className="q-group">
              <span className="q-label">How do you want the website to feel when someone visits it?</span>
              <span className="q-hint">Tick all that feel right. Think of the impression you want to leave — like the feeling you get walking into a well-designed display suite or office.</span>
              <div className="check-grid" style={{ marginTop: '10px' }}>
                {[
                  { id: 'feel_premium', value: 'Premium and high-end', label: 'Premium and high-end', sub: 'Polished, quality, carefully considered' },
                  { id: 'feel_modern', value: 'Modern and clean', label: 'Modern and clean', sub: 'Fresh, contemporary, up-to-date' },
                  { id: 'feel_professional', value: 'Professional and serious', label: 'Professional and serious', sub: 'Businesslike, no-nonsense, trustworthy' },
                  { id: 'feel_classic', value: 'Classic and timeless', label: 'Classic and timeless', sub: 'Established, traditional, not trend-driven' },
                  { id: 'feel_warm', value: 'Warm and approachable', label: 'Warm and approachable', sub: 'Friendly, welcoming, easy to connect with' },
                  { id: 'feel_minimal', value: 'Minimal and simple', label: 'Minimal and simple', sub: 'Clean, no clutter, easy to read' },
                  { id: 'feel_bold', value: 'Bold and confident', label: 'Bold and confident', sub: 'Strong, impactful, makes a statement' },
                  { id: 'feel_local', value: 'Local and community-focused', label: 'Local and community-focused', sub: 'Grounded, connected to place and people' },
                ].map(({ id, value, label, sub }) => (
                  <CheckItem key={id} id={id} name="F1_Feel[]" value={value} label={label} sub={sub}
                    checked={isArrayChecked('F1_Feel[]', value)} onChange={handleChange} />
                ))}
              </div>
              <textarea name="F1_Feel_Other" placeholder="Anything else? Describe the feeling you want in your own words…" style={{ marginTop: '10px' }} value={form.F1_Feel_Other} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="f2">Are there any websites you like the look of? (Property or otherwise.)</label>
              <span className="q-hint">Write the website addresses and say briefly what you like about each one — colours, layout, photography, simplicity, etc.</span>
              <div className="q-example">Example: "I like www.mailchimp.com because it is clean and not overcrowded."</div>
              <textarea id="f2" name="F2_Liked_Sites" className="ta-tall" placeholder="Your answer here…" value={form.F2_Liked_Sites} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="f3">Is there anything you specifically do not like on websites?</label>
              <span className="q-hint">Be honest — this helps us avoid things that would frustrate you or that you would be embarrassed by.</span>
              <div className="check-grid" style={{ marginTop: '8px' }}>
                {[
                  { id: 'dis_text', value: 'Too much text', label: 'Too much text', sub: 'Overwhelming, hard to quickly scan' },
                  { id: 'dis_anim', value: 'Lots of animations or moving parts', label: 'Lots of animations or moving things', sub: 'Distracting, slows the page down' },
                  { id: 'dis_colours', value: 'Too many colours', label: 'Too many colours', sub: 'Looks cheap or difficult to read' },
                  { id: 'dis_fonts', value: 'Hard-to-read fonts', label: 'Fonts that are hard to read', sub: 'Too decorative, too small, or low contrast' },
                  { id: 'dis_slow', value: 'Slow to load', label: 'Slow to load', sub: 'Especially on a mobile phone' },
                  { id: 'dis_nav', value: 'Hard to navigate', label: 'Hard to find things', sub: 'Confusing menus or no clear structure' },
                  { id: 'dis_popups', value: 'Pop-up windows and banners', label: 'Pop-up windows and banners', sub: 'Interruptive messages appearing over the page' },
                  { id: 'dis_old', value: 'Outdated look', label: 'An outdated look', sub: 'Looks old-fashioned or neglected' },
                ].map(({ id, value, label, sub }) => (
                  <CheckItem key={id} id={id} name="F3_Dislikes[]" value={value} label={label} sub={sub}
                    checked={isArrayChecked('F3_Dislikes[]', value)} onChange={handleChange} />
                ))}
              </div>
              <textarea id="f3" name="F3_Dislikes_Other" placeholder="Any other dislikes not listed above?…" style={{ marginTop: '10px' }} value={form.F3_Dislikes_Other} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <span className="q-label">A few practical style preferences</span>
              <span className="q-hint">Choose the option that feels right from each pair.</span>
              <div className="pref-block" style={{ marginTop: '14px' }}>
                <p>Overall colour tone:</p>
                <div className="radio-list">
                  {[
                    { id: 'tone_light', value: 'Light and airy (white backgrounds, lots of space)', label: 'Light and airy', sub: 'White backgrounds, clean and spacious' },
                    { id: 'tone_dark', value: 'Dark and rich (dark backgrounds, strong contrast)', label: 'Dark and rich', sub: 'Dark backgrounds, striking contrast' },
                    { id: 'tone_neutral', value: 'Neutral (warm greys, beige, stone tones)', label: 'Neutral', sub: 'Warm greys, beige, or stone tones — in between' },
                    { id: 'tone_any', value: 'No preference — trust the design team', label: 'No strong preference — I trust the design team', sub: null },
                  ].map(({ id, value, label, sub }) => (
                    <RadioItem key={id} id={id} name="F4_Tone" value={value} label={label} sub={sub} checked={form.F4_Tone === value} onChange={handleChange} />
                  ))}
                </div>
              </div>
              <div className="pref-block">
                <p>Content balance:</p>
                <div className="radio-list">
                  {[
                    { id: 'bal_photos', value: 'Mostly big, impactful photos', label: 'Mostly big, impactful photos', sub: 'Let the images do the talking' },
                    { id: 'bal_text', value: 'More text and detail', label: 'More text and detail', sub: 'I want visitors to read and understand' },
                    { id: 'bal_both', value: 'A good balance of both', label: 'A good balance of photos and text', sub: null },
                  ].map(({ id, value, label, sub }) => (
                    <RadioItem key={id} id={id} name="F4_Balance" value={value} label={label} sub={sub} checked={form.F4_Balance === value} onChange={handleChange} />
                  ))}
                </div>
              </div>
              <div className="pref-block">
                <p>Site structure:</p>
                <div className="radio-list">
                  {[
                    { id: 'str_single', value: 'Single scrolling page', label: 'Single scrolling page', sub: 'Everything on one page — simple and fast to navigate' },
                    { id: 'str_multi', value: 'Multiple separate pages', label: 'Multiple separate pages', sub: 'Each topic gets its own page — better for larger sites' },
                    { id: 'str_any', value: 'No preference — recommend what suits best', label: 'No preference — recommend what suits us best', sub: null },
                  ].map(({ id, value, label, sub }) => (
                    <RadioItem key={id} id={id} name="F4_Structure" value={value} label={label} sub={sub} checked={form.F4_Structure === value} onChange={handleChange} />
                  ))}
                </div>
              </div>
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="f5">Are there any colours you want to use — or any colours you definitely don't want?</label>
              <span className="q-hint">Even a rough description helps — e.g. "something dark blue and gold" or "earthy tones, nothing too bright."</span>
              <input type="text" id="f5" name="F5_Colours" placeholder="e.g. Navy and gold, or keep existing brand colours, or earthy neutrals…" value={form.F5_Colours} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ═══════════ G — PRACTICAL DETAILS ═══════════ */}
        <div className="section-card" id="secG">
          <SectionHeader badge="G" title="Practical Details" subtitle="The basics we need to get started straight away" />
          <div className="section-body">
            <div className="q-group">
              <span className="q-label">What do you already have ready to use?</span>
              <span className="q-hint">Tick everything you already have.</span>
              <div className="check-list" style={{ marginTop: '10px' }}>
                {[
                  { id: 'asset_logo', value: 'A logo', label: 'A logo', sub: 'Ideally a high-resolution PNG or vector file (.ai, .eps, or .svg)' },
                  { id: 'asset_colours', value: 'Brand colours', label: 'Brand colours', sub: 'Specific colours you already use across your marketing materials' },
                  { id: 'asset_photos', value: 'High-quality project photos', label: 'High-quality project photos', sub: 'Professional photography of your developments' },
                  { id: 'asset_docs', value: 'Existing brochures or documents', label: 'Existing brochures or marketing documents', sub: 'PDFs, printed brochures, or floor plan documents' },
                  { id: 'asset_copy', value: 'Written content already prepared', label: 'Written content already prepared', sub: "Any text descriptions of the business or projects you've already written" },
                  { id: 'asset_site', value: 'A current website (if you already have one)', label: 'A current website (if you already have one)', sub: 'Content from existing sites can sometimes be reused or built upon' },
                ].map(({ id, value, label, sub }) => (
                  <CheckItem key={id} id={id} name="G1_Have[]" value={value} label={label} sub={sub}
                    checked={isArrayChecked('G1_Have[]', value)} onChange={handleChange} />
                ))}
              </div>
            </div>
            <div className="divider" />
            <div className="q-group">
              <span className="q-label">Do you already own a domain name?</span>
              <span className="q-hint">A domain name is your website address — for example, <em>yourbusiness.com.au</em>.</span>
              <div className="radio-list" style={{ margin: '10px 0 12px' }}>
                {[
                  { id: 'dom_yes', value: 'Yes — I already have one', label: 'Yes — I already have one' },
                  { id: 'dom_no', value: 'No — I will need one registered', label: 'No — I will need one registered' },
                  { id: 'dom_unsure', value: 'I am not sure', label: 'I am not sure' },
                ].map(({ id, value, label }) => (
                  <RadioItem key={id} id={id} name="G2_Domain" value={value} label={label} sub={null} checked={form.G2_Domain === value} onChange={handleChange} />
                ))}
              </div>
              <label className="sub-label" htmlFor="g2_name" style={{ marginTop: '4px' }}>If yes, what is the domain name?</label>
              <input type="text" id="g2_name" name="G2_Domain_Name" placeholder="e.g. yourbusiness.com.au" value={form.G2_Domain_Name} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <span className="q-label">How should people contact you through the website?</span>
              <span className="q-hint">Tick all the methods you are comfortable displaying publicly on the site.</span>
              <div className="check-list" style={{ marginTop: '10px' }}>
                {[
                  { id: 'cm_phone', value: 'Phone number', label: 'Phone number', sub: 'Mobile or office landline' },
                  { id: 'cm_email', value: 'Email address', label: 'Email address', sub: 'A dedicated business email — not a personal address if possible' },
                  { id: 'cm_form', value: 'Online contact form', label: 'Online contact form', sub: 'A form on the site where people type their name, message, and email' },
                  { id: 'cm_wa', value: 'WhatsApp', label: 'WhatsApp', sub: 'A WhatsApp chat button linking to your number' },
                  { id: 'cm_addr', value: 'Office or postal address', label: 'Office or postal address', sub: 'Only if you have a physical office that visitors could come to' },
                ].map(({ id, value, label, sub }) => (
                  <CheckItem key={id} id={id} name="G3_Contact_Methods[]" value={value} label={label} sub={sub}
                    checked={isArrayChecked('G3_Contact_Methods[]', value)} onChange={handleChange} />
                ))}
              </div>
              <textarea name="G3_Contact_Details" placeholder="Please write the actual contact details you want listed (phone number, email address, etc.)…" style={{ marginTop: '10px' }} value={form.G3_Contact_Details} onChange={handleChange} />
            </div>
            <div className="divider" />
            <div className="q-group">
              <label className="q-label" htmlFor="g4">Are there any social media pages we should link to from the website? <span className="optional">Optional</span></label>
              <span className="q-hint">For example: LinkedIn, Facebook, or Instagram. Write the names or addresses below, or write "None."</span>
              <input type="text" id="g4" name="G4_Social_Media" placeholder="e.g. LinkedIn: linkedin.com/company/yourbusiness — or — None at this stage" value={form.G4_Social_Media} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ═══════════ H — QUESTIONS & CONCERNS ═══════════ */}
        <div className="section-card" id="secH">
          <SectionHeader badge="H" title="Your Questions and Concerns" subtitle="An open space — write anything that comes to mind" />
          <div className="section-body">
            <p style={{ fontSize: '14px', color: 'var(--text-mid)', marginBottom: '22px' }}>
              This section has no wrong answers. Write whatever is on your mind. Any concern, question, or thing you want to flag is useful.
            </p>
            {[
              { id: 'h1', name: 'H1_Questions', label: 'Do you have any questions about how the website will be built, what it will cost, or how long it will take?', ph: 'Write any questions here — nothing is too basic. If you are not sure, just write it down…', hint: null },
              { id: 'h2', name: 'H2_Concerns', label: 'Are there any concerns or worries you have about this project?', ph: 'Write any concerns here — being honest helps us plan and communicate better from the start…', hint: 'For example: worries about how long it will take, about ongoing maintenance, about the site looking outdated, etc.' },
              { id: 'h3', name: 'H3_Definitely_Not', label: 'Is there anything you definitely do NOT want on the website?', ph: "Write any firm 'no' items here…", hint: 'Hard limits or things that would make you uncomfortable. No detail is too small.' },
              { id: 'h4', name: 'H4_Anything_Else', label: 'Is there anything else you would like to mention that did not fit anywhere above?', ph: 'Any final thoughts, ideas, or things you want us to know…', hint: null },
            ].map(({ id, name, label, ph, hint }, i) => (
              <div key={id}>
                {i > 0 && <div className="divider" />}
                <div className="q-group">
                  <label className="q-label" htmlFor={id}>{label}</label>
                  {hint && <span className="q-hint">{hint}</span>}
                  <textarea id={id} name={name} className="ta-tall" placeholder={ph} value={form[name]} onChange={handleChange} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Action Bar ── */}
      <div className="action-bar">
        <div className="ab-status">
          {saveStatus === 'saving' ? '⏳ Saving…' : saveTime ? `💾 Saved at ${saveTime}` : '💾 Answers are auto-saved as you type.'}
        </div>
        <button type="button" className="btn btn-ghost" onClick={clearAll}>Clear all</button>
        <button type="button" className="btn btn-ghost" onClick={() => window.print()}>🖨&nbsp; Print / Save as PDF</button>
        <button type="button" className="btn btn-gold" onClick={() => setModalOpen(true)}>Submit answers →</button>
      </div>

      {/* ── Submit Modal ── */}
      {modalOpen && (
        <div className="modal-overlay open" role="dialog" aria-modal="true" aria-labelledby="modalHeading" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal">
            <h2 id="modalHeading">Ready to submit your answers?</h2>
            <p>Your completed checklist will be sent directly to your web developer. Before you submit, make sure you have filled in as much as you can — even rough notes are useful.</p>
            <p>After submitting, a full summary of your answers will pop up automatically — you can print it, save it as a PDF, or copy the text for your own records.</p>
            <p>Add your email address below so your developer can follow up with you directly.</p>
            <div className="email-field">
              <label htmlFor="submitterEmail">Your email address <span style={{ fontWeight: 400, color: 'var(--text-soft)' }}>(optional)</span></label>
              <input type="email" id="submitterEmail" placeholder="yourname@email.com" value={submitterEmail} onChange={(e) => setSubmitterEmail(e.target.value)} />
            </div>
            <div className="btn-row">
              <button type="button" className="btn btn-gold" onClick={handleSubmit}>Send my answers</button>
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Go back and check</button>
            </div>
            <p className="privacy-note">Your answers are sent securely only to your developer. They are not stored, shared, or used for any other purpose.</p>
          </div>
        </div>
      )}

      <Toast message={toast.message} visible={toast.visible} />

      <footer className="site-footer">
        <p>Website Brief &nbsp;·&nbsp; All information is confidential</p>
      </footer>
    </>
  );
}
