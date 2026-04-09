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

function extractIndexMoves(text) {
  const clean = text.replace(/\*\*/g, '').replace(/`/g, '');

  const patterns = {
    sp: [/(?:S&P\s?500|S\&P\s?500)\s*[:\-]?\s*[^\n]{0,30}?([+\-]\d+(?:\.\d+)?)%/i],
    nasdaq: [/(?:Nasdaq|NASDAQ|나스닥)\s*[:\-]?\s*[^\n]{0,30}?([+\-]\d+(?:\.\d+)?)%/i],
    dow: [/(?:Dow|DOW|다우)\s*[:\-]?\s*[^\n]{0,30}?([+\-]\d+(?:\.\d+)?)%/i]
  };

  const pick = (arr) => {
    for (const p of arr) {
      const m = clean.match(p);
      if (m) return `${m[1]}%`;
    }
    return 'N/A';
  };

  return {
    sp: pick(patterns.sp),
    nasdaq: pick(patterns.nasdaq),
    dow: pick(patterns.dow)
  };
}

async function renderLatest(item) {
  const latest = document.getElementById('latest');
  let preview = '';
  let moves = { sp: 'N/A', nasdaq: 'N/A', dow: 'N/A' };
  try {
    const res = await fetch(item.file);
    const txt = await res.text();
    preview = toPreview(txt);
    moves = extractIndexMoves(txt);
  } catch {
    preview = '본문 미리보기를 불러오지 못했습니다.';
  }

  latest.innerHTML = `
    <h2>오늘 브리핑 (${item.date})</h2>
    <p class="meta">${item.title}</p>

    <div class="index-strip">
      <div class="idx-card"><span>S&P500</span><strong>${moves.sp}</strong></div>
      <div class="idx-card"><span>Nasdaq</span><strong>${moves.nasdaq}</strong></div>
      <div class="idx-card"><span>Dow</span><strong>${moves.dow}</strong></div>
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
