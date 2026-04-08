import json
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parents[1]
json_path = ROOT / 'data' / 'briefings.json'
post_path = ROOT / 'posts' / f"{date.today().isoformat()}.md"

# TODO: Replace with actual cron output ingestion
new_item = {
    "date": date.today().isoformat(),
    "title": "자동 생성 브리핑",
    "highlights": [
        "핵심 1",
        "핵심 2",
        "핵심 3"
    ],
    "tags": ["자동", "브리핑"],
    "file": f"./posts/{date.today().isoformat()}.md"
}

if json_path.exists():
    data = json.loads(json_path.read_text(encoding='utf-8'))
else:
    data = []

data.insert(0, new_item)
json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

post_path.write_text(
    f"# {date.today().isoformat()} 브리핑\n\n자동 생성된 초안입니다.\n",
    encoding='utf-8'
)

print('updated:', json_path)
