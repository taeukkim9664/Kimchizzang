// Firebase 구성 파일
// 실제 Firebase 프로젝트 설정으로 대체해야 합니다

// Firebase 구성 객체 (예시 - 실제 프로젝트 설정으로 업데이트 필요)
const firebaseConfig = {
    apiKey: "AIzaSyEXAMPLE1234567890abcdefghijklmnopq",
    authDomain: "kimchi-project.firebaseapp.com",
    projectId: "kimchi-project",
    storageBucket: "kimchi-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef",
    measurementId: "G-EXAMPLE123"
};

// Firebase 초기화
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, getDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 초기화
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Google 인증 제공자
const googleProvider = new GoogleAuthProvider();

// 인증 상태 변경 감지
onAuthStateChanged(auth, (user) => {
    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        if (user) {
            // 로그인 상태
            authBtn.innerHTML = '<i class="fas fa-user"></i><span>마이페이지</span>';
            authBtn.onclick = () => {
                window.location.href = '#profile';
            };
        } else {
            // 로그아웃 상태
            authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>로그인</span>';
            authBtn.onclick = () => {
                showLoginModal();
            };
        }
    }
});

// 로그인 함수
async function loginWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('로그인 성공:', userCredential.user);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('로그인 실패:', error);
        return { success: false, error: error.message };
    }
}

// 구글 로그인 함수
async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('구글 로그인 성공:', result.user);
        return { success: true, user: result.user };
    } catch (error) {
        console.error('구글 로그인 실패:', error);
        return { success: false, error: error.message };
    }
}

// 회원가입 함수
async function signUpWithEmail(email, password, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 사용자 프로필 업데이트
        await updateProfile(userCredential.user, { displayName });
        
        // Firestore에 사용자 정보 저장
        await addDoc(collection(db, 'users'), {
            uid: userCredential.user.uid,
            email: email,
            displayName: displayName,
            createdAt: new Date().toISOString(),
            role: 'user'
        });
        
        console.log('회원가입 성공:', userCredential.user);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('회원가입 실패:', error);
        return { success: false, error: error.message };
    }
}

// 로그아웃 함수
async function logout() {
    try {
        await signOut(auth);
        console.log('로그아웃 성공');
        return { success: true };
    } catch (error) {
        console.error('로그아웃 실패:', error);
        return { success: false, error: error.message };
    }
}

// Firestore 데이터 읽기 함수
async function getTutorials(limitCount = 10) {
    try {
        const tutorialsRef = collection(db, 'tutorials');
        const q = query(tutorialsRef, orderBy('createdAt', 'desc'), limit(limitCount));
        const querySnapshot = await getDocs(q);
        
        const tutorials = [];
        querySnapshot.forEach((doc) => {
            tutorials.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: tutorials };
    } catch (error) {
        console.error('튜토리얼 데이터 읽기 실패:', error);
        return { success: false, error: error.message };
    }
}

// 파일 업로드 함수
async function uploadFile(file, path) {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return { success: true, url: downloadURL, path: path };
    } catch (error) {
        console.error('파일 업로드 실패:', error);
        return { success: false, error: error.message };
    }
}

// 로그인 모달 표시 함수
function showLoginModal() {
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3>로그인</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="login-form">
                        <div class="form-group">
                            <label for="email">이메일</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">비밀번호</label>
                            <input type="password" id="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary">로그인</button>
                    </form>
                    <div class="divider">또는</div>
                    <button id="google-login" class="btn btn-outline">
                        <i class="fab fa-google"></i>
                        Google로 로그인
                    </button>
                    <div class="modal-footer">
                        <p>계정이 없으신가요? <a href="#" id="show-signup">회원가입</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 모달 닫기 이벤트
    document.querySelector('.modal-close').addEventListener('click', () => {
        document.querySelector('.modal-overlay').remove();
    });
    
    document.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            document.querySelector('.modal-overlay').remove();
        }
    });
    
    // 로그인 폼 제출
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const result = await loginWithEmail(email, password);
        if (result.success) {
            document.querySelector('.modal-overlay').remove();
        } else {
            alert('로그인 실패: ' + result.error);
        }
    });
    
    // 구글 로그인
    document.getElementById('google-login').addEventListener('click', async () => {
        const result = await loginWithGoogle();
        if (result.success) {
            document.querySelector('.modal-overlay').remove();
        } else {
            alert('구글 로그인 실패: ' + result.error);
        }
    });
    
    // 회원가입 보기
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.modal-overlay').remove();
        showSignupModal();
    });
}

// 회원가입 모달 표시 함수
function showSignupModal() {
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3>회원가입</h3>
                    <button class="modal-close">&times;</button>
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
                            <input type="password" id="signup-password" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label for="signup-confirm">비밀번호 확인</label>
                            <input type="password" id="signup-confirm" required>
                        </div>
                        <button type="submit" class="btn btn-primary">회원가입</button>
                    </form>
                    <div class="modal-footer">
                        <p>이미 계정이 있으신가요? <a href="#" id="show-login">로그인</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 모달 닫기 이벤트
    document.querySelector('.modal-close').addEventListener('click', () => {
        document.querySelector('.modal-overlay').remove();
    });
    
    document.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            document.querySelector('.modal-overlay').remove();
        }
    });
    
    // 회원가입 폼 제출
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        
        if (password !== confirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        const result = await signUpWithEmail(email, password, name);
        if (result.success) {
            document.querySelector('.modal-overlay').remove();
            alert('회원가입이 완료되었습니다!');
        } else {
            alert('회원가입 실패: ' + result.error);
        }
    });
    
    // 로그인 보기
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.modal-overlay').remove();
        showLoginModal();
    });
}

// 모달 스타일 추가
const modalStyle = document.createElement('style');
modalStyle.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }
    
    .modal {
        background-color: var(--bg-color);
        border-radius: var(--radius-lg);
        padding: 2rem;
        width: 90%;
        max-width: 400px;
        box-shadow: var(--shadow-lg);
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
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-color);
        font-weight: 500;
    }
    
    .form-group input {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        background-color: var(--surface-color);
        color: var(--text-color);
        font-size: 1rem;
    }
    
    .divider {
        text-align: center;
        margin: 1.5rem 0;
        color: var(--text-secondary);
        position: relative;
    }
    
    .divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background-color: var(--border-color);
    }
    
    .divider span {
        background-color: var(--bg-color);
        padding: 0 1rem;
        position: relative;
    }
    
    .modal-footer {
        margin-top: 1.5rem;
        text-align: center;
        color: var(--text-secondary);
    }
`;

document.head.appendChild(modalStyle);

// Firebase 객체 내보내기
export { app, auth, db, storage, loginWithEmail, loginWithGoogle, signUpWithEmail, logout, getTutorials, uploadFile };