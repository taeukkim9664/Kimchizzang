/**
 * 김프(GIMP) 웹사이트 - Firebase 인증 모듈
 * 프로젝트 "kimchi"와 연동
 */

// Firebase 구성 (실제 구성으로 대체 필요)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "kimchi-YOUR_PROJECT.firebaseapp.com",
    projectId: "kimchi-YOUR_PROJECT",
    storageBucket: "kimchi-YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Firebase 초기화
let firebaseApp;
let auth;
let googleProvider;
let githubProvider;

// 인증 상태 관리
let currentUser = null;
let authStateListeners = [];

/**
 * Firebase 초기화
 */
function initializeFirebase() {
    try {
        // Firebase가 이미 로드되었는지 확인
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK가 로드되지 않았습니다.');
            return false;
        }
        
        // Firebase 앱 초기화
        firebaseApp = firebase.initializeApp(firebaseConfig);
        auth = firebaseApp.auth();
        
        // 인증 제공자 설정
        googleProvider = new firebase.auth.GoogleAuthProvider();
        githubProvider = new firebase.auth.GithubAuthProvider();
        
        // 인증 상태 리스너 설정
        setupAuthStateListener();
        
        console.log('Firebase 초기화 완료');
        return true;
    } catch (error) {
        console.error('Firebase 초기화 실패:', error);
        return false;
    }
}

/**
 * 인증 상태 리스너 설정
 */
function setupAuthStateListener() {
    auth.onAuthStateChanged((user) => {
        currentUser = user;
        
        // 모든 리스너에 알림
        authStateListeners.forEach(listener => {
            try {
                listener(user);
            } catch (error) {
                console.error('인증 상태 리스너 오류:', error);
            }
        });
        
        // UI 업데이트
        updateAuthUI(user);
    });
}

/**
 * 인증 상태 리스너 등록
 */
function onAuthStateChanged(callback) {
    authStateListeners.push(callback);
    
    // 현재 상태 즉시 호출
    if (currentUser !== undefined) {
        callback(currentUser);
    }
    
    // 제거 함수 반환
    return () => {
        const index = authStateListeners.indexOf(callback);
        if (index > -1) {
            authStateListeners.splice(index, 1);
        }
    };
}

/**
 * UI 업데이트
 */
function updateAuthUI(user) {
    const loginBtn = document.querySelector('[onclick="showLoginModal()"]');
    const profileMenu = document.getElementById('profile-menu');
    
    if (user) {
        // 로그인 상태
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        
        // 프로필 메뉴 표시
        if (!profileMenu) {
            createProfileMenu(user);
        } else {
            updateProfileMenu(user);
        }
    } else {
        // 로그아웃 상태
        if (loginBtn) {
            loginBtn.style.display = 'inline-flex';
        }
        
        // 프로필 메뉴 제거
        if (profileMenu) {
            profileMenu.remove();
        }
    }
}

/**
 * 프로필 메뉴 생성
 */
function createProfileMenu(user) {
    const navbarContainer = document.querySelector('.navbar-container .flex.items-center.gap-4');
    if (!navbarContainer) return;
    
    const profileMenuHTML = `
        <div class="profile-menu" id="profile-menu">
            <button class="profile-menu-trigger" onclick="toggleProfileMenu()">
                <div class="user-avatar">
                    ${user.photoURL ? 
                        `<img src="${user.photoURL}" alt="${user.displayName || '사용자'}">` : 
                        `<span>${getInitials(user.displayName || user.email)}</span>`
                    }
                </div>
                <i class="fas fa-chevron-down text-sm text-tertiary"></i>
            </button>
            <div class="profile-menu-dropdown hidden" id="profile-dropdown">
                <div class="profile-menu-header">
                    <div class="user-avatar">
                        ${user.photoURL ? 
                            `<img src="${user.photoURL}" alt="${user.displayName || '사용자'}">` : 
                            `<span>${getInitials(user.displayName || user.email)}</span>`
                        }
                    </div>
                    <div class="profile-menu-user">
                        <div class="profile-menu-name">${user.displayName || '사용자'}</div>
                        <div class="profile-menu-email">${user.email || ''}</div>
                    </div>
                </div>
                <div class="profile-menu-items">
                    <a href="/profile" class="profile-menu-item">
                        <i class="fas fa-user"></i>
                        <span>프로필</span>
                    </a>
                    <a href="/settings" class="profile-menu-item">
                        <i class="fas fa-cog"></i>
                        <span>설정</span>
                    </a>
                    <a href="/my-downloads" class="profile-menu-item">
                        <i class="fas fa-download"></i>
                        <span>내 다운로드</span>
                    </a>
                    <div class="profile-menu-divider"></div>
                    <button class="profile-menu-item" onclick="signOut()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>로그아웃</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 다크 모드 토글 뒤에 삽입
    const themeToggle = navbarContainer.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.insertAdjacentHTML('afterend', profileMenuHTML);
    } else {
        navbarContainer.insertAdjacentHTML('beforeend', profileMenuHTML);
    }
}

/**
 * 프로필 메뉴 업데이트
 */
function updateProfileMenu(user) {
    const profileMenu = document.getElementById('profile-menu');
    if (!profileMenu) return;
    
    const avatar = profileMenu.querySelector('.user-avatar');
    const name = profileMenu.querySelector('.profile-menu-name');
    const email = profileMenu.querySelector('.profile-menu-email');
    
    if (avatar) {
        if (user.photoURL) {
            avatar.innerHTML = `<img src="${user.photoURL}" alt="${user.displayName || '사용자'}">`;
        } else {
            avatar.innerHTML = `<span>${getInitials(user.displayName || user.email)}</span>`;
        }
    }
    
    if (name) {
        name.textContent = user.displayName || '사용자';
    }
    
    if (email) {
        email.textContent = user.email || '';
    }
}

/**
 * 이름 이니셜 추출
 */
function getInitials(name) {
    if (!name) return 'U';
    
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

/**
 * 프로필 메뉴 토글
 */
function toggleProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
        
        // 다른 곳 클릭 시 닫기
        if (!dropdown.classList.contains('hidden')) {
            setTimeout(() => {
                document.addEventListener('click', closeProfileMenuOnClick);
            }, 0);
        } else {
            document.removeEventListener('click', closeProfileMenuOnClick);
        }
    }
}

/**
 * 프로필 메뉴 닫기
 */
function closeProfileMenuOnClick(event) {
    const profileMenu = document.getElementById('profile-menu');
    const dropdown = document.getElementById('profile-dropdown');
    
    if (profileMenu && dropdown && !profileMenu.contains(event.target)) {
        dropdown.classList.add('hidden');
        document.removeEventListener('click', closeProfileMenuOnClick);
    }
}

/**
 * Google 로그인
 */
async function signInWithGoogle() {
    try {
        if (!auth) {
            throw new Error('Firebase가 초기화되지 않았습니다.');
        }
        
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        
        // 성공 토스트 표시
        showToast('success', '로그인 성공', `${user.displayName}님, 환영합니다!`);
        
        // 모달 닫기
        hideLoginModal();
        
        return user;
    } catch (error) {
        console.error('Google 로그인 실패:', error);
        
        let message = '로그인 중 오류가 발생했습니다.';
        if (error.code === 'auth/popup-blocked') {
            message = '팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.';
        } else if (error.code === 'auth/cancelled-popup-request') {
            message = '로그인이 취소되었습니다.';
        } else if (error.code === 'auth/popup-closed-by-user') {
            message = '로그인 창이 닫혔습니다.';
        }
        
        showToast('error', '로그인 실패', message);
        throw error;
    }
}

/**
 * GitHub 로그인
 */
async function signInWithGitHub() {
    try {
        if (!auth) {
            throw new Error('Firebase가 초기화되지 않았습니다.');
        }
        
        const result = await auth.signInWithPopup(githubProvider);
        const user = result.user;
        
        // 성공 토스트 표시
        showToast('success', '로그인 성공', `${user.displayName}님, 환영합니다!`);
        
        // 모달 닫기
        hideLoginModal();
        
        return user;
    } catch (error) {
        console.error('GitHub 로그인 실패:', error);
        
        let message = '로그인 중 오류가 발생했습니다.';
        if (error.code === 'auth/popup-blocked') {
            message = '팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.';
        } else if (error.code === 'auth/cancelled-popup-request') {
            message = '로그인이 취소되었습니다.';
        } else if (error.code === 'auth/popup-closed-by-user') {
            message = '로그인 창이 닫혔습니다.';
        }
        
        showToast('error', '로그인 실패', message);
        throw error;
    }
}

/**
 * 이메일/비밀번호 로그인
 */
async function signInWithEmail(email, password) {
    try {
        if (!auth) {
            throw new Error('Firebase가 초기화되지 않았습니다.');
        }
        
        const result = await auth.signInWithEmailAndPassword(email, password);
        const user = result.user;
        
        // 성공 토스트 표시
        showToast('success', '로그인 성공', `${user.email}님, 환영합니다!`);
        
        // 모달 닫기
        hideLoginModal();
        
        return user;
    } catch (error) {
        console.error('이메일 로그인 실패:', error);
        
        let message = '로그인 중 오류가 발생했습니다.';
        if (error.code === 'auth/user-not-found') {
            message = '존재하지 않는 사용자입니다.';
        } else if (error.code === 'auth/wrong-password') {
            message = '비밀번호가 올바르지 않습니다.';
        } else if (error.code === 'auth/invalid-email') {
            message = '유효하지 않은 이메일 형식입니다.';
        } else if (error.code === 'auth/user-disabled') {
            message = '사용이 중지된 계정입니다.';
        }
        
        showToast('error', '로그인 실패', message);
        throw error;
    }
}

/**
 * 회원가입
 */
async function signUpWithEmail(email, password, displayName) {
    try {
        if (!auth) {
            throw new Error('Firebase가 초기화되지 않았습니다.');
        }
        
        const result = await auth.createUserWithEmailAndPassword(email, password);
        const user = result.user;
        
        // 사용자 프로필 업데이트
        if (displayName) {
            await user.updateProfile({
                displayName: displayName
            });
        }
        
        // 성공 토스트 표시
        showToast('success', '회원가입 성공', `${displayName || email}님, 가입을 환영합니다!`);
        
        return user;
    } catch (error) {
        console.error('회원가입 실패:', error);
        
        let message = '회원가입 중 오류가 발생했습니다.';
        if (error.code === 'auth/email-already-in-use') {
            message = '이미 사용 중인 이메일입니다.';
        } else if (error.code === 'auth/invalid-email') {
            message = '유효하지 않은 이메일 형식입니다.';
        } else if (error.code === 'auth/weak-password') {
            message = '비밀번호가 너무 약합니다. 6자 이상 입력해주세요.';
        } else if (error.code === 'auth/operation-not-allowed') {
            message = '이메일/비밀번호 회원가입이 비활성화되어 있습니다.';
        }
        
        showToast('error', '회원가입 실패', message);
        throw error;
    }
}

/**
 * 로그아웃
 */
async function signOut() {
    try {
        if (!auth) {
            throw new Error('Firebase가 초기화되지 않았습니다.');
        }
        
        await auth.signOut();
        
        // 성공 토스트 표시
        showToast('success', '로그아웃', '성공적으로 로그아웃되었습니다.');
        
        // 프로필 메뉴 닫기
        const dropdown = document.getElementById('profile-dropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    } catch (error) {
        console.error('로그아웃 실패:', error);
        showToast('error', '로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
        throw error;
    }
}

/**
 * 현재 사용자 정보 가져오기
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * 인증 상태 확인
 */
function isAuthenticated() {
    return !!currentUser;
}

/**
 * 토스트 알림 표시
 */
function showToast(type, title, message) {
    // 토스트 컨테이너 확인
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // 토스트 생성
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${getToastIcon(type)}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 컨테이너에 추가
    container.appendChild(toast);
    
    // 5초 후 자동 제거
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

/**
 * 토스트 아이콘 가져오기
 */
function getToastIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

/**
 * 모달 표시/숨김 함수 (전역에서 접근 가능하도록)
 */
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function hideLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// DOM 로드 시 Firebase 초기화
document.addEventListener('DOMContentLoaded', () => {
    // Firebase SDK 로드 확인
    if (typeof firebase !== 'undefined') {
        initializeFirebase();
    } else {
        console.warn('Firebase SDK가 로드되지 않았습니다. 인증 기능을 사용할 수 없습니다.');
    }
    
    // 이메일 로그인 폼 이벤트 리스너
    const emailForm = document.getElementById('email-auth-form');
    if (emailForm) {
        emailForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                showToast('error', '입력 오류', '이메일과 비밀번호를 입력해주세요.');
                return;
            }
            
            try {
                await signInWithEmail(email, password);
            } catch (error) {
                // 오류는 이미 signInWithEmail에서 처리됨
            }
        });
    }
});

// 전역 함수로 노출
window.signInWithGoogle = signInWithGoogle;
window.signInWithGitHub = signInWithGitHub;
window.signInWithEmail = () => {
    const emailForm = document.getElementById('email-auth-form');
    if (emailForm) {
        emailForm.classList.remove('hidden');
    }
};
window.signOut = signOut;
window.toggleProfileMenu = toggleProfileMenu;
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.showLoginModal = showLoginModal;
window.hideLoginModal = hideLoginModal;
