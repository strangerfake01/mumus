# Form endpoint restored — 2026-05-26

- Restored the static form intermediary endpoint in `main.js`:
  `https://formsubmit.co/ajax/office@rawmaterialstrade.com`
- Restored `action` on all `#inquiryForm` forms.
- Preserved GDPR consent checkbox and product disclaimer checkbox validation.
- Preserved mailto fallback if the intermediary endpoint is unavailable.
- Updated `privacy.html` wording to match the actual form delivery flow.

Reason: a previous GDPR-hardening pass set `FORM_ENDPOINT` to an empty string and changed forms to `mailto:` only. The privacy/GDPR text and requested production behaviour require the intermediary form service to be active.
