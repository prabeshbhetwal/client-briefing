import { useState, useEffect, useRef, useCallback } from 'react';
import { saveSubmission, openSummary, loadDraft } from '../submissions';
import useDialog from '../useDialog';
import '../index.css';

// ── Action bar button styles (inline — immune to CSS specificity/caching) ─────
const BTN = {
  minHeight: '38px',
  padding: '8px 18px',
  border: '1.5px solid #b8a98a',
  borderRadius: '8px',
  background: '#ede8de',
  color: '#18202b',
  fontSize: '13px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  fontFamily: 'inherit',
};
const BTN_PRIMARY = {
  ...BTN,
  background: '#f1d491',
  border: '1.5px solid #c9a84c',
  fontWeight: 700,
};

// ── Config ────────────────────────────────────────────────────────────────────
const GUIDE_CONFIG = {
  guideId: 'general',
  developerName: 'Prabesh Bhetwal',
};
const STORAGE_KEY = 'question_guide_progress_' + GUIDE_CONFIG.guideId;

// ── Visual library ────────────────────────────────────────────────────────────
const VISUAL_LIBRARY = {
  identity: {
    title: 'Business identity examples',
    intro: 'Compare how a visitor reads a polished public brand versus the formal business details behind it.',
    images: [
      { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=760&q=78', label: 'Public brand impression', caption: 'What visitors see first: name, tone, and credibility.' },
      { src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=760&q=78', label: 'Formal business details', caption: 'What supports domains, email, contracts, and footer text.' },
    ],
    chart: [['Name clarity', 92], ['Trust', 78], ['Setup ease', 64]],
    compare: [['Clear', 'One consistent name across website, domain, email, and footer.'], ['Confusing', 'Different names in different places create doubt.']],
  },
  positioning: {
    title: 'Positioning examples',
    intro: 'The homepage should quickly show what kind of business this is and why it is different.',
    images: [
      { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=760&q=78', label: 'Professional service', caption: 'A calm, credible image supports a serious business tone.' },
      { src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=760&q=78', label: 'Specialist delivery', caption: 'Specific proof helps visitors understand the business focus.' },
    ],
    chart: [['Clarity', 88], ['Difference', 74], ['Memorability', 61]],
    compare: [['Strong', 'A visitor can describe the business after one screen.'], ['Weak', 'The site feels attractive but could belong to anyone.']],
  },
  audience: {
    title: 'Audience examples',
    intro: 'Different visitors need different proof. Choosing the main audience keeps the site focused.',
    images: [
      { src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=760&q=78', label: 'Buyer or owner', caption: 'Usually wants confidence, location, quality, and contact options.' },
      { src: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=760&q=78', label: 'Investor or partner', caption: 'Usually wants track record, process, and credibility.' },
    ],
    chart: [['Trust proof', 90], ['Clear action', 78], ['Detailed reading', 52]],
    compare: [['Primary audience', 'The site is written mainly for the highest-value visitor.'], ['Everyone equally', 'The message becomes broad and less persuasive.']],
  },
  action: {
    title: 'Visitor action examples',
    intro: 'The website should make the next step obvious, whether that is sending an enquiry or reviewing projects.',
    images: [
      { src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=760&q=78', label: 'Online enquiry', caption: 'Best when the visitor needs a low-pressure way to start.' },
      { src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=760&q=78', label: 'Direct conversation', caption: 'Best when trust is built through phone calls or meetings.' },
    ],
    chart: [['Easy contact', 94], ['Lead quality', 70], ['Visitor effort', 38]],
    compare: [['Clear CTA', 'One main button or form tells visitors what to do next.'], ['Unclear CTA', 'Visitors like the site but leave without contacting you.']],
  },
  proof: {
    title: 'Trust proof examples',
    intro: 'Premium design helps, but proof is what makes a visitor believe the business is capable.',
    images: [
      { src: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=760&q=78', label: 'Completed work', caption: 'Real work, projects, or outcomes make claims believable.' },
      { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=760&q=78', label: 'People and partners', caption: 'Profiles, collaborators, and testimonials add confidence.' },
    ],
    chart: [['Project proof', 92], ['Real people', 76], ['Generic claims', 34]],
    compare: [['Proof-led', 'The site shows evidence before asking for trust.'], ['Claim-led', "The site says 'trusted' without showing why."]],
  },
  permissions: {
    title: 'Content permission examples',
    intro: 'Not every useful image, logo, or testimonial is safe to publish. Approval prevents awkward changes later.',
    images: [
      { src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=760&q=78', label: 'Approved materials', caption: 'Use images, documents, and claims that are cleared for public use.' },
      { src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=760&q=78', label: 'Review before launch', caption: 'Sensitive claims and partner names should be checked first.' },
    ],
    chart: [['Approved', 88], ['Needs review', 55], ['Do not publish', 18]],
    compare: [['Safe', 'Only approved assets and claims appear publicly.'], ['Risky', 'Private or unverified material is published too early.']],
  },
  pages: {
    title: 'Page structure examples',
    intro: 'A focused first version can still feel complete when the pages answer the right questions.',
    images: [
      { src: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=760&q=78', label: 'Single-page structure', caption: 'Good for a lean site with a clear story and contact form.' },
      { src: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=760&q=78', label: 'Multi-page structure', caption: 'Better when services, projects, and downloads need depth.' },
    ],
    chart: [['Launch speed', 86], ['Content depth', 62], ['Future growth', 78]],
    compare: [['Launch now', 'Only include pages that support the first decision.'], ['Add later', 'Save bigger features until content is ready.']],
  },
  cms: {
    title: 'Editable content examples',
    intro: 'A private editing screen is useful when one section changes often. It is different from a full internal business system.',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=760&q=78', label: 'Simple project editing', caption: 'Best for projects, updates, testimonials, or team profiles.' },
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=760&q=78', label: 'Full internal dashboard', caption: 'Only needed for pipelines, tasks, reminders, and private workflows.' },
    ],
    chart: [['Project editor', 86], ['Static pages', 68], ['Internal system', 28]],
    compare: [['Right-sized', 'Edit the changing sections and keep the rest polished.'], ['Overbuilt', 'A full app adds maintenance before it is needed.']],
  },
  design: {
    title: 'Design direction examples',
    intro: 'Reference websites are useful when you explain what you like about them, not just the link.',
    images: [
      { src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=760&q=78', label: 'Premium and spacious', caption: 'Large imagery, calm colours, and fewer words feel high-end.' },
      { src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=760&q=78', label: 'Corporate and practical', caption: 'Clear layout and restrained styling feel businesslike.' },
    ],
    chart: [['Imagery', 90], ['Readability', 82], ['Animation', 24]],
    compare: [['Useful feedback', 'I like the image scale, spacing, and simple menu.'], ['Less useful', 'I like this site, but I am not sure why.']],
  },
  brand: {
    title: 'Brand asset examples',
    intro: 'Existing logo, colours, and fonts can guide the design. If they do not exist, a simple visual direction can start the project.',
    images: [
      { src: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=760&q=78', label: 'Existing brand kit', caption: 'Logo, colours, and type choices keep the site consistent.' },
      { src: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=760&q=78', label: 'New visual direction', caption: 'A temporary direction can work until full branding is needed.' },
    ],
    chart: [['Consistency', 88], ['Design speed', 72], ['Brand risk', 32]],
    compare: [['Prepared', 'Use approved logo, colours, and imagery from the start.'], ['Flexible', 'Create a restrained style and refine branding later.']],
  },
  setup: {
    title: 'Ownership and setup examples',
    intro: 'Domains, email, and form submissions should be easy to manage and clearly owned.',
    images: [
      { src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=760&q=78', label: 'Domain ownership', caption: 'The business should control key accounts and renewal notices.' },
      { src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=760&q=78', label: 'Form submissions', caption: 'Enquiries should go to the right inbox and be easy to review.' },
    ],
    chart: [['Ownership clarity', 92], ['Maintenance ease', 80], ['Account risk', 22]],
    compare: [['Good handover', 'The business owns the domain and knows where enquiries go.'], ['Poor handover', 'Important accounts sit under the wrong person.']],
  },
};

// ── Visual type map ───────────────────────────────────────────────────────────
const VISUAL_TYPE_MAP = {
  'g-business-1': 'identity',
  'g-business-2': 'positioning',
  'g-business-3': 'positioning',
  'g-business-4': 'positioning',
  'g-audience-1': 'audience',
  'g-audience-2': 'audience',
  'g-audience-3': 'action',
  'g-content-1': 'proof',
  'g-content-2': 'permissions',
  'g-content-3': 'permissions',
  'g-content-4': 'cms',
  'g-scope-1': 'pages',
  'g-scope-2': 'pages',
  'g-scope-3': 'cms',
  'g-design-1': 'design',
  'g-design-2': 'design',
  'g-design-3': 'brand',
  'g-setup-1': 'setup',
  'g-setup-2': 'setup',
  'g-setup-3': 'cms',
  'g-setup-4': 'setup',
};

// ── Questions data ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'business',
    kicker: 'Step 1',
    heading: 'Business and positioning',
    description: 'These questions define what the website is really for and how the business should be understood by a first-time visitor.',
    callout: 'This section keeps the website from sounding generic. A premium site still needs a clear business sentence before it needs visual polish.',
    questions: [
      { id: 'g-business-1', heading: 'What exact business name should appear on the website?', detail: 'Write the public trading name, and include the legal name if it is different. Example: "Bayview Corp" as the brand, but "Bayview Corp Pty Ltd" in legal or footer details.', priority: 'Critical' },
      { id: 'g-business-2', heading: 'In one sentence, what does the business do?', detail: 'Use plain language. Example: "We help landowners and buyers through boutique residential property developments."', priority: 'Critical' },
      { id: 'g-business-3', heading: 'What should people believe after 30 seconds on the site?', detail: 'Examples: "We are trustworthy", "we are premium", "we know this market", or "we are easy to contact".', priority: 'Recommended' },
      { id: 'g-business-4', heading: 'What makes this business different from nearby competitors?', detail: 'Think about genuine differences: niche, location, experience, service style, process, quality, speed, price, or personal involvement.', priority: 'Recommended' },
    ],
  },
  {
    id: 'audience',
    kicker: 'Step 2',
    heading: 'Audience and visitor intent',
    description: 'The website should speak to the people who matter most, not to everyone equally.',
    callout: null,
    questions: [
      { id: 'g-audience-1', heading: 'Who is the most important visitor for version one?', detail: 'Choose one primary group if you can. Examples: buyers, landowners, investors, referrers, families, local businesses, or hiring candidates.', priority: 'Critical' },
      { id: 'g-audience-2', heading: 'What question is that visitor trying to answer?', detail: 'Examples: "Can I trust this business?", "Do you serve my area?", "Have you done this before?", or "How do I contact you?"', priority: 'Critical' },
      { id: 'g-audience-3', heading: 'What action should the visitor take before they leave?', detail: 'Examples: call, send an enquiry, book a consultation, view projects, download a brochure, or register interest.', priority: 'Recommended' },
    ],
  },
  {
    id: 'content',
    kicker: 'Step 3',
    heading: 'Content and proof',
    description: 'This is where most website projects succeed or stall. Design cannot replace missing proof.',
    callout: null,
    questions: [
      { id: 'g-content-1', heading: 'What proof can your website show to build trust?', detail: 'Examples: completed work, years of experience, testimonials, client logos, project photos, awards, qualifications, media, certifications, or partner names.', priority: 'Critical' },
      { id: 'g-content-2', heading: 'Which photos, videos, documents, or logos are approved to use?', detail: 'Only list items you are comfortable publishing. Images, testimonials, partner logos, and project details should be approved before they go on the website.', priority: 'Critical' },
      { id: 'g-content-3', heading: 'Who will approve the final wording before launch?', detail: 'This matters when claims involve experience, results, pricing, availability, legal details, finance, or health and safety.', priority: 'Recommended' },
      { id: 'g-content-4', heading: 'Do you need a content update process after launch?', detail: 'Example: the website team updates it for you monthly, or you use a private editing screen for projects, news, services, or team members.', priority: 'Optional' },
    ],
  },
  {
    id: 'scope',
    kicker: 'Step 4',
    heading: 'Pages and launch scope',
    description: 'Keep the first version small enough to launch, but structured enough to grow later.',
    callout: null,
    questions: [
      { id: 'g-scope-1', heading: 'Which pages are needed for launch?', detail: 'Examples: Home, About, Services, Projects, Contact, FAQ, Careers, Downloads, or a single scrolling page with sections.', priority: 'Critical' },
      { id: 'g-scope-2', heading: 'What can wait until version two?', detail: 'Examples: full gallery, blog, newsletter, portal, filters, downloads, multilingual content, or a client login area.', priority: 'Recommended' },
      { id: 'g-scope-3', heading: 'Which parts do you need to edit yourself?', detail: 'Common editable areas are projects, news, testimonials, and team profiles. You do not need editing access for every sentence on the site.', priority: 'Recommended' },
    ],
  },
  {
    id: 'design',
    kicker: 'Step 5',
    heading: 'Design direction',
    description: 'Think about what you like, then turn that into decisions about imagery, spacing, tone, typography, colour, and navigation.',
    callout: null,
    questions: [
      { id: 'g-design-1', heading: 'Which reference websites should we look at, and why?', detail: 'Write what you like specifically: photography, layout, luxury feel, simplicity, navigation, colours, or wording.', priority: 'Critical' },
      { id: 'g-design-2', heading: 'What should the website never feel like?', detail: 'Examples: cheap, too corporate, too flashy, too animated, too text-heavy, hard to read, slow, or generic.', priority: 'Recommended' },
      { id: 'g-design-3', heading: 'Do you already have brand colours, fonts, or a logo?', detail: 'If not, it is useful to decide whether you need a simple temporary visual direction or a full brand identity.', priority: 'Optional' },
    ],
  },
  {
    id: 'setup',
    kicker: 'Step 6',
    heading: 'Practical setup and ownership',
    description: 'These questions prevent awkward handover problems after the site is built.',
    callout: null,
    questions: [
      { id: 'g-setup-1', heading: 'Who will own the domain and main website accounts?', detail: 'Your business should own its domain and main accounts. The website team can help set them up, but the ownership details should stay with the business.', priority: 'Critical' },
      { id: 'g-setup-2', heading: 'Where should contact form submissions go?', detail: 'Write the exact email address, who monitors it, and whether you need a saved copy for your records.', priority: 'Critical' },
      { id: 'g-setup-3', heading: 'How often will the website need updates?', detail: 'Examples: rarely, monthly, after each new project, or when a target market changes. This decides whether you need a private editing screen.', priority: 'Recommended' },
      { id: 'g-setup-4', heading: 'What needs to be backed up or exported?', detail: 'Examples: contact form records, project details, uploaded images, or a monthly website backup.', priority: 'Optional' },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadPersistedState() {
  return loadDraft(STORAGE_KEY, Object.fromEntries(SECTIONS.flatMap(s => s.questions.flatMap(q => [
    ['answer_' + q.id, ''], [q.id, false],
  ]))));
}

function escHtml(v) {
  return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function buildTextSummary(answers, checked) {
  const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const allQ = SECTIONS.flatMap(s => s.questions);
  const answeredCount = allQ.filter(q => answers['answer_' + q.id]?.trim() || checked[q.id]).length;
  const lines = [
    'WEBSITE PLANNING GUIDE — GENERAL',
    '==================================================',
    'Date: ' + date,
    'Progress: ' + answeredCount + ' of ' + allQ.length + ' answered',
    '',
  ];
  SECTIONS.forEach(section => {
    lines.push(section.heading.toUpperCase());
    lines.push('--------------------------------------------------');
    section.questions.forEach((q, i) => {
      lines.push((i + 1) + '. [' + q.priority + '] ' + q.heading);
      lines.push('   Context: ' + q.detail);
      lines.push('   Answer: ' + (answers['answer_' + q.id]?.trim() || '[Not answered]'));
      lines.push('');
    });
  });
  return lines.join('\n');
}

function buildHtmlSummary(answers, checked, textSummary) {
  const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const allQ = SECTIONS.flatMap(s => s.questions);
  const answeredCount = allQ.filter(q => answers['answer_' + q.id]?.trim() || checked[q.id]).length;

  const rows = SECTIONS.flatMap(s =>
    s.questions.map((q, i) =>
      `<tr><td>${escHtml(s.heading)}</td><td>${escHtml(q.priority)}</td><td><strong>${escHtml(q.heading)}</strong><br><span>${escHtml(q.detail)}</span></td><td>${escHtml(answers['answer_' + q.id]?.trim() || 'Not answered')}</td></tr>`
    )
  ).join('');

  const css = `body{font-family:Inter,-apple-system,sans-serif;margin:0;background:#f7f2e8;color:#18202b;line-height:1.55}main{max-width:1120px;margin:0 auto;padding:34px 24px 80px}h1{font-family:Georgia,serif;font-size:38px;line-height:1.1;margin:0 0 10px}h2{font-family:Georgia,serif;font-size:26px;margin:34px 0 12px}p{color:#5f6570}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:22px 0}.metric{border:1px solid #ded3bd;background:#fffdf7;border-radius:8px;padding:16px}.metric strong{display:block;color:#183452}.toolbar{display:flex;gap:10px;flex-wrap:wrap;margin:24px 0}.btn{padding:9px 13px;border:1px solid #ded3bd;border-radius:8px;background:#fff;cursor:pointer}.btn.primary{background:#f1d491;border-color:#f1d491}table{width:100%;border-collapse:collapse;background:white;border:1px solid #ded3bd;border-radius:8px;overflow:hidden}th,td{padding:12px;border-bottom:1px solid #ded3bd;text-align:left;vertical-align:top}th{background:#183452;color:white;font-size:12px;text-transform:uppercase;letter-spacing:.06em}td span{display:block;color:#5f6570;font-size:13px;margin-top:4px}@media(max-width:760px){.grid{grid-template-columns:1fr}table{display:block;overflow-x:auto}}@media print{.toolbar{display:none}}`;

  return `<!doctype html><html><head><meta charset="UTF-8"><title>Website Planning Guide</title><style>${css}</style></head><body><main><h1>Website Planning Guide</h1><p>Prepared ${escHtml(date)}.</p><div class="grid"><div class="metric"><strong>Progress</strong><span>${answeredCount} of ${allQ.length} answered</span></div><div class="metric"><strong>Guide type</strong><span>General client planning guide</span></div><div class="metric"><strong>Next step</strong><span>Review answers and confirm scope</span></div></div><div class="toolbar"><button class="btn primary" onclick="window.print()">Print / Save as PDF</button><button class="btn" onclick="navigator.clipboard.writeText(document.getElementById('plain').innerText)">Copy full text</button></div><h2>Answered Questions</h2><table><thead><tr><th>Section</th><th>Priority</th><th>Question</th><th>Answer</th></tr></thead><tbody>${rows}</tbody></table><pre id="plain" style="white-space:pre-wrap;display:none">${escHtml(textSummary)}</pre></main></body></html>`;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function VisualAid({ questionId }) {
  const key = VISUAL_TYPE_MAP[questionId] || 'positioning';
  const v = VISUAL_LIBRARY[key];
  return (
    <div className="visual-aids">
      <h4>{v.title}</h4>
      <p>{v.intro}</p>
      <div className="visual-grid">
        {v.images.map((img, i) => (
          <figure key={i} className="visual-card">
            <img loading="lazy" decoding="async" src={img.src} alt={img.label} />
            <strong>{img.label}</strong>
            <span>{img.caption}</span>
          </figure>
        ))}
      </div>
      <div className="mini-chart">
        <p>Illustrative comparisons; percentages are examples, not measured results.</p>
        {v.chart.map(([label, pct], i) => (
          <div key={i} className="mini-chart-row">
            <span>{label}</span>
            <div className="mini-chart-track">
              <div className="mini-chart-fill" style={{ width: pct + '%' }} />
            </div>
            <strong>{pct}%</strong>
          </div>
        ))}
      </div>
      <div className="visual-note">
        {v.compare.map(([label, text], i) => (
          <span key={i}><strong>{label}</strong>{text}</span>
        ))}
      </div>
    </div>
  );
}

function QuestionCard({ question, answer, checked, onAnswerChange, onCheckedChange }) {
  const priorityClass = question.priority === 'Critical' ? 'critical' : question.priority === 'Recommended' ? 'recommended' : 'optional';
  const tagClass = question.priority === 'Critical' ? 'tag critical' : question.priority === 'Recommended' ? 'tag recommended' : 'tag';

  return (
    <article className={`question-card ${priorityClass}`}>
      <input
        className="question-check"
        id={question.id}
        type="checkbox"
        aria-label={`Mark answered: ${question.heading}`}
        checked={!!checked}
        onChange={e => onCheckedChange(question.id, e.target.checked)}
      />
      <div>
        <h3>{question.heading}</h3>
        <p>{question.detail}</p>
      </div>
      <span className={tagClass}>{question.priority}</span>
      <VisualAid questionId={question.id} />
      <div className="answer-area">
        <label htmlFor={'answer_' + question.id}>Your answer</label>
        <textarea
          id={'answer_' + question.id}
          placeholder="Write your answer here. A short answer is fine."
          value={answer || ''}
          onChange={e => onAnswerChange(question.id, e.target.value)}
        />
      </div>
    </article>
  );
}

function SectionPanel({ section, answers, checked, collapsed, onToggle, onAnswerChange, onCheckedChange }) {
  return (
    <section className={`section-panel${collapsed ? ' is-collapsed' : ''}`} id={section.id} data-section="true">
      <button className="section-toggle" type="button" aria-expanded={!collapsed} onClick={onToggle}>
        <span className="section-heading">
          <span className="section-kicker">{section.kicker}</span>
          <h2>{section.heading}</h2>
          <p>{section.description}</p>
        </span>
        <span className="toggle-icon" aria-hidden="true">{collapsed ? '+' : '−'}</span>
      </button>
      <div className="section-content">
        <div className="question-list">
          {section.questions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              answer={answers['answer_' + q.id]}
              checked={checked[q.id]}
              onAnswerChange={onAnswerChange}
              onCheckedChange={onCheckedChange}
            />
          ))}
        </div>
        {section.callout && (
          <div className="callout">
            <strong>{section.callout}</strong>
          </div>
        )}
      </div>
    </section>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return <div className="toast show" role="status" aria-live="polite">{message}</div>;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ClientGuide() {
  const allQuestions = SECTIONS.flatMap(s => s.questions);
  const totalQ = allQuestions.length;

  // Initialise from localStorage
  const [answers, setAnswers] = useState(() => {
    const s = loadPersistedState();
    const a = {};
    allQuestions.forEach(q => { if (s['answer_' + q.id]) a['answer_' + q.id] = s['answer_' + q.id]; });
    return a;
  });
  const [checked, setChecked] = useState(() => {
    const s = loadPersistedState();
    const c = {};
    allQuestions.forEach(q => { if (s[q.id]) c[q.id] = true; });
    return c;
  });
  const [collapsed, setCollapsed] = useState({});
  const [scrollPct, setScrollPct] = useState(0);
  const [activeSection, setActiveSection] = useState('how-to-use');
  const [toast, setToast] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState('Answers are saved in this browser as you type.');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toastTimer = useRef(null);
  const saveTimer = useRef(null);
  const closeModal = useCallback(() => setModalOpen(false), []);
  useDialog(modalOpen, closeModal, '.guide-modal-overlay');

  // ── Persist to localStorage with debounce + timestamp ───────────────────
  useEffect(() => {
    clearTimeout(saveTimer.current);
    const persist = () => {
      try {
        const s = {};
        Object.assign(s, answers);
        Object.keys(checked).forEach(id => { if (checked[id]) s[id] = true; });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        localStorage.setItem(STORAGE_KEY + '_meta', JSON.stringify({ savedAt: new Date().toISOString() }));
      } catch { setSubmitStatus('Browser storage unavailable. Download a summary before leaving.'); }
    };
    persist();
  }, [answers, checked]);

  // ── Restore toast on mount ───────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const meta = localStorage.getItem(STORAGE_KEY + '_meta');
      const savedAt = meta ? JSON.parse(meta).savedAt : null;
      const label = savedAt
        ? `Restored from ${new Date(savedAt).toLocaleString('en-AU', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}`
        : 'Previous answers restored.';
      setTimeout(() => setToast(label), 300);
      setTimeout(() => setToast(''), 4200);
    } catch { /* ok */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Scroll + active nav ──────────────────────────────────────────────────
  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setScrollPct(max > 0 ? (doc.scrollTop / max) * 100 : 0);

      const sectionIds = ['how-to-use', ...SECTIONS.map(s => s.id), 'decision', 'resources'];
      let current = sectionIds[0];
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      });
      setActiveSection(current);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  }, []);

  // ── Progress ─────────────────────────────────────────────────────────────
  const answeredCount = allQuestions.filter(q =>
    answers['answer_' + q.id]?.trim() || checked[q.id]
  ).length;

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleAnswerChange(qId, value) {
    setSubmitted(false);
    setAnswers(prev => ({ ...prev, ['answer_' + qId]: value }));
    setChecked(prev => ({ ...prev, [qId]: !!value.trim() }));
  }

  function handleCheckedChange(qId, val) {
    setChecked(prev => ({ ...prev, [qId]: val }));
  }

  function handleToggleSection(sectionId) {
    setCollapsed(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }

  function expandAll() {
    const c = {};
    SECTIONS.forEach(s => { c[s.id] = false; });
    setCollapsed(c);
  }

  function collapseAll() {
    const c = {};
    SECTIONS.forEach(s => { c[s.id] = true; });
    setCollapsed(c);
  }

  function resetProgress() {
    if (!window.confirm('Clear all answers in this guide?')) return;
    clearTimeout(saveTimer.current);
    setAnswers({});
    setChecked({});
    setSubmitted(false);
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(STORAGE_KEY + '_meta'); } catch { /* ok */ }
    showToast('Progress reset.');
  }

  function openSubmitModal() {
    setModalOpen(true);
  }

  function closeSubmitModal() {
    setModalOpen(false);
  }

  async function handleSubmit() {
    if (submitting || !document.getElementById('guideSubmitterEmail').reportValidity()) return;
    const questions = SECTIONS.flatMap(section => section.questions.map(q => ({
      id: q.id, section: section.heading, question: q.heading, answer: answers['answer_' + q.id]?.trim() || '',
    })));
    if (!questions.some(q => q.answer)) { showToast('Write at least one answer before submitting.'); return; }
    const textSummary = buildTextSummary(answers, checked);
    const htmlContent = buildHtmlSummary(answers, checked, textSummary);
    const backup = openSummary(htmlContent, textSummary);
    setSubmitted(false);
    setSubmitting(true);
    setModalOpen(false);
    setSubmitStatus('Saving answers…');
    try {
      await saveSubmission({
        guideId: 'general', title: 'General Client Question Guide', senderEmail: submitterEmail.trim(),
        date: new Date().toLocaleDateString('en-AU'), questions, summary: textSummary,
      });
      setSubmitted(true);
      setSubmitStatus(`Answers saved. ${backup}`);
      showToast('Answers submitted successfully.');
    } catch (error) {
      setSubmitStatus(`Submission not confirmed. ${error.message} ${backup} Keep your backup and retry.`);
      showToast('Submission failed. Your answers remain here.');
    } finally { setSubmitting(false); }
  }

  // ── Nav links ─────────────────────────────────────────────────────────────
  const navLinks = [
    { href: '#how-to-use', label: 'How to use' },
    { href: '#business', label: 'Business' },
    { href: '#audience', label: 'Audience' },
    { href: '#content', label: 'Content' },
    { href: '#scope', label: 'Pages' },
    { href: '#design', label: 'Design' },
    { href: '#setup', label: 'Setup' },
    { href: '#decision', label: 'Decision' },
    { href: '#resources', label: 'Next steps' },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="top-progress" aria-hidden="true">
        <span style={{ width: scrollPct + '%' }} />
      </div>

      <header className="hero">
        <img
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=82"
          alt="A calm modern office meeting space for website planning"
        />
        <div className="hero-inner">
          <span className="eyebrow">Website planning guide</span>
          <h1>Questions to help you plan the right website for your business.</h1>
          <p className="hero-copy">
            Work through this page at your own pace. Write your answers, mark questions as answered, copy
            anything you want to send by email, and use the examples without needing specialist website knowledge.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#how-to-use">Start guide</a>
            <a className="btn" href="/">Back to brief form</a>
          </div>
        </div>
      </header>

      <main className="page-shell">
        <aside className="guide-nav" aria-label="Guide navigation">
          <div className="guide-nav-header">
            <span className="guide-nav-title">Your progress</span>
            <div className="answer-meter">
              <strong>{answeredCount} of {totalQ} answered</strong>
              <div className="meter-track" aria-hidden="true">
                <div className="meter-fill" style={{ width: (totalQ ? Math.round((answeredCount / totalQ) * 100) : 0) + '%' }} />
              </div>
            </div>
          </div>
          <nav className="guide-links">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={activeSection === link.href.slice(1) ? 'active' : undefined}
              >
                {link.label}
              </a>
            ))}
            <button type="button" onClick={expandAll}>Expand all</button>
            <button type="button" onClick={collapseAll}>Collapse all</button>
            <button type="button" onClick={resetProgress}>Reset progress</button>
          </nav>
        </aside>

        <div className="content-stack">
          {submitted && (
            <div className="guide-success" style={{ display: 'block' }}>
              <h2>Answers submitted successfully</h2>
              <p>Your completed guide is saved for authorised review. Keep the printable or downloaded summary. No email is sent automatically.</p>
            </div>
          )}

          {/* How to use */}
          <section className="intro-panel" id="how-to-use" data-section="true">
            <div className="intro-grid">
              <div>
                <h2>How to use this guide</h2>
                <p>
                  Start with your business purpose, then move into audience, content, design, and practical setup.
                  You do not need perfect answers. Short, honest answers are enough to shape the first version of your website.
                </p>
                <p>
                  Critical questions are the ones that affect launch. Recommended questions improve the quality of the site.
                  Optional questions help when the project is more brand-sensitive or likely to grow later.
                </p>
                <div className="quick-strip">
                  <div className="quick-card">
                    <strong>1. Clarify</strong>
                    <span>What problem is the website solving?</span>
                  </div>
                  <div className="quick-card">
                    <strong>2. Prove</strong>
                    <span>What evidence will make visitors trust you?</span>
                  </div>
                  <div className="quick-card">
                    <strong>3. Decide</strong>
                    <span>What must be editable after launch?</span>
                  </div>
                </div>
              </div>
              <figure className="image-card">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1100&q=82"
                  alt="People discussing a website plan around a table"
                />
                <figcaption>
                  Keep the planning practical: business, audience, proof, content, and who will manage updates later.
                </figcaption>
              </figure>
            </div>
          </section>

          {/* Dynamic sections */}
          {SECTIONS.map(section => (
            <SectionPanel
              key={section.id}
              section={section}
              answers={answers}
              checked={checked}
              collapsed={!!collapsed[section.id]}
              onToggle={() => handleToggleSection(section.id)}
              onAnswerChange={handleAnswerChange}
              onCheckedChange={handleCheckedChange}
            />
          ))}

          {/* Decision framework */}
          <section className="decision-panel" id="decision" data-section="true">
            <h2>Decision framework</h2>
            <p>Use this section to understand which kind of website setup matches the way your business actually needs to manage content.</p>
            <div className="decision-grid">
              <div className="decision-card">
                <strong>Simple website</strong>
                <p>Best when most pages rarely change and you want speed, simplicity, and low maintenance.</p>
              </div>
              <div className="decision-card">
                <strong>Website with editable sections</strong>
                <p>Best when one content area changes regularly, such as projects, news, or team profiles.</p>
              </div>
              <div className="decision-card">
                <strong>Full business system</strong>
                <p>Only needed when the website itself must manage leads, users, reminders, private files, or internal workflows.</p>
              </div>
            </div>
            <table className="comparison">
              <thead>
                <tr><th>Need</th><th>Recommended answer</th><th>Why it matters</th></tr>
              </thead>
              <tbody>
                <tr><td>Editable projects</td><td>Private project editor</td><td>You can add, edit, hide, and delete project entries.</td></tr>
                <tr><td>Contact enquiries</td><td>Contact form with email notification</td><td>You receive enquiries without needing to manage extra systems.</td></tr>
                <tr><td>Custom domain</td><td>Business-owned domain</td><td>Keeps the site fast while your business owns the domain.</td></tr>
              </tbody>
            </table>
          </section>

          {/* Resources */}
          <section className="resource-panel" id="resources" data-section="true">
            <h2>What happens next</h2>
            <p>These are the practical decisions your answers will help confirm.</p>
            <div className="resource-grid">
              <div className="resource-link">
                <strong>Confirm the message</strong>
                <span>Your answers clarify what the website should say and who it should speak to.</span>
              </div>
              <div className="resource-link">
                <strong>Confirm the content</strong>
                <span>Your answers show which photos, projects, services, and proof points are ready.</span>
              </div>
              <div className="resource-link">
                <strong>Confirm the contact flow</strong>
                <span>Your answers decide where enquiries should go and what visitors should do next.</span>
              </div>
              <div className="resource-link">
                <strong>Confirm future editing</strong>
                <span>Your answers decide which parts of the site need to be editable after launch.</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Sticky action bar */}
      <div className="guide-action-bar" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 24px',
        borderTop: '1.5px solid #c9b98a',
        background: 'rgba(247,242,232,0.97)',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 -6px 28px rgba(24,32,43,0.14)',
      }}>
        <div className="guide-action-status" role="status" style={{ marginRight: 'auto', color: '#5f6570', fontSize: '13px' }}>{submitStatus}</div>
        <button type="button" onClick={resetProgress} style={BTN}>Clear answers</button>
        <button type="button" onClick={() => openSummary(buildHtmlSummary(answers, checked, buildTextSummary(answers, checked)), buildTextSummary(answers, checked))} style={BTN}>Print / Save PDF</button>
        <button type="button" disabled={submitting} onClick={openSubmitModal} style={BTN_PRIMARY}>Submit answers</button>
      </div>

      {/* Submit modal */}
      {modalOpen && (
        <div className="guide-modal-overlay open" role="dialog" aria-modal="true" aria-labelledby="guide-submit-heading" onClick={e => { if (e.target === e.currentTarget) closeSubmitModal(); }}>
          <div className="guide-modal">
            <h2 id="guide-submit-heading">Ready to submit?</h2>
            <p>Your answers will be compiled into a detailed website planning summary with recommendations, tables, and reference links.</p>
            <p>The summary will be saved for authorised review. A printable or downloaded copy is available for your records.</p>
            <label htmlFor="guideSubmitterEmail">
              Your email address{' '}
              <span style={{ fontWeight: 400, color: '#5f6570' }}>(optional)</span>
            </label>
            <input
              type="email"
              id="guideSubmitterEmail"
              placeholder="yourname@email.com"
              value={submitterEmail}
              onChange={e => setSubmitterEmail(e.target.value)}
            />
            <div className="guide-modal-actions">
              <button type="button" className="submit-action" onClick={handleSubmit}>Send my answers</button>
              <button type="button" onClick={closeSubmitModal}>Go back and check</button>
            </div>
            <p className="privacy-note">Drafts stay in this browser; submitted answers are stored in the project database. No email is sent automatically.</p>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </>
  );
}
