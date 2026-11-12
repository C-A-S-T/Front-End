import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';
import './styles/apple.css'; // Apple 스타일 레이어 — 이 줄을 지우면 원래 디자인으로 돌아갑니다
import { fitScreen } from './utils/fitScreen';
import { applyTheme, getTheme } from './utils/theme';

applyTheme(getTheme());
fitScreen();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter><App /></BrowserRouter>
  </React.StrictMode>,
);
