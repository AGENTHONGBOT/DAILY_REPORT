# Daily Market Briefing Site

정적 웹사이트로 매일 브리핑을 보여줍니다.

## 로컬 실행
`briefing-site` 폴더에서 간단한 서버를 실행하세요.

```bash
python -m http.server 8080
```

브라우저: `http://localhost:8080`

## 데이터 업데이트
- `data/briefings.json`에 새 브리핑 추가
- `posts/YYYY-MM-DD.md` 파일 생성

## GitHub Pages 배포
1. GitHub 저장소 생성 후 코드 push
2. 저장소 Settings → Pages → Source를 **GitHub Actions**로 선택
3. `main` 브랜치에 push 하면 자동 배포

배포 URL 예시:
`https://<your-github-id>.github.io/<repo-name>/`

## 권장 자동화
현재 cron 결과를 이 저장소의 `briefings.json`에 append하는 스크립트를 추가하면 완전 자동화 가능합니다.
