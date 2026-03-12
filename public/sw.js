// 김프(GIMP) 웹사이트 서비스 워커
const CACHE_NAME = 'gimp-website-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/features.html',
  '/docs.html',
  '/community.html',
  '/support.html',
  '/design-system.css',
  '/styles/main.css',
  '/src/js/main.js',
  '/assets/favicon.ico'
];

// 설치 이벤트
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('캐시 오픈 완료');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 활성화 이벤트
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// fetch 이벤트
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시에서 반환
        if (response) {
          return response;
        }
        
        // 네트워크 요청
        return fetch(event.request).then(response => {
          // 응답이 유효한지 확인
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 응답 복제
          const responseToCache = response.clone();
          
          // 캐시에 저장
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      }).catch(() => {
        // 오프라인일 때 폴백 페이지
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

// 메시지 이벤트 (업데이트 알림)
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});