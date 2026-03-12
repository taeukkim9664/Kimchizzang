// 김치프리미엄 웹사이트 메인 JavaScript - 더따리 스타일

document.addEventListener('DOMContentLoaded', function() {
    // 상태 변수
    let marketData = [];
    let currentSort = { column: 'kimp', direction: 'desc' };
    let updateInterval = 1000; // 기본 1초
    let updateTimer = null;
    
    // DOM 요소
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');
    const currentKimp = document.getElementById('currentKimp');
    const priceChange = document.getElementById('priceChange');
    const domesticExchange = document.getElementById('domesticExchange');
    const foreignExchange = document.getElementById('foreignExchange');
    const updateIntervalSelect = document.getElementById('updateInterval');
    const coinSearch = document.getElementById('coinSearch');
    const dataTableBody = document.getElementById('dataTableBody');
    const lastUpdate = document.getElementById('lastUpdate');
    const sortableHeaders = document.querySelectorAll('.sortable');
    
    // 다크모드 설정
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
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
    
    // 거래소 선택 이벤트
    domesticExchange.addEventListener('change', updateData);
    foreignExchange.addEventListener('change', updateData);
    
    // 업데이트 주기 설정
    updateIntervalSelect.addEventListener('change', function() {
        updateInterval = parseInt(this.value);
        restartUpdateTimer();
    });
    
    // 코인 검색
    coinSearch.addEventListener('input', function() {
        filterTable(this.value.toLowerCase());
    });
    
    // 정렬 기능
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.getAttribute('data-sort');
            
            // 정렬 방향 토글
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'desc';
            }
            
            // 정렬 아이콘 업데이트
            sortableHeaders.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            
            this.classList.add(`sort-${currentSort.direction}`);
            
            // 데이터 정렬 및 테이블 업데이트
            sortData();
            updateTable();
        });
    });
    
    // 데이터 정렬 함수
    function sortData() {
        marketData.sort((a, b) => {
            let aValue = a[currentSort.column];
            let bValue = b[currentSort.column];
            
            // 숫자 데이터 처리
            if (['price', 'kimp', 'change', 'volume'].includes(currentSort.column)) {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            }
            
            // 문자열 데이터 처리
            if (currentSort.column === 'name') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (currentSort.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }
    
    // 테이블 필터링
    function filterTable(searchTerm) {
        const rows = dataTableBody.querySelectorAll('tr:not(.loading-row)');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = searchTerm === '' || text.includes(searchTerm) ? '' : 'none';
        });
    }
    
    // 업데이트 타이머 재시작
    function restartUpdateTimer() {
        if (updateTimer) {
            clearInterval(updateTimer);
        }
        updateTimer = setInterval(updateData, updateInterval);
    }
    
    // 데이터 업데이트 함수
    async function updateData() {
        try {
            // 업비트 API에서 마켓 데이터 가져오기
            const marketsResponse = await fetch('https://api.upbit.com/v1/market/all');
            const allMarkets = await marketsResponse.json();
            
            // KRW 마켓만 필터링
            const krwMarkets = allMarkets.filter(market => market.market.includes('KRW-'));
            
            if (krwMarkets.length === 0) {
                throw new Error('KRW 마켓 데이터를 찾을 수 없습니다.');
            }
            
            // 티커 데이터 가져오기
            const marketCodes = krwMarkets.slice(0, 50).map(m => m.market).join(',');
            const tickerResponse = await fetch(`https://api.upbit.com/v1/ticker?markets=${marketCodes}`);
            const tickers = await tickerResponse.json();
            
            // 데이터 처리
            processMarketData(tickers);
            
            // 마지막 업데이트 시간 표시
            const now = new Date();
            lastUpdate.textContent = `마지막 업데이트: ${now.toLocaleTimeString('ko-KR')}`;
            
        } catch (error) {
            console.error('데이터 업데이트 오류:', error);
            showError('데이터를 불러오는 중 오류가 발생했습니다.');
        }
    }
    
    // 마켓 데이터 처리
    function processMarketData(tickers) {
        marketData = tickers.map(ticker => {
            const changeRate = ((ticker.signed_change_rate || 0) * 100);
            const kimpValue = calculateKimp(ticker.trade_price); // 김프 계산 (시뮬레이션)
            
            return {
                name: ticker.market.replace('KRW-', ''),
                symbol: ticker.market,
                price: ticker.trade_price,
                kimp: kimpValue,
                change: changeRate,
                volume: ticker.acc_trade_price_24h
            };
        });
        
        // 김프 평균 계산 (상단 표시용)
        const avgKimp = marketData.reduce((sum, item) => sum + item.kimp, 0) / marketData.length;
        currentKimp.textContent = `${avgKimp.toFixed(2)}%`;
        
        // 김프 변화 계산 (시뮬레이션)
        const kimpChange = (Math.random() - 0.5) * 0.5;
        const changeType = kimpChange >= 0 ? 'positive' : 'negative';
        const changeText = kimpChange >= 0 ? `+${kimpChange.toFixed(2)}%` : `${kimpChange.toFixed(2)}%`;
        
        priceChange.textContent = changeText;
        priceChange.className = `price-change ${changeType}`;
        
        // 데이터 정렬 및 테이블 업데이트
        sortData();
        updateTable();
    }
    
    // 김프 계산 (시뮬레이션)
    function calculateKimp(price) {
        // 실제 김프 계산 로직 (시뮬레이션)
        // 실제 구현시에는 국내/해외 거래소 가격 비교 필요
        const basePrice = 1300; // USDT 기준 가격 (시뮬레이션)
        const kimp = ((price / basePrice - 1) * 100) + (Math.random() * 5 - 2.5);
        return Math.max(5, Math.min(20, kimp)); // 5%~20% 사이로 제한
    }
    
    // 테이블 업데이트
    function updateTable() {
        if (marketData.length === 0) {
            dataTableBody.innerHTML = `
                <tr class="loading-row">
                    <td colspan="5">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                            데이터를 불러오는 중...
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        
        marketData.forEach(item => {
            const changeClass = item.change >= 0 ? 'positive' : 'negative';
            const changeSign = item.change >= 0 ? '+' : '';
            
            html += `
                <tr>
                    <td>
                        <span class="coin-name">${item.name}</span>
                        <span class="coin-symbol">${item.symbol}</span>
                    </td>
                    <td>₩${item.price.toLocaleString()}</td>
                    <td class="${item.kimp >= 10 ? 'positive' : 'negative'}">${item.kimp.toFixed(2)}%</td>
                    <td class="${changeClass}">${changeSign}${item.change.toFixed(2)}%</td>
                    <td>₩${Math.round(item.volume / 1000000).toLocaleString()}백만</td>
                </tr>
            `;
        });
        
        dataTableBody.innerHTML = html;
    }
    
    // 에러 표시
    function showError(message) {
        dataTableBody.innerHTML = `
            <tr class="error-row">
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--negative-color);">
                    <i class="fas fa-exclamation-triangle"></i><br>
                    ${message}
                </td>
            </tr>
        `;
    }
    
    // 초기화
    updateData();
    restartUpdateTimer();
    
    // 페이지 언로드 시 타이머 정리
    window.addEventListener('beforeunload', function() {
        if (updateTimer) {
            clearInterval(updateTimer);
        }
    });
    
    console.log('김치프리미엄 웹사이트 로드 완료');
    console.log('더따리(theddari.com) 스타일 구현');
    console.log('업비트 API 연동 완료');
    console.log(`업데이트 주기: ${updateInterval}ms`);
});