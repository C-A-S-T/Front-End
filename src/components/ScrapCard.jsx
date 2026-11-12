import { BookmarkX, Copy } from 'lucide-react';
// 스크랩한 원문 한 줄: 문장을 중심에 두고, 출처·날짜와 복사/해제 버튼만 작게 붙입니다.
// showSource=false면 문서별로 묶여 있거나 문서 상세 화면 안이라 문서 이름을 생략합니다.
export default function ScrapCard({ scrap, showSource=true, onOpenSource, onCopy, onRemove }){
 return <article className="scrap-item">
  <blockquote>{scrap.quote}</blockquote>
  <div className="scrap-line">
   <span className="scrap-meta">{showSource&&(scrap.sourceId&&onOpenSource?<button className="scrap-source" onClick={()=>onOpenSource(scrap)}>{scrap.sourceTitle}</button>:<span>{scrap.sourceTitle}</span>)}<span>{scrap.date}</span></span>
   <span className="scrap-actions">
    <button aria-label="문장 복사" title="문장 복사" onClick={()=>onCopy(scrap)}><Copy size={15}/></button>
    <button aria-label="스크랩 해제" title="스크랩 해제" onClick={()=>onRemove(scrap)}><BookmarkX size={15}/></button>
   </span>
  </div>
 </article>;
}
