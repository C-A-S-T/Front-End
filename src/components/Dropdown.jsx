import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
// 브라우저 기본 <select> 대신 쓰는 공통 드롭다운. 모든 선택 상자를 같은 모양으로 맞춥니다.
// options: [{ value, label, hint?, badge?, note?, swatch?, disabled? }]
// variant: 'field'(필터 칸, 왼쪽에 label 표시) | 'pill'(둥근 버튼)
// placeholder만 있고 value가 없으면 '폴더 이동'처럼 동작 버튼으로 씁니다.
export default function Dropdown({ value, options, onChange, label, placeholder, icon, variant='pill', align='left', menuTitle, ariaLabel, className='' }){
 const [open,setOpen]=useState(false);const [active,setActive]=useState(-1);const ref=useRef(null);
 const selected=options.find(o=>o.value===value);
 useEffect(()=>{if(!open)return;const close=e=>{if(!ref.current?.contains(e.target))setOpen(false)};window.addEventListener('mousedown',close);return()=>window.removeEventListener('mousedown',close)},[open]);
 function toggle(){setActive(Math.max(0,options.findIndex(o=>o.value===value)));setOpen(!open)}
 function pick(o){if(o.disabled)return;onChange(o.value);setOpen(false)}
 function step(dir){let i=active;for(let n=0;n<options.length;n++){i=(i+dir+options.length)%options.length;if(!options[i].disabled)break}setActive(i)}
 function onKey(e){
  if(e.key==='Escape'){setOpen(false);return}
  if(!open&&['ArrowDown','ArrowUp','Enter',' '].includes(e.key)){e.preventDefault();toggle();return}
  if(!open)return;
  if(e.key==='ArrowDown'){e.preventDefault();step(1)}
  else if(e.key==='ArrowUp'){e.preventDefault();step(-1)}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();if(options[active])pick(options[active])}
 }
 return <div ref={ref} className={`dropdown ${variant} ${open?'open':''} ${className}`} onKeyDown={onKey}>
  <button type="button" className="dropdown-trigger" aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel||label||placeholder} onClick={toggle}>
   {icon}{label&&<span className="dropdown-label">{label}</span>}
   <span className="dropdown-value">{selected?.swatch&&<span className={'tiny-square '+selected.swatch}/>}{selected?selected.label:placeholder}{selected?.badge&&<em>{selected.badge}</em>}</span>
   <ChevronDown size={15} className="dropdown-caret"/>
  </button>
  {open&&<ul className={'dropdown-menu '+align} role="listbox">
   {menuTitle&&<li className="dropdown-title" role="presentation">{menuTitle}</li>}
   {options.map((o,i)=><li key={String(o.value)} role="presentation"><button type="button" role="option" aria-selected={o.value===value} disabled={o.disabled} className={(o.value===value?'selected ':'')+(i===active?'active':'')} onMouseEnter={()=>setActive(i)} onClick={()=>pick(o)}>
    <span className="dropdown-text"><strong>{o.swatch&&<span className={'tiny-square '+o.swatch}/>}{o.label}{o.badge&&<em>{o.badge}</em>}{o.note&&<i>{o.note}</i>}</strong>{o.hint&&<small>{o.hint}</small>}</span>
    {o.value===value&&<Check size={16}/>}
   </button></li>)}
  </ul>}
 </div>;
}
