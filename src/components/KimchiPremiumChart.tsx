'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Download, Share2 } from 'lucide-react';

// 샘플 차트 데이터
const sampleChartData = [
  { time: '00:00', value: 2.5 },
  { time: '04:00', value: 3.1 },
  { time: '08:00', value: 4.2 },
  { time: '12:00', value: 3.8 },
  { time: '16:00', value: 4.5 },
  { time: '20:00', value: 3.9 },
  { time: '23:59', value: 4.1 },
];

const exchangeData = [
  { name: '업비트', price: '₩98,500,000', premium: '+4.2%', trend: 'up' },
  { name: '빗썸', price: '₩98,300,000', premium: '+3.8%', trend: 'up' },
  { name: '코인원', price: '₩98,100,000', premium: '+3.5%', trend: 'up' },
  { name: '고팍스', price: '₩97,900,000', premium: '+3.2%', trend: 'up' },
  { name: '바이낸스', price: '$67,200', premium: '기준', trend: 'neutral' },
];

export default function KimchiPremiumChart() {
  const [timeRange, setTimeRange] = useState('1D');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPremium, setCurrentPremium] = useState(4.1);

  const timeRanges = [
    { label: '1시간', value: '1H' },
    { label: '1일', value: '1D' },
    { label: '1주', value: '1W' },
    { label: '1달', value: '1M' },
    { label: '1년', value: '1Y' },
  ];

  const refreshData = () => {
    setIsLoading(true);
    // 실제 API 호출 시뮬레이션
    setTimeout(() => {
      setCurrentPremium(4.1 + Math.random() * 0.5 - 0.25);
      setIsLoading(false);
    }, 1000);
  };

  // 자동 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPremium(prev => prev + (Math.random() * 0.1 - 0.05));
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 차트 높이 계산
  const maxValue = Math.max(...sampleChartData.map(d => d.value));
  const minValue = Math.min(...sampleChartData.map(d => d.value));

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 차트 섹션 */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold">김치프리미엄 차트</h3>
              <p className="text-gray-400">비트코인 기준 국내/해외 가격 차이</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="p-2 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 차트 컨트롤 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-4 py-2 rounded-lg transition ${
                    timeRange === range.value
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">
                {currentPremium.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">
                {currentPremium > 0 ? (
                  <span className="text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    전일대비 +0.3%
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    전일대비 -0.3%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="bg-gray-900 rounded-xl p-4 h-64">
            <div className="relative h-full">
              {/* Y축 라벨 */}
              <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
                <span>{maxValue.toFixed(1)}%</span>
                <span>{((maxValue + minValue) / 2).toFixed(1)}%</span>
                <span>{minValue.toFixed(1)}%</span>
              </div>

              {/* 차트 라인 */}
              <div className="absolute left-12 right-0 top-0 bottom-0">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* 그리드 라인 */}
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#374151" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#374151" strokeWidth="0.5" />
                  <line x1="0" y1="75" x2="100" y2="75" stroke="#374151" strokeWidth="0.5" />

                  {/* 차트 라인 */}
                  <polyline
                    points={sampleChartData
                      .map((d, i) => {
                        const x = (i / (sampleChartData.length - 1)) * 100;
                        const y = 100 - ((d.value - minValue) / (maxValue - minValue)) * 100;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="url(#chartGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* 영역 채우기 */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* 데이터 포인트 */}
                {sampleChartData.map((d, i) => {
                  const x = (i / (sampleChartData.length - 1)) * 100;
                  const y = 100 - ((d.value - minValue) / (maxValue - minValue)) * 100;
                  return (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 transform -translate-x-1.5 -translate-y-1.5"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    />
                  );
                })}
              </div>

              {/* X축 라벨 */}
              <div className="absolute left-12 right-0 bottom-0 flex justify-between text-xs text-gray-500">
                {sampleChartData.map((d, i) => (
                  <span key={i} className="transform -translate-x-1/2">
                    {d.time}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 차트 설명 */}
          <div className="mt-4 text-sm text-gray-400">
            <p>
              김치프리미엄은 국내 거래소(업비트, 빗썸 등)와 해외 거래소(바이낸스 등)의
              가격 차이를 나타내는 지표입니다. 양수일 경우 국내 가격이 더 높은 상태입니다.
            </p>
          </div>
        </div>

        {/* 거래소 데이터 섹션 */}
        <div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">거래소별 프리미엄</h3>
            <p className="text-gray-400">실시간 거래소 데이터 비교</p>
          </div>

          <div className="space-y-4">
            {exchangeData.map((exchange, index) => (
              <div
                key={exchange.name}
                className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{exchange.name}</div>
                    <div className="text-sm text-gray-400">BTC/KRW</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{exchange.price}</div>
                    <div className={`text-sm flex items-center justify-end ${
                      exchange.trend === 'up'
                        ? 'text-green-400'
                        : exchange.trend === 'down'
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}>
                      {exchange.trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                      {exchange.trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                      {exchange.premium}
                    </div>
                  </div>
                </div>
                
                {/* 진행률 바 */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>프리미엄</span>
                    <span>{exchange.premium}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        exchange.trend === 'up'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                          : exchange.trend === 'down'
                          ? 'bg-gradient-to-r from-red-500 to-pink-600'
                          : 'bg-gray-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.abs(parseFloat(exchange.premium)) * 20)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 통계 요약 */}
          <div className="mt-6 bg-gray-900/50 rounded-xl p-4">
            <h4 className="font-bold mb-3">요약 통계</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">평균 프리미엄</div>
                <div className="text-xl font-bold text-green-400">+3.7%</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">최대 프리미엄</div>
                <div className="text-xl font-bold text-emerald-400">+4.5%</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">거래량</div>
                <div className="text-xl font-bold">₩8.2조</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">참여 거래소</div>
                <div className="text-xl font-bold">14개</div>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="mt-6 space-y-3">
            <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-medium hover:opacity-90 transition">
              프리미엄 알림 설정
            </button>
            <button className="w-full py-3 border border-gray-600 rounded-lg font-medium hover:bg-gray-800 transition">
              상세 분석 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}