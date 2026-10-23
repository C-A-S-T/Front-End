import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignupTerms from './pages/SignupTerms';
import SignupAccount from './pages/SignupAccount';
import SignupComplete from './pages/SignupComplete';
import Main from './pages/Main';
import ResearchProgress from './pages/ResearchProgress';
import SourceArchive from './pages/SourceArchive';

export default function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup/terms" element={<SignupTerms />} />
    <Route path="/signup/account" element={<SignupAccount />} />
    <Route path="/signup/complete" element={<SignupComplete />} />
    <Route path="/research" element={<Main />} />
    <Route path="/research/progress" element={<ResearchProgress />} />
    <Route path="/archive" element={<SourceArchive />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>;
}
