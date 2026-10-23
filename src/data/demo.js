export const DEFAULT_QUESTION = '가상 A 청년월세지원 사업의 대상·지원금액·신청기간을 정리해줘.';
export const DEFAULT_TITLE = '2026 서울 거주 청년 월세 지원';

// 이 데이터는 UI 시연을 위한 가상 예시입니다. 실제 정책·행정 정보가 아닙니다.
export const CLAIMS = [
  {
    id: 1, title: '지원 대상은 만 19~34세 무주택 청년이다.',
    detail: '나이·주택 보유 조건이 근거와 일치합니다.', status: '근거 확인', tone: 'success',
    sourceName: '가상 A 청년월세지원 사업 공고문', publisher: '가상 청년지원센터',
    quote: '지원 대상은 만 19~34세 무주택 청년으로 한다.',
    analysis: '나이 및 주택 보유 조건이 검색된 가상 근거 문서와 일치합니다.',
  },
  {
    id: 2, title: '지원금은 월 30만 원이다.',
    detail: 'AI 답변 30만 원 ↔ 원문 20만 원', status: '근거와 충돌', tone: 'danger',
    sourceName: '가상 A 청년월세지원 사업 공고문', publisher: '가상 청년지원센터',
    quote: '지원 대상자에게 월 20만 원을 최대 12개월 동안 지원한다.',
    analysis: "AI 답변의 '월 30만 원'과 가상 근거의 '월 20만 원'이 서로 달라 금액 정보에 충돌이 있습니다.",
  },
  {
    id: 3, title: '신청기간은 2026년 11월 1일~30일이다.',
    detail: '신청 시작일만 확인, 종료일 근거 미확인', status: '부분 확인', tone: 'warning',
    sourceName: '가상 A 청년월세지원 사업 공고문', publisher: '가상 청년지원센터',
    quote: '사업 신청은 2026년 11월 1일부터 접수한다.',
    analysis: '시작일은 확인되지만 종료일인 11월 30일의 명시적 근거는 발견되지 않았습니다.',
  },
  {
    id: 4, title: '신청은 온라인에서 가능하다.',
    detail: '온라인 신청 방식에 관한 명시적 근거 없음', status: '근거 부족', tone: 'muted',
    sourceName: '가상 시청 복지정책 자료집', publisher: '가상 시청',
    quote: '접수 방식은 별도 안내에 따른다.',
    analysis: '검색된 가상 문서에 온라인 신청 방식에 관한 직접적인 근거가 없습니다.',
  },
];

export const ARCHIVE_SOURCES = [
  { id:'s1', title:'2026년 청년 주거지원 정책 개편안', domain:'www.molit.go.kr', type:'정부자료', date:'2026.10.14', trust:'높음', folder:'청약·주거' },
  { id:'s2', title:'AI 반도체 시장 동향 보고서', domain:'www.kiet.re.kr', type:'보고서', date:'2026.10.12', trust:'높음', folder:'정부 지원정책' },
  { id:'s3', title:'비타민D와 면역력에 관한 연구', domain:'www.sciencedirect.com', type:'논문', date:'2026.10.10', trust:'높음', folder:'교육' },
  { id:'s4', title:'대학생 등록금 현황 통계', domain:'www.kosis.kr', type:'공식통계', date:'2026.10.08', trust:'보통', folder:'교육' },
  { id:'s5', title:'기후변화가 농업 생산성에 미치는 영향', domain:'www.nature.com', type:'논문', date:'2026.10.06', trust:'높음', folder:'정부 지원정책' },
  { id:'s6', title:'AI 관련 글로벌 기업 동향', domain:'www.reuters.com', type:'뉴스기사', date:'2026.10.04', trust:'보통', folder:'정부 지원정책' },
  { id:'s7', title:'한국 초전연구 추출 동향', domain:'www.kita.net', type:'보고서', date:'2026.10.02', trust:'높음', folder:'교육' },
  { id:'s8', title:'가상 A 청년월세지원 사업 공고문', domain:'가상 청년지원센터', type:'정부자료', date:'2026.10.01', trust:'높음', folder:'청약·주거' },
];

export const STEPS = [
  ['질문 분석','조사할 주제를 이해했어요.'],
  ['공식 자료 검색','관련 문서를 찾아요.'],
  ['근거 조사 진행','찾은 문서를 바탕으로 관련 근거를 검토하고 있어요.'],
  ['주장 단위 분해','답변을 위한 주장 단위로 나누고 있어요.'],
  ['크로스 검증 진행','여러 자료를 비교하여 사실 관계를 대조해요.'],
  ['결과 정리','검증이 완료되면 최종 결과를 정리해요.'],
];
