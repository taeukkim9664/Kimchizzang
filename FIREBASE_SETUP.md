# Firebase 프로젝트 "kimchi" 설정 가이드

## 1. Firebase 콘솔에서 프로젝트 생성

1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속
2. "프로젝트 만들기" 클릭
3. 프로젝트 이름: `kimchi` (또는 원하는 이름)
4. Google 애널리틱스 사용 설정 (선택 사항)
5. 프로젝트 생성 완료

## 2. 웹 앱 추가

1. 생성된 프로젝트 대시보드에서 "웹 앱 추가" 클릭
2. 앱 닉네임: `gimp-website`
3. "Firebase 호스팅 설정" 체크
4. "앱 등록" 클릭

## 3. Firebase 구성 정보 복사

앱 등록 후 표시되는 구성 정보를 복사하여 `public/js/firebase-config.js` 파일의 `firebaseConfig` 객체를 업데이트:

```javascript
const firebaseConfig = {
    apiKey: "실제_API_KEY",
    authDomain: "실제_AUTH_DOMAIN",
    projectId: "실제_PROJECT_ID",
    storageBucket: "실제_STORAGE_BUCKET",
    messagingSenderId: "실제_MESSAGING_SENDER_ID",
    appId: "실제_APP_ID",
    measurementId: "실제_MEASUREMENT_ID" // Google 애널리틱스 사용 시
};
```

## 4. Firebase 서비스 활성화

### Authentication (인증)
1. 왼쪽 메뉴에서 "Authentication" 선택
2. "시작하기" 클릭
3. "로그인 방법" 탭에서 다음 제공자 활성화:
   - 이메일/비밀번호
   - Google

### Firestore Database
1. 왼쪽 메뉴에서 "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. "프로덕션 모드" 또는 "테스트 모드" 선택
4. 위치 선택 (asia-northeast3 권장 - 서울)

### Storage
1. 왼쪽 메뉴에서 "Storage" 선택
2. "시작하기" 클릭
3. 위치 선택 (Firestore와 동일한 위치 권장)

## 5. Firestore 컬렉션 구조

다음 컬렉션을 생성해야 합니다:

### users (사용자 정보)
```javascript
{
    uid: "사용자_UID",
    email: "사용자_이메일",
    displayName: "표시_이름",
    createdAt: "생성_날짜",
    role: "user" // 또는 "admin"
}
```

### tutorials (튜토리얼)
```javascript
{
    title: "튜토리얼_제목",
    description: "설명",
    category: "기초|중급|고급",
    content: "마크다운_내용",
    thumbnailUrl: "썸네일_URL",
    difficulty: 1-5,
    estimatedTime: "예상_소요시간",
    createdAt: "생성_날짜",
    updatedAt: "업데이트_날짜",
    authorId: "작성자_UID"
}
```

### resources (자료)
```javascript
{
    name: "자료_이름",
    type: "brush|texture|plugin|template",
    description: "설명",
    downloadUrl: "다운로드_URL",
    fileSize: "파일_크기",
    tags: ["태그1", "태그2"],
    downloads: 0,
    createdAt: "생성_날짜",
    authorId: "작성자_UID"
}
```

### forum_posts (커뮤니티 게시글)
```javascript
{
    title: "게시글_제목",
    content: "내용",
    category: "질문|팁|자유",
    authorId: "작성자_UID",
    authorName: "작성자_이름",
    views: 0,
    likes: [],
    comments: [],
    createdAt: "생성_날짜",
    updatedAt: "업데이트_날짜"
}
```

## 6. Firebase 호스팅 설정

### 로컬 테스트
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화
firebase init

# 호스팅 설정
firebase init hosting

# 로컬 서버 실행
firebase serve
```

### 배포
```bash
# 프로젝트 빌드
# (필요한 경우)

# 배포
firebase deploy --only hosting

# 또는 전체 배포
firebase deploy
```

## 7. 보안 규칙 설정

### Firestore 보안 규칙
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 문서: 본인만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 튜토리얼: 모두 읽기 가능, 인증된 사용자만 작성 가능
    match /tutorials/{tutorialId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 자료: 모두 읽기 가능, 관리자만 작성 가능
    match /resources/{resourceId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    // 커뮤니티 게시글: 모두 읽기 가능, 인증된 사용자만 작성 가능
    match /forum_posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage 보안 규칙
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 공개 자료: 모두 읽기 가능, 관리자만 업로드 가능
    match /resources/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    // 사용자 아바타: 본인만 업로드 가능, 모두 읽기 가능
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 8. 환경 변수 설정 (선택 사항)

`.env` 파일 생성:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

`firebase-config.js`에서 환경 변수 사용:
```javascript
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 9. 문제 해결

### 일반적인 문제
1. **CORS 오류**: Firebase 구성이 올바른지 확인
2. **인증 오류**: Authentication 제공자가 활성화되었는지 확인
3. **권한 오류**: Firestore/Security Rules 설정 확인
4. **호스팅 오류**: `firebase.json` 설정 확인

### 로그 확인
```bash
# Firebase 로그 보기
firebase functions:log
```

### 지원
- [Firebase 문서](https://firebase.google.com/docs)
- [Firebase 커뮤니티](https://firebase.google.com/community)
- [Stack Overflow - firebase 태그](https://stackoverflow.com/questions/tagged/firebase)