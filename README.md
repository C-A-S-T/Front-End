# C.A.S.T React 복구본 — 실행 안내

이 ZIP은 `package.json`이 압축파일의 최상위 경로에 있도록 만들었습니다. 기존 프로젝트 파일을 덮어쓰지 말고 **별도의 새 폴더에 압축을 해제**한 다음, VS Code에서 압축 해제한 폴더를 열어주세요.

1. 기존 VS Code 터미널에서 실행 중인 Vite 서버가 있다면 `Ctrl + C`로 종료하세요. 다른 터미널에서 동작 중인 Vite도 종료하면 포트 혼동을 피할 수 있습니다.
2. 새로 압축 해제한 폴더의 `package.json`이 보이는지 확인하세요.
3. 터미널에서 `npm.cmd install`을 실행하세요.
4. 완료되면 `npm.cmd run dev`를 실행하세요.
5. 터미널에 표시된 **Local** 주소(5173 또는 다른 포트)로 접속하세요.

## CSS 확인
- `src/main.jsx`에서 `./styles/global.css`를 가져오고 있습니다.
- `index.html`에도 CSS 경로를 명시해 두었습니다.
- `src/styles/global.css`에는 기존 피그마 디자인 CSS 전체와 레이아웃 수정 코드가 있습니다.
- 로그인 화면이 여전히 기본 HTML만 표시되면 F12 → Console / Network에서 `global.css` 요청 오류를 확인해 주세요. Vite 터미널 에러도 확인해야 합니다.

이 파일은 **프론트엔드 UI 시연용**이며 인증·RAG·서버 API와 연동되지 않았습니다.
