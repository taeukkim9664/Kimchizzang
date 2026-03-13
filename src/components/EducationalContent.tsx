'use client';

import { useState } from 'react';
import { BookOpen, Video, FileText, Star, Clock, Users, TrendingUp, Award, ChevronRight, Play, Download, Share2 } from 'lucide-react';

// 샘플 교육 콘텐츠 데이터
const educationalContent = [
  {
    id: 1,
    title: '암호화폐 투자 입문 가이드',
    description: '처음 시작하는 분들을 위한 완벽한 가이드',
    type: 'guide',
    level: '초보자',
    duration: '15분',
    rating: 4.9,
    students: 1247,
    completed: true,
    featured: true,
    tags: ['기초', '입문', '실전'],
  },
  {
    id: 2,
    title: '김치프리미엄 완전 정복',
    description: '국내/해외 가격 차이를 이용한 수익 전략',
    type: 'video',
    level: '중급자',
    duration: '28분',
    rating: 4.8,
    students: 892,
    completed: false,
    featured: true,
    tags: ['전략', '수익', '분석'],
  },
  {
    id: 3,
    title: '실전 차트 분석 기법',
    description: '프로 트레이더의 차트 분석 노하우',
    type: 'course',
    level: '고급자',
    duration: '45분',
    rating: 4.9,
    students: 745,
    completed: false,
    featured: false,
    tags: ['기술분석', '차트', '전문가'],
  },
  {
    id: 4,
    title: '리스크 관리 전략',
    description: '손실을 최소화하는 현명한 투자법',
    type: 'article',
    level: '중급자',
    duration: '12분',
    rating: 4.7,
    students: 623,
    completed: true,
    featured: false,
    tags: ['리스크', '관리', '전략'],
  },
  {
    id: 5,
    title: '디파이(DeFi) 투자 가이드',
    description: '탈중앙화 금융의 모든 것',
    type: 'guide',
    level: '중급자',
    duration: '32분',
    rating: 4.6,
    students: 512,
    completed: false,
    featured: false,
    tags: ['디파이', '블록체인', '수익'],
  },
  {
    id: 6,
    title: '주간 시장 분석 리포트',
    description: '이번 주 주목할 코인과 시장 흐름',
    type: 'report',
    level: '모든수준',
    duration: '8분',
    rating: 4.8,
    students: 1108,
    completed: true,
    featured: true,
    tags: ['시장분석', '주간', '리포트'],
  },
];

const learningPaths = [
  {
    id: 1,
    name: '초보자 길잡이',
    description: '처음부터 차근차근 배우는 코스',
    courses: 6,
    duration: '3시간',
    progress: 75,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    name: '수익형 투자자',
    description: '실전 수익을 위한 전략 코스',
    courses: 8,
    duration: '5시간',
    progress: 40,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 3,
    name: '프로 트레이더',
    description: '전문가를 위한 고급 전략',
    courses: 10,
    duration: '8시간',
    progress: 20,
    color: 'from-purple-500 to-pink-500',
  },
];

const contentTypeIcons = {
  guide: BookOpen,
  video: Video,
  course: FileText,
  article: FileText,
  report: TrendingUp,
};

const levelColors = {
  초보자: 'bg-blue-900/30 text-blue-400',
  중급자: 'bg-green-900/30 text-green-400',
  고급자: 'bg-purple-900/30 text-purple-400',
  모든수준: 'bg-gray-800 text-gray-400',
};

export default function EducationalContent() {
  const [selectedLevel, setSelectedLevel] = useState('전체');
  const [selectedType, setSelectedType] = useState('전체');

  const levels = ['전체', '초보자', '중급자', '고급자', '모든수준'];
  const types = ['전체', 'guide', 'video', 'course', 'article', 'report'];

  const filteredContent = educationalContent.filter(content => {
    if (selectedLevel !== '전체' && content.level !== selectedLevel) return false;
    if (selectedType !== '전체' && content.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
      {/* 헤더 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold">교육 콘텐츠</h3>
          <p className="text-gray-400">단계별 학습으로 투자 실력 향상</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* 레벨 필터 */}
          <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  selectedLevel === level
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'hover:bg-gray-800'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* 타입 필터 */}
          <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
                    : 'hover:bg-gray-800'
                }`}
              >
                {type === 'guide' && '가이드'}
                {type === 'video' && '영상'}
                {type === 'course' && '코스'}
                {type === 'article' && '아티클'}
                {type === 'report' && '리포트'}
                {type === '전체' && '전체'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 학습 경로 */}
      <div className="mb-8">
        <h4 className="text-xl font-bold mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          추천 학습 경로
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {learningPaths.map((path) => {
            const Icon = path.id === 1 ? BookOpen : path.id === 2 ? TrendingUp : Award;
            return (
              <div
                key={path.id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${path.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">진행률</div>
                    <div className="text-lg font-bold">{path.progress}%</div>
                  </div>
                </div>
                
                <h5 className="text-lg font-bold mb-2">{path.name}</h5>
                <p className="text-sm text-gray-400 mb-4">{path.description}</p>
                
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>{path.courses}개 코스</span>
                  <span>{path.duration}</span>
                </div>
                
                {/* 진행률 바 */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>학습 진행</span>
                    <span>{path.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${path.color}`}
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>
                
                <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition flex items-center justify-center space-x-2">
                  <span>계속 학습하기</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 콘텐츠 그리드 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-bold">인기 콘텐츠</h4>
          <div className="text-sm text-gray-400">
            총 {filteredContent.length}개 콘텐츠
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content) => {
            const Icon = contentTypeIcons[content.type as keyof typeof contentTypeIcons];
            return (
              <div
                key={content.id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition group"
              >
                {/* 콘텐츠 헤더 */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${
                      content.featured
                        ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30'
                        : 'bg-gray-800'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        content.featured ? 'text-yellow-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex items-center space-x-2">
                      {content.completed && (
                        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">
                          완료
                        </span>
                      )}
                      {content.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </div>
                  
                  {/* 콘텐츠 정보 */}
                  <h5 className="text-lg font-bold mb-2 group-hover:text-green-400 transition">
                    {content.title}
                  </h5>
                  <p className="text-sm text-gray-400 mb-4">{content.description}</p>
                  
                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-xs px-2 py-0.5 rounded ${levelColors[content.level as keyof typeof levelColors]}`}>
                      {content.level}
                    </span>
                    {content.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* 통계 */}
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{content.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{content.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{content.students.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* 액션 버튼 */}
                <div className="px-6 pb-6 pt-0">
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center space-x-2">
                      {content.type === 'video' ? (
                        <>
                          <Play className="w-4 h-4" />
                          <span>재생</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4" />
                          <span>학습하기</span>
                        </>
                      )}
                    </button>
                    <button className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 통계 및 CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 학습 통계 */}
        <div className="lg:col-span-2 bg-gray-900/30 rounded-xl p-6">
          <h4 className="text-xl font-bold mb-4">학습 통계</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-green-400">1,247</div>
              <div className="text-sm text-gray-400">활성 학습자</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">86%</div>
              <div className="text-sm text-gray-400">완료율</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">4.8</div>
              <div className="text-sm text-gray-400">평균 평점</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">28</div>
              <div className="text-sm text-gray-400">총 콘텐츠</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>주간 학습 시간</span>
              <span>3,248시간</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full w-3/4" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-xl font-bold mb-3">프리미엄 멤버십</h4>
          <p className="text-gray-400 mb-4">
            모든 콘텐츠 무제한 접근 + 전문가 상담
          </p>
          <div className="mb-4">
            <div className="text-3xl font-bold">월 ₩29,900</div>
            <div className="text-sm text-gray-400">연간 결제 시 40% 할인</div>
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-bold hover:opacity-90 transition">
            프리미엄 가입하기
          </button>
        </div>
      </div>
    </