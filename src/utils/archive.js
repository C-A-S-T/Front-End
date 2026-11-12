import { ARCHIVE_SOURCES, DEFAULT_TITLE, POLICIES, POLICY_GROUPS, SOURCE_DETAILS, SOURCE_META } from '../data/demo';
import { loadScraps, saveScraps } from './storage';

// 보관함에서 사용자가 바꾼 내용(삭제 · 폴더 이동)은 localStorage에 저장해 새로고침 후에도 유지합니다.
export const FOLDERS = [['청약·주거', '청약 공고 · 임대주택 · 주거급여 자료', 'blue'], ['정부 지원정책', '청년 · 복지 · 고용 지원 사업 자료', 'green'], ['교육', '장학금 · 학자금 대출 · 교육비 지원 자료', 'gold']];
export const RECENT_DAYS = 30;
const KEYS = { removed: 'cast-removed', folders: 'cast-folder-moves', notes: 'cast-notes' };

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* 저장 불가 환경에서는 화면 상태만 유지 */ }
  window.dispatchEvent(new Event('cast:archive-change'));
}

// 리서치에서 참고해 자동 저장된 출처 문서 목록 (삭제·폴더 이동 반영). 스크랩한 문장은 loadScraps()로 따로 봅니다.
export function loadArchive() {
  const removed = read(KEYS.removed, []);
  const moves = read(KEYS.folders, {});
  return ARCHIVE_SOURCES
    .filter(s => !removed.includes(s.id))
    .map(s => moves[s.id] ? { ...s, folder: moves[s.id] } : s);
}

export function moveToFolder(ids, folder) {
  const moves = read(KEYS.folders, {});
  ids.forEach(id => { moves[id] = folder; });
  write(KEYS.folders, moves);
}

export function removeSources(ids) {
  write(KEYS.removed, [...new Set([...read(KEYS.removed, []), ...ids])]);
}

// 스크랩한 원문: 특정 문서에서 스크랩한 것 / 스크랩 해제
export function scrapsOf(sourceId) { return loadScraps().filter(q => q.sourceId === sourceId); }
export function removeScrap(id) { saveScraps(loadScraps().filter(q => q.id !== id)); }
export function scrapText(q) { return `“${q.quote}” — ${q.sourceTitle}${q.publisher ? ', ' + q.publisher : ''}`; }

export function isRecent(date) {
  const cutoff = new Date(Date.now() - RECENT_DAYS * 864e5);
  return new Date(date.replaceAll('.', '-')) >= new Date(cutoff.toDateString());
}

export function citation(s) {
  const quote = s.quote || POLICIES[s.id]?.quote;
  return `${quote ? `“${quote}” — ` : ''}${s.title}, ${s.domain} (${s.date} 저장)`;
}

// 정책 자료면 { group, isCurrent, currentId } 반환
export function policyVersion(id) {
  const p = POLICIES[id];
  if (!p) return null;
  const versions = POLICY_GROUPS[p.group].versions;
  const currentId = versions[versions.length - 1];
  return { group: p.group, versions, currentId, isCurrent: currentId === id };
}

// 출처 상세 화면에 보여줄 자동 요약 · 핵심 문장 · 근거로 쓴 주장 · 발행 정보. linked는 앱 안에 해당 리서치 화면이 있는지 여부
export function sourceDetail(s) {
  const d = POLICIES[s.id] || SOURCE_DETAILS[s.id] || { summary: '요약을 준비하고 있어요.', claims: [], research: '' };
  const meta = SOURCE_META[s.id] || {};
  return { summary: d.summary, quote: d.quote, research: d.research, claims: d.claims, linked: d.research === DEFAULT_TITLE, publisher: meta.publisher || s.domain, published: meta.published, reasons: meta.reasons || [], cautions: meta.cautions || [] };
}

// 같은 리서치에서 함께 저장한 다른 출처 (다시 볼 때 같이 보던 자료를 찾기 위함)
export function relatedSources(s, sources, limit = 3) {
  const research = sourceDetail(s).research;
  return sources.filter(o => o.id !== s.id && sourceDetail(o).research === research).slice(0, limit);
}

// 저장일로부터 지난 기간을 '오늘', 'N일 전', 'N개월 전', 'N년 전'으로 표시
export function savedAgo(date) {
  const days = Math.floor((Date.now() - new Date(date.replaceAll('.', '-'))) / 864e5);
  if (days < 1) return '오늘';
  if (days < 31) return `${days}일 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

// 출처별 내 메모
export function loadNote(id) { return read(KEYS.notes, {})[id] || ''; }
export function saveNote(id, text) {
  const notes = read(KEYS.notes, {});
  if (text.trim()) notes[id] = text; else delete notes[id];
  write(KEYS.notes, notes);
}

// 원문 URL을 새 탭으로 엽니다. url이 없으면 출처 사이트 주소로, 가상 출처면 안내만 띄웁니다.
export function openOriginal(s) {
  const url = s.url || (/^[\w-]+(\.[\w-]+)+$/.test(s.domain) ? 'https://' + s.domain : null);
  if (url) window.open(url, '_blank', 'noopener');
  else window.alert('시연용 가상 문서에는 실제 연결할 출처 URL이 없습니다.');
}
