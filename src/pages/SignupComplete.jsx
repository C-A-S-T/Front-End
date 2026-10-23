import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import AuthLayout,{SignupStepper,PrimaryButton} from '../components/AuthLayout';
export default function SignupComplete(){const nav=useNavigate();return <AuthLayout step={4}><div className="auth-signup-content signup-complete">
  <h1>회원가입</h1><SignupStepper current={3}/>
  <div className="complete-message"><div className="complete-icon"><Check size={56}/></div><h2>회원가입이 완료되었습니다.</h2><p>지금 바로 C.A.S.T에 로그인하여<br/>AI 리서치 어시스턴트를 이용해 보세요.</p></div>
  <PrimaryButton type="button" onClick={()=>nav('/login')}>로그인하기</PrimaryButton>
  <p className="demo-note">* 화면 흐름 시연용으로 계정은 서버에 저장되지 않습니다.</p>
</div></AuthLayout>}
