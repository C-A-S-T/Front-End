import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FOLDERS, loadArchive } from '../utils/archive';
import { ArrowLeft, ChevronDown, FileText, Folder, LogOut, Plus, Sparkles } from 'lucide-react';
// filters: 보관함 화면이 넘겨주는 현재 필터 상태. 사이드바에서 켜진 항목만 선택 표시합니다.
export default function AppShell({ children, page='research', crumb, filters }) {
  const nav=useNavigate();
  const [profileOpen,setProfileOpen]=useState(false);
  const isArchive=page==='archive';
  // 보관함 개수는 삭제·폴더 이동이 바뀔 때마다 다시 계산합니다.
  const [archive,setArchive]=useState(()=>({sources:loadArchive()}));
  useEffect(()=>{const sync=()=>setArchive({sources:loadArchive()});window.addEventListener('cast:archive-change',sync);return()=>window.removeEventListener('cast:archive-change',sync)},[]);
  const filter=detail=>{if(window.location.pathname!=='/archive')nav('/archive');setTimeout(()=>window.dispatchEvent(new CustomEvent('cast:archive-filter',{detail})),50)};
  const newResearch=()=>{sessionStorage.removeItem('cast-question');sessionStorage.setItem('cast-new-research','true');window.dispatchEvent(new Event('cast:new-research'));nav('/research')};
  const leave=()=>{sessionStorage.removeItem('cast-demo-session');nav('/login')};
  return <div className="app-shell">
    <aside className="app-sidebar">
      <button className="app-wordmark" onClick={()=>nav('/research')} aria-label="C.A.S.T 메인페이지">
        <span className="mini-mark">C</span><span><strong>C.A.S.T</strong><small>신뢰형 리서치 에이전트</small></span>
      </button>
      <div className="sidebar-main">
      <button className="sidebar-primary" onClick={isArchive?()=>nav('/research'):newResearch}>{isArchive?<ArrowLeft size={15}/>:<Plus size={17}/>} {isArchive?'리서치로 돌아가기':'새 리서치'}</button>
      {isArchive ? <>
        <button className={'nav-item'+(filters?.none?' selected':'')} onClick={()=>filter({all:true})}><Folder size={15}/> 전체 출처 <span className="pill-count">{archive.sources.length}</span></button>
        <button className={'nav-item'+(filters?.recentOnly?' selected':'')} onClick={()=>filter({recent:true})}><Sparkles size={15}/> 최근 저장</button>
        <div className="sidebar-label side-section">주제별 폴더</div>
        {FOLDERS.map(([name,,color])=><button key={name} className={'nav-item folder-item'+(filters?.folder===name?' selected':'')} onClick={()=>filter({folder:name})}><span className={'tiny-square '+color}/>{name}<span className="sidebar-num">{archive.sources.filter(s=>s.folder===name).length}</span></button>)}
        <div className="sidebar-label side-section">출처 유형</div>
        {['정부자료','보고서','논문','공식통계','뉴스기사'].map(type=><button key={type} className={'nav-item filter-side'+(filters?.type===type?' selected':'')} onClick={()=>filter({type})}><span className="tiny-outline"/>{type}</button>)}
        <div className="sidebar-label side-section">신뢰도</div>
        {[['높음','green'],['보통','gold']].map(([t,c])=><button key={t} className={'nav-item filter-side'+(filters?.trust===t?' selected':'')} onClick={()=>filter({trust:t})}><span className={'tiny-square '+c}/>{t}</button>)}
      </> : <>
        <NavLink to="/archive" className="nav-item"><Folder size={15}/> 출처 보관함 <span className="pill-count">{archive.sources.length}</span></NavLink>
        <div className="sidebar-label side-section">리서치 기록</div>
        <button className="nav-item selected" onClick={()=>nav('/research')}><FileText size={15}/> 청년 월세 지원</button>
      </>}
      </div>
    </aside>
    <div className="app-pane">
      <header className="app-topbar"><div className="breadcrumb">워크스페이스 <span>/</span> {crumb?<><button className="crumb-link" onClick={()=>nav('/archive')}>출처 보관함</button> <span>/</span> <strong>{crumb}</strong></>:<strong>{isArchive?'출처 보관함':'리서치 결과'}</strong>}</div>
        <div className="profile-shell"><button className="profile-pill" onClick={()=>setProfileOpen(!profileOpen)}>Profile <ChevronDown size={13}/></button><button className="avatar" onClick={()=>setProfileOpen(!profileOpen)}>CT</button>
          {profileOpen&&<div className="profile-menu"><span>데모 프로필</span><button onClick={leave}><LogOut size={15}/> 로그아웃</button></div>}
        </div>
      </header>
      {children}
    </div>
  </div>;
}
export function SectionTitle({ children, suffix }){return <div className="section-title"><h3>{children}</h3>{suffix&&<span>{suffix}</span>}</div>}
export function StateBadge({label,tone='muted'}){return <span className={'state-badge '+tone}>{label}</span>}
