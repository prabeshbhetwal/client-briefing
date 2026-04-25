import { useState, useEffect, useRef, useCallback } from "react";
import "../home.css";

/* ─────────────────────────────────────────
   VISUAL AIDS — one per question
   Types: 'photo' | 'gif' | 'svg'
   Photos → Unsplash (seed-locked for consistency)
   GIFs   → Tenor/Giphy public media CDN URLs
   SVGs   → inline markup string
───────────────────────────────────────── */
const VISUALS = {
  /* ── Section A ── */
  A1: {
    type: "gif",
    src: "https://media.tenor.com/GfSX-u7VGM4AAAAC/dog-shiba.gif",
    caption:
      "Your business name is the first thing visitors see — make sure it is the one you are proud of.",
  },
  A2: {
    type: "gif",
    src: "https://media.tenor.com/kSTCkCGlRdUAAAAC/talking-explain.gif",
    caption:
      "Think of this like explaining your business to a friend at dinner — plain English, no jargon.",
  },
  A3: {
    type: "gif",
    src: "https://media.tenor.com/arTqBBQz17kAAAAC/focus-target.gif",
    caption:
      "Your website has one job right now. Everything else is secondary.",
  },
  A4: {
    type: "gif",
    src: "https://media.tenor.com/vX6cFDCvx3IAAAAC/web-design-website.gif",
    caption:
      "A reference website gives us instant visual shorthand — no lengthy descriptions needed.",
  },

  /* ── Section B ── */
  B1: {
    type: "gif",
    src: "https://media.tenor.com/GKBdXODkZ0QAAAAC/crowd-people.gif",
    caption:
      "Your website speaks to different groups — but not all of them equally.",
  },
  B2: {
    type: "gif",
    src: "https://media.tenor.com/pOgWkdmk-CMAAAAC/target-focus.gif",
    caption: "One primary audience. Design everything around them first.",
  },
  B3: {
    type: "gif",
    src: "https://media.tenor.com/6Xl8mKu6fBYAAAAC/thinking-person.gif",
    caption:
      "What question does your visitor arrive with? Answer it before they even ask.",
  },
  B4: {
    type: "gif",
    src: "https://media.tenor.com/SooOa3fpYbsAAAAC/success-win.gif",
    caption:
      'A "good visit" ends with action — a call, a bookmark, a referral.',
  },

  /* ── Section C ── */
  C1: {
    type: "gif",
    src: "https://media.tenor.com/OYQ6TSQk1h4AAAAC/goal-score.gif",
    caption:
      "Success looks different for every business. Define yours before we build anything.",
  },
  C2: {
    type: "gif",
    src: "https://media.tenor.com/7eDFh7OY-38AAAAC/priority-list.gif",
    caption:
      "Rank your goals — what matters most drives every design decision.",
  },
  C3: {
    type: "gif",
    src: "https://media.tenor.com/vRfNMZJPGkEAAAAC/cta-button-click.gif",
    caption:
      "One clear call-to-action. Make it obvious. Make it easy. Everything else supports it.",
  },

  /* ── Section D ── */
  D_home: {
    type: "gif",
    src: "https://media.tenor.com/WS3oX3-XGpYAAAAC/website-web-design.gif",
    caption:
      "The home page: your digital front door. First impression. Hero shot. Clear headline.",
  },
  D_about: {
    type: "gif",
    src: "https://media.tenor.com/sRSBrohv6CMAAAAC/team-work-together.gif",
    caption:
      "The About page builds trust. Who you are, how long you've operated, why you exist.",
  },
  D_projects: {
    type: "gif",
    src: "https://media.tenor.com/xk85M3MwzMEAAAAC/portfolio-design.gif",
    caption:
      "A portfolio / projects page lets your work speak for itself. Show, don't tell.",
  },
  D_contact: {
    type: "gif",
    src: "https://media.tenor.com/bGhbV3-A4VIAAAAC/contact-us-email.gif",
    caption:
      "The contact page is where intent becomes action. Make it effortless.",
  },
  D_other: {
    type: "gif",
    src: "https://media.tenor.com/FBBqoOiwfvIAAAAC/building-blocks-blocks.gif",
    caption:
      "Think in building blocks. Start with what you need now, add more as you grow.",
  },

  /* ── Section E ── */
  E1: {
    type: "gif",
    src: "https://media.tenor.com/bHPFGKFBgpEAAAAC/rocket-launch.gif",
    caption:
      "These are seeds, not commitments. Plant them now so the foundation supports them later.",
  },
  E2: {
    type: "gif",
    src: "https://media.tenor.com/qLRCTKPqJT4AAAAC/inspiration-ideas.gif",
    caption:
      "Inspiration is everywhere. Screenshot it, bookmark it, paste the link here.",
  },

  /* ── Section F ── */
  F1: {
    type: "gif",
    src: "https://media.tenor.com/6Rg7BWDOISMAAAAC/design-creative.gif",
    caption:
      "Feeling is design. These words shape every colour, font, and layout choice.",
  },
  F2: {
    type: "gif",
    src: "https://media.tenor.com/x0ltFGKSjm0AAAAC/browsing-internet.gif",
    caption:
      "A URL is worth a thousand words. Paste any site you admire and we'll decode the vibe.",
  },
  F3: {
    type: "gif",
    src: "https://media.tenor.com/Hu-VlIjUgKEAAAAC/no-never.gif",
    caption: "Hard no's are just as useful as yes's. Don't hold back here.",
  },
  F4_tone: {
    type: "gif",
    src: "https://media.tenor.com/7QCijMrIGsIAAAAC/color-palette-colors.gif",
    caption: "Colour tone sets the emotional register of your entire site.",
  },
  F4_balance: {
    type: "gif",
    src: "https://media.tenor.com/lFLyJdE2gWoAAAAC/photo-layout-design.gif",
    caption: "Photo-led vs text-led: both work, but for different goals.",
  },
  F4_structure: {
    type: "gif",
    src: "https://media.tenor.com/YNdXFuqGa78AAAAC/scroll-website.gif",
    caption:
      "Single-page scrolling vs multi-page: different experiences, different goals.",
  },
  F5: {
    type: "gif",
    src: "https://media.tenor.com/1MBR-6fPHg4AAAAC/colors-colour.gif",
    caption:
      "Colour communicates trust, personality, and industry before a visitor reads a word.",
  },

  /* ── Section G ── */
  G1: {
    type: "gif",
    src: "https://media.tenor.com/N_wgp_MCHMgAAAAC/checklist-check.gif",
    caption:
      "Every asset you already have saves time and money. Tick what's ready.",
  },
  G2: {
    type: "gif",
    src: "https://media.tenor.com/JEW_jqcHsKkAAAAC/domain-internet.gif",
    caption:
      "Your domain name is your permanent address on the internet. It matters.",
  },
  G3: {
    type: "gif",
    src: "https://media.tenor.com/3QqJVRgSS8EAAAAC/phone-calling.gif",
    caption:
      "How visitors reach you shapes how many actually do. More options = more conversions.",
  },
  G4: {
    type: "gif",
    src: "https://media.tenor.com/iyRMWX1h2bkAAAAC/social-media-icons.gif",
    caption:
      "Social links extend your digital presence and build trust through visibility.",
  },

  /* ── Section H ── */
  H1: {
    type: "gif",
    src: "https://media.tenor.com/svMllRU3LQIAAAAC/questions-ask.gif",
    caption:
      "There are no stupid questions. The more you ask now, the fewer surprises later.",
  },
  H2: {
    type: "gif",
    src: "https://media.tenor.com/MGWN1bPWjacAAAAC/worried-nervous.gif",
    caption:
      "Concerns are completely normal. Write them down and we'll address every one.",
  },
  H3: {
    type: "gif",
    src: "https://media.tenor.com/zp_sHuvNm1IAAAAC/no-thanks.gif",
    caption:
      "Hard limits protect you and save everyone time. Be as specific as you like.",
  },
  H4: {
    type: "gif",
    src: "https://media.tenor.com/nKJKBrQkiDYAAAAC/thinking-last-thoughts.gif",
    caption:
      "Final thoughts often contain the most important things. Don't hold back.",
  },
};

/* ─────────────────────────────────────────
   CONFIG
───────────────────────────────────────── */
const CONFIG = {
  developerName: "Prabesh Bhetwal",
  emailjs_public_key: "fKgFK2YwaZ4q2H_8R",
  emailjs_service_id: "personalprojects",
  emailjs_template_id: "projects_template",
  formspree_endpoint: "https://formspree.io/f/mykbowbn",
};

const SAVE_KEY = "website_brief_v2";

/* ─────────────────────────────────────────
   INITIAL FORM
───────────────────────────────────────── */
const INITIAL_FORM = {
  A1_Business_Name: "",
  A2_Business_Description: "",
  A3_Primary_Goal: "",
  A4_Reference_Website: "",
  "B1_Audience[]": [],
  B1_Audience_Other: "",
  B2_Primary_Audience: "",
  B3_Visitor_Intent: "",
  B4_Visitor_Outcome: "",
  C1_Success_Definition: "",
  C2_Goal_Professional: false,
  C2_Priority_Professional: "",
  C2_Goal_Projects: false,
  C2_Priority_Projects: "",
  C2_Goal_Attract: false,
  C2_Priority_Attract: "",
  C2_Goal_Contact: false,
  C2_Priority_Contact: "",
  C2_Goal_Credibility: false,
  C2_Priority_Credibility: "",
  C2_Goal_Other: false,
  C2_Priority_Other: "",
  C2_Other_Goal_Detail: "",
  C3_Call_To_Action: "",
  D1_Home_When: "",
  D1_Home_Have: "",
  D1_Home_Need: "",
  D2_About_When: "",
  D2_About_Have: "",
  D2_About_Need: "",
  D3_Projects_When: "",
  D3_Projects_Have: "",
  D3_Projects_Need: "",
  D3_Projects_Count: "",
  D4_Contact_When: "",
  D4_Contact_Details: "",
  D5_Other_Pages: "",
  "E1_Future[]": [],
  E2_Future_Ideas: "",
  "F1_Feel[]": [],
  F1_Feel_Other: "",
  F2_Liked_Sites: "",
  "F3_Dislikes[]": [],
  F3_Dislikes_Other: "",
  F4_Tone: "",
  F4_Balance: "",
  F4_Structure: "",
  F5_Colours: "",
  "G1_Have[]": [],
  G2_Domain: "",
  G2_Domain_Name: "",
  "G3_Contact_Methods[]": [],
  G3_Contact_Details: "",
  G4_Social_Media: "",
  H1_Questions: "",
  H2_Concerns: "",
  H3_Definitely_Not: "",
  H4_Anything_Else: "",
};

/* ─────────────────────────────────────────
   SECTION METADATA
───────────────────────────────────────── */
const SECTIONS = [
  { id: 'A', label: 'Overview',    title: 'Quick Overview',                  subtitle: 'A few warm-up questions to set the scene.',       emoji: '🏛️', banner: 'banner-a', color: '#2e4070' },
  { id: 'B', label: 'Audience',    title: 'Who This Website Is For',          subtitle: 'Understanding your visitors shapes everything.',   emoji: '🎯', banner: 'banner-b', color: '#1b6ca8' },
  { id: 'C', label: 'Goals',       title: 'What the Website Should Achieve',  subtitle: 'Your goals for the next six to twelve months.',    emoji: '📈', banner: 'banner-c', color: '#3d6b2e' },
  { id: 'D', label: 'Pages',       title: 'The First Version of the Website', subtitle: 'Which pages and content do you need at launch?',   emoji: '🗂️', banner: 'banner-d', color: '#7a5230' },
  { id: 'E', label: 'Future',      title: 'Future Plans',                     subtitle: 'Dreaming a little — no commitment needed.',        emoji: '🔭', banner: 'banner-e', color: '#2d6080' },
  { id: 'F', label: 'Look & Feel', title: 'Look and Feel',                    subtitle: 'How you want the website to look and present.',    emoji: '✦',  banner: 'banner-f', color: '#6b2d80' },
  { id: 'G', label: 'Practical',   title: 'Practical Details',                subtitle: 'The basics we need to get started straight away.', emoji: '⚙️', banner: 'banner-g', color: '#2d806b' },
  { id: 'H', label: 'Q & A',       title: 'Your Questions and Concerns',      subtitle: 'An open space — write anything on your mind.',     emoji: '💡', banner: 'banner-h', color: '#80352d' },
];

/* ─────────────────────────────────────────
   TIPS (inline guide context per question)
───────────────────────────────────────── */
const TIPS = {
  A1: {
    heading: "Your business name",
    body: "This is how we'll refer to your project throughout the brief and in all communications. It can be a registered company name, a trading name, or just a project name — whichever feels most natural.",
    examples: [],
  },
  A2: {
    heading: "Elevator pitch",
    body: "The clearest briefing we can give a designer is a simple, honest description of what you do in plain English. You're not writing a marketing tagline — just talking to a friend at dinner.",
    examples: [
      "We build residential apartments in inner Melbourne and sell off-the-plan.",
      "I run a boutique accounting firm that works exclusively with small business owners.",
    ],
  },
  A3: {
    heading: "The one thing your website must do right now",
    body: "A lot of websites try to do too many things at once and end up doing none of them well. Think about the single most valuable outcome your website could deliver at this stage of your business.",
    examples: [
      "Help investors see our projects and contact us easily.",
      "Make us look professional so people take us seriously when they Google us.",
    ],
  },
  A4: {
    heading: "Reference websites",
    body: "A reference site is just visual shorthand. It saves dozens of back-and-forth conversations about style. You're not asking us to copy it — just saying 'this type of feel'.",
    examples: [
      "A competitor in your industry whose website you admire.",
      "Any brand website whose look and tone matches what you want.",
    ],
  },
  B1: {
    heading: "Who will actually visit your site?",
    body: "Different visitors want different things. A potential client wants proof you're credible. An investor wants financial confidence. Knowing who's most likely to land on your site helps us design the right first impression.",
    examples: [],
  },
  B2: {
    heading: "Your #1 visitor",
    body: "Even if your site will serve multiple groups, one group matters most right now. Designing for everyone often means designing for no-one. Pick the one group whose approval would mean the most to your business today.",
    examples: [
      "Off-the-plan buyers who find us via Google.",
      "Business partners who've been referred to us and want to verify we're legit.",
    ],
  },
  B3: {
    heading: "What visitors are looking for",
    body: "Think of it like a job application — your site has about 8 seconds to answer the visitor's biggest question. If you know what that question is, we can put the answer front and centre.",
    examples: [
      "They want to see past work, understand what we offer, and know how to reach us.",
      "They want to know we're established, that other people trust us, and that we're easy to contact.",
    ],
  },
  B4: {
    heading: "The ideal outcome",
    body: "Success for a website visit isn't always a sale on the spot. Sometimes it's just a feeling — 'these people seem solid, I'll save this for when I'm ready.' Define what 'good' looks like for your visitors and we'll build toward it.",
    examples: [
      "They call us for a consultation.",
      "They feel confident enough to refer us to a colleague.",
      "They bookmark us and return when they're ready to buy.",
    ],
  },
  C1: {
    heading: "What does 'success' look like to you?",
    body: "Before we build anything, we want to understand how you'll judge whether this website was worth the investment. This might be measurable (more enquiries) or a feeling (I'm not embarrassed to hand out my card anymore).",
    examples: [
      "We're getting two to three enquiries a week within three months of launching.",
      "When I Google my own company, I'm not embarrassed by what comes up.",
    ],
  },
  C2: {
    heading: "Website goals — ranked",
    body: "Tick everything that matters, then rank them. Ranking forces you to be honest about what you actually care about most. It also helps us decide what to prioritise if trade-offs come up during the build.",
    examples: [],
  },
  C3: {
    heading: "The one action you most want visitors to take",
    body: "This is called a 'call to action' in web design. Every good website has one dominant CTA that's obvious and easy. Yours might be a phone call, a contact form, a brochure download — or something else entirely.",
    examples: [
      "Call us on 04XX XXX XXX.",
      "Complete an online enquiry form.",
      "Register your interest in the project.",
    ],
  },
  D: {
    heading: "Planning your pages",
    body: "Think of your website as a set of building blocks. Each page below is one block. Launching with the right blocks — not too few, not too many — is the difference between a clean, professional site and a sprawling, unfinished one.",
    examples: [
      "Most businesses launch with 3–4 pages and add more later once they know what's working.",
    ],
  },
  E: {
    heading: "Future-proofing your site",
    body: "Even if none of these features are for right now, knowing what might come next lets us build the foundation the right way. A site built for phase 1 only often needs expensive rework when phase 2 arrives.",
    examples: [
      "It's fine to tick everything. These are ideas, not commitments.",
    ],
  },
  F1: {
    heading: "The vibe — what feeling do you want to create?",
    body: "Think about how you feel walking into a beautifully designed display suite, office, or luxury store. That feeling is deliberate and entirely designed. Your website can create that same feeling digitally.",
    examples: [
      "A law firm might choose: professional, classic, trustworthy.",
      "A boutique developer might choose: premium, modern, minimal.",
    ],
  },
  F2: {
    heading: "Websites you admire",
    body: "Reference sites are pure gold for designers. Rather than describing a vague aesthetic, you can just say 'something like this.' The site doesn't have to be in your industry — it just has to have the feel you're after.",
    examples: [
      "www.squarespace.com/templates",
      "Any architect, property developer, or luxury brand whose site has the right energy.",
    ],
  },
  F3: {
    heading: "Things you definitely don't want",
    body: "Knowing what you hate is just as valuable as knowing what you love. It prevents wasted design time and makes sure you don't end up with something that embarrasses you.",
    examples: [],
  },
  F4: {
    heading: "Style preferences",
    body: "These three choices — colour tone, content balance, and site structure — make an enormous difference to how the final site looks and feels. There are no wrong answers, and you can always change your mind.",
    examples: [],
  },
  F5: {
    heading: "Colours",
    body: "If you already have brand colours, we'll use them. If not, a rough description like 'dark navy and gold' or 'earthy and warm' gives us enough to work from.",
    examples: [
      "Navy and gold — like a premium financial services firm.",
      "Earthy neutrals — warm, textured, architectural.",
      "Keep existing brand colours — I'll send you the hex codes.",
    ],
  },
  G1: {
    heading: "What you already have ready",
    body: "These are the assets we'll need to build your site. The more you have ready at the start, the faster and smoother the build. If you're missing something, don't worry — we'll flag it as we go.",
    examples: [],
  },
  G2: {
    heading: "Your domain name",
    body: "Your domain is your website address — e.g. yourbusiness.com.au. If you already own one, fantastic. If not, we'll help you register one. If you're not sure, we can check for you.",
    examples: [],
  },
  G3: {
    heading: "How people should reach you",
    body: "This is a practical but important decision. The contact methods you display tell visitors something about how you like to work. Some businesses want calls only. Others prefer email or a form. There's no wrong answer.",
    examples: [
      "A phone number is usually the best way to convert serious enquiries — it feels more personal.",
      "A contact form is useful if you get a lot of enquiries and want to triage them.",
    ],
  },
  H: {
    heading: "No question is too basic",
    body: "Clients who ask the most questions at the start end up with the best results. This section is entirely open — write whatever is on your mind. Concerns, confusion, ideas, even things you're embarrassed to ask.",
    examples: [],
  },
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────
   SHARED BRIEF DATA STRUCTURE
   Used by all three output builders
───────────────────────────────────────── */
const BRIEF_SECTIONS = [
  {
    key: "A",
    title: "Quick Overview",
    emoji: "🏢",
    fields: [
      { label: "Business Name", key: "A1_Business_Name" },
      { label: "What the business does", key: "A2_Business_Description" },
      { label: "Primary goal for the site", key: "A3_Primary_Goal" },
      { label: "Reference website(s)", key: "A4_Reference_Website" },
    ],
    devNote:
      "Hero section copy, nav logo text, meta title, and brand tone all derive from this section.",
  },
  {
    key: "B",
    title: "Target Audience",
    emoji: "👥",
    fields: [
      { label: "Who will visit", key: "B1_Audience[]" },
      { label: "Other audiences", key: "B1_Audience_Other" },
      { label: "Primary visitor type", key: "B2_Primary_Audience" },
      { label: "What visitors are looking for", key: "B3_Visitor_Intent" },
      { label: "Ideal visitor outcome", key: "B4_Visitor_Outcome" },
    ],
    devNote:
      "Drives above-the-fold messaging, CTA placement, trust signals, and social proof prioritisation.",
  },
  {
    key: "C",
    title: "Business Goals",
    emoji: "🎯",
    fields: [
      { label: "Success definition", key: "C1_Success_Definition" },
      {
        label: "Goal — Professionalism",
        key: "C2_Goal_Professional",
        isBool: true,
        priorityKey: "C2_Priority_Professional",
      },
      {
        label: "Goal — Showcase Projects",
        key: "C2_Goal_Projects",
        isBool: true,
        priorityKey: "C2_Priority_Projects",
      },
      {
        label: "Goal — Attract Clients",
        key: "C2_Goal_Attract",
        isBool: true,
        priorityKey: "C2_Priority_Attract",
      },
      {
        label: "Goal — Drive Contact",
        key: "C2_Goal_Contact",
        isBool: true,
        priorityKey: "C2_Priority_Contact",
      },
      {
        label: "Goal — Build Credibility",
        key: "C2_Goal_Credibility",
        isBool: true,
        priorityKey: "C2_Priority_Credibility",
      },
      { label: "Other goal detail", key: "C2_Other_Goal_Detail" },
      { label: "Primary call to action", key: "C3_Call_To_Action" },
    ],
    devNote:
      "Informs CTA button placement, nav structure, conversion copywriting, and analytics event tracking priorities.",
  },
  {
    key: "D",
    title: "Version 1 Pages",
    emoji: "📄",
    fields: [
      { label: "Home page — include?", key: "D1_Home_When" },
      { label: "Home — content ready", key: "D1_Home_Have" },
      { label: "Home — content needed", key: "D1_Home_Need" },
      { label: "About page — include?", key: "D2_About_When" },
      { label: "About — content ready", key: "D2_About_Have" },
      { label: "About — content needed", key: "D2_About_Need" },
      { label: "Projects page — include?", key: "D3_Projects_When" },
      { label: "Projects — content ready", key: "D3_Projects_Have" },
      { label: "Projects — content needed", key: "D3_Projects_Need" },
      { label: "Number of projects to show", key: "D3_Projects_Count" },
      { label: "Contact page — include?", key: "D4_Contact_When" },
      { label: "Contact — details", key: "D4_Contact_Details" },
      { label: "Other pages wanted", key: "D5_Other_Pages" },
    ],
    devNote:
      "Defines sitemap, routing structure, CMS content requirements, and placeholder strategy for missing assets.",
  },
  {
    key: "E",
    title: "Future Plans",
    emoji: "🚀",
    fields: [
      { label: "Future features", key: "E1_Future[]" },
      { label: "Future ideas", key: "E2_Future_Ideas" },
    ],
    devNote:
      "Informs architecture decisions — database, auth, CMS flexibility, and component modularity for future features.",
  },
  {
    key: "F",
    title: "Look and Feel",
    emoji: "🎨",
    fields: [
      { label: "Desired feeling/vibe", key: "F1_Feel[]" },
      { label: "Other vibe notes", key: "F1_Feel_Other" },
      { label: "Websites admired", key: "F2_Liked_Sites" },
      { label: "Definite dislikes", key: "F3_Dislikes[]" },
      { label: "Other dislike notes", key: "F3_Dislikes_Other" },
      { label: "Colour tone preference", key: "F4_Tone" },
      { label: "Content/image balance", key: "F4_Balance" },
      { label: "Layout structure", key: "F4_Structure" },
      { label: "Brand colours", key: "F5_Colours" },
    ],
    devNote:
      "Primary input for design tokens (colour palette, typography scale, spacing), component style, and Tailwind/CSS config.",
  },
  {
    key: "G",
    title: "Practical Details",
    emoji: "🔧",
    fields: [
      { label: "Assets already available", key: "G1_Have[]" },
      { label: "Has a domain", key: "G2_Domain" },
      { label: "Domain name", key: "G2_Domain_Name" },
      { label: "Preferred contact methods", key: "G3_Contact_Methods[]" },
      { label: "Contact details", key: "G3_Contact_Details" },
      { label: "Social media handles", key: "G4_Social_Media" },
    ],
    devNote:
      "Determines DNS setup, asset pipeline, contact form configuration, social link placement, and footer content.",
  },
  {
    key: "H",
    title: "Questions & Concerns",
    emoji: "💬",
    fields: [
      { label: "Questions for the team", key: "H1_Questions" },
      { label: "Concerns", key: "H2_Concerns" },
      { label: "Must NOT include", key: "H3_Definitely_Not" },
      { label: "Anything else", key: "H4_Anything_Else" },
    ],
    devNote:
      'Review all entries here before scoping. Constraints in H3 ("Definitely Not") override any design assumptions.',
  },
];

function getVal(data, key) {
  const v = data[key];
  if (Array.isArray(v)) return v.length > 0 ? v.join(", ") : "";
  if (typeof v === "boolean") return v ? "Yes" : "";
  return v ? String(v).trim() : "";
}

/* ─────────────────────────────────────────
   OUTPUT 1 — CLIENT EMAIL (styled HTML)
   Sent to the client's own address
───────────────────────────────────────── */
function buildClientEmailHTML(data, senderEmail) {
  const clientName = (data.A1_Business_Name || "").trim();
  const date = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const sectionRows = BRIEF_SECTIONS.map((sec) => {
    const rows = sec.fields
      .map((f) => {
        let val = "";
        if (f.isBool) {
          if (!data[f.key]) return "";
          const priority = getVal(data, f.priorityKey);
          val = priority ? `Yes &nbsp;·&nbsp; Priority: ${priority}` : "Yes";
        } else {
          val = getVal(data, f.key);
          if (!val) return "";
          val = val
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>");
        }
        return `
        <tr>
          <td style="padding:10px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0ede6;white-space:nowrap;vertical-align:top;width:38%;">${f.label}</td>
          <td style="padding:10px 16px;font-size:14px;color:#1b2b4b;border-bottom:1px solid #f0ede6;vertical-align:top;">${val}</td>
        </tr>`;
      })
      .filter(Boolean)
      .join("");

    if (!rows) return "";

    return `
      <div style="margin-bottom:32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:10px;overflow:hidden;border:1.5px solid #e5e0d5;">
          <thead>
            <tr>
              <td colspan="2" style="background:linear-gradient(135deg,#1b2b4b 0%,#2e4070 100%);padding:14px 16px;">
                <span style="font-size:15px;font-weight:700;color:#b8962b;letter-spacing:0.04em;">${sec.emoji}&nbsp; ${sec.key} — ${sec.title}</span>
              </td>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>`;
  })
    .filter(Boolean)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your Website Brief</title></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1b2b4b 0%,#0f1e35 100%);border-radius:12px 12px 0 0;padding:40px 36px 32px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#b8962b;"> </p>
          <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.25;">Your Website Brief</h1>
          ${clientName ? `<p style="margin:0 0 16px;font-size:17px;color:rgba(255,255,255,0.75);">${clientName}</p>` : ""}
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);">Submitted ${date}${senderEmail ? " &nbsp;·&nbsp; " + senderEmail : ""}</p>
        </td></tr>

        <!-- Intro -->
        <tr><td style="background:#ffffff;padding:28px 36px 20px;border-left:1.5px solid #e5e0d5;border-right:1.5px solid #e5e0d5;">
          <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">
            Thank you for completing your website brief. Below is a summary of your answers exactly as you submitted them.
            Keep this as a reference throughout our project — if anything needs updating, just let us know.
          </p>
        </td></tr>

        <!-- Sections -->
        <tr><td style="background:#ffffff;padding:8px 36px 32px;border-left:1.5px solid #e5e0d5;border-right:1.5px solid #e5e0d5;">
          ${sectionRows}
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#1b2b4b;border-radius:0 0 12px 12px;padding:24px 36px;">
          <p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.6);">Questions? Reply to this email or reach out directly.</p>
          <p style="margin:0;font-size:13px;font-weight:600;color:#b8962b;">VinComm Web Studio &nbsp;·&nbsp; vincomm.com.au</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─────────────────────────────────────────
   OUTPUT 2 — DEVELOPER EMAIL (styled HTML + Markdown)
   Sent to jarvis.pc13@gmail.com
───────────────────────────────────────── */
function buildDeveloperEmailHTML(data, senderEmail) {
  const clientName = (data.A1_Business_Name || "").trim();
  const date = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const markdown = buildMarkdownBrief(data, senderEmail);

  const sectionRows = BRIEF_SECTIONS.map((sec) => {
    const rows = sec.fields
      .map((f) => {
        let val = "";
        if (f.isBool) {
          if (!data[f.key]) return "";
          const priority = getVal(data, f.priorityKey);
          val = priority ? `Yes &nbsp;·&nbsp; Priority: ${priority}` : "Yes";
        } else {
          val = getVal(data, f.key);
          if (!val) return "";
          val = val
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>");
        }
        return `
        <tr>
          <td style="padding:9px 14px;font-size:12px;color:#6b7280;border-bottom:1px solid #f0ede6;white-space:nowrap;vertical-align:top;width:36%;">${f.label}</td>
          <td style="padding:9px 14px;font-size:13px;color:#1b2b4b;border-bottom:1px solid #f0ede6;vertical-align:top;">${val}</td>
        </tr>`;
      })
      .filter(Boolean)
      .join("");

    if (!rows) return "";

    return `
      <div style="margin-bottom:28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:8px;overflow:hidden;border:1.5px solid #e5e0d5;">
          <thead>
            <tr>
              <td colspan="2" style="background:linear-gradient(135deg,#1b2b4b 0%,#2e4070 100%);padding:12px 14px;">
                <span style="font-size:13px;font-weight:700;color:#b8962b;">${sec.emoji} ${sec.key} — ${sec.title}</span>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="background:#fffbf0;padding:9px 14px;border-bottom:1px solid #e8e0cc;">
                <span style="font-size:12px;color:#7a6030;line-height:1.5;">📐 <strong>Dev note:</strong> ${sec.devNote}</span>
              </td>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  })
    .filter(Boolean)
    .join("");

  const mdEscaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Brief — Dev View</title></head>
<body style="margin:0;padding:0;background:#f0ede6;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede6;padding:32px 16px;">
    <tr><td align="center">
      <table width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:100%;">

        <!-- Dev header -->
        <tr><td style="background:linear-gradient(135deg,#0f1e35 0%,#1b2b4b 100%);border-radius:12px 12px 0 0;padding:32px 36px 28px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#b8962b;">Developer Copy · VinComm</p>
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;">New Brief Submission</h1>
          ${clientName ? `<p style="margin:0 0 12px;font-size:16px;color:rgba(255,255,255,0.7);">Client: ${clientName}</p>` : ""}
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.45);">${date}${senderEmail ? " &nbsp;·&nbsp; " + senderEmail : ""}</p>
        </td></tr>

        <!-- Sections with dev notes -->
        <tr><td style="background:#ffffff;padding:28px 36px 32px;border-left:1.5px solid #e5e0d5;border-right:1.5px solid #e5e0d5;">
          ${sectionRows}
        </td></tr>

        <!-- Markdown block -->
        <tr><td style="background:#0f1e35;padding:28px 36px;border-left:1.5px solid #0a1525;border-right:1.5px solid #0a1525;">
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#b8962b;">Machine-Readable Format (Markdown)</p>
          <p style="margin:0 0 14px;font-size:12px;color:rgba(255,255,255,0.5);">Copy the block below to pass directly to Claude, Claude Code, or any LLM.</p>
          <pre style="margin:0;padding:20px;background:#070f1c;border-radius:8px;font-family:'SF Mono','Fira Code',monospace;font-size:11.5px;color:#e2e8f0;white-space:pre-wrap;word-break:break-word;line-height:1.65;border:1px solid rgba(255,255,255,0.08);">${mdEscaped}</pre>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#1b2b4b;border-radius:0 0 12px 12px;padding:20px 36px;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.5);">VinComm Web Studio &nbsp;·&nbsp; Developer briefing email &nbsp;·&nbsp; vincomm.com.au</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─────────────────────────────────────────
   OUTPUT 3 — MARKDOWN BRIEF
   Machine-readable, Claude/LLM-friendly
───────────────────────────────────────── */
function buildMarkdownBrief(data, senderEmail) {
  const clientName = (data.A1_Business_Name || "").trim();
  const date = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const lines = [];
  lines.push(`# Website Brief${clientName ? ` — ${clientName}` : ""}`);
  lines.push("");
  lines.push(`**Date:** ${date}`);
  if (senderEmail) lines.push(`**Client email:** ${senderEmail}`);
  lines.push(`**Prepared by:** VinComm Web Studio`);
  lines.push("");
  lines.push("---");
  lines.push("");

  BRIEF_SECTIONS.forEach((sec) => {
    const fieldLines = [];
    sec.fields.forEach((f) => {
      if (f.isBool) {
        if (!data[f.key]) return;
        const priority = getVal(data, f.priorityKey);
        fieldLines.push(
          `- **${f.label}:** Yes${priority ? ` (Priority: ${priority})` : ""}`,
        );
      } else {
        const val = getVal(data, f.key);
        if (!val) return;
        if (val.includes("\n")) {
          fieldLines.push(
            `- **${f.label}:**\n\n  ${val.replace(/\n/g, "\n  ")}`,
          );
        } else {
          fieldLines.push(`- **${f.label}:** ${val}`);
        }
      }
    });

    if (fieldLines.length === 0) return;

    lines.push(`## ${sec.emoji} ${sec.key} — ${sec.title}`);
    lines.push("");
    lines.push(...fieldLines);
    lines.push("");
    lines.push(`> **Dev note:** ${sec.devNote}`);
    lines.push("");
    lines.push("---");
    lines.push("");
  });

  lines.push("*End of brief*");
  return lines.join("\n");
}

/* Legacy plain-text kept for internal use */
function buildSummaryText(data, senderEmail) {
  return buildMarkdownBrief(data, senderEmail);
}

/* ─────────────────────────────────────────
   COMPLETION SCORING
───────────────────────────────────────── */
function calcCompletion(form) {
  const scored = [
    form.A1_Business_Name,
    form.A2_Business_Description,
    form.A3_Primary_Goal,
    (form["B1_Audience[]"] || []).length > 0,
    form.B2_Primary_Audience,
    form.B3_Visitor_Intent,
    form.C1_Success_Definition,
    form.C3_Call_To_Action,
    form.D1_Home_When,
    form.D2_About_When,
    form.D3_Projects_When,
    form.D4_Contact_When,
    form.F4_Tone,
    form.F4_Balance,
    form.G2_Domain,
    form.G3_Contact_Details,
  ];
  const filled = scored.filter((v) =>
    typeof v === "boolean" ? v : v && String(v).trim().length > 0,
  ).length;
  return Math.round((filled / scored.length) * 100);
}

/* ─────────────────────────────────────────
   CONFETTI (canvas)
───────────────────────────────────────── */
function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height * 0.5,
    r: 4 + Math.random() * 6,
    c: [
      "#b8962b",
      "#d0aa3a",
      "#1b2b4b",
      "#2e4070",
      "#fff",
      "#f5eed4",
      "#4a9eff",
    ][Math.floor(Math.random() * 7)],
    s: 1.5 + Math.random() * 3,
    a: Math.random() * Math.PI * 2,
    ar: (Math.random() - 0.5) * 0.15,
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.55);
      ctx.restore();
      p.y += p.s;
      p.a += p.ar;
    });
    frame++;
    if (frame < 200) requestAnimationFrame(draw);
    else canvas.remove();
  }
  draw();
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function TipPanel({ tipKey }) {
  const [open, setOpen] = useState(false);
  const tip = TIPS[tipKey];
  if (!tip) return null;
  return (
    <div style={{ marginBottom: "10px" }}>
      <button
        type="button"
        className="tip-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="tip-icon">{open ? "▴" : "?"}</span>
        {open ? "Hide tip" : "Why are we asking this?"}
      </button>
      {open && (
        <div className="tip-panel">
          <h4>💡 {tip.heading}</h4>
          <p>{tip.body}</p>
          {tip.examples.length > 0 && (
            <div className="tip-examples">
              {tip.examples.map((ex, i) => (
                <div key={i} className="tip-example-item">
                  {ex}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   VISUAL AID COMPONENT
   All entries are GIFs. Click thumbnail → full lightbox.
───────────────────────────────────────── */
function VisualAid({ visKey }) {
  const [lightbox, setLightbox] = useState(false);
  const v = VISUALS[visKey];
  if (!v) return null;

  return (
    <>
      <div
        className="visual-aid"
        onClick={() => setLightbox(true)}
        role="button"
        tabIndex={0}
        title="Click to enlarge"
        aria-label={`View full image: ${v.caption}`}
        onKeyDown={(e) => e.key === "Enter" && setLightbox(true)}
      >
        <div className="visual-aid-expand-hint">🔍 Click to enlarge</div>
        <img
          src={v.src}
          alt={v.caption}
          className="visual-aid-media gif"
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={(e) => {
            e.target.closest(".visual-aid").style.display = "none";
          }}
        />
        <div className="visual-aid-caption">{v.caption}</div>
      </div>

      {lightbox && (
        <div
          className="va-lightbox"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div
            className="va-lightbox-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="va-lightbox-close"
              onClick={() => setLightbox(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={v.src}
              alt={v.caption}
              className="va-lightbox-img"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="va-lightbox-caption">{v.caption}</div>
          </div>
        </div>
      )}
    </>
  );
}

function CheckItem({ id, name, value, label, sub, checked, onChange }) {
  return (
    <div className="c-item">
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>
        {label}
        {sub && <span className="sub">{sub}</span>}
      </label>
    </div>
  );
}

function RadioItem({ id, name, value, label, sub, checked, onChange }) {
  return (
    <div className="r-item">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>
        {label}
        {sub && <span className="sub">{sub}</span>}
      </label>
    </div>
  );
}

function WhenRadio({ name, value, onChange }) {
  return (
    <div className="when-radio">
      {["Include now", "Add later", "Not needed"].map((opt) => (
        <label key={opt}>
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

function GoalRow({
  label,
  small,
  checkValue,
  priorityValue,
  onCheck,
  onPriority,
}) {
  return (
    <div className="goal-row">
      <div className="goal-name">
        {label}
        <small>{small}</small>
      </div>
      <div className="goal-tick">
        <input
          type="checkbox"
          checked={checkValue}
          onChange={onCheck}
          title="Tick if relevant"
        />
      </div>
      <div className="goal-priority">
        <label>Priority:</label>
        <input
          type="number"
          min="1"
          max="6"
          placeholder="—"
          value={priorityValue}
          onChange={onPriority}
        />
      </div>
    </div>
  );
}

function Toast({ message, visible }) {
  return (
    <div
      className={`toast${visible ? " show" : ""}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

function SectionBanner({ section, stepNum, total }) {
  return (
    <div
      className={`section-banner ${section.banner}`}
      data-emoji={section.emoji}
    >
      <div className="step-label">
        Step {stepNum} of {total}
      </div>
      <h2>{section.title}</h2>
      <p>{section.subtitle}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Home() {
  const [form, setForm] = useState(() => {
    const saved = loadSaved();
    return saved ? { ...INITIAL_FORM, ...saved } : INITIAL_FORM;
  });
  const [step, setStep] = useState(0); // 0 = intro, 1–8 = sections A–H
  const [highestStep, setHighestStep] = useState(0); // furthest section visited
  const [animDir, setAnimDir] = useState("right"); // for slide direction
  const [saveStatus, setSaveStatus] = useState("saved");
  const [saveTime, setSaveTime] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });
  const saveTimer = useRef(null);
  const toastTimer = useRef(null);
  const emailjsReady = useRef(false);
  const sectionRef = useRef(null);

  const completion = calcCompletion(form);
  const today = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Init EmailJS
  useEffect(() => {
    if (CONFIG.emailjs_public_key && !emailjsReady.current) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
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

  // Restore saved — show timestamp toast once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const meta = localStorage.getItem(SAVE_KEY + "_meta");
      const savedAt = meta ? JSON.parse(meta).savedAt : null;
      const label = savedAt
        ? `Restored from ${new Date(savedAt).toLocaleString("en-AU", { weekday: "short", hour: "2-digit", minute: "2-digit" })}`
        : "Previous answers restored.";
      setTimeout(() => setToast({ message: label, visible: true }), 400);
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4200);
    } catch {
      /* ok */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = useCallback((msg) => {
    setToast({ message: msg, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      3500,
    );
  }, []);

  const triggerAutoSave = useCallback((newForm) => {
    setSaveStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        const now = new Date();
        localStorage.setItem(SAVE_KEY, JSON.stringify(newForm));
        localStorage.setItem(
          SAVE_KEY + "_meta",
          JSON.stringify({ savedAt: now.toISOString() }),
        );
        setSaveTime(
          now.toLocaleTimeString("en-AU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
        setSaveStatus("saved");
      } catch {
        /* ok */
      }
    }, 700);
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => {
        let updated;
        if (type === "checkbox" && name.endsWith("[]")) {
          const arr = prev[name] || [];
          updated = {
            ...prev,
            [name]: checked ? [...arr, value] : arr.filter((v) => v !== value),
          };
        } else if (type === "checkbox") {
          updated = { ...prev, [name]: checked };
        } else {
          updated = { ...prev, [name]: value };
        }
        triggerAutoSave(updated);
        return updated;
      });
    },
    [triggerAutoSave],
  );

  const isArrayChecked = (key, val) => (form[key] || []).includes(val);

  const goToStep = useCallback((newStep, dir = "right") => {
    setAnimDir(dir);
    setStep(newStep);
    setHighestStep((prev) => Math.max(prev, newStep));
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  }, []);

  const goNext = () => {
    if (step < SECTIONS.length) goToStep(step + 1, "right");
  };

  const goPrev = () => {
    if (step > 0) goToStep(step - 1, "left");
  };

  const clearAll = () => {
    if (
      !confirm(
        "Are you sure you want to clear all your answers? This cannot be undone.",
      )
    )
      return;
    setForm(INITIAL_FORM);
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SAVE_KEY + "_meta");
    setSaveStatus("saved");
    showToast("All answers have been cleared.");
  };

  /* ── Send client copy via EmailJS ── */
  const sendClientEmail = (toEmail) => {
    if (!emailjsReady.current || !window.emailjs) return;
    const clientName = (form.A1_Business_Name || "").trim();
    const html = buildClientEmailHTML(form, toEmail);
    window.emailjs
      .send(CONFIG.emailjs_service_id, CONFIG.emailjs_template_id, {
        to_email: toEmail,
        to_name: clientName || "there",
        developer_name: CONFIG.developerName,
        subject: `Your website brief${clientName ? " — " + clientName : ""}`,
        brief_text: html,
      })
      .then(() => {
        showToast(`Your summary has been sent to ${toEmail}`);
      })
      .catch((err) => console.warn("EmailJS client send failed:", err));
  };

  /* ── Send developer copy via EmailJS ── */
  const sendDeveloperEmail = () => {
    if (!emailjsReady.current || !window.emailjs) return;
    const clientName = (form.A1_Business_Name || "").trim();
    const senderEmail = submitterEmail.trim();
    const html = buildDeveloperEmailHTML(form, senderEmail);
    window.emailjs
      .send(CONFIG.emailjs_service_id, CONFIG.emailjs_template_id, {
        to_email: "jarvis.pc13@gmail.com",
        to_name: CONFIG.developerName,
        developer_name: CONFIG.developerName,
        subject: `[New Brief] ${clientName || "Website Brief"}${senderEmail ? " — " + senderEmail : ""}`,
        brief_text: html,
      })
      .catch((err) => console.warn("EmailJS developer send failed:", err));
  };

  /* ── Branded in-browser summary window ── */
  const openStyledSummaryWindow = (senderEmail, existingWin) => {
    const clientName = (form.A1_Business_Name || "").trim();
    const markdown = buildMarkdownBrief(form, senderEmail);
    const clientHTML = buildClientEmailHTML(form, senderEmail);
    const date = new Date().toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const w =
      existingWin ||
      window.open("", "_blank", "width=760,height=720,scrollbars=yes");
    if (!w) {
      navigator.clipboard
        ?.writeText(markdown)
        .then(() => showToast("Answers copied to clipboard."))
        .catch(() =>
          showToast("Could not open a new window. Please allow pop-ups."),
        );
      return;
    }

    const summaryPageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Website Brief${clientName ? " — " + clientName : ""}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f0e8;min-height:100vh;}
    .toolbar{position:sticky;top:0;z-index:100;background:#1b2b4b;padding:12px 24px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 12px rgba(0,0,0,0.3);}
    .toolbar-logo{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#b8962b;margin-right:auto;}
    .tb-btn{padding:7px 16px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:opacity 0.15s;}
    .tb-btn-print{background:#b8962b;color:#fff;}
    .tb-btn-copy{background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.25);}
    .tb-btn-tab{background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.25);}
    .tb-btn:hover{opacity:0.85;}
    .tabs{display:flex;gap:0;background:#fff;border-bottom:2px solid #e5e0d5;padding:0 24px;}
    .tab-btn{padding:13px 20px;font-size:13px;font-weight:600;color:#767676;cursor:pointer;background:none;border:none;border-bottom:2.5px solid transparent;margin-bottom:-2px;transition:color 0.15s,border-color 0.15s;}
    .tab-btn.active{color:#1b2b4b;border-bottom-color:#b8962b;}
    .tab-panel{display:none;padding:28px 24px;}
    .tab-panel.active{display:block;}
    .md-panel{background:#0f1e35;border-radius:10px;padding:24px;overflow-x:auto;}
    .md-panel pre{font-family:'SF Mono','Fira Code',Consolas,monospace;font-size:12.5px;color:#e2e8f0;white-space:pre-wrap;word-break:break-word;line-height:1.7;}
    .copy-confirm{display:none;color:#b8962b;font-size:12px;font-weight:600;margin-top:10px;}
    @media print{.toolbar,.tabs{display:none!important;}.tab-panel{display:block!important;padding:0;}.md-panel{display:none;}}
  </style>
</head>
<body>
  <div class="toolbar">
    <span class="toolbar-logo">VinComm Web Studio</span>
    <button class="tb-btn tb-btn-copy" id="copyMdBtn">📋 Copy Markdown</button>
    <button class="tb-btn tb-btn-print" onclick="window.print()">🖨 Print / PDF</button>
  </div>

  <div class="tabs">
    <button class="tab-btn active" onclick="showTab('client')">Client View</button>
    <button class="tab-btn" onclick="showTab('markdown')">Markdown</button>
  </div>

  <div id="tab-client" class="tab-panel active">
    ${clientHTML
      .replace(
        /<(!DOCTYPE|html|head[^e]|\/head|body|\/body|\/html)[^>]*>/gi,
        "",
      )
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<meta[^>]*>/gi, "")
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "")
      .trim()}
  </div>

  <div id="tab-markdown" class="tab-panel">
    <div class="md-panel">
      <pre id="mdContent">${markdown.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
    </div>
    <p class="copy-confirm" id="copyConfirm">✓ Copied to clipboard</p>
  </div>

  <script>
    function showTab(name) {
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('tab-' + name).classList.add('active');
      const btns = document.querySelectorAll('.tab-btn');
      btns[name === 'client' ? 0 : 1].classList.add('active');
    }
    document.getElementById('copyMdBtn').addEventListener('click', function() {
      const text = document.getElementById('mdContent').innerText;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          const c = document.getElementById('copyConfirm');
          c.style.display = 'block';
          setTimeout(() => { c.style.display = 'none'; }, 2500);
        });
      }
    });
  </script>
</body>
</html>`;

    const doc = w.document;
    doc.open();
    doc.write(summaryPageHTML);
    doc.close();
    showToast("Your brief summary is ready. Check the new window.");
  };

  const handleSubmit = async () => {
    const email = submitterEmail.trim();
    setModalOpen(false);

    // Open summary window early so browser doesn't block it as a pop-up
    const summaryWin = window.open(
      "",
      "_blank",
      "width=760,height=720,scrollbars=yes",
    );
    if (summaryWin) {
      summaryWin.document.write(
        `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preparing…</title></head><body style="font-family:sans-serif;padding:48px;background:#1b2b4b;color:rgba(255,255,255,0.7)"><p style="font-size:16px">Sending your answers — this window will update in a moment…</p></body></html>`,
      );
    }

    const fd = new FormData();
    const clientName = (form.A1_Business_Name || "").trim();
    fd.append(
      "_subject",
      `Website Brief${clientName ? " — " + clientName : ""}`,
    );
    if (email) fd.append("_replyto", email);

    Object.entries(form).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((v) => fd.append(key, v));
      } else if (typeof val === "boolean") {
        if (val) fd.append(key, "Yes");
      } else if (val) {
        fd.append(key, val);
      }
    });
    if (email) fd.append("Submitter_Email", email);

    try {
      const res = await fetch(CONFIG.formspree_endpoint, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setSubmitted(true);
        launchConfetti();
        // 1. Styled in-browser summary window
        openStyledSummaryWindow(email, summaryWin);
        // 2. Styled HTML client email
        if (email) sendClientEmail(email);
        // 3. Developer email (styled HTML + Markdown block)
        sendDeveloperEmail();
      } else {
        showToast("There was a problem sending. Please try printing instead.");
        if (summaryWin && !summaryWin.closed) summaryWin.close();
      }
    } catch {
      showToast("Could not connect. Please print your answers as a backup.");
      if (summaryWin && !summaryWin.closed) summaryWin.close();
    }
  };

  /* ── Section content renderers ── */

  const renderSectionA = () => (
    <div className="section-body">
      {/* A1 */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="a1">
              What is the name of your business or project?
            </label>
            <TipPanel tipKey="A1" />
            <input
              type="text"
              id="a1"
              name="A1_Business_Name"
              placeholder="e.g. Acme Trading Co."
              value={form.A1_Business_Name}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="A1" />
        </div>
      </div>
      <div className="divider" />
      {/* A2 */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="a2">
              In one or two sentences, how would you describe what your business
              does to a friend?
            </label>
            <span className="q-hint">
              Imagine you're at dinner and someone asks "So what does your
              company actually do?" — write your answer here.
            </span>
            <TipPanel tipKey="A2" />
            <textarea
              id="a2"
              name="A2_Business_Description"
              placeholder="Your answer here…"
              value={form.A2_Business_Description}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="A2" />
        </div>
      </div>
      <div className="divider" />
      {/* A3 */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="a3">
              In one or two sentences, what do you want this website to help you
              with right now?
            </label>
            <span className="q-hint">
              Think about the single most important problem the website should
              solve for you at this stage.
            </span>
            <TipPanel tipKey="A3" />
            <textarea
              id="a3"
              name="A3_Primary_Goal"
              placeholder="Your answer here…"
              value={form.A3_Primary_Goal}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="A3" />
        </div>
      </div>
      <div className="divider" />
      {/* A4 */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="a4">
              Is there a website you can point us to as a reference?{" "}
              <span className="optional">Optional</span>
            </label>
            <span className="q-hint">
              Not a commitment — just a visual reference so we understand your
              style from the start.
            </span>
            <TipPanel tipKey="A4" />
            <input
              type="text"
              id="a4"
              name="A4_Reference_Website"
              placeholder="e.g. www.example.com.au"
              value={form.A4_Reference_Website}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="A4" />
        </div>
      </div>
    </div>
  );

  const renderSectionB = () => (
    <div className="section-body">
      {/* B1 */}
      <div className="q-group">
        <VisualAid visKey="B1" />
        <span className="q-label">
          Which types of people are most likely to visit your website?
        </span>
        <span className="q-hint">
          Tick all that apply — these are the people you most want to reach.
        </span>
        <TipPanel tipKey="B1" />
        <div className="check-grid">
          {[
            {
              id: "aud_customers",
              value: "Potential customers or clients",
              label: "Potential customers",
              sub: "People who might buy from you",
            },
            {
              id: "aud_existing",
              value: "Existing customers",
              label: "Existing customers",
              sub: "People already working with you",
            },
            {
              id: "aud_partners",
              value: "Business partners or suppliers",
              label: "Business partners",
              sub: "Companies or individuals you work alongside",
            },
            {
              id: "aud_investors",
              value: "Investors or funders",
              label: "Investors or funders",
              sub: "People providing financial backing",
            },
            {
              id: "aud_industry",
              value: "Industry peers or referrers",
              label: "Industry peers",
              sub: "Professionals who might recommend you",
            },
            {
              id: "aud_media",
              value: "Media or press",
              label: "Media or press",
              sub: "Journalists, bloggers, publications",
            },
            {
              id: "aud_public",
              value: "General public",
              label: "General public",
              sub: "Anyone finding you via search",
            },
            {
              id: "aud_other",
              value: "Other (see below)",
              label: "Other",
              sub: "Describe below",
            },
          ].map(({ id, value, label, sub }) => (
            <CheckItem
              key={id}
              id={id}
              name="B1_Audience[]"
              value={value}
              label={label}
              sub={sub}
              checked={isArrayChecked("B1_Audience[]", value)}
              onChange={handleChange}
            />
          ))}
        </div>
        <textarea
          name="B1_Audience_Other"
          placeholder="Any others not listed? Describe them here…"
          style={{ marginTop: "10px" }}
          value={form.B1_Audience_Other}
          onChange={handleChange}
        />
      </div>
      <div className="divider" />
      {/* B2 */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="b2">
              Of those visitors, who is the single most important group you want
              to reach right now?
            </label>
            <span className="q-hint">
              If the website could only speak to one group perfectly, who would
              that be?
            </span>
            <TipPanel tipKey="B2" />
            <input
              type="text"
              id="b2"
              name="B2_Primary_Audience"
              placeholder="e.g. Potential customers, existing clients, investors…"
              value={form.B2_Primary_Audience}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="B2" />
        </div>
      </div>
      <div className="divider" />
      {/* B3 */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="b3">
              When that person visits your website, what are they most likely
              looking for?
            </label>
            <span className="q-hint">
              Think about what questions they'd arrive with, or what would make
              them stop and read.
            </span>
            <TipPanel tipKey="B3" />
            <textarea
              id="b3"
              name="B3_Visitor_Intent"
              placeholder="Your answer here…"
              value={form.B3_Visitor_Intent}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="B3" />
        </div>
      </div>
      <div className="divider" />
      {/* B4 */}
      <div className="q-group">
        <VisualAid visKey="B4" />
        <label className="q-label" htmlFor="b4">
          What would be a "good outcome" for them after visiting your website?
        </label>
        <span className="q-hint">
          A good outcome means they leave the site feeling or doing something
          positive for your business.
        </span>
        <TipPanel tipKey="B4" />
        <textarea
          id="b4"
          name="B4_Visitor_Outcome"
          placeholder="Your answer here…"
          value={form.B4_Visitor_Outcome}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  const renderSectionC = () => (
    <div className="section-body">
      {/* C1 */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="c1">
              In your own words, what would make this website a success in the
              next six to twelve months?
            </label>
            <span className="q-hint">
              Think about what would make you look back and say "Yes — that was
              worth building."
            </span>
            <TipPanel tipKey="C1" />
            <textarea
              id="c1"
              name="C1_Success_Definition"
              className="ta-tall"
              placeholder="Your answer here…"
              value={form.C1_Success_Definition}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="C1" />
        </div>
      </div>
      <div className="divider" />
      {/* C2 */}
      <div className="q-group">
        <VisualAid visKey="C2" />
        <span className="q-label">
          Which of these goals are important to you?
        </span>
        <span className="q-hint">
          Tick all that apply. Then use the Priority column to rank them — 1 =
          most important.
        </span>
        <TipPanel tipKey="C2" />
        <div className="goals-list">
          {[
            {
              label: "Look professional and trustworthy",
              small:
                "First impressions matter — clients, banks, and partners all check your site.",
              checkKey: "C2_Goal_Professional",
              priorityKey: "C2_Priority_Professional",
            },
            {
              label: "Showcase products, services, or past work",
              small: "Let visitors see what you offer or what you have done.",
              checkKey: "C2_Goal_Projects",
              priorityKey: "C2_Priority_Projects",
            },
            {
              label: "Attract new customers or clients",
              small: "Generate enquiries from people who find you online.",
              checkKey: "C2_Goal_Attract",
              priorityKey: "C2_Priority_Attract",
            },
            {
              label: "Help people contact you easily",
              small:
                "Make it simple for any visitor to call or send an enquiry.",
              checkKey: "C2_Goal_Contact",
              priorityKey: "C2_Priority_Contact",
            },
            {
              label: "Build credibility with partners, investors, or suppliers",
              small:
                "Show you are established, serious, and have a track record.",
              checkKey: "C2_Goal_Credibility",
              priorityKey: "C2_Priority_Credibility",
            },
            {
              label: "Something else",
              small: "Describe it in the box below.",
              checkKey: "C2_Goal_Other",
              priorityKey: "C2_Priority_Other",
            },
          ].map(({ label, small, checkKey, priorityKey }) => (
            <GoalRow
              key={checkKey}
              label={label}
              small={small}
              checkValue={form[checkKey] || false}
              priorityValue={form[priorityKey] || ""}
              onCheck={(e) =>
                setForm((prev) => {
                  const u = { ...prev, [checkKey]: e.target.checked };
                  triggerAutoSave(u);
                  return u;
                })
              }
              onPriority={(e) =>
                setForm((prev) => {
                  const u = { ...prev, [priorityKey]: e.target.value };
                  triggerAutoSave(u);
                  return u;
                })
              }
            />
          ))}
        </div>
        <input
          type="text"
          name="C2_Other_Goal_Detail"
          placeholder="If you ticked 'Something else' — describe your goal here…"
          style={{ marginTop: "10px" }}
          value={form.C2_Other_Goal_Detail}
          onChange={handleChange}
        />
      </div>
      <div className="divider" />
      {/* C3 */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="c3">
              If someone visits your website and only does one thing — what
              would you most want that to be?
            </label>
            <span className="q-hint">
              This is your primary call to action — the single most important
              thing you want visitors to do.
            </span>
            <TipPanel tipKey="C3" />
            <input
              type="text"
              id="c3"
              name="C3_Call_To_Action"
              placeholder="e.g. Call us on 04XX XXX XXX — or — Complete an online enquiry form…"
              value={form.C3_Call_To_Action}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="C3" />
        </div>
      </div>
    </div>
  );

  const renderSectionD = () => (
    <div className="section-body">
      <div className="q-group" style={{ paddingTop: 0 }}>
        <TipPanel tipKey="D" />
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-mid)",
            marginBottom: "18px",
          }}
        >
          Think of the website as building blocks. Each block below is a page.
          Tell us which ones you want <strong>right now</strong>, which can{" "}
          <strong>wait</strong>, and which you <strong>don't need</strong>.
        </p>
      </div>
      {[
        {
          title: "Home Page",
          visKey: "D_home",
          desc: "The first thing people see — your headline, a summary of what you do, and how to contact you.",
          hint: "Usually includes a short headline, a summary of what you do, and a clear way to contact you.",
          whenKey: "D1_Home_When",
          haveKey: "D1_Home_Have",
          needKey: "D1_Home_Need",
          havePh: "e.g. Logo, short company description, a hero photo…",
          needPh: "e.g. A professional headline, a background photo…",
        },
        {
          title: "About Us / Who We Are",
          visKey: "D_about",
          desc: "Your company story, values, and why people should trust you.",
          hint: null,
          whenKey: "D2_About_When",
          haveKey: "D2_About_Have",
          needKey: "D2_About_Need",
          havePh: "e.g. Company history, team bio, headshot…",
          needPh: "e.g. Written description of the company…",
        },
        {
          title: "Work, Projects, or Portfolio",
          visKey: "D_projects",
          desc: "Examples of your work — past or current — to show what you are capable of.",
          hint: "Could be case studies, completed jobs, products, services, or any work you want to showcase.",
          whenKey: "D3_Projects_When",
          haveKey: "D3_Projects_Have",
          needKey: "D3_Projects_Need",
          havePh: "e.g. Project names, photos, case study notes…",
          needPh: "e.g. Professional photography, written descriptions…",
        },
        {
          title: "Contact Page",
          visKey: "D_contact",
          desc: "Your contact details, an enquiry form, and optionally a map or address.",
          hint: null,
          whenKey: "D4_Contact_When",
          haveKey: null,
          needKey: null,
          havePh: null,
          needPh: null,
        },
      ].map(
        ({
          title,
          visKey,
          desc,
          hint,
          whenKey,
          haveKey,
          needKey,
          havePh,
          needPh,
        }) => (
          <div className="page-block" key={whenKey}>
            <div className="page-block-header">
              <strong>{title}</strong>
              <span>{desc}</span>
            </div>
            <div className="page-block-body">
              <VisualAid visKey={visKey} />
              {hint && (
                <span className="q-hint" style={{ marginBottom: "10px" }}>
                  {hint}
                </span>
              )}
              <WhenRadio
                name={whenKey}
                value={form[whenKey] || ""}
                onChange={handleChange}
              />
              {title === "Contact Page" ? (
                <>
                  <span className="sub-label">
                    What contact details should be shown?
                  </span>
                  <textarea
                    name="D4_Contact_Details"
                    style={{ minHeight: "70px" }}
                    placeholder="e.g. Phone: 04XX XXX XXX, Email: hello@yourbusiness.com.au…"
                    value={form.D4_Contact_Details}
                    onChange={handleChange}
                  />
                </>
              ) : title === "Work, Projects, or Portfolio" ? (
                <>
                  <div className="twin-col">
                    <div>
                      <span className="sub-label">
                        What do you already have?
                      </span>
                      <textarea
                        name={haveKey}
                        style={{ minHeight: "70px" }}
                        placeholder={havePh}
                        value={form[haveKey] || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <span className="sub-label">What do you still need?</span>
                      <textarea
                        name={needKey}
                        style={{ minHeight: "70px" }}
                        placeholder={needPh}
                        value={form[needKey] || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <span className="sub-label">
                      Roughly how many items at launch?
                    </span>
                    <input
                      type="text"
                      name="D3_Projects_Count"
                      placeholder="e.g. 3 completed projects + 1 in progress"
                      value={form.D3_Projects_Count}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <div className="twin-col">
                  <div>
                    <span className="sub-label">What do you already have?</span>
                    <textarea
                      name={haveKey}
                      style={{ minHeight: "70px" }}
                      placeholder={havePh}
                      value={form[haveKey] || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <span className="sub-label">
                      What do you still need to prepare?
                    </span>
                    <textarea
                      name={needKey}
                      style={{ minHeight: "70px" }}
                      placeholder={needPh}
                      value={form[needKey] || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ),
      )}
      <div className="q-group" style={{ paddingBottom: 0 }}>
        <VisualAid visKey="D_other" />
        <label className="q-label" htmlFor="d5">
          Any other pages or sections you want to include at launch?
        </label>
        <span className="q-hint">
          Anything not listed above that you feel the site needs from day one.
        </span>
        <textarea
          id="d5"
          name="D5_Other_Pages"
          placeholder="Describe any additional pages or sections here…"
          value={form.D5_Other_Pages}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  const renderSectionE = () => (
    <div className="section-body">
      <div className="q-group" style={{ paddingTop: 0 }}>
        <TipPanel tipKey="E" />
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-mid)",
            marginBottom: "18px",
          }}
        >
          You've said: <em>"Start simple, expand later."</em> Smart approach.
          This section captures future ideas — nothing here is being built right
          now.
        </p>
      </div>
      {/* E1 */}
      <div className="q-group" style={{ paddingTop: 0 }}>
        <VisualAid visKey="E1" />
        <span className="q-label">
          Which of these features might interest you in the future?
        </span>
        <span className="q-hint">
          Tick anything that sounds potentially useful. No pressure to commit —
          these are ideas.
        </span>
        <div className="check-grid" style={{ marginTop: "10px" }}>
          {[
            {
              id: "fut_blog",
              value: "News or updates section",
              label: "News or updates section",
              sub: "Post project updates, announcements, or industry news",
            },
            {
              id: "fut_gallery",
              value: "Full project gallery",
              label: "Full project gallery",
              sub: "More photos, videos, and walk-through content per project",
            },
            {
              id: "fut_downloads",
              value: "Downloads (brochures, floor plans)",
              label: "Downloads",
              sub: "Brochures, floor plans, PDFs, or fact sheets",
            },
            {
              id: "fut_testimonials",
              value: "Testimonials or case studies",
              label: "Testimonials or case studies",
              sub: "Quotes or stories from satisfied buyers or partners",
            },
            {
              id: "fut_faq",
              value: "FAQ section",
              label: "FAQ section",
              sub: "Answers to questions your clients ask most often",
            },
            {
              id: "fut_enquiry",
              value: "Online enquiry form",
              label: "Online enquiry or booking form",
              sub: "Let people express interest or request a meeting",
            },
            {
              id: "fut_team",
              value: "Team or partner profiles",
              label: "Team or partner profiles",
              sub: "Pages for key people or trusted partners",
            },
            {
              id: "fut_portal",
              value: "Investor portal or private login",
              label: "Investor portal or private login",
              sub: "A secure section for investors to access project details",
            },
            {
              id: "fut_newsletter",
              value: "Mailing list or newsletter",
              label: "Mailing list or newsletter",
              sub: "Let interested people subscribe for project updates",
            },
          ].map(({ id, value, label, sub }) => (
            <CheckItem
              key={id}
              id={id}
              name="E1_Future[]"
              value={value}
              label={label}
              sub={sub}
              checked={isArrayChecked("E1_Future[]", value)}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>
      <div className="divider" />
      {/* E2 */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="e2">
              Have you seen anything on other websites you liked and might want
              one day?
            </label>
            <span className="q-hint">
              A feature, type of content, layout, or feeling you got from
              browsing somewhere else.
            </span>
            <textarea
              id="e2"
              name="E2_Future_Ideas"
              placeholder="Describe any ideas you've seen elsewhere that you'd like in mind for later…"
              value={form.E2_Future_Ideas}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="E2" />
        </div>
      </div>
    </div>
  );

  const renderSectionF = () => (
    <div className="section-body">
      {/* F1 — The vibe */}
      <div className="q-group" style={{ paddingTop: 0 }}>
        <VisualAid visKey="F1" />
        <span className="q-label">
          How do you want the website to feel when someone visits it?
        </span>
        <span className="q-hint">
          Think of the impression you want to leave — like walking into a
          beautifully designed display suite or office.
        </span>
        <TipPanel tipKey="F1" />
        <div className="check-grid" style={{ marginTop: "10px" }}>
          {[
            {
              id: "feel_premium",
              value: "Premium and high-end",
              label: "Premium and high-end",
              sub: "Polished, quality, carefully considered",
            },
            {
              id: "feel_modern",
              value: "Modern and clean",
              label: "Modern and clean",
              sub: "Fresh, contemporary, up-to-date",
            },
            {
              id: "feel_professional",
              value: "Professional and serious",
              label: "Professional and serious",
              sub: "Businesslike, no-nonsense, trustworthy",
            },
            {
              id: "feel_classic",
              value: "Classic and timeless",
              label: "Classic and timeless",
              sub: "Established, traditional, not trend-driven",
            },
            {
              id: "feel_warm",
              value: "Warm and approachable",
              label: "Warm and approachable",
              sub: "Friendly, welcoming, easy to connect with",
            },
            {
              id: "feel_minimal",
              value: "Minimal and simple",
              label: "Minimal and simple",
              sub: "Clean, uncluttered, easy to read",
            },
            {
              id: "feel_bold",
              value: "Bold and confident",
              label: "Bold and confident",
              sub: "Strong, impactful, makes a statement",
            },
            {
              id: "feel_local",
              value: "Local and community-focused",
              label: "Local and community-focused",
              sub: "Grounded, connected to place and people",
            },
          ].map(({ id, value, label, sub }) => (
            <CheckItem
              key={id}
              id={id}
              name="F1_Feel[]"
              value={value}
              label={label}
              sub={sub}
              checked={isArrayChecked("F1_Feel[]", value)}
              onChange={handleChange}
            />
          ))}
        </div>
        <textarea
          name="F1_Feel_Other"
          placeholder="Anything else? Describe the feeling you want in your own words…"
          style={{ marginTop: "10px" }}
          value={form.F1_Feel_Other}
          onChange={handleChange}
        />
      </div>
      <div className="divider" />
      {/* F2 — Reference sites */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="f2">
              Are there any websites you like the look of? (Property or
              otherwise.)
            </label>
            <span className="q-hint">
              Write the website addresses and say briefly what you like about
              each — colours, layout, photography, simplicity, etc.
            </span>
            <TipPanel tipKey="F2" />
            <textarea
              id="f2"
              name="F2_Liked_Sites"
              className="ta-tall"
              placeholder="e.g. www.mailchimp.com — I like how clean and uncluttered it is…"
              value={form.F2_Liked_Sites}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="F2" />
        </div>
      </div>
      <div className="divider" />
      {/* F3 — Dislikes */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="f3">
              Is there anything you specifically do not like on websites?
            </label>
            <span className="q-hint">
              Be honest — this prevents wasted design time and avoids things
              that would frustrate you.
            </span>
            <TipPanel tipKey="F3" />
            <div className="check-grid" style={{ marginTop: "8px" }}>
              {[
                {
                  id: "dis_text",
                  value: "Too much text",
                  label: "Too much text",
                  sub: "Overwhelming, hard to quickly scan",
                },
                {
                  id: "dis_anim",
                  value: "Lots of animations or moving parts",
                  label: "Lots of animations",
                  sub: "Distracting, slows the page down",
                },
                {
                  id: "dis_colours",
                  value: "Too many colours",
                  label: "Too many colours",
                  sub: "Looks cheap or hard to read",
                },
                {
                  id: "dis_fonts",
                  value: "Hard-to-read fonts",
                  label: "Hard-to-read fonts",
                  sub: "Too decorative, too small, or low contrast",
                },
                {
                  id: "dis_slow",
                  value: "Slow to load",
                  label: "Slow to load",
                  sub: "Especially on a mobile phone",
                },
                {
                  id: "dis_nav",
                  value: "Hard to navigate",
                  label: "Hard to find things",
                  sub: "Confusing menus or no clear structure",
                },
                {
                  id: "dis_popups",
                  value: "Pop-up windows and banners",
                  label: "Pop-up windows",
                  sub: "Interruptive messages over the page",
                },
                {
                  id: "dis_old",
                  value: "Outdated look",
                  label: "Outdated look",
                  sub: "Looks old-fashioned or neglected",
                },
              ].map(({ id, value, label, sub }) => (
                <CheckItem
                  key={id}
                  id={id}
                  name="F3_Dislikes[]"
                  value={value}
                  label={label}
                  sub={sub}
                  checked={isArrayChecked("F3_Dislikes[]", value)}
                  onChange={handleChange}
                />
              ))}
            </div>
            <textarea
              id="f3"
              name="F3_Dislikes_Other"
              placeholder="Any other dislikes not listed above?…"
              style={{ marginTop: "10px" }}
              value={form.F3_Dislikes_Other}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="F3" />
        </div>
      </div>
      <div className="divider" />
      {/* F4 — Style preferences */}
      <div className="q-group">
        <span className="q-label">A few style preferences</span>
        <span className="q-hint">
          Choose the option that feels right from each pair.
        </span>
        <TipPanel tipKey="F4" />
        <div className="pref-block" style={{ marginTop: "14px" }}>
          <p>Overall colour tone:</p>
          <VisualAid visKey="F4_tone" />
          <div className="radio-list">
            {[
              {
                id: "tone_light",
                value: "Light and airy (white backgrounds, lots of space)",
                label: "Light and airy",
                sub: "White backgrounds, clean and spacious",
              },
              {
                id: "tone_dark",
                value: "Dark and rich (dark backgrounds, strong contrast)",
                label: "Dark and rich",
                sub: "Dark backgrounds, striking contrast",
              },
              {
                id: "tone_neutral",
                value: "Neutral (warm greys, beige, stone tones)",
                label: "Neutral",
                sub: "Warm greys, beige, or stone tones",
              },
              {
                id: "tone_any",
                value: "No preference — trust the design team",
                label: "No strong preference",
                sub: "Trust the design team",
              },
            ].map(({ id, value, label, sub }) => (
              <RadioItem
                key={id}
                id={id}
                name="F4_Tone"
                value={value}
                label={label}
                sub={sub}
                checked={form.F4_Tone === value}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>
        <div className="pref-block">
          <p>Content balance:</p>
          <VisualAid visKey="F4_balance" />
          <div className="radio-list">
            {[
              {
                id: "bal_photos",
                value: "Mostly big, impactful photos",
                label: "Mostly big, impactful photos",
                sub: "Let the images do the talking",
              },
              {
                id: "bal_text",
                value: "More text and detail",
                label: "More text and detail",
                sub: "I want visitors to read and understand",
              },
              {
                id: "bal_both",
                value: "A good balance of both",
                label: "A balanced mix of photos and text",
                sub: null,
              },
            ].map(({ id, value, label, sub }) => (
              <RadioItem
                key={id}
                id={id}
                name="F4_Balance"
                value={value}
                label={label}
                sub={sub}
                checked={form.F4_Balance === value}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>
        <div className="pref-block">
          <p>Site structure:</p>
          <VisualAid visKey="F4_structure" />
          <div className="radio-list">
            {[
              {
                id: "str_single",
                value: "Single scrolling page",
                label: "Single scrolling page",
                sub: "Everything on one page — simple and fast",
              },
              {
                id: "str_multi",
                value: "Multiple separate pages",
                label: "Multiple separate pages",
                sub: "Each topic gets its own page — better for larger sites",
              },
              {
                id: "str_any",
                value: "No preference — recommend what suits best",
                label: "No preference",
                sub: "Recommend what suits us best",
              },
            ].map(({ id, value, label, sub }) => (
              <RadioItem
                key={id}
                id={id}
                name="F4_Structure"
                value={value}
                label={label}
                sub={sub}
                checked={form.F4_Structure === value}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="divider" />
      {/* F5 — Colours */}
      <div className="q-group">
        <VisualAid visKey="F5" />
        <label className="q-label" htmlFor="f5">
          Any colours you want — or definitely don't want?
        </label>
        <span className="q-hint">
          Even a rough description helps enormously — e.g. "something dark blue
          and gold" or "earthy tones, nothing too bright."
        </span>
        <TipPanel tipKey="F5" />
        <input
          type="text"
          id="f5"
          name="F5_Colours"
          placeholder="e.g. Navy and gold, or keep existing brand colours, or earthy neutrals…"
          value={form.F5_Colours}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  const renderSectionG = () => (
    <div className="section-body">
      {/* G1 — Assets */}
      <div className="q-group" style={{ paddingTop: 0 }}>
        <VisualAid visKey="G1" />
        <span className="q-label">What do you already have ready to use?</span>
        <span className="q-hint">
          Tick everything you already have. The more you have ready now, the
          faster we can move.
        </span>
        <TipPanel tipKey="G1" />
        <div className="check-list" style={{ marginTop: "10px" }}>
          {[
            {
              id: "asset_logo",
              value: "A logo",
              label: "A logo",
              sub: "Ideally high-resolution PNG or vector (.ai, .eps, .svg)",
            },
            {
              id: "asset_colours",
              value: "Brand colours",
              label: "Brand colours",
              sub: "Specific colours you already use in your marketing",
            },
            {
              id: "asset_photos",
              value: "High-quality project photos",
              label: "High-quality project photos",
              sub: "Professional photography of your work or developments",
            },
            {
              id: "asset_docs",
              value: "Existing brochures or documents",
              label: "Existing brochures or marketing documents",
              sub: "PDFs, printed brochures, floor plan documents",
            },
            {
              id: "asset_copy",
              value: "Written content already prepared",
              label: "Written content already prepared",
              sub: "Any text descriptions of the business or projects",
            },
            {
              id: "asset_site",
              value: "A current website (if you already have one)",
              label: "A current website",
              sub: "Content from existing sites can sometimes be reused",
            },
          ].map(({ id, value, label, sub }) => (
            <CheckItem
              key={id}
              id={id}
              name="G1_Have[]"
              value={value}
              label={label}
              sub={sub}
              checked={isArrayChecked("G1_Have[]", value)}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>
      <div className="divider" />
      {/* G2 — Domain */}
      <div className="q-group">
        <VisualAid visKey="G2" />
        <span className="q-label">Do you already own a domain name?</span>
        <span className="q-hint">
          A domain name is your website address — e.g.{" "}
          <em>yourbusiness.com.au</em>
        </span>
        <TipPanel tipKey="G2" />
        <div className="radio-list" style={{ margin: "10px 0 12px" }}>
          {[
            {
              id: "dom_yes",
              value: "Yes — I already have one",
              label: "Yes — I already have one",
            },
            {
              id: "dom_no",
              value: "No — I will need one registered",
              label: "No — I will need one registered",
            },
            {
              id: "dom_unsure",
              value: "I am not sure",
              label: "I am not sure",
            },
          ].map(({ id, value, label }) => (
            <RadioItem
              key={id}
              id={id}
              name="G2_Domain"
              value={value}
              label={label}
              sub={null}
              checked={form.G2_Domain === value}
              onChange={handleChange}
            />
          ))}
        </div>
        <label className="sub-label" htmlFor="g2_name">
          If yes, what is the domain name?
        </label>
        <input
          type="text"
          id="g2_name"
          name="G2_Domain_Name"
          placeholder="e.g. yourbusiness.com.au"
          value={form.G2_Domain_Name}
          onChange={handleChange}
        />
      </div>
      <div className="divider" />
      {/* G3 — Contact methods */}
      <div className="q-group">
        <VisualAid visKey="G3" />
        <span className="q-label">
          How should people contact you through the website?
        </span>
        <span className="q-hint">
          Tick all the methods you're comfortable displaying publicly.
        </span>
        <TipPanel tipKey="G3" />
        <div className="check-list" style={{ marginTop: "10px" }}>
          {[
            {
              id: "cm_phone",
              value: "Phone number",
              label: "Phone number",
              sub: "Mobile or office landline",
            },
            {
              id: "cm_email",
              value: "Email address",
              label: "Email address",
              sub: "A dedicated business email, not a personal address if possible",
            },
            {
              id: "cm_form",
              value: "Online contact form",
              label: "Online contact form",
              sub: "A form on the site where people type their name, message, and email",
            },
            {
              id: "cm_wa",
              value: "WhatsApp",
              label: "WhatsApp",
              sub: "A WhatsApp chat button linking to your number",
            },
            {
              id: "cm_addr",
              value: "Office or postal address",
              label: "Office or postal address",
              sub: "Only if you have a physical office that visitors could come to",
            },
          ].map(({ id, value, label, sub }) => (
            <CheckItem
              key={id}
              id={id}
              name="G3_Contact_Methods[]"
              value={value}
              label={label}
              sub={sub}
              checked={isArrayChecked("G3_Contact_Methods[]", value)}
              onChange={handleChange}
            />
          ))}
        </div>
        <textarea
          name="G3_Contact_Details"
          placeholder="Please write the actual contact details you want listed (phone, email, etc.)…"
          style={{ marginTop: "10px" }}
          value={form.G3_Contact_Details}
          onChange={handleChange}
        />
      </div>
      <div className="divider" />
      {/* G4 — Social */}
      <div className="q-group">
        <div className="q-with-visual">
          <div className="q-fields">
            <label className="q-label" htmlFor="g4">
              Any social media pages we should link to from the website?{" "}
              <span className="optional">Optional</span>
            </label>
            <span className="q-hint">
              For example: LinkedIn, Facebook, or Instagram. Write the names or
              addresses below, or "None."
            </span>
            <input
              type="text"
              id="g4"
              name="G4_Social_Media"
              placeholder="e.g. LinkedIn: linkedin.com/company/yourbusiness — or — None at this stage"
              value={form.G4_Social_Media}
              onChange={handleChange}
            />
          </div>
          <VisualAid visKey="G4" />
        </div>
      </div>
    </div>
  );

  const renderSectionH = () => (
    <div className="section-body">
      <div className="q-group" style={{ paddingTop: 0 }}>
        <TipPanel tipKey="H" />
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-mid)",
            marginBottom: "22px",
          }}
        >
          This section has no wrong answers. Write whatever is on your mind —
          any concern, question, or thing you want to flag is useful.
        </p>
      </div>
      {[
        {
          id: "h1",
          visKey: "H1",
          name: "H1_Questions",
          label:
            "Do you have any questions about how the website will be built, what it will cost, or how long it will take?",
          ph: "Write any questions here — nothing is too basic. If you're not sure, just write it down…",
          hint: null,
        },
        {
          id: "h2",
          visKey: "H2",
          name: "H2_Concerns",
          label:
            "Are there any concerns or worries you have about this project?",
          ph: "Write any concerns here — being honest helps us plan and communicate better from the start…",
          hint: "For example: worries about how long it will take, about ongoing maintenance, about the site looking outdated, etc.",
        },
        {
          id: "h3",
          visKey: "H3",
          name: "H3_Definitely_Not",
          label: "Is there anything you definitely do NOT want on the website?",
          ph: "Write any firm 'no' items here…",
          hint: "Hard limits or things that would make you uncomfortable. No detail is too small.",
        },
        {
          id: "h4",
          visKey: "H4",
          name: "H4_Anything_Else",
          label:
            "Is there anything else you would like to mention that didn't fit anywhere above?",
          ph: "Any final thoughts, ideas, or things you want us to know…",
          hint: null,
        },
      ].map(({ id, visKey, name, label, ph, hint }, i) => (
        <div key={id}>
          {i > 0 && <div className="divider" />}
          <div className="q-group">
            <div className="q-with-visual">
              <div className="q-fields">
                <label className="q-label" htmlFor={id}>
                  {label}
                </label>
                {hint && <span className="q-hint">{hint}</span>}
                <textarea
                  id={id}
                  name={name}
                  className="ta-tall"
                  placeholder={ph}
                  value={form[name]}
                  onChange={handleChange}
                />
              </div>
              <VisualAid visKey={visKey} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SECTION_RENDERERS = [
    renderSectionA,
    renderSectionB,
    renderSectionC,
    renderSectionD,
    renderSectionE,
    renderSectionF,
    renderSectionG,
    renderSectionH,
  ];

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="home-shell">
        <header className="site-header">
          <div className="site-header-inner">
            <div className="site-header-mark" aria-label="PB monogram">
              <img src="/favicon.svg" width="40" height="40" alt="PB" draggable="false" />
            </div>
            <div className="site-header-text">
              <div className="brand">Prabesh Bhetwal · Client Briefing</div>
              <div className="doc-title">Website Brief</div>
              <div className="doc-meta">{today}</div>
            </div>
          </div>
        </header>
        <div className="success-screen">
          <span className="success-icon">🎉</span>
          <h2>Brief submitted successfully!</h2>
          <p>
            Your web developer has received your answers and will be in touch
            shortly. A copy of your answers has opened in a new window — print
            it or save it as a PDF for your records.
          </p>
          <p>
            Thank you for taking the time to complete this. The more detail
            you've shared, the better the result will be.
          </p>
        </div>
        <footer className="site-footer">
          <p>Website Brief · All information is confidential</p>
        </footer>
      </div>
    );
  }

  /* ── Intro screen (step 0) ── */
  const isIntro = step === 0;
  const currentSectionIdx = step - 1; // 0-indexed within SECTIONS
  const currentSection = SECTIONS[currentSectionIdx];
  const isLastSection = step === SECTIONS.length;

  return (
    <div className={`home-shell${isIntro ? "" : " is-section"}`}>
      {/* ── Header ── */}
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-header-mark" aria-label="PB monogram">
            <img src="/favicon.svg" width="40" height="40" alt="PB" draggable="false" />
          </div>
          <div className="site-header-text">
            <div className="brand">Prabesh Bhetwal · Client Briefing</div>
            <div className="doc-title">
              Website Brief — What Do You Want From Your Website?
            </div>
            <div className="doc-meta">
              Complete this form and submit it, or print it to discuss in person
              · {today}
            </div>
          </div>
        </div>
      </header>

      {/* ── Wizard nav sidebar ── */}
      {!isIntro && (
        <nav className="wizard-strip" aria-label="Form sections">
          <div className="wizard-strip-inner">
            <div className="wizard-steps">
              {SECTIONS.map((s, i) => {
                const sIdx = i + 1;
                const isDone = step > sIdx;
                const isActive = step === sIdx;
                return (
                  <div
                    key={s.id}
                    className={`w-step${isActive ? " active" : ""}${isDone ? " done" : ""}`}
                    onClick={() => goToStep(sIdx, sIdx < step ? "left" : "right")}
                    role="button"
                    aria-label={`Go to ${s.label}`}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && goToStep(sIdx, sIdx < step ? "left" : "right")}
                  >
                    <div
                      className="w-step-dot"
                      style={isActive || isDone ? { background: s.color, borderColor: s.color, color: '#fff' } : undefined}
                    >
                      {isDone ? "✓" : sIdx}
                    </div>
                    <div
                      className="w-step-label"
                      style={isActive ? { color: s.color } : isDone ? { color: s.color, opacity: 0.7 } : undefined}
                    >
                      <span className="w-step-emoji" aria-hidden="true">{s.emoji}</span>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* ── Progress ring (right edge) ── */}
      {!isIntro && (() => {
        const r = 17;
        const circ = 2 * Math.PI * r;
        const offset = circ * (1 - completion / 100);
        return (
          <div className="pct-pill" aria-label={`${completion}% complete`}>
            <div className="pct-pill-ring">
              <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                <circle className="ring-bg" cx="22" cy="22" r={r} />
                <circle className="ring-fill" cx="22" cy="22" r={r} strokeDasharray={circ} strokeDashoffset={offset} />
              </svg>
              <div className="pct-pill-num">{completion}%</div>
            </div>
          </div>
        );
      })()}

      {/* ── Main ── */}
      <main
        className={isIntro ? undefined : "container"}
        style={{
          flex: 1,
          minHeight: 0,        /* allow flex child to shrink below content size */
          ...(isIntro ? {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 24px",
            overflow: "auto",  /* scroll only if card is taller than remaining space */
          } : {}),
        }}
      >
        {/* ── INTRO SCREEN ── */}
        {isIntro && (
          <div style={{ width: "min(700px, 100%)", animation: "fadeUp 0.4s ease both" }}>
            <div className="intro-card">
              <h2>Before you begin</h2>
              <p>This form will help turn your ideas for your new website into a clear, practical plan. There are no wrong answers — the goal is simply to understand what you want, who it is for, and what it should achieve for your business.</p>
              <p>The form is split into <strong>8 short sections</strong>. Each section focuses on one aspect of your website. You can complete them in any order and take as many breaks as you like — your answers are <strong>automatically saved</strong> as you type.</p>
              <p>If any question is unclear, skip it and write your question in <strong><span style={{ whiteSpace: "nowrap" }}>Section 8 — Q &amp; A</span></strong> at the end. When you're finished, you can submit your answers directly or print a copy to discuss in person.</p>
              <div style={{ marginTop: "28px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                  marginBottom: "28px",
                }}>
                  {SECTIONS.map((s) => (
                    <div key={s.id} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      fontSize: "13px",
                      color: "var(--text-mid)",
                      padding: "10px 12px",
                      background: "var(--bg)",
                      border: `1.5px solid var(--border)`,
                      borderRadius: "9px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}>
                      <span style={{ fontSize: "17px", lineHeight: 1, flexShrink: 0 }}>{s.emoji}</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    type="button"
                    className="btn-nav btn-nav-primary"
                    style={{ fontSize: "15px", padding: "12px 44px", minHeight: "48px" }}
                    onClick={() => goToStep(1, "right")}
                  >
                    Get started →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION SCREEN ── */}
        {!isIntro && currentSection && (
          <div
            key={step}
            className="wizard-section"
            ref={sectionRef}
            style={{
              animationName: animDir === "left" ? "slideInFromLeft" : "slideIn",
              marginTop: "28px",
            }}
          >
            <div className="section-card">
              <SectionBanner
                section={currentSection}
                stepNum={step}
                total={SECTIONS.length}
              />
              {SECTION_RENDERERS[currentSectionIdx]()}

              {/* Section navigation */}
              <div className="wizard-nav" style={{ margin: "0 32px 28px" }}>
                <div className="wizard-nav-left">
                  <button
                    type="button"
                    className="btn-nav"
                    style={{
                      borderColor: currentSection.color,
                      color: currentSection.color,
                    }}
                    onClick={() => goToStep(step === 1 ? 0 : step - 1, "left")}
                  >
                    ← {step === 1 ? "Back to intro" : "Previous"}
                  </button>
                </div>
                <div className="wizard-nav-right">
                  {isLastSection ? (
                    <button
                      type="button"
                      className="btn-nav btn-nav-gold"
                      onClick={() => setModalOpen(true)}
                    >
                      Submit answers ✓
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-nav btn-nav-primary"
                      style={{
                        background: currentSection.color,
                        borderColor: currentSection.color,
                      }}
                      onClick={goNext}
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Smart Action Bar ── */}
      {/* Only shown during the wizard (not on intro screen, not on last-section nav which has its own submit) */}
      {!isIntro &&
        (() => {
          const allSectionsVisited = highestStep >= SECTIONS.length;
          const BAR = {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderTop: "1.5px solid #c9b98a",
            background: "rgba(247,242,232,0.97)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 -6px 28px rgba(24,32,43,0.13)",
          };
          const BTN = {
            minHeight: "34px",
            padding: "6px 13px",
            border: "1.5px solid #b8a98a",
            borderRadius: "8px",
            background: "#ede8de",
            color: "#18202b",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          };
          const BTN_GOLD = {
            ...BTN,
            background: "linear-gradient(135deg,#b8962b,#d0aa3a)",
            color: "#fff",
            border: "1.5px solid #b8962b",
            fontWeight: 700,
            fontSize: "13px",
            padding: "7px 18px",
          };

          return (
            <div style={BAR}>
              {/* Save indicator — left side */}
              <div
                style={{
                  marginRight: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  color: "#5f6570",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: saveStatus === "saving" ? "#b8962b" : "#2d7a4a",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {saveStatus === "saving"
                  ? "Saving…"
                  : saveTime
                    ? `Saved ${saveTime}`
                    : "Auto-saved"}
              </div>

              {/* Utility buttons — always present */}
              <button type="button" onClick={clearAll} style={BTN}>
                Clear all
              </button>
              <button type="button" onClick={() => window.print()} style={BTN}>
                Print / PDF
              </button>

              {/* Submit — only appears after all 8 sections visited */}
              {allSectionsVisited ? (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  style={BTN_GOLD}
                >
                  Submit answers ✓
                </button>
              ) : (
                /* Completion nudge — shows how many sections remain */
                <div
                  style={{
                    fontSize: "11px",
                    color: "#8a7a5a",
                    background: "#fdf5dc",
                    border: "1.5px solid #e5d080",
                    borderRadius: "8px",
                    padding: "5px 12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {SECTIONS.length - highestStep} section
                  {SECTIONS.length - highestStep !== 1 ? "s" : ""} remaining
                </div>
              )}
            </div>
          );
        })()}

      {/* ── Submit Modal ── */}
      {modalOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalHeading"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="modal">
            <h2 id="modalHeading">Ready to submit your answers?</h2>
            <p>
              Your completed brief will be sent directly to your web developer.
              After submitting, a full summary will open automatically — print
              it, save it as a PDF, or copy it for your records.
            </p>
            <p>
              Add your email address below so your developer can follow up with
              you directly.
            </p>
            <div className="email-field">
              <label htmlFor="submitterEmail">
                Your email address{" "}
                <span style={{ fontWeight: 400, color: "var(--text-soft)" }}>
                  (optional)
                </span>
              </label>
              <input
                type="email"
                id="submitterEmail"
                placeholder="yourname@email.com"
                value={submitterEmail}
                onChange={(e) => setSubmitterEmail(e.target.value)}
              />
            </div>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn-gold"
                onClick={handleSubmit}
              >
                Send my answers
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setModalOpen(false)}
              >
                Go back and check
              </button>
            </div>
            <p className="privacy-note">
              Your answers are sent securely only to your developer. They are
              not stored, shared, or used for any other purpose.
            </p>
          </div>
        </div>
      )}

      <Toast message={toast.message} visible={toast.visible} />

      <footer className="site-footer">
        <p>Website Brief &nbsp;·&nbsp; All information is confidential</p>
      </footer>
    </div>
  );
}
