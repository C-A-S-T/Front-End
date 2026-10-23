import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info, Search, Square } from 'lucide-react';
import AppShell,{SectionTitle,StateBadge} from '../components/AppShell';
import { CLAIMS, DEFAULT_QUESTION, DEFAULT_TITLE, STEPS } from '../data/demo';
import { getQuestion } from '../utils/storage';
export default function ResearchProgress(){
 const nav=useNavigate();const [stage,setStage]=useState(3);const [running,setRunning]=useState(true);
 useEffect(()=>{if(!running||stage>=6)return;const t=setTimeout(()=>setStage(x=>Math.min(x+1,6)),2400);return()=>clearTimeout(t)},[stage,running]);
 return <AppShell><main className="workspace-main progress-page">
  <div className="page-intro"><span className="eyebrow">AI RESEARCH ASSISTANT</span><h1>{DEFAULT_TITLE}</h1><p>{stage===6?'검토 단계를 완료했습니다. 결과를 확인할 수 있습니다.':'공식 자료를 검색하고, 관련 근거와 대조하고 있습니다!'}</p></div>
  <div className="research-searchbar progress-query"><Search size={21}/><span>{getQuestion()||DEFAULT_QUESTION}</span><button className="small-primary" onClick={()=>{if(stage===6){sessionStorage.setItem('cast-finished','true');nav('/research')}else {setRunning(false);nav('/research')}}}>{stage===6?'결과 보기':'조사 중지'} {stage===6?<Check size={14}/>:<Square size={13} fill="white"/>}</button></div>
  <div className="progress-grid"><section className="paper-card step-panel"><SectionTitle suffix={`단계 ${stage} / 6`}>진행 단계</SectionTitle><div className="progress-track"><span style={{width:`${stage/6*100}%`}} /></div><div className="step-list">{STEPS.map(([name,desc],i)=><div key={name} className={'step-item '+(i+1===stage?'now':i+1<stage?'done':'future')}><span className="step-icon">{i+1<stage?<Check size={20}/>:i+1}</span><span><strong>{name}</strong><small>{desc}</small></span></div>)}</div></section>
  <div className="progress-right"><section className="paper-card progress-found"><SectionTitle>지금까지 찾은 것</SectionTitle><div className="found-stats"><div><span>참고 문서</span><strong>3건</strong></div><div><span>Claim</span><strong>4개</strong></div></div><div className="found-docs"><div>가상 A 청년월세지원 사업 공고문</div><div>가상 청년지원센터 안내 자료</div><div>가상 시청 복지정책 자료집</div></div><p>시연용 가상 문서 · 실제 법규 미반영</p></section>
   <section className="paper-card preview-card"><SectionTitle>결과 미리보기</SectionTitle><div className="preview-summary"><p>• 지원 대상은 만 19~34세 무주택 청년으로 확인되고 있어요.</p><p>• 지원 금액은 월 30만원으로 추정돼요.</p><p>• 신청 기간은 11월 1일 ~30일로 보이는 자료가 있어요.</p><div className="progress-track"><span style={{width:`${stage/6*100}%`}} /></div></div><div className="preview-claims">{CLAIMS.map((claim,i)=><div key={claim.id}><span>{String(claim.id).padStart(2,'0')}</span><b>{claim.title}</b><StateBadge label={i+1<stage?(i===0?'근거 확인':'검토 중'):'대기'} tone={i===0&&i+1<stage?'success':'muted'}/></div>)}</div><p>미리보기 예시입니다. 검증이 완료되면 실제 결과로 변경됩니다.</p></section>
  </div></div><p className="progress-footnote"><Info size={16}/> 최종 조사는 검색된 근거와 주장의 관계를 검토하며, 사실 관계의 정확성을 보장하지 않습니다.</p>
 </main></AppShell>;
}
