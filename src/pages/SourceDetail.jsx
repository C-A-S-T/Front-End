import { Fragment, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, ChevronDown, Copy, ExternalLink, FileText, FolderInput, History, Info, Trash2 } from 'lucide-react';
import AppShell,{SectionTitle,StateBadge} from '../components/AppShell';
import Dropdown from '../components/Dropdown';
import { POLICIES, POLICY_FIELDS, POLICY_GROUPS } from '../data/demo';
import { FOLDERS, citation, loadArchive, loadNote, moveToFolder, openOriginal, relatedSources, removeSources, saveNote, savedAgo, sourceDetail } from '../utils/archive';
// 보관함 출처 상세: 저장해 둔 출처를 다시 꺼내 볼 때의 화면
// "무슨 자료였지 → 어떤 문장을 저장했지 → 어디에 썼지 → 내 메모 → 지금 써도 되나 → 같이 본 자료" 순서로 보여줍니다.
// 정책 자료는 여기에 버전 기록과 다른 버전(기본: 현재 정책)과의 비교가 더해집니다.
export default function SourceDetail(){
 const {id}=useParams();const nav=useNavigate();const [params]=useSearchParams();
 const [sources,setSources]=useState(()=>loadArchive());const [toast,setToast]=useState('');
 useEffect(()=>{const sync=()=>setSources(loadArchive());window.addEventListener('cast:archive-change',sync);return()=>window.removeEventListener('cast:archive-change',sync)},[]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2200);return()=>clearTimeout(t)},[toast]);
 const source=sources.find(s=>String(s.id)===id);
 const policy=POLICIES[id];
 const versions=policy?POLICY_GROUPS[policy.group].versions:[];const currentId=versions[versions.length-1];const isCurrent=id===currentId;
 const asked=params.get('compare');const defaultTarget=asked&&asked!==id&&versions.includes(asked)?asked:isCurrent?versions[versions.length-2]:currentId;
 const [targetState,setTarget]=useState({id,target:defaultTarget});
 if(!source)return <Navigate to="/archive" replace/>;
 const detail=sourceDetail(source);
 function copy(text,msg){(navigator.clipboard?.writeText(text)||Promise.reject()).then(()=>setToast(msg),()=>window.prompt('아래 내용을 복사해 주세요.',text))}
 function remove(){if(!window.confirm('이 출처를 보관함에서 삭제할까요?\n삭제한 출처는 목록에서 사라져요.'))return;removeSources([source.id]);nav('/archive')}

 const head=<>
  <button className="link-small back-link" onClick={()=>nav('/archive')}><ArrowLeft size={14}/> 출처 보관함으로</button>
  <div className="page-intro"><span className="eyebrow">{policy?'POLICY SNAPSHOT':'SAVED SOURCE'}</span>
   <div className="detail-title"><h1>{source.title}</h1>{policy?<span className={'version-chip '+(isCurrent?'current':'past')}>{isCurrent?'● 현재 시행 정책':'지난 정책 · '+policy.version}</span>:<StateBadge label={'신뢰도 '+source.trust} tone={source.trust==='높음'?'success':'warning'}/>}</div>
   <p>{detail.publisher} · {source.type}{detail.published&&<> · 발행 {detail.published}</>} · 저장 {source.date} ({savedAgo(source.date)})</p></div>
  <div className="detail-actions">
   <button className="outline-small" onClick={()=>openOriginal(source)}><ExternalLink size={15}/> 원문 열기</button>
   <button className="outline-small" onClick={()=>copy(citation(source),'출처 표기와 함께 인용문을 복사했어요.')}><Copy size={15}/> 인용 복사</button>
   <Dropdown value={source.folder} icon={<FolderInput size={15}/>} menuTitle="옮길 폴더 선택" ariaLabel="폴더 이동" onChange={name=>{moveToFolder([source.id],name);setToast(`‘${name}’ 폴더로 옮겼어요.`)}} options={FOLDERS.map(([name,,color])=>({value:name,label:name,swatch:color,note:name===source.folder?'현재 폴더':null,disabled:name===source.folder}))}/>
   <button className="outline-small danger-outline" onClick={remove}><Trash2 size={15}/> 삭제</button>
  </div>
 </>;
 const savedQuote=detail.quote&&<div className="saved-quote"><div className="saved-quote-head"><span>내가 저장한 문장</span><button className="inline-link" onClick={()=>copy(detail.quote,'문장을 복사했어요.')}><Copy size={13}/> 복사</button></div><blockquote>“{detail.quote}”</blockquote></div>;
 const usedIn=<p className="card-subtitle"><FileText size={12}/> {detail.linked?<button className="inline-link" onClick={()=>nav('/research')}>{detail.research} →</button>:<b>{detail.research}</b>}<span className="muted-note">리서치에서 근거로 사용</span></p>;
 const side=<>
  <Memo key={id} id={id}/>
  <Reliability source={source} detail={detail}/>
  <Related list={relatedSources(source,sources)} onOpen={s=>nav('/archive/'+s.id)}/>
 </>;
 const foot=toast&&<div className="archive-toast" role="status">{toast}</div>;

 if(!policy) return <AppShell page="archive" crumb={source.title}><main className="workspace-main policy-page">
  {head}
  <div className="detail-grid">
   <div className="result-col">
    <section className="paper-card"><SectionTitle>핵심 내용</SectionTitle><div className="summary-body policy-summary">{detail.summary}</div>{savedQuote}</section>
    <section className="paper-card"><SectionTitle suffix={'Claim '+detail.claims.length+'개'}>이 자료를 근거로 쓴 곳</SectionTitle>{usedIn}<ClaimList claims={detail.claims}/></section>
   </div>
   <div className="result-col">{side}</div>
  </div>
  {foot}
 </main></AppShell>;

 const targetId=targetState.id===id?targetState.target:defaultTarget;const target=POLICIES[targetId];const current=POLICIES[currentId];
 const olderFirst=versions.indexOf(id)<versions.indexOf(targetId);const [before,after]=olderFirst?[policy,target]:[target,policy];
 const rows=POLICY_FIELDS.map(([key,label])=>({key,label,before:before.fields[key],after:after.fields[key],changed:before.fields[key]!==after.fields[key]}));
 const changed=rows.filter(r=>r.changed);
 function nowCheck(c){if(isCurrent||!c.field)return null;return policy.fields[c.field]===current.fields[c.field]?<StateBadge label="현재도 유효" tone="success"/>:<StateBadge label="현재와 다름" tone="danger"/>}
 return <AppShell page="archive" crumb={source.title}><main className="workspace-main policy-page">
  {head}
  {!isCurrent&&<div className="policy-notice"><Info size={17}/><span>이 자료는 <b>지난 정책({policy.version})</b>이에요. 현재 시행 중인 정책({current.version})과 <b>{POLICY_FIELDS.filter(([k])=>policy.fields[k]!==current.fields[k]).length}개 항목</b>이 달라요.</span><button className="outline-small" onClick={()=>nav('/archive/'+currentId)}>현재 정책 보기 <ArrowRight size={14}/></button></div>}
  <section className="paper-card version-track"><div className="section-title"><h3>정책 버전 기록</h3><span>{POLICY_GROUPS[policy.group].name} · 보관 {versions.length}건</span></div>
   <ol>{versions.map(v=>{const p=POLICIES[v];return <li key={v}><button className={'version-node '+(v===id?'active ':'')+(v===currentId?'is-current':'')} onClick={()=>nav('/archive/'+v)}><span className="version-dot"/><strong>{p.version}{v===currentId&&<em>현재</em>}</strong><small>{p.effective}</small></button></li>})}</ol>
  </section>
  <div className="policy-grid">
   <div className="result-col">
    <section className="paper-card"><SectionTitle suffix={policy.version+' 기준'}>정책 요약</SectionTitle><div className="summary-body policy-summary">{policy.summary}</div>
     <dl className="evidence-details policy-fields">{POLICY_FIELDS.map(([k,label])=><Fragment key={k}><dt>{label}</dt><dd>{policy.fields[k]}</dd></Fragment>)}</dl>
     {savedQuote}
    </section>
    <section className="paper-card"><SectionTitle suffix={'Claim '+policy.claims.length+'개'}>이 자료를 근거로 쓴 곳</SectionTitle>{usedIn}
     <ClaimList claims={policy.claims} extraHead={isCurrent?null:'현재 기준'} extra={isCurrent?null:c=>nowCheck(c)||<span className="muted-dash">-</span>}/>
     {!isCurrent&&<p className="disclaimer"><Info size={11}/> ‘현재 기준’은 저장된 주장을 현재 시행 정책({current.version}) 내용과 다시 대조한 결과예요.</p>}
    </section>
   </div>
   <div className="result-col">
    <section className="paper-card compare-card"><SectionTitle>{targetId===currentId?'현재 정책과 비교':'다른 버전과 비교'}</SectionTitle>
     {/* 왼쪽: 지금 보고 있는 버전(고정) · 오른쪽: 나란히 볼 비교 상대(선택) */}
     <div className="compare-pair"><div className="pair-side fixed"><small>보고 있는 버전</small><strong>{policy.version}{isCurrent&&<em>현재</em>}</strong></div><span className="pair-vs">⇄</span>
      <div className="pair-side"><small>비교 상대</small><Dropdown value={targetId} onChange={v=>setTarget({id,target:v})} icon={<History size={15}/>} menuTitle="비교 상대 선택" ariaLabel="비교 상대 버전" options={versions.map(v=>({value:v,label:POLICIES[v].version,hint:POLICIES[v].effective,badge:v===currentId?'현재':null,note:v===id?'보고 있는 버전':null,disabled:v===id}))}/></div></div>
     <div className="compare-stats"><div><span>변경된 항목</span><strong>{changed.length}</strong></div><div><span>동일한 항목</span><strong>{rows.length-changed.length}</strong></div></div>
     <table className="compare-table"><thead><tr><th>항목</th><th>{before.version}</th><th>{after.version}</th><th/></tr></thead><tbody>
      {rows.map(r=><tr key={r.key} className={r.changed?'changed':''}><th>{r.label}</th><td>{r.before}</td><td>{r.after}</td><td><StateBadge label={r.changed?'변경':'동일'} tone={r.changed?'warning':'muted'}/></td></tr>)}
     </tbody></table>
     {changed.length>0&&<div className="change-summary"><p className="evidence-tiny-label">주요 변경 사항</p><ul>{changed.map(r=><li key={r.key}><b>{r.label}</b><span>{r.before}</span><ArrowRight size={13}/><span className="after">{r.after}</span></li>)}</ul></div>}
     <p className="disclaimer"><Info size={11}/> 시연용 가상 정책 데이터이며 실제 정책·행정 정보가 아닙니다.</p>
    </section>
    {side}
   </div>
  </div>
  {foot}
 </main></AppShell>;
}

// 주장 목록: 줄을 누르면 판단 이유가 펼쳐집니다. extra는 정책 화면의 '현재 기준' 칸
function ClaimList({claims,extra,extraHead}){
 const [open,setOpen]=useState(null);
 if(!claims.length)return <div className="empty-filter">아직 이 자료를 근거로 쓴 주장이 없어요.</div>;
 return <div className={'claim-list'+(extra?' has-extra':'')}>
  {extraHead&&<div className="claim-item head"><span/><span>주장</span><span>당시 검증</span><span>{extraHead}</span><span/></div>}
  {claims.map((c,i)=>{const isOpen=open===i;return <div key={i} className={'claim-block'+(isOpen?' open':'')}>
   <button className="claim-item" aria-expanded={isOpen} disabled={!c.reason} onClick={()=>setOpen(isOpen?null:i)}><span className="claim-num">{String(i+1).padStart(2,'0')}</span><b>{c.text}</b><StateBadge label={c.status} tone={c.tone}/>{extra&&extra(c)}<span className="claim-caret">{c.reason&&<ChevronDown size={16}/>}</span></button>
   {isOpen&&<p className="claim-reason"><span>판단 이유</span>{c.reason}</p>}
  </div>})}
 </div>;
}

// 내 메모: 입력을 멈추면 자동 저장
function Memo({id}){
 const [text,setText]=useState(()=>loadNote(id));const [state,setState]=useState(text?'saved':'idle');const timer=useRef();
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 function change(v){setText(v);setState('typing');clearTimeout(timer.current);timer.current=setTimeout(()=>{saveNote(id,v);setState('saved')},600)}
 return <section className="paper-card memo-card"><SectionTitle suffix={state==='typing'?'입력 중…':state==='saved'&&text?'✓ 자동 저장됨':''}>내 메모</SectionTitle>
  <textarea value={text} onChange={e=>change(e.target.value)} rows={4} placeholder={'왜 저장했는지, 어디에 쓸지 적어 두세요.\n예) 보고서 2장 지원 대상 근거로 사용'} aria-label="내 메모"/>
 </section>;
}

// 지금 써도 될까: 발행 정보와 신뢰도 근거 · 주의할 점
function Reliability({source,detail}){
 return <section className="paper-card"><SectionTitle>지금 써도 될까?</SectionTitle>
  <dl className="evidence-details reliability-meta"><dt>발행 기관</dt><dd>{detail.publisher}</dd>{detail.published&&<><dt>발행일</dt><dd>{detail.published}</dd></>}<dt>저장일</dt><dd>{source.date} <small>({savedAgo(source.date)})</small></dd></dl>
  <ul className="reliability-list">
   {detail.reasons.map(r=><li key={r} className="good"><Check size={14}/>{r}</li>)}
   {detail.cautions.map(r=><li key={r} className="caution"><AlertTriangle size={14}/>{r}</li>)}
  </ul>
 </section>;
}

// 같은 리서치에서 함께 저장한 출처
function Related({list,onOpen}){
 return <section className="paper-card"><SectionTitle>같은 리서치에서 저장한 출처</SectionTitle>
  {list.length?<ul className="related-list">{list.map(s=><li key={s.id}><button onClick={()=>onOpen(s)}><span><strong>{s.title}</strong><small>{s.type} · {s.domain}</small></span><ArrowRight size={15}/></button></li>)}</ul>
  :<p className="related-empty">같은 리서치에서 저장한 다른 출처가 없어요.</p>}
 </section>;
}
