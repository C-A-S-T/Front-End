import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Bookmark, Check, ChevronLeft, ChevronRight, Clock, ExternalLink, FileSearch, Folder, HelpCircle, Info, ListChecks, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import { loadArchive } from '../utils/archive';
import AppShell,{PageHero,SectionTitle,StateBadge} from '../components/AppShell';
import { ANSWER_PARTS, ARCHIVE_SOURCES, CLAIMS, DEFAULT_QUESTION, DEFAULT_TITLE } from '../data/demo';
import { getQuestion,loadScraps,saveScraps,today } from '../utils/storage';
// 판정 순서와 이름 (검증 요약 막대 · 범례에 사용)
const VERDICTS=[['success','근거 확인'],['danger','근거와 충돌'],['warning','부분 확인'],['muted','근거 부족']];
const RANK={danger:0,warning:1,muted:2,success:3};
const SUGGESTIONS=[
 ['청년 월세 지원 조건',DEFAULT_QUESTION],
 ['신혼부부 전세대출 금리','2026년 신혼부부 전세자금 대출 금리와 한도를 알려줘.'],
 ['국민취업지원제도 수당','국민취업지원제도 구직촉진수당 지급 기준을 정리해줘.'],
 ['청년도약계좌 가입 요건','청년도약계좌 가입 요건과 정부 기여금을 알려줘.'],
];
const HOW=[
 [ListChecks,'질문을 주장으로 나눠요','답변을 지원 대상 · 금액 · 기간처럼 확인할 수 있는 문장 단위로 쪼개요.'],
 [FileSearch,'공식 자료를 찾아요','정부 공고문 · 보고서 · 공식 통계처럼 믿을 만한 출처를 우선으로 모아요.'],
 [ShieldCheck,'원문과 하나씩 대조해요','주장마다 근거 원문을 붙이고, 맞는지 · 다른지 · 근거가 없는지 표시해요.'],
];
const VERDICT_ICON={success:<Check size={15}/>,danger:<X size={15}/>,warning:<AlertTriangle size={15}/>,muted:<HelpCircle size={15}/>};
export default function Main(){
 const nav=useNavigate();
 const [question,setQuestion]=useState(()=>sessionStorage.getItem('cast-new-research')==='true'?'':(getQuestion()||DEFAULT_QUESTION));
 const [showResult,setShowResult]=useState(()=>sessionStorage.getItem('cast-new-research')!=='true');
 const [selected,setSelected]=useState(2);const [saved,setSaved]=useState(()=>loadScraps().map(x=>x.claimId));
 useEffect(()=>{const onChange=()=>{if(sessionStorage.getItem('cast-new-research')==='true'){setQuestion('');setShowResult(false);sessionStorage.removeItem('cast-new-research')}};const onOpen=()=>{setQuestion(getQuestion()||DEFAULT_QUESTION);setShowResult(true);window.scrollTo(0,0)};window.addEventListener('focus',onChange);window.addEventListener('cast:new-research',onChange);window.addEventListener('cast:open-research',onOpen);return()=>{window.removeEventListener('focus',onChange);window.removeEventListener('cast:new-research',onChange);window.removeEventListener('cast:open-research',onOpen)}},[]);
 const claim=CLAIMS.find(c=>c.id===selected)||CLAIMS[0];const idx=CLAIMS.indexOf(claim);
 // 확인이 필요한 주장: 충돌 → 부분 확인 → 근거 부족 순
 const issues=CLAIMS.filter(c=>c.tone!=='success').sort((a,b)=>RANK[a.tone]-RANK[b.tone]);
 const panelRef=useRef(null);const inputRef=useRef(null);
 // 주장 고르기. 한 줄 화면(좁은 창)에서는 근거 원문이 아래에 있으니 그쪽으로 내려 줌
 function pick(id,reveal){setSelected(id);if(reveal&&window.matchMedia('(max-width: 999px)').matches)requestAnimationFrame(()=>panelRef.current?.scrollIntoView({behavior:'smooth',block:'start'}))}
 const counts=VERDICTS.map(([tone,label])=>[tone,label,CLAIMS.filter(c=>c.tone===tone).length]);
 function start(e){e.preventDefault();if(!question.trim())return;sessionStorage.setItem('cast-question',question.trim());sessionStorage.removeItem('cast-new-research');nav('/research/progress')}
 // 근거 원문 문장을 스크랩합니다. 출처 문서는 보관함에 자동 저장되고, 스크랩한 문장은 보관함의 '내가 스크랩한 문장'에 따로 모입니다.
 function scrap(){const old=loadScraps();const exists=old.some(x=>x.claimId===claim.id);const next=exists?old.filter(x=>x.claimId!==claim.id):[{id:'q'+claim.id,claimId:claim.id,sourceId:ARCHIVE_SOURCES.find(a=>a.title===claim.sourceName)?.id||null,sourceTitle:claim.sourceName,publisher:claim.publisher,quote:claim.quote,claim:claim.title,status:claim.status,tone:claim.tone,research:DEFAULT_TITLE,date:today()},...old];saveScraps(next);setSaved(next.map(x=>x.claimId))}
 const isSaved=saved.includes(claim.id);
 // 결과 제목 = 실제로 조사한 질문. 질문이 없거나 시연용 기본 질문이면 시연 제목을 씀
 const asked=getQuestion();const resultTitle=asked&&asked!==DEFAULT_QUESTION?asked:DEFAULT_TITLE;
 const search=<form onSubmit={start} className="hero-search"><Search size={18}/><input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="궁금한 내용을 입력해 주세요." aria-label="리서치 질문"/><button type="submit">조사 시작 <ArrowRight size={15}/></button></form>;

 // 새 리서치 시작 화면: 질문 입력이 주인공, 그 아래 예시 질문 · 작동 방식 · 이어서 보기
 function suggest(q){setQuestion(q);requestAnimationFrame(()=>{const el=inputRef.current;if(el){el.focus();el.setSelectionRange(q.length,q.length)}})}
 if(!showResult)return <AppShell><main className="workspace-main design-page launch">
  <section className="launch-hero">
   <span className="launch-badge"><Sparkles size={14}/> 새 리서치</span>
   <h1>무엇을 조사해 볼까요?</h1>
   <p>질문을 입력하면 공식 자료를 찾아 답변을 만들고,<br/>답변 속 주장 하나하나를 원문 근거와 대조해 드려요.</p>
   <form onSubmit={start} className="launch-search">
    <Search size={20}/>
    <input ref={inputRef} autoFocus value={question} onChange={e=>setQuestion(e.target.value)} placeholder="예: 2026년 청년 월세 지원 대상과 신청 기간은?" aria-label="리서치 질문"/>
    <button type="submit" disabled={!question.trim()}>조사 시작 <ArrowRight size={15}/></button>
   </form>
   <div className="launch-suggest" aria-label="예시 질문">
    <span>이렇게 물어보세요</span>
    {SUGGESTIONS.map(([label,q])=><button key={label} type="button" onClick={()=>suggest(q)}>{label}</button>)}
   </div>
  </section>

  <section className="launch-how" aria-label="C.A.S.T 작동 방식">
   {HOW.map(([Icon,title,desc],i)=><div key={title} className="how-step"><span className="how-icon"><Icon size={18}/></span><span className="how-no mono">{i+1}</span><b>{title}</b><p>{desc}</p></div>)}
  </section>
  <div className="launch-legend"><span>검증 결과는 이렇게 표시돼요</span>{VERDICTS.map(([tone,label])=><StateBadge key={tone} label={label} tone={tone}/>)}</div>

  <section className="launch-continue">
   <h2>이어서 보기</h2>
   <div className="continue-grid">
    <button className="continue-card" onClick={()=>{sessionStorage.removeItem('cast-question');setQuestion(DEFAULT_QUESTION);setShowResult(true)}}>
     <span className="cc-icon docs"><Clock size={18}/></span>
     <span className="cc-body"><small>최근 리서치</small><b>{DEFAULT_TITLE}</b><em>주장 {CLAIMS.length}개 · 확인 필요 {issues.length}곳</em></span><ChevronRight size={16}/>
    </button>
    <button className="continue-card" onClick={()=>nav('/archive')}>
     <span className="cc-icon archive"><Folder size={18}/></span>
     <span className="cc-body"><small>출처 보관함</small><b>저장된 문서 {loadArchive().length}건</b><em>스크랩한 문장 {saved.length}개</em></span><ChevronRight size={16}/>
    </button>
   </div>
  </section>
 </main></AppShell>;

 return <AppShell><main className="workspace-main design-page">
  <PageHero eyebrow="리서치 결과" title={resultTitle}
   aside={<div className="verdict-summary"><div className="vs-head"><span>검증 요약</span><small>주장 {CLAIMS.length}개</small></div>
    <p className="vs-big"><b className="mono">{counts[1][2]}</b> / {CLAIMS.length} <span>근거와 충돌</span></p>
    <div className="vs-bar" aria-hidden="true">{counts.map(([tone,,n])=>n>0&&<span key={tone} className={'v-'+tone} style={{flex:n}}/>)}</div>
    <ul className="vs-legend">{counts.map(([tone,label,n])=><li key={tone}><i className={'v-'+tone}/>{label}<b className="mono">{n}</b></li>)}</ul></div>}>
   {search}
   <div className="hero-meta"><span>참조 문서 <b className="mono">3</b>건</span><span>주장 <b className="mono">4</b>개</span><span>시연용 가상 정책 · 가상 문서</span></div>
  </PageHero>

  {/* 결론 먼저: 이 답변을 그대로 써도 되는지, 안 되면 어디를 봐야 하는지 */}
  <section className={'verdict-callout '+(issues.length?(issues.some(c=>c.tone==='danger')?'danger':'warn'):'ok')}>
   <span className="vc-icon">{issues.length?<AlertTriangle size={20}/>:<Check size={20}/>}</span>
   <div className="vc-body">
    <strong>{issues.length?`그대로 쓰기 전에 ${issues.length}곳을 확인하세요`:'모든 주장이 근거와 일치해요'}</strong>
    <p>{issues.length?`주장 ${CLAIMS.length}개 중 ${CLAIMS.length-issues.length}개만 근거로 확인됐어요. 아래 항목을 누르면 근거 원문과 판단 이유가 열려요.`:'검색된 공식 자료와 답변 내용이 모두 맞아요.'}</p>
    {issues.length>0&&<div className="vc-issues">{issues.map(c=><button key={c.id} className={'vc-issue v-'+c.tone+(c.id===selected?' on':'')} onClick={()=>pick(c.id,true)} aria-pressed={c.id===selected}>
     <span className="vc-issue-top"><i/><b>{c.topic}</b><StateBadge label={c.status} tone={c.tone}/></span>
     <small>{c.detail}</small></button>)}</div>}
   </div>
  </section>

  <div className="result-layout">
   <div className="result-col">
    <section className="paper-card answer-card"><SectionTitle suffix="밑줄 친 부분을 누르면 오른쪽에 근거가 나와요">AI 답변</SectionTitle>
     <p className="answer-text">{ANSWER_PARTS.map((part,i)=>{if(typeof part==='string')return part;const [cid,text]=part;const c=CLAIMS.find(x=>x.id===cid);return <button key={i} className={'claim-mark v-'+c.tone+(cid===selected?' on':'')} onClick={()=>pick(cid)} aria-pressed={cid===selected}>{text}<sup className="mono">{cid}</sup></button>})}</p>
     <ul className="answer-legend" aria-label="밑줄 색 뜻">{VERDICTS.map(([tone,label])=><li key={tone} className={'v-'+tone}><i/>{label}</li>)}</ul>
    </section>
    <section className="paper-card"><SectionTitle suffix={`주장 ${CLAIMS.length}개`}>주장별 근거 검증</SectionTitle>
     <div className="claim-cards">{CLAIMS.map(c=><button key={c.id} className={'claim-card'+(c.id===selected?' on':'')} onClick={()=>pick(c.id)} aria-pressed={c.id===selected}>
      <span className="claim-no mono">{String(c.id).padStart(2,'0')}</span>
      <span className="claim-body"><span className="claim-topic">{c.topic}</span><b>{c.title}</b><small>{c.detail}</small></span>
      <StateBadge label={c.status} tone={c.tone}/></button>)}</div>
    </section>
   </div>
   <div className="result-col">
    <section ref={panelRef} className={'paper-card evidence-panel v-'+claim.tone} aria-live="polite">
     <div className="ev-head">
      <span className="ev-step">근거 원문 <b className="mono">{idx+1}</b> / {CLAIMS.length}</span>
      <span className="ev-nav"><button aria-label="이전 주장" disabled={idx===0} onClick={()=>pick(CLAIMS[idx-1].id)}><ChevronLeft size={16}/></button><button aria-label="다음 주장" disabled={idx===CLAIMS.length-1} onClick={()=>pick(CLAIMS[idx+1].id)}><ChevronRight size={16}/></button></span>
     </div>
     <div className="ev-claim-block">
      <span className="ev-label">AI 답변의 주장 · {claim.topic}</span>
      <h4 className="ev-claim">{claim.title}</h4>
     </div>
     <div className={'ev-verdict v-'+claim.tone}>
      <span className="ev-verdict-head">{VERDICT_ICON[claim.tone]}<b>{claim.status}</b></span>
      <p>{claim.analysis}</p>
     </div>
     {claim.compare&&<div className="ev-compare"><div><span>AI 답변</span><b>{claim.compare.ai}</b></div><div className="src"><span>원문 근거</span><b>{claim.compare.source}</b></div></div>}
     <div>
      <p className="ev-label">원문에 적힌 내용</p>
      <blockquote className={'ev-quote v-'+claim.tone}>“{claim.highlight&&claim.quote.includes(claim.highlight)?<>{claim.quote.split(claim.highlight)[0]}<mark>{claim.highlight}</mark>{claim.quote.split(claim.highlight).slice(1).join(claim.highlight)}</>:claim.quote}”</blockquote>
     </div>
     <dl className="ev-meta"><dt>자료명</dt><dd>{claim.sourceName}</dd><dt>발행 기관</dt><dd>{claim.publisher}</dd><dt>기준 시점</dt><dd className="mono">2026.10.01 발행 · 2026.11.01 시행</dd></dl>
     <div className="ev-actions"><button className="outline-small" onClick={()=>window.alert('시연용 가상 문서에는 실제 연결할 출처 URL이 없습니다.')}><ExternalLink size={15}/> 출처 열기</button><button className={'navy-btn'+(isSaved?' done':'')} onClick={scrap}><Bookmark size={15} fill={isSaved?'currentColor':'none'}/>{isSaved?'스크랩됨':'이 문장 스크랩'}</button></div>
    </section>
   </div>
  </div>
  <p className="page-footnote"><Info size={13}/> 검증 표시는 검색된 근거와 주장의 관계를 뜻하며, 사실 전체의 진실성을 보장하지 않습니다.</p>
 </main></AppShell>;
}
