/**
 * 김프(GIMP) 웹사이트 - 유틸리티 함수
 */

/**
 * 디바운스 함수 (성능 최적화)
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 스로틀 함수 (성능 최적화)
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 로컬 스토리지 유틸리티
 */
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('로컬 스토리지 저장 실패:', error);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('로컬 스토리지 읽기 실패:', error);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('로컬 스토리지 삭제 실패:', error);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('로컬 스토리지 초기화 실패:', error);
            return false;
        }
    }
};

/**
 * 세션 스토리지 유틸리티
 */
const session = {
    set: (key, value) => {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('세션 스토리지 저장 실패:', error);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('세션 스토리지 읽기 실패:', error);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('세션 스토리지 삭제 실패:', error);
            return false;
        }
    },
    
    clear: () => {
        try {
            sessionStorage.clear();
            return true;
        } catch (error) {
            console.error('세션 스토리지 초기화 실패:', error);
            return false;
        }
    }
};

/**
 * 쿠키 유틸리티
 */
const cookies = {
    set: (name, value, days = 7) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
    },
    
    get: (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    remove: (name) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
};

/**
 * 형식화된 날짜/시간
 */
const format = {
    date: (date, format = 'YYYY-MM-DD') => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    timeAgo: (date) => {
        const now = new Date();
        const past = new Date(date);
        const diff = now - past;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
        
        if (years > 0) return `${years}년 전`;
        if (months > 0) return `${months}개월 전`;
        if (days > 0) return `${days}일 전`;
        if (hours > 0) return `${hours}시간 전`;
        if (minutes > 0) return `${minutes}분 전`;
        return '방금 전';
    },
    
    fileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    number: (num) => {
        return new Intl.NumberFormat('ko-KR').format(num);
    },
    
    currency: (amount, currency = 'KRW') => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
};

/**
 * URL 파라미터 유틸리티
 */
const urlParams = {
    get: (param) => {
        const url = new URL(window.location.href);
        return url.searchParams.get(param);
    },
    
    getAll: () => {
        const url = new URL(window.location.href);
        const params = {};
        url.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    },
    
    set: (param, value) => {
        const url = new URL(window.location.href);
        url.searchParams.set(param, value);
        window.history.replaceState({}, '', url);
    },
    
    remove: (param) => {
        const url = new URL(window.location.href);
        url.searchParams.delete(param);
        window.history.replaceState({}, '', url);
    }
};

/**
 * 디바이스 감지
 */
const device = {
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    isTablet: () => {
        return /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent);
    },
    
    isDesktop: () => {
        return !device.isMobile() && !device.isTablet();
    },
    
    isIOS: () => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    },
    
    isAndroid: () => {
        return /Android/.test(navigator.userAgent);
    },
    
    isTouch: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

/**
 * 애니메이션 유틸리티
 */
const animate = {
    scrollTo: (element, duration = 500, offset = 0) => {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;
        
        const start = window.pageYOffset;
        const targetPosition = target.getBoundingClientRect().top + start - offset;
        const distance = targetPosition - start;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // 이징 함수 (easeInOutCubic)
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, start + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    },
    
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity.toString();
            
            if (progress < duration) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    },
    
    fadeOut: (element, duration = 300) => {
        let start = null;
        const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
        
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(initialOpacity - (progress / duration), 0);
            
            element.style.opacity = opacity.toString();
            
            if (progress < duration) {
                requestAnimationFrame(step);
            } else {
                element.style.display = 'none';
                element.style.opacity = initialOpacity.toString();
            }
        }
        
        requestAnimationFrame(step);
    }
};

/**
 * 폼 유효성 검사
 */
const validate = {
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    password: (password) => {
        // 최소 8자, 영문+숫자+특수문자
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(password);
    },
    
    phone: (phone) => {
        const regex = /^01[0-9]{8,9}$/;
        return regex.test(phone.replace(/[^0-9]/g, ''));
    },
    
    url: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    required: (value) => {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    minLength: (value, min) => {
        return value.length >= min;
    },
    
    maxLength: (value, max) => {
        return value.length <= max;
    },
    
    between: (value, min, max) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    }
};

/**
 * 이미지 로딩 유틸리티
 */
const imageLoader = {
    load: (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },
    
    lazyLoad: () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
};

/**
 * 클립보드 유틸리티
 */
const clipboard = {
    copy: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // 폴백 방법
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            } catch (error) {
                document.body.removeChild(textarea);
                return false;
            }
        }
    },
    
    read: async () => {
        try {
            return await navigator.clipboard.readText();
        } catch (error) {
            return null;
        }
    }
};

/**
 * 에러 핸들링
 */
const errorHandler = {
    log: (error, context = {}) => {
        console.error('에러 발생:', {
            error,
            context,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
        
        // 에러 보고 서비스로 전송 (예: Sentry)
        // reportErrorToService(error, context);
    },
    
    showUserFriendlyMessage: (error) => {
        let message = '알 수 없는 오류가 발생했습니다.';
        
        if (error.message) {
            message = error.message;
        }
        
        // 사용자 친화적인 메시지로 변환
        if (error.code === 'NETWORK_ERROR') {
            message = '네트워크 연결이 불안정합니다. 인터넷 연결을 확인해주세요.';
        } else if (error.code === 'TIMEOUT') {
            message = '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.code === 'SERVER_ERROR') {
            message = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
        
        // 토스트나 알림으로 표시
        if (typeof showToast === 'function') {
            showToast('error', '오류 발생', message);
        } else {
            alert(message);
        }
    }
};

/**
 * 성능 측정
 */
const performance = {
    mark: (name) => {
        if (window.performance && window.performance.mark) {
            window.performance.mark(name);
        }
    },
    
    measure: (name, startMark, endMark) => {
        if (window.performance && window.performance.measure) {
            window.performance.measure(name, startMark, endMark);
        }
    },
    
    getEntries: () => {
        return window.performance ? window.performance.getEntries() : [];
    },
    
    clear: () => {
        if (window.performance && window.performance.clearMarks) {
            window.performance.clearMarks();
            window.performance.clearMeasures();
        }
    }
};

// 전역으로 노출
window.utils = {
    debounce,
    throttle,
    storage,
    session,
    cookies,
    format,
    urlParams,
    device,
    animate,
    validate,
    imageLoader,
    clipboard,
    errorHandler,
    performance
};

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 지연 로딩 이미지 초기화
    imageLoader.lazyLoad();
    
    // 성능 측정 시작
    performance.mark('page-loaded');
    
    // 디바이스 클래스 추가
    const html = document.documentElement;
    if (device.isMobile()) html.classList.add('is-mobile');
    if (device.isTablet()) html.classList.add('is-tablet');
    if (device.isDesktop()) html.classList.add('is-desktop');
    if (device.isTouch()) html.classList.add('is-touch');
});