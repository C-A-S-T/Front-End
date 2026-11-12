import { ARCHIVE_SOURCES, CLAIMS, DEFAULT_TITLE, DEMO_SCRAPS } from '../data/demo';

const SEED_VERSION = 'v2';
// 스크랩한 원문 문장 목록. 처음 실행하면 시연용 예시를 보여 줍니다.
export function loadScraps() {
  try {
    const raw = localStorage.getItem('cast-scraps');
    if (raw === null) return DEMO_SCRAPS;
    // kind가 있는 항목은 되돌린 '문서 화면 북마크' 기능이 남긴 것이라 정리
    let list = JSON.parse(raw).filter(q => !q.kind).map(migrateScrap);
    // 더미 데이터를 늘렸을 때 기존 사용자에게도 한 번만 추가해 줌
    if (localStorage.getItem('cast-scraps-seed') !== SEED_VERSION) {
      list = [...list, ...DEMO_SCRAPS.filter(d => !list.some(q => q.id === d.id))];
      localStorage.setItem('cast-scraps', JSON.stringify(list));
      localStorage.setItem('cast-scraps-seed', SEED_VERSION);
    }
    return list;
  }
  catch { return DEMO_SCRAPS; }
}
export function saveScraps(next) {
  try { localStorage.setItem('cast-scraps', JSON.stringify(next)); } catch { /* 저장 불가 환경 */ }
  window.dispatchEvent(new Event('cast:archive-change'));
}
// 예전 형식(출처 문서처럼 저장하던 스크랩)을 문장 단위 스크랩으로 변환
function migrateScrap(s) {
  if (s.sourceTitle) return s;
  const claim = CLAIMS.find(c => c.id === s.id);
  return {
    id: 'q' + s.id, claimId: s.id, sourceId: ARCHIVE_SOURCES.find(a => a.title === s.title)?.id || null,
    sourceTitle: s.title, publisher: s.domain, quote: s.quote, claim: claim?.title, status: claim?.status, tone: claim?.tone,
    research: DEFAULT_TITLE, date: s.date,
  };
}
export function today() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
export function getQuestion() {
  return sessionStorage.getItem('cast-question') || '';
}
