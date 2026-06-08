/******************************************************
 * Raw Materials Trade Kft. - Website Form Receiver
 * Google Apps Script Web App
 *
 * Sends website form submissions to:
 * office@rawmaterialstrade.com
 *
 * Website:
 * https://www.rawmaterialstrade.com
 ******************************************************/

const CONFIG = {
  RECIPIENT_EMAIL: 'office@rawmaterialstrade.com',
  SENDER_NAME: 'Raw Materials Trade Website',
  SUBJECT_PREFIX: 'New website inquiry from Raw Materials Trade',

  // Optional Google Sheet logging.
  // Leave empty if you do not want to save submissions into Google Sheets.
  // Example: '1AbCDeFGhijkLmnoPQRSTuvWXyz1234567890'
  SPREADSHEET_ID: '',

  SHEET_NAME: 'Website Form Submissions'
};


/**
 * Browser health check.
 * Open the deployed /exec URL in a browser to test.
 */
function doGet(e) {
  return jsonResponse({
    ok: true,
    message: 'Raw Materials Trade form endpoint is active.',
    service: 'Google Apps Script Web App'
  });
}


/**
 * Main form handler.
 * This receives POST submissions from the website.
 */
function doPost(e) {
  try {
    const data = normalizeRequestData(e);

    if (isSpam(data)) {
      return jsonResponse({
        ok: true,
        message: 'Submission ignored.'
      });
    }

    const pageUrl = getValue(data, [
      'page_url',
      'pageUrl',
      'source_url',
      'sourceUrl',
      'url',
      'form_page',
      'formPage'
    ]);

    const formLanguage = getValue(data, [
      'language',
      'lang',
      'site_language',
      'siteLanguage'
    ]) || detectLanguageFromUrl(pageUrl);

    const formName = getValue(data, [
      'form_name',
      'formName',
      'form_type',
      'formType'
    ]) || 'Website contact form';

    const senderEmail = getValue(data, [
      'email',
      'e-mail',
      'mail',
      'contact_email',
      'contactEmail'
    ]);

    const senderName = getValue(data, [
      'name',
      'full_name',
      'fullName',
      'contact_name',
      'contactName',
      'company',
      'company_name',
      'companyName'
    ]);

    const company = getValue(data, [
      'company',
      'company_name',
      'companyName'
    ]);

    const phone = getValue(data, [
      'phone',
      'telefon',
      'telephone',
      'mobile'
    ]);

    const product = getValue(data, [
      'product',
      'product_name',
      'productName',
      'requested_product',
      'requestedProduct'
    ]);

    const industry = getValue(data, [
      'industry',
      'sector',
      'business_area',
      'businessArea'
    ]);

    const country = getValue(data, [
      'country',
      'orszag',
      'ország',
      'land'
    ]);

    const message = getValue(data, [
      'message',
      'uzenet',
      'üzenet',
      'details',
      'request',
      'comment'
    ]);

    const subject = buildSubject(formName, formLanguage, pageUrl, product);

    const payload = {
      data: data,
      formName: formName,
      formLanguage: formLanguage,
      pageUrl: pageUrl,
      senderName: senderName,
      senderEmail: senderEmail,
      company: company,
      phone: phone,
      product: product,
      industry: industry,
      country: country,
      message: message
    };

    const plainBody = buildPlainTextEmail(payload);
    const htmlBody = buildHtmlEmail(payload);

    const emailOptions = {
      name: CONFIG.SENDER_NAME,
      htmlBody: htmlBody
    };

    if (senderEmail && isValidEmail(senderEmail)) {
      emailOptions.replyTo = senderEmail;
    }

    MailApp.sendEmail(
      CONFIG.RECIPIENT_EMAIL,
      subject,
      plainBody,
      emailOptions
    );

    saveToSheetIfEnabled(payload);

    return jsonResponse({
      ok: true,
      message: 'Form submission sent successfully.'
    });

  } catch (error) {
    notifyScriptError(error, e);

    return jsonResponse({
      ok: false,
      message: 'Server error while processing the form.'
    });
  }
}


/**
 * Converts Apps Script request event into a clean object.
 */
function normalizeRequestData(e) {
  let data = {};

  if (e && e.parameter) {
    data = Object.assign({}, e.parameter);
  }

  /**
   * Optional JSON support.
   * Useful if the website sends application/json instead of FormData.
   */
  if (
    e &&
    e.postData &&
    e.postData.contents &&
    e.postData.type &&
    String(e.postData.type).indexOf('application/json') !== -1
  ) {
    try {
      const jsonData = JSON.parse(e.postData.contents);
      data = Object.assign(data, jsonData);
    } catch (err) {
      // Ignore invalid JSON and continue with e.parameter.
    }
  }

  return cleanObject(data);
}


/**
 * Basic spam protection.
 * No domain blocking is used here.
 */
function isSpam(data) {
  const honeypotFields = [
    '_gotcha',
    'gotcha',
    'hp',
    'honeypot',
    '_honey',
    'botcheck',
    'bot_check'
  ];

  for (let i = 0; i < honeypotFields.length; i++) {
    const value = data[honeypotFields[i]];

    if (value && String(value).trim() !== '') {
      return true;
    }
  }

  const message = getValue(data, [
    'message',
    'üzenet',
    'uzenet',
    'request',
    'comment',
    'details',
    'project_details'
  ]);

  if (message) {
    const lower = String(message).toLowerCase();

    const suspicious = [
      'casino',
      'viagra',
      'crypto investment',
      'telegram:',
      'whatsapp spam'
    ];

    for (let i = 0; i < suspicious.length; i++) {
      if (lower.indexOf(suspicious[i]) !== -1) {
        return true;
      }
    }
  }

  return false;
}


/**
 * Builds English subject line.
 */
function buildSubject(formName, formLanguage, pageUrl, product) {
  const languagePart = formLanguage
    ? String(formLanguage).toUpperCase()
    : 'UNKNOWN';

  const pagePart = pageUrl
    ? simplifyPageUrl(pageUrl)
    : '/';

  const productPart = product
    ? ' | Product: ' + product
    : '';

  return CONFIG.SUBJECT_PREFIX
    + ' | '
    + formName
    + ' | '
    + languagePart
    + ' | '
    + pagePart
    + productPart;
}


/**
 * Plain text fallback e-mail.
 */
function buildPlainTextEmail(payload) {
  const lines = [];

  lines.push('New website inquiry');
  lines.push('===================');
  lines.push('');
  lines.push('Website: https://www.rawmaterialstrade.com');
  lines.push('Form name: ' + safeText(payload.formName));
  lines.push('Language: ' + safeText(payload.formLanguage));
  lines.push('Source page: ' + safeText(payload.pageUrl));
  lines.push('Submitted at: ' + new Date().toISOString());
  lines.push('');
  lines.push('Contact');
  lines.push('-------');
  lines.push('Name: ' + safeText(payload.senderName));
  lines.push('Company: ' + safeText(payload.company));
  lines.push('Email: ' + safeText(payload.senderEmail));
  lines.push('Phone: ' + safeText(payload.phone));
  lines.push('Country: ' + safeText(payload.country));
  lines.push('');
  lines.push('Inquiry');
  lines.push('-------');
  lines.push('Industry: ' + safeText(payload.industry));
  lines.push('Product: ' + safeText(payload.product));
  lines.push('Message: ' + safeText(payload.message));
  lines.push('');
  lines.push('All submitted fields');
  lines.push('--------------------');

  const filtered = filterDisplayFields(payload.data);
  const keys = Object.keys(filtered);

  keys.forEach(function(key) {
    lines.push(formatLabel(key) + ': ' + stringifyValue(filtered[key]));
  });

  return lines.join('\n');
}


/**
 * Clean, professional HTML e-mail.
 */
function buildHtmlEmail(payload) {
  const filtered = filterDisplayFields(payload.data);
  const rows = buildFieldRows(filtered);

  return ''
    + '<div style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#17283D;">'
    + '<div style="max-width:780px;margin:0 auto;padding:24px;">'

    + '<div style="background:#17283D;border-radius:18px 18px 0 0;padding:26px 28px;color:#ffffff;">'
    + '<h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:700;color:#ffffff;">New website inquiry</h1>'
    + '<p style="margin:8px 0 0 0;font-size:14px;color:#dbeafe;">Raw Materials Trade Website</p>'
    + '</div>'

    + '<div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 18px 18px;padding:28px;">'

    + '<p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;">'
    + 'A new form submission arrived from the Raw Materials Trade website.'
    + '</p>'

    + '<h2 style="margin:0 0 12px 0;font-size:17px;color:#17283D;">Contact details</h2>'
    + '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:24px;">'
    + infoRow('Name', payload.senderName)
    + infoRow('Company', payload.company)
    + infoRow('Email', payload.senderEmail)
    + infoRow('Phone', payload.phone)
    + infoRow('Country', payload.country)
    + '</table>'

    + '<h2 style="margin:0 0 12px 0;font-size:17px;color:#17283D;">Inquiry details</h2>'
    + '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:24px;">'
    + infoRow('Industry', payload.industry)
    + infoRow('Product', payload.product)
    + infoRow('Message', payload.message)
    + '</table>'

    + '<h2 style="margin:0 0 12px 0;font-size:17px;color:#17283D;">Submission information</h2>'
    + '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:24px;">'
    + infoRow('Website', 'https://www.rawmaterialstrade.com')
    + infoRow('Form name', payload.formName)
    + infoRow('Language', payload.formLanguage)
    + infoRowHtml('Source page', makeLink(payload.pageUrl))
    + infoRow('Submitted at', new Date().toISOString())
    + '</table>'

    + '<h2 style="margin:0 0 12px 0;font-size:17px;color:#17283D;">All submitted fields</h2>'
    + '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">'
    + rows
    + '</table>'

    + '<p style="margin:24px 0 0 0;font-size:12px;line-height:1.5;color:#6b7280;">'
    + 'This message was generated automatically by the Raw Materials Trade Google Apps Script form endpoint. '
    + 'FormSubmit is not used.'
    + '</p>'

    + '</div>'
    + '</div>'
    + '</div>';
}


/**
 * Optional Google Sheet logging.
 */
function saveToSheetIfEnabled(payload) {
  if (!CONFIG.SPREADSHEET_ID) {
    return;
  }

  const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Form name',
      'Language',
      'Source page',
      'Name',
      'Company',
      'Email',
      'Phone',
      'Country',
      'Industry',
      'Product',
      'Message',
      'Raw data JSON'
    ]);
  }

  sheet.appendRow([
    new Date(),
    payload.formName || '',
    payload.formLanguage || '',
    payload.pageUrl || '',
    payload.senderName || '',
    payload.company || '',
    payload.senderEmail || '',
    payload.phone || '',
    payload.country || '',
    payload.industry || '',
    payload.product || '',
    payload.message || '',
    JSON.stringify(payload.data)
  ]);
}


/**
 * Notifies owner about script errors.
 */
function notifyScriptError(error, e) {
  const subject = 'Raw Materials Trade form endpoint error';

  const body = [
    'An error occurred in the Raw Materials Trade Google Apps Script form endpoint.',
    '',
    'Error:',
    error && error.stack ? error.stack : String(error),
    '',
    'Request data:',
    e && e.parameter ? JSON.stringify(e.parameter, null, 2) : 'No parameter data'
  ].join('\n');

  MailApp.sendEmail(CONFIG.RECIPIENT_EMAIL, subject, body, {
    name: CONFIG.SENDER_NAME
  });
}


/**
 * JSON response.
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * Helper: get first existing value from object.
 */
function getValue(data, keys) {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (
      Object.prototype.hasOwnProperty.call(data, key) &&
      data[key] !== null &&
      data[key] !== undefined &&
      String(data[key]).trim() !== ''
    ) {
      return String(data[key]).trim();
    }
  }

  return '';
}


/**
 * Helper: clean request object.
 */
function cleanObject(data) {
  const cleaned = {};

  Object.keys(data || {}).forEach(function(key) {
    const cleanKey = String(key).trim();

    if (!cleanKey) {
      return;
    }

    cleaned[cleanKey] = typeof data[key] === 'string'
      ? data[key].trim()
      : data[key];
  });

  return cleaned;
}


/**
 * Helper: hide technical/system fields from e-mail table.
 */
function filterDisplayFields(data) {
  const hiddenOrSystemFields = [
    '_gotcha',
    'gotcha',
    'hp',
    'honeypot',
    '_honey',
    'botcheck',
    'bot_check',
    '_captcha',
    '_template',
    '_subject',
    '_next',
    'consent_disclaimer'
  ];

  const filtered = {};

  Object.keys(data || {}).forEach(function(key) {
    if (hiddenOrSystemFields.indexOf(key) !== -1) {
      return;
    }

    filtered[key] = data[key];
  });

  return filtered;
}


/**
 * Helper: build all field rows.
 */
function buildFieldRows(data) {
  const keys = Object.keys(data || {});

  if (keys.length === 0) {
    return ''
      + '<tr>'
      + '<td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#6b7280;">No additional fields submitted.</td>'
      + '</tr>';
  }

  let rows = '';

  keys.forEach(function(key) {
    rows += ''
      + '<tr>'
      + '<td style="padding:11px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;vertical-align:top;width:34%;background:#f8fafc;">'
      + escapeHtml(formatLabel(key))
      + '</td>'
      + '<td style="padding:11px 12px;border-bottom:1px solid #e5e7eb;vertical-align:top;">'
      + nl2br(escapeHtml(stringifyValue(data[key])))
      + '</td>'
      + '</tr>';
  });

  return rows;
}


/**
 * Helper: clean information row.
 */
function infoRow(label, value) {
  return ''
    + '<tr>'
    + '<td style="padding:8px 0;font-weight:600;width:170px;vertical-align:top;color:#17283D;">'
    + escapeHtml(label)
    + '</td>'
    + '<td style="padding:8px 0;vertical-align:top;color:#17283D;">'
    + nl2br(escapeHtml(safeText(value)))
    + '</td>'
    + '</tr>';
}


/**
 * Helper: clean information row with HTML value.
 */
function infoRowHtml(label, htmlValue) {
  return ''
    + '<tr>'
    + '<td style="padding:8px 0;font-weight:600;width:170px;vertical-align:top;color:#17283D;">'
    + escapeHtml(label)
    + '</td>'
    + '<td style="padding:8px 0;vertical-align:top;color:#17283D;">'
    + htmlValue
    + '</td>'
    + '</tr>';
}


/**
 * Helper: field label formatting.
 */
function formatLabel(key) {
  const customLabels = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company',
    country: 'Country',
    industry: 'Industry',
    product: 'Product',
    message: 'Message',
    language: 'Language',
    page_url: 'Source page',
    submitted_at: 'Submitted at',
    consent_gdpr: 'GDPR consent',
    vat_number: 'VAT number'
  };

  if (customLabels[key]) {
    return customLabels[key];
  }

  return String(key)
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
}


/**
 * Helper: stringify values.
 */
function stringifyValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}


/**
 * Helper: basic HTML escape.
 */
function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


/**
 * Helper: newlines to <br>.
 */
function nl2br(value) {
  return String(value || '').replace(/\n/g, '<br>');
}


/**
 * Helper: clickable link in HTML e-mail.
 */
function makeLink(url) {
  if (!url) {
    return 'Not provided';
  }

  const safeUrl = escapeHtml(url);

  return '<a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">' + safeUrl + '</a>';
}


/**
 * Helper: simplified URL for subject line.
 */
function simplifyPageUrl(pageUrl) {
  if (!pageUrl) {
    return '/';
  }

  try {
    let value = String(pageUrl || '').trim();

    value = value.replace(/^https?:\/\/(www\.)?rawmaterialstrade\.com/i, '');

    if (!value || value === '') {
      return '/';
    }

    return value;
  } catch (err) {
    return '/';
  }
}


/**
 * Helper: language detection from URL.
 */
function detectLanguageFromUrl(pageUrl) {
  if (!pageUrl) {
    return 'unknown';
  }

  const lower = String(pageUrl).toLowerCase();

  if (lower.indexOf('/hu') !== -1 || lower.indexOf('hu.html') !== -1) {
    return 'hu';
  }

  if (lower.indexOf('/de') !== -1 || lower.indexOf('de-at.html') !== -1 || lower.indexOf('de.html') !== -1) {
    return 'de';
  }

  if (lower.indexOf('/en') !== -1 || lower.indexOf('en.html') !== -1) {
    return 'en';
  }

  return 'unknown';
}


/**
 * Helper: email validation.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}


/**
 * Helper: plain safe text.
 */
function safeText(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return 'Not provided';
  }

  return String(value);
}
