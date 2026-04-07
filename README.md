# Website Brief Tool

A client-facing website briefing tool for freelance web developers. Clients fill out a multi-section form covering their business, goals, design preferences, and practical details — then submit it to send their answers directly to the developer's inbox, while also receiving a formatted copy by email.

## Features

- **8-section questionnaire** covering business overview, target audience, goals, pages, future plans, look & feel, practical details, and questions/concerns
- **Auto-save** — answers are saved to `localStorage` as the client types, so they can close the tab and return later
- **Email delivery (Formspree)** — on submit, all answers are sent to the developer's inbox
- **Client email copy (EmailJS)** — a formatted copy of the brief is emailed back to the client
- **Summary window** — a printable/copyable summary pops up automatically after submission
- **No build step** — plain HTML + vanilla JS, open `index.html` directly in a browser

## Files

| File | Purpose |
|------|---------|
| `index.html` | Full form UI and all styling |
| `brief.js` | Form logic, save/load, submission, EmailJS integration |

## Setup

### 1. Formspree (developer inbox)

1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
2. Create a new form and copy your form ID
3. In `index.html`, find the `<form>` tag and update the `action` attribute:
   ```html
   <form id="briefForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### 2. EmailJS (client email copy)

1. Sign up at [emailjs.com](https://emailjs.com) (free tier: 200 emails/month)
2. Connect a Gmail (or other) email service — note the **Service ID**
3. Create an email template with these variables:
   - `{{to_email}}` — recipient address
   - `{{to_name}}` — client's business name
   - `{{developer_name}}` — your name
   - `{{brief_text}}` — the full brief content
   - `{{subject}}` — email subject line
4. In the template's HTML editor, use a `<pre>` tag for `{{brief_text}}` to preserve formatting:
   ```html
   <pre style="font-family:monospace;font-size:13px;white-space:pre-wrap;line-height:1.7;background:#f9f9f9;padding:16px;border-radius:4px;">{{brief_text}}</pre>
   ```
5. Note your **Template ID** and **Public Key** (Account → API Keys)
6. Fill in the three values in `brief.js`:

```js
var CONFIG = {
  developerName: "Your Name",
  emailjs_public_key: "YOUR_PUBLIC_KEY",
  emailjs_service_id: "YOUR_SERVICE_ID",
  emailjs_template_id: "YOUR_TEMPLATE_ID",
};
```

### 3. Customise

- Change `developerName` in the `CONFIG` block in `brief.js` — this appears in the header and in client emails
- The form sections and field labels can be edited directly in `index.html`

## How It Works

1. Client fills out the form (answers auto-save as they type)
2. Client clicks **Submit Brief**, enters their email, and confirms
3. The summary window opens immediately (can be printed or saved as PDF)
4. Formspree posts all answers to the developer's inbox
5. EmailJS sends a formatted copy of the brief to the client's email

## Dependencies

- [Formspree](https://formspree.io) — form backend
- [EmailJS Browser SDK v4](https://www.emailjs.com/docs/sdk/installation/) — client email delivery
- [Google Fonts](https://fonts.google.com) — Inter + Lora typefaces (loaded via CDN)

No npm, no bundler, no framework.
