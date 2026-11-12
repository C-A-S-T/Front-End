import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, Check, ChevronDown, ChevronRight, FileText, GitCompare, Search, X } from 'lucide-react';
import { POLICIES, POLICY_FIELDS, POLICY_GROUPS } from '../data/demo';
// 보관함 '정책 변경' 탭: 같은 정책의 여러 버전이 보관되어 있으면 무엇이 바뀌었는지,
// 그리고 예전에 확인한 주장이 지금도 맞는지를 한곳에서 보여 줍니다.
// 정책이 여러 개여도 고르는 단계 없이 전부 아래에 쌓아 둡니다.
//  - 다시 확인할 주장이 있는 정책은 펼쳐 두고, 영향 없는 정책은 접어 둠
//  - 위의 정책 카드는 '목차': 누르면 그 정책으로 이동하며 펼쳐짐
//  - 정책이 많아지면 이름 검색 · '다시 확인 필요' 거르기로 좁혀 봄
// initial: { group, from, to } (문서 화면 · 보관함 목록에서 특정 정책으로 들어온 경우 그 정책으로 바로 이동)
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
export default function PolicyChanges({ sources, initial={}, onOpenDoc }){
 const groups=Object.entries(POLICY_GROUPS)
  .map(([gid,g])=>({gid,name:g.name,versions:g.versions.filter(v=>sources.some(s=>s.id===v))}))
  .filter(g=>g.versions.length>=2)
  .map(g=>{const vs=g.versions;const latest=POLICIES[vs[vs.length-1]];const prev=POLICIES[vs[vs.length-2]];
   return {...g,latest,
    changed:POLICY_FIELDS.filter(([k])=>prev.fields[k]!==latest.fields[k]).length,
    affected:prev.claims.filter(c=>c.field&&prev.fields[c.field]!==latest.fields[c.field]).length,
    folder:sources.find(s=>s.id===vs[0])?.folder}})
  .sort((a,b)=>b.affected-a.affected);
 const [closed,setClosed]=useState(()=>groups.filter(g=>!g.affected&&g.gid!==initial.group).map(g=>g.gid));
 const [onlyAffected,setOnlyAffected]=useState(false);
 const [query,setQuery]=useState('');
 const [focus,setFocus]=useState(null);
 const refs=useRef({});
 useEffect(()=>{if(groups.some(g=>g.gid===initial.group))jump(initial.group)},[]); // eslint-disable-line react-hooks/exhaustive-deps
 useEffect(()=>{if(!focus)return;const t=setTimeout(()=>setFocus(null),1600);return()=>clearTimeout(t)},[focus]);
 if(!groups.length)return <section className="paper-card policy-empty"><GitCompare size={28}/><p>같은 정책의 여러 버전이 보관되면 여기서 무엇이 바뀌었는지 비교할 수 있어요.</p></section>;
 const affectedCount=groups.filter(g=>g.affected).length;
 const q=query.trim().toLowerCase();
 const shown=groups.filter(g=>(!onlyAffected||g.affected)&&(!q||[g.name,g.folder].join(' ').toLowerCase().includes(q)));
 const allClosed=shown.length>0&&shown.every(g=>closed.includes(g.gid));
 const toggleOpen=gid=>setClosed(c=>c.includes(gid)?c.filter(x=>x!==gid):[...c,gid]);
 // 목차 카드: 그 정책을 펼치고 그 위치로 이동
 function jump(gid){setClosed(c=>c.filter(x=>x!==gid));setFocus(gid);requestAnimationFrame(()=>refs.current[gid]?.scrollIntoView({behavior:reduceMotion()?'auto':'smooth',block:'start'}))}
 return <div className="policy-board">
  <div className="pc-overview">
   <p><b>{groups.length}개</b> 정책을 추적하고 있어요. {affectedCount
    ?<>그중 <em>{affectedCount}개</em>는 예전에 확인한 주장을 다시 봐야 해요.</>
    :'모두 최신 버전 기준으로도 그대로 유효해요.'}</p>
   <div className="pc-tools">
    <label className="archive-search pc-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="정책 이름으로 찾기" aria-label="정책 이름 검색"/>{query&&<button type="button" aria-label="검색어 지우기" onClick={()=>setQuery('')}><X size={14}/></button>}</label>
    {affectedCount>0&&affectedCount<groups.length&&<div className="segmented" role="radiogroup" aria-label="정책 거르기">
     <button role="radio" aria-checked={!onlyAffected} className={!onlyAffected?'active':''} onClick={()=>setOnlyAffected(false)}>전체 {groups.length}</button>
     <button role="radio" aria-checked={onlyAffected} className={onlyAffected?'active':''} onClick={()=>setOnlyAffected(true)}>다시 확인 필요 {affectedCount}</button>
    </div>}
   </div>
  </div>

  {shown.length>0&&<nav className="pc-cards" aria-label="정책 바로 가기">
   {shown.map(g=><button key={g.gid} className={'pc-card'+(focus===g.gid?' active':'')} onClick={()=>jump(g.gid)} aria-label={g.name+' 비교로 이동'}>
    <span className="pc-card-top"><strong>{g.name}</strong>
     <span className={'pc-flag '+(g.affected?'warn':'ok')}>{g.affected?`주장 ${g.affected}개 재확인`:'영향 없음'}</span></span>
    <span className="pc-card-versions" aria-label="보관된 버전">{g.versions.map((v,i)=><span key={v}>{i>0&&<ChevronRight size={12} aria-hidden="true"/>}<i className={i===g.versions.length-1?'now':''}>{POLICIES[v].version}</i></span>)}</span>
    <span className="pc-card-change">최신 {g.latest.version}에서 <b>{g.changed}개 항목</b>이 바뀌었어요</span>
    <span className="pc-card-foot"><small>{g.folder} · 버전 {g.versions.length}개 보관</small><span className="pc-go">바로 보기 <ArrowRight size={12}/></span></span>
   </button>)}
  </nav>}

  {shown.length>0?<>
   <div className="pc-stack-bar">
    <span><b>{shown.length}개</b> 정책의 변경 내용 <small>정책 이름을 누르면 접고 펼 수 있어요</small></span>
    {shown.length>1&&<div><button className="soft-mini" onClick={()=>setClosed(c=>allClosed?c.filter(x=>!shown.some(g=>g.gid===x)):[...new Set([...c,...shown.map(g=>g.gid)])])}><ChevronDown size={13} className={allClosed?'':'flip'}/> {allClosed?'모두 펼치기':'모두 접기'}</button></div>}
   </div>
   {shown.map(g=><Compare key={g.gid+(initial.group===g.gid?`${initial.from}-${initial.to}`:'')} sectionRef={el=>{refs.current[g.gid]=el}} focused={focus===g.gid} group={g} open={!closed.includes(g.gid)} onToggle={()=>toggleOpen(g.gid)} initial={initial.group===g.gid?initial:{}} onOpenDoc={onOpenDoc}/>)}
  </>
  :<section className="paper-card policy-empty"><Search size={26}/><p>‘{query}’에 맞는 정책이 없어요.</p><button className="outline-small" onClick={()=>{setQuery('');setOnlyAffected(false)}}>전체 보기</button></section>}
 </div>;
}

function Compare({group,open,onToggle,focused,sectionRef,initial,onOpenDoc}){
 const vs=group.versions;const latestId=vs[vs.length-1];
 // 고를 수 있는 비교를 미리 만들어 둠: 연도별 변경(직전 → 다음) + 처음 → 최신 전체 변경. 항상 오래된 버전 → 새 버전 순서
 const sort=(a,b)=>vs.indexOf(a)<vs.indexOf(b)?[a,b]:[b,a];
 const pairs=vs.slice(1).map((v,i)=>[vs[i],v]).reverse();
 if(vs.length>2)pairs.push([vs[0],latestId]);
 const asked=vs.includes(initial.from)&&vs.includes(initial.to)&&initial.from!==initial.to?sort(initial.from,initial.to):null;
 if(asked&&!pairs.some(([a,b])=>a===asked[0]&&b===asked[1]))pairs.push(asked);
 const [pair,setPair]=useState(asked||pairs[0]);
 const [showSame,setShowSame]=useState(false);
 const [oldId,newId]=pair;
 const before=POLICIES[oldId],after=POLICIES[newId];
 const rows=POLICY_FIELDS.map(([key,label])=>({key,label,before:before.fields[key],after:after.fields[key]}));
 const changed=rows.filter(r=>r.before!==r.after);const same=rows.filter(r=>r.before===r.after);
 // 예전 버전을 근거로 확인했던 주장 중, 새 버전에서 해당 항목이 바뀐 것
 const affected=before.claims.filter(c=>c.field&&before.fields[c.field]!==after.fields[c.field]);
 return <section ref={sectionRef} className={'paper-card policy-compare'+(open?'':' closed')+(focused?' focused':'')}>
  <header className="pc-head">
   <button className="pc-toggle-head" aria-expanded={open} onClick={onToggle}>
    <ChevronDown size={18} className="pc-caret" aria-hidden="true"/>
    <span><h3>{group.name}</h3><p>{before.version}에서 {after.version}으로 <b>{changed.length}개 항목</b>이 바뀌었어요</p></span>
   </button>
   {!open&&<span className={'pc-flag '+(affected.length?'warn':'ok')}>{affected.length?`주장 ${affected.length}개 재확인`:'영향 없음'}</span>}
   {open&&pairs.length>1&&<div className="pc-pairs" role="radiogroup" aria-label="비교할 버전">
    {pairs.map(([a,b])=>{const on=a===oldId&&b===newId;const whole=vs.length>2&&a===vs[0]&&b===latestId;return <button key={a+b} role="radio" aria-checked={on} className={on?'on':''} onClick={()=>{setPair([a,b]);setShowSame(false)}}>{POLICIES[a].version}<ArrowRight size={13} aria-hidden="true"/>{POLICIES[b].version}{whole&&<em>전체</em>}</button>})}
   </div>}
  </header>

  {/* 접고 펼칠 때 높이가 부드럽게 바뀌도록 내용은 항상 그려 두고, 접힌 동안은 키보드로도 들어가지 않게 inert 처리 */}
  <div className={'pc-body'+(open?' open':'')} inert={open?undefined:''}><div className="pc-body-inner">
  <ol className="pc-timeline" aria-label="보관된 버전">
   {vs.map(v=><li key={v} className={(v===oldId||v===newId?'picked ':'')+(v===latestId?'latest':'')}><span className="dot"/><b>{POLICIES[v].version}</b><small>{POLICIES[v].effective}</small></li>)}
  </ol>

  {/* 결론 먼저: 내 리서치에 영향이 있는지 */}
  <div className={'pc-impact'+(affected.length?' warn':' ok')}>
   <h4>{affected.length?<AlertTriangle size={16}/>:<Check size={16}/>} 내 리서치에 미치는 영향</h4>
   {affected.length
    ?<><p>{before.version}을 근거로 확인했던 주장 중 <b>{affected.length}개</b>가 {after.version} 기준으로는 달라요.</p>
      <ul>{affected.map(c=><li key={c.text}><span>{c.text}</span><small>{POLICY_FIELDS.find(([k])=>k===c.field)[1]} → {after.fields[c.field]}</small></li>)}</ul></>
    :<p>{before.version}을 근거로 확인했던 주장은 {after.version}에서도 그대로 유효해요.</p>}
  </div>

  <div className="diff-table" role="table" aria-label="바뀐 항목">
   <div className="diff-row head" role="row"><span role="columnheader">항목</span><span role="columnheader">{before.version}</span><span aria-hidden="true"/><span role="columnheader">{after.version}</span></div>
   {changed.map(r=><div key={r.key} className="diff-row" role="row"><span className="diff-label" role="cell">{r.label}</span><span className="diff-before" role="cell">{r.before}</span><ArrowRight size={16} className="diff-arrow" aria-hidden="true"/><span className="diff-after" role="cell">{r.after}</span></div>)}
   {showSame&&same.map(r=><div key={r.key} className="diff-row same" role="row"><span className="diff-label" role="cell">{r.label}</span><span className="diff-same" role="cell">{r.before} <small>변경 없음</small></span></div>)}
  </div>
  {same.length>0&&<button className="inline-link pc-toggle" onClick={()=>setShowSame(!showSame)}>{showSame?'같은 항목 접기':`변경 없는 항목 ${same.length}개 보기`}</button>}

  <footer className="pc-foot">
   <button className="outline-small" onClick={()=>onOpenDoc(oldId)}><FileText size={15}/> {before.version} 문서</button>
   <button className="outline-small" onClick={()=>onOpenDoc(newId)}><FileText size={15}/> {after.version} 문서</button>
  </footer>
  </div></div>
 </section>;
}
