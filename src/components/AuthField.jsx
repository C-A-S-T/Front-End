import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
export default function AuthField({type='text',value,onChange,placeholder,id,autoComplete}) {
  const [visible,setVisible]=useState(false);
  const password = type==='password';
  return <div className="auth-field">
    {password?<LockKeyhole size={18}/>:<UserRound size={19}/>}
    <input id={id} required type={password?(visible?'text':'password'):type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} autoComplete={autoComplete} />
    {password&&<button type="button" aria-label={visible?'비밀번호 숨기기':'비밀번호 보기'} className="icon-btn" onClick={()=>setVisible(!visible)}>{visible?<Eye size={18}/>:<EyeOff size={18}/>}</button>}
  </div>;
}
