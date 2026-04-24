"use strict";

(function () {
  var guideId = document.body.dataset.guide || "guide";
  var storageKey = "question_guide_progress_" + guideId;
  var state = {};
  var toastTimer;
  var GUIDE_CONFIG = {
    developerName: "Prabesh Bhetwal",
    formspreeEndpoint: "https://formspree.io/f/mykbowbn",
    emailjs_public_key: "fKgFK2YwaZ4q2H_8R",
    emailjs_service_id: "personalprojects",
    emailjs_template_id: "projects_template",
  };
  var VISUAL_LIBRARY = {
    identity: {
      title: "Business identity examples",
      intro:
        "Compare how a visitor reads a polished public brand versus the formal business details behind it.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=760&q=78",
          label: "Public brand impression",
          caption: "What visitors see first: name, tone, and credibility.",
        },
        {
          src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=760&q=78",
          label: "Formal business details",
          caption: "What supports domains, email, contracts, and footer text.",
        },
      ],
      chart: [
        ["Name clarity", 92],
        ["Trust", 78],
        ["Setup ease", 64],
      ],
      compare: [
        ["Clear", "One consistent name across website, domain, email, and footer."],
        ["Confusing", "Different names in different places create doubt."],
      ],
    },
    positioning: {
      title: "Positioning examples",
      intro:
        "The homepage should quickly show what kind of business this is and why it is different.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=760&q=78",
          label: "Professional service",
          caption: "A calm, credible image supports a serious business tone.",
        },
        {
          src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=760&q=78",
          label: "Specialist delivery",
          caption: "Specific proof helps visitors understand the business focus.",
        },
      ],
      chart: [
        ["Clarity", 88],
        ["Difference", 74],
        ["Memorability", 61],
      ],
      compare: [
        ["Strong", "A visitor can describe the business after one screen."],
        ["Weak", "The site feels attractive but could belong to anyone."],
      ],
    },
    audience: {
      title: "Audience examples",
      intro:
        "Different visitors need different proof. Choosing the main audience keeps the site focused.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=760&q=78",
          label: "Buyer or owner",
          caption: "Usually wants confidence, location, quality, and contact options.",
        },
        {
          src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=760&q=78",
          label: "Investor or partner",
          caption: "Usually wants track record, process, and credibility.",
        },
      ],
      chart: [
        ["Trust proof", 90],
        ["Clear action", 78],
        ["Detailed reading", 52],
      ],
      compare: [
        ["Primary audience", "The site is written mainly for the highest-value visitor."],
        ["Everyone equally", "The message becomes broad and less persuasive."],
      ],
    },
    action: {
      title: "Visitor action examples",
      intro:
        "The website should make the next step obvious, whether that is sending an enquiry or reviewing projects.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=760&q=78",
          label: "Online enquiry",
          caption: "Best when the visitor needs a low-pressure way to start.",
        },
        {
          src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=760&q=78",
          label: "Direct conversation",
          caption: "Best when trust is built through phone calls or meetings.",
        },
      ],
      chart: [
        ["Easy contact", 94],
        ["Lead quality", 70],
        ["Visitor effort", 38],
      ],
      compare: [
        ["Clear CTA", "One main button or form tells visitors what to do next."],
        ["Unclear CTA", "Visitors like the site but leave without contacting you."],
      ],
    },
    proof: {
      title: "Trust proof examples",
      intro:
        "Premium design helps, but proof is what makes a visitor believe the business is capable.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=760&q=78",
          label: "Completed work",
          caption: "Real work, projects, or outcomes make claims believable.",
        },
        {
          src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=760&q=78",
          label: "People and partners",
          caption: "Profiles, collaborators, and testimonials add confidence.",
        },
      ],
      chart: [
        ["Project proof", 92],
        ["Real people", 76],
        ["Generic claims", 34],
      ],
      compare: [
        ["Proof-led", "The site shows evidence before asking for trust."],
        ["Claim-led", "The site says 'trusted' without showing why."],
      ],
    },
    permissions: {
      title: "Content permission examples",
      intro:
        "Not every useful image, logo, or testimonial is safe to publish. Approval prevents awkward changes later.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=760&q=78",
          label: "Approved materials",
          caption: "Use images, documents, and claims that are cleared for public use.",
        },
        {
          src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=760&q=78",
          label: "Review before launch",
          caption: "Sensitive claims and partner names should be checked first.",
        },
      ],
      chart: [
        ["Approved", 88],
        ["Needs review", 55],
        ["Do not publish", 18],
      ],
      compare: [
        ["Safe", "Only approved assets and claims appear publicly."],
        ["Risky", "Private or unverified material is published too early."],
      ],
    },
    pages: {
      title: "Page structure examples",
      intro:
        "A focused first version can still feel complete when the pages answer the right questions.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=760&q=78",
          label: "Single-page structure",
          caption: "Good for a lean site with a clear story and contact form.",
        },
        {
          src: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=760&q=78",
          label: "Multi-page structure",
          caption: "Better when services, projects, and downloads need depth.",
        },
      ],
      chart: [
        ["Launch speed", 86],
        ["Content depth", 62],
        ["Future growth", 78],
      ],
      compare: [
        ["Launch now", "Only include pages that support the first decision."],
        ["Add later", "Save bigger features until content is ready."],
      ],
    },
    cms: {
      title: "Editable content examples",
      intro:
        "A private editing screen is useful when one section changes often. It is different from a full internal business system.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=760&q=78",
          label: "Simple project editing",
          caption: "Best for projects, updates, testimonials, or team profiles.",
        },
        {
          src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=760&q=78",
          label: "Full internal dashboard",
          caption: "Only needed for pipelines, tasks, reminders, and private workflows.",
        },
      ],
      chart: [
        ["Project editor", 86],
        ["Static pages", 68],
        ["Internal system", 28],
      ],
      compare: [
        ["Right-sized", "Edit the changing sections and keep the rest polished."],
        ["Overbuilt", "A full app adds maintenance before it is needed."],
      ],
    },
    design: {
      title: "Design direction examples",
      intro:
        "Reference websites are useful when you explain what you like about them, not just the link.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=760&q=78",
          label: "Premium and spacious",
          caption: "Large imagery, calm colours, and fewer words feel high-end.",
        },
        {
          src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=760&q=78",
          label: "Corporate and practical",
          caption: "Clear layout and restrained styling feel businesslike.",
        },
      ],
      chart: [
        ["Imagery", 90],
        ["Readability", 82],
        ["Animation", 24],
      ],
      compare: [
        ["Useful feedback", "I like the image scale, spacing, and simple menu."],
        ["Less useful", "I like this site, but I am not sure why."],
      ],
    },
    brand: {
      title: "Brand asset examples",
      intro:
        "Existing logo, colours, and fonts can guide the design. If they do not exist, a simple visual direction can start the project.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=760&q=78",
          label: "Existing brand kit",
          caption: "Logo, colours, and type choices keep the site consistent.",
        },
        {
          src: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=760&q=78",
          label: "New visual direction",
          caption: "A temporary direction can work until full branding is needed.",
        },
      ],
      chart: [
        ["Consistency", 88],
        ["Design speed", 72],
        ["Brand risk", 32],
      ],
      compare: [
        ["Prepared", "Use approved logo, colours, and imagery from the start."],
        ["Flexible", "Create a restrained style and refine branding later."],
      ],
    },
    setup: {
      title: "Ownership and setup examples",
      intro:
        "Domains, email, and form submissions should be easy to manage and clearly owned.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=760&q=78",
          label: "Domain ownership",
          caption: "The business should control key accounts and renewal notices.",
        },
        {
          src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=760&q=78",
          label: "Form submissions",
          caption: "Enquiries should go to the right inbox and be easy to review.",
        },
      ],
      chart: [
        ["Ownership clarity", 92],
        ["Maintenance ease", 80],
        ["Account risk", 22],
      ],
      compare: [
        ["Good handover", "The business owns the domain and knows where enquiries go."],
        ["Poor handover", "Important accounts sit under the wrong person."],
      ],
    },
    market: {
      title: "Market focus examples",
      intro:
        "Target markets help visitors understand where the business is active and what opportunities matter now.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=760&q=78",
          label: "Location focus",
          caption: "Suburbs, regions, and buyer markets make the site specific.",
        },
        {
          src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=760&q=78",
          label: "Property type focus",
          caption: "Residential, boutique, luxury, or mixed-use changes the story.",
        },
      ],
      chart: [
        ["Location clarity", 86],
        ["Audience fit", 78],
        ["Update need", 58],
      ],
      compare: [
        ["Specific", "Name the markets Bayview is actively targeting."],
        ["Generic", "Say 'property development' without location or focus."],
      ],
    },
    services: {
      title: "Services examples",
      intro:
        "A short service list should show what Bayview does without making the site feel overloaded.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=760&q=78",
          label: "Development delivery",
          caption: "Shows capability, process, and project outcomes.",
        },
        {
          src: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=760&q=78",
          label: "Partnership or acquisition",
          caption: "Shows who should contact Bayview and why.",
        },
      ],
      chart: [
        ["Core service", 88],
        ["Supporting service", 62],
        ["Public sensitivity", 44],
      ],
      compare: [
        ["Focused", "List the services that support the first website goal."],
        ["Too broad", "List everything and make the positioning less clear."],
      ],
    },
    projects: {
      title: "Project entry examples",
      intro:
        "Each project should have enough structure to look consistent when Bayview adds it through the admin area.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=760&q=78",
          label: "Completed project",
          caption: "Use strong images, location, type, status, and short description.",
        },
        {
          src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=760&q=78",
          label: "Market focus or coming soon",
          caption: "Useful when there is not a full gallery yet.",
        },
      ],
      chart: [
        ["Image quality", 92],
        ["Short description", 74],
        ["Private draft", 64],
      ],
      compare: [
        ["Structured", "Every project uses the same fields and stays polished."],
        ["Unstructured", "Different project formats make the site feel messy."],
      ],
    },
    domain: {
      title: "Domain and email examples",
      intro:
        "A good domain and matching email make the business easier to trust and remember.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=760&q=78",
          label: "Website address",
          caption: "Short, memorable, and aligned with the business name.",
        },
        {
          src: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=760&q=78",
          label: "Business email",
          caption: "A matching email looks more professional than a personal inbox.",
        },
      ],
      chart: [
        ["Trust", 86],
        ["Recall", 78],
        ["Setup effort", 46],
      ],
      compare: [
        ["Professional", "info@business.com.au and a matching website address."],
        ["Less polished", "A public site but only a personal email address."],
      ],
    },
  };

  function loadState() {
    try {
      state = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch (e) {
      state = {};
    }
  }

  function saveState() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {
      return;
    }
  }

  function updateAnswerMeter() {
    var checks = Array.prototype.slice.call(
      document.querySelectorAll(".question-check"),
    );
    var complete = checks.filter(function (check) {
      return check.checked;
    }).length;
    var total = checks.length;
    var percent = total ? Math.round((complete / total) * 100) : 0;

    document.querySelectorAll("[data-progress-text]").forEach(function (el) {
      el.textContent = complete + " of " + total + " answered";
    });
    document.querySelectorAll("[data-progress-fill]").forEach(function (el) {
      el.style.width = percent + "%";
    });
  }

  function updateScrollProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var progress = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    var bar = document.querySelector("[data-scroll-progress]");
    if (bar) bar.style.width = progress + "%";
  }

  function setActiveNav() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("[data-section]"),
    );
    var current = sections[0] ? sections[0].id : "";
    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top;
      if (top <= 140) current = section.id;
    });

    document.querySelectorAll(".guide-links a").forEach(function (link) {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + current,
      );
    });
  }

  function showToast(message) {
    var toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initializeEmailJS() {
    if (
      GUIDE_CONFIG.emailjs_public_key &&
      typeof emailjs !== "undefined" &&
      !window.__guideEmailJsReady
    ) {
      emailjs.init({ publicKey: GUIDE_CONFIG.emailjs_public_key });
      window.__guideEmailJsReady = true;
    }
  }

  function loadEmailJS() {
    if (typeof emailjs !== "undefined") {
      initializeEmailJS();
      return;
    }
    if (document.querySelector("script[data-guide-emailjs]")) return;

    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.async = true;
    script.dataset.guideEmailjs = "true";
    script.onload = initializeEmailJS;
    document.head.appendChild(script);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          showToast("Copied to clipboard.");
        },
        function () {
          showToast("Copy failed. Select the question manually.");
        },
      );
      return;
    }
    showToast("Clipboard is not available in this browser.");
  }

  function getVisualAidType(questionId) {
    var typeMap = {
      "g-business-1": "identity",
      "g-business-2": "positioning",
      "g-business-3": "positioning",
      "g-business-4": "positioning",
      "g-audience-1": "audience",
      "g-audience-2": "audience",
      "g-audience-3": "action",
      "g-content-1": "proof",
      "g-content-2": "permissions",
      "g-content-3": "permissions",
      "g-content-4": "cms",
      "g-scope-1": "pages",
      "g-scope-2": "pages",
      "g-scope-3": "cms",
      "g-design-1": "design",
      "g-design-2": "design",
      "g-design-3": "brand",
      "g-setup-1": "setup",
      "g-setup-2": "setup",
      "g-setup-3": "cms",
      "g-setup-4": "setup",
      "b-identity-1": "identity",
      "b-identity-2": "identity",
      "b-identity-3": "positioning",
      "b-market-1": "market",
      "b-market-2": "audience",
      "b-market-3": "cms",
      "b-services-1": "services",
      "b-services-2": "services",
      "b-services-3": "permissions",
      "b-projects-1": "projects",
      "b-projects-2": "projects",
      "b-projects-3": "cms",
      "b-projects-4": "projects",
      "b-proof-1": "proof",
      "b-proof-2": "permissions",
      "b-proof-3": "proof",
      "b-domain-1": "domain",
      "b-domain-2": "setup",
      "b-domain-3": "action",
      "b-domain-4": "domain",
    };
    return typeMap[questionId] || "positioning";
  }

  function createVisualAidElement(questionId) {
    var visual = VISUAL_LIBRARY[getVisualAidType(questionId)];
    var wrapper = document.createElement("div");
    var imageGrid = document.createElement("div");
    var chart = document.createElement("div");
    var note = document.createElement("div");

    wrapper.className = "visual-aids";
    wrapper.innerHTML =
      "<h4>" +
      escapeHtml(visual.title) +
      "</h4><p>" +
      escapeHtml(visual.intro) +
      "</p>";

    imageGrid.className = "visual-grid";
    visual.images.forEach(function (image) {
      var card = document.createElement("figure");
      card.className = "visual-card";
      card.innerHTML =
        "<img loading='lazy' decoding='async' fetchpriority='low' width='760' height='475' src='" +
        escapeHtml(image.src) +
        "' alt='" +
        escapeHtml(image.label) +
        "'><strong>" +
        escapeHtml(image.label) +
        "</strong><span>" +
        escapeHtml(image.caption) +
        "</span>";
      imageGrid.appendChild(card);
    });
    wrapper.appendChild(imageGrid);

    chart.className = "mini-chart";
    visual.chart.forEach(function (row) {
      var chartRow = document.createElement("div");
      chartRow.className = "mini-chart-row";
      chartRow.innerHTML =
        "<span>" +
        escapeHtml(row[0]) +
        "</span><div class='mini-chart-track'><div class='mini-chart-fill' style='width:" +
        Number(row[1]) +
        "%'></div></div><strong>" +
        Number(row[1]) +
        "%</strong>";
      chart.appendChild(chartRow);
    });
    wrapper.appendChild(chart);

    note.className = "visual-note";
    visual.compare.forEach(function (item) {
      var span = document.createElement("span");
      span.innerHTML =
        "<strong>" + escapeHtml(item[0]) + "</strong>" + escapeHtml(item[1]);
      note.appendChild(span);
    });
    wrapper.appendChild(note);

    return wrapper;
  }

  function initVisualAids() {
    document.querySelectorAll(".question-card").forEach(function (card) {
      var check = card.querySelector(".question-check");
      if (!check || card.querySelector(".visual-aids")) return;
      var answerArea = card.querySelector(".answer-area");
      var visualAid = createVisualAidElement(check.id);
      if (answerArea) {
        card.insertBefore(visualAid, answerArea);
      } else {
        card.appendChild(visualAid);
      }
    });
  }

  function initAnswerFields() {
    document.querySelectorAll(".question-card").forEach(function (card) {
      var check = card.querySelector(".question-check");
      if (!check) return;

      var answerKey = "answer_" + check.id;
      var wrapper = document.createElement("div");
      var label = document.createElement("label");
      var textarea = document.createElement("textarea");

      wrapper.className = "answer-area";
      label.setAttribute("for", answerKey);
      label.textContent = "Your answer";
      textarea.id = answerKey;
      textarea.placeholder =
        "Write your answer here. A short answer is fine.";
      textarea.value = state[answerKey] || "";
      if (textarea.value.trim()) state[check.id] = true;

      textarea.addEventListener("input", function () {
        state[answerKey] = textarea.value;
        if (textarea.value.trim()) {
          check.checked = true;
          state[check.id] = true;
        }
        saveState();
        updateAnswerMeter();
      });

      wrapper.appendChild(label);
      wrapper.appendChild(textarea);
      card.appendChild(wrapper);
    });
  }

  function initAccordions() {
    document.querySelectorAll(".section-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var panel = button.closest(".section-panel");
        if (!panel) return;
        panel.classList.toggle("is-collapsed");
        button.setAttribute(
          "aria-expanded",
          panel.classList.contains("is-collapsed") ? "false" : "true",
        );
      });
    });

    document.querySelectorAll("[data-expand-all]").forEach(function (button) {
      button.addEventListener("click", function () {
        var shouldOpen = button.dataset.expandAll === "open";
        document.querySelectorAll(".section-panel").forEach(function (panel) {
          panel.classList.toggle("is-collapsed", !shouldOpen);
          var toggle = panel.querySelector(".section-toggle");
          if (toggle) toggle.setAttribute("aria-expanded", shouldOpen);
        });
      });
    });
  }

  function initChecks() {
    document.querySelectorAll(".question-check").forEach(function (check) {
      var id = check.id;
      check.checked = Boolean(state[id]);
      check.addEventListener("change", function () {
        state[id] = check.checked;
        saveState();
        updateAnswerMeter();
      });
    });
    updateAnswerMeter();
  }

  function initReset() {
    document.querySelectorAll("[data-reset-progress]").forEach(function (button) {
      button.addEventListener("click", function () {
        state = {};
        saveState();
        document.querySelectorAll(".question-check").forEach(function (check) {
          check.checked = false;
        });
        document
          .querySelectorAll(".answer-area textarea")
          .forEach(function (textarea) {
            textarea.value = "";
          });
        updateAnswerMeter();
        showToast("Progress reset.");
      });
    });
  }

  function collectGuideData(senderEmail) {
    var h1 = document.querySelector("h1");
    var intro = document.querySelector(".intro-panel");
    var title = h1 ? h1.textContent.trim().replace(/\s+/g, " ") : document.title;
    var date = new Date().toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    var questions = [];
    document.querySelectorAll(".section-panel").forEach(function (section) {
      var sectionTitle = section.querySelector(".section-heading h2");
      var sectionName = sectionTitle
        ? sectionTitle.textContent.trim()
        : "Questions";
      section.querySelectorAll(".question-card").forEach(function (card) {
        var question = card.querySelector("h3");
        var detail = card.querySelector("p");
        var tag = card.querySelector(".tag");
        var answer = card.querySelector(".answer-area textarea");
        var check = card.querySelector(".question-check");
        questions.push({
          section: sectionName,
          importance: tag ? tag.textContent.trim() : "Question",
          question: question ? question.textContent.trim().replace(/\s+/g, " ") : "",
          detail: detail ? detail.textContent.trim().replace(/\s+/g, " ") : "",
          answer: answer ? answer.value.trim() : "",
          answered: check ? check.checked : false,
        });
      });
    });

    var introParagraphs = [];
    if (intro) {
      intro.querySelectorAll("p").forEach(function (p) {
        introParagraphs.push(p.textContent.trim().replace(/\s+/g, " "));
      });
    }

    var decisionCards = [];
    document.querySelectorAll(".decision-card").forEach(function (card) {
      var label = card.querySelector("strong");
      var text = card.querySelector("p");
      decisionCards.push({
        label: label ? label.textContent.trim() : "",
        text: text ? text.textContent.trim().replace(/\s+/g, " ") : "",
      });
    });

    var decisionRows = [];
    document.querySelectorAll(".comparison tbody tr").forEach(function (row) {
      var cells = row.querySelectorAll("td");
      if (cells.length >= 3) {
        decisionRows.push({
          need: cells[0].textContent.trim(),
          recommendation: cells[1].textContent.trim(),
          reason: cells[2].textContent.trim().replace(/\s+/g, " "),
        });
      }
    });

    var resources = [];
    document.querySelectorAll(".resource-link").forEach(function (link) {
      var label = link.querySelector("strong");
      var text = link.querySelector("span");
      resources.push({
        label: label ? label.textContent.trim() : link.textContent.trim(),
        text: text ? text.textContent.trim().replace(/\s+/g, " ") : "",
        href: link.href || "",
      });
    });

    var images = [];
    document
      .querySelectorAll(".hero img, .image-card img, .visual-card img")
      .forEach(function (img) {
        images.push({
          alt: img.alt || "Website planning image",
          src: img.src,
        });
      });

    var answeredCount = questions.filter(function (item) {
      return item.answer || item.answered;
    }).length;

    return {
      guideId: guideId,
      title: title,
      pageTitle: document.title,
      senderEmail: senderEmail || "",
      date: date,
      introParagraphs: introParagraphs,
      questions: questions,
      decisionCards: decisionCards,
      decisionRows: decisionRows,
      resources: resources,
      images: images,
      answeredCount: answeredCount,
      totalQuestions: questions.length,
    };
  }

  function buildGuideSummaryText(data) {
    var lines = [];
    lines.push(data.pageTitle.toUpperCase());
    lines.push("==================================================");
    lines.push("Date: " + data.date);
    if (data.senderEmail) lines.push("Submitted by: " + data.senderEmail);
    lines.push("Progress: " + data.answeredCount + " of " + data.totalQuestions + " answered");
    lines.push("");

    if (data.introParagraphs.length) {
      lines.push("OVERVIEW");
      lines.push("--------------------------------------------------");
      data.introParagraphs.forEach(function (text) {
        lines.push(text);
      });
      lines.push("");
    }

    if (data.decisionCards.length || data.decisionRows.length) {
      lines.push("IDEAS AND RECOMMENDATIONS");
      lines.push("--------------------------------------------------");
      data.decisionCards.forEach(function (card) {
        lines.push(card.label + ": " + card.text);
      });
      data.decisionRows.forEach(function (row) {
        lines.push(row.need + " -> " + row.recommendation + ": " + row.reason);
      });
      lines.push("");
    }

    var currentSection = "";
    data.questions.forEach(function (item, index) {
      if (item.section !== currentSection) {
        currentSection = item.section;
        lines.push(currentSection.toUpperCase());
        lines.push("--------------------------------------------------");
      }
      lines.push(index + 1 + ". [" + item.importance + "] " + item.question);
      if (item.detail) lines.push("   Context: " + item.detail);
      lines.push("   Answer: " + (item.answer || "[Not answered]"));
      lines.push("");
    });

    if (data.images.length) {
      lines.push("VISUAL REFERENCES");
      lines.push("--------------------------------------------------");
      data.images.forEach(function (image) {
        lines.push(image.alt + ": " + image.src);
      });
      lines.push("");
    }

    if (data.resources.length) {
      lines.push("REFERENCE LINKS");
      lines.push("--------------------------------------------------");
      data.resources.forEach(function (resource) {
        lines.push(resource.label + ": " + resource.href);
        if (resource.text) lines.push("  " + resource.text);
      });
    }

    return lines.join("\n");
  }

  function buildGuideSummaryHtml(data, textSummary) {
    var answerRows = data.questions
      .map(function (item, index) {
        return (
          "<tr><td>" +
          (index + 1) +
          "</td><td>" +
          escapeHtml(item.section) +
          "</td><td>" +
          escapeHtml(item.importance) +
          "</td><td><strong>" +
          escapeHtml(item.question) +
          "</strong><br><span>" +
          escapeHtml(item.detail) +
          "</span></td><td>" +
          escapeHtml(item.answer || "Not answered") +
          "</td></tr>"
        );
      })
      .join("");

    var decisionRows = data.decisionRows
      .map(function (row) {
        return (
          "<tr><td>" +
          escapeHtml(row.need) +
          "</td><td>" +
          escapeHtml(row.recommendation) +
          "</td><td>" +
          escapeHtml(row.reason) +
          "</td></tr>"
        );
      })
      .join("");

    var decisionCards = data.decisionCards
      .map(function (card) {
        return (
          "<div class='summary-card'><strong>" +
          escapeHtml(card.label) +
          "</strong><p>" +
          escapeHtml(card.text) +
          "</p></div>"
        );
      })
      .join("");

    var resources = data.resources
      .map(function (resource) {
        return (
          "<li>" +
          (resource.href
            ? "<a href='" +
              escapeHtml(resource.href) +
              "'>" +
              escapeHtml(resource.label) +
              "</a>"
            : "<strong>" + escapeHtml(resource.label) + "</strong>") +
          "<span>" +
          escapeHtml(resource.text) +
          "</span></li>"
        );
      })
      .join("");

    var images = data.images
      .map(function (image) {
        return (
          "<figure><img src='" +
          escapeHtml(image.src) +
          "' alt='" +
          escapeHtml(image.alt) +
          "'><figcaption>" +
          escapeHtml(image.alt) +
          "</figcaption></figure>"
        );
      })
      .join("");

    return (
      "<!doctype html><html><head><meta charset='UTF-8'><title>" +
      escapeHtml(data.pageTitle) +
      "</title><style>" +
      "body{font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;background:#f7f2e8;color:#18202b;line-height:1.55;}main{max-width:1120px;margin:0 auto;padding:34px 24px 80px;}h1{font-family:Georgia,serif;font-size:42px;line-height:1.1;margin:0 0 10px;}h2{font-family:Georgia,serif;font-size:28px;margin:34px 0 12px;}p{color:#5f6570}.toolbar{display:flex;gap:10px;flex-wrap:wrap;margin:24px 0}.btn{padding:9px 13px;border:1px solid #ded3bd;border-radius:8px;background:#fff;cursor:pointer}.btn.primary{background:#f1d491;border-color:#f1d491}.summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:22px 0}.metric,.summary-card{border:1px solid #ded3bd;background:#fffdf7;border-radius:8px;padding:16px}.metric strong,.summary-card strong{display:block;color:#183452}table{width:100%;border-collapse:collapse;background:white;border:1px solid #ded3bd;border-radius:8px;overflow:hidden}th,td{padding:12px;border-bottom:1px solid #ded3bd;text-align:left;vertical-align:top}th{background:#183452;color:white;font-size:12px;text-transform:uppercase;letter-spacing:.06em}td span{display:block;color:#5f6570;font-size:13px;margin-top:4px}.images{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.images img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px}.images figure{margin:0}.images figcaption{font-size:13px;color:#5f6570;margin-top:6px}li{margin-bottom:10px}li span{display:block;color:#5f6570}@media(max-width:760px){.summary-grid,.images{grid-template-columns:1fr}table{display:block;overflow-x:auto}}@media print{.toolbar{display:none}}" +
      "</style></head><body><main><h1>" +
      escapeHtml(data.pageTitle) +
      "</h1><p>Submitted " +
      escapeHtml(data.date) +
      (data.senderEmail ? " by " + escapeHtml(data.senderEmail) : "") +
      ".</p><div class='summary-grid'><div class='metric'><strong>Progress</strong><span>" +
      data.answeredCount +
      " of " +
      data.totalQuestions +
      " answered</span></div><div class='metric'><strong>Website direction</strong><span>Clear website plan with practical content decisions</span></div><div class='metric'><strong>Next step</strong><span>Review answers and confirm scope</span></div></div><div class='toolbar'><button class='btn primary' onclick='window.print()'>Print / Save as PDF</button><button class='btn' onclick='navigator.clipboard.writeText(document.getElementById(\"plainSummary\").innerText)'>Copy full text</button></div><h2>Ideas and Recommendations</h2><div class='summary-grid'>" +
      decisionCards +
      "</div>" +
      (decisionRows
        ? "<table><thead><tr><th>Decision</th><th>Recommendation</th><th>Reason</th></tr></thead><tbody>" +
          decisionRows +
          "</tbody></table>"
        : "") +
      "<h2>Answered Questions</h2><table><thead><tr><th>#</th><th>Section</th><th>Priority</th><th>Question</th><th>Answer</th></tr></thead><tbody>" +
      answerRows +
      "</tbody></table><h2>Images and Visual References</h2><div class='images'>" +
      images +
      "</div><h2>Reference Links</h2><ul>" +
      resources +
      "</ul><pre id='plainSummary' style='white-space:pre-wrap;display:none'>" +
      escapeHtml(textSummary) +
      "</pre></main></body></html>"
    );
  }

  function openGuideSummaryWindow(data, textSummary, existingWin) {
    var win =
      existingWin ||
      window.open("", "_blank", "width=900,height=700,scrollbars=yes");
    if (!win) {
      copyText(textSummary);
      return;
    }
    win.document.open();
    win.document.write(buildGuideSummaryHtml(data, textSummary));
    win.document.close();
  }

  function sendGuideCopyViaEmailJS(toEmail, textSummary, data) {
    if (
      !toEmail ||
      !GUIDE_CONFIG.emailjs_public_key ||
      !GUIDE_CONFIG.emailjs_service_id ||
      !GUIDE_CONFIG.emailjs_template_id ||
      typeof emailjs === "undefined"
    ) {
      return;
    }

    emailjs
      .send(GUIDE_CONFIG.emailjs_service_id, GUIDE_CONFIG.emailjs_template_id, {
        to_email: toEmail,
        to_name: data.pageTitle || "there",
        developer_name: GUIDE_CONFIG.developerName,
        brief_text: textSummary,
        subject: data.pageTitle + " — submitted answers",
      })
      .then(function () {
        showToast("A copy has been sent to " + toEmail);
      })
      .catch(function (err) {
        console.warn("EmailJS send failed:", err);
      });
  }

  function createGuideSubmissionUi() {
    document.body.classList.add("guide-has-action");

    var success = document.createElement("div");
    success.className = "guide-success";
    success.id = "guideSuccess";
    success.innerHTML =
      "<h2>Answers submitted successfully</h2><p>Your completed guide has been sent. A printable summary has opened in a new window.</p>";

    var actionBar = document.createElement("div");
    actionBar.className = "guide-action-bar";
    actionBar.innerHTML =
      "<div class='guide-action-status' data-guide-submit-status>Answers are saved in this browser as you type.</div><button type='button' data-guide-reset>Clear answers</button><button type='button' data-guide-print>Print / Save PDF</button><button type='button' class='submit-action' data-guide-open-submit>Submit answers</button>";

    var modal = document.createElement("div");
    modal.className = "guide-modal-overlay";
    modal.id = "guideSubmitModal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML =
      "<div class='guide-modal'><h2>Ready to submit?</h2><p>Your answers will be compiled into a detailed website planning summary with recommendations, tables, reference links, and image references.</p><p>The summary will be sent to the website team and opened in a printable window for your own records.</p><label for='guideSubmitterEmail'>Your email address <span style='font-weight:400;color:#5f6570'>(optional)</span></label><input type='email' id='guideSubmitterEmail' placeholder='yourname@email.com'><div class='guide-modal-actions'><button type='button' class='submit-action' data-guide-submit>Send my answers</button><button type='button' data-guide-close-submit>Go back and check</button></div><p class='privacy-note'>Only submit information you are comfortable sharing with the website team.</p></div>";

    var main = document.querySelector("main");
    if (main) {
      document.body.insertBefore(success, main);
    } else {
      document.body.appendChild(success);
    }
    document.body.appendChild(actionBar);
    document.body.appendChild(modal);

    actionBar.querySelector("[data-guide-reset]").addEventListener("click", function () {
      var reset = document.querySelector("[data-reset-progress]");
      if (reset) reset.click();
    });
    actionBar.querySelector("[data-guide-print]").addEventListener("click", function () {
      window.print();
    });
    actionBar
      .querySelector("[data-guide-open-submit]")
      .addEventListener("click", function () {
        modal.classList.add("open");
        var email = document.getElementById("guideSubmitterEmail");
        if (email) email.focus();
      });
    modal.addEventListener("click", function (event) {
      if (event.target === modal) modal.classList.remove("open");
    });
    modal
      .querySelector("[data-guide-close-submit]")
      .addEventListener("click", function () {
        modal.classList.remove("open");
      });
    modal.querySelector("[data-guide-submit]").addEventListener("click", submitGuide);
  }

  function submitGuide() {
    var modal = document.getElementById("guideSubmitModal");
    var emailField = document.getElementById("guideSubmitterEmail");
    var senderEmail = emailField ? emailField.value.trim() : "";
    var data = collectGuideData(senderEmail);
    var textSummary = buildGuideSummaryText(data);
    var summaryWin = window.open(
      "",
      "_blank",
      "width=900,height=700,scrollbars=yes",
    );
    var status = document.querySelector("[data-guide-submit-status]");

    if (modal) modal.classList.remove("open");
    if (status) status.textContent = "Sending answers...";
    if (summaryWin) {
      summaryWin.document.write(
        "<!doctype html><html><head><meta charset='UTF-8'><title>Preparing summary</title></head><body style='font-family:sans-serif;padding:40px;color:#555'>Preparing your detailed summary...</body></html>",
      );
    }

    var formData = new FormData();
    formData.append("_subject", data.pageTitle + " — submitted answers");
    if (senderEmail) formData.append("_replyto", senderEmail);
    formData.append("guide_title", data.pageTitle);
    formData.append("submitted_by", senderEmail);
    formData.append("summary", textSummary);
    data.questions.forEach(function (item, index) {
      formData.append("Question_" + (index + 1), item.question);
      formData.append("Answer_" + (index + 1), item.answer || "[Not answered]");
    });

    fetch(GUIDE_CONFIG.formspreeEndpoint, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Form submission failed");
        openGuideSummaryWindow(data, textSummary, summaryWin);
        sendGuideCopyViaEmailJS(senderEmail, textSummary, data);
        var success = document.getElementById("guideSuccess");
        if (success) {
          success.style.display = "block";
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (status)
          status.textContent = "Submitted. A printable summary has opened.";
        showToast("Answers submitted successfully.");
      })
      .catch(function () {
        openGuideSummaryWindow(data, textSummary, summaryWin);
        if (status)
          status.textContent =
            "Submission failed. Your printable summary is open so you can copy or save it.";
        showToast("Could not submit. Use the summary window as a backup.");
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadState();
    initAnswerFields();
    initVisualAids();
    initAccordions();
    initChecks();
    initReset();
    createGuideSubmissionUi();
    loadEmailJS();
    updateScrollProgress();
    setActiveNav();
  });

  document.addEventListener("scroll", function () {
    updateScrollProgress();
    setActiveNav();
  });
})();
