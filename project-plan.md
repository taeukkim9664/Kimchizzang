# 김프(GIMP) 웹사이트 프로젝트 계획

## 프로젝트 개요
- **프로젝트명**: 김프(GIMP) 튜토리얼 & 커뮤니티 사이트
- **기술 스택**: HTML5, CSS3, JavaScript, Firebase
- **Firebase 프로젝트**: "kimchi"
- **참고 사이트**: https://theddari.com/, https://kimpga.com/

## 주요 기능
1. **튜토리얼 섹션**: 단계별 GIMP 사용법 가이드
2. **자료실**: 브러시, 텍스처, 플러그인 등 리소스 다운로드
3. **커뮤니티**: 사용자 간 질문/답변, 프로젝트 공유
4. **갤러리**: 사용자 작품 전시
5. **실시간 채팅**: Firebase 기반 실시간 커뮤니케이션

## 사이트 구조
```
/
├── index.html (메인 페이지)
├── tutorials/ (튜토리얼)
│   ├── basic/ (기초)
│   ├── intermediate/ (중급)
│   └── advanced/ (고급)
├── resources/ (자료실)
│   ├── brushes/ (브러시)
│   ├── textures/ (텍스처)
│   └── plugins/ (플러그인)
├── community/ (커뮤니티)
│   ├── forum/ (포럼)
│   ├── gallery/ (갤러리)
│   └── chat/ (실시간 채팅)
├── about/ (소개)
└── contact/ (연락처)
```

## Firebase 통합
1. **인증 (Authentication)**: 이메일/비밀번호, 구글 로그인
2. **Firestore**: 튜토리얼 데이터, 게시글, 댓글 저장
3. **Storage**: 이미지, 파일 업로드
4. **Hosting**: 정적 웹사이트 호스팅
5. **Realtime Database**: 실시간 채팅

## 디자인 요구사항
- 모던하고 깔끔한 디자인
- 반응형 웹 디자인 (모바일, 태블릿, 데스크톱)
- 다크/라이트 모드 지원
- 직관적인 네비게이션
- 빠른 로딩 속도

## 개발 단계
1. **1단계**: 프로젝트 구조 설계 및 Firebase 설정
2. **2단계**: 기본 HTML/CSS/JS 템플릿 개발
3. **3단계**: Firebase 인증 및 데이터베이스 연동
4. **4단계**: 튜토리얼 섹션 구현
5. **5단계**: 커뮤니티 기능 구현
6. **6단계**: 자료실 및 갤러리 구현
7. **7단계**: 테스트 및 배포

## 파일 구조
```
gimp-website/
├── public/ (정적 파일)
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
├── src/ (소스 코드)
│   ├── firebase/
│   ├── components/
│   └── utils/
├── firebase.json
└── README.md
```