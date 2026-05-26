/* Raw Materials Trade Kft. — static, crawlable catalogue enhancement */
const FORM_ENDPOINT = ''; // GDPR-safe default: no third-party form processor
function getLang(){const path=window.location.pathname.toLowerCase();const file=path.split('/').pop()||'';if(file==='hu.html'||file.startsWith('hu-')||file==='ai-profile-hu.html'||path.match(/\/hu\//))return'hu';if(file==='de-at.html'||file.startsWith('de-at-')||file==='ai-profile-de-at.html'||path.match(/\/de-at\//))return'de-at';return'en'}
const FORM_TEXT={
  en:{gdpr:'Please accept the data protection consent.',disc:'Please acknowledge the product documentation disclaimer.',sending:'Sending…',sent:'Thank you — your enquiry has been sent. We will respond within 1–2 business days.',mailto:'Your email client has been opened with a pre-filled message.',fail:'The form could not be sent automatically. Your email client has been opened instead.'},
  hu:{gdpr:'Kérjük, fogadja el az adatkezelési hozzájárulást.',disc:'Kérjük, vegye tudomásul a termékdokumentációs nyilatkozatot.',sending:'Küldés…',sent:'Köszönjük — megkeresése elküldve. 1–2 munkanapon belül válaszolunk.',mailto:'Az e-mail-kliens előre kitöltött üzenettel megnyílt.',fail:'Az űrlapot nem sikerült automatikusan elküldeni. Az e-mail-kliens megnyílt.'},
  'de-at':{gdpr:'Bitte stimmen Sie der Datenschutz-Einwilligung zu.',disc:'Bitte bestätigen Sie den Produktdokumentations-Hinweis.',sending:'Wird gesendet…',sent:'Vielen Dank — Ihre Anfrage wurde gesendet. Wir melden uns innerhalb von 1–2 Werktagen.',mailto:'Ihr E-Mail-Programm wurde mit einer vorausgefüllten Nachricht geöffnet.',fail:'Das Formular konnte nicht automatisch gesendet werden. Ihr E-Mail-Programm wurde geöffnet.'}
};
function initNav(){
  const t=document.getElementById('navToggle');
  const n=document.getElementById('siteNav');
  const h=document.querySelector('.site-header');
  if(h){h.classList.remove('header-hidden','is-hidden');h.removeAttribute('data-hidden');}
  if(!t||!n)return;
  const setOpen=(open)=>{
    n.classList.toggle('open',!!open);
    t.classList.toggle('active',!!open);
    t.setAttribute('aria-expanded',open?'true':'false');
    document.documentElement.classList.toggle('nav-open',!!open);
  };
  t.addEventListener('click',(e)=>{e.preventDefault();setOpen(!n.classList.contains('open'));});
  n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  document.addEventListener('click',e=>{if(!t.contains(e.target)&&!n.contains(e.target))setOpen(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false);});
  window.addEventListener('scroll',()=>{if(h){h.classList.remove('header-hidden','is-hidden');h.removeAttribute('data-hidden');}}, {passive:true});
}
function initCookieBanner(){const b=document.getElementById('cookieBanner'),ok=document.getElementById('cookieOk');if(!b)return;if(localStorage.getItem('rmt_cookie'))return;setTimeout(()=>b.classList.add('visible'),700);ok&&ok.addEventListener('click',()=>{localStorage.setItem('rmt_cookie','essential');b.classList.remove('visible')});}
function initFAQ(){document.querySelectorAll('.faq-item').forEach(item=>{item.querySelector('.faq-q')?.addEventListener('click',()=>{const o=item.classList.contains('open');document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));if(!o)item.classList.add('open');});});}
function initCatalogue(){
  const search=document.getElementById('productSearch');
  const chips=[...document.querySelectorAll('.filter-chip')];
  const cards=[...document.querySelectorAll('.product-card')];
  const accordions=[...document.querySelectorAll('.category-accordion')];
  const result=document.getElementById('resultCount');
  const no=document.getElementById('noResults');
  let filter='all';

  const lang=getLang();
  const labels={
    en:{suggest:'Closest product matches',empty:'No close product name found. Try a shorter word, CAS number or category.'},
    hu:{suggest:'Legközelebbi terméktalálatok',empty:'Nem találtunk közeli terméknevet. Próbáljon rövidebb szót, CAS-számot vagy kategóriát.'},
    'de-at':{suggest:'Naheliegende Produkttreffer',empty:'Kein naher Produktname gefunden. Versuchen Sie ein kürzeres Wort, eine CAS-Nummer oder eine Kategorie.'}
  }[lang]||{suggest:'Closest product matches',empty:'No close product name found. Try a shorter word, CAS number or category.'};

  function normalize(str){
    return String(str||'')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/[–—−]/g,'-')
      .replace(/[^a-z0-9%]+/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }
  function levenshtein(a,b){
    a=normalize(a);b=normalize(b);
    if(a===b)return 0;
    if(!a.length)return b.length;
    if(!b.length)return a.length;
    if(a.length>b.length){const t=a;a=b;b=t;}
    let prev=Array.from({length:a.length+1},(_,i)=>i);
    for(let j=1;j<=b.length;j++){
      const cur=[j];
      for(let i=1;i<=a.length;i++){
        cur[i]=Math.min(cur[i-1]+1,prev[i]+1,prev[i-1]+(a[i-1]===b[j-1]?0:1));
      }
      prev=cur;
    }
    return prev[a.length];
  }
  function titleOf(card){
    return (card.querySelector('.product-title-block h3,.product-title,.product-summary h3,h3')?.textContent||card.dataset.name||'').trim();
  }
  function hrefOf(card){
    return card.querySelector('a.product-detail-link,a[href$=".html"]')?.getAttribute('href')||'';
  }
  function productInfo(card){
    const title=titleOf(card);
    return {card,title,href:hrefOf(card),hay:normalize(`${title} ${card.dataset.name||''} ${card.textContent||''}`),cats:card.dataset.categories||''};
  }
  const products=cards.map(productInfo);
  function scoreProduct(info,rawQuery){
    const q=normalize(rawQuery);
    if(!q)return 9999;
    const hay=info.hay;
    const title=normalize(info.title);
    if(hay.includes(q))return title.includes(q)?0:1;
    const qTokens=q.split(' ').filter(Boolean);
    const hTokens=hay.split(' ').filter(Boolean);
    let total=0, matched=0;
    for(const qt of qTokens){
      if(qt.length<2)continue;
      let best=999;
      for(const ht of hTokens){
        if(ht.includes(qt)||qt.includes(ht)){best=0;break;}
        if(qt.length>=3 && ht.length>=3){
          const d=levenshtein(qt,ht);
          if(d<best)best=d;
        }
      }
      const tolerance=qt.length<=4?1:Math.max(1,Math.floor(qt.length*.32));
      if(best<=tolerance){matched++;total+=best;} else total+=6;
    }
    if(!qTokens.length)return 9999;
    return matched?total+(qTokens.length-matched)*4:9999;
  }
  function closeAll(){accordions.forEach(cat=>{cat.open=false;});}
  function openOnly(target){accordions.forEach(cat=>{cat.open=(cat===target);});}
  function ensureSuggestionBox(){
    if(!search)return null;
    let box=document.getElementById('productSuggestions');
    if(box)return box;
    box=document.createElement('div');
    box.id='productSuggestions';
    box.className='product-suggestions';
    box.setAttribute('role','listbox');
    box.setAttribute('aria-label',labels.suggest);
    search.parentElement?.appendChild(box);
    return box;
  }
  function suggestionCandidates(q){
    const nq=normalize(q);
    if(nq.length<2)return [];
    return products
      .map(info=>({...info,score:scoreProduct(info,q)}))
      .filter(info=>info.score<9999)
      .sort((a,b)=>a.score-b.score || a.title.localeCompare(b.title))
      .slice(0,8);
  }
  function renderSuggestions(q){
    const box=ensureSuggestionBox();
    if(!box)return;
    const nq=normalize(q);
    if(nq.length<2){box.classList.remove('visible');box.innerHTML='';return;}
    const matches=suggestionCandidates(q);
    box.innerHTML='';
    const help=document.createElement('div');
    help.className='suggestion-help';
    help.textContent=labels.suggest;
    box.appendChild(help);
    if(!matches.length){
      const empty=document.createElement('div');
      empty.className='product-suggestion-empty';
      empty.textContent=labels.empty;
      box.appendChild(empty);
      box.classList.add('visible');
      return;
    }
    matches.forEach(info=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='product-suggestion-item';
      btn.setAttribute('role','option');
      const name=document.createElement('span');
      name.className='product-suggestion-name';
      name.textContent=info.title;
      const meta=document.createElement('span');
      meta.className='product-suggestion-meta';
      meta.textContent=(info.card.dataset.name||'').replace(/\s+/g,' ').trim();
      btn.appendChild(name);btn.appendChild(meta);
      btn.addEventListener('click',()=>{
        if(info.href){window.location.href=info.href;return;}
        search.value=info.title;
        applyVisibility();
        box.classList.remove('visible');
      });
      box.appendChild(btn);
    });
    box.classList.add('visible');
  }
  function productMatchesQuery(card,q){
    const nq=normalize(q);
    if(!nq)return true;
    const info=products.find(p=>p.card===card)||productInfo(card);
    return scoreProduct(info,nq)<=Math.max(2,Math.floor(nq.length*.55));
  }
  function applyVisibility(){
    const q=(search?.value||'').trim();
    let visible=0;
    cards.forEach(card=>{
      const cats=(card.dataset.categories||'').split(/\s+/);
      const okCat=filter==='all'||cats.includes(filter);
      const okQ=!q||productMatchesQuery(card,q);
      const show=okCat&&okQ;
      card.classList.toggle('hidden',!show);
      if(show) visible++;
    });
    accordions.forEach(cat=>{
      const hasVisible=!!cat.querySelector('.product-card:not(.hidden)');
      cat.style.display=hasVisible?'':'none';
      if(!hasVisible) cat.open=false;
    });
    if(result) result.textContent=visible;
    if(no) no.classList.toggle('visible',visible===0);
    renderSuggestions(q);
    return {q,visible};
  }
  function run(source='init'){
    applyVisibility();
    if(source==='init') closeAll();
    if(source==='filter'){
      const box=document.getElementById('productSuggestions');
      if(box)box.classList.remove('visible');
      if(filter==='all'){closeAll();return;}
      const target=accordions.find(cat=>(cat.dataset.category||'')===filter && cat.style.display!=='none');
      if(target){openOnly(target);target.scrollIntoView({behavior:'smooth',block:'nearest'});} else closeAll();
      return;
    }
    if(source==='search'){
      closeAll();
    }
  }
  search?.addEventListener('input',()=>run('search'));
  search?.addEventListener('focus',()=>renderSuggestions(search.value));
  document.addEventListener('click',e=>{
    const box=document.getElementById('productSuggestions');
    if(box && search && !box.contains(e.target) && !search.contains(e.target)) box.classList.remove('visible');
  });
  search?.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('productSuggestions')?.classList.remove('visible');}});
  chips.forEach(btn=>btn.addEventListener('click',()=>{
    chips.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    filter=btn.dataset.cat||'all';
    run('filter');
  }));
  accordions.forEach(acc=>acc.addEventListener('toggle',()=>{
    if(acc.open) accordions.forEach(other=>{if(other!==acc)other.open=false;});
  }));
  run('init');
}
function setDocsValue(docsSelect, requested){
  if(!docsSelect||!requested)return;
  const d=String(requested).toLowerCase();
  const wantsAll=(d.includes('sds')&&d.includes('tds')&&d.includes('coa'))||d.includes('all')||d.includes('mindegyik')||d.includes('alle');
  if(wantsAll){
    const all=[...docsSelect.options].find(o=>/multiple|all|több|mindegyik|mehrere|alle/i.test(o.text));
    if(all){docsSelect.value=all.value||all.text;return;}
  }
  const tokens=d.split(/[\/,+;|]/).map(x=>x.trim()).filter(Boolean);
  for(const token of tokens){
    const opt=[...docsSelect.options].find(o=>o.text.toLowerCase().includes(token)||String(o.value).toLowerCase().includes(token));
    if(opt){docsSelect.value=opt.value||opt.text;return;}
  }
}
function buildPrefillMessage(lang, product, docs){
  const hasDocs=docs&&String(docs).toLowerCase().includes('sds');
  if(lang==='hu') return `Érdeklődés a következő termékkel kapcsolatban: ${product}${hasDocs ? '\nIgényelt dokumentáció: '+docs : ''}`;
  if(lang==='de-at') return `Anfrage zum Produkt: ${product}${hasDocs ? '\nBenötigte Dokumentation: '+docs : ''}`;
  return `Inquiry regarding product: ${product}${hasDocs ? '\nRequested documentation: '+docs : ''}`;
}
function initProductPrefill(){document.querySelectorAll('.product-prefill').forEach(a=>a.addEventListener('click',()=>{const p=a.dataset.product||'';const d=a.dataset.docs||'';setTimeout(()=>{const product=document.getElementById('product');const docs=document.getElementById('docs');const msg=document.getElementById('message');const lang=getLang();if(product&&p)product.value=p;if(docs&&d)setDocsValue(docs,d);if(msg&&!msg.value&&p){msg.value=buildPrefillMessage(lang,p,d);}},60);}));}
function initForm(){const form=document.getElementById('inquiryForm'),status=document.getElementById('formStatus');if(!form)return;const lang=getLang(),t=FORM_TEXT[lang]||FORM_TEXT.en;function show(type,msg){if(!status)return;status.className='form-status '+type;status.textContent=msg;}function mailto(data){const subject=encodeURIComponent('Raw Materials Trade B2B Inquiry — '+(data.get('product')||data.get('company')||''));let body='';for(const [k,v] of data.entries()){if(v && k!=='consent_gdpr' && k!=='consent_disclaimer' && k!=='website' && !k.startsWith('_')) body+=`${k}: ${v}\n`;}window.location.href=`mailto:office@rawmaterialstrade.com?subject=${subject}&body=${encodeURIComponent(body)}`;}form.addEventListener('submit',async e=>{e.preventDefault();const gdpr=document.getElementById('consentGdpr'),disc=document.getElementById('consentDisclaimer');if(gdpr&&!gdpr.checked){show('error',t.gdpr);return}if(disc&&!disc.checked){show('error',t.disc);return}const data=new FormData(form);show('info',t.sending);if(FORM_ENDPOINT){try{const r=await fetch(FORM_ENDPOINT,{method:'POST',body:data,headers:{Accept:'application/json'}});if(r.ok){show('success',form.dataset.successMsg||t.sent);form.reset();return}throw new Error('send failed')}catch(err){mailto(data);show('info',t.fail);return}}mailto(data);show('info',form.dataset.mailtoMsg||t.mailto);});}

function initQueryPrefill(){
  const params=new URLSearchParams(window.location.search);
  const p=params.get('product')||'';
  const d=params.get('docs')||'';
  if(!p&&!d)return;
  const product=document.getElementById('product');
  const docs=document.getElementById('docs');
  const msg=document.getElementById('message');
  const lang=getLang();
  if(product&&p) product.value=p;
  if(docs&&d) setDocsValue(docs,d);
  if(msg&&p&&!msg.value) msg.value=buildPrefillMessage(lang,p,d);
}


function initCertificateModals(){
  const triggers=[...document.querySelectorAll('[data-cert-src]')];
  if(!triggers.length)return;
  const overlay=document.createElement('div');
  overlay.className='cert-modal';
  overlay.innerHTML='<div class="cert-modal-dialog" role="dialog" aria-modal="true" aria-label="Certificate preview"><div class="cert-modal-header"><div class="cert-modal-title"></div><button type="button" class="cert-modal-close" aria-label="Close">×</button></div><div class="cert-modal-body"></div></div>';
  document.body.appendChild(overlay);
  const titleEl=overlay.querySelector('.cert-modal-title');
  const bodyEl=overlay.querySelector('.cert-modal-body');
  const closeBtn=overlay.querySelector('.cert-modal-close');
  const close=()=>{overlay.classList.remove('open');bodyEl.innerHTML='';};
  const open=(src,title,alt)=>{titleEl.textContent=title||'';bodyEl.innerHTML='';const img=document.createElement('img');img.src=src;img.alt=alt||title||'Certificate';bodyEl.appendChild(img);overlay.classList.add('open');};
  triggers.forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();open(btn.getAttribute('data-cert-src')||'',btn.getAttribute('data-cert-title')||btn.textContent.trim(),btn.getAttribute('data-cert-alt')||btn.getAttribute('data-cert-title')||'Certificate');}));
  closeBtn.addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))close();});
}


function initCategoryVisualState(){
  document.querySelectorAll('.category-accordion').forEach(details=>{
    const summary=details.querySelector('.category-summary');
    const sync=()=>summary&&summary.classList.toggle('open',details.open);
    details.addEventListener('toggle',sync);
    sync();
  });
}

function initSmoothScroll(){document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id&&id.length>1){const el=document.querySelector(id);if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});}}}));}
document.addEventListener('DOMContentLoaded',()=>{initNav();initCookieBanner();initFAQ();initCatalogue();initProductPrefill();initQueryPrefill();initCertificateModals();initCategoryVisualState();initForm();initSmoothScroll();});
