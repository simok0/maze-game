# 미로 탈출 (FoW + 점수)

브라우저에서 동작하는 캔버스 기반 미로 게임입니다. 안개(Fog of War), 코인 수집, 랜덤 아이템(부스터/미니맵), 점수/최고점 저장(로컬스토리지)을 포함합니다.

## 폴더 트리
```
maze-fow-game/
├─ index.html
├─ src/
│  ├─ styles.css
│  ├─ main.js
│  ├─ util.js
│  ├─ maze.js
│  ├─ teacup.js
│  └─ game.js
└─ assets/
   └─ favicon.ico
```

## 로컬 실행 (간단)
아무 HTTP 서버로 열면 됩니다.

### 방법 A: VS Code Live Server 확장
1. VS Code에서 폴더를 열고 `index.html`에서 **Go Live** 클릭
2. 브라우저에서 열리는 주소로 접속

### 방법 B: 파이썬 내장 서버
```bash
cd maze-fow-game
python -m http.server 5173
# 브라우저에서 http://localhost:5173
```

## 배포(무료 호스팅 제안)
- **GitHub Pages**: 순수 정적 사이트, 저장소에 올린 뒤 Pages 활성화
- **Cloudflare Pages**: 저장소 연동/드래그앤드롭 둘 다 가능, 캐시 무효화 쉬움
- **Netlify**: 드래그앤드롭로 즉시 배포, 폼/리다이렉트 같은 부가 기능
- **Vercel**: 저장소 연동에 친화적, 프리뷰 URL 자동 생성

이 프로젝트는 번들러가 필요 없으므로 빌드 스텝 없이 “정적 사이트”로 배포하면 됩니다. 루트 디렉터리(output)는 저장소 루트(`/`)로 지정하세요.
