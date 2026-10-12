import { useState, useEffect, useRef, useCallback } from 'react';
import { saveSubmission, openSummary, loadDraft } from '../submissions';
import useDialog from '../useDialog';
import '../index.css';
import { GIF_URIS } from '../gifUris';

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
  guideId: 'bayview',
  developerName: 'Prabesh Bhetwal',
};
const STORAGE_KEY = 'question_guide_progress_bayview';

// ── What the brief already told us (Navin's existing answers) ─────────────────
const BRIEF_SUMMARY = {
  businessName: 'Bayview Corp',
  industry: 'Boutique property development',
  goal: 'Build visibility and establish trust in the market',
  referenceWebsite: 'https://www.pierceproperty.com.au/',
  audience: 'Property owners / landowners, and property buyers',
  pages: 'Home, About, Services / Market Focus, Projects, Contact',
  contactMethod: 'Contact form',
  feel: 'Premium, modern, clean',
  contentManagement: 'Projects section to be editable',
  marketFocus: 'Will update with brief information on target markets',
  timeline: 'Not specified',
  budget: 'Not specified',
};

// ── Visual library — GIF-based, all animated ─────────────────────────────────
const VISUAL_LIBRARY = {
  identity: {
    title: 'How business identity appears on a website',
    intro: 'Think of two things: what visitors read when they land (your brand name, tagline, tone), and what sits behind the scenes in legal/footer text. Both need to be confirmed before anything is built.',
    gifs: [
      { src: GIF_URIS.identity, label: 'First impression', caption: 'Your name, a short tagline, and a professional image — this is the impression Bayview Corp will make within 3 seconds.' },
      { src: GIF_URIS.identity, label: 'Legal and footer details', caption: 'ABN, registered business name, and contact details sit in the footer. They need to be accurate and consistent with your domain.' },
    ],
    chart: [['First impression clarity', 92], ['Visitor trust', 78], ['Legal accuracy', 88]],
    compare: [['Clear', 'One consistent name on the website, domain, and business email builds trust.'], ['Confusing', 'Different names in different places make visitors uncertain which business they are dealing with.']],
  },
  positioning: {
    title: 'What "positioning" means for Bayview',
    intro: 'Positioning answers the question: "What makes Bayview Corp different from other property developers?" A visitor who lands on the homepage should understand the answer within 10 seconds, without reading the whole page.',
    gifs: [
      { src: GIF_URIS.positioning, label: 'Boutique and founder-led', caption: 'A clear niche (boutique, premium, residential) is more convincing than a generic "we do everything" message.' },
      { src: GIF_URIS.positioning, label: 'Track record and specialist focus', caption: 'Showing specific experience — property type, suburb, deal type — tells visitors you know the market.' },
    ],
    chart: [['Clarity of purpose', 88], ['Differentiation', 74], ['Memorability', 65]],
    compare: [['Strong positioning', 'A visitor can explain what Bayview does after one screen.'], ['Weak positioning', 'The site looks premium but could belong to any developer.']],
  },
  audience: {
    title: 'Who should the Bayview website speak to first?',
    intro: 'Your brief mentioned property owners/landowners and property buyers. These two groups need different information. Choosing which one the homepage speaks to first makes the writing much more effective.',
    gifs: [
      { src: GIF_URIS.audience, label: 'Landowner or property owner', caption: 'They want to know: "Is Bayview trustworthy? Do they know the market I am selling into? What is the process?"' },
      { src: GIF_URIS.audience, label: 'Property buyer', caption: 'They want to know: "What is available? Where are the projects? How do I register interest?"' },
    ],
    chart: [['Landowner trust signals', 90], ['Buyer project information', 78], ['General brand awareness', 55]],
    compare: [['Pick one first', 'Write the homepage for the landowner (or buyer), then use the Projects page for the other.'], ['Write for everyone', 'Trying to speak to both groups equally weakens the message for both.']],
  },
  market: {
    title: 'What "target markets" looks like on a property website',
    intro: 'In property development, "target markets" usually means locations and property types. Your brief mentioned you want to update the site with brief information on target markets. This becomes a section or page called "Market Focus" or "Where We Work".',
    gifs: [
      { src: GIF_URIS.market, label: 'Location and suburb focus', caption: 'Naming specific Sydney suburbs or regions gives visitors immediate context about where Bayview operates.' },
      { src: GIF_URIS.market, label: 'Property and deal type focus', caption: '"Boutique residential apartments", "5–20 unit sites", "Landowner joint ventures" — these tell visitors exactly what opportunities Bayview pursues.' },
    ],
    chart: [['Location clarity', 86], ['Deal type clarity', 78], ['Frequency of updates', 58]],
    compare: [['Specific and named', '"We focus on boutique residential development in Sydney\'s Northern Beaches and Lower North Shore."'], ['Too vague', '"We focus on premium property across Sydney." — This tells visitors very little.']],
  },
  services: {
    title: 'How a services section works on a property development website',
    intro: 'A "services" section for a developer is less about listing every task, and more about explaining how Bayview works and who it works with. Keep it to 3–5 services at most for the first version.',
    gifs: [
      { src: GIF_URIS.services, label: 'Development delivery', caption: 'The main story: acquiring sites, managing development, delivering finished properties.' },
      { src: GIF_URIS.services, label: 'Landowner partnerships', caption: 'A specific callout for landowners who may want to work with Bayview rather than sell outright.' },
    ],
    chart: [['Core service clarity', 88], ['Supporting service relevance', 62], ['Sensitive detail risk', 44]],
    compare: [['Focused service list', 'List 3–5 services that describe how you work. Visitors understand quickly.'], ['Everything listed', 'A long service list dilutes the premium feel and makes it harder for visitors to know what to do.']],
  },
  projects: {
    title: 'How an editable Projects section works',
    intro: 'This is the section you will manage yourself after the site is built. Think of it like a simple database: you add a project entry, fill in a few fields, upload photos, and it appears on the website. You can also hide a project until it is ready.',
    gifs: [
      { src: GIF_URIS.projects, label: 'What a completed project entry looks like', caption: 'Name, suburb, status (Completed / Current / Coming Soon), a featured image, and a short description.' },
      { src: GIF_URIS.projects, label: 'A draft or hidden project', caption: 'You can save a project entry privately — it exists in your editor but is not shown publicly until you turn it on.' },
    ],
    chart: [['High-quality photography', 94], ['Consistent fields per project', 80], ['Private draft option', 70]],
    compare: [['Structured entries', 'Every project uses the same fields (name, suburb, status, image, description). The site looks consistent even as you add more.'], ['Unstructured entries', 'Different details per project can look messy and make the site feel inconsistent.']],
  },
  proof: {
    title: 'Why trust proof matters more than premium design',
    intro: '"Trust proof" is the evidence that backs up the claims on the website. Premium design makes a good first impression, but visitors who are considering a significant property decision will look for reasons to believe the business is capable and reliable.',
    gifs: [
      { src: GIF_URIS.proof, label: 'Completed projects as evidence', caption: 'A completed project entry with real photos, location, and outcome is more convincing than saying "experienced developer".' },
      { src: GIF_URIS.proof, label: 'Real people and credentials', caption: 'A founder profile, team background, or connection to Vin Commercial (if appropriate) adds credibility that a logo alone cannot.' },
    ],
    chart: [['Completed project proof', 94], ['Real founder or team profile', 78], ['Generic "we are trusted" copy', 22]],
    compare: [['Proof-led', 'The website shows completed work, real people, and verifiable credentials. Visitors leave with reasons to trust.'], ['Claim-led', 'The website says "trusted", "experienced", "premium" but shows nothing to back it up. Visitors are sceptical.']],
  },
  permissions: {
    title: 'What needs approval before it goes on the website',
    intro: 'Before any project photo, partner name, client testimonial, or financial claim goes on the website, it should be checked and approved. This is not about being cautious for the sake of it — it protects Bayview from embarrassing corrections after launch.',
    gifs: [
      { src: GIF_URIS.permissions, label: 'Approved and cleared for publication', caption: 'Anything you own the rights to or have permission to use. Your own project photos, your own company description, your own ABN.' },
      { src: GIF_URIS.permissions, label: 'Needs review before publishing', caption: 'Partner names, joint venture details, quotes from other people, renders from builders or architects, or any financial claims.' },
    ],
    chart: [['Cleared to publish', 88], ['Needs owner permission', 55], ['Should not be published', 18]],
    compare: [['Safe approach', 'Only publish what you own or have permission to use. Get written approval for partner or client mentions.'], ['Risky approach', 'Publishing partner names or claims without permission can create disputes after launch.']],
  },
  domain: {
    title: 'How domain and business email registration works',
    intro: 'A domain is your website address (e.g. bayviewcorp.com.au). A business email is an address that matches it (e.g. navin@bayviewcorp.com.au). Both are straightforward to register — the key is making sure they are registered under Bayview\'s business details, not under a personal account that could be hard to access later.',
    gifs: [
      { src: GIF_URIS.domain, label: 'Domain registration', caption: 'For .com.au you need an eligible Australian business: an ABN, ACN, or trademark. The domain should be registered in Bayview\'s name, not a personal name.' },
      { src: GIF_URIS.domain, label: 'Matching business email', caption: 'navin@bayviewcorp.com.au looks far more professional than a personal Gmail or Outlook address when receiving enquiries.' },
    ],
    chart: [['Professional trust', 88], ['Easy to remember', 76], ['Registration effort', 40]],
    compare: [['Professional setup', 'Bayview owns bayviewcorp.com.au and receives enquiries at a matching business email.'], ['Less polished', 'A public website but with a personal email address — visitors may question the formality of the business.']],
  },
  action: {
    title: 'What happens after someone finds the Bayview website',
    intro: 'The goal of any business website is to make the next step obvious. For Bayview, that next step is an enquiry — from a landowner, a buyer, or a partner. The website should make it easy and low-pressure to reach out.',
    gifs: [
      { src: GIF_URIS.action, label: 'Contact form enquiry', caption: 'A short form on the Contact page captures name, email, phone, and message. It lands in the inbox you nominate.' },
      { src: GIF_URIS.action, label: 'Phone or direct conversation', caption: 'Some visitors prefer a call. Showing a phone number alongside the form gives them the choice.' },
    ],
    chart: [['Enquiry ease', 94], ['Lead intent quality', 72], ['Visitor effort required', 28]],
    compare: [['Clear next step', 'Contact button in the main navigation, a short form, and a phone number. Visitors know exactly how to reach you.'], ['Unclear next step', 'No visible contact details. Interested visitors leave without reaching out.']],
  },
  setup: {
    title: 'Who should own the Bayview website accounts',
    intro: 'When a website is built, several accounts are created — the domain registrar, the hosting provider, and the editing screen login. These should all be owned by Bayview Corp, not by the developer. If the developer holds the accounts and moves on, it becomes difficult to manage the website independently.',
    gifs: [
      { src: GIF_URIS.setup, label: 'Business-owned accounts', caption: 'Domain registrar account, hosting account, and the Projects editor login should all be under Bayview\'s email and details.' },
      { src: GIF_URIS.setup, label: 'Enquiry destination', caption: 'The contact form sends messages to the email address you choose. Make sure this is checked regularly.' },
    ],
    chart: [['Ownership clarity', 94], ['Long-term control', 88], ['Handover risk', 18]],
    compare: [['Clean ownership', 'Bayview controls the domain, the Projects editor, and the inbox where enquiries arrive.'], ['Risky setup', 'Accounts sit under someone else — if access is lost, regaining control can be slow and difficult.']],
  },
  content: {
    title: 'What content Bayview needs to supply before the build starts',
    intro: 'A website can only be as good as the content inside it. The developer can build the structure and design, but the words, photos, and business details must come from you. The clearer these are upfront, the faster the build.',
    gifs: [
      { src: GIF_URIS.content, label: 'Brand assets ready to hand over', caption: 'Logo file (SVG or high-resolution PNG), brand colours (hex codes if known), and any existing marketing collateral.' },
      { src: GIF_URIS.content, label: 'Written copy and project descriptions', caption: 'The About page, service descriptions, and project summaries — even rough drafts — are easier to refine than to write from scratch.' },
    ],
    chart: [['Logo and brand assets', 90], ['Project photos ready', 55], ['Written copy drafted', 40]],
    compare: [['Assets ready', 'Build can start immediately. Developer polishes copy and optimises images.'], ['Assets pending', 'Build stalls waiting on content. Launch date slips.']],
  },
  timeline: {
    title: 'How project timelines and budgets work in web development',
    intro: 'The two questions most clients leave until last are timeline and budget — but they are the ones that shape every other decision. Knowing both upfront means the developer can scope accurately and you get exactly what you expect, with no surprises.',
    gifs: [
      { src: GIF_URIS.timeline, label: 'Realistic timeline expectations', caption: 'A polished marketing website with a Projects editor typically takes 4–8 weeks from confirmed content to launch. The main delay is always waiting for content, not building.' },
      { src: GIF_URIS.timeline, label: 'Budget scope and trade-offs', caption: 'A clear budget lets the developer tell you exactly what is included and what is out of scope — no vague estimates, no surprises.' },
    ],
    chart: [['Content ready on time', 85], ['Budget confirmed early', 78], ['Scope changes mid-build', 30]],
    compare: [['Clear brief + budget', 'Faster build, no scope creep, confident developer, satisfied client.'], ['Vague scope + no budget', 'Slower build, unexpected costs, frustration on both sides.']],
  },
  design: {
    title: 'How the design approval process works',
    intro: 'Before any code is written, the developer produces a visual design — usually a mockup or prototype — showing what the website will look like. This is the point where feedback is easiest and cheapest. Changes after the build starts take significantly longer.',
    gifs: [
      { src: GIF_URIS.design, label: 'Design mockup stage', caption: 'A visual layout showing page structure, colours, fonts, and imagery placement — before a single line of code is written.' },
      { src: GIF_URIS.design, label: 'Feedback and approval', caption: 'Two rounds of design revisions are standard. Major structural changes after approval extend the timeline and may affect cost.' },
    ],
    chart: [['Design approval clarity', 88], ['Revision rounds (standard)', 66], ['Cost of post-build changes', 85]],
    compare: [['Feedback at design stage', 'Fast, free, easy. A comment like "move this up" takes minutes to implement.'], ['Feedback after build', 'Slow and costly. The same change may require rebuilding multiple components.']],
  },
};

// ── Visual type map ────────────────────────────────────────────────────────────
const VISUAL_TYPE_MAP = {
  'b-identity-1': 'identity',
  'b-identity-2': 'identity',
  'b-identity-3': 'positioning',
  'b-market-1': 'market',
  'b-market-2': 'audience',
  'b-market-3': 'market',
  'b-services-1': 'services',
  'b-services-2': 'services',
  'b-services-3': 'permissions',
  'b-projects-1': 'projects',
  'b-projects-2': 'projects',
  'b-projects-3': 'projects',
  'b-projects-4': 'projects',
  'b-proof-1': 'proof',
  'b-proof-2': 'permissions',
  'b-proof-3': 'proof',
  'b-domain-1': 'domain',
  'b-domain-2': 'setup',
  'b-domain-3': 'action',
  'b-domain-4': 'domain',
  // Step 7 — content assets
  'b-content-1': 'content',
  'b-content-2': 'content',
  'b-content-3': 'content',
  // Step 8 — timeline, budget, design
  'b-timeline-1': 'timeline',
  'b-timeline-2': 'timeline',
  'b-timeline-3': 'design',
  'b-timeline-4': 'design',
};

// ── Section and question data ─────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'identity',
    kicker: 'Step 1',
    heading: 'Confirm the business identity',
    description: 'These are the first answers needed. Your domain name, the About section, the footer, and all the legal wording depend on them. Without these confirmed, the developer cannot write or build the core pages.',
    callout: null,
    questions: [
      {
        id: 'b-identity-1',
        heading: 'Is Bayview Corp a new company, or is it connected to Vin Commercial?',
        detail: 'This matters because the website needs to know whether to mention Vin Commercial as context (for credibility) or keep Bayview entirely separate. For example: "Should the website show that Bayview\'s founders come from a Vin Commercial background?" There is no wrong answer — just tell us how you want visitors to think about it.',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "Bayview is separate, but Navin has 10 years of property experience through Vin Commercial which we can mention."',
      },
      {
        id: 'b-identity-2',
        heading: 'What exact business name should appear on the website?',
        detail: 'You mentioned "Bayview Corp" in your brief. Just confirm: is it "Bayview Corp" as the display name, and if there is a legal registered name like "Bayview Corp Pty Ltd", we need that for the footer as well. This must match the domain and any business registration documents.',
        priority: 'Critical',
        briefStatus: 'partial',
        briefValue: '"Bayview Corp" — registered legal name still needed.',
        hint: 'Example: Display name: "Bayview Corp" / Legal name: "Bayview Corp Pty Ltd" (ABN: xxxxxxxx)',
      },
      {
        id: 'b-identity-3',
        heading: 'Should the website feel like it is about Navin personally, or about the company as a whole?',
        detail: 'Some boutique property developers use their own name and story to build trust — this is called a founder-led approach. Others prefer the company name to lead. Example of founder-led: "Led by Navin Upreti, Bayview Corp is..." Example of company-led: "Bayview Corp is a boutique property development company..." Neither is wrong. Which feels more natural to you?',
        priority: 'Recommended',
        briefStatus: 'missing',
        hint: 'Example answer: "Company-led, but I am happy to include a short personal profile on the About page."',
      },
    ],
  },
  {
    id: 'market',
    kicker: 'Step 2',
    heading: 'Define the market focus',
    description: 'Your brief said you want to update the site with information on target markets. This becomes a section on the website — probably called "Market Focus" or "Where We Work". Before we build it, we need to know which markets you are focusing on.',
    callout: 'Practical tip: The "Market Focus" section can be managed through the same Projects editor, so you do not need a separate editing area. One editor, two content types.',
    questions: [
      {
        id: 'b-market-1',
        heading: 'Which locations or property markets should Bayview mention on the website?',
        detail: 'Think about where Bayview is actively looking for sites or where you have already worked. Naming specific Sydney suburbs or regions (e.g. "Northern Beaches", "Lower North Shore", "Eastern Suburbs") gives visitors immediate context. You can also mention property types, such as boutique residential apartments, townhouse sites, or infill development.',
        priority: 'Critical',
        briefStatus: 'partial',
        briefValue: 'Brief mentioned "target markets" — no specific suburbs or property types named yet.',
        hint: 'Example answer: "Primarily Sydney — Lower North Shore and Northern Beaches. Boutique residential, 6–15 unit sites."',
      },
      {
        id: 'b-market-2',
        heading: 'Who is Bayview most trying to attract through the website?',
        detail: 'Your brief mentioned landowners and buyers. For this first version, which group should the homepage be written for? A landowner is someone who owns a property and may want to work with a developer on it. A buyer is someone looking to purchase a unit in a completed development. These two visitors need very different information, so choosing one as the primary focus makes the website much more effective.',
        priority: 'Critical',
        briefStatus: 'partial',
        briefValue: 'Brief mentioned both property owners/landowners and buyers — need to confirm priority for version one.',
        hint: 'Example answer: "Primarily landowners. Buyers are secondary — the Projects page will serve them."',
      },
      {
        id: 'b-market-3',
        heading: 'How often do you expect to update the market focus content?',
        detail: 'This decides whether the market focus section needs to be editable, or whether it can be a fixed page that the developer updates for you occasionally. If Bayview regularly shifts between suburbs or deal types, a simple editing option makes sense. If it rarely changes, a fixed page is simpler.',
        priority: 'Recommended',
        briefStatus: 'missing',
        hint: 'Example answer: "Probably every 6–12 months, when we start a new acquisition campaign in a new area."',
      },
    ],
  },
  {
    id: 'services',
    kicker: 'Step 3',
    heading: 'Choose what services to show',
    description: 'The services section tells visitors what Bayview actually does — and importantly, who should contact you. Keep this short and focused. A premium site with 3–5 clear services looks more credible than a long brochure list.',
    callout: null,
    questions: [
      {
        id: 'b-services-1',
        heading: 'Which services should appear on the Bayview website?',
        detail: 'Think about the activities that best describe how Bayview works. A typical boutique property developer might list things like: site acquisition, development management, landowner partnerships, joint ventures, or off-the-plan sales. You do not need to list every task. Just the 3–5 things that tell visitors what you do and who you work with.',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "1. Site acquisition — 2. Development management — 3. Landowner joint ventures — 4. Off-the-plan buyer enquiries"',
      },
      {
        id: 'b-services-2',
        heading: 'Which one service should be featured most prominently?',
        detail: 'Since the main goal is visibility and trust, the first version of the website may just need a "What We Do" section rather than a full services page. If you had to describe Bayview in one sentence starting with a service, what would it be? Example: "We partner with landowners to deliver boutique residential developments on Sydney\'s North Shore."',
        priority: 'Recommended',
        briefStatus: 'missing',
        hint: 'Example answer: "Landowner partnerships are the most important — that is where we find our sites."',
      },
      {
        id: 'b-services-3',
        heading: 'Are there any activities or details you do not want mentioned publicly?',
        detail: 'Some development activities — financing arrangements, joint venture structures, certain investor relationships — are better kept off the public website, at least for the first version. Just let us know if there is anything you want to exclude, and we will keep it off the site.',
        priority: 'Optional',
        briefStatus: 'missing',
        hint: 'Example answer: "Yes — do not mention any specific finance or investor arrangements publicly."',
      },
    ],
  },
  {
    id: 'projects',
    kicker: 'Step 4',
    heading: 'Set up the editable Projects section',
    description: 'This is the section you will manage yourself. It works like a simple form: you log in, fill in a few fields for each project, upload photos, and save. The website updates automatically. Before we build it, we need to agree on which fields each project entry should have.',
    callout: 'Editing boundary: You will be able to add, edit, hide, and delete project entries. The homepage layout, the About text, and the navigation will stay fixed unless you ask for a broader change.',
    questions: [
      {
        id: 'b-projects-1',
        heading: 'What information should each project entry include?',
        detail: 'Think about what a visitor would want to know about each Bayview project, and what you would want to fill in when you add a new one. Common fields include: project name, suburb, project type (e.g. apartments, townhouses), status (current/completed/coming soon), a short description (2–3 sentences), a featured image, and additional gallery photos. Are all of those right for Bayview? Is there anything else?',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "Yes to all of those. Also add: number of dwellings, and a landowner contact CTA if the project is in acquisition phase."',
      },
      {
        id: 'b-projects-2',
        heading: 'What status labels should a project be allowed to have?',
        detail: 'Status labels are how visitors understand where a project is up to. Common options: "Current", "Completed", "Coming Soon", "In Acquisition", "Market Focus", "Sold", or "Private" (hidden from visitors but saved in your editor). Which of these do you want, and are there others specific to how Bayview describes its pipeline?',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "Current, Completed, Coming Soon, and Private. We do not need \'In Acquisition\' shown publicly."',
      },
      {
        id: 'b-projects-3',
        heading: 'Should projects be saveable as private drafts before going live?',
        detail: 'This means you can create a project entry and save all the details, but keep it hidden from the public website until you are ready to publish it. This is almost always the right choice — it lets you prepare projects in advance without rushing. Is that useful for Bayview?',
        priority: 'Recommended',
        briefStatus: 'missing',
        hint: 'Example answer: "Yes — we will often have projects in early stages that we are not ready to show publicly."',
      },
      {
        id: 'b-projects-4',
        heading: 'What image quality standard should Bayview use for project photos?',
        detail: 'Since the goal is a premium impression, low-resolution phone photos will look out of place. The options are: professional photography (preferred for completed projects), architectural renders (for projects under development), or selected stock imagery as a placeholder when real photos are not yet ready. What standard do you want to maintain?',
        priority: 'Recommended',
        briefStatus: 'missing',
        hint: 'Example answer: "Professional photos for completed projects. Renders for current projects. No phone photos unless they are genuinely high quality."',
      },
    ],
  },
  {
    id: 'proof',
    kicker: 'Step 5',
    heading: 'Gather trust proof',
    description: 'Your brief says the website should build trust. Trust is built through evidence, not just claims. Premium design will make the right impression, but visitors making significant property decisions will look for proof before they act. This section identifies what evidence Bayview can show.',
    callout: null,
    questions: [
      {
        id: 'b-proof-1',
        heading: "What can the website truthfully say about Bayview's track record?",
        detail: 'Think about what you can say on the website that would make a landowner or buyer feel confident. Examples: "Over 10 years of property experience in Sydney", "Previously completed X projects", "Background in commercial property through Vin Commercial", "Specialist in boutique residential development on the North Shore". Whatever you say must be accurate and verifiable — but do not undersell real experience.',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "Navin has 12 years of commercial and residential property experience, including previous development work before Bayview was formed."',
      },
      {
        id: 'b-proof-2',
        heading: 'Which project photos, partner names, or testimonials are approved to be on the website?',
        detail: 'Before anything goes live, every image, partner name, client quote, or third-party reference needs to be confirmed as approved for public use. Go through what you have and decide: (a) what is yours to publish freely, (b) what needs permission from someone else, and (c) what should definitely not appear publicly. This prevents any post-launch surprises.',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "Our own project photos — yes. Partner logos — need to check. Vin Commercial connection — yes, Navin is happy to mention it."',
      },
      {
        id: 'b-proof-3',
        heading: "Would you like a short personal profile for Navin on the About page?",
        detail: "For a boutique developer, a real person's profile often makes the website feel far more trustworthy than anonymous corporate copy. Visitors considering a significant property decision want to know who they are dealing with. A short paragraph — 60 to 100 words — with a professional headshot is often enough. Is Navin comfortable with a visible founder profile?",
        priority: 'Recommended',
        briefStatus: 'missing',
        hint: 'Example answer: "Yes — Navin is happy to have a profile with a professional photo and a short background paragraph."',
      },
    ],
  },
  {
    id: 'domain',
    kicker: 'Step 6',
    heading: 'Domain, email, and contact form',
    description: 'These decisions affect what the website address will be, who receives enquiries, and how professional the business looks. All of these can be set up quickly — we just need to confirm the details first.',
    callout: null,
    questions: [
      {
        id: 'b-domain-1',
        heading: 'Which website address (domain) do you want to register?',
        detail: 'A domain is your website address — what visitors type into the browser, and what appears in Google search results. For Bayview, options might include: bayviewcorp.com.au, bayviewdevelopments.com.au, bayviewproperty.com.au, or bayviewcorp.com. List your preferred option first, then a couple of backups in case the first is taken. Shorter and more memorable is usually better.',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "First preference: bayviewcorp.com.au. Backup: bayviewproperty.com.au."',
      },
      {
        id: 'b-domain-2',
        heading: "What are Bayview Corp's Australian business registration details?",
        detail: "To register a .com.au domain, you need eligible Australian business details — usually an ABN (Australian Business Number) or ACN. The domain must be registered in Bayview Corp's name (not a personal name), so it stays with the business long-term. If Bayview Corp is not yet registered as an Australian company, we should discuss options. What are the current business registration details?",
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "Bayview Corp Pty Ltd — ABN: 12 345 678 901." (or confirm if registration is still in progress)',
      },
      {
        id: 'b-domain-3',
        heading: 'Where should enquiries from the contact form go?',
        detail: 'When someone fills in the contact form on the Bayview website and clicks Send, the message needs to land somewhere. Write the exact email address that should receive these enquiries, and confirm who checks it and how regularly. Also let us know if you want a notification copy sent to a second address (e.g. the developer as a backup).',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "Send enquiries to navin@bayviewcorp.com.au. Also send a copy to jarvis.pc13@gmail.com as a backup."',
      },
      {
        id: 'b-domain-4',
        heading: 'Do you want a matching business email address set up?',
        detail: 'A business email like navin@bayviewcorp.com.au or enquiries@bayviewcorp.com.au looks far more professional than a personal email when receiving enquiries from landowners or buyers. It also matches your domain, which reinforces the brand. This is straightforward to set up alongside the domain registration. Is this something you want?',
        priority: 'Recommended',
        briefStatus: 'missing',
        hint: 'Example answer: "Yes — navin@bayviewcorp.com.au and enquiries@bayviewcorp.com.au."',
      },
    ],
  },
  {
    id: 'content',
    kicker: 'Step 7',
    heading: 'Content and brand assets',
    description: 'The developer builds the structure — but the words, photos, logo, and business details must come from Bayview. The clearer and earlier these are provided, the faster and better the build goes. This section identifies exactly what is needed before work starts.',
    callout: 'Speed tip: Projects with content ready at the start consistently launch 2–3 weeks faster than those waiting on assets mid-build.',
    questions: [
      {
        id: 'b-content-1',
        heading: 'Does Bayview Corp have a logo file ready to use?',
        detail: 'The logo is needed for the website header, the browser tab, email footers, and any PDF materials. The ideal format is an SVG or a high-resolution PNG with a transparent background. If Bayview does not yet have a final logo, let the developer know — a placeholder can be used during the build and swapped in when the final file is ready.',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "Yes — we have a final SVG logo file. I will send it over." or "No final logo yet — we are working on branding. Please use a placeholder."',
      },
      {
        id: 'b-content-2',
        heading: 'What professional photos does Bayview have ready to use on the website?',
        detail: 'Photos are the single most impactful element of a premium property website. The types needed are: exterior and interior shots of completed or current projects, a professional headshot of Navin for the About page (if a founder profile is included), and any architect renders for projects still in development. Phone photos are not suitable for a premium impression. If photos are not yet ready, a build can begin with placeholders — but the final website will need real imagery.',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "We have professional photos for one completed project and renders for one current project. Navin headshot is available. No phone photos."',
      },
      {
        id: 'b-content-3',
        heading: 'How much written copy does Bayview have ready?',
        detail: 'Written copy means the actual text that goes on the website — the About page background, the service descriptions, the project summaries, and any taglines. Even rough draft notes are easier to refine than starting from nothing. The developer can help shape the copy from draft notes, but the factual content — what Bayview does, where it operates, Navin\'s background — must come from Bayview. What stage is the writing at?',
        priority: 'Recommended',
        briefStatus: 'missing',
        hint: 'Example answer: "I have rough notes on the About page and a one-paragraph company overview. No service descriptions yet. Happy to write them with guidance."',
      },
    ],
  },
  {
    id: 'timeline',
    kicker: 'Step 8',
    heading: 'Timeline, budget, and design approval',
    description: 'These are often the last questions clients answer — but they are the ones that make every other decision concrete. A clear timeline and budget means the developer can scope accurately, give you an honest estimate, and hold to it. The design approval process ensures no surprises after the build starts.',
    callout: null,
    questions: [
      {
        id: 'b-timeline-1',
        heading: 'When would Bayview like the website to be live?',
        detail: 'A polished marketing website with a Projects editor typically takes 4–8 weeks from confirmed content and brief to launch. The main factor that extends this is waiting on content — photos, copy, and logo. If you have a target date (e.g. for a launch event, an acquisition campaign, or a business registration milestone), share it now so the developer can plan accordingly. If no date is set yet, that is also fine — it just means the timeline will be driven by when content is ready.',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "We want to be live by the end of July 2025, before our next landowner outreach campaign." or "No fixed date — ready when it is ready and done properly."',
      },
      {
        id: 'b-timeline-2',
        heading: 'What is the approximate budget for the website?',
        detail: 'A budget does not need to be a precise number — a range is fine. It lets the developer tell you exactly what is included, what is out of scope, and where trade-offs exist. Without a budget, estimates are vague and expectations can diverge. For context: a polished marketing website with a Projects editor and professional setup typically sits in the $3,500–$7,000 range depending on scope, content readiness, and the number of revision rounds. Is there a budget range in mind?',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "Budget is approximately $5,000–$6,500. Open to discussion if the scope justifies it."',
      },
      {
        id: 'b-timeline-3',
        heading: 'Who at Bayview will review and approve the design mockup?',
        detail: 'Before any code is written, the developer produces a visual mockup — showing layout, colours, fonts, and imagery placement. This is the most important approval point. Changes at the mockup stage are fast and free. Changes after the build has started can extend the timeline significantly. Confirm who the decision-maker is for the design: is it Navin alone, or will others need to be consulted before approval?',
        priority: 'Critical',
        briefStatus: 'missing',
        hint: 'Example answer: "Navin alone — one decision-maker. Approval can be given within a week of receiving the mockup."',
      },
      {
        id: 'b-timeline-4',
        heading: 'How many rounds of revision are you expecting before signing off?',
        detail: 'Most website builds include two rounds of structured feedback — one after the design mockup, and one after the first working version. Additional revision rounds can extend the timeline and may affect cost. If there are specific areas you anticipate wanting to review carefully (e.g. the homepage layout, the About page tone, the Projects section display), it helps to know this upfront. What are your expectations for the revision process?',
        priority: 'Recommended',
        briefStatus: 'missing',
        hint: 'Example answer: "Two rounds should be enough if the mockup is clearly communicated upfront. I will consolidate all feedback in one document per round."',
      },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function loadPersistedState() {
  return loadDraft(STORAGE_KEY, Object.fromEntries(SECTIONS.flatMap(s => s.questions.flatMap(q => [
    ['answer_' + q.id, ''], [q.id, false],
  ]))));
}

function escHtml(v) {
  return String(v || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function buildTextSummary(answers, checked, submitterEmail) {
  const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const allQ = SECTIONS.flatMap(s => s.questions);
  const answeredCount = allQ.filter(q => answers['answer_' + q.id]?.trim() || checked[q.id]).length;

  const lines = [
    'BAYVIEW CORP — WEBSITE PLANNING GUIDE ANSWERS',
    '==================================================',
    'Date: ' + date,
    submitterEmail ? 'Submitted by: ' + submitterEmail : '',
    'Progress: ' + answeredCount + ' of ' + allQ.length + ' answered',
    '',
    'BRIEF CONTEXT (already confirmed)',
    '--------------------------------------------------',
    'Business: ' + BRIEF_SUMMARY.businessName,
    'Industry: ' + BRIEF_SUMMARY.industry,
    'Goal: ' + BRIEF_SUMMARY.goal,
    'Reference website: ' + BRIEF_SUMMARY.referenceWebsite,
    'Audience: ' + BRIEF_SUMMARY.audience,
    'Pages needed: ' + BRIEF_SUMMARY.pages,
    'Contact: ' + BRIEF_SUMMARY.contactMethod,
    'Look and feel: ' + BRIEF_SUMMARY.feel,
    'Content management: ' + BRIEF_SUMMARY.contentManagement,
    '',
  ].filter(Boolean);

  SECTIONS.forEach(section => {
    lines.push(section.heading.toUpperCase());
    lines.push('--------------------------------------------------');
    section.questions.forEach((q, i) => {
      const answerText = answers['answer_' + q.id]?.trim() || '';
      const status = q.briefStatus === 'partial' ? '[PARTIAL — brief gave: ' + (q.briefValue || '') + ']' : q.briefStatus === 'missing' ? '[MISSING]' : '[CONFIRMED]';
      lines.push((i + 1) + '. [' + q.priority + '] ' + q.heading);
      lines.push('   Brief status: ' + status);
      lines.push('   Answer: ' + (answerText || '[Not answered]'));
      lines.push('');
    });
  });

  return lines.join('\n');
}

function buildHtmlSummary(answers, checked, textSummary, submitterEmail) {
  const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const allQ = SECTIONS.flatMap(s => s.questions);
  const answeredCount = allQ.filter(q => answers['answer_' + q.id]?.trim() || checked[q.id]).length;
  const criticalMissing = allQ.filter(q => q.priority === 'Critical' && q.briefStatus !== 'confirmed' && !answers['answer_' + q.id]?.trim()).length;

  const rows = SECTIONS.flatMap(s =>
    s.questions.map(q => {
      const answerText = answers['answer_' + q.id]?.trim() || '';
      const statusBadge =
        q.briefStatus === 'partial' ? `<span style="background:#fff3cd;color:#856404;padding:2px 8px;border-radius:4px;font-size:12px">Partial</span>` :
        q.briefStatus === 'missing' ? `<span style="background:#f8d7da;color:#842029;padding:2px 8px;border-radius:4px;font-size:12px">Missing</span>` :
        `<span style="background:#d1e7dd;color:#0a3622;padding:2px 8px;border-radius:4px;font-size:12px">Confirmed</span>`;
      return `<tr><td>${escHtml(s.heading)}</td><td>${escHtml(q.priority)}</td><td>${statusBadge}</td><td><strong>${escHtml(q.heading)}</strong></td><td>${answerText ? escHtml(answerText) : '<span style="color:#aaa">Not answered</span>'}</td></tr>`;
    })
  ).join('');

  const css = `body{font-family:Inter,-apple-system,sans-serif;margin:0;background:#f7f2e8;color:#18202b;line-height:1.6}main{max-width:1120px;margin:0 auto;padding:34px 24px 80px}h1{font-family:Georgia,serif;font-size:36px;line-height:1.1;margin:0 0 10px}h2{font-family:Georgia,serif;font-size:24px;margin:34px 0 12px}p{color:#5f6570}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:22px 0}.metric{border:1px solid #ded3bd;background:#fffdf7;border-radius:8px;padding:16px}.metric strong{display:block;color:#183452}.metric span{color:#5f6570;font-size:14px}.toolbar{display:flex;gap:10px;flex-wrap:wrap;margin:24px 0}.btn{padding:9px 13px;border:1px solid #ded3bd;border-radius:8px;background:#fff;cursor:pointer;font-size:14px}.btn.primary{background:#f1d491;border-color:#f1d491}.brief-panel{background:#fffbf0;border:1px solid #ded3bd;border-radius:8px;padding:20px 24px;margin-bottom:24px}.brief-panel h3{margin:0 0 12px;font-family:Georgia,serif;font-size:18px}.brief-row{display:flex;gap:8px;margin-bottom:8px;font-size:14px}.brief-label{color:#5f6570;min-width:160px;flex-shrink:0}.brief-val{color:#18202b;font-weight:500}table{width:100%;border-collapse:collapse;background:white;border:1px solid #ded3bd;border-radius:8px;overflow:hidden}th,td{padding:11px 12px;border-bottom:1px solid #ded3bd;text-align:left;vertical-align:top;font-size:14px}th{background:#183452;color:white;font-size:11px;text-transform:uppercase;letter-spacing:.06em}@media(max-width:760px){.grid{grid-template-columns:1fr}table{display:block;overflow-x:auto}}@media print{.toolbar{display:none}}`;

  const briefRows = Object.entries(BRIEF_SUMMARY).map(([k, v]) => {
    const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
    return `<div class="brief-row"><span class="brief-label">${escHtml(label)}</span><span class="brief-val">${escHtml(v)}</span></div>`;
  }).join('');

  return `<!doctype html><html><head><meta charset="UTF-8"><title>Bayview Corp — Website Guide Answers</title><style>${css}</style></head><body><main><h1>Bayview Corp — Website Planning Answers</h1><p>Prepared ${escHtml(date)}${submitterEmail ? ' by ' + escHtml(submitterEmail) : ''}.</p><div class="grid"><div class="metric"><strong>Answered</strong><span>${answeredCount} of ${allQ.length} questions</span></div><div class="metric"><strong>Critical gaps remaining</strong><span>${criticalMissing} critical question${criticalMissing !== 1 ? 's' : ''} still missing</span></div><div class="metric"><strong>Reference site</strong><span>pierceproperty.com.au</span></div></div><div class="toolbar"><button class="btn primary" onclick="window.print()">Print / Save as PDF</button><button class="btn" onclick="navigator.clipboard.writeText(document.getElementById('plain').innerText)">Copy full text</button></div><h2>What the brief already confirmed</h2><div class="brief-panel"><h3>Existing brief answers</h3>${briefRows}</div><h2>Guide answers by section</h2><table><thead><tr><th>Section</th><th>Priority</th><th>Brief status</th><th>Question</th><th>Answer</th></tr></thead><tbody>${rows}</tbody></table><pre id="plain" style="white-space:pre-wrap;display:none">${escHtml(textSummary)}</pre></main></body></html>`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function GifCard({ gif }) {
  const [lightbox, setLightbox] = useState(false);
  const close = useCallback(() => setLightbox(false), []);
  useDialog(lightbox, close, '.gif-lightbox');
  return (
    <>
      <figure
        className="visual-card"
        onClick={() => setLightbox(true)}
        style={{ cursor: 'pointer', position: 'relative' }}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightbox(true); } }}
        aria-label={'Enlarge: ' + gif.label}
      >
        <div style={{ position: 'absolute', top: 6, right: 8, fontSize: '11px', color: '#b8a060', opacity: 0, transition: 'opacity 0.18s' }} className="gif-expand-hint">🔍 Enlarge</div>
        <img loading="lazy" decoding="async" src={gif.src} alt={gif.label} style={{ borderRadius: '6px', width: '100%' }} />
        <strong>{gif.label}</strong>
        <span>{gif.caption}</span>
      </figure>
      {lightbox && (
        <div
          className="gif-lightbox" role="dialog" aria-modal="true" aria-label={'Enlarged example: ' + gif.label}
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(5,10,20,0.9)',
            backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'zoom-out', animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 'min(640px, 92vw)', background: '#0f1520', borderRadius: '14px',
              border: '1.5px solid rgba(184,150,43,0.35)', padding: '16px', position: 'relative',
              animation: 'pop 0.22s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            <button
              onClick={() => setLightbox(false)}
              style={{
                position: 'absolute', top: 10, right: 12, background: 'none', border: 'none',
                color: '#b8a060', fontSize: '20px', cursor: 'pointer', lineHeight: 1,
              }}
              aria-label="Close"
            >✕</button>
            <img src={gif.src} alt={gif.label} style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '8px' }} />
            <p style={{ color: '#c8b87a', fontSize: '13px', margin: '10px 0 0', textAlign: 'center' }}>{gif.caption}</p>
          </div>
        </div>
      )}
    </>
  );
}

function VisualAid({ questionId }) {
  const key = VISUAL_TYPE_MAP[questionId] || 'positioning';
  const v = VISUAL_LIBRARY[key];
  if (!v) return null;
  return (
    <div className="visual-aids">
      <h4>{v.title}</h4>
      <p>{v.intro}</p>
      <div className="visual-grid">
        {v.gifs.map((gif, i) => (
          <GifCard key={i} gif={gif} />
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
          <span key={i}><strong>{label}: </strong>{text}</span>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status, briefValue }) {
  if (status === 'confirmed') {
    return <div className="brief-status confirmed">✓ Confirmed in your brief</div>;
  }
  if (status === 'partial') {
    return (
      <div className="brief-status partial">
        ◑ Partial — your brief said: <em>{briefValue}</em>
      </div>
    );
  }
  return <div className="brief-status missing">⚠ Not yet in your brief — answer needed</div>;
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
        <StatusBadge status={question.briefStatus} briefValue={question.briefValue} />
        {question.hint && (
          <div className="answer-hint">
            <strong>Example answer format:</strong> {question.hint}
          </div>
        )}
      </div>
      <span className={tagClass}>{question.priority}</span>
      <VisualAid questionId={question.id} />
      <div className="answer-area">
        <label htmlFor={'answer_' + question.id}>Your answer</label>
        <textarea
          id={'answer_' + question.id}
          placeholder="Write your answer here. A short, honest answer is all that is needed."
          value={answer || ''}
          onChange={e => onAnswerChange(question.id, e.target.value)}
        />
      </div>
    </article>
  );
}

function SectionPanel({ section, answers, checked, collapsed, onToggle, onAnswerChange, onCheckedChange }) {
  const sectionQ = section.questions;
  const sectionAnswered = sectionQ.filter(q => answers['answer_' + q.id]?.trim() || checked[q.id]).length;
  const criticalMissing = sectionQ.filter(q => q.priority === 'Critical' && q.briefStatus !== 'confirmed' && !answers['answer_' + q.id]?.trim()).length;

  return (
    <section className={`section-panel${collapsed ? ' is-collapsed' : ''}`} id={section.id} data-section="true">
      <button className="section-toggle" type="button" aria-expanded={!collapsed} onClick={onToggle}>
        <span className="section-heading">
          <span className="section-kicker">{section.kicker}</span>
          <h2>{section.heading}</h2>
          <p>{section.description}</p>
          {criticalMissing > 0 && (
            <span style={{ display: 'inline-block', marginTop: '6px', background: '#fef3cd', color: '#856404', padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
              {criticalMissing} critical answer{criticalMissing !== 1 ? 's' : ''} missing
            </span>
          )}
          {criticalMissing === 0 && sectionAnswered > 0 && (
            <span style={{ display: 'inline-block', marginTop: '6px', background: '#d1e7dd', color: '#0a3622', padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
              {sectionAnswered} of {sectionQ.length} answered
            </span>
          )}
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

// ── Main component ─────────────────────────────────────────────────────────────
export default function BayviewGuide() {
  const allQuestions = SECTIONS.flatMap(s => s.questions);
  const totalQ = allQuestions.length;
  const criticalTotal = allQuestions.filter(q => q.priority === 'Critical').length;

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
  const [activeSection, setActiveSection] = useState('brief-summary');
  const [toast, setToast] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState('Answers are saved in this browser as you type.');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [visualsHidden, setVisualsHidden] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
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

  // ── Scroll + nav ─────────────────────────────────────────────────────────
  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setScrollPct(max > 0 ? (doc.scrollTop / max) * 100 : 0);
      const sectionIds = ['brief-summary', ...SECTIONS.map(s => s.id), 'decision', 'resources'];
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

  // ── Toast ────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  }, []);

  // ── Progress ─────────────────────────────────────────────────────────────
  const answeredCount = allQuestions.filter(q =>
    answers['answer_' + q.id]?.trim() || checked[q.id]
  ).length;
  const criticalAnswered = allQuestions.filter(q =>
    q.priority === 'Critical' && (answers['answer_' + q.id]?.trim() || checked[q.id])
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

  // Save the guide; prepare the complete backup before the network request.
  async function handleSubmit() {
    if (submitting || !document.getElementById('guideSubmitterEmail').reportValidity()) return;
    const questions = SECTIONS.flatMap(section => section.questions.map(q => ({
      id: q.id, section: section.heading, question: q.heading, answer: answers['answer_' + q.id]?.trim() || '',
    })));
    if (!questions.some(q => q.answer)) { showToast('Write at least one answer before submitting.'); return; }
    const textSummary = buildTextSummary(answers, checked, submitterEmail);
    const htmlContent = buildHtmlSummary(answers, checked, textSummary, submitterEmail);
    const backup = openSummary(htmlContent, textSummary);
    setSubmitted(false);
    setSubmitting(true);
    setModalOpen(false);
    setSubmitStatus('Saving answers…');
    try {
      await saveSubmission({
        guideId: 'bayview', title: 'Bayview Website Planning Guide', senderEmail: submitterEmail.trim(),
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

  // ── Nav ───────────────────────────────────────────────────────────────────
  const navLinks = [
    { href: '#brief-summary', label: 'Brief summary' },
    { href: '#identity', label: 'Identity' },
    { href: '#market', label: 'Market' },
    { href: '#services', label: 'Services' },
    { href: '#projects', label: 'Projects' },
    { href: '#proof', label: 'Trust proof' },
    { href: '#domain', label: 'Domain' },
    { href: '#content', label: 'Content assets' },
    { href: '#timeline', label: 'Timeline & budget' },
    { href: '#decision', label: 'Build decision' },
    { href: '#resources', label: 'References' },
  ];

  const criticalRemaining = criticalTotal - criticalAnswered;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={visualsHidden ? 'bayview-guide hide-animated-examples' : 'bayview-guide'}>
      <div className="top-progress" aria-hidden="true">
        <span style={{ width: scrollPct + '%' }} />
      </div>

      <header className="hero">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=82"
          alt="Premium contemporary residential architecture"
        />
        <div className="hero-inner">
          <span className="eyebrow">Bayview Corp website guide</span>
          <h1>Further questions for Bayview Corp's website plan.</h1>
          <p className="hero-copy">
            This guide is based on your brief. It shows what you have already confirmed, what is still missing, and
            explains each remaining question in plain language with examples. Work through it at your own pace and write
            your answers directly under each question.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#brief-summary">Start with the brief</a>
            <a className="btn" href="https://www.pierceproperty.com.au/" target="_blank" rel="noreferrer">View reference website</a>
          </div>
        </div>
      </header>

      <main className="page-shell">
        <aside className="guide-nav" aria-label="Bayview guide navigation">
          <div className="guide-nav-header">
            <span className="guide-nav-title">Your progress</span>
            <div className="answer-meter">
              <strong>{answeredCount} of {totalQ} answered</strong>
              <div className="meter-track" aria-hidden="true">
                <div className="meter-fill" style={{ width: (totalQ ? Math.round((answeredCount / totalQ) * 100) : 0) + '%' }} />
              </div>
            </div>
            {criticalRemaining > 0 && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#856404', background: '#fff3cd', padding: '4px 8px', borderRadius: '4px' }}>
                {criticalRemaining} critical answer{criticalRemaining !== 1 ? 's' : ''} still needed
              </div>
            )}
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
            <button type="button" aria-pressed={visualsHidden} onClick={() => setVisualsHidden(!visualsHidden)}>{visualsHidden ? 'Show animated examples' : 'Hide animated examples'}</button>
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

          {/* Brief summary panel */}
          <section className="intro-panel" id="brief-summary" data-section="true">
            <div className="intro-grid">
              <div>
                <h2>What your brief already tells us</h2>
                <p>
                  Bayview Corp needs a premium, modern, clean website for a boutique property development company.
                  The first site should build visibility and trust, include Home, About, Services or Market Focus,
                  Projects, and Contact, and use a contact form for enquiries.
                </p>
                <p>
                  The scope decision is clear: a polished marketing website, with the Projects section editable
                  through a private editing screen. That gives you control over project updates without adding
                  unnecessary complexity.
                </p>

                {/* Brief confirmation table */}
                <div className="brief-confirmation" role="region" aria-label="Brief confirmation answers" tabIndex={0} style={{ margin: '20px 0', fontSize: '14px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fffbf0', border: '1px solid #ded3bd', borderRadius: '8px' }}>
                    <thead>
                      <tr style={{ background: '#183452' }}>
                        <th style={{ padding: '10px 12px', color: 'white', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', textAlign: 'left' }}>What you told us</th>
                        <th style={{ padding: '10px 12px', color: 'white', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', textAlign: 'left' }}>Your answer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Business name', 'Bayview Corp'],
                        ['Industry', 'Boutique property development'],
                        ['Primary goal', 'Build visibility and establish trust in the market'],
                        ['Reference website', 'pierceproperty.com.au'],
                        ['Target audience', 'Property owners / landowners, and property buyers'],
                        ['Pages needed', 'Home, About, Services / Market Focus, Projects, Contact'],
                        ['Contact method', 'Contact form'],
                        ['Look and feel', 'Premium, modern, clean'],
                        ['Content management', 'Projects section to be editable'],
                      ].map(([label, value]) => (
                        <tr key={label} style={{ borderBottom: '1px solid #ded3bd' }}>
                          <td style={{ padding: '10px 12px', color: '#5f6570', verticalAlign: 'top' }}>{label}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 500, verticalAlign: 'top' }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="quick-strip">
                  <div className="quick-card">
                    <strong>Website type</strong>
                    <span>Polished marketing website</span>
                  </div>
                  <div className="quick-card">
                    <strong>Editable area</strong>
                    <span>Projects section</span>
                  </div>
                  <div className="quick-card">
                    <strong>Platform</strong>
                    <span>Website + Projects CMS</span>
                  </div>
                </div>
              </div>
              <figure className="image-card">
                <img
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=82"
                  alt="Modern luxury residential interior"
                />
                <figcaption>
                  The site should feel premium — but the content still needs concrete proof: services, market focus,
                  experience, and real projects.
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
            <h2>Recommended build decision</h2>
            <p>
              Bayview does not need a complex internal system for this first version. A polished marketing website
              with a controlled Projects editor is the simpler and more suitable option.
            </p>
            <div className="decision-grid">
              <div className="decision-card">
                <strong>Build now</strong>
                <p>Home, About, Services or Market Focus, Projects, Contact, and a private editing screen for Projects.</p>
              </div>
              <div className="decision-card">
                <strong>Keep launch simple</strong>
                <p>The first version focuses on trust, services, projects, contact, and a clear path for future updates.</p>
              </div>
              <div className="decision-card">
                <strong>Add project editing</strong>
                <p>You get a private editing screen where you can create, update, hide, and delete project entries — no coding required.</p>
              </div>
            </div>
            <table className="comparison">
              <thead>
                <tr><th>Decision</th><th>Recommendation</th><th>Plain-English reason</th></tr>
              </thead>
              <tbody>
                <tr><td>Internal management system</td><td>Do not build now</td><td>Bayview only needs a public website and project updates at this stage.</td></tr>
                <tr><td>Project editing</td><td>Private Projects editor</td><td>You can add, edit, publish, unpublish, and delete project content without touching code.</td></tr>
                <tr><td>Contact form</td><td>Send enquiries to the right inbox</td><td>Website visitors can send enquiries without needing to know personal contact details.</td></tr>
                <tr><td>Domain</td><td>Register with your business details</td><td>The business should own the .com.au domain and receive renewal notices directly.</td></tr>
              </tbody>
            </table>
          </section>

          {/* Resources */}
          <section className="resource-panel" id="resources" data-section="true">
            <h2>Helpful references</h2>
            <p>These are included because they relate directly to Bayview's content, visual direction, or domain decision.</p>
            <div className="resource-grid">
              <a className="resource-link" href="https://www.pierceproperty.com.au/" target="_blank" rel="noreferrer">
                <strong>Pierce Property</strong>
                <span>Your visual reference for a premium property website.</span>
              </a>
              <a className="resource-link" href="https://www.vincomm.com.au/" target="_blank" rel="noreferrer">
                <strong>Vin Commercial</strong>
                <span>Existing public business presence and proof signals.</span>
              </a>
              <a className="resource-link" href="https://www.auda.org.au/au-domain-names/the-different-au-domain-names/com-au-domain-names/" target="_blank" rel="noreferrer">
                <strong>auDA .com.au guidance</strong>
                <span>Eligibility requirements for Australian business domains.</span>
              </a>
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
        <button type="button" onClick={() => openSummary(buildHtmlSummary(answers, checked, buildTextSummary(answers, checked, submitterEmail), submitterEmail), buildTextSummary(answers, checked, submitterEmail))} style={BTN}>Print / Save PDF</button>
        <button type="button" disabled={submitting} onClick={() => setModalOpen(true)} style={BTN_PRIMARY}>Submit answers</button>
      </div>

      {/* Submit modal */}
      {modalOpen && (
        <div className="guide-modal-overlay open" role="dialog" aria-modal="true" aria-labelledby="guide-submit-heading" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="guide-modal">
            <h2 id="guide-submit-heading">Ready to submit?</h2>
            <p>
              Your answers will be saved for authorised review. A printable or downloaded
              Bayview website planning summary is available for your records.
            </p>
            <label htmlFor="guideSubmitterEmail">
              Your email address{' '}
              <span style={{ fontWeight: 400, color: '#5f6570' }}>(optional — for follow-up)</span>
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
              <button type="button" onClick={() => setModalOpen(false)}>Go back and check</button>
            </div>
            <p className="privacy-note">
              Drafts stay in this browser; submitted answers are stored in the project database.
              No email is sent automatically.
            </p>
          </div>
        </div>
      )}

      <Toast message={toast} />

      {/* Inline styles for Bayview-specific elements */}
      <style>{`
        .brief-status {
          display: inline-block;
          margin: 8px 0 4px;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .brief-status.confirmed { background: #d1e7dd; color: #0a3622; }
        .brief-status.partial   { background: #fff3cd; color: #856404; }
        .brief-status.missing   { background: #f8d7da; color: #842029; }
        .answer-hint {
          margin: 8px 0 0;
          padding: 8px 12px;
          background: #f0f4ff;
          border-left: 3px solid #6985c8;
          border-radius: 0 4px 4px 0;
          font-size: 13px;
          color: #3a4a7a;
        }
        .answer-hint strong { display: block; margin-bottom: 2px; }
        .visual-card:hover .gif-expand-hint { opacity: 1 !important; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
