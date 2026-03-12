// 김치프리미엄 웹사이트 메인 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 다크모드 토글
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');
    
    // 현재 테마 확인
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton(currentTheme);
    
    // 테마 토글 이벤트
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
        
        // TradingView 위젯 테마 업데이트 (있는 경우)
        updateTradingViewTheme(newTheme);
    });
    
    function updateThemeButton(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = '라이트모드';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = '다크모드';
        }
    }
    
    function updateTradingViewTheme(theme) {
        // TradingView 위젯이 있으면 테마 업데이트
        if (typeof TradingView !== 'undefined') {
            // 페이지 리로드 없이 테마 변경을 위해 위젯 재생성
            // 실제 구현에서는 TradingView 위젯 API를 사용해야 함
            console.log('TradingView 테마 변경 필요:', theme);
        }
    }
    
    // 시간대 버튼 기능
    const timeframeButtons = document.querySelectorAll('.timeframe-btn');
    timeframeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 모든 버튼에서 active 클래스 제거
            timeframeButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭한 버튼에 active 클래스 추가
            this.classList.add('active');
            
            const timeframe = this.getAttribute('data-timeframe');
            updateChartTimeframe(timeframe);
        });
    });
    
    function updateChartTimeframe(timeframe) {
        // TradingView 차트 시간대 업데이트
        // 실제 구현에서는 TradingView 위젯 API를 사용해야 함
        console.log('차트 시간대 변경:', timeframe);
        
        // 현재 김프 값 업데이트 (시뮬레이션)
        updateKimpValue(timeframe);
    }
    
    // 김프 값 시뮬레이션 업데이트
    function updateKimpValue(timeframe) {
        const currentKimp = document.getElementById('currentKimp');
        const priceChange = document.getElementById('priceChange');
        
        // 각 시간대별 시뮬레이션 데이터
        const kimpData = {
            '1D': { value: '12.5%', change: '+1.2%', type: 'positive' },
            '1W': { value: '11.8%', change: '-0.3%', type: 'negative' },
            '1M': { value: '10.5%', change: '+2.1%', type: 'positive' },
            '3M': { value: '9.2%', change: '+3.5%', type: 'positive' },
            '1Y': { value: '8.7%', change: '+4.2%', type: 'positive' }
        };
        
        const data = kimpData[timeframe] || kimpData['1D'];
        currentKimp.textContent = data.value;
        priceChange.textContent = data.change;
        priceChange.className = `price-change ${data.type}`;
    }
    
    // 네비게이션 스크롤
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 모든 링크에서 active 클래스 제거
                navLinks.forEach(l => l.classList.remove('active'));
                // 클릭한 링크에 active 클래스 추가
                this.classList.add('active');
                
                // 스크롤 이동
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 현재 보이는 섹션에 따라 네비게이션 업데이트
    function updateActiveNav() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // 거래소 데이터 시뮬레이션 업데이트
    function updateExchangeData() {
        const exchangeCards = document.querySelectorAll('.exchange-card');
        const basePrice = 86500000; // 바이낸스 기준 가격
        
        // 각 거래소별 김프 시뮬레이션
        const exchangeData = [
            { name: '업비트', kimp: 13.2, volume: 1.2 },
            { name: '빗썸', kimp: 12.8, volume: 0.9 },
            { name: '코인원', kimp: 12.5, volume: 0.6 },
            { name: '바이낸스', kimp: 0, volume: 15.3 }
        ];
        
        exchangeCards.forEach((card, index) => {
            const data = exchangeData[index];
            const priceElement = card.querySelector('.price');
            const kimpElement = card.querySelector('.exchange-kimp');
            const volumeElement = card.querySelector('.volume');
            
            if (data.name === '바이낸스') {
                priceElement.textContent = `₩${basePrice.toLocaleString()}`;
                kimpElement.textContent = '기준';
                kimpElement.className = 'exchange-kimp neutral';
            } else {
                const price = Math.round(basePrice * (1 + data.kimp / 100));
                priceElement.textContent = `₩${price.toLocaleString()}`;
                kimpElement.textContent = `+${data.kimp}%`;
                kimpElement.className = 'exchange-kimp positive';
            }
            
            volumeElement.textContent = `24h 볼륨: ₩${data.volume}조`;
        });
    }
    
    // 초기화
    updateKimpValue('1D');
    updateExchangeData();
    
    // 실시간 업데이트 시뮬레이션 (5초마다)
    setInterval(() => {
        // 현재 김프 값 약간 변경
        const currentKimp = document.getElementById('currentKimp');
        const currentValue = parseFloat(currentKimp.textContent);
        const change = (Math.random() - 0.5) * 0.2; // -0.1% ~ +0.1%
        const newValue = Math.max(10, Math.min(15, currentValue + change));
        
        currentKimp.textContent = `${newValue.toFixed(1)}%`;
        
        // 가격 변화 업데이트
        const priceChange = document.getElementById('priceChange');
        const changeType = change >= 0 ? 'positive' : 'negative';
        const changeText = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        
        priceChange.textContent = changeText;
        priceChange.className = `price-change ${changeType}`;
    }, 5000);
    
    // 채팅 메시지 시뮬레이션
    const chatMessages = [
        { user: '김프매니아', message: '오늘 김프 13% 돌파했네요!' },
        { user: '트레이더K', message: '주말이라서 더 올라갈 것 같아요' },
        { user: '코인초보', message: '김프가 높을 때 매수하는 게 좋을까요?' },
        { user: '베테랑', message: '역사적 데이터를 보면 15% 이상도 나왔어요' },
        { user: '분석가', message: '거래소별 차이를 잘 비교해야 합니다' }
    ];
    
    let currentChatIndex = 0;
    
    function updateChat() {
        const chatPreview = document.querySelector('.chat-preview');
        if (!chatPreview) return;
        
        // 메시지 추가
        const message = chatMessages[currentChatIndex];
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `
            <span class="user">${message.user}:</span>
            <span class="message">${message.message}</span>
        `;
        
        chatPreview.appendChild(messageElement);
        
        // 3개 이상이면 가장 오래된 메시지 제거
        if (chatPreview.children.length > 3) {
            chatPreview.removeChild(chatPreview.firstChild);
        }
        
        // 다음 메시지 인덱스
        currentChatIndex = (currentChatIndex + 1) % chatMessages.length;
    }
    
    // 10초마다 채팅 업데이트
    setInterval(updateChat, 10000);
    
    // 초기 채팅 메시지
    setTimeout(updateChat, 2000);
    setTimeout(updateChat, 4000);
    
    // 페이지 로드 완료 메시지
    console.log('김치프리미엄 웹사이트 로드 완료');
    console.log('참고 사이트: theddari.com, kimpga.com');
    console.log('트레이딩뷰 위젯 사용 중');
});