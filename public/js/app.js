// 김프(GIMP) 웹사이트 메인 애플리케이션

document.addEventListener('DOMContentLoaded', function() {
    console.log('김프 웹사이트 애플리케이션 로드됨');
    
    // 초기화 함수 실행
    initApp();
    
    // 라우팅 설정
    setupRouting();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 샘플 데이터 로드 (개발용)
    loadSampleData();
});

// 애플리케이션 초기화
function initApp() {
    console.log('애플리케이션 초기화 중...');
    
    // 현재 페이지 확인
    const currentPage = getCurrentPage();
    console.log('현재 페이지:', currentPage);
    
    // 페이지별 초기화
    switch(currentPage) {
        case 'home':
            initHomePage();
            break;
        case 'tutorials':
            initTutorialsPage();
            break;
        case 'resources':
            initResourcesPage();
            break;
        case 'community':
            initCommunityPage();
            break;
        case 'about':
            initAboutPage();
            break;
        default:
            initHomePage();
    }
    
    // 모바일 메뉴 토글 설정
    setupMobileMenu();
    
    // 다크 모드 설정 확인
    checkDarkMode();
}

// 현재 페이지 확인
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'index.html' || page === '') return 'home';
    if (page.includes('tutorials')) return 'tutorials';
    if (page.includes('resources')) return 'resources';
    if (page.includes('community')) return 'community';
    if (page.includes('about')) return 'about';
    
    return 'home';
}

// 라우팅 설정
function setupRouting() {
    // 내부 링크 클릭 시 페이지 전환
    document.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
    
    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener('popstate', function() {
        initApp();
    });
}

// 페이지 네비게이션
function navigateTo(page) {
    console.log('페이지 이동:', page);
    
    // 히스토리 상태 업데이트
    window.history.pushState({ page: page }, '', `/${page}.html`);
    
    // 페이지 내용 로드 및 표시
    loadPageContent(page);
    
    // 페이지 초기화
    initApp();
}

// 페이지 내용 로드
function loadPageContent(page) {
    // 실제 구현에서는 AJAX를 통해 페이지 내용을 로드
    // 현재는 정적 페이지이므로 페이지 이동만 처리
    console.log(`페이지 "${page}" 내용 로드`);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 검색 폼
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            const query = searchInput.value.trim();
            
            if (query) {
                performSearch(query);
            }
        });
    }
    
    // 다크 모드 토글
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // 로그인/로그아웃 버튼
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// 모바일 메뉴 설정
function setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // 메뉴 외부 클릭 시 닫기
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}

// 다크 모드 확인
function checkDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

// 다크 모드 토글
function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    
    localStorage.setItem('darkMode', isDarkMode);
    
    // 토글 버튼 아이콘 업데이트
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// 검색 수행
function performSearch(query) {
    console.log('검색 수행:', query);
    
    // 검색 결과 페이지로 이동 또는 모달 표시
    // 실제 구현에서는 Firebase/Firestore에서 검색
    alert(`"${query}" 검색 결과를 표시합니다.`);
    
    // 검색 기록 저장
    saveSearchHistory(query);
}

// 검색 기록 저장
function saveSearchHistory(query) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    // 중복 제거
    history = history.filter(item => item !== query);
    
    // 최신 순으로 추가
    history.unshift(query);
    
    // 최대 10개 저장
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

// 로그인 모달 표시
function showLoginModal() {
    // 간단한 로그인 모달 구현
    const modalHTML = `
        <div class="modal show" id="login-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">로그인</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-email">이메일</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">비밀번호</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <button type="submit" class="btn btn-primary">로그인</button>
                        <button type="button" class="btn btn-secondary" onclick="showSignupModal()">회원가입</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // 모달 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 폼 제출 이벤트
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Firebase 로그인 (개발용 가짜 로그인)
        handleLogin(email, password);
    });
}

// 회원가입 모달 표시
function showSignupModal() {
    closeModal();
    
    const modalHTML = `
        <div class="modal show" id="signup-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">회원가입</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="signup-form">
                        <div class="form-group">
                            <label for="signup-name">이름</label>
                            <input type="text" id="signup-name" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-email">이메일</label>
                            <input type="email" id="signup-email" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-password">비밀번호</label>
                            <input type="password" id="signup-password" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-password-confirm">비밀번호 확인</label>
                            <input type="password" id="signup-password-confirm" required>
                        </div>
                        <button type="submit" class="btn btn-primary">가입하기</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-password-confirm').value;
        
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        // Firebase 회원가입 (개발용 가짜 회원가입)
        handleSignup(name, email, password);
    });
}

// 모달 닫기
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

// 로그인 처리 (개발용)
function handleLogin(email, password) {
    console.log('로그인 시도:', email);
    
    // 개발용 가짜 로그인
    localStorage.setItem('user', JSON.stringify({
        email: email,
        name: email.split('@')[0],
        loggedIn: true
    }));
    
    closeModal();
    alert('로그인 성공!');
    
    // UI 업데이트
    updateAuthUI();
}

// 회원가입 처리 (개발용)
function handleSignup(name, email, password) {
    console.log('회원가입 시도:', name, email);
    
    // 개발용 가짜 회원가입
    localStorage.setItem('user', JSON.stringify({
        email: email,
        name: name,
        loggedIn: true
    }));
    
    closeModal();
    alert('회원가입 성공! 환영합니다, ' + name + '님!');
    
    // UI 업데이트
    updateAuthUI();
}

// 로그아웃 처리
function handleLogout() {
    localStorage.removeItem('user');
    alert('로그아웃되었습니다.');
    
    // UI 업데이트
    updateAuthUI();
}

// 인증 UI 업데이트
function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userEmail = document.getElementById('user-email');
    
    if (user && user.loggedIn) {
        // 로그인 상태
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userEmail) userEmail.textContent = user.email;
    } else {
        // 로그아웃 상태
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// 샘플 데이터 로드 (개발용)
function loadSampleData() {
    // 튜토리얼 데이터
    fetch('data/sample-tutorials.json')
        .then(response => response.json())
        .then(data => {
            console.log('튜토리얼 데이터 로드됨:', data.length, '개');
            window.tutorialsData = data;
            
            // 홈페이지에 튜토리얼 표시
            displayTutorialsOnHome(data.slice(0, 3));
        })
        .catch(error => console.error('튜토리얼 데이터 로드 실패:', error));
    
    // 자료 데이터
    fetch('data/sample-resources.json')
        .then(response => response.json())
        .then(data => {
            console.log('자료 데이터 로드됨:', data.length, '개');
            window.resourcesData = data;
            
            // 홈페이지에 자료 표시
            displayResourcesOnHome(data.slice(0, 3));
        })
        .catch(error => console.error('자료 데이터 로드 실패:', error));
}

// 홈페이지에 튜토리얼 표시
function displayTutorialsOnHome(tutorials) {
    const container = document.getElementById('featured-tutorials');
    if (!container) return;
    
    let html = '';
    tutorials.forEach(tutorial => {
        html += `
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <span class="badge badge-primary">${tutorial.category}</span>
                        <span class="badge badge-secondary">난이도: ${tutorial.difficulty}/5</span>
                    </div>
                    <div class="card-body">
                        <h4 class="card-title">${tutorial.title}</h4>
                        <p class="card-subtitle">${tutorial.description}</p>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${tutorial.difficulty * 20}%"></div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <small>${tutorial.estimatedTime} • ${tutorial.views} views</small>
                        <button class="btn btn-sm btn-primary" onclick="viewTutorial('${tutorial.id}')">보기</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 홈페이지에 자료 표시
function displayResourcesOnHome(resources) {
    const container = document.getElementById('featured-resources');
    if (!container) return;
    
    let html = '';
    resources.forEach(resource => {
        html += `
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <span class="badge badge-info">${resource.type}</span>
                        <span class="badge badge-success">${resource.downloads} 다운로드</span>
                    </div>
                    <div class="card-body">
                        <h4 class="card-title">${resource.name}</h4>
                        <p class="card-subtitle">${resource.description}</p>
                        <div class="rating">
                            ${getStarRating(resource.rating)}
                        </div>
                    </div>
                    <div class="card-footer">
                        <small>${resource.fileSize}</small>
                        <button class="btn btn-sm btn-primary" onclick="downloadResource('${resource.id}')">다운로드</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 별점 표시 생성
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<span class="star active">★</span>';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            stars += '<span class="star active">★</span>';
        } else {
            stars += '<span class="star">★</span>';
        }
    }
    return stars;
}

// 튜토리얼 보기
function viewTutorial(tutorialId) {
    alert(`튜토리얼 ${tutorialId} 보기`);
    // 실제 구현에서는 튜토리얼 상세 페이지로 이동
}

// 자료 다운로드
function downloadResource(resourceId) {
    alert(`자료 ${resourceId} 다운로드`);
    // 실제 구현에서는 다운로드 링크로 이동
}

// 페이지별 초기화 함수들
function initHomePage() {
    console.log('홈페이지 초기화');
    // 홈페이지 특화 초기화 코드
}

function initTutorialsPage() {
    console.log('튜토리얼 페이지 초기화');
    // 튜토리얼 페이지 특화 초기화 코드
}

function initResourcesPage() {
    console.log('자료 페이지 초기화');
    // 자료 페이지 특화 초기화 코드
}

function initCommunityPage() {
    console.log('커뮤니티 페이지 초기화');
    // 커뮤니티 페이지 특화 초기화 코드
}

function initAboutPage() {
    console.log('소개 페이지 초기화');
    // 소개 페이지 특화 초기화 코드
}

// 전역 함수들
window.navigateTo = navigateTo;
window.showLoginModal = showLoginModal;
window.showSignupModal = showSignupModal;
window.closeModal = closeModal;
window.toggleDarkMode = toggleDarkMode;
window.viewTutorial = viewTutorial;
window.downloadResource = downloadResource;