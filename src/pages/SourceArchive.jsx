import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Copy, Ellipsis, ExternalLink, FileText, Folder, FolderInput, GitCompare, History, RotateCcw, Search, Trash2, X } from 'lucide-react';
import AppShell,{StateBadge} from '../components/AppShell';
import Dropdown from '../components/Dropdown';
import { POLICIES } from '../data/demo';
import { FOLDERS, RECENT_DAYS, citation, isRecent, loadArchive, moveToFolder, openOriginal, policyVersion, removeSources, sourceDetail } from '../utils/archive';
export default function SourceArchive(){
 const nav=useNavigate();
 const [query,setQuery]=useState('');const [type,setType]=useState('전체');const [trust,setTrust]=useState('전체');const [folder,setFolder]=useState('전체');const [recentOnly,setRecentOnly]=useState(false);const [checked,setChecked]=useState([]);const [page,setPage]=useState(1);const [sort,setSort]=useState('latest');
 const [sources,setSources]=useState(()=>loadArchive());const [menu,setMenu]=useState(null);const [folderPick,setFolderPick]=useState(false);const [toast,setToast]=useState('');
 useEffect(()=>{const sync=()=>setSources(loadArchive());window.addEventListener('cast:archive-change',sync);return()=>window.removeEventListener('cast:archive-change',sync)},[]);
 useEffect(()=>{const fn=(event)=>{const d=event.detail;if(d.type)setType(v=>v===d.type?'전체':d.type);if(d.trust)setTrust(v=>v===d.trust?'전체':d.trust);if(d.folder)setFolder(v=>v===d.folder?'전체':d.folder);if(d.recent)setRecentOnly(v=>!v);if(d.all){setQuery('');setType('전체');setTrust('전체');setFolder('전체');setRecentOnly(false)}setPage(1)};window.addEventListener('cast:archive-filter',fn);return()=>window.removeEventListener('cast:archive-filter',fn)},[]);
 useEffect(()=>{if(!menu)return;const close=()=>{setMenu(null);setFolderPick(false)};window.addEventListener('click',close);return()=>window.removeEventListener('click',close)},[menu]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2200);return()=>clearTimeout(t)},[toast]);
 const result=useMemo(()=>sources.filter(s=>(!query||[s.title,s.domain,s.type].join(' ').toLowerCase().includes(query.toLowerCase()))&&(type==='전체'||s.type===type)&&(trust==='전체'||s.trust===trust)&&(folder==='전체'||s.folder===folder)&&(!recentOnly||isRecent(s.date))).sort((a,b)=>sort==='latest'?b.date.localeCompare(a.date):a.title.localeCompare(b.title)),[sources,query,type,trust,folder,recentOnly,sort]);
 const maxPage=Math.max(1,Math.ceil(result.length/8));const curPage=Math.min(page,maxPage);const displayed=result.slice((curPage-1)*8,curPage*8);
 const numFilters=[type,trust,folder].filter(s=>s!=='전체').length+Number(recentOnly);
 const picked=sources.filter(s=>checked.includes(s.id));
 const comparePair=picked.length===2&&picked.every(s=>POLICIES[s.id])&&POLICIES[picked[0].id].group===POLICIES[picked[1].id].group?picked:null;
 function reset(){setQuery('');setType('전체');setTrust('전체');setFolder('전체');setRecentOnly(false);setPage(1)}
 // 제목을 누르면 출처 상세 화면으로 이동합니다. (정책 자료는 버전 비교까지 함께 표시)
 function open(s){nav('/archive/'+s.id)}
 function versionBadge(id){const v=policyVersion(id);if(!v)return null;return v.isCurrent?<span className="version-tag current">현재 정책</span>:<span className="version-tag past">지난 정책</span>}
 function toggleCheck(id){setChecked(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id])}
 function copy(text,msg){(navigator.clipboard?.writeText(text)||Promise.reject()).then(()=>setToast(msg),()=>window.prompt('아래 내용을 복사해 주세요.',text))}
 function move(ids,name){moveToFolder(ids,name);setToast(`${ids.length}개 출처를 ‘${name}’ 폴더로 옮겼어요.`)}
 function remove(ids){if(!window.confirm(`선택한 출처 ${ids.length}개를 보관함에서 삭제할까요?\n삭제한 출처는 목록에서 사라져요.`))return;removeSources(ids);setChecked(old=>old.filter(id=>!ids.includes(id)));setToast(`${ids.length}개 출처를 삭제했어요.`)}
 function linkedResearch(s){const d=sourceDetail(s);if(d.linked)return nav('/research');window.alert(`‘${d.research}’ 리서치 기록은 시연 데이터에 포함되어 있지 않습니다.`)}
 function compare(){const [a,b]=comparePair;const v=policyVersion(a.id).versions;const [older,newer]=v.indexOf(a.id)<v.indexOf(b.id)?[a.id,b.id]:[b.id,a.id];nav(`/archive/${older}?compare=${newer}`)}
 function rowMenu(s,i){const v=policyVersion(s.id);const up=i>=displayed.length-3&&displayed.length>4;
  return <div className={'row-menu'+(up?' up':'')} role="menu" onClick={e=>e.stopPropagation()}>
   <button role="menuitem" className={folderPick?'open':''} onClick={()=>setFolderPick(!folderPick)}><FolderInput size={14}/> 폴더 이동 <ChevronRight size={13} className="menu-caret"/></button>
   {folderPick&&<div className="menu-sub">{FOLDERS.map(([name,,color])=><button key={name} disabled={s.folder===name} onClick={()=>{move([s.id],name);setMenu(null);setFolderPick(false)}}><span className={'tiny-square '+color}/>{name}{s.folder===name&&<small>현재</small>}</button>)}</div>}
   <button role="menuitem" onClick={()=>{setMenu(null);linkedResearch(s)}}><FileText size={14}/> 연결된 리서치 보기</button>
   {v&&<button role="menuitem" onClick={()=>nav('/archive/'+(v.isCurrent?s.id:v.currentId))}><History size={14}/> {v.isCurrent?'정책 변경 이력 보기':'최신 정책 확인'}</button>}
   <button role="menuitem" onClick={()=>{setMenu(null);copy(citation(s),'인용문을 복사했어요.')}}><Copy size={14}/> 인용문 복사</button>
   <div className="menu-divider"/>
   <button role="menuitem" className="danger" onClick={()=>{setMenu(null);remove([s.id])}}><Trash2 size={14}/> 보관함에서 삭제</button>
  </div>}
 const folderCount=name=>sources.filter(s=>s.folder===name).length;
 return <AppShell page="archive" filters={{type,trust,folder,recentOnly,none:!numFilters&&!query}}><main className="workspace-main archive-page">
  <div className="page-intro archive-intro"><span className="eyebrow">SOURCE ARCHIVE</span><div className="research-heading"><h1>출처 보관함</h1><span className="trust-chip">✦ 보관 출처 {sources.length}건</span></div><p>모아 둔 근거를 한곳에서 관리하고, 언제든 다시 확인할 수 있어요.</p></div>
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
    {displayed.map((s,i)=><tr key={s.id} className={checked.includes(s.id)?'row-checked':''}><td><input type="checkbox" checked={checked.includes(s.id)} onChange={()=>toggleCheck(s.id)} aria-label={s.title+' 선택'}/></td><td><button className="source-link" onClick={()=>open(s)}><strong>{s.title}{versionBadge(s.id)}</strong><small>{s.domain} · {s.folder}</small></button></td><td><span className="source-type">{s.type}</span></td><td>{s.date}</td><td><StateBadge tone={s.trust==='높음'?'success':'warning'} label={s.trust}/></td>
     <td className="action-cell"><button aria-label={s.title+' 원문 열기'} title="원문 열기 (새 탭)" onClick={()=>openOriginal(s)}><ExternalLink size={18}/></button>
      <span className="menu-anchor"><button aria-label={s.title+' 더보기'} title="더보기" aria-haspopup="menu" aria-expanded={menu===s.id} onClick={e=>{e.stopPropagation();setFolderPick(false);setMenu(menu===s.id?null:s.id)}}><Ellipsis size={18}/></button>{menu===s.id&&rowMenu(s,i)}</span></td></tr>)}
   </tbody></table>{result.length===0&&<div className="empty-filter">조건에 맞는 출처가 없습니다. 필터를 변경해 보세요.</div>}</div>
   <div className="table-footer"><div><button disabled={curPage===1} onClick={()=>setPage(curPage-1)}><ChevronLeft size={13}/> 이전</button><span>{curPage} / {maxPage} 페이지</span><button disabled={curPage>=maxPage} onClick={()=>setPage(curPage+1)}>다음 <ChevronRight size={13}/></button></div><span>{numFilters||query?'검색 결과':'전체 출처'} : {result.length}건 <span className="demo-small">(화면 시연용 목록)</span></span></div>
  </section>
  {toast&&<div className="archive-toast" role="status">{toast}</div>}
 </main></AppShell>;
}
