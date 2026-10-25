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
  { id:'s9', title:'2025 가상 A 청년월세지원 사업 공고문', domain:'가상 청년지원센터', type:'정부자료', date:'2025.03.05', trust:'높음', folder:'청약·주거' },
  { id:'s10', title:'2024 가상 A 청년월세지원 사업 공고문', domain:'가상 청년지원센터', type:'정부자료', date:'2024.03.06', trust:'높음', folder:'청약·주거' },
];

export const STEPS = [
  ['질문 분석','조사할 주제를 이해했어요.'],
  ['공식 자료 검색','관련 문서를 찾아요.'],
  ['근거 조사 진행','찾은 문서를 바탕으로 관련 근거를 검토하고 있어요.'],
  ['주장 단위 분해','답변을 위한 주장 단위로 나누고 있어요.'],
  ['크로스 검증 진행','여러 자료를 비교하여 사실 관계를 대조해요.'],
  ['결과 정리','검증이 완료되면 최종 결과를 정리해요.'],
];

// 같은 정책의 연도별 버전. 오래된 순서로 두고 마지막 항목을 현재 시행 중인 정책으로 봅니다. (가상 예시)
export const POLICY_GROUPS = {
  'youth-rent': { name: '가상 A 청년월세지원 사업', versions: ['s10', 's9', 's8'] },
};

// 정책 비교에 쓰는 항목 순서
export const POLICY_FIELDS = [
  ['target', '지원 대상'], ['income', '소득 기준'], ['amount', '지원 금액'],
  ['duration', '지원 기간'], ['applyPeriod', '신청 기간'], ['method', '접수 방식'],
];

// 보관함에 저장된 정책 자료별 요약·주장(Claim). 당시 검증 결과와 현재 정책 기준 재검증 결과를 함께 둡니다.
export const POLICIES = {
  s10: {
    group: 'youth-rent', version: '2024년판', effective: '2024.03.01 ~ 2024.12.31',
    summary: '만 19~29세 무주택 청년에게 월 15만 원을 최대 10개월 동안 지원하는 첫 시행 사업입니다. 주민센터 방문 접수로만 신청을 받았습니다.',
    fields: { target: '만 19~29세 무주택 청년', income: '기준 중위소득 50% 이하', amount: '월 15만 원', duration: '최대 10개월', applyPeriod: '2024.03.04 ~ 2024.03.29', method: '주민센터 방문 접수' },
    quote: '지원 대상자에게 월 15만 원을 최대 10개월 동안 지원한다.',
    research: '2024 청년 월세 지원 조건 정리',
    claims: [
      { text: '지원 대상은 만 19~29세 무주택 청년이다.', status: '근거 확인', tone: 'success', field: 'target' },
      { text: '지원금은 월 15만 원이다.', status: '근거 확인', tone: 'success', field: 'amount' },
      { text: '소득 기준은 중위소득 50% 이하이다.', status: '근거 확인', tone: 'success', field: 'income' },
    ],
  },
  s9: {
    group: 'youth-rent', version: '2025년판', effective: '2025.03.01 ~ 2025.12.31',
    summary: '지원 금액을 월 20만 원으로 올리고 소득 기준을 중위소득 60% 이하로 완화했습니다. 지원 대상 연령과 접수 방식은 이전과 같습니다.',
    fields: { target: '만 19~29세 무주택 청년', income: '기준 중위소득 60% 이하', amount: '월 20만 원', duration: '최대 10개월', applyPeriod: '2025.03.03 ~ 2025.03.31', method: '주민센터 방문 접수' },
    quote: '지원 대상은 만 19~29세 무주택 청년으로 하며, 월 20만 원을 최대 10개월 동안 지원한다.',
    research: '2025 청년 월세 지원 조건 정리',
    claims: [
      { text: '지원 대상은 만 19~29세 무주택 청년이다.', status: '근거 확인', tone: 'success', field: 'target' },
      { text: '지원금은 월 20만 원, 최대 10개월이다.', status: '근거 확인', tone: 'success', field: 'duration' },
      { text: '신청은 주민센터 방문 접수로만 가능하다.', status: '부분 확인', tone: 'warning', field: 'method' },
      { text: '소득 기준은 중위소득 60% 이하이다.', status: '근거 확인', tone: 'success', field: 'income' },
    ],
  },
  s8: {
    group: 'youth-rent', version: '2026년판', effective: '2026.11.01 시행',
    summary: '지원 대상 연령을 만 34세까지 넓히고 지원 기간을 최대 12개월로 늘렸습니다. 신청 종료일과 접수 방식은 공고문에 명시되지 않아 별도 안내를 확인해야 합니다.',
    fields: { target: '만 19~34세 무주택 청년', income: '기준 중위소득 60% 이하', amount: '월 20만 원', duration: '최대 12개월', applyPeriod: '2026.11.01부터 (종료일 미정)', method: '별도 안내에 따름' },
    quote: '지원 대상은 만 19~34세 무주택 청년으로 한다. 지원 대상자에게 월 20만 원을 최대 12개월 동안 지원한다.',
    research: '2026 서울 거주 청년 월세 지원',
    claims: CLAIMS.map(c => ({ text: c.title, status: c.status, tone: c.tone, reason: c.analysis })),
  },
};

// 정책 외 출처의 상세 정보(요약 · 저장한 문장 · 이 출처를 근거로 쓴 주장과 판단 이유). 모두 화면 시연용 가상 예시입니다.
export const SOURCE_DETAILS = {
  s1: {
    summary: '청년 주거지원 사업 전반의 개편 방향을 정리한 자료입니다. 월세 지원 대상 연령 확대와 전세대출 이자 지원 한도 조정이 주요 내용입니다.',
    quote: '청년 월세 지원 대상 연령을 만 34세까지 확대하는 방안을 추진한다.',
    research: '2026 서울 거주 청년 월세 지원',
    claims: [
      { text: '월세 지원 대상 연령이 만 34세까지 확대된다.', status: '근거 확인', tone: 'success', reason: '개편안 본문에 연령 확대 방침이 명시되어 있고, 2026년 공고문과도 일치합니다.' },
      { text: '전세대출 이자 지원 한도가 상향된다.', status: '부분 확인', tone: 'warning', reason: '상향 방침은 있으나 구체적인 한도 금액은 확정되지 않았습니다.' },
    ],
  },
  s2: {
    summary: 'AI 반도체 수요 증가와 주요 기업의 생산 투자 동향을 분석한 산업 보고서입니다.',
    quote: '데이터센터용 AI 가속기 수요가 반도체 시장 성장을 견인하고 있다.',
    research: 'AI 반도체 산업 전망 정리',
    claims: [
      { text: 'AI 가속기 수요가 반도체 시장 성장을 이끌고 있다.', status: '근거 확인', tone: 'success', reason: '보고서의 수요 분석 장에서 같은 결론을 제시합니다.' },
      { text: '국내 기업의 시장 점유율이 50%를 넘는다.', status: '근거 부족', tone: 'muted', reason: '보고서에 점유율 수치가 없어 확인할 수 없습니다.' },
    ],
  },
  s3: {
    summary: '비타민D 혈중 농도와 호흡기 감염 위험의 관계를 살펴본 연구 논문입니다. 상관관계는 보고했지만 인과관계는 단정하지 않습니다.',
    quote: '비타민D 결핍군에서 호흡기 감염 발생률이 상대적으로 높게 나타났다.',
    research: '비타민D 효과 검증',
    claims: [
      { text: '비타민D가 부족하면 호흡기 감염 위험이 높아질 수 있다.', status: '근거 확인', tone: 'success', reason: '결핍군의 감염률이 높게 관찰되었다는 결과와 일치합니다.' },
      { text: '비타민D를 먹으면 감기를 예방할 수 있다.', status: '근거와 충돌', tone: 'danger', reason: '논문은 상관관계만 보고했으며, 보충제의 예방 효과는 입증하지 않았다고 밝힙니다.' },
    ],
  },
  s4: {
    summary: '대학 유형·지역별 평균 등록금 추이를 정리한 공식 통계 자료입니다.',
    quote: '사립대학의 연평균 등록금은 국공립대학보다 높은 수준을 유지하고 있다.',
    research: '대학 등록금 부담 비교',
    claims: [
      { text: '사립대 등록금이 국공립대보다 높다.', status: '근거 확인', tone: 'success', reason: '설립 유형별 통계표에서 확인됩니다.' },
      { text: '등록금은 5년 연속 동결되었다.', status: '부분 확인', tone: 'warning', reason: '최근 3년 자료만 포함되어 있어 5년 연속 여부는 확인되지 않습니다.' },
    ],
  },
  s5: {
    summary: '기온 상승과 강수 패턴 변화가 주요 작물의 생산성에 미치는 영향을 분석한 논문입니다.',
    quote: '기온 상승은 지역과 작물에 따라 생산성에 서로 다른 영향을 미친다.',
    research: '기후변화와 식량 생산',
    claims: [
      { text: '기후변화는 작물마다 다른 영향을 준다.', status: '근거 확인', tone: 'success', reason: '작물별 분석 결과가 논문의 핵심 결론입니다.' },
      { text: '모든 지역에서 쌀 생산량이 줄어든다.', status: '근거와 충돌', tone: 'danger', reason: '일부 고위도 지역에서는 생산량이 늘 수 있다고 보고합니다.' },
    ],
  },
  s6: {
    summary: '글로벌 기업들의 AI 투자 및 제휴 소식을 모은 뉴스 기사입니다. 기업 발표를 인용한 내용이 많아 공식 자료로 다시 확인하는 것이 좋습니다.',
    quote: '주요 기업들이 AI 인프라 투자 계획을 잇달아 발표했다.',
    research: 'AI 반도체 산업 전망 정리',
    claims: [
      { text: '주요 기업들이 AI 인프라 투자를 늘리고 있다.', status: '근거 확인', tone: 'success', reason: '여러 기업의 발표 내용을 인용하고 있습니다. 다만 기업 자체 발표라 공식 통계로 보완이 필요합니다.' },
    ],
  },
  s7: {
    summary: '연구 분야별 성과 추출 현황을 정리한 보고서입니다.',
    quote: '연구 성과 데이터의 체계적 수집과 공유가 필요하다.',
    research: '연구 동향 조사',
    claims: [
      { text: '연구 성과 데이터 공유 체계가 필요하다.', status: '부분 확인', tone: 'warning', reason: '필요성은 제기하지만 구체적인 근거 데이터는 제시하지 않습니다.' },
    ],
  },
};

// 출처를 다시 볼 때 "지금 써도 되나?"를 판단하는 정보: 발행 기관 · 발행일 · 신뢰도 근거 (가상 예시)
export const SOURCE_META = {
  s1: { publisher: '국토교통부', published: '2026.09.30', reasons: ['중앙 행정기관 발행 자료', '최근 1년 이내 발행', '다른 보관 출처(공고문)와 내용 일치'] },
  s2: { publisher: '산업연구원', published: '2026.08.20', reasons: ['국책 연구기관 보고서', '최근 1년 이내 발행'] },
  s3: { publisher: '학술지 게재 논문', published: '2025.11.02', reasons: ['동료 심사를 거친 학술 논문', '연구 한계를 본문에 명시'] },
  s4: { publisher: '국가통계포털', published: '2026.07.15', reasons: ['국가 승인 통계', '최근 1년 이내 발행'], cautions: ['최근 3년치 자료만 포함'] },
  s5: { publisher: '학술지 게재 논문', published: '2025.06.10', reasons: ['동료 심사를 거친 학술 논문'] },
  s6: { publisher: '언론 보도', published: '2026.10.03', reasons: ['최근 보도'], cautions: ['기업 자체 발표 인용 위주', '공식 자료로 교차 확인 필요'] },
  s7: { publisher: '무역 관련 기관', published: '2026.04.21', reasons: ['공공기관 발행 자료'], cautions: ['구체적 근거 데이터 부족'] },
  s8: { publisher: '가상 청년지원센터', published: '2026.10.01', reasons: ['사업 주관 기관의 공식 공고문', '현재 시행 중인 버전'] },
  s9: { publisher: '가상 청년지원센터', published: '2025.02.14', reasons: ['사업 주관 기관의 공식 공고문'], cautions: ['현재는 시행이 끝난 지난 정책'] },
  s10: { publisher: '가상 청년지원센터', published: '2024.02.15', reasons: ['사업 주관 기관의 공식 공고문'], cautions: ['현재는 시행이 끝난 지난 정책'] },
};
