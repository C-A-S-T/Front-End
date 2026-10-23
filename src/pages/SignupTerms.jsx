import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout,{ SignupStepper,PrimaryButton } from '../components/AuthLayout';
const policies = [
 ['서비스 이용약관 동의',true,'서비스 제공, 사용자 의무, 이용 제한 등에 관한 안내입니다. 현재는 UI 시연용 약관입니다.'],
 ['개인정보 수집 및 이용 동의',true,'계정 기능을 위한 이메일 정보의 수집·이용에 관한 안내입니다. 현재는 UI 시연용 약관입니다.'],
 ['만 14세 이상입니다.',true,'서비스 이용 연령을 확인합니다.'],
 ['마케팅 정보 수신 동의 (이벤트 및 서비스 안내)',false,'서비스 소식과 이벤트 안내 수신에 관한 선택 사항입니다.'],
];
export default function SignupTerms(){
  const nav=useNavigate();const [checks,setChecks]=useState([true,true,true,false]);const [opened,setOpened]=useState(null);const [error,setError]=useState('');
  const all=checks.every(Boolean);
  function setCheck(i,checked){setChecks(prev=>prev.map((item,index)=>index===i?checked:item));setError('')}
  return <AuthLayout step={2}><div className="auth-signup-content">
    <h1>회원가입</h1><SignupStepper current={1}/>
    <div className="signup-section-heading"><h2>약관 동의</h2><p>C.A.S.T 서비스 이용을 위해 아래 약관에 동의해 주세요.</p></div>
    <div className="terms-list">
      <label className="terms-all"><input type="checkbox" checked={all} onChange={e=>setChecks(Array(4).fill(e.target.checked))}/><strong>전체 동의하기</strong></label>
      {policies.map(([name,required,body],i)=><div key={name} className="terms-row">
        <label><input type="checkbox" checked={checks[i]} onChange={e=>setCheck(i,e.target.checked)}/><span>[{required?'필수':'선택'}] {name}</span></label>
        {i!==2&&<button className="terms-view" type="button" onClick={()=>setOpened({name,body})}>보기</button>}
      </div>)}
    </div>
    {error&&<p className="auth-error" role="alert">{error}</p>}
    <PrimaryButton type="button" onClick={()=>{if(checks.slice(0,3).every(Boolean)){sessionStorage.setItem('cast-terms-ok','true');nav('/signup/account')}else setError('필수 약관에 모두 동의해 주세요.')}}>다음</PrimaryButton>
  </div>
  {opened&&<div className="modal-backdrop" onClick={()=>setOpened(null)}><div className="modal-content" role="dialog" aria-modal="true" aria-label={opened.name} onClick={e=>e.stopPropagation()}><h3>{opened.name}</h3><p>{opened.body}</p><button className="small-primary" onClick={()=>setOpened(null)}>확인</button></div></div>}
  </AuthLayout>;
}
