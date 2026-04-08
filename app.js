async function loadBriefings() {
  const res = await fetch('./data/briefings.json');
  return res.json();
}

function renderLatest(item) {
  const latest = document.getElementById('latest');
  latest.innerHTML = `
    <h2>오늘 브리핑 (${item.date})</h2>
    <p class="meta">${item.title}</p>
    <ul>${item.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
    <p><a href="${item.file}" target="_blank">전체 본문 보기</a></p>
  `;
}

function renderList(items) {
  const list = document.getElementById('briefing-list');
  list.innerHTML = items.map(i => `
    <li>
      <div><strong>${i.date}</strong> - ${i.title}</div>
      <div class="meta">${i.tags.join(', ')}</div>
      <a href="${i.file}" target="_blank">보기</a>
    </li>
  `).join('');
}

(async () => {
  const data = await loadBriefings();
  renderLatest(data[0]);
  renderList(data);

  document.getElementById('search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = data.filter(i => (i.title + ' ' + i.tags.join(' ')).toLowerCase().includes(q));
    renderList(filtered);
  });
})();
