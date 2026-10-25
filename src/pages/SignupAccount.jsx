import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthLayout,{ SignupStepper,PrimaryButton } from '../components/AuthLayout';
import AuthField from '../components/AuthField';
export default function SignupAccount(){
  const nav=useNavigate();const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [confirm,setConfirm]=useState('');const [error,setError]=useState('');
  function submit(e){e.preventDefault();if(!/^\S+@\S+\.\S+$/.test(email)){setError('이메일 형식을 확인해 주세요.');return;}if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)){setError('비밀번호는 영문·숫자·특수문자를 포함해 8자 이상이어야 합니다.');return;}if(password!==confirm){setError('비밀번호가 일치하지 않습니다.');return;}setError('');nav('/signup/complete')}
  return <AuthLayout step={3}><div className="auth-signup-content">
    <h1>회원가입</h1><SignupStepper current={2}/>
    <div className="signup-section-heading"><h2>계정 정보 입력</h2><p>C.A.S.T에서 사용할 계정 정보를 입력해 주세요.</p></div>
    <form className="signup-account-form" onSubmit={submit}>
      <AuthField type="email" value={email} onChange={setEmail} placeholder="아이디 (이메일)" autoComplete="email"/>
      <p className="auth-hint">이메일 형식으로 입력해 주세요.</p>
      <AuthField type="password" value={password} onChange={setPassword} placeholder="비밀번호" autoComplete="new-password"/>
      <p className="auth-hint">영문, 숫자, 특수문자를 포함하여 8자 이상 입력해 주세요.</p>
      <AuthField type="password" value={confirm} onChange={setConfirm} placeholder="비밀번호 확인" autoComplete="new-password"/>
      {error&&<p className="auth-error" role="alert">{error}</p>}
      <PrimaryButton type="submit">회원가입</PrimaryButton>
    </form>
    <button type="button" className="auth-back-link" onClick={()=>nav('/signup/terms')}><ArrowLeft size={16}/> 이전으로</button>
  </div></AuthLayout>;
}
