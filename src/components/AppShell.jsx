import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, FileText, Folder, LogOut, Plus, Bookmark, Sparkles } from 'lucide-react';
export default function AppShell({ children, page='research' }) {
  const nav=useNavigate();
  const [profileOpen,setProfileOpen]=useState(false);
  const isArchive=page==='archive';
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
        <NavLink to="/archive" className="nav-item selected"><Folder size={15}/> 전체 출처 <span className="pill-count">26</span></NavLink>
        <button className="nav-item" onClick={()=>window.dispatchEvent(new CustomEvent('cast:archive-filter',{detail:{favorite:true}}))}><Bookmark size={15}/> 즐겨찾기</button>
        <button className="nav-item" onClick={()=>window.dispatchEvent(new CustomEvent('cast:archive-filter',{detail:{recent:true}}))}><Sparkles size={15}/> 최근 저장</button>
        <div className="sidebar-label side-section">주제별 폴더</div>
        {[['청약·주거',8,'blue'],['정부 지원정책',12,'green'],['교육',6,'gold']].map(([name,count,color])=><button key={name} className="nav-item folder-item" onClick={()=>window.dispatchEvent(new CustomEvent('cast:archive-filter',{detail:{folder:name}}))}><span className={'tiny-square '+color}/>{name}<span className="sidebar-num">{count}</span></button>)}
        <div className="sidebar-label side-section">출처 유형</div>
        {['정부자료','보고서','논문','공식통계','뉴스기사'].map(type=><button key={type} className="nav-item filter-side" onClick={()=>window.dispatchEvent(new CustomEvent('cast:archive-filter',{detail:{type}}))}><span className="tiny-outline"/>{type}</button>)}
        <div className="sidebar-label side-section">신뢰도</div>
        {[['높음','green'],['보통','gold']].map(([t,c])=><button key={t} className="nav-item filter-side" onClick={()=>window.dispatchEvent(new CustomEvent('cast:archive-filter',{detail:{trust:t}}))}><span className={'tiny-square '+c}/>{t}</button>)}
      </> : <>
        <NavLink to="/archive" className="nav-item"><Folder size={15}/> 출처 보관함 <span className="pill-count">26</span></NavLink>
        <div className="sidebar-label side-section">리서치 기록</div>
        <button className="nav-item selected" onClick={()=>nav('/research')}><FileText size={15}/> 청년 월세 지원</button>
      </>}
      </div>
    </aside>
    <div className="app-pane">
      <header className="app-topbar"><div className="breadcrumb">워크스페이스 <span>/</span> <strong>{isArchive?'출처 보관함':'리서치 결과'}</strong></div>
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
