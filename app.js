async function loadBriefings() {
  const res = await fetch('./data/briefings.json');
  return res.json();
}

function toPreview(text) {
  const lines = text.split('\n');
  const start = lines.findIndex(l => l.trim() === '## 오늘의 핵심 3줄');

  if (start >= 0) {
    const picked = [];
    for (let i = start + 1; i < lines.length; i++) {
      const t = lines[i].trim();
      if (!t) continue;
      if (t.startsWith('## ')) break;
      picked.push(t);
    }
    if (picked.length) return picked.slice(0, 2).join('\n');
  }

  const fallback = lines
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'));
  return fallback.slice(0, 3).join('\n');
}

function extractIndexStats(text, item) {
  const clean = text.replace(/\*\*/g, '').replace(/`/g, '');
  const highlights = (item?.highlights || []).join(' ');

  const getLevel = (keys) => {
    for (const k of keys) {
      const re = new RegExp(`${k}\\s*:\\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\\.[0-9]+)?)`, 'i');
      const m = clean.match(re);
      if (m) return m[1];
    }
    return '—';
  };

  const getChange = (keys) => {
    // 1) Prefer highlights line (stable and concise)
    for (const k of keys) {
      const re = new RegExp(`${k}[^\\n%]{0,30}?([+\\-]\\d+(?:\\.\\d+)?)%`, 'i');
      const m = highlights.match(re);
      if (m) return `${m[1]}%`;
    }
    // 2) Fallback to full text
    for (const k of keys) {
      const re = new RegExp(`${k}[^\\n%]{0,30}?([+\\-]\\d+(?:\\.\\d+)?)%`, 'i');
      const m = clean.match(re);
      if (m) return `${m[1]}%`;
    }
    return 'N/A';
  };

  return {
    sp: {
      level: getLevel(['S&P\\s?500', 'S\\&P\\s?500']),
      chg: getChange(['S&P\\s?500', 'S\\&P\\s?500'])
    },
    nasdaq: {
      level: getLevel(['Nasdaq', 'NASDAQ', '나스닥']),
      chg: getChange(['Nasdaq', 'NASDAQ', '나스닥'])
    },
    dow: {
      level: getLevel(['Dow', 'DOW', '다우']),
      chg: getChange(['Dow', 'DOW', '다우'])
    }
  };
}

async function renderLatest(item) {
  const latest = document.getElementById('latest');
  let preview = '';
  let stats = {
    sp: { level: '—', chg: 'N/A' },
    nasdaq: { level: '—', chg: 'N/A' },
    dow: { level: '—', chg: 'N/A' }
  };
  try {
    const res = await fetch(item.file);
    const txt = await res.text();
    preview = toPreview(txt);
    stats = extractIndexStats(txt, item);
  } catch {
    preview = '본문 미리보기를 불러오지 못했습니다.';
  }

  latest.innerHTML = `
    <h2>오늘 브리핑 (${item.date})</h2>
    <p class="meta">${item.title}</p>

    <div class="index-strip">
      <div class="idx-card">
        <span>S&P500</span>
        <strong>${stats.sp.level}</strong>
        <em>${stats.sp.chg}</em>
      </div>
      <div class="idx-card">
        <span>Nasdaq</span>
        <strong>${stats.nasdaq.level}</strong>
        <em>${stats.nasdaq.chg}</em>
      </div>
      <div class="idx-card">
        <span>Dow</span>
        <strong>${stats.dow.level}</strong>
        <em>${stats.dow.chg}</em>
      </div>
    </div>

    <ul>${item.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
    <p class="meta" style="margin-top:10px; white-space:pre-wrap;">${preview}</p>
  `;
}

async function showPost(item) {
  const target = document.getElementById('post-view');
  try {
    const res = await fetch(item.file);
    const txt = await res.text();
    target.textContent = txt;
  } catch (e) {
    target.textContent = '본문을 불러오지 못했습니다.';
  }
}

function renderList(items) {
  const list = document.getElementById('briefing-list');
  list.innerHTML = items.map((i, idx) => `
    <li class="brief-item" data-idx="${idx}">
      <div><strong>${i.date}</strong> - ${i.title}</div>
      <div class="meta">${i.tags.join(', ')}</div>
    </li>
  `).join('');

  [...list.querySelectorAll('.brief-item')].forEach((el) => {
    el.addEventListener('click', () => {
      [...list.querySelectorAll('.brief-item')].forEach(n => n.classList.remove('active'));
      el.classList.add('active');
      const item = items[Number(el.dataset.idx)];
      showPost(item);
    });
  });
}

(async () => {
  const data = await loadBriefings();
  await renderLatest(data[0]);
  renderList(data);
  showPost(data[0]);

  const first = document.querySelector('#briefing-list .brief-item');
  if (first) first.classList.add('active');
})();
