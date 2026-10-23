import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bookmark, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Info, Search } from 'lucide-react';
import AppShell,{SectionTitle,StateBadge} from '../components/AppShell';
import { CLAIMS, DEFAULT_QUESTION, DEFAULT_TITLE } from '../data/demo';
import { getQuestion,loadScraps,saveScraps } from '../utils/storage';
export default function Main(){
 const nav=useNavigate();
 const [question,setQuestion]=useState(()=>sessionStorage.getItem('cast-new-research')==='true'?'':(getQuestion()||DEFAULT_QUESTION));
 const [showResult,setShowResult]=useState(()=>sessionStorage.getItem('cast-new-research')!=='true');
 const [selected,setSelected]=useState(2);const [evidenceOpen,setEvidenceOpen]=useState(true);const [compactOpen,setCompactOpen]=useState(true);const [saved,setSaved]=useState(()=>loadScraps().map(x=>x.id));
 useEffect(()=>{const onChange=()=>{if(sessionStorage.getItem('cast-new-research')==='true'){setQuestion('');setShowResult(false);sessionStorage.removeItem('cast-new-research')}};window.addEventListener('focus',onChange);window.addEventListener('cast:new-research',onChange);return()=>{window.removeEventListener('focus',onChange);window.removeEventListener('cast:new-research',onChange)}},[]);
 const claim=CLAIMS.find(c=>c.id===selected)||CLAIMS[0];
 function start(e){e.preventDefault();if(!question.trim())return;sessionStorage.setItem('cast-question',question.trim());sessionStorage.removeItem('cast-new-research');nav('/research/progress')}
 function scrap(){const old=loadScraps();const exists=old.some(x=>x.id===claim.id);const next=exists?old.filter(x=>x.id!==claim.id):[{id:claim.id,title:claim.sourceName,domain:claim.publisher,type:'정부자료',date:'2026.10.01',trust:'높음',folder:'청약·주거',quote:claim.quote},...old];saveScraps(next);setSaved(next.map(x=>x.id))}
 return <AppShell><main className="workspace-main">
   <div className="page-intro research-intro"><span className="eyebrow">AI RESEARCH ASSISTANT</span><div className="research-heading"><h1>{showResult?DEFAULT_TITLE:'새 리서치'}</h1><span className="trust-chip">✦ 공식 자료 기반 검증</span></div><p>{showResult?'자료를 검색했어요!':'조사하고 싶은 질문을 입력해 주세요.'}</p></div>
   <form onSubmit={start} className="research-searchbar"><Search size={20}/><input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="궁금한 내용을 입력해 주세요." aria-label="리서치 질문"/><button type="submit" className="small-primary">조사 시작 <ArrowRight size={16}/></button></form>
   {showResult?<>
     <div className="research-metadata"><span>데이터 범위 <b>청년 주거지원 정책</b></span><span>· 참조 문서 <b>3건</b></span><span>· Claim <b>4개</b></span><span className="sample-chip">※ 시연용 가상 정책·가상 문서</span></div>
     <div className="result-grid"><div className="result-col">
       <section className="paper-card summary-card"><SectionTitle suffix="AI GENERATED SUMMARY">조사 요약</SectionTitle><div className="summary-body"><p>• 지원 대상 – 만 19~34세 무주택 청년으로 안내되어 있습니다.</p><p>• 지원 금액 – AI 답변의 월 30만 원은 원문과 일치하지 않습니다.</p><p>• 신청 정보 – 시작일은 확인되지만 종료일과 신청 방식은 추가 확인이 필요합니다.</p></div><p className="disclaimer"><Info size={12}/> 검증 표시는 검색된 근거와 주장의 관계를 뜻하며, 사실 전체의 진실성을 보장하지 않습니다.</p></section>
       <section className="paper-card claims-card"><SectionTitle suffix="1 CLAIMS REVIEWED">주장별 근거 검증</SectionTitle><button className={'claim-row '+(selected===1?'current':'')} onClick={()=>{setSelected(1);setEvidenceOpen(true)}}><span className="claim-num">01</span><span className="claim-text"><b>{CLAIMS[0].title}</b><small>{CLAIMS[0].detail}</small></span><StateBadge label="근거 확인" tone="success"/></button></section>
       <section className="paper-card claims-card need-review"><SectionTitle suffix="3 CLAIMS REVIEWED">추가 검토 필요 주장</SectionTitle><p className="card-subtitle">다음 주장은 근거와 충돌하거나 추가 확인이 필요한 항목입니다.</p><div className="review-list">{CLAIMS.slice(1).map(c=><button key={c.id} className={'claim-row '+(selected===c.id?'current':'')} onClick={()=>{setSelected(c.id);setEvidenceOpen(true)}}><span className="claim-num">{String(c.id).padStart(2,'0')}</span><span className="claim-text"><b>{c.title}</b><small>{c.detail}</small></span><StateBadge label={c.status} tone={c.tone}/></button>)}</div></section>
     </div><div className="result-col evidence-column">
       <section className="paper-card evidence-card"><div className="section-title evidence-heading"><h3>근거 원문</h3><button className="outline-small" onClick={scrap}><Bookmark size={13} fill={saved.includes(claim.id)?'currentColor':'none'}/>{saved.includes(claim.id)?'저장됨':'스크랩'}</button><button className="collapse-btn" aria-label="근거 접기" onClick={()=>setEvidenceOpen(!evidenceOpen)}>{evidenceOpen?<ChevronDown size={22}/>:<ChevronUp size={22}/>}</button></div>
         {evidenceOpen&&<><p className="evidence-tiny-label">현재 선택한 주장</p><h4>{claim.title}</h4><dl className="evidence-details"><dt>자료명</dt><dd>{claim.sourceName}</dd><dt>발행 기관</dt><dd>{claim.publisher}</dd><dt>기준 시점</dt><dd>2026.10.01 발행 · 2026.11.01 시행</dd></dl><div className="evidence-quote">“{claim.quote}”</div><div className="evidence-verdict"><strong>검증 결과</strong><StateBadge label={claim.status} tone={claim.tone}/></div><p className="evidence-description">{claim.analysis}</p><div className="evidence-bottom"><button className="outline-small" onClick={()=>window.alert('시연용 가상 문서에는 실제 연결할 출처 URL이 없습니다.')}><ExternalLink size={15}/> 출처 확인</button><span>예시 문서 · 실제 링크 미연결</span></div></>}
       </section>
       <section className="paper-card compact-evidence"><div className="section-title evidence-heading"><h3>근거 원문</h3><button className="collapse-btn" aria-label="미리보기 접기" onClick={()=>setCompactOpen(!compactOpen)}>{compactOpen?<ChevronUp size={22}/>:<ChevronDown size={22}/>}</button></div>{compactOpen&&<div className="evidence-quote">“{claim.quote}”</div>}</section>
     </div></div>
   </>:<div className="research-empty"><Search size={34}/><h2>무엇을 조사해 볼까요?</h2><p>질문을 입력하고 조사 시작 버튼을 눌러보세요.</p><button className="outline-small" onClick={()=>setQuestion(DEFAULT_QUESTION)}>예시 질문 불러오기</button></div>}
 </main></AppShell>;
}
