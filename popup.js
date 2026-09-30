// GPTSubs — Get Key
// Одно расширение для получения ключа под разные сервисы:
//   • Claude  — читает cookie sessionKey с claude.ai
//   • X       — получает obfuscated_id для X Premium через API x.com
//   • ChatGPT — заготовка (в разработке)
// Ничего не сохраняется и никуда не отправляется — всё происходит локально в окне.

// ── Значки в стиле сайта ──
const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const ICON = {
  key:   svg('<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M14 9l2 2"/>'),
  retry: svg('<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>'),
  alert: svg('<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17.5v.01"/>'),
  ok:    svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', ' stroke-width="2.6"'),
  err:   svg('<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  copy:  svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>'),
};

// SVG-иконки для блока ссылок
const LINK_SVG = {
  tg:      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3 18.7 19.5c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5L18 6.3c.4-.3-.1-.5-.6-.2L6.2 13.2 1.4 11.7c-1-.3-1-1 .2-1.5l18.9-7.3c.9-.3 1.6.2 1.4 1.4Z"/></svg>',
  site:    svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>'),
  guide:   svg('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M8 7h8M8 11h6"/>'),
  reviews: svg('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
  support: svg('<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><path d="M18 19c0 1.1-1.3 2-3 2h-2"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/>'),
};

// Готовые ссылки (переиспользуются в конфигах сервисов)
const LINKS = {
  bot:     { cls: 'lnk brand', href: 'https://t.me/GPTSubsBot',        icon: LINK_SVG.tg,      text: '@GPTSubsBot' },
  site:    { cls: 'lnk',       href: 'https://gptsubs.com/?utm_source=key_extension&utm_medium=popup', icon: LINK_SVG.site, text: 'Сайт gptsubs.com' },
  guide:   { cls: 'lnk',       href: 'https://gptsubs.com/instructions', icon: LINK_SVG.guide,   text: 'Инструкция' },
  reviews: { cls: 'lnk',       href: 'https://t.me/GPTSubsReviews',      icon: LINK_SVG.reviews, text: 'Отзывы' },
  support: { cls: 'lnk',       href: 'https://t.me/GPTSubs_support',     icon: LINK_SVG.support, text: 'Поддержка' },
};

// ── Конфигурация сервисов ──
// Чтобы добавить ChatGPT: заполните getter и уберите soon:true.
const SERVICES = {
  claude: {
    name: 'Claude',
    tag: 'Get Key · Claude Max',
    accent: 'var(--claude)',
    accentHi: '#e08c6f',
    hosts: ['claude.ai'],
    site: 'claude.ai',
    siteUrl: 'https://claude.ai',
    steps: [
      ['Войдите в аккаунт Claude', 'Откройте расширение на вкладке <em>claude.ai</em>'],
      ['Нажмите «Получить sessionKey»', 'Ключ прочитаем и скопируем автоматически'],
      ['Отправьте ключ боту', 'Вставьте его в чат <em>@GPTSubsBot</em>'],
    ],
    warn: 'Расширение работает на вкладке <b>claude.ai</b>. <a href="https://claude.ai" target="_blank" rel="noopener">Перейти на claude.ai →</a>',
    keyLabel: 'Ваш sessionKey для бота',
    getText: 'Получить sessionKey',
    copyText: 'Скопировать ещё раз',
    mask: true, // sessionKey чувствителен — прячем под «Показать»
    noWarn: true, // cookie читается напрямую — плашка «откройте claude.ai» не нужна
    note: {
      cls: 'note',
      icon: svg('<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3z"/><path d="m9 12 2 2 4-4"/>'),
      html: 'Данные не сохраняются и никуда не отправляются',
    },
    links: [LINKS.bot],
    getter: getClaudeKey,
  },

  x: {
    name: 'X Premium',
    tag: 'Get Key · X Premium',
    accent: 'var(--brand)',
    accentHi: 'var(--brand-hi)',
    hosts: ['x.com', 'twitter.com'],
    site: 'x.com',
    siteUrl: 'https://x.com',
    steps: [
      ['Войдите в аккаунт X', 'Откройте расширение на вкладке <em>x.com</em>'],
      ['Нажмите «Получить ID»', 'ID получим и скопируем автоматически'],
      ['Отправьте ID боту', 'Вставьте его в чат <em>@GPTSubsBot</em>'],
    ],
    warn: 'Расширение работает на вкладке <b>x.com</b>. <a href="https://x.com" target="_blank" rel="noopener">Перейти на x.com →</a>',
    keyLabel: 'Ваш ID для бота',
    getText: 'Получить ID',
    copyText: 'Скопировать ID ещё раз',
    mask: false, // ID короткий и не чувствительный — показываем сразу
    requireTab: true, // API-запрос выполняется в контексте вкладки x.com
    note: {
      cls: 'note',
      icon: svg('<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3z"/><path d="m9 12 2 2 4-4"/>'),
      html: 'Данные не сохраняются и никуда не отправляются',
    },
    links: [LINKS.bot],
    getter: getXId,
  },

  chatgpt: {
    name: 'ChatGPT',
    tag: 'Get Key · ChatGPT',
    accent: 'var(--gpt)',
    accentHi: '#13c295',
    hosts: ['chatgpt.com', 'chat.openai.com'],
    site: 'chatgpt.com',
    siteUrl: 'https://chatgpt.com',
    requireTab: true, // запрос к /api/auth/session идёт в контексте вкладки (пройти Cloudflare)
    share: true,      // показываем кнопку «Отправить в @GPTSubsBot»
    shareBotDirect: true, // сессия большая — ссылку с текстом Telegram отбивает (400), поэтому просто открываем чат бота
    download: true,
    okMsg: 'Готово! Данные session скопированы',
    loadingText: 'Получаем сессию…',
    steps: [
      ['Войдите в аккаунт ChatGPT', 'Откройте расширение на вкладке <em>chatgpt.com</em>'],
      ['Нажмите «Получить сессию»', 'Сессию получим и скопируем автоматически'],
      ['Отправьте сессию боту', 'Кнопкой «Отправить» или вставьте в <em>@GPTSubsBot</em>'],
    ],
    warn: 'Расширение работает на вкладке <b>chatgpt.com</b>. <a href="https://chatgpt.com" target="_blank" rel="noopener">Перейти на chatgpt.com →</a>',
    keyLabel: 'Ваша сессия для бота',
    getText: 'Получить сессию',
    copyText: 'Скопировать ещё раз',
    mask: true, // сессия чувствительна — прячем под «Показать»
    note: {
      cls: 'note',
      icon: svg('<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3z"/><path d="m9 12 2 2 4-4"/>'),
      html: 'Данные не сохраняются и никуда не отправляются',
    },
    links: [], // кнопка «Отправить в @GPTSubsBot» уже есть выше — ссылка внизу не нужна
    getter: getChatGptSession,
  },
};

// ── DOM ──
const root       = document.documentElement;
const headTag    = document.getElementById('headTag');
const switchNav  = document.getElementById('switch');
const tabs       = [...switchNav.querySelectorAll('.tab')];
const btnGet     = document.getElementById('btnGet');
const btnGetText = document.getElementById('btnGetText');
const btnCopy    = document.getElementById('btnCopy');
const btnCopyText= document.getElementById('btnCopyText');
const btnShare   = document.getElementById('btnShare');
const btnDownload = document.getElementById('btnDownload');
const btnReveal  = document.getElementById('btnReveal');
const revealText = document.getElementById('revealText');
const statusBar  = document.getElementById('statusBar');
const statusIcon = document.getElementById('statusIcon');
const statusText = document.getElementById('statusText');
const keyCard    = document.getElementById('keyCard');
const keyLabelEl = document.getElementById('keyLabel');
const keyValue   = document.getElementById('keyValue');
const warnBox    = document.getElementById('warnBox');
const warnText   = document.getElementById('warnText');
const noteBox    = document.getElementById('noteBox');
const linksBox   = document.getElementById('links');
const s = [null,
  { root: document.getElementById('s1'), t: document.getElementById('s1t'), d: document.getElementById('s1d') },
  { root: document.getElementById('s2'), t: document.getElementById('s2t'), d: document.getElementById('s2d') },
  { root: document.getElementById('s3'), t: document.getElementById('s3t'), d: document.getElementById('s3d') },
];

// ── Состояние ──
let current = null;   // ключ активного сервиса
let cfg = null;       // конфиг активного сервиса
let lastValue = null; // полученный ключ / ID
let revealed = false;
let gotKey = false;   // true после успешного получения — главная кнопка копирует
let activeUrl = '';   // URL текущей вкладки браузера

// ── Рендер ссылок ──
function renderLinks(list) {
  // пустой список — прячем блок целиком (иначе останется рамка сверху и отступ)
  if (!list || list.length === 0) {
    linksBox.style.display = 'none';
    linksBox.innerHTML = '';
    return;
  }
  linksBox.style.display = '';
  linksBox.style.gridTemplateColumns = list.length === 1 ? '1fr' : '1fr 1fr';
  linksBox.innerHTML = list.map(l =>
    `<a class="${l.cls}" href="${l.href}" target="_blank" rel="noopener">${l.icon}<span>${l.text}</span></a>`
  ).join('');
}

// ── Отрисовка шагов состояния ──
function setStep(active) {
  [1, 2, 3].forEach(i => s[i].root.classList.remove('active', 'done'));
  for (let i = 1; i < active; i++) {
    s[i].root.classList.add('done');
    s[i].root.style.display = 'none';
  }
  if (s[active]) {
    s[active].root.style.display = '';
    s[active].root.classList.add('active');
  }
}

function showStatus(type, iconHtml, text) {
  statusBar.className = 'status show ' + type;
  statusIcon.innerHTML = iconHtml;
  statusText.textContent = text;
}
function hideStatus() { statusBar.className = 'status'; }

// ── Показ / маскировка значения ──
function renderValue() {
  if (!lastValue) return;
  if (!cfg.mask || revealed) {
    keyValue.textContent = lastValue;
    keyValue.classList.remove('masked');
    revealText.textContent = 'Скрыть';
    btnReveal.setAttribute('aria-pressed', 'true');
  } else {
    keyValue.textContent = '•'.repeat(Math.min(lastValue.length, 44));
    keyValue.classList.add('masked');
    revealText.textContent = 'Показать';
    btnReveal.setAttribute('aria-pressed', 'false');
  }
}

// ── Копирование в буфер ──
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    } catch { return false; }
  }
}

// ── Переключение сервиса ──
function selectService(key) {
  current = key;
  cfg = SERVICES[key];

  // акцентный цвет
  root.style.setProperty('--accent', cfg.accent);
  root.style.setProperty('--accent-hi', cfg.accentHi);

  // активная вкладка
  tabs.forEach(t => {
    const on = t.dataset.service === key;
    t.classList.toggle('active', on);
    t.setAttribute('aria-pressed', String(on));
  });

  // шапка и шаги
  headTag.textContent = cfg.tag;
  cfg.steps.forEach((st, i) => { s[i + 1].t.textContent = st[0]; s[i + 1].d.innerHTML = st[1]; });

  // ключ-карточка / кнопки
  keyLabelEl.textContent = cfg.keyLabel;
  btnGetText.textContent = cfg.getText;
  btnCopyText.textContent = cfg.copyText;
  btnReveal.classList.toggle('show', !!cfg.mask);

  // заметка внизу (может отсутствовать)
  if (cfg.note) {
    noteBox.style.display = '';
    noteBox.className = cfg.note.cls;
    noteBox.innerHTML = cfg.note.icon + `<span>${cfg.note.html}</span>`;
  } else {
    noteBox.style.display = 'none';
    noteBox.innerHTML = '';
  }

  // ссылки
  renderLinks(cfg.links);

  // warn-плашка
  warnText.innerHTML = cfg.warn;

  // сброс результата
  lastValue = null; revealed = false; gotKey = false;
  keyCard.classList.remove('show');
  btnCopy.classList.remove('show');
  btnShare.classList.remove('show');
  btnDownload.classList.remove('show');
  hideStatus();
  [1, 2, 3].forEach(i => { s[i].root.style.display = ''; });
  btnGet.innerHTML = ICON.key + `<span id="btnGetText">${cfg.getText}</span>`;

  // логика доступности
  if (cfg.soon) {
    warnBox.classList.add('show');
    btnGet.disabled = true;
    btnGet.innerHTML = ICON.clock + `<span>${cfg.getText}</span>`;
    setStep(1);
    return;
  }

  const onSite = cfg.hosts.some(h => activeUrl.includes(h));
  // Плашку показываем только там, где запрос идёт в контексте вкладки (X).
  // Для Claude cookie читается напрямую — плашка не нужна (noWarn).
  if (!onSite && cfg.requireTab && !cfg.noWarn) {
    warnBox.classList.add('show');
    btnGet.disabled = true;
    btnGet.innerHTML = ICON.alert + `<span>Откройте на ${cfg.site}</span>`;
  } else {
    warnBox.classList.remove('show');
    btnGet.disabled = false;
  }
  setStep(1);
}

// ── Обработчик получения ключа ──
btnGet.addEventListener('click', async () => {
  if (!cfg || cfg.soon) return;

  // Ключ уже получен — главная кнопка работает как «Скопировать ещё раз»
  // (делегируем существующей кнопке копирования, нового кода не добавляем).
  if (gotKey) {
    btnCopy.click();
    btnGet.innerHTML = ICON.ok + '<span>Скопировано</span>';
    setTimeout(() => { if (gotKey) btnGet.innerHTML = ICON.copy + '<span>Скопировать ещё раз</span>'; }, 1600);
    return;
  }

  btnGet.disabled = true;
  btnGet.innerHTML = '<span class="spin"></span>' + `<span>${cfg.loadingText || (cfg === SERVICES.x ? 'Получаем ID…' : 'Читаем ключ…')}</span>`;
  keyCard.classList.remove('show');
  btnCopy.classList.remove('show');
  btnDownload.classList.remove('show');
  btnShare.classList.remove('show');
  revealed = false; gotKey = false;
  setStep(2);
  showStatus('loading', '<span class="spin"></span>', 'Запрашиваем данные…');

  let result;
  try {
    result = await cfg.getter();
  } catch (e) {
    result = { error: e.message || 'Ошибка расширения' };
  }

  if (!result || result.error) {
    showStatus('error', ICON.err, result?.error || 'Неизвестная ошибка');
    btnGet.disabled = false;
    btnGet.innerHTML = ICON.retry + '<span>Попробовать снова</span>';
    setStep(1);
    return;
  }

  lastValue = result.value;
  renderValue();
  keyCard.classList.add('show');
  // Нижнюю кнопку копирования не показываем — главная кнопка теперь «Скопировать ещё раз».
  if (cfg.share) btnShare.classList.add('show');
  if (cfg.download) btnDownload.classList.add('show');
  setStep(3);

  const copied = await copyToClipboard(lastValue);
  if (copied) showStatus('success', ICON.ok, cfg.okMsg || 'Готово! Скопировано в буфер');
  else        showStatus('success', ICON.ok, 'Готово! Нажмите «Скопировать»');

  // После получения главная кнопка становится «Скопировать ещё раз» (вместо «Обновить»).
  gotKey = true;
  btnGet.innerHTML = ICON.copy + '<span>Скопировать ещё раз</span>';
  btnGet.disabled = false;
});

btnReveal.addEventListener('click', () => { revealed = !revealed; renderValue(); });

// «Отправить в @GPTSubsBot»: открываем Telegram с уже вписанным ключом,
// клиент выбирает бота и жмёт «Отправить» — вставлять руками не нужно.
btnShare.addEventListener('click', () => {
  if (!lastValue) return;
  copyToClipboard(lastValue); // подстраховка: если share не долетит — ключ уже в буфере
  const url = 'https://t.me/GPTSubsBot'
  chrome.tabs.create({ url });
});

btnCopy.addEventListener('click', async () => {
  if (!lastValue) return;
  await copyToClipboard(lastValue);
  const orig = btnCopy.innerHTML;
  btnCopy.innerHTML = ICON.ok + '<span>Скопировано</span>';
  setTimeout(() => { btnCopy.innerHTML = orig; }, 1600);
});

btnDownload.addEventListener('click', () => {
  if (!lastValue) return;
  const blob = new Blob([lastValue], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chatgpt-session.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ── Клики по вкладкам ──
tabs.forEach(t => {
  t.addEventListener('click', () => {
    selectService(t.dataset.service);
    try { chrome.storage?.local.set({ lastService: t.dataset.service }); } catch {}
  });
});

// ── getter'ы сервисов ──

async function getClaudeKey() {
  // Cookie sessionKey привязан к домену claude.ai. Читаем строго его.
  let cookie = await chrome.cookies.get({ url: 'https://claude.ai', name: 'sessionKey' });
  if (!cookie) {
    const all = await chrome.cookies.getAll({ domain: 'claude.ai', name: 'sessionKey' });
    cookie = all && all[0];
  }
  if (!cookie || !cookie.value) return { error: 'Войдите в аккаунт на claude.ai' };
  return { value: cookie.value };
}

async function getXId() {
  const cookies = await chrome.cookies.getAll({ domain: 'x.com' });
  const ct0 = cookies.find(c => c.name === 'ct0')?.value;
  if (!ct0) return { error: 'Войдите в аккаунт на X (Twitter)' };

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !(tab.url || '').match(/(^https:\/\/x\.com)|(^https:\/\/twitter\.com)/)) {
    return { error: 'Откройте вкладку x.com и попробуйте снова' };
  }

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async (csrfToken) => {
      try {
        const response = await fetch(
          'https://x.com/i/api/graphql/hpmba_y_wbVdTHLrufZfQg/InAppPurchaseObfuscatedIdRedeem',
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Csrf-Token': csrfToken,
              'X-Twitter-Auth-Type': 'OAuth2Session',
              'X-Twitter-Active-User': 'yes',
            },
            credentials: 'include',
          }
        );
        if (!response.ok) return { error: 'HTTP ' + response.status };
        const data = await response.json();
        if (data.errors?.length) return { error: data.errors[0].message };
        const id = data?.data?.in_app_purchase_obfuscated_id_redeem?.obfuscated_id;
        if (!id) return { error: 'ID не найден в ответе' };
        return { id };
      } catch (e) { return { error: e.message }; }
    },
    args: [ct0],
  });

  const r = results?.[0]?.result;
  if (!r || r.error) return { error: r?.error || 'Неизвестная ошибка' };
  return { value: r.id };
}

async function getChatGptSession() {
  // Боту нужен ответ /api/auth/session (accessToken + sessionToken + user/account).
  // Запрос делаем в контексте вкладки chatgpt.com: same-origin проходит Cloudflare,
  // и куки уходят автоматически. Ничего не сохраняем.
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !/^https:\/\/(chatgpt\.com|chat\.openai\.com)/.test(tab.url || '')) {
    return { error: 'Откройте вкладку chatgpt.com и попробуйте снова' };
  }

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      try {
        const r = await fetch('/api/auth/session', {
          credentials: 'include',
          headers: { accept: 'application/json' },
          cache: 'no-store',
        });
        if (!r.ok) return { error: 'HTTP ' + r.status };
        const txt = await r.text();
        if (!txt || txt.trim()[0] !== '{') return { error: 'Cloudflare-проверка. Обновите страницу и повторите' };
        return { json: txt };
      } catch (e) { return { error: e.message }; }
    },
  });

  const r = results?.[0]?.result;
  if (!r || r.error) return { error: r?.error || 'Неизвестная ошибка' };

  let data;
  try { data = JSON.parse(r.json); } catch { return { error: 'Ответ сессии не распознан' }; }
  if (!data.accessToken && !data.user) return { error: 'Войдите в аккаунт на chatgpt.com' };

  delete data.WARNING_BANNER;

  return { value: JSON.stringify(data) };
}

// ── Инициализация: определяем стартовый сервис по активной вкладке ──
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  activeUrl = tabs[0]?.url || '';

  // 1) сервис, соответствующий открытой вкладке
  let start = Object.keys(SERVICES).find(k =>
    !SERVICES[k].soon && SERVICES[k].hosts.some(h => activeUrl.includes(h))
  );

  // 2) иначе — последний выбранный
  if (!start) {
    try {
      const { lastService } = await chrome.storage.local.get('lastService');
      if (lastService && SERVICES[lastService]) start = lastService;
    } catch {}
  }

  // 3) иначе — Claude по умолчанию
  selectService(start || 'claude');
});
