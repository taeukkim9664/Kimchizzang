// 김치짱 - 김치프리미엄 실시간 차트

document.addEventListener('DOMContentLoaded', function() {
    // 상태 변수
    let marketData = [];
    let currentSort = { column: 'kimp', direction: 'desc' };
    let updateInterval = 1000; // 기본 1초
    let updateTimer = null;
    let selectedDomestic = 'upbit';
    let selectedForeign = 'binance';
    
    // 거래소 API 엔드포인트
    const exchangeAPIs = {
        // 국내 거래소
        upbit: {
            name: '업비트',
            markets: 'https://api.upbit.com/v1/market/all',
            ticker: 'https://api.upbit.com/v1/ticker?markets='
        },
        bithumb: {
            name: '빗썸',
            markets: 'https://api.bithumb.com/public/ticker/ALL',
            ticker: 'https://api.bithumb.com/public/ticker/'
        },
        coinone: {
            name: '코인원',
            markets: 'https://api.coinone.co.kr/public/v2/ticker_new/KRW',
            ticker: 'https://api.coinone.co.kr/public/v2/ticker_new/KRW/'
        },
        gopax: {
            name: '고팍스',
            markets: 'https://api.gopax.co.kr/trading-pairs',
            ticker: 'https://api.gopax.co.kr/trading-pairs/'
        },
        
        // 해외 거래소
        binance: {
            name: '바이낸스',
            ticker: 'https://api.binance.com/api/v3/ticker/price'
        },
        binance_futures: {
            name: '바이낸스선물',
            ticker: 'https://fapi.binance.com/fapi/v1/ticker/price'
        },
        okx: {
            name: 'OKX',
            ticker: 'https://www.okx.com/api/v5/market/tickers?instType=SPOT'
        },
        okx_futures: {
            name: 'OKX선물',
            ticker: 'https://www.okx.com/api/v5/market/tickers?instType=FUTURES'
        },
        bybit: {
            name: '바이빗',
            ticker: 'https://api.bybit.com/v5/market/tickers?category=spot'
        },
        bybit_futures: {
            name: '바이빗선물',
            ticker: 'https://api.bybit.com/v5/market/tickers?category=linear'
        },
        bitget: {
            name: '비트겟',
            ticker: 'https://api.bitget.com/api/v2/spot/market/tickers'
        },
        bitget_futures: {
            name: '비트겟선물',
            ticker: 'https://api.bitget.com/api/v2/mix/market/tickers'
        },
        gate: {
            name: '게이트',
            ticker: 'https://api.gateio.ws/api/v4/spot/tickers'
        },
        gate_futures: {
            name: '게이트선물',
            ticker: 'https://api.gateio.ws/api/v4/futures/usdt/tickers'
        }
    };
    
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
    domesticExchange.addEventListener('change', function() {
        selectedDomestic = this.value;
        updateData();
    });
    
    foreignExchange.addEventListener('change', function() {
        selectedForeign = this.value;
        updateData();
    });
    
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
            // 국내 거래소 데이터 가져오기
            const domesticData = await fetchDomesticData();
            
            // 해외 거래소 데이터 가져오기
            const foreignData = await fetchForeignData();
            
            // 데이터 처리
            processMarketData(domesticData, foreignData);
            
            // 마지막 업데이트 시간 표시
            const now = new Date();
            lastUpdate.textContent = `마지막 업데이트: ${now.toLocaleTimeString('ko-KR')}`;
            
        } catch (error) {
            console.error('데이터 업데이트 오류:', error);
            showError('데이터를 불러오는 중 오류가 발생했습니다.');
        }
    }
    
    // 국내 거래소 데이터 가져오기
    async function fetchDomesticData() {
        const exchange = exchangeAPIs[selectedDomestic];
        
        switch(selectedDomestic) {
            case 'upbit':
                return await fetchUpbitData();
            case 'bithumb':
                return await fetchBithumbData();
            case 'coinone':
                return await fetchCoinoneData();
            case 'gopax':
                return await fetchGopaxData();
            default:
                return await fetchUpbitData();
        }
    }
    
    // 업비트 데이터 (CORS 프록시 사용)
    async function fetchUpbitData() {
        try {
            // CORS 프록시를 통한 업비트 API 호출
            const proxyUrl = 'https://corsproxy.io/?';
            const marketsUrl = proxyUrl + encodeURIComponent('https://api.upbit.com/v1/market/all');
            
            const marketsResponse = await fetch(marketsUrl);
            const allMarkets = await marketsResponse.json();
            
            // KRW 마켓만 필터링
            const krwMarkets = allMarkets.filter(market => market.market.includes('KRW-'));
            
            // 50개씩 나눠서 API 호출 (프록시 제한 고려)
            const batchSize = 50;
            const batches = [];
            
            for (let i = 0; i < krwMarkets.length; i += batchSize) {
                const batch = krwMarkets.slice(i, i + batchSize);
                const marketCodes = batch.map(m => m.market).join(',');
                batches.push(marketCodes);
            }
            
            // 모든 배치 데이터 가져오기
            const allTickers = [];
            
            for (const marketCodes of batches) {
                const tickerUrl = proxyUrl + encodeURIComponent(`https://api.upbit.com/v1/ticker?markets=${marketCodes}`);
                const tickerResponse = await fetch(tickerUrl);
                const tickers = await tickerResponse.json();
                allTickers.push(...tickers);
                
                // API 호출 간격 (프록시 제한 방지)
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            // 마켓 정보와 티커 정보 매칭
            return allTickers.map(ticker => {
                const marketInfo = allMarkets.find(m => m.market === ticker.market);
                return {
                    symbol: ticker.market.replace('KRW-', ''),
                    korean_name: marketInfo?.korean_name || ticker.market.replace('KRW-', ''),
                    name: ticker.market,
                    price: ticker.trade_price,
                    change: (ticker.signed_change_rate || 0) * 100,
                    volume: ticker.acc_trade_price_24h,
                    high: ticker.high_price,
                    low: ticker.low_price
                };
            });
        } catch (error) {
            console.error('업비트 API 오류:', error);
            // 빗썸 API로 폴백
            return await fetchBithumbData();
        }
    }
    
    // 빗썸 데이터 (시뮬레이션)
    async function fetchBithumbData() {
        try {
            const response = await fetch('https://api.bithumb.com/public/ticker/ALL');
            const data = await response.json();
            
            const tickers = [];
            for (const [symbol, info] of Object.entries(data.data)) {
                if (symbol !== 'date') {
                    tickers.push({
                        symbol: symbol,
                        name: symbol,
                        price: parseFloat(info.closing_price),
                        change: parseFloat(info.fluctate_rate_24H),
                        volume: parseFloat(info.acc_trade_value_24H),
                        high: parseFloat(info.max_price),
                        low: parseFloat(info.min_price)
                    });
                }
            }
            
            return tickers;
        } catch (error) {
            console.error('빗썸 API 오류:', error);
            return [];
        }
    }
    
    // 코인원 데이터 (시뮬레이션)
    async function fetchCoinoneData() {
        try {
            const response = await fetch('https://api.coinone.co.kr/public/v2/ticker_new/KRW');
            const data = await response.json();
            
            return data.tickers.map(ticker => ({
                symbol: ticker.target_currency,
                name: ticker.target_currency,
                price: parseFloat(ticker.last),
                change: parseFloat(ticker.yesterday_diff),
                volume: parseFloat(ticker.volume),
                high: parseFloat(ticker.high),
                low: parseFloat(ticker.low)
            }));
        } catch (error) {
            console.error('코인원 API 오류:', error);
            return [];
        }
    }
    
    // 고팍스 데이터 (시뮬레이션)
    async function fetchGopaxData() {
        try {
            const response = await fetch('https://api.gopax.co.kr/trading-pairs');
            const pairs = await response.json();
            
            const tickers = [];
            for (const pair of pairs) {
                if (pair.quoteAsset === 'KRW') {
                    const tickerResponse = await fetch(`https://api.gopax.co.kr/trading-pairs/${pair.name}/ticker`);
                    const ticker = await tickerResponse.json();
                    
                    tickers.push({
                        symbol: pair.baseAsset,
                        name: pair.name,
                        price: parseFloat(ticker.price),
                        change: 0, // API에 변동률 정보 없음
                        volume: parseFloat(ticker.volume),
                        high: parseFloat(ticker.high),
                        low: parseFloat(ticker.low)
                    });
                }
            }
            
            return tickers;
        } catch (error) {
            console.error('고팍스 API 오류:', error);
            return [];
        }
    }
    
    // 해외 거래소 데이터 가져오기
    async function fetchForeignData() {
        const exchange = exchangeAPIs[selectedForeign];
        
        try {
            const response = await fetch(exchange.ticker);
            const data = await response.json();
            
            // 각 거래소별 데이터 파싱
            switch(selectedForeign) {
                case 'binance':
                case 'binance_futures':
                    return data.map(item => ({
                        symbol: item.symbol,
                        price: parseFloat(item.price)
                    }));
                case 'okx':
                case 'okx_futures':
                    return data.data.map(item => ({
                        symbol: item.instId,
                        price: parseFloat(item.last)
                    }));
                case 'bybit':
                case 'bybit_futures':
                    return data.result.list.map(item => ({
                        symbol: item.symbol,
                        price: parseFloat(item.lastPrice)
                    }));
                case 'bitget':
                case 'bitget_futures':
                    return data.data.map(item => ({
                        symbol: item.symbol,
                        price: parseFloat(item.last)
                    }));
                case 'gate':
                case 'gate_futures':
                    return data.map(item => ({
                        symbol: item.currency_pair,
                        price: parseFloat(item.last)
                    }));
                default:
                    return [];
            }
        } catch (error) {
            console.error(`${exchange.name} API 오류:`, error);
            return [];
        }
    }
    
    // 마켓 데이터 처리
    function processMarketData(domesticData, foreignData) {
        // 해외 거래소 데이터를 심볼별로 매핑
        const foreignPriceMap = {};
        foreignData.forEach(item => {
            const symbol = item.symbol.replace('USDT', '').replace('KRW', '');
            foreignPriceMap[symbol] = item.price;
        });
        
        // 김치프리미엄 계산
        marketData = domesticData.map(item => {
            const foreignPrice = foreignPriceMap[item.symbol] || 1300; // 기본값
            const kimp = calculateKimp(item.price, foreignPrice);
            
            return {
                name: item.symbol,
                symbol: item.symbol,
                price: item.price,
                kimp: kimp,
                change: item.change,
                volume: item.volume,
                high: item.high,
                low: item.low
            };
        });
        
        // 김프 평균 계산 (상단 표시용)
        if (marketData.length > 0) {
            const avgKimp = marketData.reduce((sum, item) => sum + item.kimp, 0) / marketData.length;
            currentKimp.textContent = `${avgKimp.toFixed(2)}%`;
            
            // 김프 변화 계산 (시뮬레이션)
            const kimpChange = (Math.random() - 0.5) * 0.5;
            const changeType = kimpChange >= 0 ? 'positive' : 'negative';
            const changeText = kimpChange >= 0 ? `+${kimpChange.toFixed(2)}%` : `${kimpChange.toFixed(2)}%`;
            
            priceChange.textContent = changeText;
            priceChange.className = `price-change ${changeType}`;
        }
        
        // 데이터 정렬 및 테이블 업데이트
        sortData();
        updateTable();
    }
    
    // 김치프리미엄 계산
    function calculateKimp(domesticPrice, foreignPrice) {
        if (!foreignPrice || foreignPrice === 0) return 0;
        
        // 환율 고려 (1 USDT = 1300원 가정)
        const exchangeRate = 1300;
        const kimp = ((domesticPrice / (foreignPrice * exchangeRate)) - 1) * 100;
        
        return Math.max(-10, Math.min(30, kimp)); // -10%~30% 사이로 제한
    }
    
    // 테이블 업데이트
    function updateTable() {
        if (marketData.length === 0) {
            dataTableBody.innerHTML = `
                <tr class="loading-row">
                    <td colspan="5">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                            ${exchangeAPIs[selectedDomestic].name}에서 데이터를 불러오는 중...
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        
        marketData.forEach((item, index) => {
            const changeClass = item.change >= 0 ? 'positive' : 'negative';
            const changeSign = item.change >= 0 ? '+' : '';
            const kimpClass = item.kimp >= 0 ? 'positive' : 'negative';
            const kimpSign = item.kimp >= 0 ? '+' : '';
            
            // 한글명 가져오기 (업비트 API에서 제공하는 korean_name 사용)
            const koreanName = item.korean_name || item.symbol;
            
            // 해외 가격 계산 (시뮬레이션: KRW/USD 환율 1300 기준)
            const usdPrice = (item.price / 1300).toFixed(2);
            
            // 해외 변동률 (시뮬레이션: 국내 변동률과 약간 다르게)
            const usdChange = item.change + (Math.random() * 2 - 1);
            const usdChangeClass = usdChange >= 0 ? 'positive' : 'negative';
            const usdChangeSign = usdChange >= 0 ? '+' : '';
            
            // 거래대금 단위 변환 (억 단위)
            const volumeInBillions = Math.round(item.volume / 1000000000);
            
            // 국내 거래소 행
            html += `
                <tr data-index="${index}" class="coin-row domestic-row">
                    <td>
                        <div class="coin-name">${koreanName}</div>
                    </td>
                    <td>
                        <div class="price-krw">${item.price.toLocaleString()}</div>
                    </td>
                    <td>
                        <div class="kimp-value ${kimpClass}">${kimpSign}${item.kimp.toFixed(2)}%</div>
                    </td>
                    <td>
                        <div class="change-value ${changeClass}">${changeSign}${item.change.toFixed(2)}%</div>
                    </td>
                    <td>
                        <div class="volume-krw">${volumeInBillions.toLocaleString()}<span class="volume-unit">억</span></div>
                    </td>
                </tr>
            `;
            
            // 해외 거래소 행
            html += `
                <tr data-index="${index}" class="coin-row international-row">
                    <td>
                        <div class="coin-symbol">${item.symbol}</div>
                    </td>
                    <td>
                        <div class="price-usd">$${usdPrice}</div>
                    </td>
                    <td>
                        <div class="kimp-value">-</div>
                    </td>
                    <td>
                        <div class="change-value ${usdChangeClass}">${usdChangeSign}${usdChange.toFixed(2)}%</div>
                    </td>
                    <td>
                        <div class="volume-krw">-</div>
                    </td>
                </tr>
            `;
        });
        
        dataTableBody.innerHTML = html;
        
        // 종목 클릭 이벤트 추가 (국내 행만 클릭 가능)
        document.querySelectorAll('.domestic-row').forEach(row => {
            row.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const coinData = marketData[index];
                showCoinModal(coinData);
            });
        });
    }
    
    // 모달 관련 변수
    const coinModal = document.getElementById('coinModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalCloseBtn2 = document.getElementById('modalCloseBtn');
    
    // 모달 닫기 이벤트
    modalCloseBtn.addEventListener('click', closeModal);
    modalCloseBtn2.addEventListener('click', closeModal);
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        if (event.target === coinModal) {
            closeModal();
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && coinModal.style.display === 'block') {
            closeModal();
        }
    });
    
    // 모달 열기
    function showCoinModal(coinData) {
        // 모달 데이터 업데이트
        document.getElementById('modalCoinName').textContent = coinData.name;
        document.getElementById('modalCurrentPrice').textContent = `₩${coinData.price.toLocaleString()}`;
        document.getElementById('modalKimp').textContent = `${coinData.kimp >= 0 ? '+' : ''}${coinData.kimp.toFixed(2)}%`;
        document.getElementById('modalKimp').className = coinData.kimp >= 0 ? 'info-value positive' : 'info-value negative';
        document.getElementById('modal24hChange').textContent = `${coinData.change >= 0 ? '+' : ''}${coinData.change.toFixed(2)}%`;
        document.getElementById('modal24hChange').className = coinData.change >= 0 ? 'info-value positive' : 'info-value negative';
        document.getElementById('modalVolume').textContent = `₩${Math.round(coinData.volume / 1000000).toLocaleString()}백만`;
        
        // 입출금 정보 설정 (시뮬레이션)
        const networks = {
            'BTC': 'Bitcoin (BTC)',
            'ETH': 'Ethereum (ERC20)',
            'XRP': 'Ripple (XRP)',
            'ADA': 'Cardano (ADA)',
            'DOGE': 'Dogecoin (DOGE)',
            'SOL': 'Solana (SOL)',
            'DOT': 'Polkadot (DOT)',
            'AVAX': 'Avalanche (AVAX)',
            'MATIC': 'Polygon (MATIC)',
            'SHIB': 'Shiba Inu (ERC20)'
        };
        
        const coinSymbol = coinData.name;
        const network = networks[coinSymbol] || `${coinSymbol} 네트워크`;
        
        document.getElementById('modalNetwork').textContent = network;
        document.getElementById('modalMinDeposit').textContent = `0.0001 ${coinSymbol}`;
        document.getElementById('modalWithdrawFee').textContent = `0.0005 ${coinSymbol}`;
        document.getElementById('modalWithdrawLimit').textContent = `10 ${coinSymbol}/일`;
        
        // 입출금 상태 (랜덤)
        const depositStatus = Math.random() > 0.1 ? '가능' : '점검 중';
        const withdrawStatus = Math.random() > 0.05 ? '가능' : '점검 중';
        
        const depositElem = document.getElementById('modalDepositStatus');
        const withdrawElem = document.getElementById('modalWithdrawStatus');
        
        depositElem.textContent = depositStatus;
        depositElem.className = depositStatus === '가능' ? 'deposit-value status-active' : 'deposit-value status-inactive';
        
        withdrawElem.textContent = withdrawStatus;
        withdrawElem.className = withdrawStatus === '가능' ? 'deposit-value status-active' : 'deposit-value status-inactive';
        
        // 차트 생성 (시뮬레이션)
        createCharts(coinData);
        
        // 모달 표시
        coinModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // 차트 생성 (시뮬레이션)
    function createCharts(coinData) {
        const chart1 = document.getElementById('chart1');
        const chart2 = document.getElementById('chart2');
        
        // 차트 로딩 표시 제거
        chart1.innerHTML = '<div class="chart-simulated">차트 시뮬레이션 (실제 트레이딩뷰 차트 연동 가능)</div>';
        chart2.innerHTML = '<div class="chart-simulated">차트 시뮬레이션 (실제 트레이딩뷰 차트 연동 가능)</div>';
        
        // 실제 트레이딩뷰 차트 연동 예시 (주석 처리)
        /*
        new TradingView.widget({
            "container_id": "chart1",
            "width": "100%",
            "height": "250",
            "symbol": `${coinData.name}KRW`,
            "interval": "D",
            "timezone": "Asia/Seoul",
            "theme": "dark",
            "style": "1",
            "locale": "kr"
        });
        
        new TradingView.widget({
            "container_id": "chart2",
            "width": "100%",
            "height": "250",
            "symbol": `${coinData.name}USDT`,
            "interval": "60",
            "timezone": "Asia/Seoul",
            "theme": "dark",
            "style": "1",
            "locale": "kr"
        });
        */
    }
    
    // 모달 닫기
    function closeModal() {
        coinModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // 거래하기 버튼 이벤트
    document.getElementById('modalTradeBtn').addEventListener('click', function() {
        const coinName = document.getElementById('modalCoinName').textContent;
        alert(`${coinName} 거래 페이지로 이동합니다.`);
        // 실제 구현시: window.open(`https://upbit.com/exchange?code=CRIX.UPBIT.KRW-${coinName}`);
    });
    
    // 에러 표시
    function showError(message) {
        dataTableBody.innerHTML = `
            <tr class="error-row">
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--negative-color);">
                    <i class="fas fa-exclamation-triangle"></i><br>
                    ${message}<br>
                    <small>잠시 후 다시 시도해주세요.</small>
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
    
    console.log('김치짱 웹사이트 로드 완료');
    console.log('거래소 API 연동:', selectedDomestic, selectedForeign);
    console.log(`업데이트 주기: ${updateInterval}ms`);
});