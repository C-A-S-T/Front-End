import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bookmark, BookmarkX, ChevronLeft, ChevronRight, Copy, Ellipsis, ExternalLink, FileText, Folder, FolderInput, GitCompare, History, Info, RotateCcw, Search, Trash2, X } from 'lucide-react';
import AppShell,{PageHero,StateBadge} from '../components/AppShell';
import Dropdown from '../components/Dropdown';
import PolicyChanges from '../components/PolicyChanges';
import { POLICIES, POLICY_GROUPS } from '../data/demo';
import { FOLDERS, RECENT_DAYS, citation, isRecent, loadArchive, moveToFolder, openOriginal, policyVersion, removeSources, scrapText, sourceDetail } from '../utils/archive';
import { loadScraps, saveScraps } from '../utils/storage';
import { Presence, useLingering } from '../utils/presence';
export default function SourceArchive(){
 const nav=useNavigate();const [params]=useSearchParams();
 const [query,setQuery]=useState('');const [type,setType]=useState('전체');const [trust,setTrust]=useState('전체');const [folder,setFolder]=useState('전체');const [recentOnly,setRecentOnly]=useState(false);const [checked,setChecked]=useState([]);const [page,setPage]=useState(1);const [sort,setSort]=useState('latest');
 const [sources,setSources]=useState(()=>loadArchive());const [scraps,setScraps]=useState(()=>loadScraps());
 // tab: 'docs'(자동 저장된 출처 문서) | 'scraps'(내가 스크랩한 원문 문장) | 'policies'(정책 변경)
 // 주소로도 열 수 있음: /archive?tab=policies&group=…&from=…&to=…
 const [tab,setTab]=useState(()=>params.get('tab')||'docs');
 useEffect(()=>{if(params.get('tab'))setTab(params.get('tab'))},[params]);
 const policyInitial={group:params.get('group'),from:params.get('from'),to:params.get('to')};
 const policyCount=Object.values(POLICY_GROUPS).filter(g=>g.versions.filter(v=>sources.some(s=>s.id===v)).length>=2).length;
 const [menu,setMenu]=useState(null);const [folderPick,setFolderPick]=useState(false);const [toast,setToast]=useState('');
 useEffect(()=>{const sync=()=>{setSources(loadArchive());setScraps(loadScraps())};window.addEventListener('cast:archive-change',sync);return()=>window.removeEventListener('cast:archive-change',sync)},[]);
 useEffect(()=>{const fn=(event)=>{const d=event.detail;setTab(d.tab||'docs');if(d.type)setType(v=>v===d.type?'전체':d.type);if(d.trust)setTrust(v=>v===d.trust?'전체':d.trust);if(d.folder)setFolder(v=>v===d.folder?'전체':d.folder);if(d.recent)setRecentOnly(v=>!v);if(d.all){setQuery('');setType('전체');setTrust('전체');setFolder('전체');setRecentOnly(false)}setPage(1)};window.addEventListener('cast:archive-filter',fn);return()=>window.removeEventListener('cast:archive-filter',fn)},[]);
 useEffect(()=>{if(!menu)return;const close=()=>{setMenu(null);setFolderPick(false)};window.addEventListener('click',close);return()=>window.removeEventListener('click',close)},[menu]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2200);return()=>clearTimeout(t)},[toast]);
 const [toastText,toastClosing]=useLingering(toast);
 const result=useMemo(()=>sources.filter(s=>(!query||[s.title,s.domain,s.type].join(' ').toLowerCase().includes(query.toLowerCase()))&&(type==='전체'||s.type===type)&&(trust==='전체'||s.trust===trust)&&(folder==='전체'||s.folder===folder)&&(!recentOnly||isRecent(s.date))).sort((a,b)=>sort==='latest'?b.date.localeCompare(a.date):a.title.localeCompare(b.title)),[sources,query,type,trust,folder,recentOnly,sort]);
 const maxPage=Math.max(1,Math.ceil(result.length/8));const curPage=Math.min(page,maxPage);const displayed=result.slice((curPage-1)*8,curPage*8);
 const numFilters=[type,trust,folder].filter(s=>s!=='전체').length+Number(recentOnly);
 const picked=sources.filter(s=>checked.includes(s.id));
 const comparePair=picked.length===2&&picked.every(s=>POLICIES[s.id])&&POLICIES[picked[0].id].group===POLICIES[picked[1].id].group?picked:null;
 function reset(){setQuery('');setType('전체');setTrust('전체');setFolder('전체');setRecentOnly(false);setPage(1)}
 // 제목을 누르면 출처 상세 화면으로 이동합니다. (정책 자료는 버전 비교까지 함께 표시)
 function open(s){nav('/archive/'+s.id)}
 function toggleCheck(id){setChecked(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id])}
 function copy(text,msg){(navigator.clipboard?.writeText(text)||Promise.reject()).then(()=>setToast(msg),()=>window.prompt('아래 내용을 복사해 주세요.',text))}
 function move(ids,name){moveToFolder(ids,name);setToast(`${ids.length}개 출처를 ‘${name}’ 폴더로 옮겼어요.`)}
 function remove(ids){if(!window.confirm(`선택한 출처 ${ids.length}개를 보관함에서 삭제할까요?\n삭제한 출처는 목록에서 사라져요.`))return;removeSources(ids);setChecked(old=>old.filter(id=>!ids.includes(id)));setToast(`${ids.length}개 출처를 삭제했어요.`)}
 function linkedResearch(s){const d=sourceDetail(s);if(d.linked)return nav('/research');window.alert(`‘${d.research}’ 리서치 기록은 시연 데이터에 포함되어 있지 않습니다.`)}
 function compare(){const [a,b]=comparePair;const v=policyVersion(a.id).versions;const [older,newer]=v.indexOf(a.id)<v.indexOf(b.id)?[a.id,b.id]:[b.id,a.id];nav(`/archive?tab=policies&group=${POLICIES[older].group}&from=${older}&to=${newer}`)}
 function rowMenu(s,i,closing){const v=policyVersion(s.id);const up=i>=displayed.length-3&&displayed.length>4;
  return <div className={'row-menu'+(up?' up':'')+(closing?' is-closing':'')} role="menu" onClick={e=>e.stopPropagation()}>
   <button role="menuitem" className={folderPick?'open':''} onClick={()=>setFolderPick(!folderPick)}><FolderInput size={14}/> 폴더 이동 <ChevronRight size={13} className="menu-caret"/></button>
   {folderPick&&<div className="menu-sub">{FOLDERS.map(([name,,color])=><button key={name} disabled={s.folder===name} onClick={()=>{move([s.id],name);setMenu(null);setFolderPick(false)}}><span className={'tiny-square '+color}/>{name}{s.folder===name&&<small>현재</small>}</button>)}</div>}
   <button role="menuitem" onClick={()=>{setMenu(null);linkedResearch(s)}}><FileText size={14}/> 연결된 리서치 보기</button>
   {v&&<button role="menuitem" onClick={()=>nav(`/archive?tab=policies&group=${v.group}`)}><History size={14}/> 정책 변경 내역 보기</button>}
   <button role="menuitem" onClick={()=>{setMenu(null);copy(citation(s),'인용문을 복사했어요.')}}><Copy size={14}/> 인용문 복사</button>
   <div className="menu-divider"/>
   <button role="menuitem" className="danger" onClick={()=>{setMenu(null);remove([s.id])}}><Trash2 size={14}/> 보관함에서 삭제</button>
  </div>}
 const folderCount=name=>sources.filter(s=>s.folder===name).length;
 return <AppShell page="archive" filters={{tab,type:tab==='docs'?type:null,trust:tab==='docs'?trust:null,folder:tab==='docs'?folder:null,recentOnly:tab==='docs'&&recentOnly,none:tab==='docs'&&!numFilters&&!query}}><main className="workspace-main archive-page design-page">
  <PageHero eyebrow="SOURCE ARCHIVE" title="출처 보관함" desc="리서치에서 모은 근거를 다시 꺼내 보는 곳이에요."
   aside={<div className="hero-stats"><div><span>저장된 문서</span><b className="mono">{sources.length}</b></div><div><span>스크랩한 문장</span><b className="mono">{scraps.length}</b></div><div><span>주제 폴더</span><b className="mono">{FOLDERS.length}</b></div></div>}/>
  {/* 보관함 보기 전환: 탭마다 색 · 아이콘 · '누가 저장했는지'를 다르게 보여 줘 문서와 문장을 헷갈리지 않게 함
      자동 저장된 문서 = 파랑(문서 단위, AI가 저장) · 내가 스크랩한 문장 = 보라(문장 단위, 내가 저장) · 정책 변경 = 청록 */}
  {(()=>{const views=[
    ['docs',FileText,'자동 저장된 문서',sources.length,'AI가 자동으로 저장한 문서','리서치 중 AI가 근거로 참고한 문서 전체가 쌓여요. 따로 저장하지 않아도 돼요.','문서 단위 · 자동'],
    ['scraps',Bookmark,'내가 스크랩한 문장',scraps.length,'내가 직접 스크랩한 문장','리서치 결과에서 ‘스크랩’을 누른 문장만 모여요. 문서 전체가 아니라 문장 하나하나예요.','문장 단위 · 직접'],
    ['policies',GitCompare,'정책 변경',policyCount,'같은 정책의 버전 비교','같은 정책의 여러 해 공고가 보관되면, 무엇이 바뀌었고 내 리서치에 영향이 있는지 알려 줘요.','버전 비교']];
   const [,Icon,,,title,desc,badge]=views.find(v=>v[0]===tab)||views[0];
   return <><div className="archive-tabs" role="tablist" aria-label="보관함 보기">{views.map(([key,TabIcon,label,count])=><button key={key} role="tab" aria-selected={tab===key} className={(tab===key?'active ':'')+'tab-'+key} onClick={()=>setTab(key)}><TabIcon size={16}/> {label} <span>{count}</span></button>)}</div>
    <div className={'kind-intro '+tab}><span className="kind-icon"><Icon size={18}/></span><div><strong>{title}</strong><p>{desc}</p></div><span className="kind-badge">{badge}</span></div></>})()}
  {tab==='docs'?<>
  <section className="paper-card folder-panel"><div className="section-title"><h3>주제별 폴더</h3><button onClick={()=>window.alert('폴더 생성·관리는 백엔드 연결 후 지원 예정입니다.')} className="link-small">폴더 관리 →</button></div><div className="folder-grid">{FOLDERS.map(([name,desc,color])=><button key={name} className={'folder-card '+(folder===name?'active':'')} onClick={()=>{setFolder(folder===name?'전체':name);setPage(1)}}><span className={'folder-icon '+color}><Folder size={20}/></span><strong>{name}</strong><b>{folderCount(name)}개 출처</b><small>{desc}</small></button>)}</div></section>
  <div className="archive-filters"><label className="archive-search"><Search size={16}/><input value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}} placeholder="출처 제목, 키워드, 출처명을 검색하세요"/></label>
   <Dropdown variant="field" label="출처 유형" value={type} onChange={v=>{setType(v);setPage(1)}} options={['전체','정부자료','보고서','논문','공식통계','뉴스기사'].map(x=>({value:x,label:x}))}/>
   <Dropdown variant="field" label="신뢰도" value={trust} onChange={v=>{setTrust(v);setPage(1)}} options={[{value:'전체',label:'전체'},{value:'높음',label:'높음',swatch:'green'},{value:'보통',label:'보통',swatch:'gold'}]}/>
   <Dropdown variant="field" label="주제별 폴더" value={folder} onChange={v=>{setFolder(v);setPage(1)}} options={[{value:'전체',label:'전체'},...FOLDERS.map(([name,,color])=>({value:name,label:name,swatch:color,hint:folderCount(name)+'개 출처'}))]}/>
  </div>
  <section className="paper-card archive-table-card">
   {checked.length>0?<div className="table-toolbar bulk-bar"><div><strong>✔ {checked.length}개 선택됨</strong>
     <Dropdown placeholder="폴더 이동" icon={<FolderInput size={14}/>} menuTitle="옮길 폴더 선택" onChange={name=>move(checked,name)} options={FOLDERS.map(([name,,color])=>({value:name,label:name,swatch:color}))}/>
     <button className="soft-mini" onClick={()=>copy(picked.map(citation).join('\n'),`${picked.length}개 인용문을 복사했어요.`)}><Copy size={13}/> 인용 내보내기</button>
     {comparePair&&<button className="selected-mini" onClick={compare}><GitCompare size={13}/> 선택한 두 버전 비교</button>}
     <button className="soft-mini danger-mini" onClick={()=>remove(checked)}><Trash2 size={13}/> 삭제</button></div>
     <button className="soft-mini" onClick={()=>setChecked([])}><X size={13}/> 선택 해제</button></div>
   :<div className="table-toolbar"><div><button className={recentOnly?'selected-mini':'soft-mini'} onClick={()=>{setRecentOnly(!recentOnly);setPage(1)}} title={`최근 ${RECENT_DAYS}일 이내 저장`}>최근 저장</button><span className="soft-mini">적용된 필터 {numFilters}개</span><button className="soft-mini" onClick={reset}><RotateCcw size={12}/> 필터 초기화</button></div><Dropdown align="right" value={sort} onChange={setSort} ariaLabel="정렬" options={[{value:'latest',label:'최신순',hint:'최근 저장한 출처부터'},{value:'name',label:'제목순',hint:'가나다 순서'}]}/></div>}
   <div className="table-scroll"><table className="source-table"><thead><tr><th><input type="checkbox" aria-label="이 페이지 전체 선택" checked={!!displayed.length&&displayed.every(s=>checked.includes(s.id))} onChange={e=>setChecked(e.target.checked?[...new Set([...checked,...displayed.map(s=>s.id)])]:checked.filter(id=>!displayed.some(s=>s.id===id)))}/></th><th>제목</th><th>출처 유형</th><th>저장일</th><th>신뢰도</th><th>작업</th></tr></thead><tbody>
    {displayed.map((s,i)=><tr key={s.id} className={checked.includes(s.id)?'row-checked':''}><td><input type="checkbox" checked={checked.includes(s.id)} onChange={()=>toggleCheck(s.id)} aria-label={s.title+' 선택'}/></td><td><button className="source-link" onClick={()=>open(s)}><strong>{s.title}</strong><small>{s.domain} · {s.folder}</small></button></td><td><span className="source-type">{s.type}</span></td><td>{s.date}</td><td><StateBadge tone={s.trust==='높음'?'success':'warning'} label={s.trust}/></td>
     <td className="action-cell"><button aria-label={s.title+' 원문 열기'} title="원문 열기 (새 탭)" onClick={()=>openOriginal(s)}><ExternalLink size={18}/></button>
      <span className="menu-anchor"><button aria-label={s.title+' 더보기'} title="더보기" aria-haspopup="menu" aria-expanded={menu===s.id} onClick={e=>{e.stopPropagation();setFolderPick(false);setMenu(menu===s.id?null:s.id)}}><Ellipsis size={18}/></button><Presence show={menu===s.id}>{closing=>rowMenu(s,i,closing)}</Presence></span></td></tr>)}
   </tbody></table>{result.length===0&&<div className="empty-filter">조건에 맞는 출처가 없습니다. 필터를 변경해 보세요.</div>}</div>
   <div className="table-footer"><div><button disabled={curPage===1} onClick={()=>setPage(curPage-1)}><ChevronLeft size={13}/> 이전</button><span>{curPage} / {maxPage} 페이지</span><button disabled={curPage>=maxPage} onClick={()=>setPage(curPage+1)}>다음 <ChevronRight size={13}/></button></div><span>{numFilters||query?'검색 결과':'전체 출처'} : {result.length}건 <span className="demo-small">(화면 시연용 목록)</span></span></div>
  </section>
  </>:tab==='scraps'?<ScrapBoard scraps={scraps} sources={sources} onOpenSource={q=>nav('/archive/'+q.sourceId)} copy={copy} setToast={setToast}/>
  :<PolicyChanges key={params.toString()} sources={sources} initial={policyInitial} onOpenDoc={id=>nav('/archive/'+id)}/>}
  {toastText&&<div className={'archive-toast'+(toastClosing?' is-closing':'')} role="status">{toastText}</div>}
 </main></AppShell>;
}

// 스크랩한 문장: 문서 표와 헷갈리지 않도록 '문장 카드'로 보여 줍니다. (보라색 = 내가 직접 저장)
// 카드 하나에 문장 · 이 문장으로 확인한 주장과 결과 · 원래 문서를 모두 담아, 따로 패널을 열지 않아도 됩니다.
// 스크랩의 출처 유형과 폴더는 원래 문서의 값을 따릅니다.
function ScrapBoard({scraps,sources,onOpenSource,copy,setToast}){
 const PER=8;
 const [query,setQuery]=useState('');const [type,setType]=useState('전체');const [status,setStatus]=useState('전체');const [folder,setFolder]=useState('전체');const [sort,setSort]=useState('latest');const [page,setPage]=useState(1);const [checked,setChecked]=useState([]);
 const rows=useMemo(()=>scraps.map(q=>{const src=sources.find(o=>o.id===q.sourceId);return {...q,hasSource:!!src,type:src?.type||'정부자료',folder:src?.folder||'정부 지원정책'}}),[scraps,sources]);
 const result=rows.filter(q=>(!query||[q.quote,q.sourceTitle,q.claim].join(' ').toLowerCase().includes(query.toLowerCase()))&&(type==='전체'||q.type===type)&&(status==='전체'||q.status===status)&&(folder==='전체'||q.folder===folder))
  .sort((a,b)=>sort==='latest'?b.date.localeCompare(a.date):a.sourceTitle.localeCompare(b.sourceTitle)||b.date.localeCompare(a.date));
 const maxPage=Math.max(1,Math.ceil(result.length/PER));const curPage=Math.min(page,maxPage);const displayed=result.slice((curPage-1)*PER,curPage*PER);
 const numFilters=[type,status,folder].filter(v=>v!=='전체').length;
 const picked=rows.filter(q=>checked.includes(q.id));
 const set=fn=>v=>{fn(v);setPage(1)};
 const toggle=id=>setChecked(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
 function reset(){setQuery('');setType('전체');setStatus('전체');setFolder('전체');setPage(1)}
 function unscrap(ids){const list=loadScraps().filter(q=>!ids.includes(q.id));saveScraps(list);setChecked(old=>old.filter(id=>!ids.includes(id)));setToast(`${ids.length}개 스크랩을 해제했어요.`)}
 return <>
  <div className="archive-filters"><label className="archive-search"><Search size={16}/><input value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}} placeholder="스크랩한 문장, 출처 문서, 주장을 검색하세요"/></label>
   <Dropdown variant="field" label="검증 결과" value={status} onChange={set(setStatus)} options={[{value:'전체',label:'전체'},{value:'근거 확인',label:'근거 확인',swatch:'green'},{value:'부분 확인',label:'부분 확인',swatch:'gold'},{value:'근거와 충돌',label:'근거와 충돌',swatch:'red'},{value:'근거 부족',label:'근거 부족',swatch:'gray'}]}/>
   <Dropdown variant="field" label="출처 유형" value={type} onChange={set(setType)} options={['전체','정부자료','보고서','논문','공식통계','뉴스기사'].map(x=>({value:x,label:x}))}/>
   <Dropdown variant="field" label="주제별 폴더" value={folder} onChange={set(setFolder)} options={[{value:'전체',label:'전체'},...FOLDERS.map(([name,,color])=>({value:name,label:name,swatch:color,hint:rows.filter(q=>q.folder===name).length+'개 스크랩'}))]}/>
  </div>
  {checked.length>0?<div className="table-toolbar bulk-bar scrap-bulk"><div><strong>✔ {checked.length}개 선택됨</strong>
    <button className="soft-mini" onClick={()=>copy(picked.map(scrapText).join('\n'),`${picked.length}개 문장을 복사했어요.`)}><Copy size={13}/> 인용 내보내기</button>
    <button className="soft-mini danger-mini" onClick={()=>unscrap(checked)}><BookmarkX size={13}/> 스크랩 해제</button></div>
    <button className="soft-mini" onClick={()=>setChecked([])}><X size={13}/> 선택 해제</button></div>
  :<div className="table-toolbar"><div><span className="soft-mini">적용된 필터 {numFilters}개</span><button className="soft-mini" onClick={reset}><RotateCcw size={12}/> 필터 초기화</button></div><Dropdown align="right" value={sort} onChange={setSort} ariaLabel="정렬" options={[{value:'latest',label:'최신순',hint:'최근 스크랩한 문장부터'},{value:'source',label:'문서순',hint:'같은 문서끼리 모아 보기'}]}/></div>}
  {result.length?<div className="scrap-cards">{displayed.map(q=>{const on=checked.includes(q.id);return <article key={q.id} className={'scrap-tile'+(on?' checked':'')}>
    <div className="scrap-tile-head">
     <input type="checkbox" checked={on} onChange={()=>toggle(q.id)} aria-label="문장 선택"/>
     <span className="kind-chip scraps"><Bookmark size={12} fill="currentColor"/> 내가 스크랩</span>
     <span className="scrap-date">{q.date}</span>
    </div>
    <blockquote>“{q.quote}”</blockquote>
    {q.claim&&<div className="scrap-claim"><span>이 문장으로 확인한 주장</span><b>{q.claim}</b>{q.status&&<StateBadge tone={q.tone} label={q.status}/>}</div>}
    <div className="scrap-tile-foot">
     <button className="scrap-source" disabled={!q.hasSource} onClick={()=>onOpenSource(q)} title={q.hasSource?'원래 문서 보기':'보관함에 없는 문서예요'}><FileText size={13}/><span>{q.sourceTitle}</span>{q.hasSource&&<ChevronRight size={13}/>}</button>
     <span className="scrap-actions">
      <button aria-label="문장 복사" title="문장 복사" onClick={()=>copy(scrapText(q),'문장을 복사했어요.')}><Copy size={16}/></button>
      <button aria-label="스크랩 해제" title="스크랩 해제" onClick={()=>unscrap([q.id])}><BookmarkX size={16}/></button>
     </span>
    </div>
   </article>})}</div>
  :<div className="paper-card scrap-empty"><Bookmark size={26}/><p>{scraps.length?'조건에 맞는 스크랩이 없습니다. 필터를 변경해 보세요.':'아직 스크랩한 문장이 없어요. 리서치 결과 화면의 근거 원문에서 ‘스크랩’을 누르면 여기에 모여요.'}</p></div>}
  {result.length>PER&&<div className="table-footer"><div><button disabled={curPage===1} onClick={()=>setPage(curPage-1)}><ChevronLeft size={13}/> 이전</button><span>{curPage} / {maxPage} 페이지</span><button disabled={curPage>=maxPage} onClick={()=>setPage(curPage+1)}>다음 <ChevronRight size={13}/></button></div><span>{numFilters||query?'검색 결과':'전체 스크랩'} : {result.length}건</span></div>}
 </>;
}
