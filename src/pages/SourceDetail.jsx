import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Copy, ExternalLink, FileText, FolderInput, Info, Trash2 } from 'lucide-react';
import AppShell,{SectionTitle,StateBadge} from '../components/AppShell';
import Dropdown from '../components/Dropdown';
import ScrapCard from '../components/ScrapCard';
import { useLingering } from '../utils/presence';
import { POLICIES, POLICY_GROUPS } from '../data/demo';
import { FOLDERS, citation, loadArchive, loadNote, moveToFolder, openOriginal, relatedSources, removeScrap, removeSources, saveNote, savedAgo, scrapText, scrapsOf, sourceDetail } from '../utils/archive';
const TONE_LABEL={success:'근거 확인',danger:'근거와 충돌',warning:'부분 확인',muted:'근거 부족'};
// 보관함 출처 상세. 다시 열었을 때 궁금한 세 가지를 맨 위에서 바로 답합니다.
//  1) 지금 써도 될까요? (최신 버전인지 · 믿을 만한지)  2) 어디에 썼나요? (리서치 · 주장 검증 결과)  3) 내가 남긴 것 (스크랩 · 메모)
// 그 아래에 요약 · 주장 · 스크랩(왼쪽)과 신뢰도 · 메모 · 관련 출처(오른쪽)를 탭 없이 모두 펼쳐 둡니다.
export default function SourceDetail(){
 const {id}=useParams();const nav=useNavigate();
 const [sources,setSources]=useState(()=>loadArchive());const [toast,setToast]=useState('');const [,refresh]=useState(0);
 useEffect(()=>{const sync=()=>{setSources(loadArchive());refresh(n=>n+1)};window.addEventListener('cast:archive-change',sync);return()=>window.removeEventListener('cast:archive-change',sync)},[]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2200);return()=>clearTimeout(t)},[toast]);
 const [toastText,toastClosing]=useLingering(toast);
 const source=sources.find(s=>String(s.id)===id);
 const policy=POLICIES[id];
 const versions=policy?POLICY_GROUPS[policy.group].versions.filter(v=>sources.some(s=>s.id===v)):[];const latestId=versions[versions.length-1];const isLatest=id===latestId;
 if(!source)return <Navigate to="/archive" replace/>;
 const detail=sourceDetail(source);const myScraps=scrapsOf(source.id);const related=relatedSources(source,sources);const note=loadNote(id);
 function copy(text,msg){(navigator.clipboard?.writeText(text)||Promise.reject()).then(()=>setToast(msg),()=>window.prompt('아래 내용을 복사해 주세요.',text))}
 function remove(){if(!window.confirm('이 출처를 보관함에서 삭제할까요?\n삭제한 출처는 목록에서 사라져요.'))return;removeSources([source.id]);nav('/archive')}
 const latest=policy&&POLICIES[latestId];const pastVersion=policy&&!isLatest;
 function nowCheck(c){if(!pastVersion||!c.field)return null;return policy.fields[c.field]===latest.fields[c.field]?<StateBadge label="최신과 같음" tone="success"/>:<StateBadge label="최신과 다름" tone="danger"/>}
 const changesLink=policy&&versions.length>1?`/archive?tab=policies&group=${policy.group}&from=${isLatest?versions[versions.length-2]:id}&to=${latestId}`:null;

 // 1) 지금 써도 될까요?
 const fresh=pastVersion
  ?{tone:'warn',icon:<AlertTriangle size={18}/>,title:'지난 버전이에요',desc:`지금 시행 중인 건 ${latest.version}이에요. 바뀐 내용을 확인한 뒤 써 주세요.`}
  :detail.cautions.length||source.trust!=='높음'
  ?{tone:'caution',icon:<Info size={18}/>,title:'확인하며 써 주세요',desc:detail.cautions[0]||'신뢰도가 보통인 자료예요. 공식 자료로 한 번 더 확인하면 좋아요.'}
  :{tone:'ok',icon:<Check size={18}/>,title:'믿고 써도 좋아요',desc:detail.reasons.slice(0,2).join(' · ')||'공식 출처의 자료예요.'};
 // 2) 어디에 썼나요? 판정별 개수
 const verdicts=['success','danger','warning','muted'].map(t=>[t,detail.claims.filter(c=>c.tone===t).length]).filter(([,n])=>n);

 return <AppShell page="archive" crumb={source.title}><main className="workspace-main policy-page detail-page">
  <button className="link-small back-link" onClick={()=>nav('/archive')}><ArrowLeft size={14}/> 출처 보관함으로</button>

  <header className="paper-card detail-hero">
   <div className="detail-hero-main">
    <div className="detail-kind">
     <span className="kind-chip docs"><FileText size={12}/> 자동 저장된 문서</span>
     <span className="source-type">{source.type}</span>
     {policy&&<span className={'version-chip '+(isLatest?'current':'past')}>{policy.version}{isLatest?' · 최신':' · 지난 버전'}</span>}
    </div>
    <h1>{source.title}</h1>
    <p className="detail-sub">{[detail.publisher,detail.published&&`${detail.published} 발행`,policy?.effective].filter(Boolean).join(' · ')}</p>
   </div>
   <div className="detail-actions">
    <button className="outline-small" onClick={()=>openOriginal(source)}><ExternalLink size={15}/> 원문 열기</button>
    <button className="outline-small" onClick={()=>copy(citation(source),'출처 표기와 함께 인용문을 복사했어요.')}><Copy size={15}/> 인용 복사</button>
    <Dropdown value={source.folder} icon={<FolderInput size={15}/>} menuTitle="옮길 폴더 선택" ariaLabel="폴더 이동" align="right" onChange={name=>{moveToFolder([source.id],name);setToast(`‘${name}’ 폴더로 옮겼어요.`)}} options={FOLDERS.map(([name,,color])=>({value:name,label:name,swatch:color,note:name===source.folder?'현재 폴더':null,disabled:name===source.folder}))}/>
    <button className="outline-small danger-outline" onClick={remove} aria-label="삭제" title="보관함에서 삭제"><Trash2 size={15}/></button>
   </div>
  </header>

  <section className="glance-grid" aria-label="한눈에 보기">
   <div className={'glance-tile '+fresh.tone}>
    <span className="glance-q">지금 써도 될까요?</span>
    <strong>{fresh.icon}{fresh.title}</strong>
    <p>{fresh.desc}</p>
    {changesLink&&<button className="inline-link" onClick={()=>nav(changesLink)}>{pastVersion?`${latest.version}과 비교하기`:`이전 버전 ${versions.length-1}개와 비교하기`} <ArrowRight size={13}/></button>}
   </div>
   <div className="glance-tile">
    <span className="glance-q">어디에 썼나요?</span>
    <strong>{detail.research||'연결된 리서치 없음'}</strong>
    <p>{detail.claims.length?`주장 ${detail.claims.length}개의 근거로 썼어요.`:'아직 이 문서를 근거로 쓴 주장이 없어요.'}</p>
    {verdicts.length>0&&<div className="glance-verdicts">{verdicts.map(([t,n])=><span key={t} className={'v-'+t}><i/>{TONE_LABEL[t]} <b>{n}</b></span>)}</div>}
    {detail.linked&&<button className="inline-link" onClick={()=>nav('/research')}>리서치 결과 보기 <ArrowRight size={13}/></button>}
   </div>
   <div className="glance-tile">
    <span className="glance-q">내가 남긴 것</span>
    <strong>스크랩 {myScraps.length}개 · 메모 {note?'있음':'없음'}</strong>
    <p>{source.date}에 자동 저장됐어요 ({savedAgo(source.date)}). ‘{source.folder}’ 폴더에 있어요.</p>
   </div>
  </section>

  <div className="detail-grid">
   <div className="detail-col">
    <section className="paper-card"><SectionTitle>이 문서는 어떤 내용인가요</SectionTitle>
     <p className="detail-summary">{detail.summary}</p>
     {detail.quote&&<KeySentence text={detail.quote} onCopy={()=>copy(detail.quote,'문장을 복사했어요.')}/>}
    </section>
    <section className="paper-card"><SectionTitle suffix={detail.claims.length?`${detail.claims.length}개`:null}>이 문서로 확인한 주장</SectionTitle>
     <ClaimList claims={detail.claims} extra={pastVersion?nowCheck:null}/>
     {pastVersion&&detail.claims.some(c=>c.field)&&<p className="disclaimer"><Info size={11}/> ‘최신과 같음/다름’은 최신 버전({latest.version}) 기준으로 다시 확인한 결과예요.</p>}
    </section>
    {myScraps.length>0&&<section className="paper-card"><SectionTitle suffix={`${myScraps.length}개`}>이 문서에서 스크랩한 문장</SectionTitle>
     <div className="scrap-list">{myScraps.map(q=><ScrapCard key={q.id} scrap={q} showSource={false} onCopy={q=>copy(scrapText(q),'문장을 복사했어요.')} onRemove={q=>{removeScrap(q.id);setToast('스크랩을 해제했어요.')}}/>)}</div>
    </section>}
   </div>
   <div className="detail-col">
    <section className="paper-card"><SectionTitle>믿을 만한 자료인가요</SectionTitle><Reliability source={source} detail={detail}/></section>
    <section className="paper-card memo-card"><SectionTitle>내 메모</SectionTitle><Memo key={id} id={id}/></section>
    <section className="paper-card"><SectionTitle>같은 리서치의 다른 출처</SectionTitle>
     {related.length
      ?<ul className="related-list">{related.map(s=><li key={s.id}><button onClick={()=>nav('/archive/'+s.id)}><span><strong>{s.title}</strong><small>{s.type} · {s.domain}</small></span><ArrowRight size={15}/></button></li>)}</ul>
      :<p className="tab-empty">같은 리서치에서 저장한 다른 출처가 없어요.</p>}
    </section>
   </div>
  </div>
  {toastText&&<div className={'archive-toast'+(toastClosing?' is-closing':'')} role="status">{toastText}</div>}
 </main></AppShell>;
}

function KeySentence({text,onCopy}){
 return <div className="key-sentence"><div><span>핵심 문장</span><button className="inline-link" onClick={onCopy}><Copy size={13}/> 복사</button></div><blockquote>{text}</blockquote></div>;
}

// 주장 목록: 판단 이유를 접지 않고 주장 바로 아래에 보여 줍니다. extra는 지난 정책 버전일 때 '최신 기준' 배지
function ClaimList({claims,extra}){
 if(!claims.length)return <p className="tab-empty">아직 이 문서를 근거로 쓴 주장이 없어요.</p>;
 return <ol className="claim-lines">
  {claims.map((c,i)=><li key={i} className="claim-line">
   <span className="claim-num">{String(i+1).padStart(2,'0')}</span>
   <div><b>{c.text}</b>{c.reason&&<p>{c.reason}</p>}</div>
   <span className="claim-badges"><StateBadge label={c.status} tone={c.tone}/>{extra&&extra(c)}</span>
  </li>)}
 </ol>;
}

// 내 메모: 입력을 멈추면 자동 저장
function Memo({id}){
 const [text,setText]=useState(()=>loadNote(id));const [state,setState]=useState(text?'saved':'idle');const timer=useRef();
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 function change(v){setText(v);setState('typing');clearTimeout(timer.current);timer.current=setTimeout(()=>{saveNote(id,v);setState('saved')},600)}
 return <div className="memo-box">
  <textarea value={text} onChange={e=>change(e.target.value)} rows={4} placeholder={'왜 저장했는지, 어디에 쓸지 적어 두세요.\n예) 보고서 2장 지원 대상 근거로 사용'} aria-label="내 메모"/>
  <span className="memo-state">{state==='typing'?'입력 중…':state==='saved'&&text?'✓ 자동 저장됨':'입력하면 자동 저장돼요'}</span>
 </div>;
}

// 신뢰도: 발행 정보와 믿을 만한 이유 · 주의할 점
function Reliability({source,detail}){
 return <div className="reliability-stack">
  <dl className="evidence-details reliability-meta"><dt>발행 기관</dt><dd>{detail.publisher}</dd>{detail.published&&<><dt>발행일</dt><dd>{detail.published}</dd></>}<dt>신뢰도</dt><dd>{source.trust}</dd></dl>
  <ul className="reliability-list">
   {detail.reasons.map(r=><li key={r} className="good"><Check size={14}/>{r}</li>)}
   {detail.cautions.map(r=><li key={r} className="caution"><AlertTriangle size={14}/>{r}</li>)}
  </ul>
 </div>;
}
