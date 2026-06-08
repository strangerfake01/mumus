/******************************************************
 * Raw Materials Trade Kft. - Website Form Receiver
 * Google Apps Script Web App
 *
 * Recipient: office@rawmaterialstrade.com
 * Website: https://www.rawmaterialstrade.com
 ******************************************************/

const CONFIG = {
  RECIPIENT_EMAIL: 'office@rawmaterialstrade.com',
  SENDER_NAME: 'Raw Materials Trade Website',
  SUBJECT_PREFIX: 'New website inquiry from Raw Materials Trade',
  ALLOWED_DOMAIN: 'rawmaterialstrade.com',

  // Optional Google Sheet logging. Leave empty if you do not want archiving.
  SPREADSHEET_ID: '',
  SHEET_NAME: 'Website Form Submissions'
};

function doGet(e) {
  return jsonResponse({
    ok: true,
    message: 'Raw Materials Trade form endpoint is active.',
    service: 'Google Apps Script Web App'
  });
}

function doPost(e) {
  try {
    const data = normalizeRequestData(e);

    if (isSpam(data)) {
      return jsonResponse({ ok: true, message: 'Submission ignored.' });
    }

    const pageUrl = getValue(data, ['page_url', 'pageUrl', 'source_url', 'sourceUrl', 'url', 'form_page', 'formPage']);

    // If a page URL is provided, it must belong to rawmaterialstrade.com.
    if (pageUrl && !isAllowedPage(pageUrl)) {
      sendSecurityNotice(data, pageUrl);
      return jsonResponse({ ok: false, message: 'Invalid source page.' });
    }

    const formLanguage = getValue(data, ['language', 'lang', 'site_language', 'siteLanguage']) || detectLanguageFromUrl(pageUrl);
    const formName = getValue(data, ['form_name', 'formName', 'form_type', 'formType']) || 'Website contact form';
    const senderEmail = getValue(data, ['email', 'e-mail', 'mail', 'contact_email', 'contactEmail']);
    const senderName = getValue(data, ['name', 'full_name', 'fullName', 'contact_name', 'contactName', 'company_name', 'companyName', 'company']);

    const subject = buildSubject(formName, formLanguage, pageUrl);
    const plainBody = buildPlainTextEmail({ data, formName, formLanguage, pageUrl, senderName, senderEmail });
    const htmlBody = buildHtmlEmail({ data, formName, formLanguage, pageUrl, senderName, senderEmail });

    const emailOptions = { name: CONFIG.SENDER_NAME, htmlBody: htmlBody };
    if (senderEmail && isValidEmail(senderEmail)) emailOptions.replyTo = senderEmail;

    MailApp.sendEmail(CONFIG.RECIPIENT_EMAIL, subject, plainBody, emailOptions);
    saveToSheetIfEnabled({ data, formName, formLanguage, pageUrl, senderName, senderEmail });

    return jsonResponse({ ok: true, message: 'Form submission sent successfully.' });
  } catch (error) {
    notifyScriptError(error, e);
    return jsonResponse({ ok: false, message: 'Server error while processing the form.' });
  }
}

function normalizeRequestData(e) {
  let data = {};
  if (e && e.parameter) data = Object.assign({}, e.parameter);

  if (e && e.postData && e.postData.contents && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
    try {
      data = Object.assign(data, JSON.parse(e.postData.contents));
    } catch (err) {}
  }

  return cleanObject(data);
}

function isSpam(data) {
  const honeypotFields = ['_gotcha', 'gotcha', 'hp', 'honeypot', 'botcheck', 'bot_check', '_honey', 'website'];
  for (let i = 0; i < honeypotFields.length; i++) {
    const value = data[honeypotFields[i]];
    if (value && String(value).trim() !== '') return true;
  }

  const message = getValue(data, ['message', 'üzenet', 'uzenet', 'request', 'comment', 'details', 'project_details']);
  if (message) {
    const lower = String(message).toLowerCase();
    const suspicious = ['casino', 'viagra', 'crypto investment', 'telegram:', 'whatsapp spam'];
    for (let i = 0; i < suspicious.length; i++) {
      if (lower.indexOf(suspicious[i]) !== -1) return true;
    }
  }

  return false;
}

function isAllowedPage(pageUrl) {
  try {
    const url = new URL(pageUrl);
    const hostname = url.hostname.replace(/^www\./, '').toLowerCase();
    const allowed = CONFIG.ALLOWED_DOMAIN.replace(/^www\./, '').toLowerCase();
    return hostname === allowed || hostname.endsWith('.' + allowed);
  } catch (err) {
    return false;
  }
}

function buildSubject(formName, formLanguage, pageUrl) {
  const languagePart = formLanguage ? String(formLanguage).toUpperCase() : 'UNKNOWN LANGUAGE';
  const pagePart = pageUrl ? ' | ' + simplifyPageUrl(pageUrl) : '';
  return CONFIG.SUBJECT_PREFIX + ' | ' + formName + ' | ' + languagePart + pagePart;
}

function buildPlainTextEmail(payload) {
  const lines = [];
  lines.push('New website inquiry');
  lines.push('===================');
  lines.push('');
  lines.push('Company website: https://www.rawmaterialstrade.com');
  lines.push('Form name: ' + payload.formName);
  lines.push('Language: ' + payload.formLanguage);
  lines.push('Source page: ' + (payload.pageUrl || 'Not provided'));
  lines.push('Submitted at: ' + new Date().toISOString());
  lines.push('');
  lines.push('Contact');
  lines.push('-------');
  lines.push('Name / Company: ' + (payload.senderName || 'Not provided'));
  lines.push('Email: ' + (payload.senderEmail || 'Not provided'));
  lines.push('');
  lines.push('Submitted fields');
  lines.push('----------------');

  const filtered = filterDisplayFields(payload.data);
  Object.keys(filtered).forEach(function(key) {
    lines.push(formatLabel(key) + ': ' + stringifyValue(filtered[key]));
  });

  return lines.join('\n');
}

function buildHtmlEmail(payload) {
  const filtered = filterDisplayFields(payload.data);
  let rows = '';

  Object.keys(filtered).forEach(function(key) {
    rows += '<tr>'
      + '<td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;vertical-align:top;width:32%;">' + escapeHtml(formatLabel(key)) + '</td>'
      + '<td style="padding:10px;border-bottom:1px solid #e5e7eb;vertical-align:top;">' + nl2br(escapeHtml(stringifyValue(filtered[key]))) + '</td>'
      + '</tr>';
  });

  return '<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#17283D;">'
    + '<h2 style="margin:0 0 12px 0;color:#17283D;">New website inquiry</h2>'
    + '<p style="margin:0 0 18px 0;">A new form submission arrived from <strong>Raw Materials Trade</strong>.</p>'
    + '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:760px;margin-bottom:20px;">'
    + '<tr><td style="padding:8px 0;font-weight:600;width:180px;">Website</td><td>https://www.rawmaterialstrade.com</td></tr>'
    + '<tr><td style="padding:8px 0;font-weight:600;">Form name</td><td>' + escapeHtml(payload.formName || '') + '</td></tr>'
    + '<tr><td style="padding:8px 0;font-weight:600;">Language</td><td>' + escapeHtml(payload.formLanguage || '') + '</td></tr>'
    + '<tr><td style="padding:8px 0;font-weight:600;">Source page</td><td>' + makeLink(payload.pageUrl) + '</td></tr>'
    + '<tr><td style="padding:8px 0;font-weight:600;">Submitted at</td><td>' + escapeHtml(new Date().toISOString()) + '</td></tr>'
    + '</table>'
    + '<h3 style="margin:20px 0 10px 0;color:#17283D;">Contact</h3>'
    + '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:760px;margin-bottom:20px;">'
    + '<tr><td style="padding:8px 0;font-weight:600;width:180px;">Name / Company</td><td>' + escapeHtml(payload.senderName || 'Not provided') + '</td></tr>'
    + '<tr><td style="padding:8px 0;font-weight:600;">Email</td><td>' + escapeHtml(payload.senderEmail || 'Not provided') + '</td></tr>'
    + '</table>'
    + '<h3 style="margin:20px 0 10px 0;color:#17283D;">Submitted fields</h3>'
    + '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:760px;border:1px solid #e5e7eb;">' + rows + '</table>'
    + '<p style="margin-top:20px;font-size:12px;color:#6b7280;">This message was generated automatically by the Raw Materials Trade website form endpoint.</p>'
    + '</div>';
}

function saveToSheetIfEnabled(payload) {
  if (!CONFIG.SPREADSHEET_ID) return;
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Form name', 'Language', 'Source page', 'Sender name / company', 'Sender email', 'Raw data JSON']);
  }

  sheet.appendRow([new Date(), payload.formName || '', payload.formLanguage || '', payload.pageUrl || '', payload.senderName || '', payload.senderEmail || '', JSON.stringify(payload.data)]);
}

function sendSecurityNotice(data, pageUrl) {
  const subject = 'Blocked website form submission | Invalid source page';
  const body = ['A form submission was blocked because the source page is not allowed.', '', 'Submitted page URL:', pageUrl || 'Not provided', '', 'Allowed domain:', CONFIG.ALLOWED_DOMAIN, '', 'Raw data:', JSON.stringify(data, null, 2)].join('\n');
  MailApp.sendEmail(CONFIG.RECIPIENT_EMAIL, subject, body, { name: CONFIG.SENDER_NAME });
}

function notifyScriptError(error, e) {
  const subject = 'Raw Materials Trade form endpoint error';
  const body = ['An error occurred in the Raw Materials Trade Google Apps Script form endpoint.', '', 'Error:', error && error.stack ? error.stack : String(error), '', 'Request data:', e && e.parameter ? JSON.stringify(e.parameter, null, 2) : 'No parameter data'].join('\n');
  MailApp.sendEmail(CONFIG.RECIPIENT_EMAIL, subject, body, { name: CONFIG.SENDER_NAME });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getValue(data, keys) {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== null && data[key] !== undefined && String(data[key]).trim() !== '') return String(data[key]).trim();
  }
  return '';
}

function cleanObject(data) {
  const cleaned = {};
  Object.keys(data || {}).forEach(function(key) {
    const cleanKey = String(key).trim();
    if (!cleanKey) return;
    cleaned[cleanKey] = typeof data[key] === 'string' ? data[key].trim() : data[key];
  });
  return cleaned;
}

function filterDisplayFields(data) {
  const hiddenOrSystemFields = ['_gotcha', 'gotcha', 'hp', 'honeypot', 'botcheck', 'bot_check', '_captcha', '_template', '_subject', '_next', '_honey', 'website'];
  const filtered = {};
  Object.keys(data || {}).forEach(function(key) {
    if (hiddenOrSystemFields.indexOf(key) !== -1) return;
    filtered[key] = data[key];
  });
  return filtered;
}

function formatLabel(key) {
  return String(key).replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, function(char) { return char.toUpperCase(); });
}

function stringifyValue(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function escapeHtml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function nl2br(value) {
  return String(value || '').replace(/\n/g, '<br>');
}

function makeLink(url) {
  if (!url) return 'Not provided';
  const safeUrl = escapeHtml(url);
  return '<a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer">' + safeUrl + '</a>';
}

function simplifyPageUrl(pageUrl) {
  try {
    const url = new URL(pageUrl);
    return url.pathname && url.pathname !== '/' ? url.pathname : '/';
  } catch (err) {
    return '';
  }
}

function detectLanguageFromUrl(pageUrl) {
  if (!pageUrl) return 'unknown';
  const lower = String(pageUrl).toLowerCase();
  if (lower.indexOf('/hu') !== -1 || lower.indexOf('hu.html') !== -1) return 'hu';
  if (lower.indexOf('/de') !== -1 || lower.indexOf('de-at.html') !== -1 || lower.indexOf('de.html') !== -1) return 'de';
  if (lower.indexOf('/en') !== -1 || lower.indexOf('en.html') !== -1) return 'en';
  return 'unknown';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}
