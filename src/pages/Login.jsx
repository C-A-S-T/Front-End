import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout, { PrimaryButton } from '../components/AuthLayout';
import AuthField from '../components/AuthField';
export default function Login(){
  const nav=useNavigate();
  const [email,setEmail]=useState('');const [password,setPassword]=useState('');
  const [remember,setRemember]=useState(false);const [error,setError]=useState('');
  function submit(e){ e.preventDefault();
    if(!/^\S+@\S+\.\S+$/.test(email)){setError('올바른 이메일 주소를 입력해 주세요.');return;}
    if(!password.trim()){setError('비밀번호를 입력해 주세요.');return;}
    // 데모: 인증 서버가 연결되지 않아 임의 이메일/비밀번호로 이동만 시연합니다.
    sessionStorage.setItem('cast-demo-session','true');
    if(remember)localStorage.setItem('cast-demo-remember','true');
    setError('');nav('/research');
  }
  return <AuthLayout step={1}>
    <section className="auth-login-content">
      <h1>로그인</h1><p className="auth-description">계정에 로그인하여 C.A.S.T를 이용해 보세요.</p>
      <form onSubmit={submit} className="auth-login-form">
        <AuthField type="email" id="login-email" autoComplete="username" placeholder="아이디 (이메일)" value={email} onChange={setEmail}/>
        <AuthField type="password" id="login-password" autoComplete="current-password" placeholder="비밀번호" value={password} onChange={setPassword}/>
        <div className="auth-options"><label className="checkbox-line"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>로그인 상태 유지</label></div>
        {error&&<div className="auth-error" role="alert">{error}</div>}
        <PrimaryButton type="submit">로그인</PrimaryButton>
      </form>
      <div className="auth-signup-area"><div className="auth-separator"/><p>계정이 없으신가요?</p><Link className="auth-outline" to="/signup/terms">회원가입</Link></div>
      <p className="demo-note">* 현재는 UI 확인을 위한 데모입니다. 실제 회원 인증은 연동되지 않았습니다.</p>
    </section>
  </AuthLayout>;
}
