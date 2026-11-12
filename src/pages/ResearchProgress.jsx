import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, FileText, Info, Square } from 'lucide-react';
import AppShell,{PageHero,SectionTitle,StateBadge} from '../components/AppShell';
import { CLAIMS, DEFAULT_QUESTION, STEPS } from '../data/demo';
import { getQuestion } from '../utils/storage';
// 조사 중에 찾은 문서 (시연용). at: 이 단계부터 검토가 끝난 것으로 표시
const FOUND_DOCS=[['가상 A 청년월세지원 사업 공고문','가상 청년지원센터',3],['가상 청년지원센터 안내 자료','가상 청년지원센터',4],['가상 시청 복지정책 자료집','가상 시청',5]];
export default function ResearchProgress(){
 const nav=useNavigate();const [stage,setStage]=useState(3);const [running,setRunning]=useState(true);
 useEffect(()=>{if(!running||stage>=6)return;const t=setTimeout(()=>setStage(x=>Math.min(x+1,6)),2400);return()=>clearTimeout(t)},[stage,running]);
 const done=stage===6;
 function leave(){if(done)sessionStorage.setItem('cast-finished','true');else setRunning(false);nav('/research')}
 return <AppShell><main className="workspace-main design-page progress-page">
  <PageHero eyebrow="조사 중" title={done?'검증을 마쳤어요':'근거를 찾고 검증하고 있어요'} desc={getQuestion()||DEFAULT_QUESTION}
   aside={<button className="hero-btn" onClick={leave}>{done?<><Check size={15}/> 결과 보기</>:<><Square size={12} fill="currentColor"/> 조사 중지</>}</button>}>
   <ol className="hero-steps" aria-label={`진행 단계 ${stage} / 6`}>{STEPS.map(([name,desc],i)=>{const n=i+1;const state=n<stage||done?'done':n===stage?'now':'next';return <li key={name} className={state} aria-current={state==='now'?'step':undefined}><span className="step-dot mono">{state==='done'?<Check size={14}/>:n}</span><b>{name}</b><small>{desc}</small></li>})}</ol>
   <div className="hero-progress" aria-hidden="true"><span style={{width:`${(done?6:stage-0.5)/6*100}%`}}/></div>
  </PageHero>

  <div className="progress-layout">
   <section className="paper-card"><SectionTitle suffix={`${FOUND_DOCS.filter(d=>stage>=d[2]-1).length}건`}>찾은 근거 문서</SectionTitle>
    <ul className="found-list">{FOUND_DOCS.map(([name,org,at])=>{const st=stage>at||done?['검토 완료','success']:stage===at?['검토 중','warning']:stage>=at-1?['대기','muted']:null;return st&&<li key={name}><span className="doc-icon"><FileText size={16}/></span><span className="doc-text"><b>{name}</b><small>{org}</small></span><StateBadge label={st[0]} tone={st[1]}/></li>})}</ul>
    <p className="card-note">시연용 가상 문서 · 실제 법규 미반영</p>
   </section>
   <section className="paper-card"><SectionTitle suffix="검증이 끝나면 확정돼요">결과 미리보기</SectionTitle>
    <div className="preview-box"><span className="ev-label">AI 답변 초안</span><p>가상 A 청년월세지원 사업은 <u>만 19~34세 무주택 청년</u>을 대상으로 하며, 지원 금액과 신청 기간은 근거를 확인하고 있어요.</p></div>
    <ul className="preview-list">{CLAIMS.map((c,i)=>{const st=done?[c.status,c.tone]:i+3<stage?[c.status,c.tone]:i+3===stage?['검토 중','warning']:['대기','muted'];return <li key={c.id}><span className="mono">{String(c.id).padStart(2,'0')}</span><b>{c.title}</b><StateBadge label={st[0]} tone={st[1]}/></li>})}</ul>
   </section>
  </div>
  <p className="page-footnote"><Info size={13}/> 최종 결과는 검색된 근거와 주장의 관계를 검토한 것이며, 사실 관계의 정확성을 보장하지 않습니다.</p>
 </main></AppShell>;
}
