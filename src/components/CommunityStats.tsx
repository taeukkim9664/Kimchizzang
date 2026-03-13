'use client';

import { useState } from 'react';
import { Users, MessageSquare, TrendingUp, Award, Clock, Zap, BarChart3, Target } from 'lucide-react';

// 샘플 커뮤니티 데이터
const communityStats = {
  totalMembers: 1247,
  onlineMembers: 342,
  dailyActive: 856,
  weeklyGrowth: '+12.3%',
  totalPosts: 5289,
  dailyPosts: 187,
  engagementRate: '68%',
  avgResponseTime: '4.2분',
};

const topContributors = [
  { id: 1, name: '김치마스터', role: 'VIP', contributions: 428, streak: 42 },
  { id: 2, name: '프리미엄헌터', role: '모더레이터', contributions: 312, streak: 28 },
  { id: 3, name: '차트분석가', role: '전문가', contributions: 289, streak: 35 },
  { id: 4, name: '초보투자자', role: '멤버', contributions: 156, streak: 21 },
  { id: 5, name: '데이터과학자', role: '전문가', contributions: 142, streak: 19 },
];

const recentActivities = [
  { id: 1, user: '김치마스터', action: 'BTC 김치프리미엄 분석 게시', time: '2분 전', type: 'post' },
  { id: 2, user: '프리미엄헌터', action: '업비트 vs 빗썸 비교 차트 공유', time: '15분 전', type: 'chart' },
  { id: 3, user: '초보투자자', action: '첫 거래 성공 후기 작성', time: '32분 전', type: 'success' },
  { id: 4, user: '데이터과학자', action: '주간 시장 리포트 발표', time: '1시간 전', type: 'report' },
  { id: 5, user: '차트분석가', action: 'ETH 김치프리미엄 예측 업데이트', time: '2시간 전', type: 'analysis' },
];

const channelStats = [
  { name: '일반토론', members: 1247, online: 342, posts: 2156 },
  { name: '김치프리미엄', members: 892, online: 187, posts: 1289 },
  { name: '차트분석', members: 745, online: 156, posts: 987 },
  { name: '투자성공기', members: 623, online: 89, posts: 432 },
  { name: '질문답변', members: 1108, online: 256, posts: 1789 },
];

export default function CommunityStats() {
  const [timeRange, setTimeRange] = useState('7일');

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
      {/* 헤더 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold">김치짱 커뮤니티 현황</h3>
          <p className="text-gray-400">실시간 커뮤니티 활동 및 통계</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
            {['1일', '7일', '30일', '전체'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'hover:bg-gray-800'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-medium hover:opacity-90 transition flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>커뮤니티 가입</span>
          </button>
        </div>
      </div>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* 총 멤버수 */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-green-400" />
            <div className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {communityStats.weeklyGrowth}
            </div>
          </div>
          <div className="text-3xl font-bold">{communityStats.totalMembers.toLocaleString()}</div>
          <div className="text-sm text-gray-400">총 멤버수</div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="text-green-400">{communityStats.onlineMembers}명 온라인</span>
          </div>
        </div>

        {/* 일일 활동 */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div className="text-xs px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded">
              활발함
            </div>
          </div>
          <div className="text-3xl font-bold">{communityStats.dailyActive.toLocaleString()}</div>
          <div className="text-sm text-gray-400">일일 활동 멤버</div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="text-yellow-400">매일 {communityStats.dailyPosts}개 게시글</span>
          </div>
        </div>

        {/* 참여율 */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <div className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded">
              높음
            </div>
          </div>
          <div className="text-3xl font-bold">{communityStats.engagementRate}</div>
          <div className="text-sm text-gray-400">참여율</div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="text-blue-400">평균 응답 {communityStats.avgResponseTime}</span>
          </div>
        </div>

        {/* 총 게시글 */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            <div className="text-xs px-2 py-1 bg-purple-900/30 text-purple-400 rounded">
              지식 공유
            </div>
          </div>
          <div className="text-3xl font-bold">{communityStats.totalPosts.toLocaleString()}</div>
          <div className="text-sm text-gray-400">총 게시글</div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="text-purple-400">평균 {Math.round(communityStats.totalPosts / communityStats.totalMembers * 10)/10}개/인</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 상위 기여자 */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h4 className="text-xl font-bold mb-2 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              상위 기여자
            </h4>
            <p className="text-gray-400">가장 활발한 커뮤니티 멤버들</p>
          </div>

          <div className="space-y-4">
            {topContributors.map((contributor) => (
              <div
                key={contributor.id}
                className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {contributor.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold">{contributor.name}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          contributor.role === 'VIP'
                            ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 text-yellow-400'
                            : contributor.role === '모더레이터'
                            ? 'bg-gradient-to-r from-green-900/30 to-emerald-800/30 text-green-400'
                            : contributor.role === '전문가'
                            ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30 text-blue-400'
                            : 'bg-gray-800 text-gray-400'
                        }`}>
                          {contributor.role}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {contributor.streak}일 연속
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      {contributor.contributions}
                    </div>
                    <div className="text-sm text-gray-400">기여도</div>
                  </div>
                </div>
                
                {/* 진행률 바 */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>활동 점수</span>
                    <span>{contributor.contributions}점</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                      style={{ width: `${Math.min(100, contributor.contributions / 5)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 활동 및 채널 통계 */}
        <div>
          {/* 최근 활동 */}
          <div className="mb-8">
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-orange-500" />
              최근 활동
            </h4>
            
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-gray-900/30 rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{activity.user}</div>
                      <div className="text-xs text-gray-400 mt-1">{activity.action}</div>
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      activity.type === 'post'
                        ? 'bg-blue-900/30 text-blue-400'
                        : activity.type === 'chart'
                        ? 'bg-green-900/30 text-green-400'
                        : activity.type === 'success'
                        ? 'bg-yellow-900/30 text-yellow-400'
                        : activity.type === 'report'
                        ? 'bg-purple-900/30 text-purple-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {activity.type === 'post' && '게시글'}
                      {activity.type === 'chart' && '차트'}
                      {activity.type === 'success' && '성공기'}
                      {activity.type === 'report' && '리포트'}
                      {activity.type === 'analysis' && '분석'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 채널 통계 */}
          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-red-500" />
              채널별 통계
            </h4>
            
            <div className="space-y-3">
              {channelStats.map((channel) => (
                <div
                  key={channel.name}
                  className="bg-gray-900/30 rounded-lg p-3 border border-gray-800"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{channel.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        게시글: {channel.posts.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{channel.members.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">
                        <span className="text-green-400">{channel.online} 온라인</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 멤버 비율 바 */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>활성도</span>
                      <span>{Math.round((channel.online / channel.members) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                        style={{ width: `${(channel.online / channel.members) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-xl font-bold mb-2">지금 커뮤니티에 참여하세요!</h4>
            <p className="text-gray-400">
              실시간 시장 분석, 투자 전략 공유, 전문가 Q&A까지
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold hover:opacity-90 transition">
              Discord 가입하기
            </button>
            <button className="px-6 py-3 border border-gray-600 rounded-lg font-bold hover:bg-gray-800 transition">
              둘러보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}