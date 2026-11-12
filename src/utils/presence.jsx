import { useEffect, useRef, useState } from 'react';
// 닫힐 때 애니메이션용 도우미.
// open이 false가 되어도 바로 지우지 않고 ms 동안 남겨 두면서 closing=true를 알려 줍니다.
// 그동안 CSS가 '.is-closing'으로 사라지는 애니메이션을 재생합니다. 닫히는 중에 다시 열면 그대로 다시 열립니다.
// '동작 줄이기' 설정이면 기다리지 않고 바로 지웁니다.
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function usePresence(open, ms = 140) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (open) { setMounted(true); setClosing(false); return; }
    if (!mounted) return;
    setClosing(true);
    const t = setTimeout(() => { setMounted(false); setClosing(false); }, reduceMotion() ? 0 : ms);
    return () => clearTimeout(t);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  return [mounted, closing];
}

// 알림 문구처럼 '값이 비면 닫힘'인 경우: 사라지는 동안 마지막 문구를 유지합니다.
export function useLingering(value, ms = 200) {
  const last = useRef(value);
  if (value) last.current = value;
  const [mounted, closing] = usePresence(!!value, ms);
  return [mounted ? last.current : null, closing];
}

// 목록 안의 메뉴처럼 훅을 바로 쓰기 어려운 곳용: <Presence show={…}>{closing => <Menu …/>}</Presence>
export function Presence({ show, ms, children }) {
  const [mounted, closing] = usePresence(show, ms);
  return mounted ? children(closing) : null;
}
