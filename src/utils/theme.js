// 화면 테마: 'system'(기기 설정 따라감) | 'light' | 'dark'
// <html data-theme="…">로 고르고, 'system'이면 속성을 지워 CSS의 prefers-color-scheme을 따릅니다.
const KEY = 'cast-theme';

export function getTheme() {
  try { return localStorage.getItem(KEY) || 'system'; } catch { return 'system'; }
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
  else delete root.dataset.theme;
}

// 바꿀 때 밝기가 '탁' 바뀌지 않도록 잠깐 색 전환 애니메이션을 켭니다.
export function setTheme(theme) {
  try { theme === 'system' ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, theme); } catch { /* 저장 불가 환경 */ }
  const root = document.documentElement;
  root.classList.add('theme-switching');
  applyTheme(theme);
  setTimeout(() => root.classList.remove('theme-switching'), 360);
}
