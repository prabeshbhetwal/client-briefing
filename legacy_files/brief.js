"use strict";

// ================================================
// CONFIGURATION — Edit this once to match your practice.
// Your name/agency appears in the header and on the printed summary.
// ================================================
var CONFIG = {
  developerName: "Prabesh Bhetwal",

  // ── EmailJS (free tier: 200 emails / month) ──────────────────────────────
  // Fill in these three values after completing the setup steps below.
  // Leave them as empty strings and the email-copy feature is simply skipped.
  emailjs_public_key: "fKgFK2YwaZ4q2H_8R", // Account > API Keys > Public Key
  emailjs_service_id: "personalprojects", // Email Services > your service's Service ID
  emailjs_template_id: "projects_template", // Email Templates > your template's Template ID
  // ─────────────────────────────────────────────────────────────────────────
};

var SAVE_KEY = "website_brief_v2";
var saveTimer;

/* ------------------------------------------------
   SAVE/LOAD
------------------------------------------------ */
function collectFormData() {
  var data = {};
  var form = document.getElementById("briefForm");

  form
    .querySelectorAll(
      "input[type=text], input[type=email], input[type=number], textarea",
    )
    .forEach(function (el) {
      if (el.name && !el.name.startsWith("_")) data[el.name] = el.value;
    });

  var cbMap = {};
  form.querySelectorAll("input[type=checkbox]").forEach(function (el) {
    if (!el.name) return;
    if (!cbMap[el.name]) cbMap[el.name] = [];
    if (el.checked) cbMap[el.name].push(el.value);
  });
  Object.assign(data, cbMap);

  form.querySelectorAll("input[type=radio]:checked").forEach(function (el) {
    if (el.name) data[el.name] = el.value;
  });

  return data;
}

function autoSave() {
  clearTimeout(saveTimer);
  setStatusSaving();
  saveTimer = setTimeout(function () {
    try {
      var data = collectFormData();
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      setStatusSaved();
    } catch (e) {
      console.warn("Auto-save failed:", e);
    }
  }, 700);
}

function loadSavedData() {
  var raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  var data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return;
  }

  var form = document.getElementById("briefForm");

  form
    .querySelectorAll(
      "input[type=text], input[type=email], input[type=number], textarea",
    )
    .forEach(function (el) {
      if (el.name && data[el.name] !== undefined) el.value = data[el.name];
    });

  form.querySelectorAll("input[type=checkbox]").forEach(function (el) {
    if (!el.name) return;
    var saved = data[el.name];
    el.checked = Array.isArray(saved) && saved.includes(el.value);
  });

  form.querySelectorAll("input[type=radio]").forEach(function (el) {
    if (el.name && data[el.name] !== undefined)
      el.checked = el.value === data[el.name];
  });

  setStatusSaved();
  showToast("Your previous answers have been restored.");
}

function clearAllAnswers() {
  if (
    !confirm(
      "Are you sure you want to clear all your answers? This cannot be undone.",
    )
  )
    return;
  document.getElementById("briefForm").reset();
  localStorage.removeItem(SAVE_KEY);
  setStatusSaved();
  showToast("All answers have been cleared.");
}

/* ------------------------------------------------
   STATUS
------------------------------------------------ */
function setStatusSaving() {
  document.getElementById("statusDot").classList.add("unsaved");
  document.getElementById("statusText").textContent =
    "Saving your answers\u2026";
  document.getElementById("abStatus").textContent = "\u23F3 Saving\u2026";
}

function setStatusSaved() {
  document.getElementById("statusDot").classList.remove("unsaved");
  var t = new Date().toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("statusText").textContent =
    "Answers saved at " + t + ". You can close this page and return later.";
  document.getElementById("abStatus").textContent =
    "\uD83D\uDCBE Saved at " + t;
}

/* ------------------------------------------------
   SUBMIT MODAL
------------------------------------------------ */
function openSubmitModal() {
  document.getElementById("submitModal").classList.add("open");
  document.getElementById("submitterEmail").focus();
}

function closeSubmitModal() {
  document.getElementById("submitModal").classList.remove("open");
}

/* ------------------------------------------------
   SUBMIT
------------------------------------------------ */
function submitBrief() {
  var email = document.getElementById("submitterEmail").value.trim();
  if (email) document.getElementById("field_replyto").value = email;

  var form = document.getElementById("briefForm");
  var isFormspreeConfigured = form.action.indexOf("YOUR_FORM_ID") === -1;

  closeSubmitModal();

  if (isFormspreeConfigured) {
    // Open the summary window NOW — while we are still inside a user gesture
    // context (the button click). Browsers will block window.open() if it is
    // called later from inside an async fetch callback.
    var summaryWin = window.open(
      "",
      "_blank",
      "width=700,height=600,scrollbars=yes",
    );
    // Show a loading placeholder so the window is not blank while we wait.
    if (summaryWin) {
      summaryWin.document.write(
        "<!DOCTYPE html><html><head><meta charset='UTF-8'>" +
          "<title>Preparing your summary\u2026</title></head>" +
          "<body style='font-family:sans-serif;padding:40px;color:#555'>" +
          "<p>Sending your answers\u2026 this window will update in a moment.</p>" +
          "</body></html>",
      );
    }

    var formData = new FormData(form);
    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then(function (res) {
        if (res.ok) {
          showSuccessBanner();
          // Write the full summary into the window we already opened.
          openSummaryWindow(email, summaryWin);
          // Also email a copy directly to the client if they provided an address.
          if (email) sendCopyViaEmailJS(email, buildSummaryText(email));
        } else {
          res.json().then(function (d) {
            showToast(
              "There was a problem sending. Please try printing instead.",
            );
            console.error("Formspree error:", d);
            if (summaryWin && !summaryWin.closed) summaryWin.close();
          });
        }
      })
      .catch(function () {
        showToast("Could not connect. Please print your answers as a backup.");
        if (summaryWin && !summaryWin.closed) summaryWin.close();
      });
  } else {
    openSummaryWindow(email);
  }
}

function buildSummaryText(senderEmail) {
  var data = collectFormData();
  var clientName = (data["A1_Business_Name"] || "").trim();
  var lines = [];
  lines.push(
    "WEBSITE BRIEF" + (clientName ? " \u2014 " + clientName.toUpperCase() : ""),
  );
  lines.push("==================================================");
  var dateStr = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  lines.push("Date: " + dateStr);
  if (senderEmail) lines.push("Submitted by: " + senderEmail);
  lines.push("");

  var sections = [
    [
      "A \u2014 Quick Overview",
      [
        "A1_Business_Name",
        "A2_Business_Description",
        "A3_Primary_Goal",
        "A4_Reference_Website",
      ],
    ],
    [
      "B \u2014 Target Audience",
      [
        "B1_Audience[]",
        "B1_Audience_Other",
        "B2_Primary_Audience",
        "B3_Visitor_Intent",
        "B4_Visitor_Outcome",
      ],
    ],
    [
      "C \u2014 Business Goals",
      [
        "C1_Success_Definition",
        "C2_Goal_Professional",
        "C2_Priority_Professional",
        "C2_Goal_Projects",
        "C2_Priority_Projects",
        "C2_Goal_Attract",
        "C2_Priority_Attract",
        "C2_Goal_Contact",
        "C2_Priority_Contact",
        "C2_Goal_Credibility",
        "C2_Priority_Credibility",
        "C2_Other_Goal_Detail",
        "C3_Call_To_Action",
      ],
    ],
    [
      "D \u2014 Version 1 Pages",
      [
        "D1_Home_When",
        "D1_Home_Have",
        "D1_Home_Need",
        "D2_About_When",
        "D2_About_Have",
        "D2_About_Need",
        "D3_Projects_When",
        "D3_Projects_Have",
        "D3_Projects_Need",
        "D3_Projects_Count",
        "D4_Contact_When",
        "D4_Contact_Details",
        "D5_Other_Pages",
      ],
    ],
    ["E \u2014 Future Plans", ["E1_Future[]", "E2_Future_Ideas"]],
    [
      "F \u2014 Look and Feel",
      [
        "F1_Feel[]",
        "F1_Feel_Other",
        "F2_Liked_Sites",
        "F3_Dislikes[]",
        "F3_Dislikes_Other",
        "F4_Tone",
        "F4_Balance",
        "F4_Structure",
        "F5_Colours",
      ],
    ],
    [
      "G \u2014 Practical Details",
      [
        "G1_Have[]",
        "G2_Domain",
        "G2_Domain_Name",
        "G3_Contact_Methods[]",
        "G3_Contact_Details",
        "G4_Social_Media",
      ],
    ],
    [
      "H \u2014 Questions & Concerns",
      ["H1_Questions", "H2_Concerns", "H3_Definitely_Not", "H4_Anything_Else"],
    ],
  ];

  sections.forEach(function (section) {
    var title = section[0];
    var keys = section[1];
    lines.push("--------------------------------------------------");
    lines.push(title);
    lines.push("--------------------------------------------------");
    keys.forEach(function (key) {
      var val = data[key];
      if (!val) return;
      if (Array.isArray(val) && val.length === 0) return;
      var displayVal = Array.isArray(val) ? val.join(", ") : val;
      if (displayVal.trim()) {
        var displayKey = key
          .replace(/_/g, " ")
          .replace(/\[\]/, "")
          .replace(/^[A-H]\d+\s*/, "")
          .trim();
        lines.push(displayKey + ":\n  " + displayVal.replace(/\n/g, "\n  "));
      }
    });
    lines.push("");
  });

  return lines.join("\n");
}

function sendCopyViaEmailJS(toEmail, briefText) {
  if (
    !CONFIG.emailjs_public_key ||
    !CONFIG.emailjs_service_id ||
    !CONFIG.emailjs_template_id ||
    typeof emailjs === "undefined"
  ) {
    return; // EmailJS not configured — skip silently
  }

  var data = collectFormData();
  var clientName = (data["A1_Business_Name"] || "").trim();

  emailjs
    .send(CONFIG.emailjs_service_id, CONFIG.emailjs_template_id, {
      to_email: toEmail,
      to_name: clientName || "there",
      developer_name: CONFIG.developerName,
      brief_text: briefText,
      subject:
        "Your website brief" + (clientName ? " \u2014 " + clientName : ""),
    })
    .then(function () {
      showToast("A copy has been sent to " + toEmail);
    })
    .catch(function (err) {
      console.warn("EmailJS send failed:", err);
      // Don't bother the user — they already have the summary window.
    });
}

function openSummaryWindow(senderEmail, existingWin) {
  var summaryText = buildSummaryText(senderEmail);
  var clientName = (collectFormData()["A1_Business_Name"] || "").trim();

  var w =
    existingWin ||
    window.open("", "_blank", "width=700,height=600,scrollbars=yes");
  if (!w) {
    copyToClipboard(summaryText);
    return;
  }

  var doc = w.document;
  doc.open();
  doc.write(
    "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Website Brief</title></head><body></body></html>",
  );
  doc.close();

  var style = doc.createElement("style");
  style.textContent =
    "body{font-family:monospace;font-size:13px;line-height:1.7;padding:30px;background:white;color:#111;}h1{font-family:sans-serif;font-size:18px;margin-bottom:4px;}p{font-family:sans-serif;font-size:13px;color:#666;margin-bottom:20px;}pre{white-space:pre-wrap;word-break:break-word;}.btn{font-family:sans-serif;padding:8px 16px;margin-right:8px;cursor:pointer;border-radius:5px;border:1px solid #ccc;font-size:13px;}.btn-print{background:#1B2B4B;color:white;border-color:#1B2B4B;}@media print{.no-print{display:none;}}";
  doc.head.appendChild(style);

  var h1 = doc.createElement("h1");
  h1.textContent =
    "Website Brief" + (clientName ? " \u2014 " + clientName : "");
  doc.body.appendChild(h1);

  var p = doc.createElement("p");
  p.textContent =
    "Print this page or copy the text below to share with your web developer.";
  doc.body.appendChild(p);

  var toolbar = doc.createElement("div");
  toolbar.className = "no-print";
  toolbar.style.marginBottom = "20px";

  var printBtn = doc.createElement("button");
  printBtn.className = "btn btn-print";
  printBtn.textContent = "\uD83D\uDDB8 Print / Save as PDF";
  printBtn.onclick = function () {
    w.print();
  };
  toolbar.appendChild(printBtn);

  var copyBtn = doc.createElement("button");
  copyBtn.className = "btn";
  copyBtn.textContent = "\uD83D\uDCCB Copy all text";
  copyBtn.onclick = function () {
    var t = pre.innerText;
    if (w.navigator.clipboard) {
      w.navigator.clipboard
        .writeText(t)
        .then(function () {
          w.alert("Copied to clipboard!");
        })
        .catch(function () {
          fallbackCopy(t, doc, w);
        });
    } else {
      fallbackCopy(t, doc, w);
    }
  };
  toolbar.appendChild(copyBtn);
  doc.body.appendChild(toolbar);

  var pre = doc.createElement("pre");
  pre.id = "briefText";
  pre.textContent = summaryText;
  doc.body.appendChild(pre);

  showToast("Your answers have been compiled. Check the new window.");
}

function fallbackCopy(text, doc, win) {
  var ta = doc.createElement("textarea");
  ta.value = text;
  doc.body.appendChild(ta);
  ta.select();
  doc.execCommand("copy");
  doc.body.removeChild(ta);
  win.alert("Copied to clipboard!");
}

function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(function () {
      showToast("Answers copied to clipboard. Paste them into an email.");
    })
    .catch(function () {
      showToast("Could not copy. Please try printing instead.");
    });
}

function showSuccessBanner() {
  var banner = document.getElementById("successBanner");
  banner.style.display = "block";
  banner.scrollIntoView({ behavior: "smooth" });
  document.getElementById("actionBar").style.display = "none";
}

/* ------------------------------------------------
   TOAST
------------------------------------------------ */
var toastTimer;
function showToast(msg) {
  var el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    el.classList.remove("show");
  }, 3500);
}

/* ------------------------------------------------
   INIT
------------------------------------------------ */
document.addEventListener("DOMContentLoaded", function () {
  // Initialise EmailJS if keys are configured
  if (CONFIG.emailjs_public_key && typeof emailjs !== "undefined") {
    emailjs.init({ publicKey: CONFIG.emailjs_public_key });
  }

  // Apply developer name from CONFIG
  var brandEl = document.getElementById("headerBrand");
  if (brandEl && CONFIG.developerName)
    brandEl.textContent = CONFIG.developerName;

  var dateEl = document.getElementById("headerDate");
  if (dateEl) {
    var d = new Date();
    dateEl.textContent =
      "Complete this form and submit, or print it to discuss in person \u00B7 " +
      d.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  }

  // Keep the email subject line in sync with the client's business name
  var a1Field = document.getElementById("a1");
  var subjectField = document.querySelector('input[name="_subject"]');
  function updateSubject() {
    if (!subjectField) return;
    var name = a1Field ? a1Field.value.trim() : "";
    subjectField.value = "Website Brief" + (name ? " \u2014 " + name : "");
  }
  if (a1Field) a1Field.addEventListener("input", updateSubject);
  updateSubject();

  loadSavedData();

  var form = document.getElementById("briefForm");
  form.addEventListener("input", autoSave);
  form.addEventListener("change", autoSave);

  document
    .getElementById("submitModal")
    .addEventListener("click", function (e) {
      if (e.target === this) closeSubmitModal();
    });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSubmitModal();
  });
});
