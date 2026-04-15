async function loadBriefings() {
  const res = await fetch(`./data/briefings.json?v=${Date.now()}`, { cache: 'no-store' });
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

function getSection(text, title) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`## ${escaped}([\\s\\S]*?)(?=\\n## |$)`);
  const m = text.match(re);
  return m ? m[1].trim() : '';
}

function firstUsefulLine(block) {
  if (!block) return '데이터 확인 중';
  const lines = block.split('\n').map(x => x.trim()).filter(Boolean);
  const clean = lines.find(l => !l.startsWith('-') && !l.startsWith('1)') && !l.startsWith('1.') ) || lines[0];
  return (clean || '').replace(/^[-\d\.)\s]+/, '').slice(0, 130);
}

function renderSectionItems(items) {
  return items.map(it => `
    <article class="insight-item">
      <h5>${safeText(it.title, '핵심 요약')}</h5>
      <p>${safeText(it.desc, '상세 데이터 확인 중')}</p>
    </article>
  `).join('');
}

function updateSeoMeta(item) {
  const base = 'https://agenthongbot.github.io/DAILY_REPORT';
  const title = `${item.date} 오늘 미국증시 요약 | ${safeText(item.title, '미국 증시 브리핑')}`;
  const desc = `${(item.highlights || []).slice(0,2).join(' / ')} | 오늘 미국증시 요약`;
  document.title = title;

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', desc.slice(0, 180));

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `${base}/posts/${item.date}/`);

  const u = new URL(window.location.href);
  u.searchParams.set('date', item.date);
  history.replaceState({}, '', u.toString());
}

function renderInsights(item, text) {
  const grid = document.getElementById('insight-grid');

  const safeLead = safeText(item.overnightLead, '');
  const fallback = {
    topStory: [{ title: '핵심 사건 요약', desc: safeLead.slice(0, 180) || firstUsefulLine(getSection(text, '짧은 해설')) }],
    marketReaction: [{ title: '자산 반응', desc: firstUsefulLine(getSection(text, '미국 증시 요약(지수/금리/VIX/섹터)')) }],
    watchNow: [{ title: '체크 변수', desc: firstUsefulLine(getSection(text, '오늘 한국 투자자 체크포인트 3개')) }],
    positioning: [{ title: '포지션 메모', desc: firstUsefulLine(getSection(text, '간밤 주요 이슈 5개(시장 영향 포함)')) }]
  };

  const sec = item?.insightSections || fallback;

  grid.innerHTML = `
    <section class="insight-section">
      <div class="sec-head"><span>TOP STORY</span><strong>오늘의 핵심 사건</strong></div>
      ${renderSectionItems(sec.topStory || fallback.topStory)}
    </section>

    <section class="insight-section">
      <div class="sec-head"><span>MARKET REACTION</span><strong>시장이 반응한 자산</strong></div>
      ${renderSectionItems(sec.marketReaction || fallback.marketReaction)}
    </section>

    <section class="insight-section">
      <div class="sec-head"><span>WATCH NOW</span><strong>지금 확인할 변수</strong></div>
      ${renderSectionItems(sec.watchNow || fallback.watchNow)}
    </section>

    <section class="insight-section">
      <div class="sec-head"><span>POSITIONING</span><strong>투자 포지션 참고</strong></div>
      ${renderSectionItems(sec.positioning || fallback.positioning)}
    </section>
  `;
}

function toneClass(chg) {
  const s = String(chg || '').trim();
  if (s.startsWith('+')) return 'up';
  if (s.startsWith('-')) return 'down';
  return 'flat';
}

function looksCorrupted(text) {
  const s = String(text || '');
  return /\?{2,}/.test(s);
}

function safeText(text, fallback = '데이터 확인 중') {
  return looksCorrupted(text) ? fallback : text;
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderPostReadable(text) {
  const lines = text.split('\n').map(l => l.trimEnd());
  const sectionTitles = new Set([
    '간밤 주요 이슈 5개(시장 영향 포함)',
    '미국 증시 요약(지수/금리/VIX/섹터)',
    '오늘 한국 투자자 체크포인트 3개',
    '짧은 해설',
    'Overnight Lead',
    '최종 점검 체크리스트'
  ]);

  let html = '';
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      html += '<div class="post-gap"></div>';
      continue;
    }

    if (sectionTitles.has(line)) {
      html += `<h3 class="post-sec-title">${escapeHtml(line)}</h3>`;
      continue;
    }

    if (/^\d+\)\s+/.test(line)) {
      html += `<p class="post-item-title">${escapeHtml(line)}</p>`;
      continue;
    }

    if (/^-\s+/.test(line)) {
      html += `<p class="post-bullet">${escapeHtml(line.replace(/^-\s+/, ''))}</p>`;
      continue;
    }

    html += `<p class="post-line">${escapeHtml(line)}</p>`;
  }

  return html;
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
    const res = await fetch(`${item.file}?v=${item.date}`, { cache: 'no-store' });
    const txt = await res.text();
    stats = extractIndexStats(txt, item);
    core = extractCoreThree(txt);
  } catch {
    // keep defaults
  }

  const safeTitle = safeText(item.title, `${item.date} 미국/글로벌 마켓 브리핑`);
  const safeLead = safeText(item.overnightLead, '');

  latest.innerHTML = `
    <h2>오늘 브리핑 (${item.date})</h2>
    <p class="meta">${safeTitle}</p>

    <div class="index-strip">
      <div class="idx-card">
        <span>S&P500</span>
        <strong>${stats.sp.level}</strong>
        <em class="${toneClass(stats.sp.chg)}">${stats.sp.chg}</em>
      </div>
      <div class="idx-card">
        <span>Nasdaq</span>
        <strong>${stats.nasdaq.level}</strong>
        <em class="${toneClass(stats.nasdaq.chg)}">${stats.nasdaq.chg}</em>
      </div>
      <div class="idx-card">
        <span>Dow</span>
        <strong>${stats.dow.level}</strong>
        <em class="${toneClass(stats.dow.chg)}">${stats.dow.chg}</em>
      </div>
    </div>

    ${safeLead ? `<div class="lead-box"><h3>Overnight Lead</h3><p>${safeLead}</p></div>` : ''}
  `;
}

async function showPost(item) {
  const target = document.getElementById('post-view');
  try {
    const res = await fetch(`${item.file}?v=${item.date}`, { cache: 'no-store' });
    const txt = await res.text();
    const cleaned = removeCoreThreeSection(txt)
      .replace(/\*\*/g, '')
      .replace(/\t/g, '  ');
    target.innerHTML = renderPostReadable(cleaned);
    renderInsights(item, txt);
  } catch {
    target.textContent = '본문을 불러오지 못했습니다.';
    const grid = document.getElementById('insight-grid');
    if (grid) grid.textContent = '인사이트를 불러오지 못했습니다.';
  }
}

function renderList(items) {
  const list = document.getElementById('briefing-list');
  const card = list.closest('.archive');
  let visibleCount = Math.min(7, items.length);

  const draw = () => {
    const shown = items.slice(0, visibleCount);
    list.innerHTML = shown.map((i, idx) => `
      <li class="brief-item" data-idx="${idx}">
        <div><strong>${i.date}</strong> - ${safeText(i.title, i.date + ' 브리핑')}</div>
        <div class="meta">${(i.tags || []).map(t => safeText(t, '')).filter(Boolean).join(', ')}</div>
      </li>
    `).join('');

    [...list.querySelectorAll('.brief-item')].forEach((el) => {
      el.addEventListener('click', () => {
        [...list.querySelectorAll('.brief-item')].forEach(n => n.classList.remove('active'));
        el.classList.add('active');
        const item = items[Number(el.dataset.idx)];
        showPost(item);
        renderLatest(item);
        updateSeoMeta(item);
      });
    });

    let moreBtn = document.getElementById('more-briefings');
    if (visibleCount < items.length) {
      if (!moreBtn) {
        moreBtn = document.createElement('button');
        moreBtn.id = 'more-briefings';
        moreBtn.className = 'more-btn';
        moreBtn.textContent = '더보기';
        moreBtn.addEventListener('click', () => {
          visibleCount = Math.min(visibleCount + 14, items.length);
          draw();
        });
        card.appendChild(moreBtn);
      }
    } else if (moreBtn) {
      moreBtn.remove();
    }
  };

  draw();
}

(async () => {
  try {
    const data = await loadBriefings();
    if (!Array.isArray(data) || data.length === 0) throw new Error('empty_data');

    const qDate = new URLSearchParams(window.location.search).get('date');
    const selected = data.find(x => x.date === qDate) || data[0];

    await renderLatest(selected);
    renderList(data);
    showPost(selected);
    updateSeoMeta(selected);

    const idx = data.findIndex(x => x.date === selected.date);
    const active = document.querySelector(`#briefing-list .brief-item[data-idx="${idx}"]`);
    if (active) active.classList.add('active');
  } catch (e) {
    const latest = document.getElementById('latest');
    const grid = document.getElementById('insight-grid');
    const post = document.getElementById('post-view');
    if (latest) latest.innerHTML = '<h2>오늘 브리핑</h2><p class="meta">데이터 로딩에 실패했습니다. 잠시 후 새로고침해 주세요.</p>';
    if (grid) grid.textContent = '인사이트 데이터를 불러오지 못했습니다.';
    if (post) post.textContent = '브리핑 본문을 불러오지 못했습니다.';
  }
})();
