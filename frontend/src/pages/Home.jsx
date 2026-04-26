import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import "../home.css";

/* ─────────────────────────────────────────
   VISUAL AIDS — inline SVG infographics
   Each teaches a non-technical user what
   the question means & why it matters.
───────────────────────────────────────── */
const VISUALS = {
  /* ── Section A: Overview ── */
  A1: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Shop sign */}
        <rect x="60" y="28" width="160" height="70" rx="8" fill="#1a2640" stroke="#d4a93c" strokeWidth="1.5"/>
        <rect x="68" y="36" width="144" height="54" rx="5" fill="#0f1c30"/>
        {/* Brand name text blocks */}
        <rect x="80" y="47" width="60" height="8" rx="3" fill="#d4a93c"/>
        <rect x="148" y="47" width="52" height="8" rx="3" fill="#d4a93c" opacity="0.6"/>
        <rect x="80" y="62" width="120" height="5" rx="2.5" fill="#4a6fa5" opacity="0.7"/>
        <rect x="80" y="73" width="90" height="5" rx="2.5" fill="#4a6fa5" opacity="0.5"/>
        {/* Sign post */}
        <rect x="135" y="98" width="10" height="22" rx="2" fill="#1a2640"/>
        <rect x="105" y="118" width="70" height="6" rx="3" fill="#1a2640"/>
        {/* Label */}
        <text x="140" y="147" fill="#8a9ab5" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Your name = your first impression online</text>
      </svg>
    ),
    caption: "Your business name is the foundation — everything on the site starts here.",
  },

  A2: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Person silhouette */}
        <circle cx="70" cy="58" r="18" fill="#1a3050"/>
        <circle cx="70" cy="52" r="9" fill="#4a6fa5"/>
        <path d="M52 75 Q70 68 88 75 L90 95 Q70 100 50 95Z" fill="#4a6fa5"/>
        {/* Speech bubble */}
        <rect x="100" y="30" width="150" height="72" rx="10" fill="#1a2640" stroke="#d4a93c" strokeWidth="1.2"/>
        <polygon points="100,62 88,68 100,74" fill="#1a2640"/>
        {/* Text lines inside bubble */}
        <rect x="112" y="44" width="126" height="6" rx="3" fill="#d4a93c" opacity="0.8"/>
        <rect x="112" y="57" width="110" height="5" rx="2.5" fill="#8a9ab5" opacity="0.7"/>
        <rect x="112" y="68" width="120" height="5" rx="2.5" fill="#8a9ab5" opacity="0.6"/>
        <rect x="112" y="79" width="80" height="5" rx="2.5" fill="#8a9ab5" opacity="0.5"/>
        {/* Footer label */}
        <text x="140" y="120" fill="#d4a93c" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif" fontStyle="italic">"We help small businesses get found online"</text>
        <text x="140" y="135" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Simple plain-English pitch = best website copy</text>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Write it exactly how you'd say it to a friend</text>
      </svg>
    ),
    caption: "Imagine explaining your business to a friend over coffee. Write exactly that.",
  },

  A3: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Bullseye */}
        <circle cx="100" cy="78" r="48" fill="#1a2640"/>
        <circle cx="100" cy="78" r="36" fill="#0f1c30"/>
        <circle cx="100" cy="78" r="24" fill="#1a3050"/>
        <circle cx="100" cy="78" r="12" fill="#c0392b" opacity="0.85"/>
        <circle cx="100" cy="78" r="5" fill="#e74c3c"/>
        {/* Arrow */}
        <line x1="160" y1="30" x2="110" y2="74" stroke="#d4a93c" strokeWidth="2.5" strokeLinecap="round"/>
        <polygon points="108,68 116,68 110,78" fill="#d4a93c"/>
        {/* Goal labels on right */}
        <rect x="170" y="34" width="90" height="14" rx="4" fill="#1a2640"/>
        <circle cx="178" cy="41" r="3" fill="#e74c3c"/>
        <rect x="185" y="38" width="68" height="6" rx="3" fill="#d4a93c" opacity="0.9"/>
        <rect x="170" y="54" width="90" height="14" rx="4" fill="#1a2640" opacity="0.6"/>
        <circle cx="178" cy="61" r="3" fill="#4a6fa5" opacity="0.7"/>
        <rect x="185" y="58" width="52" height="5" rx="2.5" fill="#8a9ab5" opacity="0.5"/>
        <rect x="170" y="74" width="90" height="14" rx="4" fill="#1a2640" opacity="0.5"/>
        <circle cx="178" cy="81" r="3" fill="#4a6fa5" opacity="0.5"/>
        <rect x="185" y="78" width="44" height="5" rx="2.5" fill="#8a9ab5" opacity="0.4"/>
        <text x="215" y="112" fill="#d4a93c" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">Priority #1</text>
        <text x="140" y="135" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">One clear goal = a website that actually converts</text>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">e.g. Get enquiries · Sell products · Build credibility</text>
      </svg>
    ),
    caption: "One job. What is the single most important thing this website should do for you?",
  },

  A4: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Browser window */}
        <rect x="20" y="18" width="240" height="120" rx="7" fill="#1a2640" stroke="#2a3a55" strokeWidth="1"/>
        {/* Browser bar */}
        <rect x="20" y="18" width="240" height="24" rx="7" fill="#0f1c30"/>
        <rect x="20" y="30" width="240" height="12" fill="#0f1c30"/>
        {/* Traffic lights */}
        <circle cx="36" cy="30" r="4" fill="#e74c3c" opacity="0.8"/>
        <circle cx="50" cy="30" r="4" fill="#f39c12" opacity="0.8"/>
        <circle cx="64" cy="30" r="4" fill="#2ecc71" opacity="0.8"/>
        {/* URL bar */}
        <rect x="80" y="24" width="152" height="12" rx="5" fill="#1a3050"/>
        <text x="156" y="33" fill="#4a6fa5" fontSize="8" textAnchor="middle" fontFamily="monospace">www.example-site.com.au</text>
        {/* Page content wireframe */}
        <rect x="30" y="52" width="220" height="36" rx="4" fill="#0f1c30"/>
        <rect x="40" y="60" width="100" height="8" rx="3" fill="#d4a93c" opacity="0.7"/>
        <rect x="40" y="72" width="150" height="5" rx="2.5" fill="#4a6fa5" opacity="0.5"/>
        <rect x="30" y="96" width="100" height="32" rx="4" fill="#1a3050" opacity="0.7"/>
        <rect x="138" y="96" width="112" height="32" rx="4" fill="#1a3050" opacity="0.5"/>
        {/* Pointer / bookmark */}
        <path d="M248 20 L256 20 L256 36 L252 32 L248 36Z" fill="#d4a93c" opacity="0.8"/>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Share a site you love → we match its style for you</text>
      </svg>
    ),
    caption: "Point us to a site you like — it gives us instant visual shorthand.",
  },

  /* ── Section B: Audience ── */
  B1: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Three audience cards */}
        {[0,1,2].map(i => {
          const x = 24 + i * 84;
          const colors = ["#3a7bd5","#d4a93c","#2ecc71"];
          const labels = ["Investor","Local Buyer","Corporate"];
          const sub = ["Wants credibility","Needs pricing","Seeks portfolio"];
          return (
            <g key={i}>
              <rect x={x} y="22" width="72" height="96" rx="7" fill="#1a2640" stroke={colors[i]} strokeWidth="1.2"/>
              <circle cx={x+36} cy="46" r="14" fill={colors[i]} opacity="0.25"/>
              <circle cx={x+36} cy="40" r="7" fill={colors[i]} opacity="0.7"/>
              <path d={`M${x+18} 58 Q${x+36} 52 ${x+54} 58 L${x+56} 74 Q${x+36} 78 ${x+16} 74Z`} fill={colors[i]} opacity="0.5"/>
              <text x={x+36} y="92" fill={colors[i]} fontSize="8.5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">{labels[i]}</text>
              <text x={x+36} y="104" fill="#8a9ab5" fontSize="7" textAnchor="middle" fontFamily="sans-serif">{sub[i]}</text>
            </g>
          );
        })}
        <text x="140" y="135" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Different people visit for different reasons.</text>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Name them so we design for each one.</text>
      </svg>
    ),
    caption: "Who exactly visits your site? Not everyone — be specific about your audience.",
  },

  B2: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Three cards, middle spotlit */}
        {[0,1,2].map(i => {
          const x = 24 + i * 84;
          const isMain = i === 1;
          const col = isMain ? "#d4a93c" : "#2a3a55";
          const textCol = isMain ? "#d4a93c" : "#4a6fa5";
          return (
            <g key={i}>
              <rect x={x} y={isMain ? 14 : 28} width="72" height={isMain ? 100 : 80} rx="7"
                fill={isMain ? "#1e2d45" : "#141e2e"} stroke={col} strokeWidth={isMain ? 2 : 1}
                opacity={isMain ? 1 : 0.5}/>
              <circle cx={x+36} cy={isMain ? 38 : 48} r={isMain ? 16 : 11} fill={col} opacity={isMain ? 0.3 : 0.15}/>
              <circle cx={x+36} cy={isMain ? 32 : 43} r={isMain ? 9 : 6} fill={col} opacity={isMain ? 0.8 : 0.35}/>
              {isMain && <path d="M156 52 Q176 46 196 52 L198 74 Q176 78 154 74Z" fill="#d4a93c" opacity="0.5"/>}
              {isMain && <text x="176" y="88" fill="#d4a93c" fontSize="9" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">PRIMARY</text>}
              {isMain && <text x="176" y="100" fill="#8a9ab5" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Design for this person first</text>}
            </g>
          );
        })}
        {/* spotlight rays */}
        <line x1="176" y1="14" x2="150" y2="0" stroke="#d4a93c" strokeWidth="1" opacity="0.3"/>
        <line x1="176" y1="14" x2="176" y2="0" stroke="#d4a93c" strokeWidth="1" opacity="0.3"/>
        <line x1="176" y1="14" x2="202" y2="0" stroke="#d4a93c" strokeWidth="1" opacity="0.3"/>
        {/* Audience labels below cards */}
        <text x="60" y="120" fill="#2a3a55" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Secondary</text>
        <text x="176" y="122" fill="#d4a93c" fontSize="8" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">★ Primary</text>
        <text x="228" y="120" fill="#2a3a55" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Secondary</text>
        <line x1="30" y1="127" x2="250" y2="127" stroke="#1a2640" strokeWidth="1"/>
        <text x="140" y="140" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">One audience drives the most value.</text>
        <text x="140" y="153" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Every design choice serves them first.</text>
      </svg>
    ),
    caption: "Pick your primary audience. Design everything around that one person first.",
  },

  B3: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Person arriving */}
        <circle cx="52" cy="68" r="16" fill="#1a3050"/>
        <circle cx="52" cy="62" r="8" fill="#4a6fa5"/>
        <path d="M36 80 Q52 74 68 80 L70 98 Q52 103 34 98Z" fill="#4a6fa5"/>
        {/* Arrow pointing right */}
        <line x1="76" y1="74" x2="100" y2="74" stroke="#d4a93c" strokeWidth="2" strokeDasharray="4 3"/>
        <polygon points="98,70 106,74 98,78" fill="#d4a93c"/>
        {/* Browser screen */}
        <rect x="108" y="40" width="140" height="88" rx="6" fill="#1a2640" stroke="#2a3a55" strokeWidth="1"/>
        <rect x="108" y="40" width="140" height="18" rx="6" fill="#0f1c30"/>
        <rect x="108" y="50" width="140" height="8" fill="#0f1c30"/>
        <circle cx="120" cy="49" r="3" fill="#e74c3c" opacity="0.7"/>
        <circle cx="131" cy="49" r="3" fill="#f39c12" opacity="0.7"/>
        <rect x="116" y="66" width="120" height="7" rx="3" fill="#d4a93c" opacity="0.75"/>
        <rect x="116" y="79" width="100" height="5" rx="2.5" fill="#4a6fa5" opacity="0.5"/>
        <rect x="116" y="90" width="80" height="5" rx="2.5" fill="#4a6fa5" opacity="0.4"/>
        {/* Question bubble */}
        <rect x="30" y="20" width="116" height="30" rx="8" fill="#1e2d45" stroke="#d4a93c" strokeWidth="1.2"/>
        <polygon points="52,50 46,56 58,56" fill="#1e2d45"/>
        <text x="88" y="32" fill="#d4a93c" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">"Can they do what I need?"</text>
        <text x="88" y="44" fill="#8a9ab5" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Their first unspoken question</text>
        <text x="140" y="140" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Answer their question in the first 5 seconds</text>
        <text x="140" y="152" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">or they leave and never come back.</text>
      </svg>
    ),
    caption: "Your visitor arrives with a question. What is it? Answer it before they ask.",
  },

  B4: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Journey steps */}
        {[
          { x: 20, label: "Arrives", icon: "👁", col: "#4a6fa5" },
          { x: 85, label: "Reads / Watches", icon: "📖", col: "#8e44ad" },
          { x: 150, label: "Decides", icon: "💡", col: "#d4a93c" },
          { x: 215, label: "Acts", icon: "✅", col: "#2ecc71" },
        ].map((step, i) => (
          <g key={i}>
            <circle cx={step.x + 25} cy="65" r="22" fill="#1a2640" stroke={step.col} strokeWidth="1.5"/>
            <text x={step.x + 25} y="70" textAnchor="middle" fontSize="14" fontFamily="sans-serif">{step.icon}</text>
            <text x={step.x + 25} y="102" fill={step.col} fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">{step.label}</text>
          </g>
        ))}
        {/* Arrows between steps */}
        {[0,1,2].map(i => (
          <g key={i}>
            <line x1={65 + i*65} y1="65" x2={80 + i*65} y2="65" stroke="#2a3a55" strokeWidth="1.5" strokeDasharray="3 2"/>
            <polygon points={`${78+i*65},61 ${86+i*65},65 ${78+i*65},69`} fill="#2a3a55"/>
          </g>
        ))}
        {/* CTA box at bottom */}
        <rect x="190" y="110" width="70" height="22" rx="6" fill="#2ecc71" opacity="0.9"/>
        <text x="225" y="125" fill="#0d1521" fontSize="9" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Book a Call →</text>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Define the desired action → we engineer the page around it.</text>
      </svg>
    ),
    caption: "A successful visit ends with action — a call made, a form submitted, a decision reached.",
  },

  /* ── Section C: Goals ── */
  C1: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Chart axes */}
        <line x1="35" y1="110" x2="245" y2="110" stroke="#2a3a55" strokeWidth="1.5"/>
        <line x1="35" y1="20" x2="35" y2="110" stroke="#2a3a55" strokeWidth="1.5"/>
        {/* Growth line */}
        <polyline points="35,108 75,95 115,82 155,60 195,38 235,20" fill="none" stroke="#d4a93c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Milestone flag — anchored to x=195,y=38 on the growth line */}
        <line x1="195" y1="18" x2="195" y2="38" stroke="#2ecc71" strokeWidth="1.5"/>
        <rect x="148" y="18" width="56" height="15" rx="3" fill="#2ecc71" opacity="0.85"/>
        <text x="176" y="29" fill="#0d1521" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Goal reached ✓</text>
        {/* X axis labels */}
        <text x="35" y="122" fill="#4a6fa5" fontSize="7" textAnchor="middle" fontFamily="sans-serif">Now</text>
        <text x="235" y="122" fill="#4a6fa5" fontSize="7" textAnchor="middle" fontFamily="sans-serif">6 mo</text>
        {/* Y label */}
        <text x="28" y="65" fill="#4a6fa5" fontSize="7" textAnchor="middle" fontFamily="sans-serif" transform="rotate(-90,28,65)">Results</text>
        {/* Metric chips */}
        <rect x="50" y="130" width="52" height="14" rx="4" fill="#1a2640"/>
        <text x="76" y="140" fill="#4a6fa5" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Enquiries ↑</text>
        <rect x="112" y="130" width="56" height="14" rx="4" fill="#1a2640"/>
        <text x="140" y="140" fill="#d4a93c" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Revenue ↑</text>
        <rect x="178" y="130" width="52" height="14" rx="4" fill="#1a2640"/>
        <text x="204" y="140" fill="#2ecc71" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Bookings ↑</text>
        <text x="140" y="155" fill="#8a9ab5" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Define what success looks like before we build anything.</text>
      </svg>
    ),
    caption: "Define success before we build anything. What outcome tells you this was worth it?",
  },

  C2: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Goal list */}
        {[
          { rank: "1", label: "Get more enquiries", col: "#d4a93c", w: 160 },
          { rank: "2", label: "Show portfolio of work", col: "#3a7bd5", w: 130 },
          { rank: "3", label: "Build brand credibility", col: "#8e44ad", w: 100 },
          { rank: "4", label: "Rank on Google", col: "#2ecc71", w: 75 },
        ].map((g, i) => (
          <g key={i}>
            <rect x="28" y={20 + i*30} width="224" height="22" rx="5" fill="#141e2e"/>
            {/* Rank badge */}
            <rect x="28" y={20+i*30} width="24" height="22" rx="5" fill={g.col} opacity="0.85"/>
            <text x="40" y={35+i*30} fill="#0d1521" fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">{g.rank}</text>
            {/* Progress bar */}
            <rect x="60" y={28+i*30} width="184" height="6" rx="3" fill="#1a2640"/>
            <rect x="60" y={28+i*30} width={g.w} height="6" rx="3" fill={g.col} opacity="0.7"/>
            <text x="64" y={35+i*30} fill="#e0e8f0" fontSize="8" fontFamily="sans-serif">{g.label}</text>
          </g>
        ))}
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Ranking reveals priorities — #1 gets the most screen space and budget.</text>
      </svg>
    ),
    caption: "Ranking forces honesty. What matters most shapes every design decision.",
  },

  C3: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Webpage wireframe */}
        <rect x="20" y="14" width="240" height="118" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        {/* Nav bar */}
        <rect x="20" y="14" width="240" height="18" rx="7" fill="#0f1c30"/>
        <rect x="20" y="24" width="240" height="8" fill="#0f1c30"/>
        <rect x="28" y="18" width="30" height="8" rx="3" fill="#2a3a55"/>
        <rect x="180" y="18" width="22" height="8" rx="3" fill="#2a3a55" opacity="0.6"/>
        <rect x="208" y="18" width="22" height="8" rx="3" fill="#2a3a55" opacity="0.6"/>
        {/* Hero text */}
        <rect x="32" y="36" width="120" height="9" rx="3" fill="#4a6fa5" opacity="0.6"/>
        <rect x="32" y="50" width="100" height="6" rx="3" fill="#2a3a55" opacity="0.5"/>
        <rect x="32" y="61" width="90" height="6" rx="3" fill="#2a3a55" opacity="0.4"/>
        {/* CTA BUTTON — highlighted */}
        <rect x="32" y="76" width="110" height="28" rx="7" fill="#d4a93c"/>
        <text x="87" y="94" fill="#0d1521" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Book a Free Call →</text>
        {/* Glow behind CTA */}
        <rect x="28" y="72" width="118" height="36" rx="9" fill="none" stroke="#d4a93c" strokeWidth="2" opacity="0.4"/>
        {/* Arrow pointing to CTA */}
        <line x1="220" y1="55" x2="160" y2="86" stroke="#d4a93c" strokeWidth="1.5" strokeDasharray="4 3"/>
        <polygon points="161,80 155,90 168,88" fill="#d4a93c"/>
        <rect x="180" y="42" width="66" height="16" rx="4" fill="#1a2640" stroke="#d4a93c" strokeWidth="1"/>
        <text x="213" y="53" fill="#d4a93c" fontSize="8" textAnchor="middle" fontFamily="sans-serif">One main action</text>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">One CTA, made impossible to miss = more conversions.</text>
      </svg>
    ),
    caption: "One dominant call-to-action. Make it obvious. Make it impossible to miss.",
  },

  /* ── Section D: Pages ── */
  D_home: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Browser chrome */}
        <rect x="16" y="10" width="248" height="136" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        <rect x="16" y="10" width="248" height="18" rx="7" fill="#0f1c30"/>
        <rect x="16" y="20" width="248" height="8" fill="#0f1c30"/>
        <circle cx="28" cy="19" r="3.5" fill="#e74c3c" opacity="0.7"/>
        <circle cx="40" cy="19" r="3.5" fill="#f39c12" opacity="0.7"/>
        <circle cx="52" cy="19" r="3.5" fill="#2ecc71" opacity="0.7"/>
        <rect x="68" y="14" width="148" height="10" rx="4" fill="#1a3050"/>
        {/* NAV */}
        <rect x="16" y="28" width="248" height="16" fill="#0d1521"/>
        <rect x="24" y="31" width="28" height="8" rx="3" fill="#d4a93c" opacity="0.7"/>
        <rect x="170" y="31" width="22" height="8" rx="3" fill="#2a3a55" opacity="0.6"/>
        <rect x="198" y="31" width="22" height="8" rx="3" fill="#2a3a55" opacity="0.6"/>
        <rect x="226" y="31" width="28" height="8" rx="4" fill="#d4a93c" opacity="0.85"/>
        {/* Hero section */}
        <rect x="16" y="44" width="248" height="52" fill="#1a2640"/>
        <rect x="26" y="52" width="100" height="8" rx="3" fill="#e0e8f0" opacity="0.8"/>
        <rect x="26" y="65" width="80" height="5" rx="2.5" fill="#8a9ab5" opacity="0.6"/>
        <rect x="26" y="76" width="60" height="14" rx="5" fill="#d4a93c"/>
        <text x="56" y="87" fill="#0d1521" fontSize="8" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Get Started</text>
        <rect x="150" y="48" width="106" height="44" rx="4" fill="#0f1c30" opacity="0.7"/>
        <rect x="158" y="56" width="90" height="28" rx="3" fill="#1a3050" opacity="0.8"/>
        {/* 3 feature blocks */}
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x={26+i*78} y="100" width="70" height="30" rx="4" fill="#141e2e"/>
            <rect x={32+i*78} y="105" width="16" height="10" rx="3" fill="#3a7bd5" opacity="0.7"/>
            <rect x={32+i*78} y="118" width="52" height="5" rx="2.5" fill="#2a3a55"/>
          </g>
        ))}
        {/* Footer line */}
        <rect x="16" y="134" width="248" height="12" rx="4" fill="#0f1c30"/>
        <text x="140" y="142" fill="#4a6fa5" fontSize="7" textAnchor="middle" fontFamily="sans-serif">Nav · Hero · Feature blocks · Footer</text>
      </svg>
    ),
    caption: "The home page is your digital front door — first impression, hero shot, clear headline.",
  },

  D_about: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Page frame */}
        <rect x="16" y="12" width="248" height="132" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        {/* Header bar */}
        <rect x="16" y="12" width="248" height="18" rx="7" fill="#0f1c30"/>
        <rect x="16" y="22" width="248" height="8" fill="#0f1c30"/>
        <rect x="24" y="16" width="40" height="8" rx="3" fill="#2a3a55"/>
        {/* "About" heading */}
        <rect x="26" y="36" width="60" height="9" rx="3" fill="#d4a93c" opacity="0.8"/>
        {/* Team photo area */}
        <rect x="26" y="50" width="100" height="60" rx="5" fill="#1a3050"/>
        {/* People silhouettes in photo */}
        {[0,1,2].map(i => (
          <g key={i}>
            <circle cx={46+i*28} cy="68" r="8" fill="#4a6fa5" opacity={0.5+i*0.15}/>
            <path d={`M${34+i*28} 78 Q${46+i*28} 73 ${58+i*28} 78 L${60+i*28} 100 Q${46+i*28} 104 ${32+i*28} 100Z`}
              fill="#4a6fa5" opacity={0.4+i*0.1}/>
          </g>
        ))}
        <rect x="26" y="112" width="100" height="6" rx="3" fill="#2a3a55" opacity="0.5"/>
        {/* Story / bio text */}
        <rect x="136" y="50" width="118" height="7" rx="3" fill="#e0e8f0" opacity="0.5"/>
        <rect x="136" y="63" width="108" height="5" rx="2.5" fill="#2a3a55" opacity="0.5"/>
        <rect x="136" y="73" width="114" height="5" rx="2.5" fill="#2a3a55" opacity="0.4"/>
        <rect x="136" y="83" width="100" height="5" rx="2.5" fill="#2a3a55" opacity="0.4"/>
        <rect x="136" y="93" width="88" height="5" rx="2.5" fill="#2a3a55" opacity="0.3"/>
        <rect x="136" y="106" width="60" height="14" rx="5" fill="#3a7bd5" opacity="0.8"/>
        <text x="166" y="117" fill="#e0e8f0" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Our Story →</text>
        <text x="140" y="152" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Team photo + company story = trust before the first call.</text>
      </svg>
    ),
    caption: "The About page builds trust. Who you are, why you exist, why clients should choose you.",
  },

  D_projects: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Page header */}
        <rect x="16" y="12" width="248" height="16" rx="6" fill="#0f1c30"/>
        <rect x="24" y="16" width="40" height="8" rx="3" fill="#2a3a55"/>
        {/* Portfolio grid — 2×2 */}
        {[0,1,2,3].map(i => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 16 + col * 128;
          const y = 32 + row * 60;
          const colors = ["#3a7bd5","#d4a93c","#2ecc71","#8e44ad"];
          return (
            <g key={i}>
              <rect x={x+4} y={y+2} width="116" height="52" rx="5" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
              <rect x={x+4} y={y+2} width="116" height="30" rx="5" fill={colors[i]} opacity="0.2"/>
              <rect x={x+12} y={y+10} width="60" height="5" rx="2" fill={colors[i]} opacity="0.5"/>
              <rect x={x+12} y={y+18} width="80" height="3" rx="1.5" fill="#2a3a55"/>
              <rect x={x+12} y={y+36} width="90" height="5" rx="2.5" fill="#2a3a55" opacity="0.6"/>
              <rect x={x+12} y={y+44} width="70" height="5" rx="2.5" fill="#2a3a55" opacity="0.4"/>
            </g>
          );
        })}
        <text x="140" y="152" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">A portfolio grid shows your best work — results speak louder than words.</text>
      </svg>
    ),
    caption: "Show your best work. A portfolio page lets results speak louder than words.",
  },

  D_contact: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Contact icons row */}
        {[
          { icon: "📞", label: "Phone", col: "#2ecc71", x: 42 },
          { icon: "✉️", label: "Email", col: "#3a7bd5", x: 140 },
          { icon: "📝", label: "Form", col: "#d4a93c", x: 238 },
        ].map(c => (
          <g key={c.x}>
            <circle cx={c.x} cy="50" r="24" fill="#1a2640" stroke={c.col} strokeWidth="1.5"/>
            <text x={c.x} y="57" textAnchor="middle" fontSize="18" fontFamily="sans-serif">{c.icon}</text>
            <text x={c.x} y="87" fill={c.col} fontSize="9" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">{c.label}</text>
          </g>
        ))}
        {/* Form wireframe */}
        <rect x="30" y="96" width="220" height="48" rx="6" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        <rect x="40" y="104" width="90" height="10" rx="3" fill="#1a3050"/>
        <rect x="140" y="104" width="100" height="10" rx="3" fill="#1a3050"/>
        <rect x="40" y="120" width="200" height="10" rx="3" fill="#1a3050"/>
        <rect x="160" y="134" width="80" height="14" rx="5" fill="#d4a93c"/>
        <text x="200" y="145" fill="#0d1521" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Send Enquiry →</text>
        <text x="140" y="156" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">The contact page converts interest into action.</text>
      </svg>
    ),
    caption: "The contact page converts interest into action. Make it effortless to reach you.",
  },

  D_other: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Three modular page blocks */}
        {[
          { label: "Services", icon: "⚙️", col: "#3a7bd5", x: 18 },
          { label: "FAQ", icon: "❓", col: "#d4a93c", x: 106 },
          { label: "Blog", icon: "📰", col: "#2ecc71", x: 194 },
        ].map(b => (
          <g key={b.x}>
            <rect x={b.x} y="16" width="76" height="104" rx="7" fill="#141e2e" stroke={b.col} strokeWidth="1.2"/>
            <rect x={b.x} y="16" width="76" height="24" rx="7" fill={b.col} opacity="0.2"/>
            <rect x={b.x} y="32" width="76" height="8" fill={b.col} opacity="0.1"/>
            <text x={b.x+38} y="32" textAnchor="middle" fontSize="14" fontFamily="sans-serif">{b.icon}</text>
            <text x={b.x+38} y="52" fill={b.col} fontSize="9" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">{b.label}</text>
            <rect x={b.x+8} y="60" width="60" height="5" rx="2.5" fill="#2a3a55" opacity="0.6"/>
            <rect x={b.x+8} y="70" width="52" height="5" rx="2.5" fill="#2a3a55" opacity="0.5"/>
            <rect x={b.x+8} y="80" width="46" height="5" rx="2.5" fill="#2a3a55" opacity="0.4"/>
            <rect x={b.x+8} y="96" width="60" height="14" rx="4" fill={b.col} opacity="0.7"/>
            <text x={b.x+38} y="107" fill="#0d1521" fontSize="8" textAnchor="middle" fontFamily="sans-serif">View →</text>
          </g>
        ))}
        <text x="140" y="135" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Extra pages let you go deeper on any topic.</text>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Tell us what you need — we'll build it in.</text>
      </svg>
    ),
    caption: "Extra pages for specific needs — services, FAQs, testimonials, or anything else.",
  },

  /* ── Section E: Future Plans ── */
  E1: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Title */}
        <text x="140" y="22" fill="#d4a93c" fontSize="9" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" opacity="0.8">Website Roadmap</text>
        {/* Timeline line */}
        <line x1="30" y1="60" x2="250" y2="60" stroke="#2a3a55" strokeWidth="2"/>
        {/* Phase 1 — Launch */}
        <circle cx="70" cy="60" r="14" fill="#d4a93c" opacity="0.9"/>
        <text x="70" y="65" fill="#0d1521" fontSize="9" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">v1</text>
        <rect x="28" y="80" width="84" height="52" rx="5" fill="#1a2640" stroke="#d4a93c" strokeWidth="1.5"/>
        <text x="70" y="96" fill="#d4a93c" fontSize="9" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Launch</text>
        <rect x="36" y="103" width="68" height="5" rx="2.5" fill="#2a3a55"/>
        <rect x="36" y="113" width="56" height="5" rx="2.5" fill="#2a3a55" opacity="0.7"/>
        <rect x="36" y="123" width="44" height="5" rx="2.5" fill="#2a3a55" opacity="0.5"/>
        {/* Phase 2 & 3 nodes */}
        {[150, 210].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy="60" r="12" fill="#1a3050" stroke="#4a6fa5" strokeWidth="1.5" strokeDasharray="3 2"/>
            <text x={cx} y="65" fill="#4a6fa5" fontSize="9" textAnchor="middle" fontFamily="sans-serif">v{i+2}</text>
            <rect x={cx-40} y="80" width="80" height="52" rx="5" fill="#141e2e" stroke="#2a3a55" strokeWidth="1" opacity="0.7"/>
            <text x={cx} y="96" fill="#4a6fa5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Future</text>
            <rect x={cx-34} y="103" width="68" height="5" rx="2.5" fill="#1a2640" opacity="0.6"/>
            <rect x={cx-34} y="113" width="50" height="5" rx="2.5" fill="#1a2640" opacity="0.4"/>
            <rect x={cx-34} y="123" width="38" height="5" rx="2.5" fill="#1a2640" opacity="0.3"/>
          </g>
        ))}
        <text x="140" y="150" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Plan now → build in phases → no expensive rebuilds later.</text>
      </svg>
    ),
    caption: "Tick what might be useful later — no commitment, just planting seeds for the future.",
  },

  E2: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Browser with bookmark bar */}
        <rect x="16" y="14" width="248" height="118" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        <rect x="16" y="14" width="248" height="20" rx="7" fill="#0f1c30"/>
        <rect x="16" y="26" width="248" height="8" fill="#0f1c30"/>
        <circle cx="28" cy="24" r="3" fill="#e74c3c" opacity="0.7"/>
        <circle cx="40" cy="24" r="3" fill="#f39c12" opacity="0.7"/>
        <circle cx="52" cy="24" r="3" fill="#2ecc71" opacity="0.7"/>
        <rect x="64" y="18" width="140" height="12" rx="4" fill="#1a3050"/>
        <text x="134" y="28" fill="#4a6fa5" fontSize="8" textAnchor="middle" fontFamily="monospace">apple.com</text>
        {/* Bookmark bar */}
        <rect x="16" y="34" width="248" height="14" fill="#0d1521"/>
        {["airbnb.com","stripe.com","notion.so","linear.app"].map((s,i) => (
          <g key={i}>
            <rect x={20+i*58} y="37" width="50" height="8" rx="3" fill="#1a2640"/>
            <text x={45+i*58} y="44" fill="#4a6fa5" fontSize="7" textAnchor="middle" fontFamily="sans-serif">{s}</text>
          </g>
        ))}
        {/* Main page content */}
        <rect x="24" y="52" width="232" height="70" rx="5" fill="#1a2640"/>
        <rect x="32" y="60" width="110" height="10" rx="3" fill="#d4a93c" opacity="0.6"/>
        <rect x="32" y="76" width="160" height="6" rx="3" fill="#4a6fa5" opacity="0.4"/>
        <rect x="32" y="87" width="140" height="6" rx="3" fill="#4a6fa5" opacity="0.3"/>
        <rect x="32" y="100" width="90" height="14" rx="5" fill="#3a7bd5" opacity="0.8"/>
        {/* Star / bookmark icon */}
        <text x="240" y="65" fontSize="16" fontFamily="sans-serif" opacity="0.8">⭐</text>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Share any site you've bookmarked — we extract the style you love.</text>
      </svg>
    ),
    caption: "Seen something on another site you loved? Share it — inspiration beats description.",
  },

  /* ── Section F: Look & Feel ── */
  F1: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Mood board grid */}
        {[
          { label: "Premium", col: "#d4a93c", bg: "#1e2a14", x: 16, y: 14 },
          { label: "Modern", col: "#3a7bd5", bg: "#0f1e30", x: 148, y: 14 },
          { label: "Warm &\nFriendly", col: "#e67e22", bg: "#1e180e", x: 16, y: 84 },
          { label: "Bold &\nStrong", col: "#c0392b", bg: "#1e0f0f", x: 148, y: 84 },
        ].map(t => (
          <g key={t.label}>
            <rect x={t.x} y={t.y} width="124" height="66" rx="7" fill={t.bg} stroke={t.col} strokeWidth="1.5"/>
            {/* Abstract shape representing the vibe */}
            <rect x={t.x+8} y={t.y+8} width="46" height="28" rx="5" fill={t.col} opacity="0.2"/>
            <rect x={t.x+14} y={t.y+13} width="34" height="18" rx="3" fill={t.col} opacity="0.4"/>
            {t.label.split("\n").map((line, li) => (
              <text key={li} x={t.x+62} y={t.y+22+li*13} fill={t.col} fontSize="9.5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">{line}</text>
            ))}
            <rect x={t.x+8} y={t.y+48} width="108" height="5" rx="2.5" fill={t.col} opacity="0.3"/>
          </g>
        ))}
        <text x="140" y="157" fill="#8a9ab5" fontSize="7" textAnchor="middle" fontFamily="sans-serif">Vibe words → colour palette → typography → layout.</text>
      </svg>
    ),
    caption: "Choose words that describe the feeling you want. These shape every colour and font choice.",
  },

  F2: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Three browser thumbnails stacked/fanned — centred in 280px viewBox */}
        {[2,1,0].map(i => (
          <g key={i} transform={`translate(${i*10},${i*7})`}>
            <rect x="30" y="14" width="208" height="116" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1" opacity={1-i*0.2}/>
            <rect x="30" y="14" width="208" height="18" rx="7" fill="#0f1c30" opacity={1-i*0.2}/>
            <rect x="30" y="24" width="208" height="8" fill="#0f1c30" opacity={1-i*0.2}/>
            <rect x="58" y="18" width="120" height="10" rx="4" fill="#1a3050" opacity={1-i*0.2}/>
          </g>
        ))}
        {/* Front browser content */}
        <rect x="36" y="48" width="196" height="46" fill="#1a3050" opacity="0.8"/>
        <rect x="44" y="56" width="90" height="9" rx="3" fill="#d4a93c" opacity="0.7"/>
        <rect x="44" y="70" width="120" height="5" rx="2.5" fill="#4a6fa5" opacity="0.5"/>
        <rect x="44" y="80" width="100" height="5" rx="2.5" fill="#4a6fa5" opacity="0.4"/>
        <rect x="44" y="96" width="80" height="14" rx="5" fill="#3a7bd5" opacity="0.7"/>
        {/* URL with link icon */}
        <text x="140" y="28" fill="#4a6fa5" fontSize="8" textAnchor="middle" fontFamily="monospace">www.admired-site.com</text>
        <text x="140" y="136" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">One URL tells us more than a hundred adjectives.</text>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">We'll extract the exact elements you love.</text>
      </svg>
    ),
    caption: "Paste any URL you admire. A link is worth a thousand adjectives.",
  },

  F3: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* 4 bad pattern cards with red X */}
        {[
          { lines: ["Auto-play", "video"], icon: "🎬", x: 16, y: 14 },
          { lines: ["Tiny unreadable", "text"], icon: "🔍", x: 148, y: 14 },
          { lines: ["Popup every", "2 seconds"], icon: "❌", x: 16, y: 86 },
          { lines: ["Cluttered", "homepage"], icon: "🗑", x: 148, y: 86 },
        ].map(b => (
          <g key={b.lines[0]}>
            <rect x={b.x} y={b.y} width="124" height="66" rx="6" fill="#1e1212" stroke="#c0392b" strokeWidth="1.2" opacity="0.85"/>
            <text x={b.x+16} y={b.y+22} fontSize="16" fontFamily="sans-serif">{b.icon}</text>
            {b.lines.map((ln, li) => (
              <text key={li} x={b.x+62} y={b.y+21+li*13} fill="#e74c3c" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">{ln}</text>
            ))}
            <line x1={b.x+8} y1={b.y+8} x2={b.x+26} y2={b.y+28} stroke="#e74c3c" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
            <line x1={b.x+8} y1={b.y+28} x2={b.x+26} y2={b.y+8} stroke="#e74c3c" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
            <rect x={b.x+8} y={b.y+48} width="108" height="5" rx="2.5" fill="#2a1a1a"/>
            <rect x={b.x+8} y={b.y+57} width="80" height="5" rx="2.5" fill="#2a1a1a" opacity="0.6"/>
          </g>
        ))}
        <text x="140" y="154" fill="#8a9ab5" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">What frustrates you? Tell us — we'll avoid every one.</text>
      </svg>
    ),
    caption: "Knowing what you hate is just as useful as knowing what you love.",
  },

  F4_tone: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Split screen */}
        {/* Left: Light/Airy */}
        <rect x="16" y="16" width="116" height="114" rx="7" fill="#f0f4f8"/>
        <rect x="16" y="16" width="116" height="22" rx="7" fill="#e8ecf0"/>
        <rect x="16" y="30" width="116" height="8" fill="#e8ecf0"/>
        <rect x="24" y="20" width="20" height="6" rx="2" fill="#2c3e50" opacity="0.7"/>
        <rect x="24" y="46" width="80" height="8" rx="3" fill="#2c3e50" opacity="0.6"/>
        <rect x="24" y="60" width="96" height="5" rx="2.5" fill="#7f8c8d" opacity="0.5"/>
        <rect x="24" y="70" width="80" height="5" rx="2.5" fill="#7f8c8d" opacity="0.4"/>
        <rect x="24" y="84" width="76" height="14" rx="5" fill="#2c3e50" opacity="0.8"/>
        <text x="62" y="93" fill="#f0f4f8" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Get Started</text>
        <text x="74" y="116" fill="#7f8c8d" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Light · Airy · Open</text>
        <text x="74" y="126" fill="#2c3e50" fontSize="8" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Clean &amp; Professional</text>
        {/* Divider */}
        <line x1="140" y1="16" x2="140" y2="130" stroke="#2a3a55" strokeWidth="1.5" strokeDasharray="4 3"/>
        {/* Right: Dark/Rich */}
        <rect x="148" y="16" width="116" height="114" rx="7" fill="#0d1521"/>
        <rect x="148" y="16" width="116" height="22" rx="7" fill="#0a1018"/>
        <rect x="148" y="30" width="116" height="8" fill="#0a1018"/>
        <rect x="156" y="20" width="20" height="6" rx="2" fill="#d4a93c" opacity="0.8"/>
        <rect x="156" y="46" width="80" height="8" rx="3" fill="#e0e8f0" opacity="0.8"/>
        <rect x="156" y="60" width="96" height="5" rx="2.5" fill="#4a6fa5" opacity="0.5"/>
        <rect x="156" y="70" width="80" height="5" rx="2.5" fill="#4a6fa5" opacity="0.4"/>
        <rect x="156" y="84" width="60" height="14" rx="5" fill="#d4a93c"/>
        <text x="186" y="93" fill="#0d1521" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Get Started</text>
        <text x="206" y="116" fill="#4a6fa5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Dark · Rich · Bold</text>
        <text x="206" y="126" fill="#d4a93c" fontSize="8" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Premium &amp; Confident</text>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Tone shapes the emotional first impression before a word is read.</text>
      </svg>
    ),
    caption: "Light and open, or dark and rich? Colour tone sets the entire emotional register.",
  },

  F4_balance: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Left: Image-heavy layout */}
        <rect x="16" y="16" width="116" height="114" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        <rect x="22" y="22" width="104" height="70" rx="4" fill="#1a3050"/>
        {/* Photo placeholder icon */}
        <rect x="40" y="38" width="68" height="38" rx="3" fill="#3a7bd5" opacity="0.3"/>
        <circle cx="74" cy="52" r="8" fill="#3a7bd5" opacity="0.4"/>
        <polygon points="48,72 74,44 100,72" fill="#3a7bd5" opacity="0.3"/>
        <rect x="22" y="96" width="60" height="5" rx="2.5" fill="#2a3a55"/>
        <rect x="22" y="106" width="50" height="5" rx="2.5" fill="#2a3a55" opacity="0.6"/>
        <rect x="22" y="116" width="40" height="10" rx="4" fill="#3a7bd5" opacity="0.5"/>
        <text x="74" y="143" fill="#3a7bd5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Photo-heavy</text>
        {/* Divider */}
        <line x1="140" y1="16" x2="140" y2="130" stroke="#2a3a55" strokeWidth="1.5" strokeDasharray="4 3"/>
        {/* Right: Text-heavy layout */}
        <rect x="148" y="16" width="116" height="114" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        <rect x="154" y="24" width="96" height="8" rx="3" fill="#d4a93c" opacity="0.7"/>
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x="154" y={38+i*11} width={80+Math.sin(i)*16} height="5" rx="2.5" fill="#4a6fa5" opacity={0.5-i*0.04}/>
        ))}
        <rect x="154" y="115" width="60" height="12" rx="4" fill="#d4a93c" opacity="0.8"/>
        <text x="212" y="143" fill="#d4a93c" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Text-heavy</text>
        <text x="140" y="153" fill="#8a9ab5" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Balance affects brand feel. Tell us your preference.</text>
      </svg>
    ),
    caption: "Photo-heavy or text-heavy? The balance changes how visitors experience your brand.",
  },

  F4_structure: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Left: Single-page scroll */}
        <rect x="16" y="16" width="116" height="114" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        <text x="74" y="28" fill="#d4a93c" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Single Page</text>
        {/* Vertical scroll sections */}
        {["Hero","About","Services","Contact"].map((s, i) => (
          <g key={s}>
            <rect x="24" y={32+i*22} width="100" height="18" rx="3" fill={i===0?"#1a3050":"#141e2e"} stroke="#2a3a55" strokeWidth={i===0?1.5:0.5}/>
            <rect x="30" y={36+i*22} width="40" height="5" rx="2" fill={i===0?"#d4a93c":"#2a3a55"} opacity={i===0?0.8:0.5}/>
            <text x="112" y={44+i*22} fill="#4a6fa5" fontSize="7" textAnchor="end" fontFamily="sans-serif">{s}</text>
          </g>
        ))}
        {/* Scroll arrow */}
        <text x="74" y="128" fill="#4a6fa5" fontSize="16" textAnchor="middle">↕</text>
        {/* Divider */}
        <line x1="140" y1="16" x2="140" y2="130" stroke="#2a3a55" strokeWidth="1.5" strokeDasharray="4 3"/>
        {/* Right: Multi-page nav */}
        <rect x="148" y="16" width="116" height="114" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        <text x="206" y="28" fill="#d4a93c" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Multi-Page</text>
        {/* Tab navigation */}
        <rect x="152" y="32" width="108" height="14" rx="3" fill="#0f1c30"/>
        {["Home","About","Work","Contact"].map((s, i) => (
          <g key={s}>
            <rect x={154+i*26} y={33} width="24" height="12" rx="2" fill={i===0?"#d4a93c":"#1a2640"} opacity={i===0?0.9:0.6}/>
            <text x={166+i*26} y="42" fill={i===0?"#0d1521":"#8a9ab5"} fontSize="6.5" textAnchor="middle" fontFamily="sans-serif">{s}</text>
          </g>
        ))}
        {/* Page content */}
        <rect x="152" y="50" width="108" height="70" rx="3" fill="#1a2640"/>
        <rect x="160" y="58" width="80" height="8" rx="3" fill="#d4a93c" opacity="0.6"/>
        <rect x="160" y="72" width="90" height="5" rx="2.5" fill="#2a3a55" opacity="0.5"/>
        <rect x="160" y="82" width="70" height="5" rx="2.5" fill="#2a3a55" opacity="0.4"/>
        <text x="140" y="148" fill="#8a9ab5" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Both are valid — content volume drives the choice.</text>
      </svg>
    ),
    caption: "One long scrolling page, or separate pages per topic? Both are valid — it depends on your content.",
  },

  F5: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Palette card */}
        <rect x="30" y="16" width="220" height="96" rx="9" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        {/* 4 colour swatches */}
        {[
          { col: "#1a2e4a", label: "Navy", role: "Primary" },
          { col: "#d4a93c", label: "Gold", role: "Accent" },
          { col: "#e8ecf0", label: "Light", role: "Background" },
          { col: "#2c3e50", label: "Dark", role: "Text" },
        ].map((sw, i) => (
          <g key={i}>
            <rect x={38+i*52} y="24" width="44" height="54" rx="5" fill={sw.col}/>
            <text x={60+i*52} y="88" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">{sw.label}</text>
            <text x={60+i*52} y="100" fill="#4a6fa5" fontSize="7" textAnchor="middle" fontFamily="sans-serif">{sw.role}</text>
          </g>
        ))}
        {/* Palette label */}
        <text x="140" y="128" fill="#d4a93c" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Your Brand Palette</text>
        {/* Arrows showing usage */}
        <text x="140" y="140" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Colours = instant personality. Share hex codes,</text>
        <text x="140" y="152" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">brand guidelines, or even a logo — we'll match it.</text>
      </svg>
    ),
    caption: "Colours communicate personality before a single word is read. Share what you have.",
  },

  /* ── Section G: Practical Details ── */
  G1: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Clipboard */}
        <rect x="50" y="20" width="180" height="120" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        <rect x="96" y="14" width="88" height="16" rx="5" fill="#1a2640" stroke="#2a3a55" strokeWidth="1"/>
        <rect x="50" y="20" width="180" height="16" rx="7" fill="#0f1c30"/>
        <rect x="50" y="28" width="180" height="8" fill="#0f1c30"/>
        {/* Checklist items */}
        {[
          { label: "Logo file (.png / .svg)", done: true },
          { label: "Professional photos", done: true },
          { label: "Website copy / text", done: true },
          { label: "Domain name", done: false },
          { label: "Brand guidelines", done: false },
        ].map((item, i) => (
          <g key={i}>
            <rect x="68" y={44+i*18} width="16" height="16" rx="4" fill={item.done?"#2ecc71":"#1a2640"} stroke={item.done?"#2ecc71":"#2a3a55"} strokeWidth="1.2"/>
            {item.done && <text x="76" y={57+i*18} fill="#0d1521" fontSize="11" textAnchor="middle" fontFamily="sans-serif">✓</text>}
            <rect x="92" y={49+i*18} width={item.done?130:110} height="6" rx="3" fill={item.done?"#4a6fa5":"#2a3a55"} opacity={item.done?0.7:0.4}/>
            {!item.done && <text x="218" y={57+i*18} fill="#e74c3c" fontSize="8" textAnchor="middle" fontFamily="sans-serif">needed</text>}
          </g>
        ))}
        <text x="140" y="152" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Each ✓ = one less delay. Missing items = extra cost &amp; time.</text>
      </svg>
    ),
    caption: "Tick everything you already have ready. Every asset saves time and budget.",
  },

  G2: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Browser address bar */}
        <rect x="20" y="30" width="240" height="36" rx="8" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        <circle cx="40" cy="48" r="8" fill="#2ecc71" opacity="0.3"/>
        <text x="40" y="52" fill="#2ecc71" fontSize="10" textAnchor="middle" fontFamily="sans-serif">🔒</text>
        <rect x="56" y="38" width="190" height="20" rx="5" fill="#0f1c30"/>
        <text x="150" y="52" fill="#d4a93c" fontSize="10" textAnchor="middle" fontFamily="monospace">yourbusiness.com.au</text>
        {/* Domain breakdown labels */}
        <line x1="80" y1="74" x2="80" y2="96" stroke="#4a6fa5" strokeWidth="1" strokeDasharray="3 2"/>
        <text x="80" y="106" fill="#4a6fa5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">www</text>
        <line x1="136" y1="74" x2="136" y2="96" stroke="#d4a93c" strokeWidth="1" strokeDasharray="3 2"/>
        <text x="148" y="106" fill="#d4a93c" fontSize="8" textAnchor="middle" fontFamily="sans-serif">yourbusiness</text>
        <line x1="208" y1="74" x2="208" y2="96" stroke="#2ecc71" strokeWidth="1" strokeDasharray="3 2"/>
        <text x="222" y="106" fill="#2ecc71" fontSize="8" textAnchor="middle" fontFamily="sans-serif">.com.au</text>
        <text x="80" y="118" fill="#8a9ab5" fontSize="7" textAnchor="middle" fontFamily="sans-serif">subdomain</text>
        <text x="148" y="118" fill="#8a9ab5" fontSize="7" textAnchor="middle" fontFamily="sans-serif">your name</text>
        <text x="222" y="118" fill="#8a9ab5" fontSize="7" textAnchor="middle" fontFamily="sans-serif">extension</text>
        <text x="140" y="136" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Your domain is your permanent address on the internet.</text>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Own it before someone else does — usually $20/yr.</text>
      </svg>
    ),
    caption: "Your domain is your permanent address on the internet — e.g. yourbusiness.com.au",
  },

  G3: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* 3 contact method icons */}
        {[
          { icon: "📞", label: "Phone", sub: "Immediate.\nHigh-intent leads.", col: "#2ecc71", x: 46 },
          { icon: "✉️", label: "Email", sub: "Async.\nDetail-heavy queries.", col: "#3a7bd5", x: 140 },
          { icon: "📋", label: "Form", sub: "Structured.\nFilters spam + quotes.", col: "#d4a93c", x: 234 },
        ].map(c => (
          <g key={c.x}>
            <circle cx={c.x} cy="50" r="24" fill="#1a2640" stroke={c.col} strokeWidth="1.5"/>
            <text x={c.x} y="58" textAnchor="middle" fontSize="17" fontFamily="sans-serif">{c.icon}</text>
            <text x={c.x} y="88" fill={c.col} fontSize="9" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">{c.label}</text>
            {c.sub.split("\n").map((line, i) => (
              <text key={i} x={c.x} y={100+i*11} fill="#8a9ab5" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">{line}</text>
            ))}
          </g>
        ))}
        <text x="140" y="144" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Each method suits a different type of client.</text>
        <text x="140" y="154" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Pick what fits how your business operates.</text>
      </svg>
    ),
    caption: "How do you want people to reach you? Phone, email, form — each suits different businesses.",
  },

  G4: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Social platform tiles */}
        {[
          { label: "LinkedIn", col: "#0077b5", icon: "in", x: 16, y: 10 },
          { label: "Facebook", col: "#1877f2", icon: "f", x: 104, y: 10 },
          { label: "Instagram", col: "#c13584", icon: "◉", x: 192, y: 10 },
          { label: "YouTube", col: "#ff0000", icon: "▶", x: 16, y: 84 },
          { label: "TikTok", col: "#69c9d0", icon: "♫", x: 104, y: 84 },
          { label: "X (Twitter)", col: "#8a9ab5", icon: "𝕏", x: 192, y: 84 },
        ].map(s => (
          <g key={s.label}>
            <rect x={s.x} y={s.y} width="76" height="66" rx="8" fill="#141e2e" stroke={s.col} strokeWidth="1.5"/>
            <circle cx={s.x+38} cy={s.y+26} r="16" fill={s.col} opacity="0.2"/>
            <text x={s.x+38} y={s.y+32} textAnchor="middle" fill={s.col} fontSize="15" fontFamily="sans-serif" fontWeight="bold">{s.icon}</text>
            <text x={s.x+38} y={s.y+52} fill={s.col} fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">{s.label}</text>
            <rect x={s.x+10} y={s.y+57} width="56" height="3.5" rx="2" fill={s.col} opacity="0.3"/>
          </g>
        ))}
        <text x="140" y="156" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Social links show you're active, credible, and reachable.</text>
      </svg>
    ),
    caption: "Social links extend your presence and show visitors you're active and credible.",
  },

  /* ── Section H: Q & A ── */
  H1: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Person with multiple question bubbles */}
        <circle cx="70" cy="80" r="20" fill="#1a3050"/>
        <circle cx="70" cy="73" r="10" fill="#4a6fa5"/>
        <path d="M52 92 Q70 85 88 92 L90 112 Q70 118 50 112Z" fill="#4a6fa5"/>
        {/* Question bubbles */}
        {[
          { x: 110, y: 22, q: "How long will it take?", w: 138 },
          { x: 110, y: 60, q: "How much will it cost?", w: 136 },
          { x: 110, y: 98, q: "What do I need to provide?", w: 158 },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height="26" rx="8" fill="#1a2640" stroke="#d4a93c" strokeWidth="1"/>
            <polygon points={`${b.x},${b.y+10} ${b.x-8},${b.y+13} ${b.x},${b.y+16}`} fill="#1a2640"/>
            <text x={b.x+b.w/2} y={b.y+16} fill="#d4a93c" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">{b.q}</text>
          </g>
        ))}
        <text x="140" y="140" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Every question you ask now saves confusion later.</text>
        <text x="140" y="152" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">There's no such thing as a stupid question here.</text>
      </svg>
    ),
    caption: "No question is too basic. The more you ask now, the fewer surprises at launch.",
  },

  H2: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Notepad */}
        <rect x="50" y="16" width="180" height="120" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        <rect x="50" y="16" width="180" height="18" rx="7" fill="#1a2640"/>
        <rect x="50" y="26" width="180" height="8" fill="#1a2640"/>
        <text x="140" y="29" fill="#d4a93c" fontSize="9" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">My Concerns</text>
        {/* Concern lines */}
        {[
          "What if I don't like the design?",
          "What if it goes over budget?",
          "What if it takes too long?",
          "What if I need changes later?",
        ].map((c, i) => (
          <g key={i}>
            <text x="68" y={52+i*20} fill="#e74c3c" fontSize="12" fontFamily="sans-serif">•</text>
            <rect x="80" y={44+i*20} width={140-i*8} height="7" rx="3" fill="#1a3050"/>
            <text x="84" y={52+i*20} fill="#8a9ab5" fontSize="8" fontFamily="sans-serif">{c}</text>
          </g>
        ))}
        {/* Check resolution */}
        <rect x="62" y="126" width="156" height="4" rx="2" fill="#2ecc71" opacity="0.3"/>
        <text x="140" y="148" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Write every concern — we address each one before work begins.</text>
      </svg>
    ),
    caption: "Concerns are completely normal. Write them down and we will address every single one.",
  },

  H3: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Boundary sign / shield */}
        <path d="M140 16 L186 32 L186 86 Q186 108 140 122 Q94 108 94 86 L94 32Z" fill="#1e1212" stroke="#e74c3c" strokeWidth="2"/>
        <text x="140" y="74" fill="#e74c3c" fontSize="36" textAnchor="middle" fontFamily="sans-serif">🚫</text>
        {/* Hard limit tags */}
        <rect x="16" y="124" width="116" height="18" rx="5" fill="#1e1212" stroke="#e74c3c" strokeWidth="1"/>
        <text x="74" y="136" fill="#e74c3c" fontSize="8" textAnchor="middle" fontFamily="sans-serif">No stock photos of suits</text>
        <rect x="148" y="124" width="116" height="18" rx="5" fill="#1e1212" stroke="#e74c3c" strokeWidth="1"/>
        <text x="206" y="136" fill="#e74c3c" fontSize="8" textAnchor="middle" fontFamily="sans-serif">No autoplay video/music</text>
        <text x="140" y="152" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Hard limits = fewer revisions. Be completely blunt.</text>
      </svg>
    ),
    caption: "Hard limits save everyone time. Be as blunt as you like here.",
  },

  H4: {
    type: "svg",
    svg: (
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect width="280" height="160" fill="#0d1521" rx="8"/>
        {/* Open notepad with pen */}
        <rect x="40" y="16" width="180" height="122" rx="7" fill="#141e2e" stroke="#2a3a55" strokeWidth="1"/>
        {/* Binding line */}
        <line x1="88" y1="16" x2="88" y2="138" stroke="#2a3a55" strokeWidth="1.5"/>
        {/* Ruled lines */}
        {[0,1,2,3,4,5,6].map(i => (
          <line key={i} x1="96" y1={38+i*14} x2="210" y2={38+i*14} stroke="#1a2640" strokeWidth="1"/>
        ))}
        {/* Handwritten-style text on lines */}
        <rect x="96" y="32" width="100" height="7" rx="2" fill="#4a6fa5" opacity="0.4"/>
        <rect x="96" y="46" width="80" height="7" rx="2" fill="#4a6fa5" opacity="0.3"/>
        <rect x="96" y="60" width="110" height="7" rx="2" fill="#4a6fa5" opacity="0.35"/>
        <rect x="96" y="74" width="70" height="7" rx="2" fill="#4a6fa5" opacity="0.25"/>
        {/* Pen */}
        <g transform="rotate(-30,185,90)">
          <rect x="178" y="72" width="10" height="50" rx="4" fill="#d4a93c"/>
          <polygon points="178,122 188,122 183,135" fill="#e0e8f0"/>
          <rect x="178" y="72" width="10" height="8" rx="2" fill="#b8860b"/>
        </g>
        <text x="140" y="146" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">This is an open field — no format required.</text>
        <text x="140" y="156" fill="#8a9ab5" fontSize="8" textAnchor="middle" fontFamily="sans-serif">The best insights often live here.</text>
      </svg>
    ),
    caption: "Final thoughts often contain the most important things. Don't hold back.",
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
   All entries are inline SVG infographics.
   Click thumbnail → popover via React Portal
   (portal bypasses ancestor transform/filter
   stacking contexts that break position:fixed)
───────────────────────────────────────── */
function VisualAid({ visKey }) {
  const [popover, setPopover] = useState(false);
  const v = VISUALS[visKey];
  if (!v) return null;

  const close = () => setPopover(false);

  // Close on Escape key
  useEffect(() => {
    if (!popover) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [popover]);

  return (
    <>
      <div
        className="visual-aid"
        onClick={() => setPopover(true)}
        role="button"
        tabIndex={0}
        title="Click to enlarge"
        aria-label={`View infographic: ${v.caption}`}
        onKeyDown={(e) => e.key === "Enter" && setPopover(true)}
      >
        <div className="visual-aid-expand-hint">🔍 enlarge</div>
        <div className="visual-aid-svg-thumb">
          {v.svg}
        </div>
        <div className="visual-aid-caption">{v.caption}</div>
      </div>

      {popover && createPortal(
        <>
          {/* Backdrop — rendered on document.body, immune to ancestor stacking contexts */}
          <div
            className="va-backdrop"
            onClick={close}
            aria-hidden="true"
          />
          {/* Popover panel */}
          <div
            className="va-popover"
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged infographic"
          >
            <button
              className="va-popover-close"
              onClick={close}
              aria-label="Close"
            >✕</button>
            <div className="va-popover-svg">
              {v.svg}
            </div>
            <div className="va-popover-caption">{v.caption}</div>
          </div>
        </>,
        document.body
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
  const [visitedSteps, setVisitedSteps] = useState(new Set()); // steps the user has actually landed on
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

  // Returns true if the section (by letter id e.g. 'A') has any filled fields
  const sectionHasData = (sectionId) => {
    const prefix = sectionId.toUpperCase();
    return Object.entries(form).some(([key, val]) => {
      if (!key.startsWith(prefix)) return false;
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'boolean') return val === true;
      return typeof val === 'string' && val.trim() !== '';
    });
  };

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
    // Mark the step we are LEAVING as visited (if it's a real section)
    setStep((prev) => {
      if (prev >= 1) {
        setVisitedSteps((vs) => {
          const next = new Set(vs);
          next.add(prev);
          return next;
        });
      }
      return newStep;
    });
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
              id: "fut_none",
              value: "None of these apply",
              label: "None of these / not sure yet",
              sub: "Skip this section for now",
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
                {
                  id: "dis_none",
                  value: "None of these / no strong dislikes",
                  label: "None of these",
                  sub: "No strong dislikes at this stage",
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
            {
              id: "cm_none",
              value: "Not sure yet / decide later",
              label: "Not sure yet",
              sub: "We'll figure this out when we get closer to launch",
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
              <img src="/favicon.svg" width="32" height="32" alt="PB" draggable="false" />
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
            <img src="/favicon.svg" width="32" height="32" alt="PB" draggable="false" />
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
                // Done = user has visited this step AND filled at least one field in it
                const hasData = sectionHasData(s.id);
                const wasVisited = visitedSteps.has(sIdx);
                const isDone = wasVisited && hasData && step !== sIdx;
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
                      style={isActive ? { background: s.color, borderColor: s.color, color: '#fff' } : isDone ? { background: s.color, borderColor: s.color, color: '#fff' } : undefined}
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
              <div style={{ marginTop: "18px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "6px",
                  marginBottom: "18px",
                }}>
                  {SECTIONS.map((s) => (
                    <div key={s.id} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      fontSize: "12px",
                      color: "var(--text-mid)",
                      padding: "7px 10px",
                      background: "var(--bg)",
                      border: `1.5px solid var(--border)`,
                      borderRadius: "7px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}>
                      <span style={{ fontSize: "14px", lineHeight: 1, flexShrink: 0 }}>{s.emoji}</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    type="button"
                    className="btn-nav btn-nav-primary"
                    style={{ fontSize: "13px", padding: "9px 36px", minHeight: "38px" }}
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
              <div className="wizard-nav" style={{ margin: "0 18px 18px" }}>
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
                    /* Last section — submit lives in the action bar only */
                    <button
                      type="button"
                      className="btn-nav btn-nav-gold"
                      onClick={() => setModalOpen(true)}
                      title="Submit your answers"
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

              {/* Submit — only in action bar when all sections visited AND not already on last section (which has its own submit in-nav) */}
              {allSectionsVisited && !isLastSection ? (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  style={BTN_GOLD}
                >
                  Submit answers ✓
                </button>
              ) : !allSectionsVisited ? (
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
              ) : null}
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
