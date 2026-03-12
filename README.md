# 김프(GIMP) 웹사이트

김프(GIMP - GNU Image Manipulation Program)의 공식 웹사이트 프로젝트입니다.

## 🎯 프로젝트 개요

김프는 무료 오픈소스 이미지 편집 소프트웨어로, 포토샵의 강력한 대안입니다. 이 웹사이트는 김프의 기능을 소개하고 사용자들에게 다운로드, 문서, 커뮤니티 지원을 제공합니다.

## 🚀 기능

### ✅ 완료된 기능
- **반응형 디자인** - 모바일, 태블릿, 데스크톱 완벽 지원
- **다크 모드** - 실시간 테마 전환
- **서비스 워커** - 오프라인 지원 및 캐싱
- **성능 최적화** - Critical CSS, 지연 로딩
- **접근성** - WCAG 2.1 준수

### 📱 페이지
1. **홈페이지** (`/`) - 메인 소개 및 다운로드
2. **기능 페이지** (`/features.html`) - 상세 기능 소개
3. **문서 페이지** (`/docs.html`) - 튜토리얼 및 가이드
4. **커뮤니티 페이지** (`/community.html`) - 커뮤니티 채널 및 기여 방법
5. **지원 페이지** (`/support.html`) - FAQ 및 지원 채널

## 🛠 기술 스택

- **HTML5** - 시맨틱 마크업
- **CSS3** - CSS 변수, Flexbox, Grid
- **JavaScript (ES6+)** - 모듈화된 코드
- **Service Worker** - 오프라인 지원
- **GitHub Pages** - 자동 배포

## 📁 프로젝트 구조

```
gimp-website/
├── public/                    # 정적 파일
│   ├── index.html            # 메인 페이지
│   ├── features.html         # 기능 페이지
│   ├── docs.html             # 문서 페이지
│   ├── community.html        # 커뮤니티 페이지
│   ├── support.html          # 지원 페이지
│   ├── design-system.css     # 디자인 시스템
│   ├── styles/               # 스타일 파일
│   │   ├── main.css          # 메인 스타일
│   │   └── critical.css      # Critical CSS
│   ├── src/                  # 소스 코드
│   │   └── js/
│   │       └── main.js       # 메인 JavaScript
│   ├── assets/               # 이미지 및 아이콘
│   └── sw.js                 # 서비스 워커
├── .gitignore               # Git 무시 파일
└── README.md               # 프로젝트 설명
```

## 🚀 로컬 실행

```bash
# Python으로 간단한 서버 실행
python3 -m http.server 8080

# 또는 Node.js로 실행
npx serve public
```

그 후 브라우저에서 `http://localhost:8080` 접속

## 🔧 개발 가이드

### CSS 개발
- CSS 변수를 사용한 디자인 시스템
- BEM 방법론 적용
- 모바일 퍼스트 접근

### JavaScript 개발
- ES6+ 모듈 사용
- 이벤트 위임 활용
- 에러 핸들링 구현

### 성능 최적화
- 이미지 지연 로딩
- Critical CSS 인라인
- 서비스 워커 캐싱

## 🌐 배포

이 프로젝트는 GitHub Pages를 통해 자동 배포됩니다. `main` 브랜치에 푸시하면 자동으로 배포됩니다.

## 🤝 기여하기

김프 웹사이트에 기여하고 싶으시다면:

1. 이슈를 생성하거나 기존 이슈에 할당
2. 포크 후 기능 브랜치 생성
3. 변경사항 커밋 및 푸시
4. 풀 리퀘스트 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 LICENSE 파일을 참조하세요.

## 🙏 감사의 말

- 김프 개발팀 및 커뮤니티
- 모든 기여자들
- 오픈소스 생태계

---

**김프(GIMP) - 무료로 시작하는 프로페셔널 이미지 편집** 🎨