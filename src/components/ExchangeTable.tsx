'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Star, Filter, Download, ExternalLink } from 'lucide-react';

// 샘플 거래소 데이터
const exchangeData = [
  {
    id: 1,
    name: '업비트',
    country: '국내',
    btcPrice: '₩98,500,000',
    usdtPrice: '₩1,350',
    premium: '+4.2%',
    volume24h: '₩2.1조',
    change24h: '+1.5%',
    trend: 'up',
    favorite: true,
    verified: true,
  },
  {
    id: 2,
    name: '빗썸',
    country: '국내',
    btcPrice: '₩98,300,000',
    usdtPrice: '₩1,348',
    premium: '+3.8%',
    volume24h: '₩1.8조',
    change24h: '+1.2%',
    trend: 'up',
    favorite: false,
    verified: true,
  },
  {
    id: 3,
    name: '코인원',
    country: '국내',
    btcPrice: '₩98,100,000',
    usdtPrice: '₩1,345',
    premium: '+3.5%',
    volume24h: '₩1.2조',
    change24h: '+0.8%',
    trend: 'up',
    favorite: false,
    verified: true,
  },
  {
    id: 4,
    name: '고팍스',
    country: '국내',
    btcPrice: '₩97,900,000',
    usdtPrice: '₩1,342',
    premium: '+3.2%',
    volume24h: '₩0.8조',
    change24h: '+0.5%',
    trend: 'up',
    favorite: false,
    verified: true,
  },
  {
    id: 5,
    name: '바이낸스',
    country: '해외',
    btcPrice: '$67,200',
    usdtPrice: '$1.00',
    premium: '기준',
    volume24h: '$32.5B',
    change24h: '+2.1%',
    trend: 'up',
    favorite: true,
    verified: true,
  },
  {
    id: 6,
    name: '바이낸스 선물',
    country: '해외',
    btcPrice: '$67,250',
    usdtPrice: '$1.00',
    premium: '+0.07%',
    volume24h: '$45.2B',
    change24h: '+2.3%',
    trend: 'up',
    favorite: false,
    verified: true,
  },
  {
    id: 7,
    name: 'OKX',
    country: '해외',
    btcPrice: '$67,180',
    usdtPrice: '$1.00',
    premium: '-0.03%',
    volume24h: '$12.8B',
    change24h: '+1.8%',
    trend: 'down',
    favorite: false,
    verified: true,
  },
  {
    id: 8,
    name: '바이비트',
    country: '해외',
    btcPrice: '$67,190',
    usdtPrice: '$1.00',
    premium: '-0.01%',
    volume24h: '$18.3B',
    change24h: '+1.9%',
    trend: 'down',
    favorite: false,
    verified: true,
  },
  {
    id: 9,
    name: '비트겟',
    country: '해외',
    btcPrice: '$67,170',
    usdtPrice: '$1.00',
    premium: '-0.04%',
    volume24h: '$9.2B',
    change24h: '+1.7%',
    trend: 'down',
    favorite: false,
    verified: true,
  },
  {
    id: 10,
    name: '게이트',
    country: '해외',
    btcPrice: '$67,160',
    usdtPrice: '$1.00',
    premium: '-0.06%',
    volume24h: '$7.5B',
    change24h: '+1.6%',
    trend: 'down',
    favorite: false,
    verified: true,
  },
];

const countryFilters = ['전체', '국내', '해외'];
const sortOptions = ['프리미엄 높은순', '거래량 높은순', '변동률 높은순', '이름순'];

export default function ExchangeTable() {
  const [selectedCountry, setSelectedCountry] = useState('전체');
  const [sortBy, setSortBy] = useState('프리미엄 높은순');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([1, 5]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // 필터링 및 정렬 로직
  const filteredData = exchangeData
    .filter(exchange => {
      if (selectedCountry !== '전체' && exchange.country !== selectedCountry) {
        return false;
      }
      if (searchQuery && !exchange.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case '프리미엄 높은순':
          const premiumA = parseFloat(a.premium) || 0;
          const premiumB = parseFloat(b.premium) || 0;
          return premiumB - premiumA;
        case '거래량 높은순':
          const volumeA = parseFloat(a.volume24h.replace(/[^0-9.]/g, ''));
          const volumeB = parseFloat(b.volume24h.replace(/[^0-9.]/g, ''));
          return volumeB - volumeA;
        case '변동률 높은순':
          const changeA = parseFloat(a.change24h);
          const changeB = parseFloat(b.change24h);
          return changeB - changeA;
        case '이름순':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
      {/* 헤더 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold">통합 거래소 데이터</h3>
          <p className="text-gray-400">14개 거래소 실시간 가격 비교</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* 검색 */}
          <div className="relative">
            <input
              type="text"
              placeholder="거래소 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm w-48 focus:outline-none focus:border-green-500"
            />
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          {/* 국가 필터 */}
          <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
            {countryFilters.map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  selectedCountry === country
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'hover:bg-gray-800'
                }`}
              >
                {country}
              </button>
            ))}
          </div>

          {/* 정렬 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-green-500"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* 내보내기 버튼 */}
          <button className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>내보내기</span>
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">
                <div className="flex items-center space-x-2">
                  <span>거래소</span>
                </div>
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">국가</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">BTC 가격</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">USDT/KRW</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">김치프리미엄</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">24h 거래량</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">24h 변동</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((exchange) => (
              <tr
                key={exchange.id}
                className="border-b border-gray-800 hover:bg-gray-900/50 transition"
              >
                {/* 거래소 이름 */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleFavorite(exchange.id)}
                      className="text-yellow-500 hover:text-yellow-400 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          favorites.includes(exchange.id)
                            ? 'fill-yellow-500'
                            : 'fill-transparent'
                        }`}
                      />
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{exchange.name}</span>
                        {exchange.verified && (
                          <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">
                            인증됨
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 국가 */}
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    exchange.country === '국내'
                      ? 'bg-blue-900/30 text-blue-400'
                      : 'bg-purple-900/30 text-purple-400'
                  }`}>
                    {exchange.country}
                  </span>
                </td>

                {/* BTC 가격 */}
                <td className="py-4 px-4">
                  <div className="font-bold">{exchange.btcPrice}</div>
                </td>

                {/* USDT/KRW */}
                <td className="py-4 px-4">
                  <div className="font-medium">{exchange.usdtPrice}</div>
                </td>

                {/* 김치프리미엄 */}
                <td className="py-4 px-4">
                  <div className={`flex items-center space-x-1 ${
                    exchange.premium.startsWith('+')
                      ? 'text-green-400'
                      : exchange.premium.startsWith('-')
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}>
                    {exchange.premium !== '기준' && (
                      exchange.premium.startsWith('+') ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )
                    )}
                    <span className="font-bold">{exchange.premium}</span>
                  </div>
                </td>

                {/* 24h 거래량 */}
                <td className="py-4 px-4">
                  <div className="font-medium">{exchange.volume24h}</div>
                </td>

                {/* 24h 변동 */}
                <td className="py-4 px-4">
                  <div className={`flex items-center space-x-1 ${
                    exchange.change24h.startsWith('+')
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    {exchange.change24h.startsWith('+') ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{exchange.change24h}</span>
                  </div>
                </td>

                {/* 액션 */}
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-sm font-medium hover:opacity-90 transition">
                      거래
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 요약 통계 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="text-sm text-gray-400">평균 프리미엄</div>
          <div className="text-2xl font-bold text-green-400">+3.7%</div>
          <div className="text-xs text-gray-500">국내 거래소 기준</div>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="text-sm text-gray-400">총 거래량</div>
          <div className="text-2xl font-bold">₩6.2조</div>
          <div className="text-xs text-gray-500">24시간 기준</div>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="text-sm text-gray-400">가장 높은 프리미엄</div>
          <div className="text-2xl font-bold text-emerald-400">업비트 +4.2%</div>
          <div className="text-xs text-gray-500">BTC 기준</div>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="text-sm text-gray-400">거래소 수</div>
          <div className="text-2xl font-bold">14개</div>
          <div className="text-xs text-gray-500">국내 4개, 해외 10개</div>
        </div>
      </div>

      {/* 설명 및 팁 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl">
        <h4 className="font-bold mb-2 flex items-center">
          <Star className="w-4 h-4 mr-2 text-yellow-500" />
          사용 팁
        </h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• 별표를 클릭하여 자주 사용하는 거래소를 즐겨찾기에 추가하세요</li>
          <li>• 국가 필터를 사용하여 국내/해외 거래소만 볼 수 있습니다</li>
          <li>• 김치프리미엄이 높은 거래소에서 매수,