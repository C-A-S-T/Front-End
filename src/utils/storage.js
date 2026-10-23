export function loadScraps() {
  try { return JSON.parse(localStorage.getItem('cast-scraps') || '[]'); }
  catch { return []; }
}
export function saveScraps(next) {
  localStorage.setItem('cast-scraps', JSON.stringify(next));
}
export function getQuestion() {
  return sessionStorage.getItem('cast-question') || '';
}
