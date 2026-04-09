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

async function renderLatest(item) {
  const latest = document.getElementById('latest');
  let preview = '';
  try {
    const res = await fetch(item.file);
    const txt = await res.text();
    preview = toPreview(txt);
  } catch {
    preview = '본문 미리보기를 불러오지 못했습니다.';
  }

  latest.innerHTML = `
    <h2>오늘 브리핑 (${item.date})</h2>
    <p class="meta">${item.title}</p>
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
