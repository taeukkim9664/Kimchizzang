// 김프(GIMP) 웹사이트 메인 JavaScript - Firebase 제거 버전

// DOM 요소
const loginBtn = document.getElementById('login-btn');
const themeToggle = document.getElementById('theme-toggle');
const downloadButtons = document.querySelectorAll('.download-card .btn');

// 테마 관리
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
}

// 테마 토글
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// 로그인 버튼 처리 (Firebase 없는 버전)
loginBtn.addEventListener('click', () => {
    showToast('로그인 기능은 준비 중입니다. 곧 업데이트될 예정입니다!', 'info');
});

// 토스트 메시지 표시
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 애니메이션
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 자동 제거
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// 다운로드 버튼 이벤트
downloadButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const os = e.target.closest('.download-card').querySelector('h3').textContent;
        showToast(`${os} 버전 다운로드가 시작됩니다.`, 'info');
        
        // 실제 다운로드 로직 (향후 구현)
        setTimeout(() => {
            showToast('다운로드가 완료되었습니다!', 'success');
        }, 2000);
    });
});

// 스크롤 애니메이션
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 관찰할 요소들
    document.querySelectorAll('.feature-card, .download-card').forEach(card => {
        observer.observe(card);
    });
}

// 모달 스타일 동적 추가
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            backdrop-filter: blur(5px);
        }
        
        .modal {
            background: var(--background-primary);
            border-radius: var(--radius-lg);
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: var(--shadow-xl);
            border: 1px solid var(--border-color);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0.5rem;
        }
        
        .modal-close:hover {
            color: var(--text-primary);
        }
        
        .login-options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .btn-google {
            background: #4285F4;
            color: white;
        }
        
        .btn-github {
            background: #333;
            color: white;
        }
        
        .toast {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            background: var(--background-secondary);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-lg);
            transform: translateY(100px);
            opacity: 0;
            transition: var(--transition-normal);
            z-index: 3000;
            max-width: 300px;
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast-success {
            border-left: 4px solid var(--success);
        }
        
        .toast-error {
            border-left: 4px solid var(--error);
        }
        
        .toast-info {
            border-left: 4px solid var(--info);
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }
    `;
    
    document.head.appendChild(style);
}

// 앱 초기화
function initApp() {
    initTheme();
    initScrollAnimations();
    addModalStyles();
    
    console.log('김프(GIMP) 웹사이트 초기화 완료! (Firebase 제거 버전)');
}

// DOM 로드 완료 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// 글로벌 에러 핸들링
window.addEventListener('error', (event) => {
    console.error('전역 에러:', event.error);
    showToast('알 수 없는 오류가 발생했습니다.', 'error');
});

// 오프라인/온라인 상태 감지
window.addEventListener('online', () => {
    showToast('인터넷 연결이 복구되었습니다.', 'success');
});

window.addEventListener('offline', () => {
    showToast('인터넷 연결이 끊겼습니다.', 'error');
});

// 서비스 워커 등록
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('서비스 워커 등록 성공:', registration.scope);
                    
                    // 업데이트 확인
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('새로운 서비스 워커 발견:', newWorker);
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showToast('새로운 업데이트가 있습니다. 페이지를 새로고침하세요.', 'info');
                            }
                        });
                    });
                })
                .catch(error => {
                    console.log('서비스 워커 등록 실패:', error);
                });
        });
    }
}

// 앱 초기화
function initApp() {
    initTheme();
    initScrollAnimations();
    addModalStyles();
    registerServiceWorker();
    
    console.log('김프(GIMP) 웹사이트 초기화 완료! (Firebase 제거 버전)');
}