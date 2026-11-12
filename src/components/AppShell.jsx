import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FOLDERS, loadArchive } from '../utils/archive';
import { loadScraps } from '../utils/storage';
import { DEFAULT_QUESTION } from '../data/demo';import { usePresence } from '../utils/presence';
import { getTheme, setTheme } from '../utils/theme';
import { ArrowLeft, Bookmark, ChevronDown, FileText, Folder, GitCompare, LogOut, Monitor, Moon, Plus, Sparkles, Sun } from 'lucide-react';
// filters: 보관함 화면이 넘겨주는 현재 필터 상태. 사이드바에서 켜진 항목만 선택 표시합니다.
export default function AppShell({ children, page='research', crumb, filters }) {
  const nav=useNavigate();
  const [profileOpen,setProfileOpen]=useState(false);
  const [profileShown,profileClosing]=usePresence(profileOpen);
  const [theme,setThemeState]=useState(getTheme);
  const isArchive=page==='archive';
  // 보관함 개수는 삭제·폴더 이동이 바뀔 때마다 다시 계산합니다.
  const [archive,setArchive]=useState(()=>({sources:loadArchive(),scraps:loadScraps()}));
  useEffect(()=>{const sync=()=>setArchive({sources:loadArchive(),scraps:loadScraps()});window.addEventListener('cast:archive-change',sync);return()=>window.removeEventListener('cast:archive-change',sync)},[]);
  const filter=detail=>{if(window.location.pathname!=='/archive')nav('/archive');setTimeout(()=>window.dispatchEvent(new CustomEvent('cast:archive-filter',{detail})),50)};
  const newResearch=()=>{sessionStorage.removeItem('cast-question');sessionStorage.setItem('cast-new-research','true');window.dispatchEvent(new Event('cast:new-research'));nav('/research')};
  // 사이드바 리서치 기록 이름 = 조사한 질문 (없으면 시연 기록 이름)
  const asked=sessionStorage.getItem('cast-question');const recordName=asked&&asked!==DEFAULT_QUESTION?asked:'청년 월세 지원';
  // 리서치 기록을 누르면 그 결과 화면을 엶 (이미 /research에 있어도 바로 바뀌도록 이벤트로 알림)
  const openRecord=()=>{sessionStorage.removeItem('cast-new-research');window.dispatchEvent(new Event('cast:open-research'));nav('/research')};
  const leave=()=>{sessionStorage.removeItem('cast-demo-session');nav('/login')};
  return <div className="app-shell">
    <aside className="app-sidebar">
      <button className="app-wordmark" onClick={()=>nav('/research')} aria-label="C.A.S.T 메인페이지">
        <span className="mini-mark">C</span><span><strong>C.A.S.T</strong><small>신뢰형 리서치 에이전트</small></span>
      </button>
      <div className="sidebar-main">
      <button className="sidebar-primary" onClick={isArchive?()=>nav('/research'):newResearch}>{isArchive?<ArrowLeft size={15}/>:<Plus size={17}/>} {isArchive?'리서치로 돌아가기':'새 리서치'}</button>
      {isArchive ? <>
        <button className={'nav-item kind-docs'+(filters?.none?' selected':'')} onClick={()=>filter({all:true})}><FileText size={15}/> 자동 저장된 문서 <span className="pill-count">{archive.sources.length}</span></button>
        <button className={'nav-item kind-docs'+(filters?.recentOnly?' selected':'')} onClick={()=>filter({recent:true})}><Sparkles size={15}/> 최근 저장</button>
        <button className={'nav-item kind-scraps'+(filters?.tab==='scraps'?' selected':'')} onClick={()=>filter({tab:'scraps'})}><Bookmark size={15}/> 내가 스크랩한 문장 <span className="sidebar-num">{archive.scraps.length}</span></button>
        <button className={'nav-item kind-policies'+(filters?.tab==='policies'?' selected':'')} onClick={()=>filter({tab:'policies'})}><GitCompare size={15}/> 정책 변경</button>
        <div className="sidebar-label side-section">주제별 폴더</div>
        {FOLDERS.map(([name,,color])=><button key={name} className={'nav-item folder-item'+(filters?.folder===name?' selected':'')} onClick={()=>filter({folder:name})}><span className={'tiny-square '+color}/>{name}<span className="sidebar-num">{archive.sources.filter(s=>s.folder===name).length}</span></button>)}
        <div className="sidebar-label side-section">출처 유형</div>
        {['정부자료','보고서','논문','공식통계','뉴스기사'].map(type=><button key={type} className={'nav-item filter-side'+(filters?.type===type?' selected':'')} onClick={()=>filter({type})}><span className="tiny-outline"/>{type}</button>)}
        <div className="sidebar-label side-section">신뢰도</div>
        {[['높음','green'],['보통','gold']].map(([t,c])=><button key={t} className={'nav-item filter-side'+(filters?.trust===t?' selected':'')} onClick={()=>filter({trust:t})}><span className={'tiny-square '+c}/>{t}</button>)}
      </> : <>
        <NavLink to="/archive" className="nav-item"><Folder size={15}/> 출처 보관함 <span className="pill-count">{archive.sources.length}</span></NavLink>
        <div className="sidebar-label side-section">리서치 기록</div>
        <button className="nav-item selected" onClick={openRecord}><FileText size={15}/> <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',minWidth:0}} title={recordName}>{recordName}</span></button>
      </>}
      </div>
    </aside>
    <div className="app-pane">
      <header className="app-topbar"><div className="breadcrumb">워크스페이스 <span>/</span> {crumb?<><button className="crumb-link" onClick={()=>nav('/archive')}>출처 보관함</button> <span>/</span> <strong>{crumb}</strong></>:<strong>{isArchive?'출처 보관함':'리서치 결과'}</strong>}</div>
        <div className="profile-shell"><button className="profile-pill" onClick={()=>setProfileOpen(!profileOpen)}>Profile <ChevronDown size={13}/></button><button className="avatar" onClick={()=>setProfileOpen(!profileOpen)}>CT</button>
          {profileShown&&<div className={'profile-menu'+(profileClosing?' is-closing':'')}><span>데모 프로필</span>
            <div className="theme-pick"><small>화면 테마</small><div className="segmented" role="radiogroup" aria-label="화면 테마">{[['system','자동',Monitor],['light','라이트',Sun],['dark','다크',Moon]].map(([v,l,Icon])=><button key={v} role="radio" aria-checked={theme===v} className={theme===v?'active':''} onClick={()=>{setTheme(v);setThemeState(v)}}><Icon size={13}/>{l}</button>)}</div></div><button onClick={leave}><LogOut size={15}/> 로그아웃</button></div>}
        </div>
      </header>
      {children}
    </div>
  </div>;
}
export function SectionTitle({ children, suffix }){return <div className="section-title"><h3>{children}</h3>{suffix&&<span>{suffix}</span>}</div>}
export function StateBadge({label,tone='muted'}){return <span className={'state-badge '+tone}>{label}</span>}
// 작업 화면 맨 위 네이비 배너. aside는 오른쪽에 붙는 요약 상자, children은 제목 아래 내용(검색창 · 단계 표시 등)
export function PageHero({eyebrow,title,desc,aside,children}){return <section className="page-hero"><div className="hero-main">{eyebrow&&<span className="hero-eyebrow">{eyebrow}</span>}<h1>{title}</h1>{desc&&<p className="hero-desc">{desc}</p>}{children}</div>{aside&&<div className="hero-aside">{aside}</div>}</section>}
