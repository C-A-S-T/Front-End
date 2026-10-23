import { useNavigate } from 'react-router-dom';
export default function AuthLayout({ step, children }) {
  const nav = useNavigate();
  return <div className="auth-page">
    <aside className="auth-brand">
      <button className="auth-logo" aria-label="로그인 화면" onClick={() => nav('/login')}>C</button>
      <div className="auth-brand-title">C.A.S.T</div>
      <div className="auth-brand-sub">신뢰할 수 있는<br />AI 리서치 어시스턴트</div>
      <div className="auth-brand-line" />
      <div className="auth-brand-copy">근거를 찾고,<br />검증하는 AI 리서치 어시스턴트<br />C.A.S.T와 함께하세요.</div>
      <div className="auth-progress-footer"><div>{String(step).padStart(2,'0')} / 04</div>
        <div className="auth-progress-bars">{[1,2,3,4].map(n=><span key={n} className={n<=step?'active':''} />)}</div>
      </div>
    </aside>
    <main className="auth-card">{children}</main>
  </div>;
}
export function SignupStepper({current}) {
  const labels = ['약관 동의','정보 입력','가입 완료'];
  return <div className="signup-stepper">{labels.map((label,index)=><div key={label} className={'signup-step '+(index+1===current?'is-current':'')}>
    <span className="step-circle">{index+1}</span><span>{label}</span>
    {index!==2&&<span className="step-line" />}
  </div>)}</div>;
}
export function PrimaryButton({children,...props}) {return <button {...props} className={'auth-primary '+(props.className||'')}>{children}</button>}
