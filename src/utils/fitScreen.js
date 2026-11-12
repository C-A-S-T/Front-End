// 작업 화면(.app-shell)을 피그마 프레임 너비(1447px) 비율 그대로 브라우저 크기에 맞춰 확대/축소합니다.
// 모든 작업 페이지가 같은 배율을 쓰도록 기준 높이는 고정값입니다. 페이지를 넘겨도 사이드바·글자 크기가 그대로 유지됩니다.
// 기준 높이를 1250px로 두면 노트북에서 80% 안팎으로 줄어 글씨가 작아서, 1120px로 낮춰 약 90% 크기로 보이게 했습니다.
// (숫자를 낮출수록 크게, 높일수록 작게 보입니다. 내용이 화면보다 길면 세로로 스크롤됩니다.)
const FRAME_W = 1447;
const FRAME_H = 1120;
const MIN_WIDTH = 1000; // 이보다 좁은 화면(태블릿·모바일)은 기존 반응형 레이아웃 사용

function setZoom(zoom) {
  const root = document.documentElement.style;
  root.setProperty('--app-zoom', zoom);
  root.setProperty('--app-w', `${window.innerWidth / zoom}px`);
  root.setProperty('--app-h', `${window.innerHeight / zoom}px`);
}

function fit() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  setZoom(w < MIN_WIDTH ? 1 : Math.min(w / FRAME_W, h / FRAME_H));
}

export function fitScreen() {
  window.addEventListener('resize', fit);
  fit();
}
