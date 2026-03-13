'use client';

import { useState } from 'react';
import { Menu, X, Bell, User, Search, BarChart3 } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navItems = [
    { name: '김치프리미엄', href: '#', icon: <BarChart3 className="w-4 h-4" /> },
    { name: '거래소 데이터', href: '#' },
    { name: '교육 콘텐츠', href: '#' },
    { name: '커뮤니티', href: '#' },
    { name: '프리미엄', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">김</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                김치짱
              </h1>
              <p className="text-xs text-gray-400">암호화폐 투자 플랫폼</p>
            </div>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-1"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          {/* 검색 및 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {/* 검색 */}
            <div className="hidden md:flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="코인 또는 거래소 검색..."
                className="bg-transparent border-none outline-none text-sm text-white ml-2 w-48"
              />
            </div>

            {/* 알림 */}
            <button className="relative p-2 hover:bg-gray-800 rounded-lg transition">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* 사용자 메뉴 */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">대표님</p>
                  <p className="text-xs text-gray-400">VIP 멤버</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-medium hover:opacity-90 transition"
                >
                  로그인
                </button>
                <button className="hidden md:block px-4 py-2 border border-gray-600 rounded-lg font-medium hover:bg-gray-800 transition">
                  회원가입
                </button>
              </div>
            )}

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-green-400 transition-colors py-2 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.name}</span>
                </a>
              ))}
              
              {/* 모바일 검색 */}
              <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 mt-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="검색..."
                  className="bg-transparent border-none outline-none text-sm text-white ml-2 flex-1"
                />
              </div>

              {/* 모바일 로그인/회원가입 */}
              <div className="flex space-x-3 pt-2">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-medium">
                  로그인
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-600 rounded-lg font-medium">
                  회원가입
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 실시간 상태 바 */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 overflow-x-auto">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">BTC/KRW:</span>
                <span className="text-green-400 font-medium">₩98,500,000</span>
                <span className="text-red-400 text-xs">-1.2%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">김치프리미엄:</span>
                <span className="text-emerald-400 font-medium">+3.8%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">업비트 거래량:</span>
                <span className="text-white font-medium">₩2.1조</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">커뮤니티:</span>
                <span className="text-white font-medium">1,247명 온라인</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-xs">실시간 업데이트 중</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}