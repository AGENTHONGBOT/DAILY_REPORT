async function loadBriefings() {
  const res = await fetch('./data/briefings.json');
  return res.json();
}

function extractIndexStats(text, item) {
  // Prefer explicit structured fields when present
  if (item?.indices?.sp || item?.indices?.nasdaq || item?.indices?.dow) {
    return {
      sp: item.indices?.sp || { level: '—', chg: 'N/A' },
      nasdaq: item.indices?.nasdaq || { level: '—', chg: 'N/A' },
      dow: item.indices?.dow || { level: '—', chg: 'N/A' }
    };
  }

  const clean = text.replace(/\*\*/g, '').replace(/`/g, '');

  const getLevel = (label) => {
    const re = new RegExp(`\\b${label}\\b\\s*:\\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\\.[0-9]+)?)`, 'i');
    const m = clean.match(re);
    return m ? m[1] : '—';
  };

  const getChange = (label) => {
    const re = new RegExp(`\\b${label}\\b[^\\n%]{0,40}?([+\\-]\\d+(?:\\.\\d+)?)%`, 'i');
    const m = clean.match(re);
    return m ? `${m[1]}%` : 'N/A';
  };

  return {
    sp: { level: getLevel('S&P\\s?500|S\\&P\\s?500'), chg: getChange('S&P\\s?500|S\\&P\\s?500') },
    nasdaq: { level: getLevel('Nasdaq|NASDAQ|나스닥'), chg: getChange('Nasdaq|NASDAQ|나스닥') },
    dow: { level: getLevel('Dow|DOW|다우'), chg: getChange('Dow|DOW|다우') }
  };
}

function extractCoreThree(text) {
  const lines = text.split('\n');
  const start = lines.findIndex(l => l.trim() === '## 오늘의 핵심 3줄');
  if (start < 0) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    if (t.startsWith('## ')) break;
    out.push(t.replace(/^\d+\.\s*/, ''));
  }
  return out.slice(0, 3);
}

function removeCoreThreeSection(text) {
  const re = /\n## 오늘의 핵심 3줄[\s\S]*?(?=\n##\s|$)/;
  return text.replace(re, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function renderLatest(item) {
  const latest = document.getElementById('latest');
  let stats = {
    sp: { level: '—', chg: 'N/A' },
    nasdaq: { level: '—', chg: 'N/A' },
    dow: { level: '—', chg: 'N/A' }
  };
  let core = [];

  try {
    const res = await fetch(item.file);
    const txt = await res.text();
    stats = extractIndexStats(txt, item);
    core = extractCoreThree(txt);
  } catch {
    // keep defaults
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

    ${item.overnightLead ? `<div class="lead-box"><h3>Overnight Lead</h3><p>${item.overnightLead}</p></div>` : ''}
  `;
}

async function showPost(item) {
  const target = document.getElementById('post-view');
  try {
    const res = await fetch(item.file);
    const txt = await res.text();
    target.textContent = removeCoreThreeSection(txt)
      .replace(/\*\*/g, '')
      .replace(/\t/g, '  ');
  } catch {
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
      renderLatest(item);
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
